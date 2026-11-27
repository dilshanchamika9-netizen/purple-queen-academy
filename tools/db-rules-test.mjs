// Realtime Database rules test for live games (run by play-test.yml on the database emulator).
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { ref, set, update, get, remove, serverTimestamp as ST } from 'firebase/database';
import { readFileSync } from 'node:fs';

const env = await initializeTestEnvironment({
  projectId: 'demo-pq',
  database: { rules: readFileSync('database.rules.json', 'utf8'), host: '127.0.0.1', port: 9000 },
});
let fails = 0, n = 0;
const t = async (name, p) => { n++; try { await p; console.log('PASS ' + name) } catch (e) { fails++; console.log('FAIL ' + name + ' :: ' + (e && e.message || e)) } };
const ok = (name, p) => t(name, assertSucceeds(p));
const no = (name, p) => t(name, assertFails(p));

const stu = (uid, sid) => env.authenticatedContext(uid, { email: `${sid}@pq-students.example.com`, email_verified: false }).database();
const A = stu('uA', 'pq0001'), Bb = stu('uB', 'pq0002'), C = stu('uC', 'pq0003');
const K = env.authenticatedContext('coach', { email: 'coach@test.lk', email_verified: true }).database();
const admin = (fn) => env.withSecurityRulesDisabled(c => fn(c.database()));
await admin(db => set(ref(db, 'staff/coach'), true));

const BASE = 60000, INC = 5000, NS = 180000;
const meta = (over = {}) => ({ w: 'uA', b: 'uB', wn: 'A', bn: 'B', base: BASE, inc: INC, ns: NS, rated: false, watch: false, startAt: ST(), by: 'uB', ...over });
const fresh = (over = {}) => ({ meta: meta(over), n: 0, clk: { t: ST(), w: over.base || BASE, b: over.base || BASE } });
const mv = (db, g, i, s, clk) => update(ref(db, `games/${g}`), { n: i + 1, [`moves/${i}`]: { s, t: ST() }, clk: { t: ST(), ...clk } });

// directory
await ok('student writes own directory entry', set(ref(A, 'dir/pq0001'), { uid: 'uA', name: 'Kavindu P.' }));
await no('student cannot write another ID', set(ref(A, 'dir/pq0002'), { uid: 'uA', name: 'X' }));
await no('directory uid must be own uid', set(ref(A, 'dir/pq0001'), { uid: 'uB', name: 'X' }));
await no('coach is not a student entry', set(ref(K, 'dir/coach'), { uid: 'coach', name: 'X' }));
await ok('signed-in user reads directory', get(ref(C, 'dir')));

// challenges
await no('B cannot forge a challenge from A to himself', set(ref(Bb, 'ch/uB/uA'), { name: 'X', base: BASE, inc: INC }));
await ok('A challenges B', set(ref(A, 'ch/uB/uA'), { name: 'Kavindu P.', base: BASE, inc: INC, col: 'r', at: ST() }));
await no('C cannot fake a challenge from A', set(ref(C, 'ch/uB/uA'), { name: 'X', base: BASE, inc: INC }));
await ok('B reads incoming challenges', get(ref(Bb, 'ch/uB')));
await no('C cannot read B challenges', get(ref(C, 'ch/uB')));

// game creation
await no('C cannot create a game for A v B', set(ref(C, 'games/g0'), fresh({ by: 'uC' })));
await no('A cannot create without a challenge from B', set(ref(A, 'games/g0'), fresh({ by: 'uA' })));
await no('start time must be server time', set(ref(Bb, 'games/g0'), { ...fresh(), meta: meta({ startAt: Date.now() - 999999 }) }));
await no('clock must equal base time', set(ref(Bb, 'games/g0'), { ...fresh(), clk: { t: ST(), w: 999999, b: BASE } }));
await no('base time range checked', set(ref(Bb, 'games/g0'), fresh({ base: 10000 })));
await ok('B accepts and creates game g1', set(ref(Bb, 'games/g1'), fresh()));
await no('game cannot be created twice', set(ref(Bb, 'games/g1'), fresh()));
await ok('coach creates game g2 (arbiter)', set(ref(K, 'games/g2'), fresh({ by: 'coach', w: 'uC', b: 'uA' })));

// reading
await ok('player A reads g1', get(ref(A, 'games/g1')));
await no('C cannot read g1', get(ref(C, 'games/g1')));
await ok('coach reads g1', get(ref(K, 'games/g1')));

// moves
await no('black cannot move first', mv(Bb, 'g1', 0, 'e7e5', { w: BASE, b: BASE + INC }));
await no('bad move text refused', mv(A, 'g1', 0, 'e4', { w: BASE + INC, b: BASE }));
await no('white cannot give itself extra time', mv(A, 'g1', 0, 'e2e4', { w: BASE + INC + 5000, b: BASE }));
await no('white cannot change black clock', mv(A, 'g1', 0, 'e2e4', { w: BASE + INC, b: BASE - 30000 }));
await no('wrong move index refused', update(ref(A, 'games/g1'), { n: 1, 'moves/5': { s: 'e2e4', t: ST() }, clk: { t: ST(), w: BASE + INC, b: BASE } }));
await no('two moves at once refused', update(ref(A, 'games/g1'), { n: 2, 'moves/0': { s: 'e2e4', t: ST() }, 'moves/1': { s: 'e7e5', t: ST() }, clk: { t: ST(), w: BASE + INC, b: BASE } }));
await ok('white plays e2e4', mv(A, 'g1', 0, 'e2e4', { w: BASE + INC, b: BASE }));
await no('white cannot move twice', mv(A, 'g1', 1, 'd2d4', { w: BASE + INC, b: BASE }));
await no('C cannot move for black', mv(C, 'g1', 1, 'e7e5', { w: BASE + INC, b: BASE + INC }));
await ok('black plays e7e5', mv(Bb, 'g1', 1, 'e7e5', { w: BASE + INC, b: BASE + INC }));
await no('a played move cannot be rewritten', update(ref(A, 'games/g1'), { n: 3, 'moves/1': { s: 'e7e6', t: ST() }, clk: { t: ST(), w: BASE + INC, b: BASE + INC } }));
const snap = (await get(ref(A, 'games/g1/n'))).val();
await t('move count is 2', snap === 2 ? Promise.resolve() : Promise.reject('n=' + snap));

