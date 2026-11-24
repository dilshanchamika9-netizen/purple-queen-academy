import { app, auth, db, F, EMU, whoAmI, logout, esc, idToEmail, markSignedIn } from './fb.js';
const $ = (s) => document.querySelector(s);
const root = $('#portalCoach');
const LESSONS = (window.PQ_MODULE && window.PQ_MODULE.lessons) || [];
const LEVELS = { 1: 'L1 · Pawn', 2: 'L2 · Knight', 3: 'L3 · Queen' };
const words = ['queen', 'rook', 'knight', 'bishop', 'pawn', 'castle', 'check', 'board'];
const tempPw = () => words[Math.floor(Math.random() * words.length)] + '-' + (1000 + Math.floor(Math.random() * 9000));
let students = [], progress = {}, queue = [], coach = null;

(async () => {
  const me = await whoAmI();
  if (!me) return (location.href = 'login.html?as=coach');
  if (me.role !== 'coach') return (location.href = me.role === 'student' ? 'account.html' : 'login.html?as=coach');
  coach = me; markSignedIn(true);
  render(); await load();
  F.onSnapshot(F.query(F.collection(db, 'adminQueue'), F.orderBy('createdAt', 'desc'), F.limit(20)), s => { queue = s.docs.map(d => ({ id: d.id, ...d.data() })); paintQueue() }, () => {});
})();

function render() {
  root.innerHTML = `
  <div class="acc-head"><div class="acc-av coach">♛&#xFE0E;</div><div><p class="eyebrow">Coach panel</p><h1>Welcome, <em>${esc((coach.profile.name || coach.user.email).split(' ')[0])}</em></h1><p class="acc-sub">${esc(coach.user.email)}</p></div>
    <div class="acc-actions"><button type="button" class="btn btn-ghost btn-sm" id="cOut">Sign out</button></div></div>
  <div class="acc-stats" id="cStats"></div>
  <div class="acc-grid coach-grid2">
    <form class="acc-card" id="addForm"><h3>Add a student</h3>
      <label for="aName">Full name<input id="aName" required placeholder="e.g. Kavindu Perera"></label>
      <div class="row2"><label for="aLevel">Level<select id="aLevel"><option value="1">Level 1 · Pawn (Basic)</option><option value="2">Level 2 · Knight (Intermediate)</option><option value="3">Level 3 · Queen (Advanced)</option></select></label>
      <label for="aBatch">Batch<input id="aBatch" placeholder="e.g. Saturday 8:30 AM"></label></div>
      <button class="btn btn-primary btn-sm" type="submit">Create login</button>
      <div class="newacc" id="newAcc" hidden></div><p class="pmsg2" id="aMsg"></p></form>
    <section class="acc-card"><h3>Requests</h3><p class="muted">Password resets and removals are done automatically within about 10–15 minutes.</p><ul class="queue" id="queue"><li class="muted">No requests yet.</li></ul></section>
  </div>
  <section class="acc-card"><div class="tbl-head"><h3>Students</h3><input id="filter" type="search" placeholder="Search name, ID or batch" aria-label="Search students"></div>
    <div class="tw"><table class="stu" id="stuTable"><thead><tr><th>ID</th><th>Name</th><th>Level</th><th>Batch</th><th>Lessons</th><th>Average</th><th>XP</th><th>Puzzles</th><th>Last active</th><th></th></tr></thead><tbody><tr><td colspan="10" class="muted">Loading…</td></tr></tbody></table></div></section>`;
  $('#cOut').onclick = logout;
  $('#addForm').onsubmit = addStudent;
  $('#filter').oninput = paintTable;
}

