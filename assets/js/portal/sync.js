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
  if (!me || me.role !== 'student') { if (!me) markSignedIn(false); return }
  uid = me.user.uid;
  let cloud = {}; try { const s = await F.getDoc(F.doc(db, 'progress', uid)); if (s.exists()) cloud = s.data() } catch {}
  const m = merge(local(), cloud);
  LS.set('pq-progress', m.lessons); LS.set('pq-xp', m.xp); LS.set('pqz-solved', m.puzzles.solved); LS.set('pqz-best', m.puzzles.best);
  window.dispatchEvent(new Event('pq-reload'));
  await push();
  try { await F.updateDoc(F.doc(db, 'users', uid), { lastSeen: F.serverTimestamp() }) } catch {}
  const chip = document.getElementById('pqUserChip');
  if (chip && me.profile) { chip.hidden = false; chip.querySelector('b').textContent = me.profile.name ? me.profile.name.split(' ')[0] : me.profile.sid }
})();
