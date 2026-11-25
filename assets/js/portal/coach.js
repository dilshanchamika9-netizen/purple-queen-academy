import { initBuilder } from './taskbuilder.js';
import { initFees } from './coach-fees.js';
import { app, auth, db, F, EMU, whoAmI, logout, esc, idToEmail, markSignedIn, fmtTime, today } from './fb.js';
import { PZ_LEVELS, MODS, LESSONS, PASS, lessonName, assignStat, itemLabel, secsInLastDays, dayBars, dueText, statePill, toCsv, download, lessonTable, lessonSecs, lessonAtt, attStat, attTable, attLabel, waLink, mailLink } from './lms.js';
const $ = (s) => document.querySelector(s);
const root = $('#portalCoach');
const LEVELS = { 1: 'L1 · Pawn', 2: 'L2 · Knight', 3: 'L3 · Queen' };
const words = ['queen', 'rook', 'knight', 'bishop', 'pawn', 'castle', 'check', 'board'];
const tempPw = () => words[Math.floor(Math.random() * words.length)] + '-' + (1000 + Math.floor(Math.random() * 9000));
let cprof = {}, monthInv = {}, feesApi = null, tab = 'students', custom = [], sessions = [], students = [], progress = {}, times = {}, assigns = [], statuses = {}, queue = [], coach = null, openUid = null;

(async () => {
  const me = await whoAmI();
  if (!me) return (location.href = 'login.html?as=coach');
  if (me.role !== 'coach') return (location.href = me.role === 'student' ? 'account.html' : me.role === 'parent' ? 'parent.html' : 'login.html?as=coach');
  coach = me; markSignedIn(true, 'coach'); document.body.classList.add('pq-coach');
  try { const c = await F.getDoc(F.doc(db, 'coachProfiles', me.user.email.toLowerCase())); if (c.exists()) cprof = c.data() } catch {}
  render(); mountCoachMenu(); await load();
  feesApi = initFees({ box: $('#feesBox'), getStudents: () => students, coach, queueEmail });
  initOnline();
  F.onSnapshot(F.query(F.collection(db, 'adminQueue'), F.orderBy('createdAt', 'desc'), F.limit(20)), s => { queue = s.docs.map(d => ({ id: d.id, ...d.data() })); paintQueue() }, () => {});
})();

