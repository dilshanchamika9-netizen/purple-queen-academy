import { auth, db, F, whoAmI, logout, esc, markSignedIn, fmtTime, today } from './fb.js';
import { feesBlock, attStat, attTable, assignStat, itemLabel, secsInLastDays, dueText, statePill, byId, MODS as LMODS } from './lms.js';
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
  let tm = {}; try { const s = await F.getDoc(F.doc(db, 'time', me.user.uid)); if (s.exists()) tm = s.data() } catch {}
  let assigns = [], st = {};
  try { const q = await F.getDocs(F.query(F.collection(db, 'assignments'), F.where('uids', 'array-contains', me.user.uid))); assigns = q.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.due || '').localeCompare(b.due || '')) } catch {}
  try { const q = await F.getDocs(F.query(F.collection(db, 'astatus'), F.where('uid', '==', me.user.uid))); q.docs.forEach(d => st[d.id] = d.data()) } catch {}
  let sess = []; try { const q = await F.getDocs(F.query(F.collection(db, 'attendance'), F.where('uids', 'array-contains', me.user.uid))); sess = q.docs.map(d => d.data()) } catch {}
  const att = attStat(sess, me.user.uid);
  let invs = []; try { const q = await F.getDocs(F.query(F.collection(db, 'invoices'), F.where('uid', '==', me.user.uid))); invs = q.docs.map(d => ({ id: d.id, ...d.data() })) } catch {}
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
      <div><b>${fmtTime(secsInLastDays(tm, 7))}</b><span>Study time, 7 days</span></div>
      <div><b>${att.pct == null ? '—' : att.pct + '%'}</b><span>Attendance</span></div>
    </div>
    <section class="acc-card" id="hwBox"></section>
    <section class="acc-card" id="feeBox"><h3>Fees</h3>${feesBlock(invs, { payBtn: true })}</section>
    <section class="acc-card"><h3>My attendance</h3>${attTable(att, me.user.uid)}</section>
    <div class="acc-grid">
      <div class="acc-mods">${MODS.map((m, k) => {
        const modOpen = k === 0 || MODS[k - 1].lessons.every(l => (L[l.id] || 0) >= 70);
        const done = m.lessons.filter(l => (L[l.id] || 0) >= 70).length;
        const nxt = m.lessons.findIndex(l => (L[l.id] || 0) < 70);
        return `<section class="acc-card${modOpen ? '' : ' locked'}"><h3>Level 1 · Module ${k + 1} <small class="acc-tag ${modOpen ? 'open' : ''}">${modOpen ? done + '/' + m.lessons.length + ' done' : 'Locked'}</small></h3><p class="muted">${esc(m.title.en)}</p>
        <ol class="acc-lessons">${m.lessons.map((l, i) => { const v = L[l.id], ok = v >= 70, open = modOpen && (i === 0 || (L[m.lessons[i - 1].id] || 0) >= 70), cur = open && i === nxt;
          const inner = `<span class="n">${ok ? '✓' : open ? i + 1 : '🔒'}</span><span>${esc(l.title.en)}</span><b>${v != null ? v + '%' : cur ? 'Start →' : open ? '—' : ''}</b>`;
          return open ? `<li class="${ok ? 'ok' : ''} ${cur ? 'cur' : ''}"><a href="learn.html?m=${k}&l=${i}">${inner}</a></li>` : `<li class="lk">${inner}</li>` }).join('')}</ol>
        ${modOpen ? `<a class="btn btn-primary" href="learn.html?m=${k}${nxt > -1 ? '&l=' + nxt : ''}">${nxt === -1 ? 'Review module' : done ? 'Continue: ' + esc(m.lessons[nxt].title.en) : 'Start module'} →</a>` : '<p class="muted">Finish every lesson in the previous module to open this one.</p>'}</section>` }).join('')}</div>
      <section class="acc-card"><h3>Puzzles</h3><p class="muted">Best streak ${(prog.puzzles && prog.puzzles.best) || 0}</p>
        <div class="acc-big">${solved}<small>solved</small></div><a class="btn btn-ghost" href="puzzle.html">Solve puzzles →</a>
        ${MODS.some(m => m.lessons.every(l => (L[l.id] || 0) >= 70)) ? '<div class="acc-cert">🏆 You completed a module. Open the Learn page to get your certificate.</div>' : ''}</section>
    </div>
    <form class="acc-card acc-pw" id="pwForm" hidden><h3>Change password</h3>
      <label for="pw0">Current password<input id="pw0" type="password" autocomplete="current-password"></label>
      <label for="pw1">New password<input id="pw1" type="password" autocomplete="new-password"></label>
      <label for="pw2">New password again<input id="pw2" type="password" autocomplete="new-password"></label>
      <button class="btn btn-primary btn-sm" type="submit">Save password</button><p class="pmsg2" id="pwMsg"></p></form>`;
  paintHw();
  function paintHw() {
    const box = $('#hwBox');
    box.innerHTML = '<h3>My homework</h3>' + (assigns.length ? '<ul class="hw-list">' + assigns.map(a => {
      const x = assignStat(a, me.user.uid, prog, st[a.id + '_' + me.user.uid], tm);
      return `<li class="${x.state}"><div class="hw-top"><b>${esc(a.title)}</b><span>Due ${dueText(a)}</span>${statePill(x.state)}</div>${a.note ? `<p class="muted">${esc(a.note)}</p>` : ''}
        <ul class="hw-items">${x.items.map((r, i) => r.it.t === 'lesson'
          ? `<li class="${r.done ? 'ok' : ''}"><span class="n">${r.done ? '✓' : '•'}</span>${(() => { const l = byId[r.it.id]; return l ? `<a href="learn.html?m=${l.mod}&l=${LMODS[l.mod].lessons.findIndex(z => z.id === l.id)}">${esc(itemLabel(r.it))}</a>` : esc(r.it.id) })()}<b>${r.mark == null ? '' : r.mark + '%'}</b></li>`
          : r.it.t === 'task' ? `<li class="${r.done ? 'ok' : ''}"><span class="n">${r.done ? '✓' : '•'}</span><a href="task.html?a=${a.id}&i=${i}">${esc(itemLabel(r.it))}</a><b>${r.done ? 'Solved' : 'Open'}</b></li>`
          : `<li class="${r.done ? 'ok' : ''}"><label><input type="checkbox" data-a="${a.id}" data-i="${i}" ${r.done ? 'checked' : ''}> ${esc(r.it.text)}</label></li>`).join('')}</ul></li>` }).join('') + '</ul>' : '<p class="muted">No homework right now.</p>');
  }
  $('#hwBox').addEventListener('change', async (e) => {
    const c = e.target.closest('input[data-a]'); if (!c) return;
    const key = c.dataset.a + '_' + me.user.uid, cur = st[key] || { aid: c.dataset.a, uid: me.user.uid, checks: {} };
    const checks = { ...cur.checks }; if (c.checked) checks[c.dataset.i] = true; else delete checks[c.dataset.i];
    const next = { aid: c.dataset.a, uid: me.user.uid, checks };
    try { await F.setDoc(F.doc(db, 'astatus', key), { ...next, updatedAt: F.serverTimestamp() }); st[key] = next; paintHw() } catch { c.checked = !c.checked }
  });
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
