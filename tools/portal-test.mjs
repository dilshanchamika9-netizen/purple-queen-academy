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
const pid = (await pg.textContent('#nPId')).trim(), ppw = (await pg.textContent('#nPPw')).trim();
ok(pid === 'PQ0001-P', 'parent login is created with the student (got ' + pid + ')');
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

// 5b) parent login, homework, study time
let pp = await page();
await pp.goto(`${SITE}/login.html?emu=1`);
await pp.fill('#sId', 'pq0001-p'); await pp.fill('#sPw', ppw); await pp.click('#stuForm button[type=submit]');
await pp.waitForSelector('#changeForm:not([hidden])', { timeout: 15000 }); ok(true, 'parent first login asks for a new password');
await pp.fill('#ch1', 'parentpw1'); await pp.fill('#ch2', 'parentpw1'); await pp.click('#changeForm button[type=submit]');
await pp.waitForURL('**/parent.html', { timeout: 15000 });
await pp.waitForSelector('#portalParent .acc-stats', { timeout: 15000 });
const ptxt = await pp.textContent('#portalParent');
ok(ptxt.includes('Kavindu') && ptxt.includes('1/40'), 'parent page shows the child and 1/40 lessons');
const pden = await pp.evaluate(async ([uid1, uid2]) => {
  const m = await import('./assets/js/portal/fb.js'); const r = {};
  const t = async (k, f) => { try { await f(); r[k] = 'allowed' } catch (e) { r[k] = e.code } };
  await t('ownChildProgress', () => m.F.getDoc(m.F.doc(m.db, 'progress', uid1)));
  await t('otherProgress', () => m.F.getDoc(m.F.doc(m.db, 'progress', uid2)));
  await t('otherTime', () => m.F.getDoc(m.F.doc(m.db, 'time', uid2)));
  await t('changeChild', () => m.F.updateDoc(m.F.doc(m.db, 'users', m.auth.currentUser.uid), { childUid: uid2 }));
  await t('writeTime', () => m.F.setDoc(m.F.doc(m.db, 'time', uid1), { total: 1, days: {}, lessons: {} }));
  await t('makeHomework', () => m.F.addDoc(m.F.collection(m.db, 'assignments'), { title: 'x', items: [], uids: [uid1], due: '2099-01-01', createdBy: 'x' }));
  await t('listChildHomework', () => m.F.getDocs(m.F.query(m.F.collection(m.db, 'assignments'), m.F.where('uids', 'array-contains', uid1))));
  return r;
}, [uid1, uid2]);
ok(pden.ownChildProgress === 'allowed', 'parent can read own child’s progress');
ok(pden.otherProgress === 'permission-denied', 'parent cannot read another child’s progress');
ok(pden.otherTime === 'permission-denied', 'parent cannot read another child’s study time');
ok(pden.changeChild === 'permission-denied', 'parent cannot change which child is linked');
ok(pden.writeTime === 'permission-denied', 'parent cannot write study time');
ok(pden.makeHomework === 'permission-denied', 'parent cannot create homework');
ok(pden.listChildHomework === 'allowed', 'parent can list own child’s homework');

// coach gives homework: lesson "board" + one written task, to all students
await coachPage.fill('#hTitle', 'Week 1 homework'); await coachPage.fill('#hDue', '2099-01-01'); await coachPage.fill('#hNote', 'Finish before class');
await coachPage.click('#hLessons details:first-child summary'); await coachPage.check('#hLessons input[data-les="board"]'); await coachPage.fill('#hText', 'Play two games with a friend');
await coachPage.click('#hwForm button[type=submit]');
await coachPage.waitForFunction(() => document.querySelector('#hMsg').textContent.includes('given to'), null, { timeout: 15000 });
ok((await coachPage.textContent('#hwList')).includes('Week 1 homework'), 'coach sees the new homework in the list');

