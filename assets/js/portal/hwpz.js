// Homework puzzles: saves what the student did on each puzzle (result, retries, hints) in astatus/<assignment>_<student>.
// pz[id] = { s: 's' solved | 'f' failed or skipped, r: retries used, h: hints used, w: wrong moves, cw: wrong moves in the current try }
// sub = time the student submitted; after that the rules refuse every change.
import { db, F, whoAmI } from './fb.js';
export async function openHw(aid) {
  const me = await whoAmI(); if (!me || me.role !== 'student') throw new Error('not a student');
  const uid = me.user.uid, ref = F.doc(db, 'astatus', aid + '_' + uid);
  let d = {}; const s = await F.getDoc(ref); if (s.exists()) d = s.data();
  const hw = { aid, uid, pz: d.pz || {}, sub: d.sub || null, err: false };
  hw.save = async (patch) => { try { await F.setDoc(ref, { aid, uid, ...patch, updatedAt: F.serverTimestamp() }, { merge: true }); hw.err = false; return true } catch (e) { hw.err = true; return false } };
  return hw;
}