async function load() {
  const us = await F.getDocs(F.query(F.collection(db, 'users'), F.where('role', '==', 'student')));
  students = us.docs.map(d => ({ uid: d.id, ...d.data() })).sort((a, b) => (a.sid || '').localeCompare(b.sid || ''));
  const ps = await F.getDocs(F.collection(db, 'progress'));
  progress = {}; ps.docs.forEach(d => progress[d.id] = d.data());
  paintStats(); paintTable();
}
const stat = (uid) => {
  const p = progress[uid] || {}, L = p.lessons || {};
  const vals = LESSONS.map(l => L[l.id]).filter(v => v != null);
  return { passed: LESSONS.filter(l => (L[l.id] || 0) >= 70).length, avg: vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null, xp: p.xp || 0, puzzles: p.puzzles && p.puzzles.solved ? Object.keys(p.puzzles.solved).length : 0 };
};
function paintStats() {
  const week = Date.now() - 7 * 864e5;
  const active = students.filter(s => s.lastSeen && s.lastSeen.toMillis && s.lastSeen.toMillis() > week).length;
  const done = students.filter(s => stat(s.uid).passed === LESSONS.length).length;
  $('#cStats').innerHTML = `<div><b>${students.length}</b><span>Students</span></div><div><b>${active}</b><span>Active this week</span></div><div><b>${done}</b><span>Finished Module 1</span></div><div><b>${students.reduce((a, s) => a + stat(s.uid).puzzles, 0)}</b><span>Puzzles solved</span></div>`;
}
function ago(ts) { if (!ts || !ts.toMillis) return '—'; const d = (Date.now() - ts.toMillis()) / 864e5; return d < 1 ? 'Today' : d < 2 ? 'Yesterday' : Math.floor(d) + ' days ago' }
function paintTable() {
  const f = ($('#filter').value || '').toLowerCase();
  const rows = students.filter(s => !f || [s.sid, s.name, s.batch].join(' ').toLowerCase().includes(f));
  $('#stuTable tbody').innerHTML = rows.length ? rows.map(s => { const t = stat(s.uid); return `<tr data-uid="${s.uid}">
    <td><b>${esc(s.sid)}</b></td><td>${esc(s.name)}${s.mustChange ? ' <span class="tag">new password pending</span>' : ''}</td>
    <td><select class="lv" aria-label="Level for ${esc(s.name)}">${[1, 2, 3].map(l => `<option value="${l}" ${+s.level === l ? 'selected' : ''}>${LEVELS[l]}</option>`).join('')}</select></td>
    <td><input class="bt" value="${esc(s.batch || '')}" aria-label="Batch for ${esc(s.name)}"></td>
    <td>${t.passed}/${LESSONS.length}</td><td>${t.avg == null ? '—' : t.avg + '%'}</td><td>${t.xp}</td><td>${t.puzzles}</td><td>${ago(s.lastSeen)}</td>
    <td class="acts"><button type="button" class="mini" data-a="reset">Reset password</button><button type="button" class="mini danger" data-a="delete">Remove</button></td></tr>` }).join('')
    : `<tr><td colspan="10" class="muted">${students.length ? 'No match.' : 'No students yet. Add the first one above.'}</td></tr>`;
}
root.addEventListener('change', async (e) => {
  const tr = e.target.closest('tr[data-uid]'); if (!tr) return;
  const uid = tr.dataset.uid, field = e.target.classList.contains('lv') ? 'level' : e.target.classList.contains('bt') ? 'batch' : null; if (!field) return;
  const v = field === 'level' ? +e.target.value : e.target.value.trim();
  try { await F.updateDoc(F.doc(db, 'users', uid), { [field]: v }); const s = students.find(x => x.uid === uid); s[field] = v; e.target.classList.add('saved'); setTimeout(() => e.target.classList.remove('saved'), 900) } catch { alertRow(tr, 'Could not save. Try again.') }
});
root.addEventListener('click', async (e) => {
  const b = e.target.closest('button[data-a]'); if (!b) return; const tr = b.closest('tr'), s = students.find(x => x.uid === tr.dataset.uid);
  if (b.dataset.a === 'delete' && b.dataset.sure !== '1') { b.dataset.sure = '1'; b.textContent = 'Press again to remove'; setTimeout(() => { b.dataset.sure = ''; b.textContent = 'Remove' }, 4000); return }
  try { await F.addDoc(F.collection(db, 'adminQueue'), { type: b.dataset.a, uid: s.uid, sid: s.sid, name: s.name, status: 'pending', by: coach.user.email, createdAt: F.serverTimestamp() }); b.textContent = 'Requested'; b.disabled = true }
  catch { alertRow(tr, 'Could not send the request.') }
});
function alertRow(tr, t) { tr.querySelector('.acts').insertAdjacentHTML('beforeend', `<span class="tag err">${esc(t)}</span>`) }
function paintQueue() {
  $('#queue').innerHTML = queue.length ? queue.map(q => `<li class="${q.status}"><b>${q.type === 'reset' ? 'Password reset' : 'Remove'} · ${esc(q.sid)} ${esc(q.name || '')}</b>
    <span>${q.status === 'pending' ? 'Waiting…' : q.status === 'error' ? 'Failed: ' + esc(q.error) : q.type === 'reset' ? `New password: <code>${esc(q.tempPassword)}</code>` : 'Removed'}</span></li>`).join('') : '<li class="muted">No requests yet.</li>';
  if (queue.some(q => q.status === 'done' && q.type === 'delete')) { const gone = new Set(queue.filter(q => q.status === 'done' && q.type === 'delete').map(q => q.uid)); students = students.filter(s => !gone.has(s.uid)); paintTable(); paintStats() }
}

