import { auth, db, F, whoAmI, logout, esc, markSignedIn } from './fb.js';
const $ = (s) => document.querySelector(s);
const root = $('#portalAccount');
const MODS = window.PQ_MODULES || (window.PQ_MODULE ? [window.PQ_MODULE] : []);
const LESSONS = MODS.flatMap(m => m.lessons);
const LEVEL = { 1: 'Level 1 · Pawn (Basic)', 2: 'Level 2 · Knight (Intermediate)', 3: 'Level 3 · Queen (Advanced)' };

(async () => {
  const me = await whoAmI();
  if (!me) return (location.href = 'login.html');
  if (me.role === 'coach') return (location.href = 'coach.html');
  if (me.role !== 'student') { await F.signOut(auth); return (location.href = 'login.html') }
  if (me.profile && me.profile.mustChange) return (location.href = 'login.html');
  markSignedIn(true);
  const p = me.profile || {};
  let prog = {}; try { const s = await F.getDoc(F.doc(db, 'progress', me.user.uid)); if (s.exists()) prog = s.data() } catch {}
  // include anything saved on this device that is not uploaded yet
  try { const lp = JSON.parse(localStorage.getItem('pq-progress') || '{}'); prog.lessons = { ...lp, ...(prog.lessons || {}) }; Object.keys(lp).forEach(k => prog.lessons[k] = Math.max(lp[k], (prog.lessons[k] || 0))) } catch {}
  const L = prog.lessons || {}, passed = LESSONS.filter(l => (L[l.id] || 0) >= 70).length;
  const scores = LESSONS.map(l => L[l.id]).filter(v => v != null), avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const solved = prog.puzzles && prog.puzzles.solved ? Object.keys(prog.puzzles.solved).length : 0;
  const nextIdx = LESSONS.findIndex(l => (L[l.id] || 0) < 70);
  root.innerHTML = `
    <div class="acc-head"><div class="acc-av">${esc((p.name || p.sid || '?').split(' ').map(w => w[0]).join('').slice(0, 2))}</div>
      <div><p class="eyebrow">Student · ${esc(p.sid || '')}</p><h1>Hello, <em>${esc((p.name || 'student').split(' ')[0])}</em></h1>
      <p class="acc-sub">${esc(LEVEL[p.level] || 'Level ' + (p.level || 1))}${p.batch ? ' · ' + esc(p.batch) : ''}</p></div>
      <div class="acc-actions"><button type="button" class="btn btn-ghost btn-sm" id="accPw">Change password</button><button type="button" class="btn btn-ghost btn-sm" id="accOut">Sign out</button></div></div>
    <div class="acc-stats">
      <div><b>${passed}/${LESSONS.length}</b><span>Lessons passed</span></div>
      <div><b>${avg}%</b><span>Average mark</span></div>
      <div><b>${prog.xp || 0}</b><span>XP</span></div>
      <div><b>${solved}</b><span>Puzzles solved</span></div>
    </div>
    <div class="acc-grid">
      <div class="acc-mods">${MODS.map((m, k) => `<section class="acc-card"><h3>Level 1 · Module ${k + 1}</h3><p class="muted">${esc(m.title.en)}</p>
        <ol class="acc-lessons">${m.lessons.map((l, i) => { const v = L[l.id]; return `<li class="${v >= 70 ? 'ok' : ''}"><span class="n">${v >= 70 ? '✓' : i + 1}</span><span>${esc(l.title.en)}</span><b>${v != null ? v + '%' : '—'}</b></li>` }).join('')}</ol>
        ${k === 0 ? `<a class="btn btn-primary" href="learn.html">${nextIdx === -1 ? 'Review lessons' : 'Continue: ' + esc(LESSONS[nextIdx].title.en)} →</a>` : ''}</section>`).join('')}</div>
      <section class="acc-card"><h3>Puzzles</h3><p class="muted">Best streak ${(prog.puzzles && prog.puzzles.best) || 0}</p>
        <div class="acc-big">${solved}<small>solved</small></div><a class="btn btn-ghost" href="puzzle.html">Solve puzzles →</a>
        ${MODS.some(m => m.lessons.every(l => (L[l.id] || 0) >= 70)) ? '<div class="acc-cert">🏆 You completed a module. Open the Learn page to get your certificate.</div>' : ''}</section>
    </div>
    <form class="acc-card acc-pw" id="pwForm" hidden><h3>Change password</h3>
      <label for="pw0">Current password<input id="pw0" type="password" autocomplete="current-password"></label>
      <label for="pw1">New password<input id="pw1" type="password" autocomplete="new-password"></label>
      <label for="pw2">New password again<input id="pw2" type="password" autocomplete="new-password"></label>
      <button class="btn btn-primary btn-sm" type="submit">Save password</button><p class="pmsg2" id="pwMsg"></p></form>`;
  $('#accOut').onclick = logout;
  $('#accPw').onclick = () => { $('#pwForm').hidden = !$('#pwForm').hidden };
  $('#pwForm').onsubmit = async (e) => {
    e.preventDefault(); const m = $('#pwMsg'); const a = $('#pw1').value;
    if (a.length < 6) { m.className = 'pmsg2 err'; m.textContent = 'Use at least 6 characters.'; return }
    if (a !== $('#pw2').value) { m.className = 'pmsg2 err'; m.textContent = 'The two new passwords are different.'; return }
    try { await F.reauthenticateWithCredential(auth.currentUser, F.EmailAuthProvider.credential(auth.currentUser.email, $('#pw0').value)); await F.updatePassword(auth.currentUser, a); m.className = 'pmsg2 ok'; m.textContent = 'Password changed.'; e.target.reset() }
    catch (err) { m.className = 'pmsg2 err'; m.textContent = err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' ? 'Current password is not correct.' : 'Could not change the password: ' + (err.code || err.message) }
  };
})();
