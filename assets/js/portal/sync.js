// Saves lesson marks, XP and puzzle progress to the student's account and loads them on any device.
import { auth, db, F, whoAmI, markSignedIn } from './fb.js';
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v) } catch { return d } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
};
const local = () => ({
  lessons: LS.get('pq-progress', {}), xp: LS.get('pq-xp', 0),
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
  if (me && me.role === 'coach') {
    document.querySelectorAll('a[href="login.html"].btn').forEach(a => { a.href = 'coach.html'; a.lastChild.textContent = 'Coach portal' });
    const chip = document.getElementById('pqUserChip'); if (chip) chip.hidden = true;
  } else if (me && me.role === 'parent') {
    document.querySelectorAll('a[href="login.html"].btn').forEach(a => { a.href = 'parent.html'; a.lastChild.textContent = 'Parent portal' });
  }
  if (!me || me.role !== 'student') return
  uid = me.user.uid;
  let cloud = {}; try { const s = await F.getDoc(F.doc(db, 'progress', uid)); if (s.exists()) cloud = s.data() } catch {}
  const m = merge(local(), cloud);
  LS.set('pq-progress', m.lessons); LS.set('pq-xp', m.xp); LS.set('pqz-solved', m.puzzles.solved); LS.set('pqz-best', m.puzzles.best);
  window.dispatchEvent(new Event('pq-reload'));
  await push();
  // presence: the coach panel shows who is online and where
  const qs = new URLSearchParams(location.search), path = location.pathname;
  const onPage = /learn/.test(path) ? 'Lessons' : /puzzle/.test(path) ? (qs.get('hw') ? 'Homework puzzles' : 'Puzzles') : /task/.test(path) ? 'Board task' : 'My account';
  const beat = () => { if (document.visibilityState === 'visible') F.updateDoc(F.doc(db, 'users', uid), { lastSeen: F.serverTimestamp(), onPage }).catch(() => {}) };
  beat(); setInterval(beat, 60000); document.addEventListener('visibilitychange', beat);
  const chip = document.getElementById('pqUserChip');
  if (chip && me.profile) { chip.hidden = false; chip.querySelector('b').textContent = me.profile.name ? me.profile.name.split(' ')[0] : me.profile.sid }
})();