async function addStudent(e) {
  e.preventDefault(); const m = $('#aMsg'); m.className = 'pmsg2'; m.textContent = 'Creating…';
  const name = $('#aName').value.trim(), level = +$('#aLevel').value, batch = $('#aBatch').value.trim();
  if (!name) { m.className = 'pmsg2 err'; m.textContent = 'Enter the student’s name.'; return }
  let sid;
  try {
    sid = await F.runTransaction(db, async (tx) => { const ref = F.doc(db, 'meta', 'counter'); const s = await tx.get(ref); const n = s.exists() ? s.data().next : 1; tx.set(ref, { next: n + 1 }); return 'PQ' + String(n).padStart(4, '0') });
  } catch (err) { m.className = 'pmsg2 err'; m.textContent = 'Could not get a new student ID: ' + (err.code || err.message); return }
  const pw = tempPw();
  // create the login in a separate app instance so the coach stays signed in
  const second = F.initializeApp(app.options, 'creator-' + Date.now());
  const a2 = F.getAuth(second); await F.setPersistence(a2, F.inMemoryPersistence);
  if (EMU) F.connectAuthEmulator(a2, 'http://127.0.0.1:9099', { disableWarnings: true });
  try {
    const c = await F.createUserWithEmailAndPassword(a2, idToEmail(sid), pw);
    await F.setDoc(F.doc(db, 'users', c.user.uid), { role: 'student', sid, name, level, batch, mustChange: true, createdAt: F.serverTimestamp(), createdBy: coach.user.email });
    await F.signOut(a2);
    students.push({ uid: c.user.uid, role: 'student', sid, name, level, batch, mustChange: true }); paintTable(); paintStats();
    $('#newAcc').hidden = false;
    $('#newAcc').innerHTML = `<p>Give these to <b>${esc(name)}</b>. The student chooses a new password at first sign-in.</p><div class="cred"><span>Student ID</span><b id="nId">${sid}</b><span>Password</span><b id="nPw">${esc(pw)}</b></div><button type="button" class="btn btn-ghost btn-sm" id="cpy">Copy for WhatsApp</button>`;
    $('#cpy').onclick = async () => { const t = `Purple Queen Chess Academy\nStudent login: ${location.origin}${location.pathname.replace(/coach\.html$/, 'login.html')}\nStudent ID: ${sid}\nPassword: ${pw}`; try { await navigator.clipboard.writeText(t); $('#cpy').textContent = 'Copied' } catch { $('#cpy').textContent = 'Select the text above' } };
    m.className = 'pmsg2 ok'; m.textContent = 'Student login created.'; e.target.reset();
  } catch (err) { m.className = 'pmsg2 err'; m.textContent = 'Could not create the login: ' + (err.code || err.message) }
  finally { try { await F.deleteApp(second) } catch {} }
}
