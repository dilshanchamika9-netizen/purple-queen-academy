// Counts the time a signed-in student actually works (page visible and used in the last 2 minutes)
// and the number of lesson attempts. Saved to /time/{uid}; coaches and parents read it.
import { db, F, whoAmI, today } from './fb.js';
const IDLE = 120000;
(async () => {
  const me = await whoAmI();
  if (!me || me.role !== 'student') return;
  const ref = F.doc(db, 'time', me.user.uid);
  let last = Date.now(), pend = {}, att = {}, sending = false;
  const touch = () => { last = Date.now() };
  ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'scroll', 'wheel'].forEach(e => addEventListener(e, touch, { passive: true, capture: true }));
  const here = () => {
    if (/puzzle\.html/.test(location.pathname)) return '_puzzles';
    try { const s = window.PQ_LEARN && window.PQ_LEARN.state; if (s) return window.PQ_MODULES[s.mi].lessons[s.li].id } catch {}
    return null;
  };
  setInterval(() => {
    if (document.visibilityState !== 'visible' || Date.now() - last > IDLE) return;
    const id = here(); if (!id) return;
    pend[id] = (pend[id] || 0) + 1;
  }, 1000);
  addEventListener('pq-attempt', (e) => { const d = e.detail || {}; if (!d.id) return; const a = att[d.id] || (att[d.id] = { a: 0, l: 0 }); a.a++; a.l = d.pct });
  async function flush() {
    if (sending) return;
    const ids = new Set([...Object.keys(pend), ...Object.keys(att)]); if (!ids.size) return;
    const snapP = pend, snapA = att; pend = {}; att = {}; sending = true;
    let total = 0; const lessons = {};
    ids.forEach(id => {
      const o = {}; if (snapP[id]) { o.s = F.increment(snapP[id]); total += snapP[id] }
      if (snapA[id]) { o.a = F.increment(snapA[id].a); o.l = snapA[id].l }
      lessons[id] = o;
    });
    try { await F.setDoc(ref, { total: F.increment(total), days: { [today()]: F.increment(total) }, lessons, updatedAt: F.serverTimestamp() }, { merge: true }) }
    catch { Object.entries(snapP).forEach(([k, v]) => { pend[k] = (pend[k] || 0) + v }); Object.entries(snapA).forEach(([k, v]) => { const a = att[k] || (att[k] = { a: 0, l: v.l }); a.a += v.a }) }
    finally { sending = false }
  }
  setInterval(flush, 30000);
  addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush() });
  window.PQ_TRACK = { flush };
})();