// results
await no('abort refused after 2 moves', set(ref(A, 'games/g1/result'), { r: '*', why: 'abort', by: 'uA', t: ST() }));
await no('time claim refused while clock is running', set(ref(Bb, 'games/g1/result'), { r: '0-1', why: 'time', by: 'uB', t: ST() }));
await no('agree refused without an offer', set(ref(A, 'games/g1/result'), { r: '1/2-1/2', why: 'agree', by: 'uA', t: ST() }));
await no('mate cannot be claimed by the winner', set(ref(Bb, 'games/g1/result'), { r: '0-1', why: 'mate', by: 'uB', t: ST() }));
await no('resign must be a loss for the resigner', set(ref(A, 'games/g1/result'), { r: '1-0', why: 'resign', by: 'uA', t: ST() }));
await no('result must name the writer', set(ref(A, 'games/g1/result'), { r: '0-1', why: 'resign', by: 'uB', t: ST() }));
await no('offer must be by the writer', set(ref(A, 'games/g1/offer'), { by: 'uB', n: 2 }));
await ok('white offers a draw', set(ref(A, 'games/g1/offer'), { by: 'uA', n: 2 }));
await no('the offerer cannot accept own offer', set(ref(A, 'games/g1/result'), { r: '1/2-1/2', why: 'agree', by: 'uA', t: ST() }));
await ok('black accepts the draw', set(ref(Bb, 'games/g1/result'), { r: '1/2-1/2', why: 'agree', by: 'uB', t: ST() }));
await no('result cannot be written twice', set(ref(A, 'games/g1/result'), { r: '0-1', why: 'resign', by: 'uA', t: ST() }));
await no('no moves after the result', mv(A, 'g1', 2, 'g1f3', { w: BASE + INC, b: BASE + INC }));
await ok('coach overrides a result', set(ref(K, 'games/g1/result'), { r: '1-0', why: 'arbiter', by: 'coach', t: ST() }));

// resign and abort on a new game
await admin(db => set(ref(db, 'ch/uB/uA'), { name: 'A', base: BASE, inc: INC }));
await ok('game g3 created', set(ref(Bb, 'games/g3'), fresh()));
await ok('abort allowed before 2 moves', set(ref(A, 'games/g3/result'), { r: '*', why: 'abort', by: 'uA', t: ST() }));
await ok('game g4 created', set(ref(Bb, 'games/g4'), fresh()));
await ok('black resigns', set(ref(Bb, 'games/g4/result'), { r: '1-0', why: 'resign', by: 'uB', t: ST() }));

// clocks run out (seeded in the past)
const past = (ms) => Date.now() - ms;
await admin(db => set(ref(db, 'games/g5'), { meta: { ...meta(), startAt: past(70000) }, n: 0, clk: { t: past(70000), w: BASE, b: BASE } }));
await no('flagged white cannot move', mv(A, 'g5', 0, 'e2e4', { w: 0, b: BASE }));
await ok('black claims win on time', set(ref(Bb, 'games/g5/result'), { r: '0-1', why: 'time', by: 'uB', t: ST() }));
await admin(db => set(ref(db, 'games/g6'), { meta: { ...meta(), base: 600000, startAt: past(200000) }, n: 0, clk: { t: past(200000), w: 600000, b: 600000 } }));
await no('white cannot claim no-show of itself', set(ref(A, 'games/g6/result'), { r: '0-1', why: 'noshow', by: 'uA', t: ST() }));
await no('time claim refused (clock not out)', set(ref(Bb, 'games/g6/result'), { r: '0-1', why: 'time', by: 'uB', t: ST() }));
await ok('black claims white no-show after 3 min', set(ref(Bb, 'games/g6/result'), { r: '0-1', why: 'noshow', by: 'uB', t: ST() }));
await admin(db => set(ref(db, 'games/g7'), { meta: { ...meta(), base: 600000, startAt: past(30000) }, n: 0, clk: { t: past(30000), w: 600000, b: 600000 } }));
await no('no-show refused before 3 min', set(ref(Bb, 'games/g7/result'), { r: '0-1', why: 'noshow', by: 'uB', t: ST() }));
await ok('mated side (white to move) writes mate', set(ref(A, 'games/g7/result'), { r: '0-1', why: 'mate', by: 'uA', t: ST() }));

// presence
await ok('player marks own presence', set(ref(A, 'pres/g1/uA'), true));
await no('cannot mark another player present', set(ref(A, 'pres/g1/uB'), true));
await ok('A removes own challenge', remove(ref(A, 'ch/uB/uA')));

await env.cleanup();
console.log(`\n${n - fails}/${n} PASS`);
process.exit(fails ? 1 : 0);
