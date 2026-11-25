import { auth, db, F, whoAmI, logout, esc, markSignedIn } from './fb.js';
const $ = (s) => document.querySelector(s);
const root = $('#portalTask');
(async () => {
  const me = await whoAmI();
  if (!me) return (location.href = 'login.html');
  if (me.role !== 'student') return (location.href = me.role === 'coach' ? 'coach.html' : me.role === 'parent' ? 'parent.html' : 'login.html');
  markSignedIn(true, 'student');
  const q = new URLSearchParams(location.search), aid = q.get('a'), idx = +q.get('i');
  let a = null; try { const s = await F.getDoc(F.doc(db, 'assignments', aid)); if (s.exists()) a = s.data() } catch {}
  const it = a && a.items && a.items[idx];
  if (!it || it.t !== 'task') { root.innerHTML = '<p class="muted">This task was not found.</p><a class="btn btn-ghost" href="account.html">Back to my homework</a>'; return }
  const key = aid + '_' + me.user.uid; let cur = { checks: {} };
  try { const s = await F.getDoc(F.doc(db, 'astatus', key)); if (s.exists()) cur = s.data() } catch {}
  let done = !!(cur.checks && cur.checks[idx]);
  root.innerHTML = `<div class="acc-head"><div><p class="eyebrow">Homework · ${esc(a.title)}</p><h1>Board <em>task</em></h1></div><div class="acc-actions"><a class="btn btn-ghost btn-sm" href="account.html">Back to my homework</a></div></div>
    <section class="acc-card"><p class="q big">${esc(it.q)}</p><p class="hint small">${it.kind === 'move' ? 'Click a white piece, then the square to move it to.' : 'Click the right square.'}</p>
      <div class="lp-boardwrap tk hwboard"><div class="lb" id="board"></div></div><div class="fb" id="fb" aria-live="polite"></div></section>`;
  const board = new window.PQ_Board($('#board')); board.setPos(window.PQ_FP(it.fen), false); board.decorate({ files: true, ranks: true });
  const fb = $('#fb'); let sel = null, over = false;
  if (done) { fb.className = 'fb ok'; fb.textContent = 'You already solved this one. You can try again for practice.' }
  const win = async () => {
    over = true; fb.className = 'fb ok'; fb.textContent = 'Right! Well done.';
    if (!done) { const checks = { ...(cur.checks || {}), [idx]: true }; try { await F.setDoc(F.doc(db, 'astatus', key), { aid, uid: me.user.uid, checks, updatedAt: F.serverTimestamp() }); done = true; cur.checks = checks } catch { fb.className = 'fb err'; fb.textContent = 'Right! But it could not be saved. Check your internet and try again.' } }
  };
  board.click = (s) => {
    if (over) return;
    if (it.kind === 'square') { const ok = it.ans.includes(s); board.mark(s, ok ? 'good' : 'bad', ok ? 0 : 700); if (ok) return win(); fb.className = 'fb err'; fb.textContent = 'Not this one. Try again.'; return }
    const p = board.pos()[s];
    if (p && p[0] === 'w') { if (sel) board.sq[sel].classList.remove('sel'); sel = s; board.sq[s].classList.add('sel'); return }
    if (!sel) return;
    const from = sel; board.sq[from].classList.remove('sel'); sel = null;
    if (it.ans.includes(from + s)) { board.move(from, s, null, true); return win() }
    board.mark(s, 'bad', 700); fb.className = 'fb err'; fb.textContent = 'Not this move. Try again.';
  };
})();
