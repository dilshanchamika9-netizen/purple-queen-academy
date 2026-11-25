import { initBuilder } from './taskbuilder.js';
import { initFees } from './coach-fees.js';
import { app, auth, db, F, EMU, whoAmI, logout, esc, idToEmail, markSignedIn, fmtTime, today } from './fb.js';
import { PZ_LEVELS, MODS, LESSONS, PASS, lessonName, assignStat, itemLabel, secsInLastDays, dayBars, dueText, statePill, toCsv, download, lessonTable, attStat, attTable, attLabel, waLink, mailLink } from './lms.js';
const $ = (s) => document.querySelector(s);
const root = $('#portalCoach');
const LEVELS = { 1: 'L1 · Pawn', 2: 'L2 · Knight', 3: 'L3 · Queen' };
const words = ['queen', 'rook', 'knight', 'bishop', 'pawn', 'castle', 'check', 'board'];
const tempPw = () => words[Math.floor(Math.random() * words.length)] + '-' + (1000 + Math.floor(Math.random() * 9000));
let feesApi = null, tab = 'students', custom = [], sessions = [], students = [], progress = {}, times = {}, assigns = [], statuses = {}, queue = [], coach = null, openUid = null;

(async () => {
  const me = await whoAmI();
  if (!me) return (location.href = 'login.html?as=coach');
  if (me.role !== 'coach') return (location.href = me.role === 'student' ? 'account.html' : me.role === 'parent' ? 'parent.html' : 'login.html?as=coach');
  coach = me; markSignedIn(true, 'coach');
  render(); await load();
  feesApi = initFees({ box: $('#feesBox'), getStudents: () => students, coach, queueEmail });
  F.onSnapshot(F.query(F.collection(db, 'adminQueue'), F.orderBy('createdAt', 'desc'), F.limit(20)), s => { queue = s.docs.map(d => ({ id: d.id, ...d.data() })); paintQueue() }, () => {});
})();

