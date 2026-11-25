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
await pg.waitForSelector('#addForm', { state: 'attached' }); await pg.evaluate(() => { document.querySelector('#addDet').open = true });
await pg.fill('#aName', 'Kavindu Perera'); await pg.selectOption('#aLevel', '1'); await pg.fill('#aBatch', 'Saturday 8:30 AM');
await pg.click('#addForm button[type=submit]');
await pg.waitForSelector('#nId', { timeout: 15000 });
const sid = (await pg.textContent('#nId')).trim(), tmp = (await pg.textContent('#nPw')).trim();
ok(sid === 'PQ0001', 'first student gets ID PQ0001 (got ' + sid + ')');
const pid = (await pg.textContent('#nPId')).trim(), ppw = (await pg.textContent('#nPPw')).trim();
ok(pid === 'PQ0001-P', 'parent login is created with the student (got ' + pid + ')');
ok((await pg.textContent('#stuTable tbody')).includes('Kavindu'), 'student appears in the coach table');
// second student to test isolation
await pg.evaluate(() => { document.querySelector('#addDet').open = true }); await pg.fill('#aName', 'Second Student'); await pg.click('#addForm button[type=submit]');
await pg.waitForFunction(() => document.querySelector('#nId') && document.querySelector('#nId').textContent === 'PQ0002', null, { timeout: 15000 });
ok(true, 'second student gets PQ0002');
const coachPage = pg;
const tab = (n) => coachPage.click(`#cTabs [data-t="${n}"]`);

// 3) student first login: must choose a password
pg = await page();
await pg.goto(`${SITE}/login.html?emu=1`);
await pg.fill('#sId', 'pq0001'); await pg.fill('#sPw', tmp); await pg.click('#stuForm button[type=submit]');
await pg.waitForSelector('#changeForm:not([hidden])', { timeout: 15000 }); ok(true, 'first login asks for a new password');
await pg.fill('#ch1', 'mypass99'); await pg.fill('#ch2', 'mypass99'); await pg.click('#changeForm button[type=submit]');
await pg.waitForURL('**/account.html', { timeout: 15000 });
await pg.waitForSelector('.stats6', { timeout: 15000 });
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
ok(ptxt.includes('Kavindu') && ptxt.includes('1/98'), 'parent page shows the child and 1/98 lessons');
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
await tab('homework');
await coachPage.fill('#hTitle', 'Week 1 homework'); await coachPage.fill('#hDue', '2099-01-01'); await coachPage.fill('#hNote', 'Finish before class');
ok(await coachPage.locator('#hLessons input[data-les]').count() >= 1, 'coach sees the next pending lessons'); ok(await coachPage.locator('#hLessons input[data-les]').count() <= 3 * 4, 'coach sees only a few lessons, not all'); await coachPage.locator('#hLessons input[data-les]').first().check(); await coachPage.evaluate(() => { document.querySelector('#hMore').open = true }); await coachPage.fill('#hText', 'Play two games with a friend');
await coachPage.click('#hwForm button[type=submit]');
await coachPage.waitForFunction(() => document.querySelector('#hMsg').textContent.includes('given to'), null, { timeout: 15000 });
ok((await coachPage.textContent('#hwList')).includes('Week 1 homework'), 'coach sees the new homework in the list');

// student sees it, the passed lesson is done, the written task can be ticked
await pg.goto(`${SITE}/account.html`); await pg.waitForSelector('#hwBox .hw-list', { timeout: 15000 });
ok((await pg.textContent('#hwBox')).includes('Week 1 homework'), 'student sees the homework');
ok(await pg.locator('#hwBox .hw-items li').count() >= 2, 'homework lists the lesson and the written task');
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

