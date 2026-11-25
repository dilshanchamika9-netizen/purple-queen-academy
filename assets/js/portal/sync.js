// Saves lesson marks, XP and puzzle progress to the student's account and loads them on any device.
import { auth, db, F, whoAmI, markSignedIn } from './fb.js';
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v) } catch { return d } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
};
const local = () => ({
  lessons: LS.get('pq-progress', {}), xp: LS.get('pq-xp', 0), epoch: LS.get('pq-epoch', 0),
  puzzles: { solved: LS.get('pqz-solved', {}), best: LS.get('pqz-best', 0) },
});
function merge(a, b) {
  const lessons = { ...a.lessons }; Object.entries(b.lessons || {}).forEach(([k, v]) => { lessons[k] = Math.max(lessons[k] || 0, v) });
  return {
    lessons, xp: Math.max(a.xp || 0, b.xp || 0),
    puzzles: { solved: { ...(a.puzzles && a.puzzles.solved), ...(b.puzzles && b.puzzles.solved) }, best: Math.max((a.puzzles && a.puzzles.best) || 0, (b.puzzles && b.puzzles.best) || 0) },
  };
}
let uid = null, timer = null, last = '';
async function push() {
  if (!uid) return; const data = local(); const key = JSON.stringify(data); if (key === last) return; last = key;
  try { await F.setDoc(F.doc(db, 'progress', uid), { ...data, updatedAt: F.serverTimestamp() }) } catch (e) { last = '' }
}
window.addEventListener('pq-saved', () => { clearTimeout(timer); timer = setTimeout(push, 1500) });
addEventListener('pagehide', push);

(async () => {
  const me = await whoAmI();
  const okAccess = !!me && (me.role === 'student' || me.role === 'coach');
  if (!me) markSignedIn(false); else { try { localStorage.setItem('pq-access', okAccess ? '1' : '0'); localStorage.setItem('pq-role', me.role) } catch {} }
  window.dispatchEvent(new Event('pq-auth'));
  if (me && me.role === 'student') { try { if (me.profile && me.profile.level) localStorage.setItem('pq-level', String(me.profile.level)) } catch {} }
  // signed in: the Login menu becomes one button to the right portal
  if (me && ['student', 'coach', 'parent'].includes(me.role)) {
    const lg = document.getElementById('pqLogin'), pt = document.getElementById('pqPortal');
    if (lg && pt) { lg.hidden = true; pt.hidden = false; pt.href = me.role === 'coach' ? 'coach.html' : me.role === 'parent' ? 'parent.html' : 'account.html'; pt.querySelector('span').textContent = me.role === 'coach' ? 'Coach portal' : me.role === 'parent' ? 'Parent portal' : 'My portal' }
    document.querySelectorAll('.nav-portal').forEach(a => { a.href = me.role === 'coach' ? 'coach.html' : me.role === 'parent' ? 'parent.html' : 'account.html'; a.textContent = me.role === 'coach' ? 'Coach portal' : me.role === 'parent' ? 'Parent portal' : 'My portal' });
  }
  if (!me || me.role !== 'student') return
  uid = me.user.uid;
  let cloud = {}; try { const s = await F.getDoc(F.doc(db, 'progress', uid)); if (s.exists()) cloud = s.data() } catch {}
  // a coach/admin reset (epoch raised on the server) wipes lesson marks and XP kept on this device, so old marks cannot come back
  if ((cloud.epoch || 0) > LS.get('pq-epoch', 0)) { LS.set('pq-progress', {}); LS.set('pq-xp', 0); LS.set('pq-epoch', cloud.epoch); try { Object.keys(localStorage).filter(k => /^pq-(li|mi)/.test(k)).forEach(k => localStorage.removeItem(k)) } catch {} }
  const m = merge(local(), cloud);
  LS.set('pq-progress', m.lessons); LS.set('pq-xp', m.xp); LS.set('pqz-solved', m.puzzles.solved); LS.set('pqz-best', m.puzzles.best);
  window.dispatchEvent(new Event('pq-reload'));
  await push();
  // presence: the coach panel shows who is online and where
  const qs = new URLSearchParams(location.search), path = location.pathname;
  const onPage = /learn|lesson|course/.test(path) ? 'Lessons' : /profile/.test(path) ? 'My profile' : /homework/.test(path) ? 'Homework' : /puzzle|practice/.test(path) ? (qs.get('hw') ? 'Homework puzzles' : 'Puzzles') : /task/.test(path) ? 'Board task' : 'My account';
  const beat = () => { if (document.visibilityState === 'visible') F.updateDoc(F.doc(db, 'users', uid), { lastSeen: F.serverTimestamp(), onPage }).catch(() => {}) };
  beat(); setInterval(beat, 60000); document.addEventListener('visibilitychange', beat);
})();
