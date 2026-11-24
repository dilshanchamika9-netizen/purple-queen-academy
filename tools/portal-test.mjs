// End-to-end test of the student portal against the Firebase emulators (run by portal-test.yml).
import { chromium } from 'playwright';
import { execSync } from 'node:child_process';
const SITE = 'http://127.0.0.1:8080', AUTH = 'http://127.0.0.1:9099', FS = 'http://127.0.0.1:8085', P = 'demo-pq';
const owner = { 'Content-Type': 'application/json', Authorization: 'Bearer owner' };
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
async function addAuthUser(email, password, verified) {
  const r = await fetch(`${AUTH}/identitytoolkit.googleapis.com/v1/projects/${P}/accounts`, { method: 'POST', headers: owner, body: JSON.stringify({ email, password, emailVerified: verified }) });
  return (await r.json()).localId;
}
const fsDoc = (path) => fetch(`${FS}/v1/projects/${P}/databases/(default)/documents/${path}`, { headers: owner }).then(r => r.json());
const fsSet = (path, fields) => fetch(`${FS}/v1/projects/${P}/databases/(default)/documents/${path}`, { method: 'PATCH', headers: owner, body: JSON.stringify({ fields }) });

// seed: one listed coach (verified), one stranger (verified, not listed)
await addAuthUser('coach@test.lk', 'coachpass1', true);
await fsSet('coaches/coach@test.lk', { name: { stringValue: 'Test Coach' }, email: { stringValue: 'coach@test.lk' } });
await addAuthUser('stranger@test.lk', 'strangerpass1', true);

const b = await chromium.launch();
const errs = [];
const page = async () => { const ctx = await b.newContext(); const pg = await ctx.newPage(); pg.on('pageerror', e => errs.push(String(e))); await pg.route('**/fonts.googleapis.com/**', r => r.abort()); return pg };

// 1) stranger cannot use the coach panel
let pg = await page();
await pg.goto(`${SITE}/login.html?emu=1&as=coach`);
await pg.fill('#cEmail', 'stranger@test.lk'); await pg.fill('#cPw', 'strangerpass1'); await pg.click('#coachForm button[type=submit]');
await pg.waitForTimeout(2500);
ok((await pg.textContent('#cMsg')).includes('not registered'), 'unlisted email is refused as coach');
await pg.context().close();

// 2) coach signs in and creates a student
pg = await page();
await pg.goto(`${SITE}/login.html?emu=1&as=coach`);
await pg.fill('#cEmail', 'coach@test.lk'); await pg.fill('#cPw', 'coachpass1'); await pg.click('#coachForm button[type=submit]');
await pg.waitForURL('**/coach.html', { timeout: 15000 }); ok(true, 'coach reaches coach panel');
await pg.waitForSelector('#addForm');
await pg.fill('#aName', 'Kavindu Perera'); await pg.selectOption('#aLevel', '1'); await pg.fill('#aBatch', 'Saturday 8:30 AM');
await pg.click('#addForm button[type=submit]');
await pg.waitForSelector('#nId', { timeout: 15000 });
const sid = (await pg.textContent('#nId')).trim(), tmp = (await pg.textContent('#nPw')).trim();
ok(sid === 'PQ0001', 'first student gets ID PQ0001 (got ' + sid + ')');
ok((await pg.textContent('#stuTable tbody')).includes('Kavindu'), 'student appears in the coach table');
// second student to test isolation
await pg.fill('#aName', 'Second Student'); await pg.click('#addForm button[type=submit]');
await pg.waitForFunction(() => document.querySelector('#nId') && document.querySelector('#nId').textContent === 'PQ0002', null, { timeout: 15000 });
ok(true, 'second student gets PQ0002');
const coachPage = pg;

// 3) student first login: must choose a password
pg = await page();
await pg.goto(`${SITE}/login.html?emu=1`);
await pg.fill('#sId', 'pq0001'); await pg.fill('#sPw', tmp); await pg.click('#stuForm button[type=submit]');
await pg.waitForSelector('#changeForm:not([hidden])', { timeout: 15000 }); ok(true, 'first login asks for a new password');
await pg.fill('#ch1', 'mypass99'); await pg.fill('#ch2', 'mypass99'); await pg.click('#changeForm button[type=submit]');
await pg.waitForURL('**/account.html', { timeout: 15000 });
await pg.waitForSelector('.acc-stats', { timeout: 15000 });
ok((await pg.textContent('#portalAccount')).includes('Kavindu'), 'account page shows the student');

