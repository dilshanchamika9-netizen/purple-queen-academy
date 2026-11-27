// Live check of the real Realtime Database: two temporary students play a few moves, then everything is removed.
import admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getDatabase, ref, set, update, get, remove, serverTimestamp as ST } from 'firebase/database';
const URL = 'https://purple-queen-38407-default-rtdb.asia-southeast1.firebasedatabase.app';
admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)), databaseURL: URL });
const cfg = { apiKey: 'AIzaSyCqXiPLDV0T3ASvrQyRg-6f0taUpedwngg', authDomain: 'purple-queen-38407.firebaseapp.com', projectId: 'purple-queen-38407', databaseURL: URL };
let n = 0, fails = 0; const ok = (c, m) => { n++; console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
const sids = ['pqsmoke1', 'pqsmoke2'], users = [];
async function client(sid) {
  const email = `${sid}@pq-students.example.com`;
  const u = await admin.auth().createUser({ email, password: 'Smoke-' + Math.random().toString(36).slice(2) + 'A1' }); users.push(u.uid);
  const app = initializeApp(cfg, sid); await signInWithCustomToken(getAuth(app), await admin.auth().createCustomToken(u.uid));
  return { uid: u.uid, sid, db: getDatabase(app) };
}
const BASE = 600000, INC = 5000;
try {
  const A = await client(sids[0]), B = await client(sids[1]);
  ok(true, 'two temporary students signed in');
  await set(ref(A.db, `dir/${A.sid}`), { uid: A.uid, name: 'Smoke A.', on: true, st: 'lobby', at: ST() }); ok(true, 'A writes own directory entry');
  let bad = false; await set(ref(A.db, `dir/${B.sid}`), { uid: A.uid, name: 'x' }).catch(() => { bad = true }); ok(bad, 'A cannot write B directory entry');
  await set(ref(B.db, `dir/${B.sid}`), { uid: B.uid, name: 'Smoke B.', on: true, st: 'lobby', at: ST() });
  ok(Object.keys((await get(ref(A.db, 'dir'))).val()).includes(B.sid), 'A sees B in the classmate list');
  await set(ref(A.db, `ch/${B.uid}/${A.uid}`), { name: 'Smoke A.', sid: A.sid, base: BASE, inc: INC, col: 'w', rated: false, at: ST() }); ok(true, 'A challenges B');
  const g = 'smoke' + Date.now().toString(36);
  await set(ref(B.db, `games/${g}`), { meta: { w: A.uid, b: B.uid, wn: 'Smoke A.', bn: 'Smoke B.', base: BASE, inc: INC, ns: 180000, rated: false, watch: false, startAt: ST(), by: B.uid }, n: 0, clk: { t: Date.now() + 3000, w: BASE, b: BASE } });
  ok(true, 'B accepts: game created with server start time');
  await new Promise(r => setTimeout(r, 3500));
  const mv = (c, i, s, clk) => update(ref(c.db, `games/${g}`), { n: i + 1, [`moves/${i}`]: { s, t: ST() }, clk: { t: ST(), ...clk } });
  await mv(A, 0, 'e2e4', { w: BASE + INC - 500, b: BASE }).catch(e => { ok(false, 'white e2e4 (' + e.message + ')') });
  const n1 = (await get(ref(A.db, `games/${g}/n`))).val(); ok(n1 === 1, 'white move accepted, n = 1');
  let cheat = false; await mv(A, 1, 'e7e5', { w: BASE, b: BASE }).catch(() => { cheat = true }); ok(cheat, 'white cannot move for black');
  let big = false; await update(ref(B.db, `games/${g}`), { n: 2, 'moves/1': { s: 'e7e5', t: ST() }, clk: { t: ST(), w: BASE + INC - 500, b: BASE + 60000 } }).catch(() => { big = true }); ok(big, 'black cannot add 60 s to own clock');
  await mv(B, 1, 'e7e5', { w: BASE + INC - 500, b: BASE + INC - 500 }); ok((await get(ref(B.db, `games/${g}/n`))).val() === 2, 'black move accepted, n = 2');
  let spy = false; const out = await get(ref(getDatabase(initializeApp(cfg, 'x')), `games/${g}`)).catch(() => { spy = true }); ok(spy, 'signed-out user cannot read the game');
  await set(ref(A.db, `games/${g}/result`), { r: '0-1', why: 'resign', by: A.uid, t: ST() }); ok(true, 'white resigns, result stored');
  let twice = false; await set(ref(B.db, `games/${g}/result`), { r: '1-0', why: 'resign', by: B.uid, t: ST() }).catch(() => { twice = true }); ok(twice, 'result cannot be changed afterwards');
  await set(ref(A.db, `ug/${A.uid}/${g}`), { opp: B.uid, oppName: 'Smoke B.', col: 'w', r: '0-1', why: 'resign', tc: '10+5', rated: false, t: ST() }); ok(true, 'own game list entry saved');
  const adb = admin.database();
  await adb.ref(`games/${g}`).remove(); await adb.ref(`ch/${B.uid}`).remove(); await adb.ref(`ug/${A.uid}`).remove(); await adb.ref(`pres/${g}`).remove();
  await adb.ref(`dir/${sids[0]}`).remove(); await adb.ref(`dir/${sids[1]}`).remove();
  ok(true, 'test data removed');
} catch (e) { console.log('FAIL exception: ' + e.message); fails++ }
finally { for (const u of users) await admin.auth().deleteUser(u).catch(() => {}); console.log(`\n${n - fails}/${n} PASS`); process.exit(fails ? 1 : 0) }