function render() {
  root.innerHTML = `
  <div class="acc-head"><div class="acc-av coach">♛&#xFE0E;</div><div><p class="eyebrow">Coach panel</p><h1>Welcome, <em>${esc((coach.profile.name || coach.user.email).split(' ')[0])}</em></h1><p class="acc-sub">${esc(coach.user.email)}</p></div>
    <div class="acc-actions"><button type="button" class="btn btn-ghost btn-sm" id="cOut">Sign out</button></div></div>
  <div class="acc-stats" id="cStats"></div>
  <nav class="ctabs" id="cTabs" aria-label="Coach panel sections"><button type="button" data-t="students">Students</button><button type="button" data-t="homework">Homework</button><button type="button" data-t="attendance">Attendance</button><button type="button" data-t="fees">Fees</button></nav>
  <div class="acc-grid coach-grid2" data-tab="students">
    <form class="acc-card" id="addForm"><h3>Add a student</h3>
      <label for="aName">Full name<input id="aName" required placeholder="e.g. Kavindu Perera"></label>
      <div class="row2"><label for="aLevel">Level<select id="aLevel"><option value="1">Level 1 · Pawn (Basic)</option><option value="2">Level 2 · Knight (Intermediate)</option><option value="3">Level 3 · Queen (Advanced)</option></select></label>
      <label for="aBatch">Batch<input id="aBatch" placeholder="e.g. Saturday 8:30 AM"></label></div>
      <div class="row2"><label for="aPPhone">Parent WhatsApp number (optional)<input id="aPPhone" type="tel" placeholder="e.g. 077 123 4567"></label>
      <label for="aPEmail">Parent email (optional)<input id="aPEmail" type="email" placeholder="e.g. parent@gmail.com"></label></div>
      <label class="chk" for="aParent"><input type="checkbox" id="aParent" checked> Also create a parent login (read-only view of this student)</label>
      <button class="btn btn-primary btn-sm" type="submit">Create login</button>
      <div class="newacc" id="newAcc" hidden></div><p class="pmsg2" id="aMsg"></p></form>
    <section class="acc-card"><h3>Requests</h3><p class="muted">Password resets and removals are done automatically within about 10–15 minutes.</p><ul class="queue" id="queue"><li class="muted">No requests yet.</li></ul></section>
  </div>
  <form class="acc-card" id="atForm" data-tab="attendance"><h3>Attendance</h3>
    <div class="row2"><label for="atDate">Class date<input id="atDate" type="date" required></label>
      <label for="atBatch">Class (batch)<select id="atBatch"></select></label></div>
    <div id="atList" class="atlist"></div>
    <label class="chk" for="atMail"><input type="checkbox" id="atMail"> Email the parents of absent students</label>
    <div class="tools"><button type="button" class="btn btn-ghost btn-sm" id="atAll">Mark everyone present</button><button class="btn btn-primary btn-sm" type="submit">Save attendance</button></div><p class="pmsg2" id="atMsg"></p><div id="atWa" class="tblist"></div></form>
  <form class="acc-card" id="hwForm" data-tab="homework"><h3>Assign homework</h3>
    <div class="row2"><label for="hTitle">Title<input id="hTitle" required placeholder="e.g. Week 3: forks and pins"></label>
      <label for="hDue">Due date <button type="button" class="mini" id="hWeek">+ 1 week</button><input id="hDue" type="date" required></label></div>
    <label for="hNote">Note for the student (optional)<textarea id="hNote" rows="2" placeholder="e.g. Finish before Saturday's class"></textarea></label>
    <div class="row2"><label for="hWho">Give it to<select id="hWho"><option value="all">All students</option><option value="level">One level</option><option value="batch">One batch</option><option value="pick">Chosen students</option></select></label>
      <label for="hWhoVal" id="hWhoWrap" hidden><span id="hWhoLab">Level</span><select id="hWhoVal"></select></label></div>
    <div class="pickbox" id="hPick" hidden></div>
    <p class="lab">Lessons to complete (a lesson counts as done at ${PASS}% or more)</p>
    <div class="lesspick" id="hLessons">${MODS.map((m, k) => `<details ${k === 2 ? 'open' : ''}><summary><label><input type="checkbox" data-mod="${k}"> <b>${PQ_MOD(MODS, k).label}</b> ${esc(m.title.en)}</label></summary>${m.lessons.map(l => `<label class="lp"><input type="checkbox" data-les="${l.id}" data-m="${k}"> ${esc(l.title.en)}</label>`).join('')}</details>`).join('')}</div>
    <p class="lab">Board tasks you made</p><div id="tbList" class="tblist"><span class="muted small">None yet.</span></div>
    <details class="tbd" id="tbDet"><summary>＋ Make a board task (set up a position and the right answer)</summary><div id="tbBox"></div></details>
    <p class="lab">Puzzles by number (each student gets different puzzles, never ones already solved or given before)</p>
    <div class="pzpick" id="hPz">${[1, 2, 3, 4, 5].map(l => `<label>${PZ_LEVELS[l]}<input type="number" min="0" max="50" value="0" inputmode="numeric" data-pz="${l}"></label>`).join('')}</div>
    <div class="pzpre" id="hPzPre"><button type="button" class="mini" data-pre="10,0,0,0,0">10 Beginner</button><button type="button" class="mini" data-pre="5,5,0,0,0">5 Beginner + 5 Improver</button><button type="button" class="mini" data-pre="0,5,5,0,0">5 Improver + 5 Club</button><button type="button" class="mini" data-pre="5,5,5,5,0">20 mixed</button><button type="button" class="mini" data-pre="0,0,0,0,0">Clear</button></div>
    <label class="chk" for="hMail"><input type="checkbox" id="hMail"> Email the parents about this homework (only those with an email saved)</label>
    <label for="hText">Extra tasks, one per line (the student ticks them off)<textarea id="hText" rows="3" placeholder="e.g. Play 2 games with a friend and write the moves"></textarea></label>
    <button class="btn btn-primary btn-sm" type="submit">Assign homework</button><p class="pmsg2" id="hMsg"></p><div class="chips" id="hSend"></div></form>
  <section class="acc-card" id="hwList" data-tab="homework"><h3>Homework given</h3><p class="muted">Loading…</p></section>
  <section class="acc-card" data-tab="students"><div class="tbl-head"><h3>Students</h3><div class="tools"><input id="filter" type="search" placeholder="Search name, ID or batch" aria-label="Search students"><button type="button" class="btn btn-ghost btn-sm" id="csvBtn">Download CSV</button></div></div>
    <div class="tw"><table class="stu" id="stuTable"><thead><tr><th>ID</th><th>Name</th><th>Level</th><th>Batch</th><th>Lessons</th><th>Average</th><th>Attendance</th><th>XP</th><th>Active time<br><small>7 days</small></th><th>Last active</th><th></th></tr></thead><tbody><tr><td colspan="11" class="muted">Loading…</td></tr></tbody></table></div></section>
  <section class="acc-card" id="detail" data-tab="students" hidden></section>
  <div id="feesBox" data-tab="fees"></div>`;
  $('#cOut').onclick = logout;
  try { tab = sessionStorage.getItem('pq-ctab') || 'students' } catch {}
  $('#cTabs').onclick = (e) => { const b = e.target.closest('button[data-t]'); if (b) showTab(b.dataset.t) };
  showTab(tab);
  $('#addForm').onsubmit = addStudent;
  $('#hwForm').onsubmit = addHomework;
  $('#filter').oninput = paintTable;
  $('#csvBtn').onclick = exportCsv;
  $('#hDue').min = today(); $('#hDue').value = plusDays(7); $('#hWeek').onclick = () => { $('#hDue').value = plusDays(7) };
  $('#hPzPre').onclick = (e) => { const b = e.target.closest('[data-pre]'); if (b) b.dataset.pre.split(',').forEach((v, i) => { $('#hPz input[data-pz="' + (i + 1) + '"]').value = v }) };
  $('#hWho').onchange = paintWho;
  let built = false; $('#tbDet').addEventListener('toggle', () => { if ($('#tbDet').open && !built) { built = true; initBuilder($('#tbBox'), (t) => { custom.push(t); paintCustom() }) } });
  $('#atForm').onsubmit = saveAtt; $('#atDate').value = today(); $('#atDate').max = today();
  $('#atDate').onchange = paintAtt; $('#atBatch').onchange = paintAtt;
  $('#atAll').onclick = () => $$('#atList input[value="p"]').forEach(r => r.checked = true);
  $('#hLessons').addEventListener('change', (e) => { const m = e.target.dataset.mod; if (m != null) $$(`#hLessons input[data-m="${m}"]`).forEach(c => c.checked = e.target.checked) });
}
const $$ = (s) => [...document.querySelectorAll(s)];
const plusDays = (n) => { const d = new Date(Date.now() + n * 864e5); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') };
let PUZZLES = null;
async function loadPuzzles() { if (!PUZZLES) { const r = await fetch('assets/data/puzzles.json'); PUZZLES = (await r.json()).puzzles } return PUZZLES }
// puzzle ids already given to a student in any homework, plus ones already solved
const usedPuzzles = (uid) => { const u = new Set(Object.keys((((progress[uid] || {}).puzzles) || {}).solved || {})); assigns.forEach(a => (a.items || []).forEach(it => { if (it.t === 'puzzles' && it.sets && it.sets[uid]) it.sets[uid].forEach(id => u.add(id)) })); return u };
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a };
function showTab(t) {
  tab = t; try { sessionStorage.setItem('pq-ctab', t) } catch {}
  root.querySelectorAll('[data-tab]').forEach(e => e.classList.toggle('tab-off', e.dataset.tab !== t));
  root.querySelectorAll('#cTabs button').forEach(b => b.setAttribute('aria-current', b.dataset.t === t ? 'page' : 'false'));
}
async function queueEmail(m) { return F.addDoc(F.collection(db, 'outbox'), { to: m.to, subject: m.subject, text: m.text, kind: m.kind || 'note', status: 'pending', by: coach.user.email, createdAt: F.serverTimestamp() }) }
function paintCustom() {
  $('#tbList').innerHTML = custom.length ? custom.map((t, i) => `<span class="chip">${esc(t.q)} · ${t.kind === 'move' ? 'move' : 'square'} <button type="button" class="x" data-rm="${i}" aria-label="Remove this task">×</button></span>`).join(' ') : '<span class="muted small">None yet.</span>';
}
root.addEventListener('click', (e) => { const b = e.target.closest('button[data-rm]'); if (b) { custom.splice(+b.dataset.rm, 1); paintCustom() } });
function paintWho() {
  const w = $('#hWho').value, val = $('#hWhoVal');
  $('#hWhoWrap').hidden = !(w === 'level' || w === 'batch'); $('#hPick').hidden = w !== 'pick';
  if (w === 'level') { $('#hWhoLab').textContent = 'Level'; val.innerHTML = [1, 2, 3].map(l => `<option value="${l}">${LEVELS[l]}</option>`).join('') }
  if (w === 'batch') { $('#hWhoLab').textContent = 'Batch'; const b = [...new Set(students.map(s => s.batch).filter(Boolean))]; val.innerHTML = b.length ? b.map(x => `<option>${esc(x)}</option>`).join('') : '<option value="">No batches yet</option>' }
  if (w === 'pick') $('#hPick').innerHTML = students.map(s => `<label><input type="checkbox" value="${s.uid}"> ${esc(s.sid)} ${esc(s.name)}</label>`).join('') || '<p class="muted">No students yet.</p>';
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
  paintStats(); paintTable(); paintHw(); paintAtt(true);
}
const stat = (uid) => {
  const p = progress[uid] || {}, L = p.lessons || {};
  const vals = LESSONS.map(l => L[l.id]).filter(v => v != null);
  return { passed: LESSONS.filter(l => (L[l.id] || 0) >= PASS).length, avg: vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null, xp: p.xp || 0, puzzles: p.puzzles && p.puzzles.solved ? Object.keys(p.puzzles.solved).length : 0 };
};
function paintStats() {
  const week = Date.now() - 7 * 864e5;
  const active = students.filter(s => s.lastSeen && s.lastSeen.toMillis && s.lastSeen.toMillis() > week).length;
  const late = assigns.reduce((n, a) => n + (a.uids || []).filter(u => assignStat(a, u, progress[u], statuses[a.id + '_' + u], times[u]).late).length, 0);
  $('#cStats').innerHTML = `<div><b>${students.length}</b><span>Students</span></div><div><b>${active}</b><span>Active this week</span></div><div><b>${assigns.filter(a => a.due >= today()).length}</b><span>Homework open</span></div><div><b>${late}</b><span>Overdue (students)</span></div>`;
}
function ago(ts) { if (!ts || !ts.toMillis) return '—'; const d = (Date.now() - ts.toMillis()) / 864e5; return d < 1 ? 'Today' : d < 2 ? 'Yesterday' : Math.floor(d) + ' days ago' }
function paintTable() {
  const f = ($('#filter').value || '').toLowerCase();
  const rows = students.filter(s => !f || [s.sid, s.name, s.batch].join(' ').toLowerCase().includes(f));
  $('#stuTable tbody').innerHTML = rows.length ? rows.map(s => { const t = stat(s.uid); return `<tr data-uid="${s.uid}">
    <td><b>${esc(s.sid)}</b></td><td><button type="button" class="linkbtn nm" data-a="report">${esc(s.name)}</button>${s.mustChange ? ' <span class="tag">new password pending</span>' : ''}</td>
    <td><select class="lv" aria-label="Level for ${esc(s.name)}">${[1, 2, 3].map(l => `<option value="${l}" ${+s.level === l ? 'selected' : ''}>${LEVELS[l]}</option>`).join('')}</select></td>
    <td><input class="bt" value="${esc(s.batch || '')}" aria-label="Batch for ${esc(s.name)}"></td>
    <td>${t.passed}/${LESSONS.length}</td><td>${t.avg == null ? '—' : t.avg + '%'}</td><td>${(() => { const a = attStat(sessions, s.uid); return a.pct == null ? '—' : a.pct + '%' })()}</td><td>${t.xp}</td><td>${fmtTime(secsInLastDays(times[s.uid], 7))}</td><td>${ago(s.lastSeen)}</td>
    <td class="acts"><button type="button" class="mini" data-a="report">Report</button><button type="button" class="mini" data-a="reset">Reset password</button>${s.parentUid ? `<button type="button" class="mini" data-a="resetparent">Reset parent</button>` : `<button type="button" class="mini" data-a="addparent">Add parent login</button>`}<button type="button" class="mini danger" data-a="delete">Remove</button></td></tr>` }).join('')
    : `<tr><td colspan="11" class="muted">${students.length ? 'No match.' : 'No students yet. Add the first one above.'}</td></tr>`;
}
root.addEventListener('change', async (e) => {
  const tr = e.target.closest('tr[data-uid]'); if (!tr) return;
  const uid = tr.dataset.uid, field = e.target.classList.contains('lv') ? 'level' : e.target.classList.contains('bt') ? 'batch' : null; if (!field) return;
  const v = field === 'level' ? +e.target.value : e.target.value.trim();
  try { await F.updateDoc(F.doc(db, 'users', uid), { [field]: v }); const s = students.find(x => x.uid === uid); s[field] = v; if (field === 'batch') paintAtt(true); e.target.classList.add('saved'); setTimeout(() => e.target.classList.remove('saved'), 900) } catch { alertRow(tr, 'Could not save. Try again.') }
});
root.addEventListener('click', async (e) => {
  const b = e.target.closest('button[data-a]'); if (!b) return; const tr = b.closest('tr'); if (!tr || !tr.dataset.uid) return; const s = students.find(x => x.uid === tr.dataset.uid);
  const a = b.dataset.a;
  if (a === 'report') return showDetail(s.uid);
  if (a === 'addparent') { b.disabled = true; b.textContent = 'Creating…'; try { const c = await createParent(s); paintTable(); showCreds(s.name, s.sid, null, c) } catch (err) { b.disabled = false; b.textContent = 'Add parent login'; alertRow(tr, 'Could not create: ' + (err.code || err.message)) } return }
  if (a === 'delete' && b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Press again to remove'; setTimeout(() => { b.dataset.sure = ''; b.textContent = 'Remove' }, 4000); return }
  try {
    const parent = a === 'resetparent';
    await F.addDoc(F.collection(db, 'adminQueue'), { type: parent ? 'reset' : a, uid: parent ? s.parentUid : s.uid, sid: parent ? s.sid + '-P' : s.sid, name: parent ? 'Parent of ' + s.name : s.name, status: 'pending', by: coach.user.email, createdAt: F.serverTimestamp() });
    b.textContent = 'Requested'; b.disabled = true;
  } catch { alertRow(tr, 'Could not send the request.') }
});
function alertRow(tr, t) { tr.querySelector('.acts').insertAdjacentHTML('beforeend', `<span class="tag err">${esc(t)}</span>`) }
function paintQueue() {
  $('#queue').innerHTML = queue.length ? queue.map(q => `<li class="${q.status}"><b>${q.type === 'reset' ? 'Password reset' : 'Remove'} · ${esc(q.sid)} ${esc(q.name || '')}</b>
    <span>${q.status === 'pending' ? 'Waiting…' : q.status === 'error' ? 'Failed: ' + esc(q.error) : q.type === 'reset' ? `New password: <code>${esc(q.tempPassword)}</code>` : 'Removed'}</span></li>`).join('') : '<li class="muted">No requests yet.</li>';
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
  const name = $('#aName').value.trim(), level = +$('#aLevel').value, batch = $('#aBatch').value.trim(), pPhone = $('#aPPhone').value.trim(), pEmail = $('#aPEmail').value.trim().toLowerCase(), wantParent = $('#aParent').checked;
  if (!name) { m.className = 'pmsg2 err'; m.textContent = 'Enter the student’s name.'; return }
  let sid;
  try {
    sid = await F.runTransaction(db, async (tx) => { const ref = F.doc(db, 'meta', 'counter'); const s = await tx.get(ref); const n = s.exists() ? s.data().next : 1; tx.set(ref, { next: n + 1 }); return 'PQ' + String(n).padStart(4, '0') });
  } catch (err) { m.className = 'pmsg2 err'; m.textContent = 'Could not get a new student ID: ' + (err.code || err.message); return }
  const pw = tempPw();
  try {
    const uid = await makeLogin(sid, pw);
    await F.setDoc(F.doc(db, 'users', uid), { role: 'student', sid, name, level, batch, ...(pPhone ? { parentPhone: pPhone } : {}), ...(pEmail ? { parentEmail: pEmail } : {}), mustChange: true, createdAt: F.serverTimestamp(), createdBy: coach.user.email });
    const s = { uid, role: 'student', sid, name, level, batch, parentPhone: pPhone, parentEmail: pEmail, mustChange: true }; students.push(s);
    let parent = null, perr = '';
    if (wantParent) { try { parent = await createParent(s) } catch (err) { perr = ' The parent login failed (' + (err.code || err.message) + '); use “Add parent login” in the table.' } }
    paintTable(); paintStats(); paintAtt(true); if (feesApi) feesApi.refreshStudents(); showCreds(name, sid, pw, parent);
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
  const items = $$('#hLessons input[data-les]:checked').map(c => ({ t: 'lesson', id: c.dataset.les }))
    .concat(custom).concat($('#hText').value.split('\n').map(x => x.trim()).filter(Boolean).map(text => ({ t: 'text', text })));
  const w = $('#hWho').value; let list = students, label = 'All students';
  if (w === 'level') { const v = +$('#hWhoVal').value; list = students.filter(s => +s.level === v); label = LEVELS[v] }
  if (w === 'batch') { const v = $('#hWhoVal').value; list = students.filter(s => s.batch === v); label = 'Batch: ' + v }
  if (w === 'pick') { const ids = $$('#hPick input:checked').map(c => c.value); list = students.filter(s => ids.includes(s.uid)); label = list.length === 1 ? list[0].name : list.length + ' students' }
  if (!title || !due) { m.className = 'pmsg2 err'; m.textContent = 'Enter a title and a due date.'; return }
  const counts = {}; $$('#hPz input[data-pz]').forEach(i => { const n = Math.max(0, Math.min(50, +i.value || 0)); if (n) counts[i.dataset.pz] = n });
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
    e.target.reset(); custom = []; paintCustom(); $('#hDue').min = today(); $('#hDue').value = plusDays(7); paintWho(); paintHw(); paintStats(); if (openUid) showDetail(openUid);
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
  d.innerHTML = `<div class="tbl-head"><h3>${s.photo ? `<img class="phimg" src="${esc(s.photo)}" alt=""> ` : ''}${esc(s.name)} <small class="muted">${esc(s.sid)} · ${LEVELS[s.level] || ''}${s.batch ? ' · ' + esc(s.batch) : ''}</small></h3><button type="button" class="btn btn-ghost btn-sm" id="dClose">Close</button></div>
    <div class="acc-stats"><div><b>${fmtTime(tm.total || 0)}</b><span>Active time, all</span></div><div><b>${fmtTime(secsInLastDays(tm, 7))}</b><span>Last 7 days</span></div><div><b>${t.passed}/${LESSONS.length}</b><span>Lessons passed</span></div><div><b>${t.avg == null ? '—' : t.avg + '%'}</b><span>Average mark · ${tries} tries</span></div></div>
    <p class="muted small">Active time counts only while the page is open and in use. Idle for more than 2 minutes is not counted.</p>
    <h4>Last 14 days (minutes of active study)</h4>${dayBars(tm)}
    ${weak.length ? `<h4>Needs work</h4><p>${weak.map(w => `<span class="chip bad">${esc(lessonName(w.l.id))} · ${w.v}%</span>`).join(' ')}</p>` : ''}
    ${+s.level === 1 || +s.level === 2 ? (() => { const n = +s.level, ex = L['l' + n + '-promotion'], gm = s['l' + n + 'games']; const ready = (ex || 0) >= PASS && gm; return `<h4>Level ${n} promotion</h4><ul class="plist"><li class="${(ex || 0) >= PASS ? 'ok' : ''}">Promotion test (30 tasks): ${ex == null ? 'not taken' : ex + '%' + ((ex || 0) >= PASS ? ' · passed' : ' · needs ' + PASS + '%')}</li>
      <li class="${gm ? 'ok' : ''}"><label><input type="checkbox" id="l1g" ${gm ? 'checked' : ''}> Supervised games with notation completed</label></li></ul>
      <button type="button" class="btn btn-primary btn-sm" id="promoBtn" ${ready ? '' : 'disabled'}>Promote to Level ${n + 1}</button>` })() : ''}
    <h4>Attendance</h4>${(() => { const a = attStat(sessions, uid); return a.total ? `<p><b>${a.pct}%</b> attended · ${a.present} present, ${a.late} late, ${a.absent} absent (${a.total} classes)</p>` + attTable(a, uid) : '<p class="muted">No classes marked yet.</p>' })()}
    <h4>Puzzles</h4><p id="dPz" class="muted small">Loading…</p><button type="button" class="btn btn-primary btn-sm" id="dAssign">Assign homework to ${esc(s.name.split(' ')[0])}</button>
    <h4>Homework</h4>${mine.length ? `<table class="stu mini-t"><thead><tr><th>Homework</th><th>Due</th><th>Done</th><th>Status</th></tr></thead><tbody>${mine.map(a => { const st = assignStat(a, uid, p, statuses[a.id + '_' + uid], tm); return `<tr><td>${esc(a.title)}</td><td>${dueText(a)}</td><td>${st.done}/${st.total}</td><td>${statePill(st.state)}</td></tr>` }).join('')}</tbody></table>` : '<p class="muted">None given yet.</p>'}
    <h4>Modules and lessons</h4>${lessonTable(p, tm)}
    <h4>Parent contact</h4><div class="row2"><label for="dpPhone">WhatsApp number<input id="dpPhone" type="tel" value="${esc(s.parentPhone || '')}"></label><label for="dpEmail">Email<input id="dpEmail" type="email" value="${esc(s.parentEmail || '')}"></label></div>
    <button type="button" class="btn btn-ghost btn-sm" id="dpSave">Save contact</button> <span class="pmsg2" id="dpMsg"></span>
    <p class="muted small">Parent login: ${s.parentUid ? esc(s.sid) + '-P' : 'none yet (use “Add parent login” in the table)'}</p>`;
  $('#dAssign').onclick = () => { showTab('homework'); $('#hWho').value = 'pick'; paintWho(); $$('#hPick input').forEach(c => { c.checked = c.value === uid }); $('#hwForm').scrollIntoView({ behavior: 'smooth', block: 'start' }) };
  loadPuzzles().then(all => { const sv = (p.puzzles || {}).solved || {}, ids = Object.keys(sv), by = {}; ids.forEach(id => { const q = all.find(x => x.id === id); if (q) by[q.l] = (by[q.l] || 0) + 1 }); const el = $('#dPz'); if (el) el.textContent = ids.length ? `${ids.length} solved · ` + Object.entries(by).map(([l, n]) => `${PZ_LEVELS[l]} ${n}`).join(' · ') + ` · best streak ${(p.puzzles || {}).best || 0}` : 'No puzzles solved yet.' }).catch(() => { const el = $('#dPz'); if (el) el.textContent = '' });
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