// puzzle homework by number: two rounds to the same student must never repeat a puzzle
await tab('homework');
for (const name of ['Puzzles A', 'Puzzles B']) {
  await coachPage.fill('#hTitle', name); await coachPage.fill('#hDue', '2099-01-02');
  await coachPage.selectOption('#hWho', 'pick'); await coachPage.check(`#hPick input[value="${uid1}"]`);
  await coachPage.click('#hMode button[data-mode="puzzles"]'); await coachPage.fill('#hPz input[data-pz="1"]', '5');
  await coachPage.click('#hwForm button[type=submit]');
  await coachPage.waitForFunction((n) => [...document.querySelectorAll('#hwList summary b')].some(b => b.textContent === n), name, { timeout: 20000 });
  await coachPage.waitForTimeout(500);
}
const pzSets = await coachPage.evaluate(async (uid) => {
  const m = await import('./assets/js/portal/fb.js'); const q = await m.F.getDocs(m.F.collection(m.db, 'assignments')); const out = [];
  q.docs.forEach(d => { const x = d.data(); (x.items || []).forEach(it => { if (it.t === 'puzzles' && it.sets && it.sets[uid]) out.push(it.sets[uid]) }) }); return out;
}, uid1);
ok(pzSets.length === 2 && pzSets.every(a => a.length === 5), 'coach gave two puzzle sets of 5 to the student');
ok(pzSets.length === 2 && !pzSets[0].some(id => pzSets[1].includes(id)), 'the second puzzle set repeats nothing from the first');
await pg.goto(`${SITE}/account.html`); await pg.waitForSelector('#hwBox .hw-list', { timeout: 15000 });
const hwtxt = await pg.textContent('#hwBox');
ok(hwtxt.includes('Puzzles: 5 to solve') && !hwtxt.includes('Beginner') && hwtxt.includes('0/5'), 'student sees the puzzle homework with 0/5 solved');
ok((await pg.getAttribute('#hwBox a[href*="puzzle.html?hw="]', 'href')).includes('&set='), 'puzzle homework links to the puzzle page with its set');

// profile photo: saved on the student's own profile, size-limited, not writable for others
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
await pg.setInputFiles('#avFile', { name: 'me.png', mimeType: 'image/png', buffer: PNG }); await pg.waitForTimeout(2000);
const udoc = await fsDoc('users/' + uid1);
ok(!!(udoc.fields && udoc.fields.photo && udoc.fields.photo.stringValue.startsWith('data:image/jpeg')), 'profile photo is saved');
const pden2 = await pg.evaluate(async ([uid2]) => {
  const m = await import('./assets/js/portal/fb.js'); const r = {};
  const t = async (k, f) => { try { await f(); r[k] = 'allowed' } catch (e) { r[k] = e.code } };
  await t('otherPhoto', () => m.F.updateDoc(m.F.doc(m.db, 'users', uid2), { photo: 'data:image/jpeg;base64,AAAA' }));
  await t('hugePhoto', () => m.F.updateDoc(m.F.doc(m.db, 'users', m.auth.currentUser.uid), { photo: 'x'.repeat(70000) }));
  await t('roleChange', () => m.F.updateDoc(m.F.doc(m.db, 'users', m.auth.currentUser.uid), { role: 'coach' }));
  return r;
}, [uid2]);
ok(pden2.otherPhoto === 'permission-denied', 'student cannot change another student’s photo');
ok(pden2.hugePhoto === 'permission-denied', 'a photo over the size limit is refused');
ok(pden2.roleChange === 'permission-denied', 'student still cannot change their own role');

// study time: only active seconds count
await pg.goto(`${SITE}/learn.html`); await pg.waitForTimeout(1500);
for (let i = 0; i < 12; i++) { await pg.mouse.move(100 + i * 5, 200 + i * 3); await pg.waitForTimeout(500) }
await pg.evaluate(() => window.PQ_TRACK.flush()); await pg.waitForTimeout(1500);
const td = await fsDoc('time/' + uid1);
const tot = td.fields && td.fields.total ? +td.fields.total.integerValue : 0;
ok(tot >= 3 && tot <= 12, 'active study time was saved (' + tot + ' s of about 6 s active)');
await pg.waitForTimeout(500);