/* ---------- online now (students send a heartbeat every minute while a page is open) ---------- */
let live = [];
function initOnline() {
  const tab = $('#onlTab');
  const back = document.createElement('div'); back.className = 'onl-back';
  const pane = document.createElement('aside'); pane.className = 'onl'; pane.id = 'onl'; pane.setAttribute('aria-label', 'Students online');
  pane.innerHTML = '<div class="onl-h"><h3><i class="onl-dot on"></i>Online now</h3><button type="button" aria-label="Close">×</button></div><div id="onlBody" style="overflow:auto"></div>';
  document.body.append(back, pane);
  const open = (v) => { pane.classList.toggle('open', v); back.classList.toggle('open', v) };
  tab.onclick = () => open(true); document.addEventListener('keydown', (e) => { if (e.key === 'Escape') open(false) }); back.onclick = () => open(false); pane.querySelector('.onl-h button').onclick = () => open(false);
  pane.addEventListener('click', (e) => { const li = e.target.closest('li[data-uid]'); if (li) { open(false); showTab('students'); showDetail(li.dataset.uid) } });
  F.onSnapshot(F.query(F.collection(db, 'users'), F.where('role', '==', 'student')), s => { live = s.docs.map(d => ({ uid: d.id, ...d.data() })); live.forEach(l => { const st = students.find(x => x.uid === l.uid); if (st) { st.lastSeen = l.lastSeen; st.onPage = l.onPage } }); paintOnline(); paintTable() }, () => {});
  setInterval(() => { paintOnline(); paintTable() }, 60000);
}
function paintOnline() {
  const tab = $('#onlTab'), body = $('#onlBody'); if (!tab || !body) return;
  const now = Date.now(), ms = (s) => (s.lastSeen && s.lastSeen.toMillis ? s.lastSeen.toMillis() : 0);
  const on = live.filter(s => now - ms(s) < 3 * 60e3).sort((a, b) => ms(b) - ms(a));
  const today0 = new Date(); today0.setHours(0, 0, 0, 0);
  const earlier = live.filter(s => !on.includes(s) && ms(s) >= today0.getTime()).sort((a, b) => ms(b) - ms(a));
  const ini = (n) => esc((n || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase());
  tab.querySelector('b').textContent = on.length; tab.classList.toggle('live', on.length > 0);
  $('#onlMini').innerHTML = on.slice(0, 5).map(s => `<span>${ini(s.name)}</span>`).join('');
  const mins = (s) => { const m = Math.round((now - ms(s)) / 60e3); return m < 1 ? 'now' : m < 60 ? m + ' min ago' : Math.round(m / 60) + ' h ago' };
  const row = (s, cls) => `<li class="${cls}" data-uid="${s.uid}" style="cursor:pointer"><span class="ini">${ini(s.name)}</span><div><b>${esc(s.name || s.sid)}</b><small>${cls === 'on' ? esc(s.onPage || 'Online') : s.onPage ? 'Was on: ' + esc(s.onPage) : 'Signed in today'}</small></div><em>${mins(s)}</em></li>`;
  body.innerHTML = (on.length ? `<ul class="onl-list">${on.map(s => row(s, 'on')).join('')}</ul>` : '<p class="onl-empty">No student is online right now.</p>')
    + (earlier.length ? `<p class="onl-sub">Earlier today</p><ul class="onl-list">${earlier.map(s => row(s, 'off')).join('')}</ul>` : '');
}

function render() {
  root.innerHTML = `
  <div class="cp-head" data-tab="students"><div><h1>Students</h1><p id="stuSub">Loading…</p></div><div class="cp-hb"><button type="button" class="sp-btn" id="csvBtn">Download CSV</button><button type="button" class="sp-btn p" id="addToggle">＋ Add student</button></div></div>
  <div class="cp-head" data-tab="homework"><div><h1>Homework</h1><p>Give lessons or puzzles, and see who has finished.</p></div></div>
  <div class="cp-head" data-tab="attendance"><div><h1>Attendance</h1><p>Mark each class: present, late or absent.</p></div></div>
  <div class="cp-head" data-tab="fees"><div><h1>Fees</h1><p>Monthly fees are created on the 1st. Tick “Received” on each student card; special charges and part payments are here.</p></div></div>
  <div class="cp-head" data-tab="profile"><div><h1>My profile</h1><p>Your coach card. The sign-in email cannot be changed here.</p></div></div>
  <div class="cp-stats" id="cStats" data-tab="students"></div>
  <form class="acc-card" id="atForm" data-tab="attendance"><h3>Attendance</h3>
    <div class="row2"><label for="atDate">Class date<input id="atDate" type="date" required></label>
      <label for="atBatch">Class (batch)<select id="atBatch"></select></label></div>
    <div id="atList" class="atlist"></div>
    <label class="chk" for="atMail"><input type="checkbox" id="atMail"> Email the parents of absent students</label>
    <div class="tools"><button type="button" class="btn btn-ghost btn-sm" id="atAll">Mark everyone present</button><button class="btn btn-primary btn-sm" type="submit">Save attendance</button></div><p class="pmsg2" id="atMsg"></p><div id="atWa" class="tblist"></div></form>
  <form class="hwlay" id="hwForm" data-tab="homework">
    <div class="acc-card hwmain"><h3>Assign homework</h3>
      <div class="hws"><span class="hwn">1</span><div class="hwb"><p class="hwt">Who gets it?</p>
        <div class="chipseg" id="hWhoSeg">${[['all', 'All students'], ['level', 'One level'], ['batch', 'One batch'], ['pick', 'Choose students']].map(([v, x], i) => `<button type="button" data-w="${v}" aria-pressed="${i ? 'false' : 'true'}">${x}</button>`).join('')}</div>
        <select id="hWho" class="sr" tabindex="-1" aria-hidden="true"><option value="all">All students</option><option value="level">One level</option><option value="batch">One batch</option><option value="pick">Chosen students</option></select>
        <label for="hWhoVal" id="hWhoWrap" hidden><span id="hWhoLab" class="sr">Level</span><select id="hWhoVal"></select></label>
        <div class="pickbox" id="hPick" hidden></div></div></div>
      <div class="hws"><span class="hwn">2</span><div class="hwb"><p class="hwt">What do you want to give?</p>
        <div class="modepick" id="hMode" role="group" aria-label="Homework type"><button type="button" data-mode="lessons" aria-pressed="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/><path d="M8 7h7"/></svg><span><b>Lessons</b><small>Next lessons in order</small></span></button><button type="button" data-mode="puzzles" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M10 3h4v3a2 2 0 1 0 4 0h3v5h-3a2 2 0 1 0 0 4h3v5H3v-5h3a2 2 0 1 0 0-4H3V3z"/></svg><span><b>Puzzles</b><small>New puzzles by level</small></span></button></div>
        <div id="hModeL"><p class="hint">Only the next lessons each student has not passed (pass mark ${PASS}%). Later lessons stay locked.</p><div class="lesspick" id="hLessons"></div></div>
        <div id="hModeP" hidden><p class="hint">Choose how many from each level. They are picked at random, and a student never gets a puzzle she already solved or was given.</p>
          <div class="pzpick" id="hPz">${[1, 2, 3, 4, 5].map(l => `<div class="pzrow"><span>${PZ_LEVELS[l]}</span><div class="stepper"><button type="button" data-d="-1" data-l="${l}" aria-label="Fewer">−</button><input type="number" min="0" max="50" value="0" inputmode="numeric" data-pz="${l}" aria-label="${PZ_LEVELS[l]} puzzles"><button type="button" data-d="1" data-l="${l}" aria-label="More">+</button></div></div>`).join('')}</div>
          <p class="pztot" id="hPzTot">0 puzzles in total</p></div></div></div>
    </div>
    <aside class="acc-card hwside"><h3>Check and send</h3>
      <div class="hwsum" id="hSum"></div>
      <label for="hTitle">Title<input id="hTitle" required value="${esc(defTitle())}"></label>
      <label for="hDue">Finish by<input id="hDue" type="date" required></label>
      <label for="hNote">Note for the student<textarea id="hNote" rows="2">Please complete this before the next class.</textarea></label>
      <label class="chk" for="hMail"><input type="checkbox" id="hMail"> Email the parents (only those with an email saved)</label>
      <details class="more" id="hMore"><summary>More options: board task, written task</summary>
        <p class="lab">Board tasks you made</p><div id="tbList" class="tblist"><span class="muted small">None yet.</span></div>
        <details class="tbd" id="tbDet"><summary>＋ Make a board task</summary><div id="tbBox"></div></details>
        <label for="hText">Written tasks, one per line<textarea id="hText" rows="3" placeholder="e.g. Play 2 games with a friend and write the moves"></textarea></label></details>
      <button class="btn btn-primary hwgo" type="submit">Assign homework</button><p class="pmsg2" id="hMsg"></p><div class="chips" id="hSend"></div>
    </aside>
  </form>
  <section class="acc-card" id="hwList" data-tab="homework"><h3>Homework given</h3><p class="muted">Loading…</p></section>
  <div data-tab="students">
    <details class="addpanel acc-card" id="addDet"><summary class="sr">Add a student</summary><div class="addin"><p class="addt">New student</p><form id="addForm">
      <label for="aName">Full name<input id="aName" required placeholder="e.g. Kavindu Perera"></label>
      <div class="row2"><label for="aLevel">Level<select id="aLevel"><option value="1">Level 1 · Basic</option><option value="2">Level 2 · Intermediate</option><option value="3">Level 3 · Advanced</option></select></label>
      <label for="aBatch">Batch<input id="aBatch" placeholder="e.g. Saturday 8:30 AM"></label></div>
      <div class="row2"><label for="aPPhone">Parent WhatsApp number (optional)<input id="aPPhone" type="tel" placeholder="e.g. 077 123 4567"></label>
      <label for="aPEmail">Parent email (optional)<input id="aPEmail" type="email" placeholder="e.g. parent@gmail.com"></label></div>
      <label for="aFee">Monthly fee, LKR (optional)<input id="aFee" type="number" min="0" step="1" placeholder="e.g. 3500"></label>
      <label class="chk" for="aParent"><input type="checkbox" id="aParent" checked> Also create a parent login (read-only view of this student)</label>
      <button class="btn btn-primary btn-sm" type="submit">Create login</button>
      <div class="newacc" id="newAcc" hidden></div><p class="pmsg2" id="aMsg"></p></form></div></details>
    <details class="reqline" id="reqDet"><summary><span class="dot"></span>Requests: password resets and removals</summary><div><p class="muted">Password resets and removals are done automatically within about 10–15 minutes.</p><ul class="queue" id="queue"><li class="muted">No requests yet.</li></ul></div></details>
  </div>
  <section class="acc-card" id="detail" data-tab="students" hidden></section>
  <div class="cp-grid" id="stuTable" data-tab="students"><p class="muted">Loading…</p></div>
  <div id="feesBox" data-tab="fees"></div>
  <div id="cpProfile" data-tab="profile"></div>`;
  try { tab = sessionStorage.getItem('pq-ctab') || 'students' } catch {}
  $('#cTabs').onclick = (e) => { const b = e.target.closest('button[data-t]'); if (b) showTab(b.dataset.t) };
  paintProfile();
  showTab(tab);
  $('#addForm').onsubmit = addStudent;
  $('#hwForm').onsubmit = addHomework;
  $('#filter').oninput = paintTable;
  $('#csvBtn').onclick = exportCsv;
  $('#hDue').min = today(); $('#hDue').value = plusDays(7);
  const pzTot = () => { const n = $$('#hPz input[data-pz]').reduce((s, i) => s + Math.max(0, Math.min(50, +i.value || 0)), 0); $('#hPzTot').textContent = n + (n === 1 ? ' puzzle' : ' puzzles') + ' in total' };
  $('#hPz').addEventListener('click', (e) => { const b = e.target.closest('button[data-d]'); if (!b) return; const i = $('#hPz input[data-pz="' + b.dataset.l + '"]'); i.value = Math.max(0, Math.min(50, (+i.value || 0) + +b.dataset.d)); pzTot() });
  $('#hPz').addEventListener('input', pzTot);
  $('#hWho').onchange = paintWho;
  $('#hWhoSeg').onclick = (e) => { const b = e.target.closest('button[data-w]'); if (!b) return; $('#hWho').value = b.dataset.w; paintWho() };
  $('#addToggle').onclick = () => { const d = $('#addDet'); d.open = !d.open; if (d.open) $('#aName').focus() };
  ['input', 'change', 'click'].forEach(ev => $('#hwForm').addEventListener(ev, () => setTimeout(paintSum, 0)));
  let built = false; $('#tbDet').addEventListener('toggle', () => { if ($('#tbDet').open && !built) { built = true; initBuilder($('#tbBox'), (t) => { custom.push(t); paintCustom() }) } });
  $('#atForm').onsubmit = saveAtt; $('#atDate').value = today(); $('#atDate').max = today();
  $('#atDate').onchange = paintAtt; $('#atBatch').onchange = paintAtt;
  $('#atAll').onclick = () => $$('#atList input[value="p"]').forEach(r => r.checked = true);
  $('#hMode').onclick = (e) => { const b = e.target.closest('button[data-mode]'); if (b) setMode(b.dataset.mode) };
  $('#hWhoVal').onchange = paintLessons; $('#hPick').addEventListener('change', paintLessons);
}
const $$ = (s) => [...document.querySelectorAll(s)];
const defTitle = () => 'Homework · ' + new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
const plusDays = (n) => { const d = new Date(Date.now() + n * 864e5); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') };
let PUZZLES = null, PUBPZ = null;
async function loadAllPuzzles() { if (!PUBPZ) { try { PUBPZ = (await (await fetch('assets/data/puzzles.json')).json()).puzzles } catch { PUBPZ = [] } } let hw = []; try { hw = await loadPuzzles() } catch {} return PUBPZ.concat(hw) }
async function loadPuzzles() { if (!PUZZLES) { const r = await fetch('assets/data/hwpuzzles.json'); if (!r.ok) throw new Error('The homework puzzle pool is not built yet'); PUZZLES = (await r.json()).puzzles } return PUZZLES }
// puzzle ids already given to a student in any homework, plus ones already solved
const usedPuzzles = (uid) => { const u = new Set(Object.keys((((progress[uid] || {}).puzzles) || {}).solved || {})); assigns.forEach(a => (a.items || []).forEach(it => { if (it.t === 'puzzles' && it.sets && it.sets[uid]) it.sets[uid].forEach(id => u.add(id)) })); return u };
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a };
function showTab(t) {
  tab = t; try { sessionStorage.setItem('pq-ctab', t) } catch {}
  root.querySelectorAll('[data-tab]').forEach(e => e.classList.toggle('tab-off', e.dataset.tab !== t));
  document.querySelectorAll('#cTabs button[data-t]').forEach(b => b.setAttribute('aria-current', b.dataset.t === t ? 'page' : 'false'));
  const ff = document.querySelector('.cp-search'); if (ff) ff.hidden = t !== 'students';
}
async function queueEmail(m) { return F.addDoc(F.collection(db, 'outbox'), { to: m.to, subject: m.subject, text: m.text, kind: m.kind || 'note', status: 'pending', by: coach.user.email, createdAt: F.serverTimestamp() }) }
function paintCustom() {
  $('#tbList').innerHTML = custom.length ? custom.map((t, i) => `<span class="chip">${esc(t.q)} · ${t.kind === 'move' ? 'move' : 'square'} <button type="button" class="x" data-rm="${i}" aria-label="Remove this task">×</button></span>`).join(' ') : '<span class="muted small">None yet.</span>';
}
root.addEventListener('click', (e) => { const b = e.target.closest('button[data-rm]'); if (b) { custom.splice(+b.dataset.rm, 1); paintCustom() } });
const hMode = () => ($('#hMode button[aria-pressed="true"]') || {}).dataset?.mode || 'lessons';
function setMode(m) { $$('#hMode button').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === m ? 'true' : 'false')); $('#hModeL').hidden = m !== 'lessons'; $('#hModeP').hidden = m !== 'puzzles' }
function whoList() {
  const w = $('#hWho').value; let list = students, label = 'All students';
  if (w === 'level') { const v = +$('#hWhoVal').value; list = students.filter(s => +s.level === v); label = LEVELS[v] }
  if (w === 'batch') { const v = $('#hWhoVal').value; list = students.filter(s => s.batch === v); label = 'Batch: ' + v }
  if (w === 'pick') { const ids = $$('#hPick input:checked').map(c => c.value); list = students.filter(s => ids.includes(s.uid)); label = list.length === 1 ? list[0].name : list.length + ' students' }
  return { list, label };
}
// the next 3 lessons each chosen student has not passed and has not already been given in homework
function nextLessons(uid) {
  const L = (progress[uid] || {}).lessons || {}, given = new Set();
  assigns.forEach(a => { if ((a.uids || []).includes(uid)) (a.items || []).forEach(it => { if (it.t === 'lesson') given.add(it.id) }) });
  return LESSONS.filter(l => (L[l.id] || 0) < PASS && !given.has(l.id)).slice(0, 3).map(l => l.id);
}
function paintLessons() {
  const box = $('#hLessons'); if (!box) return;
  const keep = new Set($$('#hLessons input[data-les]:checked').map(c => c.dataset.les));
  const { list } = whoList(), count = {};
  list.forEach(s => nextLessons(s.uid).forEach(id => count[id] = (count[id] || 0) + 1));
  const ids = LESSONS.filter(l => count[l.id]);
  if (!list.length) { box.innerHTML = '<p class="muted small">No student matches this choice.</p>'; return }
  if (!ids.length) { box.innerHTML = '<p class="muted small">Every lesson is already passed or already given.</p>'; return }
  const byMod = {}; ids.forEach(l => (byMod[l.mod] = byMod[l.mod] || []).push(l));
  box.innerHTML = Object.keys(byMod).map(k => `<details open><summary><b>${PQ_MOD(MODS, +k).label}</b> ${esc(MODS[+k].title.en)}</summary>${byMod[k].map(l => `<label class="lp"><input type="checkbox" data-les="${l.id}" data-m="${k}"${keep.has(l.id) ? ' checked' : ''}> ${esc(l.title.en)}${list.length > 1 ? ` <small class="muted">for ${count[l.id]} of ${list.length} students</small>` : ''}</label>`).join('')}</details>`).join('');
}
function paintSum() {
  const s = $('#hSum'); if (!s) return; const { list, label } = whoList(), mode = hMode();
  const nL = $$('#hLessons input[data-les]:checked').length, nP = $$('#hPz input[data-pz]').reduce((a, i) => a + Math.max(0, Math.min(50, +i.value || 0)), 0);
  const nX = custom.length + ($('#hText').value.split('\n').filter(x => x.trim()).length);
  const what = mode === 'lessons' ? (nL ? nL + (nL > 1 ? ' lessons' : ' lesson') : 'No lesson chosen yet') : (nP ? nP + (nP > 1 ? ' puzzles' : ' puzzle') : 'No puzzles chosen yet');
  s.innerHTML = `<div><small>For</small><b>${esc(label)}</b><em>${list.length} student${list.length === 1 ? '' : 's'}</em></div><div><small>Giving</small><b>${what}</b>${nX ? `<em>+ ${nX} extra task${nX > 1 ? 's' : ''}</em>` : ''}</div>`;
}
function paintWho() {
  const w = $('#hWho').value, val = $('#hWhoVal');
  $$('#hWhoSeg button').forEach(b => b.setAttribute('aria-pressed', b.dataset.w === w ? 'true' : 'false'));
  $('#hWhoWrap').hidden = !(w === 'level' || w === 'batch'); $('#hPick').hidden = w !== 'pick';
  if (w === 'level') { $('#hWhoLab').textContent = 'Level'; val.innerHTML = [1, 2, 3].map(l => `<option value="${l}">${LEVELS[l]}</option>`).join('') }
  if (w === 'batch') { $('#hWhoLab').textContent = 'Batch'; const b = [...new Set(students.map(s => s.batch).filter(Boolean))]; val.innerHTML = b.length ? b.map(x => `<option>${esc(x)}</option>`).join('') : '<option value="">No batches yet</option>' }
  if (w === 'pick') $('#hPick').innerHTML = students.map(s => `<label><input type="checkbox" value="${s.uid}"> ${esc(s.sid)} ${esc(s.name)}</label>`).join('') || '<p class="muted">No students yet.</p>';
  paintLessons(); paintSum();
}