// 4) progress sync: pass lesson 1 practice on learn.html, then check Firestore
await pg.goto(`${SITE}/learn.html`); await pg.waitForTimeout(2500);
await pg.click('.mode button[data-mode="practice"]');
const tasks = await pg.evaluate(() => window.PQ_PRACTICE.board);
for (const t of tasks) {
  if (t.type === 'choice') await pg.click(`.opts button[data-k="${t.a}"]`);
  else if (t.type === 'square') await pg.click(`#board .lsq[data-sq="${t.ans[0]}"]`);
  await pg.click('#nxBtn');
}
await pg.waitForTimeout(4000);
const users = await fetch(`${FS}/v1/projects/${P}/databases/(default)/documents/users`, { headers: owner }).then(r => r.json());
const s1 = users.documents.find(d => d.fields.sid.stringValue === 'PQ0001'), s2 = users.documents.find(d => d.fields.sid.stringValue === 'PQ0002');
const uid1 = s1.name.split('/').pop(), uid2 = s2.name.split('/').pop();
const prog = await fsDoc('progress/' + uid1);
ok(prog.fields && prog.fields.lessons && prog.fields.lessons.mapValue.fields.board && +prog.fields.lessons.mapValue.fields.board.integerValue === 100, 'lesson mark saved to the account (board = 100%)');

// 5) rules: student cannot read another student's data or change own level
const denied = await pg.evaluate(async (uid2) => {
  const m = await import('./assets/js/portal/fb.js');
  const r = {};
  try { await m.F.getDoc(m.F.doc(m.db, 'progress', uid2)); r.otherProgress = 'allowed' } catch (e) { r.otherProgress = e.code }
  try { await m.F.getDoc(m.F.doc(m.db, 'users', uid2)); r.otherUser = 'allowed' } catch (e) { r.otherUser = e.code }
  try { await m.F.updateDoc(m.F.doc(m.db, 'users', m.auth.currentUser.uid), { level: 3 }); r.ownLevel = 'allowed' } catch (e) { r.ownLevel = e.code }
  try { await m.F.getDocs(m.F.collection(m.db, 'users')); r.listUsers = 'allowed' } catch (e) { r.listUsers = e.code }
  return r;
}, uid2);
ok(denied.otherProgress === 'permission-denied', 'student cannot read another student’s progress');
ok(denied.otherUser === 'permission-denied', 'student cannot read another student’s profile');
ok(denied.ownLevel === 'permission-denied', 'student cannot change own level');
ok(denied.listUsers === 'permission-denied', 'student cannot list students');

// 6) coach sees the mark and requests a password reset; admin job processes it
await coachPage.reload(); await coachPage.waitForSelector('#stuTable tbody tr[data-uid]', { timeout: 15000 });
const row = await coachPage.textContent(`#stuTable tr[data-uid="${uid1}"]`);
ok(row.includes('1/17') && row.includes('100%'), 'coach table shows 1/17 lessons and 100%');
await coachPage.click(`#stuTable tr[data-uid="${uid1}"] button[data-a="reset"]`);
await coachPage.waitForTimeout(1500);
execSync('node tools/portal-admin.mjs', { stdio: 'inherit', env: { ...process.env, FIRESTORE_EMULATOR_HOST: '127.0.0.1:8085', FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099', GCLOUD_PROJECT: P } });
await coachPage.waitForSelector('#queue code', { timeout: 15000 });
const newPw = (await coachPage.textContent('#queue code')).trim();
ok(/^[a-z]+-\d{4}$/.test(newPw), 'coach sees the new temporary password ' + newPw);
pg = await page();
await pg.goto(`${SITE}/login.html?emu=1`);
await pg.fill('#sId', 'PQ0001'); await pg.fill('#sPw', newPw); await pg.click('#stuForm button[type=submit]');
await pg.waitForSelector('#changeForm:not([hidden])', { timeout: 15000 }); ok(true, 'student signs in with the reset password and must choose a new one');

// 7) phone width: no sideways scroll on portal pages
await pg.setViewportSize({ width: 390, height: 844 });
for (const p of ['login.html', 'account.html']) { await pg.goto(`${SITE}/${p}`); await pg.waitForTimeout(1500); const sw = await pg.evaluate(() => document.documentElement.scrollWidth); ok(sw <= 390, `${p} fits a phone (${sw}px)`) }
await coachPage.setViewportSize({ width: 390, height: 844 }); await coachPage.waitForTimeout(500);
ok(await coachPage.evaluate(() => document.documentElement.scrollWidth) <= 390, 'coach panel fits a phone');

ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs.slice(0, 3)));
await b.close();
console.log(fails ? `\n${fails} FAILED` : '\nALL PASSED');
process.exit(fails ? 1 : 0);