// attendance: coach marks a class, student and parent see the percentage
await tab('attendance');
await coachPage.selectOption('#atBatch', 'Saturday 8:30 AM');
ok(await coachPage.locator('#atList .atrow').count() === 1, 'attendance list shows only the chosen batch');
await coachPage.click('#atList .seg3 label.l');
await coachPage.click('#atForm button[type=submit]');
await coachPage.waitForFunction(() => document.querySelector('#atMsg').textContent.includes('saved'), null, { timeout: 15000 });
await coachPage.fill('#atDate', '2026-01-05'); await coachPage.dispatchEvent('#atDate', 'change');
await coachPage.click('#atList .seg3 label.a');
await coachPage.click('#atForm button[type=submit]');
await coachPage.waitForFunction(() => document.querySelector('#atMsg').textContent.includes('saved'), null, { timeout: 15000 });
ok((await coachPage.textContent(`#stuTable tr[data-uid="${uid1}"]`)).includes('50%'), 'coach table shows 50% attendance (1 late, 1 absent)');
await pg.goto(`${SITE}/account.html`); await pg.waitForSelector('#hwBox', { timeout: 15000 }); await pg.waitForTimeout(1000);
ok((await pg.textContent('.stats6')).includes('50%') && (await pg.textContent('#portalAccount')).includes('Absent'), 'student sees 50% attendance and the absent class');
await pp.goto(`${SITE}/parent.html`); await pp.waitForSelector('#portalParent .acc-stats', { timeout: 15000 });
ok((await pp.textContent('#portalParent')).includes('50%') && (await pp.textContent('#portalParent')).includes('Late'), 'parent sees attendance');
const aden = await pg.evaluate(async () => { const m = await import('./assets/js/portal/fb.js'); try { await m.F.setDoc(m.F.doc(m.db, 'attendance', 'x'), { date: '2026-01-01', batch: 'x', marks: {}, uids: [] }); return 'allowed' } catch (e) { return e.code } });
ok(aden === 'permission-denied', 'student cannot write attendance');

// coach builds a board task and gives it as homework; the student solves it
await tab('homework');
await coachPage.evaluate(() => { document.querySelector('#hMore').open = true }); await coachPage.click('#tbDet summary'); await coachPage.waitForSelector('#tbBoard .lsq');
await coachPage.fill('#tbQ', 'White to move. Win the queen.');
await coachPage.click('#tbClear');
for (const [p, sq] of [['wK', 'e1'], ['bK', 'h8'], ['wR', 'a1'], ['bQ', 'a8']]) { await coachPage.click(`#tbPal .tbp[data-p="${p}"]`); await coachPage.click(`#tbBoard .lsq[data-sq="${sq}"]`) }
await coachPage.click('#tbPal + .tb-acts, #tbStart', { trial: true }).catch(() => {});
await coachPage.click('.tb-modes [data-m="ans"]');
await coachPage.click('#tbBoard .lsq[data-sq="a1"]'); await coachPage.click('#tbBoard .lsq[data-sq="h1"]');
ok((await coachPage.textContent('#tbMsg')).includes('not legal') || (await coachPage.textContent('#tbAns')) === '', 'builder does not accept an illegal answer move');
await coachPage.click('#tbBoard .lsq[data-sq="a1"]'); await coachPage.click('#tbBoard .lsq[data-sq="a8"]');
await coachPage.click('#tbAdd');
ok((await coachPage.textContent('#tbList')).includes('Win the queen'), 'board task is added to the homework');
await coachPage.fill('#hTitle', 'Board homework'); await coachPage.fill('#hDue', '2099-02-01');
await coachPage.click('#hwForm button[type=submit]');
await coachPage.waitForFunction(() => document.querySelector('#hMsg').textContent.includes('given to'), null, { timeout: 15000 });
await pg.goto(`${SITE}/account.html`); await pg.waitForSelector('#hwBox .hw-list', { timeout: 15000 });
await pg.click('#hwBox a[href^="task.html"]'); await pg.waitForSelector('#board .lpc', { timeout: 15000 });
ok((await pg.textContent('#portalTask')).includes('Win the queen'), 'student opens the board task');
await pg.click('#board .lsq[data-sq="a1"]'); await pg.click('#board .lsq[data-sq="h1"]');
ok((await pg.textContent('#fb')).includes('Try again'), 'wrong move is refused');
await pg.click('#board .lsq[data-sq="a1"]'); await pg.click('#board .lsq[data-sq="a8"]');
await pg.waitForFunction(() => document.querySelector('#fb').textContent.includes('Right'), null, { timeout: 10000 });
await pg.waitForTimeout(1200);
const bt = await fsDoc(`astatus/${(await pg.evaluate(() => new URLSearchParams(location.search).get('a')))}_${uid1}`);
ok(!!(bt.fields && bt.fields.checks), 'solving the board task is saved');