async function load() {
  const us = await F.getDocs(F.query(F.collection(db, 'users'), F.where('role', '==', 'student')));
  students = us.docs.map(d => ({ uid: d.id, ...d.data() })).sort((a, b) => (a.sid || '').localeCompare(b.sid || ''));
  const att = await F.getDocs(F.query(F.collection(db, 'attendance'), F.orderBy('date', 'desc'), F.limit(500)));
  sessions = att.docs.map(d => ({ id: d.id, ...d.data() }));
  const [ps, ts, as, ss] = await Promise.all([F.getDocs(F.collection(db, 'progress')), F.getDocs(F.collection(db, 'time')), F.getDocs(F.query(F.collection(db, 'assignments'), F.orderBy('createdAt', 'desc'), F.limit(60))), F.getDocs(F.collection(db, 'astatus'))]);
  progress = {}; ps.docs.forEach(d => progress[d.id] = d.data());
  times = {}; ts.docs.forEach(d => times[d.id] = d.data());
  assigns = as.docs.map(d => ({ id: d.id, ...d.data() }));
  statuses = {}; ss.docs.forEach(d => statuses[d.id] = d.data());
  await loadMonth();
  paintStats(); paintTable(); paintHw(); paintAtt(true); paintWho(); paintProfile();
}
const stat = (uid) => {
  const p = progress[uid] || {}, L = p.lessons || {};
  const vals = LESSONS.map(l => L[l.id]).filter(v => v != null);
  return { passed: LESSONS.filter(l => (L[l.id] || 0) >= PASS).length, avg: vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null, xp: p.xp || 0, puzzles: p.puzzles && p.puzzles.solved ? Object.keys(p.puzzles.solved).length : 0 };
};
/* ---------- monthly fees ---------- */
const ymNow = () => today().slice(0, 7);
const monthName = (ym) => new Date(ym + '-15T00:00:00').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
const shortMonth = (ym) => new Date(ym + '-15T00:00:00').toLocaleDateString('en-GB', { month: 'short' });
const money0 = (n) => 'LKR ' + Number(n || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
async function loadMonth() {
  monthInv = {};
  try { const q = await F.getDocs(F.query(F.collection(db, 'invoices'), F.where('month', '==', ymNow()))); q.docs.forEach(d => { const x = { id: d.id, ...d.data() }; if (x.month === ymNow()) monthInv[x.uid] = x }) } catch {}
  for (const s of students) await ensureMonth(s);
}
// this month's fee for a student with a monthly fee (the GitHub job makes the same one on the 1st; whichever runs first wins)
async function ensureMonth(s) {
  if (!(+s.monthlyFee > 0) || monthInv[s.uid] || (s.feeFrom && s.feeFrom > ymNow())) return;
  const ym = ymNow(), id = `m-${ym}-${s.uid}`, ref = F.doc(db, 'invoices', id);
  try {
    const ex = await F.getDoc(ref);
    if (ex.exists()) { monthInv[s.uid] = { id, ...ex.data() }; return }
    const due = ym + '-10' < today() && s.feeFrom === ym ? today() : ym + '-10';
    const data = { uid: s.uid, sid: s.sid || '', name: s.name || '', title: `${monthName(ym)} fee`, amount: +s.monthlyFee, currency: 'LKR', due, month: ym, monthly: true, paid: 0, open: true, payments: [], createdBy: coach.user.email, createdAt: F.serverTimestamp() };
    await F.setDoc(ref, data); monthInv[s.uid] = { id, ...data };
  } catch {}
}
const isOnline = (s) => s.lastSeen && s.lastSeen.toMillis && Date.now() - s.lastSeen.toMillis() < 3 * 60e3;
const ini = (n) => esc((n || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase());
const ring = (p, label, red) => `<span class="cp-ring${red ? ' red' : ''}" style="--p:${Math.max(0, Math.min(100, p))}"><span>${label}</span></span>`;
function paintStats() {
  const week = Date.now() - 7 * 864e5, n = students.length;
  const active = students.filter(s => s.lastSeen && s.lastSeen.toMillis && s.lastSeen.toMillis() > week).length;
  const open = assigns.filter(a => a.due >= today());
  let given = 0, fin = 0, late = 0; assigns.forEach(a => (a.uids || []).forEach(u => { if (!students.some(x => x.uid === u)) return; const st = assignStat(a, u, progress[u], statuses[a.id + '_' + u], times[u]); if (a.due >= today()) { given++; if (st.complete) fin++ } if (st.late) late++ }));
  const last = sessions[0], lm = last ? Object.values(last.marks || {}) : [], lp = lm.length ? Math.round(lm.filter(v => v !== 'a').length / lm.length * 100) : null;
  const fees = students.filter(s => +s.monthlyFee > 0), unpaid = fees.filter(s => { const i = monthInv[s.uid]; return i && i.open !== false && (i.amount - (i.paid || 0)) > 0.001 });
  const toGet = unpaid.reduce((a, s) => a + (monthInv[s.uid].amount - (monthInv[s.uid].paid || 0)), 0);
  $('#cStats').innerHTML = `<div class="cp-st">${ring(n ? active / n * 100 : 0, n ? Math.round(active / n * 100) + '%' : '0')}<div><b>${active} / ${n}</b><small>studied this week</small></div></div>
    <div class="cp-st">${ring(lp || 0, lp == null ? '—' : lp + '%')}<div><b>Attendance</b><small>${last ? 'last class, ' + new Date(last.date + 'T00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : 'no class marked yet'}</small></div></div>
    <div class="cp-st">${ring(given ? fin / given * 100 : 0, given ? fin + '/' + given : '0')}<div><b>${open.length} homework</b><small>open${late ? ' · ' + late + ' overdue' : ''}</small></div></div>
    <div class="cp-st">${ring(fees.length ? unpaid.length / fees.length * 100 : 0, String(unpaid.length), true)}<div><b>${shortMonth(ymNow())} fees due</b><small>${fees.length ? money0(toGet) + ' to collect' : 'no monthly fees set'}</small></div></div>`;
  const set = (id, v) => { const e = document.getElementById(id); if (e) { e.textContent = v; e.hidden = !v } };
  set('nStu', n || ''); set('nHw', open.length || ''); set('nFee', unpaid.length || ''); set('nAtt', '');
  const b = [...new Set(students.map(s => s.batch).filter(Boolean))].length;
  const sub = $('#stuSub'); if (sub) sub.textContent = `${n} student${n === 1 ? '' : 's'} · ${[...new Set(students.map(s => curLevel(s.uid).lv))].length} level${[...new Set(students.map(s => curLevel(s.uid).lv))].length === 1 ? '' : 's'} · ${b} batch${b === 1 ? '' : 'es'}`;
}
function ago(ts) { if (!ts || !ts.toMillis) return 'Never'; const d = (Date.now() - ts.toMillis()) / 864e5; return d < 1 ? 'Today' : d < 2 ? 'Yesterday' : Math.floor(d) + ' days ago' }
// the student's real place in the course (strict order): level of the first module not finished
function curLevel(uid) {
  const L = (progress[uid] || {}).lessons || {}, done = (k) => MODS[k].lessons.every(l => (L[l.id] || 0) >= PASS);
  const ck = MODS.findIndex((m, k) => !done(k)), lv = ck < 0 ? PQ_MOD(MODS, MODS.length - 1).lv : PQ_MOD(MODS, ck).lv;
  const idx = MODS.map((m, k) => k).filter(k => PQ_MOD(MODS, k).lv === lv);
  return { lv, ck, idx, done, tot: idx.reduce((a, k) => a + MODS[k].lessons.length, 0), dn: idx.reduce((a, k) => a + MODS[k].lessons.filter(l => (L[l.id] || 0) >= PASS).length, 0) };
}
function feeRow(s) {
  const fee = +s.monthlyFee || 0, i = monthInv[s.uid], m = shortMonth(ymNow());
  if (!fee) return `<div class="cp-fee none"><span>Monthly fee not set</span><span class="cp-fset"><input class="mf" type="number" min="0" step="1" placeholder="LKR" aria-label="Monthly fee for ${esc(s.name)}"><button type="button" class="mini" data-a="savefee">Set</button></span></div>`;
  if (!i) return `<div class="cp-fee"><span><b>${m} fee</b> · ${money0(fee)}</span><span class="muted small">starts next month</span></div>`;
  const bal = Math.round((i.amount - (i.paid || 0)) * 100) / 100, last = (i.payments || [])[(i.payments || []).length - 1];
  if (bal <= 0.001) return `<div class="cp-fee ok"><span><b>${m} fee</b> · ${money0(i.amount)}</span><span class="cp-got">✓ Received${last ? ' · ' + (last.method === 'bank' ? 'Bank' : last.method === 'cash' ? 'Cash' : 'Other') : ''}</span></div>`;
  const late = i.due < today();
  return `<div class="cp-fee${late ? ' late' : ''}"><span><b>${m} fee</b> · ${money0(bal)}${i.paid ? ' left' : ''}<small>${late ? 'overdue since ' : 'due '}${new Date(i.due + 'T00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</small></span>
    <span class="cp-recv"><select class="fm" aria-label="Paid by"><option value="cash">Cash</option><option value="bank">Bank</option></select><button type="button" class="cp-tick" data-a="recv">Received</button></span></div>`;
}
function card(s) {
  const c = curLevel(s.uid), a = attStat(sessions, s.uid), on = isOnline(s), i = monthInv[s.uid];
  const feeLate = i && i.due < today() && (i.amount - (i.paid || 0)) > 0.001, warn = (a.pct != null && a.pct < 70) || feeLate;
  return `<article class="cp-card${warn ? ' warn' : ''}" data-uid="${s.uid}">
    <div class="top"><span class="sp-av">${s.photo ? `<img src="${esc(s.photo)}" alt="">` : ini(s.name)}${on ? '<i class="dot" title="Online now"></i>' : ''}</span>
      <div class="who"><button type="button" class="linkbtn nm" data-a="report">${esc(s.name)}</button><small>${esc(s.sid)}${s.batch ? ' · ' + esc(s.batch) : ''}${s.mustChange ? ' · new password pending' : ''}</small></div><span class="lvp l${c.lv}">Level ${c.lv}</span></div>
    <div class="cp-rank" title="Level ${c.lv} modules">${c.idx.map(k => `<i class="${c.done(k) ? 'd' : k === c.ck ? 'a' : ''}" title="${esc(PQ_MOD(MODS, k).label)}"></i>`).join('')}</div>
    <div class="cp-kv"><div><b>${c.dn}/${c.tot}</b><small>lessons</small></div><div><b class="${a.pct != null && a.pct < 70 ? 'lo' : ''}">${a.pct == null ? '—' : a.pct + '%'}</b><small>attendance</small></div>
      <div>${on ? `<b class="on">Online</b><small>${esc(s.onPage || 'now')}</small>` : `<b>${ago(s.lastSeen)}</b><small>last active</small>`}</div></div>
    ${feeRow(s)}
    <div class="cp-ft acts"><button type="button" class="sp-btn" data-a="report">Report</button><button type="button" class="sp-btn" data-a="hw">Give homework</button>
      <details class="rowmenu cp-more"><summary class="mini" aria-label="More actions">•••</summary><div>
        <label>Level<select class="lv" aria-label="Level for ${esc(s.name)}">${[1, 2, 3].map(l => `<option value="${l}" ${+s.level === l ? 'selected' : ''}>${LEVELS[l]}</option>`).join('')}</select></label>
        <label>Batch<input class="bt" value="${esc(s.batch || '')}" aria-label="Batch for ${esc(s.name)}"></label>
        <label>Monthly fee (LKR)<span class="cp-fset"><input class="mf" type="number" min="0" step="1" value="${+s.monthlyFee || ''}" aria-label="Monthly fee for ${esc(s.name)}"><button type="button" class="mini" data-a="savefee">Save</button></span></label>
        <hr><button type="button" class="mini" data-a="reset">Reset password</button>${s.parentUid ? `<button type="button" class="mini" data-a="resetparent">Reset parent</button>` : `<button type="button" class="mini" data-a="addparent">Add parent login</button>`}<button type="button" class="mini danger" data-a="delete">Remove</button></div></details></div>
  </article>`;
}
function paintTable() {
  const box = $('#stuTable'); if (!box) return;
  const f = ($('#filter') && $('#filter').value || '').toLowerCase();
  const open = new Set([...box.querySelectorAll('details.cp-more[open]')].map(d => d.closest('[data-uid]').dataset.uid));
  const rows = students.filter(s => !f || [s.sid, s.name, s.batch].join(' ').toLowerCase().includes(f));
  box.innerHTML = rows.length ? rows.map(card).join('') : `<p class="cp-empty">${students.length ? 'No student matches the search.' : 'No students yet. Press “Add student” above.'}</p>`;
  open.forEach(u => { const d = box.querySelector(`[data-uid="${u}"] details.cp-more`); if (d) d.open = true });
}
root.addEventListener('change', async (e) => {
  const tr = e.target.closest('[data-uid]'); if (!tr || !tr.closest('#stuTable')) return;
  const uid = tr.dataset.uid, field = e.target.classList.contains('lv') ? 'level' : e.target.classList.contains('bt') ? 'batch' : null; if (!field) return;
  const v = field === 'level' ? +e.target.value : e.target.value.trim();
  try { await F.updateDoc(F.doc(db, 'users', uid), { [field]: v }); const s = students.find(x => x.uid === uid); s[field] = v; if (field === 'batch') paintAtt(true); e.target.classList.add('saved'); setTimeout(() => e.target.classList.remove('saved'), 900) } catch { alertRow(tr, 'Could not save. Try again.') }
});
root.addEventListener('click', async (e) => {
  const b = e.target.closest('button[data-a]'); if (!b) return; const tr = b.closest('[data-uid]'); if (!tr || !tr.closest('#stuTable')) return; const s = students.find(x => x.uid === tr.dataset.uid);
  const a = b.dataset.a;
  if (a === 'report') return showDetail(s.uid);
  if (a === 'hw') { showTab('homework'); $('#hWho').value = 'pick'; paintWho(); $$('#hPick input').forEach(c => { c.checked = c.value === s.uid }); paintLessons(); paintSum(); window.scrollTo({ top: 0, behavior: 'smooth' }); return }
  if (a === 'savefee') {
    const v = Math.max(0, Math.round(+b.parentElement.querySelector('.mf').value || 0)); b.disabled = true;
    try { const up = { monthlyFee: v }; if (v && !s.feeFrom) up.feeFrom = ymNow(); await F.updateDoc(F.doc(db, 'users', s.uid), up); Object.assign(s, up); await ensureMonth(s); paintTable(); paintStats(); if (feesApi) feesApi.reload() } catch (err) { b.disabled = false; alertRow(tr, 'Could not save the fee.') } return;
  }
  if (a === 'recv') {
    const i = monthInv[s.uid]; if (!i) return; b.disabled = true; b.textContent = 'Saving…';
    const bal = Math.round((i.amount - (i.paid || 0)) * 100) / 100, method = (tr.querySelector('select.fm') || {}).value || 'cash';
    const pay = { id: 'p' + Date.now().toString(36), amount: bal, method, ref: '', date: today(), by: coach.user.email };
    const payments = (i.payments || []).concat(pay), paid = Math.round(payments.reduce((n, p) => n + p.amount, 0) * 100) / 100;
    try { await F.updateDoc(F.doc(db, 'invoices', i.id), { payments, paid, open: false }); Object.assign(i, { payments, paid, open: false }); paintTable(); paintStats(); if (feesApi) feesApi.reload() } catch { b.disabled = false; b.textContent = 'Received'; alertRow(tr, 'Could not save. Try again.') } return;
  }
  if (a === 'addparent') { b.disabled = true; b.textContent = 'Creating…'; try { const c = await createParent(s); paintTable(); showCreds(s.name, s.sid, null, c) } catch (err) { b.disabled = false; b.textContent = 'Add parent login'; alertRow(tr, 'Could not create: ' + (err.code || err.message)) } return }
  if (a === 'delete' && b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Press again to remove'; setTimeout(() => { b.dataset.sure = ''; b.textContent = 'Remove' }, 4000); return }
  if (!['reset', 'resetparent', 'delete'].includes(a)) return;
  try {
    const parent = a === 'resetparent';
    await F.addDoc(F.collection(db, 'adminQueue'), { type: parent ? 'reset' : a, uid: parent ? s.parentUid : s.uid, sid: parent ? s.sid + '-P' : s.sid, name: parent ? 'Parent of ' + s.name : s.name, status: 'pending', by: coach.user.email, createdAt: F.serverTimestamp() });
    b.textContent = 'Requested'; b.disabled = true;
  } catch { alertRow(tr, 'Could not send the request.') }
});
function alertRow(tr, t) { (tr.querySelector('.acts') || tr).insertAdjacentHTML('beforeend', `<span class="tag err">${esc(t)}</span>`) }
function paintQueue() {
  $('#queue').innerHTML = queue.length ? queue.map(q => `<li class="${q.status}"><b>${q.type === 'reset' ? 'Password reset' : 'Remove'} · ${esc(q.sid)} ${esc(q.name || '')}</b>
    <span>${q.status === 'pending' ? 'Waiting…' : q.status === 'error' ? 'Failed: ' + esc(q.error) : q.type === 'reset' ? `New password: <code>${esc(q.tempPassword)}</code>` : 'Removed'}</span></li>`).join('') : '<li class="muted">No requests yet.</li>';
  if (queue.length && $('#reqDet')) $('#reqDet').open = true;
  if (queue.some(q => q.status === 'done' && q.type === 'delete')) { const gone = new Set(queue.filter(q => q.status === 'done' && q.type === 'delete').map(q => q.uid)); students = students.filter(s => !gone.has(s.uid)); paintTable(); paintStats() }
}

/* ---------- accounts ---------- */
async function makeLogin(sidOrPid, pw) {
  // create the login in a separate app instance so the coach stays signed in
  const second = F.initializeApp(app.options, 'creator-' + Date.now() + Math.random());
  const a2 = F.getAuth(second); await F.setPersistence(a2, F.inMemoryPersistence);
  if (EMU) F.connectAuthEmulator(a2, 'http://127.0.0.1:9099', { disableWarnings: true });
  try { const c = await F.createUserWithEmailAndPassword(a2, idToEmail(sidOrPid), pw); await F.signOut(a2); return c.user.uid }
  finally { try { await F.deleteApp(second) } catch {} }
}
async function createParent(s) {
  const pid = s.sid + '-P', pw = tempPw();
  const puid = await makeLogin(pid, pw);
  await F.setDoc(F.doc(db, 'users', puid), { role: 'parent', sid: pid, name: 'Parent of ' + s.name, childUid: s.uid, childSid: s.sid, childName: s.name, mustChange: true, createdAt: F.serverTimestamp(), createdBy: coach.user.email });
  await F.updateDoc(F.doc(db, 'users', s.uid), { parentUid: puid });
  s.parentUid = puid;
  return { pid, pw };
}
function showCreds(name, sid, pw, parent) {
  const box = $('#newAcc'); box.hidden = false;
  box.innerHTML = `<p>Give these to <b>${esc(name)}</b>${parent && pw ? ' and the parent' : parent ? '’s parent' : ''}. Everyone chooses a new password at first sign-in.</p>
    ${pw ? `<div class="cred"><span>Student ID</span><b id="nId">${esc(sid)}</b><span>Password</span><b id="nPw">${esc(pw)}</b></div>` : ''}
    ${parent ? `<div class="cred"><span>Parent ID</span><b id="nPId">${esc(parent.pid)}</b><span>Parent password</span><b id="nPPw">${esc(parent.pw)}</b></div>` : ''}
    <button type="button" class="btn btn-ghost btn-sm" id="cpy">Copy for WhatsApp</button>`;
  $('#cpy').onclick = async () => {
    const url = location.origin + location.pathname.replace(/coach\.html$/, 'login.html');
    let t = `Purple Queen Chess Academy\nSign in: ${url}\n`;
    if (pw) t += `Student ID: ${sid}\nPassword: ${pw}\n`;
    if (parent) t += `Parent ID: ${parent.pid}\nParent password: ${parent.pw}\n`;
    try { await navigator.clipboard.writeText(t.trim()); $('#cpy').textContent = 'Copied' } catch { $('#cpy').textContent = 'Select the text above' }
  };
  box.scrollIntoView({ block: 'nearest' });
}
async function addStudent(e) {
  e.preventDefault(); const m = $('#aMsg'); m.className = 'pmsg2'; m.textContent = 'Creating…';
  const fee = Math.max(0, Math.round(+$('#aFee').value || 0)), name = $('#aName').value.trim(), level = +$('#aLevel').value, batch = $('#aBatch').value.trim(), pPhone = $('#aPPhone').value.trim(), pEmail = $('#aPEmail').value.trim().toLowerCase(), wantParent = $('#aParent').checked;
  if (!name) { m.className = 'pmsg2 err'; m.textContent = 'Enter the student’s name.'; return }
  let sid;
  try {
    sid = await F.runTransaction(db, async (tx) => { const ref = F.doc(db, 'meta', 'counter'); const s = await tx.get(ref); const n = s.exists() ? s.data().next : 1; tx.set(ref, { next: n + 1 }); return 'PQ' + String(n).padStart(4, '0') });
  } catch (err) { m.className = 'pmsg2 err'; m.textContent = 'Could not get a new student ID: ' + (err.code || err.message); return }
  const pw = tempPw();
  try {
    const uid = await makeLogin(sid, pw);
    await F.setDoc(F.doc(db, 'users', uid), { role: 'student', sid, name, level, batch, ...(pPhone ? { parentPhone: pPhone } : {}), ...(pEmail ? { parentEmail: pEmail } : {}), ...(fee ? { monthlyFee: fee, feeFrom: ymNow() } : {}), mustChange: true, createdAt: F.serverTimestamp(), createdBy: coach.user.email });
    const s = { uid, role: 'student', sid, name, level, batch, parentPhone: pPhone, parentEmail: pEmail, ...(fee ? { monthlyFee: fee, feeFrom: ymNow() } : {}), mustChange: true }; students.push(s); await ensureMonth(s);
    let parent = null, perr = '';
    if (wantParent) { try { parent = await createParent(s) } catch (err) { perr = ' The parent login failed (' + (err.code || err.message) + '); use “Add parent login” in the table.' } }
    paintTable(); paintStats(); paintAtt(true); paintWho(); if (feesApi) feesApi.refreshStudents(); showCreds(name, sid, pw, parent);
    m.className = 'pmsg2 ' + (perr ? 'err' : 'ok'); m.textContent = (parent ? 'Student and parent logins created.' : 'Student login created.') + perr; e.target.reset(); $('#aParent').checked = wantParent;
  } catch (err) { m.className = 'pmsg2 err'; m.textContent = 'Could not create the login: ' + (err.code || err.message) }
}

/* ---------- attendance ---------- */
const slug = (x) => String(x).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'all';
function paintAtt(rebuild) {
  const sel = $('#atBatch'), keep = sel.value;
  if (rebuild === true) { const b = [...new Set(students.map(s => s.batch).filter(Boolean))]; sel.innerHTML = '<option value="">All students</option>' + b.map(x => `<option>${esc(x)}</option>`).join(''); sel.value = keep }
  const batch = sel.value, date = $('#atDate').value, id = date + '_' + slug(batch || 'all');
  const old = sessions.find(x => x.id === id), list = students.filter(s => !batch || s.batch === batch);
  $('#atList').innerHTML = list.length ? list.map(s => { const v = old && old.marks[s.uid] || 'p'; return `<div class="atrow" data-u="${s.uid}"><span><b>${esc(s.sid)}</b> ${esc(s.name)}</span><span class="seg3">${['p', 'l', 'a'].map(k => `<label class="${k}"><input type="radio" name="at_${s.uid}" value="${k}" ${v === k ? 'checked' : ''}>${attLabel[k]}</label>`).join('')}</span></div>` }).join('') : '<p class="muted">No students in this batch.</p>';
  $('#atMsg').textContent = old ? 'This class was already marked. Saving will replace it.' : ''; $('#atMsg').className = 'pmsg2';
}
async function saveAtt(e) {
  e.preventDefault(); const m = $('#atMsg'), batch = $('#atBatch').value, date = $('#atDate').value;
  const rows = $$('#atList .atrow'); if (!date || !rows.length) { m.className = 'pmsg2 err'; m.textContent = 'Choose a date and a batch with students.'; return }
  const marks = {}; rows.forEach(r => { const c = r.querySelector('input:checked'); if (c) marks[r.dataset.u] = c.value });
  const id = date + '_' + slug(batch || 'all'), data = { date, batch: batch || 'All students', marks, uids: Object.keys(marks), takenBy: coach.user.email, updatedAt: F.serverTimestamp() };
  m.className = 'pmsg2'; m.textContent = 'Saving…';
  try { await F.setDoc(F.doc(db, 'attendance', id), data); sessions = sessions.filter(x => x.id !== id); sessions.push({ id, ...data }); sessions.sort((a, b) => b.date.localeCompare(a.date)); paintTable(); if (openUid) showDetail(openUid); m.className = 'pmsg2 ok'; m.textContent = `Attendance saved for ${Object.keys(marks).length} students.`;
    const gone = students.filter(s => marks[s.uid] === 'a'); let mails = 0;
    if ($('#atMail').checked) for (const s of gone) if (s.parentEmail) { try { await queueEmail({ to: s.parentEmail, subject: `Absent from class on ${date}`, text: `Hello,\n\n${s.name} was marked absent from the ${batch || 'class'} on ${date}. If this is a mistake, please tell the coach.\n\nPurple Queen Chess Academy`, kind: 'attendance' }); mails++ } catch {} }
    if (mails) m.textContent += ` ${mails} email${mails > 1 ? 's' : ''} queued.`;
    $('#atWa').innerHTML = gone.map(s => { const l = waLink(s.parentPhone, `Hello, this is Purple Queen Chess Academy. ${s.name} was absent from class on ${date}. If this is a mistake, please tell the coach. Thank you.`); const txt = `Hello, this is Purple Queen Chess Academy. ${s.name} was absent from class on ${date}. If this is a mistake, please tell the coach. Thank you.`, ml = mailLink(s.parentEmail, `Absent from class on ${date}`, txt); return (l ? `<a class="chip" target="_blank" rel="noopener" href="${l}">WhatsApp: parent of ${esc(s.name)}</a>` : '') + (ml ? `<a class="chip" target="_blank" rel="noopener" href="${ml}">Email: parent of ${esc(s.name)}</a>` : '') }).join('') }
  catch (err) { m.className = 'pmsg2 err'; m.textContent = 'Could not save: ' + (err.code || err.message) }
}

/* ---------- homework ---------- */
async function addHomework(e) {
  e.preventDefault(); const m = $('#hMsg'); m.className = 'pmsg2';
  const title = $('#hTitle').value.trim(), due = $('#hDue').value, note = $('#hNote').value.trim();
  const mode = hMode();
  const items = (mode === 'lessons' ? $$('#hLessons input[data-les]:checked') : []).map(c => ({ t: 'lesson', id: c.dataset.les }))
    .concat(custom).concat($('#hText').value.split('\n').map(x => x.trim()).filter(Boolean).map(text => ({ t: 'text', text })));
  const { list, label } = whoList();
  if (!title || !due) { m.className = 'pmsg2 err'; m.textContent = 'Enter a title and a due date.'; return }
  const counts = {}; if (mode === 'puzzles') $$('#hPz input[data-pz]').forEach(i => { const n = Math.max(0, Math.min(50, +i.value || 0)); if (n) counts[i.dataset.pz] = n });
  if (!items.length && !Object.keys(counts).length) { m.className = 'pmsg2 err'; m.textContent = 'Choose at least one lesson, board task, puzzle number or written task.'; return }
  if (!list.length) { m.className = 'pmsg2 err'; m.textContent = 'No student matches this choice.'; return }
  m.textContent = 'Saving…';
  try {
    let short = [];
    if (Object.keys(counts).length) {
      const all = await loadPuzzles(), sets = {};
      list.forEach(st => { const used = usedPuzzles(st.uid); sets[st.uid] = []; Object.entries(counts).forEach(([lv, c]) => { const pick = shuffle(all.filter(p => p.l === +lv && !used.has(p.id))).slice(0, c); pick.forEach(p => { sets[st.uid].push(p.id); used.add(p.id) }); if (pick.length < c) short.push(`${st.name}: only ${pick.length} of ${c} ${PZ_LEVELS[lv]} left`) }) });
      items.push({ t: 'puzzles', counts, sets });
    }
    const data = { title, note, due, items, uids: list.map(s => s.uid), target: label, createdBy: coach.user.email, createdAt: F.serverTimestamp() };
    const ref = await F.addDoc(F.collection(db, 'assignments'), data);
    assigns.unshift({ id: ref.id, ...data, createdAt: { toMillis: () => Date.now() } });
    let mails = 0;
    if ($('#hMail').checked) for (const s of list) if (s.parentEmail) { try { await queueEmail({ to: s.parentEmail, subject: `New homework: ${title}`, text: `Hello,\n\nNew homework for ${s.name}: ${title}. Due ${due}.${note ? '\n' + note : ''}\nThe student can open it after signing in on the academy website.\n\nPurple Queen Chess Academy`, kind: 'homework' }); mails++ } catch {} }
    $('#hSend').innerHTML = list.map(s => { const txt = `Hello, this is Purple Queen Chess Academy. New homework for ${s.name}: ${title}. Due ${due}.${note ? ' ' + note : ''} The student can open it after signing in on the academy website. Thank you.`, w = waLink(s.parentPhone, txt), ml = mailLink(s.parentEmail, `New homework: ${title}`, txt); return (w ? `<a class="chip" target="_blank" rel="noopener" href="${w}">WhatsApp: parent of ${esc(s.name)}</a>` : '') + (ml ? `<a class="chip" target="_blank" rel="noopener" href="${ml}">Email: parent of ${esc(s.name)}</a>` : '') }).join('');
    e.target.reset(); $('#hTitle').value = defTitle(); $('#hPzTot').textContent = '0 puzzles in total'; $('#hMore').open = false; setMode('lessons'); paintSum(); custom = []; paintCustom(); $('#hDue').min = today(); $('#hDue').value = plusDays(7); paintWho(); paintHw(); paintStats(); if (openUid) showDetail(openUid);
    m.className = 'pmsg2 ok'; m.textContent = `Homework given to ${list.length} student${list.length > 1 ? 's' : ''}.` + (short.length ? ' Not enough new puzzles: ' + short.join('; ') + '.' : '') + (mails ? ` ${mails} email${mails > 1 ? 's' : ''} queued.` : '');
  } catch (err) { m.className = 'pmsg2 err'; m.textContent = 'Could not save the homework: ' + (err.code || err.message) }
}
function paintHw() {
  const box = $('#hwList');
  if (!assigns.length) { box.innerHTML = '<h3>Homework given</h3><p class="muted">No homework yet. Use the form above.</p>'; return }
  box.innerHTML = '<h3>Homework given</h3>' + assigns.map(a => {
    const rows = (a.uids || []).map(u => ({ s: students.find(x => x.uid === u), st: assignStat(a, u, progress[u], statuses[a.id + '_' + u], times[u]) })).filter(r => r.s);
    const done = rows.filter(r => r.st.complete).length, late = rows.filter(r => r.st.late).length;
    return `<details class="hw" data-id="${a.id}"><summary><b>${esc(a.title)}</b><span>Due ${dueText(a)} · ${esc(a.target || '')}</span><span class="pill ${late ? 'late' : done === rows.length && rows.length ? 'done' : 'open'}">${done}/${rows.length} done${late ? ' · ' + late + ' overdue' : ''}</span></summary>
      ${a.note ? `<p class="muted">${esc(a.note)}</p>` : ''}<p class="small">${a.items.map(it => `<span class="chip">${esc(itemLabel(it))}</span>`).join(' ')}</p>
      <div class="tw"><table class="stu mini-t"><thead><tr><th>Student</th><th>Done</th><th>Time on these lessons</th><th>Status</th></tr></thead><tbody>${rows.map(r => `<tr><td>${esc(r.s.name)}</td><td>${r.st.done}/${r.st.total}</td><td>${r.st.secs ? fmtTime(r.st.secs) : '—'}</td><td>${statePill(r.st.state)}${r.st.state !== 'done' && waLink(r.s.parentPhone, `Hello, this is Purple Queen Chess Academy. The homework “${a.title}” for ${r.s.name} is ${r.st.late ? 'overdue (was due ' : 'due on '}${a.due}${r.st.late ? ')' : ''}. Please remind them to finish it. Thank you.`) ? ` <a class="mini" target="_blank" rel="noopener" href="${waLink(r.s.parentPhone, `Hello, this is Purple Queen Chess Academy. The homework “${a.title}” for ${r.s.name} is ${r.st.late ? 'overdue (was due ' : 'due on '}${a.due}${r.st.late ? ')' : ''}. Please remind them to finish it. Thank you.`)}">WhatsApp</a>` : ''}</td></tr>`).join('')}</tbody></table></div>
      <button type="button" class="mini danger" data-del="${a.id}">Delete homework</button></details>` }).join('');
}
root.addEventListener('click', async (e) => {
  const b = e.target.closest('button[data-del]'); if (!b) return;
  if (b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Press again to delete'; setTimeout(() => { b.dataset.sure = ''; b.textContent = 'Delete homework' }, 4000); return }
  try { await F.deleteDoc(F.doc(db, 'assignments', b.dataset.del)); assigns = assigns.filter(a => a.id !== b.dataset.del); paintHw(); paintStats() } catch { b.textContent = 'Could not delete' }
});

/* ---------- student report ---------- */
function showDetail(uid) {
  openUid = uid; const s = students.find(x => x.uid === uid); if (!s) return;
  const t = stat(uid), tm = times[uid] || {}, p = progress[uid] || {}, L = p.lessons || {};
  const tries = LESSONS.reduce((n, l) => n + ((tm.lessons && tm.lessons[l.id] && tm.lessons[l.id].a) || 0), 0);
  const weak = LESSONS.filter(l => L[l.id] != null && L[l.id] < PASS).map(l => ({ l, v: L[l.id] })).sort((a, b) => a.v - b.v).slice(0, 5);
  const mine = assigns.filter(a => (a.uids || []).includes(uid));
  const d = $('#detail'); d.hidden = false;
  const ini = esc((s.name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase());
  const lv = +s.level || 1, att = attStat(sessions, uid);
  const modRow = (m, k, open) => { const ls = m.lessons, done = ls.filter(l => (L[l.id] || 0) >= PASS).length, pct = Math.round(done / ls.length * 100);
    return `<details class="mrow"${open ? ' open' : ''}><summary><span class="mt"><small>${PQ_MOD(MODS, k).label}</small><b>${esc(m.title.en)}</b></span><span class="mbar"><span style="width:${pct}%"></span></span><em>${done}/${ls.length}</em></summary>
      <ul class="mls">${ls.map(l => { const v = L[l.id]; return `<li class="${v == null ? '' : v >= PASS ? 'ok' : 'bad'}"><span>${esc(l.title.en)}</span><b>${v == null ? '—' : v + '%'}</b><small>${lessonAtt(tm, l.id) || '—'} ${lessonAtt(tm, l.id) === 1 ? 'try' : 'tries'} · ${lessonSecs(tm, l.id) ? fmtTime(lessonSecs(tm, l.id)) : '—'}</small></li>` }).join('')}</ul></details>` };
  const myMods = MODS.map((m, k) => ({ m, k })).filter(x => PQ_MOD(MODS, x.k).lv === lv), other = MODS.map((m, k) => ({ m, k })).filter(x => PQ_MOD(MODS, x.k).lv !== lv);
  const firstOpen = (myMods.find(x => x.m.lessons.some(l => (L[l.id] || 0) < PASS)) || {}).k;
  d.innerHTML = `<div class="dhead"><div class="dwho">${s.photo ? `<img class="dav" src="${esc(s.photo)}" alt="">` : `<span class="ini dav">${ini}</span>`}<div><p class="eyebrow">Student report</p><h3 class="dname">${esc(s.name)}</h3><p class="dsub">${esc(s.sid)} · ${LEVELS[s.level] || ''}${s.batch ? ' · ' + esc(s.batch) : ''}</p></div></div>
      <div class="dact"><button type="button" class="btn btn-primary btn-sm" id="dAssign">Assign homework</button><button type="button" class="btn btn-ghost btn-sm" id="dClose">Close</button></div></div>
    <div class="acc-stats dkpi"><div><b>${fmtTime(tm.total || 0)}</b><span>Active time, all</span></div><div><b>${fmtTime(secsInLastDays(tm, 7))}</b><span>Last 7 days</span></div><div><b>${t.passed}/${LESSONS.length}</b><span>Lessons passed</span></div><div><b>${t.avg == null ? '—' : t.avg + '%'}</b><span>Average mark · ${tries} tries</span></div></div>
    <div class="dgrid"><div class="dcol">
      <section class="dbox"><h4>Study activity <small>last 14 days, minutes</small></h4>${dayBars(tm)}<p class="muted small">Counts only while a page is open and in use (idle over 2 minutes is not counted).</p></section>
      <section class="dbox"><h4>Progress by module <small>${LEVELS[lv] || ''}</small></h4>${myMods.map(x => modRow(x.m, x.k, x.k === firstOpen)).join('')}
        <details class="more"><summary>Other levels</summary>${other.map(x => modRow(x.m, x.k, false)).join('')}</details></section>
    </div><div class="dcol">
      ${lv === 1 || lv === 2 ? (() => { const ex = L['l' + lv + '-promotion'], gm = s['l' + lv + 'games']; const ready = (ex || 0) >= PASS && gm; return `<section class="dbox"><h4>Level ${lv} promotion</h4><ul class="plist"><li class="${(ex || 0) >= PASS ? 'ok' : ''}">Promotion test (30 tasks): ${ex == null ? 'not taken' : ex + '%'}</li>
        <li class="${gm ? 'ok' : ''}"><label><input type="checkbox" id="l1g" ${gm ? 'checked' : ''}> Supervised games with notation completed</label></li></ul>
        <button type="button" class="btn btn-primary btn-sm" id="promoBtn" ${ready ? '' : 'disabled'}>Promote to Level ${lv + 1}</button></section>` })() : ''}
      ${weak.length ? `<section class="dbox"><h4>Needs work</h4><div class="chips">${weak.map(w => `<span class="chip bad">${esc(w.l.title.en)} · ${w.v}%</span>`).join('')}</div></section>` : ''}
      <section class="dbox"><h4>Attendance</h4>${att.total ? `<div class="attsum"><b>${att.pct}%</b><span>${att.present} present · ${att.late} late · ${att.absent} absent<br><small>${att.total} classes</small></span></div><details class="more"><summary>Show classes</summary>${attTable(att, uid)}</details>` : '<p class="muted small">No classes marked yet.</p>'}</section>
      <section class="dbox"><h4>Puzzles</h4><p id="dPz" class="muted small">Loading…</p></section>
      <section class="dbox"><h4>Homework</h4>${mine.length ? `<ul class="dhw">${mine.map(a => { const st = assignStat(a, uid, p, statuses[a.id + '_' + uid], tm); return `<li><span><b>${esc(a.title)}</b><small>Due ${dueText(a)}</small></span><em>${st.done}/${st.total}</em>${statePill(st.state)}</li>` }).join('')}</ul>` : '<p class="muted small">No homework yet.</p>'}</section>
      <section class="dbox"><h4>Student details <small>filled in by the student</small></h4>${(() => { const rows = [['Date of birth', s.dob], ['School', s.school], ['Grade', s.grade], ['Home town', s.city], ['Student phone', s.phone]].filter(r => r[1]); return rows.length ? `<dl class="ddet">${rows.map(r => `<dt>${r[0]}</dt><dd>${esc(r[1])}</dd>`).join('')}</dl>` : '<p class="muted small">Nothing filled in yet.</p>' })()}</section>
      <section class="dbox"><h4>Parent</h4><label for="dpPhone">WhatsApp number<input id="dpPhone" type="tel" value="${esc(s.parentPhone || '')}"></label><label for="dpEmail">Email<input id="dpEmail" type="email" value="${esc(s.parentEmail || '')}"></label>
        <div class="row"><button type="button" class="btn btn-ghost btn-sm" id="dpSave">Save contact</button> <span class="pmsg2" id="dpMsg"></span></div>
        <p class="muted small">Parent login: ${s.parentUid ? esc(s.sid) + '-P' : 'none yet (use ••• → Add parent login in the table)'}</p></section>
    </div></div>`;
  $('#dAssign').onclick = () => { showTab('homework'); $('#hWho').value = 'pick'; paintWho(); $$('#hPick input').forEach(c => { c.checked = c.value === uid }); paintLessons(); paintSum(); $('#hwForm').scrollIntoView({ behavior: 'smooth', block: 'start' }) };
  loadAllPuzzles().then(all => { const sv = (p.puzzles || {}).solved || {}, ids = Object.keys(sv), by = {}; ids.forEach(id => { const q = all.find(x => x.id === id); if (q) by[q.l] = (by[q.l] || 0) + 1 }); const el = $('#dPz'); if (el) el.textContent = ids.length ? `${ids.length} solved · ` + Object.entries(by).map(([l, n]) => `${PZ_LEVELS[l]} ${n}`).join(' · ') + ` · best streak ${(p.puzzles || {}).best || 0}` : 'No puzzles solved yet.' }).catch(() => { const el = $('#dPz'); if (el) el.textContent = '' });
  $('#dClose').onclick = () => { d.hidden = true; openUid = null };
  $('#dpSave').onclick = async () => { const ph = $('#dpPhone').value.trim(), em = $('#dpEmail').value.trim().toLowerCase(); try { await F.updateDoc(F.doc(db, 'users', uid), { parentPhone: ph, parentEmail: em }); s.parentPhone = ph; s.parentEmail = em; $('#dpMsg').className = 'pmsg2 ok'; $('#dpMsg').textContent = 'Saved.' } catch { $('#dpMsg').className = 'pmsg2 err'; $('#dpMsg').textContent = 'Could not save.' } };
  const g = $('#l1g'); if (g) g.onchange = async () => { const key = 'l' + (+s.level) + 'games'; try { await F.updateDoc(F.doc(db, 'users', uid), { [key]: g.checked }); s[key] = g.checked; showDetail(uid) } catch { g.checked = !g.checked } };
  const pb = $('#promoBtn'); if (pb) pb.onclick = async () => { try { const nl = (+s.level || 1) + 1; await F.updateDoc(F.doc(db, 'users', uid), { level: nl }); s.level = nl; paintTable(); showDetail(uid) } catch { pb.textContent = 'Could not save' } };
  d.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function exportCsv() {
  const head = ['ID', 'Name', 'Level', 'Batch', 'Lessons passed', 'Average %', 'XP', 'Puzzles solved', 'Active min (all)', 'Active min (7 days)', 'Overdue homework', 'Classes marked', 'Attendance %', ...LESSONS.map(l => 'M' + (l.mod + 1) + ' ' + l.title.en + ' %')];
  const rows = students.map(s => { const t = stat(s.uid), tm = times[s.uid] || {}, L = (progress[s.uid] || {}).lessons || {};
    const late = assigns.filter(a => (a.uids || []).includes(s.uid) && assignStat(a, s.uid, progress[s.uid], statuses[a.id + '_' + s.uid], tm).late).length;
    return [s.sid, s.name, s.level, s.batch || '', t.passed, t.avg ?? '', t.xp, t.puzzles, Math.round((tm.total || 0) / 60), Math.round(secsInLastDays(tm, 7) / 60), late, attStat(sessions, s.uid).total, attStat(sessions, s.uid).pct ?? '', ...LESSONS.map(l => L[l.id] ?? '')] });
  download('purple-queen-students-' + today() + '.csv', toCsv([head, ...rows]));
}

/* ---------- coach avatar menu + my profile ---------- */
const cName = () => cprof.display || (cprof.name || coach.profile.name || coach.user.email).split(' ')[0];
const cAv = (big) => `<span class="sp-av c${big ? ' big' : ''}">${cprof.photo ? `<img src="${esc(cprof.photo)}" alt="">` : ini(cprof.name || coach.profile.name || coach.user.email)}</span>`;
function mountCoachMenu() {
  const box = $('#spUser'); if (!box) return;
  box.innerHTML = `<button type="button" class="sp-ubtn" id="spUBtn" aria-haspopup="menu" aria-expanded="false" aria-controls="spMenu"><span class="nm">${esc(cName())}</span>${cAv()}<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg></button>
    <div class="sp-menu" id="spMenu" role="menu"><div class="sp-mh">${cAv()}<div><b>${esc(cprof.name || coach.profile.name || cName())}</b><small>${esc(cprof.title || coach.user.email)}</small></div></div>
      <a role="menuitem" href="#" data-go="profile"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20.5c1.4-3.6 4.4-5.5 8-5.5s6.6 1.9 8 5.5"/></svg>My profile</a>
      <a role="menuitem" href="index.html" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>Open the public website</a>
      <hr><button type="button" role="menuitem" class="out" id="cOut"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3"/></svg>Sign out</button></div>`;
  const b = $('#spUBtn'), m = $('#spMenu'), set = (v) => { m.classList.toggle('on', v); b.setAttribute('aria-expanded', String(v)) };
  b.onclick = (e) => { e.stopPropagation(); set(!m.classList.contains('on')) };
  if (!mountCoachMenu.done) { mountCoachMenu.done = true; document.addEventListener('click', (e) => { const mm = $('#spMenu'); if (mm && !$('#spUser').contains(e.target)) { mm.classList.remove('on'); $('#spUBtn').setAttribute('aria-expanded', 'false') } }); document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('#spMenu')) $('#spMenu').classList.remove('on') }) }
  m.querySelector('[data-go="profile"]').onclick = (e) => { e.preventDefault(); set(false); showTab('profile'); window.scrollTo(0, 0) };
  $('#cOut').onclick = logout;
}
function paintProfile() {
  const box = $('#cpProfile'); if (!box) return;
  const v = (k) => esc(cprof[k] || (k === 'name' ? coach.profile.name || '' : ''));
  box.innerHTML = `<div class="cp-prof"><div class="cp-id"><div class="cv"></div><div class="bd">${cAv(true)}<h2>${esc(cprof.name || coach.profile.name || cName())}</h2>${cprof.title ? `<span class="role">${esc(cprof.title)}</span>` : ''}<p class="muted">${esc(coach.user.email)}${cprof.phone ? ' · ' + esc(cprof.phone) : ''}</p>
      <div class="ks"><div><b>${students.length}</b><small>students</small></div><div><b>${[...new Set(students.map(s => s.batch).filter(Boolean))].length}</b><small>batches</small></div><div><b>${esc(cprof.since || '—')}</b><small>coaching since</small></div></div>${cprof.bio ? `<p class="bio">${esc(cprof.bio)}</p>` : ''}</div></div>
    <form class="acc-card cp-pf" id="cpForm"><div class="row2"><label for="cpName">Full name<input id="cpName" maxlength="80" value="${v('name')}"></label><label for="cpDisp">Display name<input id="cpDisp" maxlength="80" value="${v('display')}" placeholder="e.g. Washini"></label></div>
      <div class="row2"><label for="cpTitle">Title / role (optional)<input id="cpTitle" maxlength="80" value="${v('title')}" placeholder="e.g. FIDE International Arbiter · Head coach"></label><label for="cpPhone">Phone / WhatsApp (optional)<input id="cpPhone" type="tel" maxlength="80" value="${v('phone')}"></label></div>
      <div class="row2"><label for="cpSince">Coaching since (optional)<input id="cpSince" maxlength="80" value="${v('since')}" placeholder="e.g. 2019"></label><label>Sign-in email<input value="${esc(coach.user.email)}" disabled></label></div>
      <label>Photo<span class="cp-photo">${cAv()}<button type="button" class="btn btn-ghost btn-sm" id="cpPhotoBtn">${cprof.photo ? 'Change photo' : 'Upload photo'}</button>${cprof.photo ? '<button type="button" class="btn btn-ghost btn-sm" id="cpPhotoDel">Remove</button>' : ''}<input type="file" id="cpPhoto" accept="image/*" hidden></span></label>
      <label for="cpBio">Short bio (optional)<textarea id="cpBio" rows="3" maxlength="600">${v('bio')}</textarea></label>
      <button class="btn btn-primary btn-sm" type="submit">Save profile</button><p class="pmsg2" id="cpMsg"></p></form></div>`;
  const ref = F.doc(db, 'coachProfiles', coach.user.email.toLowerCase());
  const save = async (extra) => { const data = { name: $('#cpName').value.trim(), display: $('#cpDisp').value.trim(), title: $('#cpTitle').value.trim(), phone: $('#cpPhone').value.trim(), since: $('#cpSince').value.trim(), bio: $('#cpBio').value.trim().slice(0, 600), photo: cprof.photo || '', ...extra, updatedAt: F.serverTimestamp() }; await F.setDoc(ref, data); cprof = { ...data }; mountCoachMenu(); paintProfile() };
  $('#cpForm').onsubmit = async (e) => { e.preventDefault(); try { await save({}); $('#cpMsg').className = 'pmsg2 ok'; $('#cpMsg').textContent = 'Saved.' } catch (err) { $('#cpMsg').className = 'pmsg2 err'; $('#cpMsg').textContent = 'Could not save: ' + (err.code || err.message) } };
  $('#cpPhotoBtn').onclick = () => $('#cpPhoto').click();
  if ($('#cpPhotoDel')) $('#cpPhotoDel').onclick = () => save({ photo: '' }).catch(() => {});
  $('#cpPhoto').onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { const img = await new Promise((ok, no) => { const i = new Image(), u = URL.createObjectURL(f); i.onload = () => { URL.revokeObjectURL(u); ok(i) }; i.onerror = no; i.src = u });
      const c = document.createElement('canvas'); c.width = c.height = 200; const k = Math.min(img.width, img.height); c.getContext('2d').drawImage(img, (img.width - k) / 2, (img.height - k) / 2, k, k, 0, 0, 200, 200);
      await save({ photo: c.toDataURL('image/jpeg', .82) }) } catch { alert('Could not save the photo. Try a smaller picture.') }
  };
}