// student sees it, the passed lesson is done, the written task can be ticked
await pg.goto(`${SITE}/account.html`); await pg.waitForSelector('#hwBox .hw-list', { timeout: 15000 });
ok((await pg.textContent('#hwBox')).includes('Week 1 homework'), 'student sees the homework');
ok(await pg.locator('#hwBox .hw-items li.ok').count() === 1, 'passed lesson shows as done in the homework');
await pg.check('#hwBox input[data-a]'); await pg.waitForTimeout(1500);
const aid = (await pg.getAttribute('#hwBox input[data-a]', 'data-a'));
const stdoc = await fsDoc(`astatus/${aid}_${uid1}`);
ok(!!(stdoc.fields && stdoc.fields.checks), 'tick is saved for the coach and parent');
ok((await pg.textContent('#hwBox')).includes('Done'), 'homework turns Done when every item is done');
const sden = await pg.evaluate(async ([uid2, aid]) => {
  const m = await import('./assets/js/portal/fb.js'); const r = {};
  const t = async (k, f) => { try { await f(); r[k] = 'allowed' } catch (e) { r[k] = e.code } };
  await t('makeHomework', () => m.F.addDoc(m.F.collection(m.db, 'assignments'), { title: 'x', items: [], uids: [], due: '2099-01-01', createdBy: 'x' }));
  await t('tickForOther', () => m.F.setDoc(m.F.doc(m.db, 'astatus', aid + '_' + uid2), { aid, uid: uid2, checks: { 1: true }, updatedAt: m.F.serverTimestamp() }));
  await t('otherTime', () => m.F.getDoc(m.F.doc(m.db, 'time', uid2)));
  return r;
}, [uid2, aid]);
ok(sden.makeHomework === 'permission-denied', 'student cannot create homework');
ok(sden.tickForOther === 'permission-denied', 'student cannot tick another student’s homework');
ok(sden.otherTime === 'permission-denied', 'student cannot read another student’s study time');

// study time: only active seconds count
await pg.goto(`${SITE}/learn.html`); await pg.waitForTimeout(1500);
for (let i = 0; i < 12; i++) { await pg.mouse.move(100 + i * 5, 200 + i * 3); await pg.waitForTimeout(500) }
await pg.evaluate(() => window.PQ_TRACK.flush()); await pg.waitForTimeout(1500);
const td = await fsDoc('time/' + uid1);
const tot = td.fields && td.fields.total ? +td.fields.total.integerValue : 0;
ok(tot >= 3 && tot <= 12, 'active study time was saved (' + tot + ' s of about 6 s active)');
await pg.waitForTimeout(500);


// 6) coach sees the mark and requests a password reset; admin job processes it
await coachPage.reload(); await coachPage.waitForSelector('#stuTable tbody tr[data-uid]', { timeout: 15000 });
const row = await coachPage.textContent(`#stuTable tr[data-uid="${uid1}"]`);
ok(row.includes('1/40') && row.includes('100%'), 'coach table shows 1/40 lessons and 100%');
await coachPage.click(`#stuTable tr[data-uid="${uid1}"] button[data-a="report"]:not(.nm)`);
await coachPage.waitForSelector('#detail:not([hidden])', { timeout: 10000 });
const det = await coachPage.textContent('#detail');
ok(det.includes('Active time') && det.includes('Week 1 homework') && det.includes('Module 1'), 'coach report shows time, homework and modules');
ok((await coachPage.textContent('#hwList')).includes('1/2') || (await coachPage.textContent('#hwList')).includes('Week 1 homework'), 'coach homework list shows progress');
const [dl] = await Promise.all([coachPage.waitForEvent('download', { timeout: 10000 }), coachPage.click('#csvBtn')]);
ok(/purple-queen-students-.*\.csv/.test(dl.suggestedFilename()), 'coach can download the CSV');
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

// removing a student also removes the parent login, study time and ticks
const delBtn = `#stuTable tr[data-uid="${uid2}"] button[data-a="delete"]`;
await coachPage.click(delBtn); await coachPage.click(delBtn); await coachPage.waitForTimeout(1500);
execSync('node tools/portal-admin.mjs', { stdio: 'inherit', env: { ...process.env, FIRESTORE_EMULATOR_HOST: '127.0.0.1:8085', FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099', GCLOUD_PROJECT: P } });
const after = await fetch(`${FS}/v1/projects/${P}/databases/(default)/documents/users`, { headers: owner }).then(r => r.json());
ok(!after.documents.some(d => d.fields.sid && /^PQ0002/.test(d.fields.sid.stringValue)), 'removing a student also removes the parent login');
ok(after.documents.some(d => d.fields.sid && d.fields.sid.stringValue === 'PQ0001-P'), 'other parent logins stay');

// 7) phone width: no sideways scroll on portal pages
await pg.setViewportSize({ width: 390, height: 844 });
for (const p of ['login.html', 'account.html', 'parent.html']) { await pg.goto(`${SITE}/${p}`); await pg.waitForTimeout(1500); const sw = await pg.evaluate(() => document.documentElement.scrollWidth); ok(sw <= 390, `${p} fits a phone (${sw}px)`) }
await coachPage.setViewportSize({ width: 390, height: 844 }); await coachPage.waitForTimeout(500);
ok(await coachPage.evaluate(() => document.documentElement.scrollWidth) <= 390, 'coach panel fits a phone');

ok(errs.length === 0, 'no page errors ' + JSON.stringify(errs.slice(0, 3)));
await b.close();
console.log(fails ? `\n${fails} FAILED` : '\nALL PASSED');
process.exit(fails ? 1 : 0);