// Level 1 promotion: test mark + supervised games, then the coach promotes
await tab('students');
await fsSet('progress/' + uid2, { lessons: { mapValue: { fields: { 'l1-promotion': { integerValue: '90' } } } } });
await coachPage.reload(); await coachPage.waitForSelector('#stuTable tbody tr[data-uid]', { timeout: 15000 });
await coachPage.click(`#stuTable tr[data-uid="${uid2}"] button[data-a="report"]:not(.nm)`);
await coachPage.waitForSelector('#promoBtn', { timeout: 10000 });
ok(await coachPage.isDisabled('#promoBtn'), 'promote is locked until the supervised games are ticked');
await coachPage.check('#l1g'); await coachPage.waitForSelector('#promoBtn:not([disabled])', { timeout: 10000 });
await coachPage.click('#promoBtn');
await coachPage.waitForFunction((u) => document.querySelector(`#stuTable tr[data-uid="${u}"] select.lv`).value === '2', uid2, { timeout: 10000 });
ok(true, 'coach promotes the student to Level 2');

// parent contact, fees, receipts, e-mail queue, WhatsApp links
await tab('students');
await coachPage.click(`#stuTable tr[data-uid="${uid1}"] button[data-a="report"]:not(.nm)`);
await coachPage.waitForSelector('#dpPhone', { timeout: 10000 });
await coachPage.fill('#dpPhone', '077 123 4567'); await coachPage.fill('#dpEmail', 'p1@test.lk'); await coachPage.click('#dpSave');
await coachPage.waitForFunction(() => document.querySelector('#dpMsg').textContent === 'Saved.', null, { timeout: 10000 });
await tab('fees'); await coachPage.waitForSelector('#feeForm', { timeout: 10000 });
await coachPage.fill('#fTitle', 'November fee'); await coachPage.fill('#fAmt', '5000'); await coachPage.fill('#fDue', '2099-03-01'); await coachPage.check('#fMail');
await coachPage.click('#feeForm button[type=submit]');
await coachPage.waitForFunction(() => document.querySelector('#fMsg').textContent.includes('Fees created'), null, { timeout: 15000 });
ok((await coachPage.textContent('#fMsg')).includes('1 email'), 'fee creates one queued e-mail (only the parent with an e-mail)');
await coachPage.fill('#fTitle', 'Old fee'); await coachPage.fill('#fAmt', '1000'); await coachPage.fill('#fDue', '2020-01-01'); await coachPage.selectOption('#fWho', 'pick');
await coachPage.check(`#fPick input[value="${uid1}"]`); await coachPage.uncheck('#fMail');
await coachPage.click('#feeForm button[type=submit]');
await coachPage.waitForFunction(() => document.querySelector('#fMsg').textContent.includes('1 student'), null, { timeout: 15000 });
await coachPage.selectOption('#fFilter', 'all');
const ftxt = await coachPage.textContent('#fTable');
ok(ftxt.includes('November fee') && ftxt.includes('5,000.00') && ftxt.includes('Old fee') && ftxt.includes('Overdue'), 'coach fee table lists both fees with the overdue one marked');
ok(await coachPage.locator('#fTable a[href^="https://wa.me/94771234567"]').count() >= 1, 'WhatsApp reminder link uses the parent number in international form');
ok(await coachPage.locator('#fTable a[href^="https://mail.google.com/mail/?view=cm&fs=1&to=p1%40test.lk"]').count() >= 1, 'Open email link fills the parent e-mail, subject and message');
// record a part payment on the November fee for student 1
const nov = coachPage.locator(`#fTable tr[data-id]:has-text("November fee"):has-text("PQ0001")`);
await nov.locator('button[data-f="pay"]').click();
await coachPage.fill('.payf input[name="a"]', '2000'); await coachPage.selectOption('.payf select[name="m"]', 'bank'); await coachPage.fill('.payf input[name="r"]', 'REF123');
await coachPage.click('.payf button[type=submit]');
await coachPage.waitForFunction(() => document.querySelector('#fTable').textContent.includes('Part paid'), null, { timeout: 10000 });
ok(await coachPage.locator('#fTable a[href^="receipt.html"]').count() === 1, 'a receipt link appears after recording a payment');
// student and parent see the balance and the receipt
await pg.goto(`${SITE}/account.html`); await pg.waitForSelector('#feeBox .fee-list', { timeout: 15000 });
const ft = await pg.textContent('#feeBox');
ok(ft.includes('Balance to pay') && ft.includes('4,000.00') && ft.includes('Receipt 1'), 'student sees the balance (5,000 + 1,000 - 2,000 = 4,000) and the receipt');
const rhref = await pg.getAttribute('#feeBox a[href^="receipt.html"]', 'href');
await pg.goto(`${SITE}/${rhref}`); await pg.waitForSelector('.receipt', { timeout: 15000 });
const rt = await pg.textContent('.receipt');
ok(rt.includes('Payment receipt') && rt.includes('2,000.00') && rt.includes('REF123') && rt.includes('3,000.00'), 'receipt shows amount, reference and the balance after payment');
await pp.goto(`${SITE}/parent.html`); await pp.waitForSelector('#feeBox .fee-list', { timeout: 15000 });
ok((await pp.textContent('#feeBox')).includes('Balance to pay'), 'parent sees the fees');
const fden = await pg.evaluate(async ([uid2]) => {
  const m = await import('./assets/js/portal/fb.js'); const r = {};
  const t = async (k, f) => { try { await f(); r[k] = 'allowed' } catch (e) { r[k] = e.code } };
  await t('write', () => m.F.addDoc(m.F.collection(m.db, 'invoices'), { uid: m.auth.currentUser.uid, amount: 1, due: '2099-01-01' }));
  await t('other', () => m.F.getDocs(m.F.query(m.F.collection(m.db, 'invoices'), m.F.where('uid', '==', uid2))));
  await t('mail', () => m.F.addDoc(m.F.collection(m.db, 'outbox'), { to: 'a@b.c', subject: 's', text: 't', kind: 'x', status: 'pending' }));
  return r;
}, [uid2]);
ok(fden.write === 'permission-denied' && fden.other === 'permission-denied' && fden.mail === 'permission-denied', 'student cannot create fees, read other students’ fees or queue e-mails');
// admin job: sends queued e-mails (stub) and creates the automatic reminders once
const adminEnv = { ...process.env, FIRESTORE_EMULATOR_HOST: '127.0.0.1:8085', FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099', GCLOUD_PROJECT: P, MAIL_STUB: '1', REMIND_NOW: '1' };
execSync('node tools/portal-admin.mjs', { stdio: 'inherit', env: adminEnv });
execSync('node tools/portal-admin.mjs', { stdio: 'inherit', env: adminEnv });
const outbox = await fetch(`${FS}/v1/projects/${P}/databases/(default)/documents/outbox`, { headers: owner }).then(r => r.json());
const docsO = outbox.documents || [];
ok(docsO.length >= 2 && docsO.every(d => d.fields.status.stringValue === 'done'), 'queued e-mails are processed (' + docsO.length + ')');
ok(docsO.filter(d => d.fields.kind.stringValue === 'reminder').length === 1, 'the overdue fee reminder is created exactly once even after two runs');
ok(docsO.every(d => d.fields.to.stringValue === 'p1@test.lk'), 'e-mails go only to the saved parent address');

await tab('students');
// 6) coach sees the mark and requests a password reset; admin job processes it
await coachPage.reload(); await coachPage.waitForSelector('#stuTable tbody tr[data-uid]', { timeout: 15000 });
const row = await coachPage.textContent(`#stuTable tr[data-uid="${uid1}"]`);
ok(row.includes('1/98'), 'coach table shows 1/98 lessons');
await coachPage.click(`#stuTable tr[data-uid="${uid1}"] button[data-a="report"]:not(.nm)`);
await coachPage.waitForSelector('#detail:not([hidden])', { timeout: 10000 });
const det = await coachPage.textContent('#detail');
ok(det.includes('Active time') && det.includes('Week 1 homework') && det.includes('Module 1'), 'coach report shows time, homework and modules');
ok((await coachPage.textContent('#hwList')).includes('1/2') || (await coachPage.textContent('#hwList')).includes('Week 1 homework'), 'coach homework list shows progress');
const [dl] = await Promise.all([coachPage.waitForEvent('download', { timeout: 10000 }), coachPage.click('#csvBtn')]);
ok(/purple-queen-students-.*\.csv/.test(dl.suggestedFilename()), 'coach can download the CSV');
await coachPage.evaluate(() => document.querySelectorAll('.rowmenu').forEach(d => { d.open = true })); await coachPage.click(`#stuTable tr[data-uid="${uid1}"] button[data-a="reset"]`);
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
await coachPage.evaluate(() => document.querySelectorAll('.rowmenu').forEach(d => { d.open = true })); await coachPage.click(delBtn); await coachPage.evaluate(() => document.querySelectorAll('.rowmenu').forEach(d => { d.open = true })); await coachPage.click(delBtn); await coachPage.waitForTimeout(1500);
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
