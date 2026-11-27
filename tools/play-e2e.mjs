// End-to-end test of play.html: two students in two browsers (auth + firestore + database emulators).
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
const SITE = 'http://127.0.0.1:8080', AUTH = 'http://127.0.0.1:9099', FS = 'http://127.0.0.1:8085', DBH = 'http://127.0.0.1:9000', P = 'demo-pq', NS = 'demo-pq-default-rtdb';
const owner = { 'Content-Type': 'application/json', Authorization: 'Bearer owner' };
let fails = 0, n = 0; const ok = (c, m) => { n++; console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
mkdirSync('play-shots', { recursive: true });

// database rules into the namespace the page uses
const rr = await fetch(`${DBH}/.settings/rules.json?ns=${NS}`, { method: 'PUT', headers: owner, body: readFileSync('database.rules.json', 'utf8') });
ok(rr.ok, 'database rules loaded into the emulator');

async function student(sid, name) {
  const email = `${sid}@pq-students.example.com`;
  const r = await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/projects/${P}/accounts`, { method: 'POST', headers: owner, body: JSON.stringify({ email, password: 'pass1234', emailVerified: false }) });
  const uid = (await r.json()).localId;
  await fetch(`${FS}/v1/projects/${P}/databases/(default)/documents/users/${uid}`, { method: 'PATCH', headers: owner, body: JSON.stringify({ fields: { role: { stringValue: 'student' }, sid: { stringValue: sid.toUpperCase() }, name: { stringValue: name }, level: { stringValue: '1' }, mustChange: { booleanValue: false } } }) });
  return uid;
}
const uA = await student('pq0001', 'Kavindu Perera'), uB = await student('pq0002', 'Nethmi Silva');

const b = await chromium.launch(); const errs = [], logs = [];
process.on('uncaughtException', async (e) => { console.log('FAIL ' + e.message.split('\n')[0]); console.log('console:', logs.slice(-25).join('\n')); console.log('page errors:', errs); try { console.log('DB:', JSON.stringify(await fetch(`${DBH}/.json?ns=${NS}`, { headers: owner }).then(r => r.json())).slice(0, 1500)) } catch {} process.exit(1) });
async function open(sid, vp = { width: 1360, height: 860 }) {
  const ctx = await b.newContext({ viewport: vp }); const pg = await ctx.newPage();
  pg.on('pageerror', e => errs.push(sid + ': ' + e)); pg.on('dialog', d => d.accept());
  pg.on('console', m => { if (['warning', 'error'].includes(m.type())) logs.push(sid + ' ' + m.type() + ': ' + m.text().slice(0, 300)) });
  await pg.route('**/fonts.googleapis.com/**', r => r.abort());
  await pg.goto(`${SITE}/login.html?emu=1`);
  await pg.fill('#sId', sid); await pg.fill('#sPw', 'pass1234'); await pg.click('#stuForm button[type=submit]');
  await pg.waitForURL(u => !String(u).includes('login.html'), { timeout: 20000 });
  await pg.goto(`${SITE}/play.html?emu=1`);
  await pg.waitForSelector('#pvPeople', { timeout: 20000 });
  return pg;
}
const A = await open('pq0001');
const B = await open('pq0002', { width: 390, height: 844 });
ok(true, 'both students open Play');

// lobby
await A.waitForSelector('[data-sid="pq0002"]', { timeout: 15000 });
ok((await A.textContent('[data-sid="pq0002"]')).includes('Nethmi S.'), 'A sees B as "Nethmi S." (short name)');
ok((await A.textContent('[data-sid="pq0002"]')).includes('Online'), 'B shows as online');
await A.click('[data-sid="pq0002"]'); await A.click('[data-col="w"]'); await A.click('[data-tc="3"]');
ok((await A.textContent('#pvSend')).includes('Challenge Nethmi S. · 10+5'), 'challenge button names opponent and time control');
await A.click('#pvSend');
await A.waitForSelector('.pv-sent', { timeout: 10000 }); ok(true, 'A sees the waiting card');
await B.waitForSelector('[data-acc]', { timeout: 15000 });
ok((await B.textContent('.pv-inc')).includes('You play Black'), 'B sees the challenge with colours');
await B.screenshot({ path: 'play-shots/b-lobby-phone.png', fullPage: true });
const ovB = await B.evaluate(() => document.documentElement.scrollWidth - innerWidth); ok(ovB <= 0, 'phone lobby has no sideways scroll');
await B.click('[data-acc]');
await Promise.all([A.waitForSelector('#pvBoard .lsq', { timeout: 15000 }), B.waitForSelector('#pvBoard .lsq', { timeout: 15000 })]);
ok(true, 'both reach the game board');
ok(await A.isVisible('#pvCount'), 'start countdown is shown');
await A.screenshot({ path: 'play-shots/a-countdown.png' });
await A.waitForSelector('#pvOv', { state: 'hidden', timeout: 8000 });
ok(/^(10|9):\d\d$/.test((await A.textContent('#clkBot')).trim()), 'white clock shows about 10:00 (' + (await A.textContent('#clkBot')).trim() + ')');
ok(await B.evaluate(() => document.querySelector('#pvBoard .lsq').dataset.sq === 'h1'), 'board is flipped for Black (h1 top-left)');
ok(await A.evaluate(() => document.querySelector('#pvBoard .lsq').dataset.sq === 'a8'), 'board is normal for White (a8 top-left)');
ok(await A.evaluate(() => document.querySelector('[data-sq="a1"]').classList.contains('d')), 'a1 is a dark square');

const sq = (pg, s) => pg.click(`#pvBoard .lsq[data-sq="${s}"]`);
// illegal try does nothing
await sq(A, 'e2'); await sq(A, 'e5'); await A.waitForTimeout(400);
ok(await A.evaluate(() => !document.querySelector('#pvMl [data-i]')), 'illegal move e2-e5 is refused');
await sq(A, 'e2'); ok(await A.evaluate(() => document.querySelectorAll('#pvBoard .lsq.dot').length === 2), 'legal-move dots shown (e3, e4)');
await sq(A, 'e4');
await B.waitForFunction(() => document.querySelector('#pvMl [data-i="0"]') && document.querySelector('#pvMl [data-i="0"]').textContent === 'e4', null, { timeout: 10000 });
ok(true, 'B receives 1.e4');
ok(await B.evaluate(() => document.querySelector('#clkTop').classList.contains('run') === false && document.querySelector('#clkBot').classList.contains('run')), 'after 1.e4 Black clock runs on B screen');
const plies = [[B, 'e7', 'e5'], [A, 'f1', 'c4'], [B, 'b8', 'c6'], [A, 'd1', 'h5'], [B, 'g8', 'f6'], [A, 'h5', 'f7']];
for (let i = 0; i < plies.length; i++) {
  const [pg, f, t] = plies[i], other = pg === A ? B : A, idx = i + 1;
  await sq(pg, f); await sq(pg, t);
  await other.waitForFunction(k => { const e = document.querySelector(`#pvMl [data-i="${k}"]`); return e && e.textContent }, idx, { timeout: 10000 });
}
ok((await A.textContent('#pvMl')).includes('Qxf7#'), 'move list shows Qxf7#');
await A.waitForSelector('.pv-modal h3', { timeout: 10000 }); await B.waitForSelector('.pv-modal h3', { timeout: 10000 });
ok((await A.textContent('.pv-modal h3')) === 'You won by checkmate', 'A: "You won by checkmate"');
ok((await B.textContent('.pv-modal h3')) === 'You lost by checkmate', 'B: "You lost by checkmate"');
await A.screenshot({ path: 'play-shots/a-result.png' }); await B.screenshot({ path: 'play-shots/b-result-phone.png' });
const res = await fetch(`${DBH}/games.json?ns=${NS}`, { headers: owner }).then(r => r.json());
const g1 = Object.values(res)[0];
ok(g1.result && g1.result.r === '1-0' && g1.result.why === 'mate' && g1.result.by === uB, 'database: 1-0 mate written by the mated player');
ok(g1.n === 7 && Object.keys(g1.moves).length === 7, 'database: 7 half-moves stored');

// PGN download
const [dl] = await Promise.all([A.waitForEvent('download'), A.click('#rPgn')]);
const pgn = readFileSync(await dl.path(), 'utf8');
ok(pgn.includes('[White "Kavindu P."]') && pgn.includes('4. Qxf7#') && pgn.includes('[%clk'), 'PGN download has names, moves and clocks');

// replay
await A.click('#rRev'); await A.click('[data-nav="0"]');
ok(await A.evaluate(() => document.querySelectorAll('#pvBoard .lpc').length === 32), 'replay goes back to the start position');

// game 2: rematch, then abort before move 2
await B.click('#rRe');
await A.waitForSelector('#pvRemAcc', { timeout: 15000 });
ok((await A.textContent('#pvRem')).includes('wants a rematch'), 'rematch request reopens the result screen with Accept');
await A.click('#pvRemAcc');
await Promise.all([A.waitForSelector('#bDraw', { timeout: 15000 }), B.waitForSelector('#bDraw', { timeout: 15000 })]);
await A.waitForSelector('#pvOv', { state: 'hidden', timeout: 8000 });
ok((await A.textContent('#bDraw')).includes('Abort'), 'before move 2 the button is Abort');
await A.click('#bDraw');
await B.waitForSelector('.pv-modal h3', { timeout: 10000 });
ok((await B.textContent('.pv-modal h3')) === 'Game aborted', 'abort reaches the opponent');

// game 3: draw offer declined, then resign
await B.click('#rBack'); await A.click('#rBack');
await B.waitForSelector('[data-sid="pq0001"]', { timeout: 10000 }); await B.click('[data-sid="pq0001"]'); await B.click('[data-col="w"]'); await B.click('[data-tc="0"]'); await B.click('#pvSend');
await A.waitForSelector('[data-acc]', { timeout: 15000 }); await A.click('[data-acc]');
await Promise.all([A.waitForSelector('#pvBoard .lsq', { timeout: 15000 }), B.waitForSelector('#pvBoard .lsq', { timeout: 15000 })]);
await B.waitForSelector('#pvOv', { state: 'hidden', timeout: 8000 });
ok(/^[23]:\d\d$/.test((await B.textContent('#clkBot')).trim()), '3+2 game: clock about 3:00');
await sq(B, 'd2'); await sq(B, 'd4');
await A.waitForFunction(() => { const e = document.querySelector('#pvMl [data-i="0"]'); return e && e.textContent === 'd4' }, null, { timeout: 10000 });
await sq(A, 'd7'); await sq(A, 'd5');
await B.waitForFunction(() => { const e = document.querySelector('#pvMl [data-i="1"]'); return e && e.textContent === 'd5' }, null, { timeout: 10000 });
await B.waitForFunction(() => document.querySelector('#bDraw').textContent.includes('Offer draw'), null, { timeout: 5000 });
await B.click('#bDraw');
await A.waitForSelector('.pv-ban.draw', { timeout: 10000 }); ok(true, 'draw offer banner reaches A');
await A.screenshot({ path: 'play-shots/a-draw-offer.png' });
await A.click('#dDec');
await A.waitForSelector('.pv-ban.draw', { state: 'detached', timeout: 10000 }); ok(true, 'declined offer disappears');
await A.click('[data-msg="1"]');
await B.waitForFunction(() => document.querySelector('.pv-toast.on') && document.querySelector('.pv-toast').textContent.includes('Good luck'), null, { timeout: 10000 });
ok(true, 'preset message reaches the opponent');
await A.click('#bResign'); ok((await A.textContent('#bResign')).includes('Press again'), 'resign needs a second press');
await A.click('#bResign');
await B.waitForSelector('.pv-modal h3', { timeout: 10000 });
ok((await B.textContent('.pv-modal h3')) === 'You won by resignation', 'B: "You won by resignation"');
await B.screenshot({ path: 'play-shots/b-resign-phone.png' });

// lobby history
await A.click('#rBack'); await A.waitForSelector('.pv-gm', { timeout: 10000 });
const hist = await A.textContent('#pvGames');
ok(hist.includes('WIN') && hist.includes('LOSS') && hist.includes('ABORTED'), 'A games list: win, loss, aborted');
ok((await A.textContent('#kpWLD')) === '1-1-0', 'A stats: 1 won, 1 lost, 0 drawn (abort not counted)');
await A.screenshot({ path: 'play-shots/a-lobby.png', fullPage: true });

// a third student cannot open the game
const uC = await student('pq0003', 'Third Person');
const C = await open('pq0003');
await C.goto(`${SITE}/play.html?emu=1&g=${Object.keys(res)[0]}`);
await C.waitForSelector('.pv-gate h2', { timeout: 15000 });
ok((await C.textContent('.pv-gate h2')) === 'Game not found', 'another student cannot open the game');

console.log('page errors:', errs.length ? errs : 'none'); ok(!errs.length, 'no page errors');
await b.close();
console.log(`\n${n - fails}/${n} PASS`);
process.exit(fails ? 1 : 0);
