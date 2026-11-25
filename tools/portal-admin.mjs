// Runs in GitHub Actions with the Firebase service account (secret FIREBASE_SERVICE_ACCOUNT).
// 1) Syncs the coach list from secret COACH_EMAILS ("email|Name;email|Name").
// 2) Processes coach requests in /adminQueue: password resets and student removal.
import admin from 'firebase-admin';
const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
if (process.env.FIRESTORE_EMULATOR_HOST) admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || 'demo-pq' });   // test run
else if (!sa) { console.log('No service account yet: skipping.'); process.exit(0); }
else admin.initializeApp({ credential: admin.credential.cert(JSON.parse(sa)) });
const db = admin.firestore(), auth = admin.auth();

// --- coaches ---
const list = (process.env.COACH_EMAILS || '').split(';').map(s => s.trim()).filter(Boolean).map(s => { const [email, name] = s.split('|'); return { email: email.trim().toLowerCase(), name: (name || '').trim() } }).filter(c => c.email.includes('@'));
if (list.length) {
  const existing = await db.collection('coaches').get();
  const keep = new Set(list.map(c => c.email));
  for (const c of list) await db.doc(`coaches/${c.email}`).set({ name: c.name, email: c.email }, { merge: true });
  for (const d of existing.docs) if (!keep.has(d.id)) await d.ref.delete();
  console.log(`coaches: ${list.length} listed`);
} else console.log('COACH_EMAILS not set: coach list unchanged.');


// --- one-time lesson reset (RESET_EPOCH) ---
// Wipes every student's lesson marks and XP so the strict lesson order starts clean. Puzzles, study time, homework ticks, attendance and fees are kept.
// Raising RESET_EPOCH runs it once more. Devices wipe their own saved marks when they see the higher epoch (assets/js/portal/sync.js).
const RESET_EPOCH = 1;
{
  const ref = db.doc('meta/lessonReset'), cur = await ref.get();
  if (!cur.exists || (cur.data().epoch || 0) < RESET_EPOCH) {
    const us = await db.collection('users').where('role', '==', 'student').get(); let n = 0;
    for (const u of us.docs) {
      const pr = db.doc(`progress/${u.id}`), old = await pr.get(), d = old.exists ? old.data() : {};
      await pr.set({ lessons: {}, xp: 0, puzzles: d.puzzles || { solved: {}, best: 0 }, epoch: RESET_EPOCH, updatedAt: admin.firestore.FieldValue.serverTimestamp() }); n++;
    }
    await ref.set({ epoch: RESET_EPOCH, doneAt: admin.firestore.FieldValue.serverTimestamp(), students: n });
    console.log(`lesson reset: ${n} students`);
  } else console.log('lesson reset: already done');
}

// --- queue ---
const words = ['queen', 'rook', 'knight', 'bishop', 'pawn', 'castle', 'check', 'board'];
const temp = () => words[Math.floor(Math.random() * words.length)] + '-' + String(Math.floor(1000 + Math.random() * 9000));
const pending = await db.collection('adminQueue').where('status', '==', 'pending').limit(50).get();
for (const q of pending.docs) {
  const r = q.data();
  try {
    if (r.type === 'reset') {
      const pw = temp();
      await auth.updateUser(r.uid, { password: pw });
      await db.doc(`users/${r.uid}`).update({ mustChange: true });
      await q.ref.update({ status: 'done', tempPassword: pw, doneAt: admin.firestore.FieldValue.serverTimestamp() });
    } else if (r.type === 'delete') {
      await auth.deleteUser(r.uid).catch(e => { if (e.code !== 'auth/user-not-found') throw e });
      // the student's parent login, study time and homework ticks go too
      const ps = await db.collection('users').where('childUid', '==', r.uid).get();
      for (const d of ps.docs) { await auth.deleteUser(d.id).catch(e => { if (e.code !== 'auth/user-not-found') throw e }); await d.ref.delete() }
      const sts = await db.collection('astatus').where('uid', '==', r.uid).get();
      for (const d of sts.docs) await d.ref.delete();
      await db.doc(`time/${r.uid}`).delete();
      await db.doc(`users/${r.uid}`).delete(); await db.doc(`progress/${r.uid}`).delete();
      await q.ref.update({ status: 'done', doneAt: admin.firestore.FieldValue.serverTimestamp() });
    } else await q.ref.update({ status: 'error', error: 'unknown request' });
    console.log('processed', r.type, r.sid || r.uid);
  } catch (e) { await q.ref.update({ status: 'error', error: String(e.message || e) }); console.error('failed', r.type, e.message) }
}
// remove finished requests (and their temporary passwords) after 3 days
const old = await db.collection('adminQueue').where('status', 'in', ['done', 'error']).get();
const cutoff = Date.now() - 3 * 864e5;
for (const d of old.docs) { const t = d.get('doneAt'); if (t && t.toMillis() < cutoff) await d.ref.delete() }
console.log(`queue: ${pending.size} processed`);

// ---------- emails ----------
// Pending messages in /outbox are sent with Gmail (secrets GMAIL_USER and GMAIL_APP_PASSWORD).
const colombo = (d = new Date()) => d.toLocaleDateString('en-CA', { timeZone: 'Asia/Colombo' });
const addDays = (s, n) => { const d = new Date(s + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10) };
const diffDays = (a, b) => Math.round((new Date(a + 'T00:00:00Z') - new Date(b + 'T00:00:00Z')) / 864e5);
const SITE = process.env.SITE_URL || 'https://dilshanchamika9-netizen.github.io/purple-queen-academy/';
const queueOnce = async (key, msg) => { try { await db.doc(`outbox/${key}`).create({ ...msg, status: 'pending', by: 'auto', createdAt: admin.firestore.FieldValue.serverTimestamp() }); return 1 } catch (e) { if (e.code === 6 || /ALREADY_EXISTS/.test(String(e.message))) return 0; throw e } };

// automatic reminders: once a day around 8 am Sri Lanka time (the keys make every reminder go out only once)
const hour = +new Date().toLocaleString('en-GB', { timeZone: 'Asia/Colombo', hour: '2-digit', hour12: false });
if (hour === 8 || process.env.REMIND_NOW === '1') {
  const today = colombo(); let n = 0;
  const parentOf = async (uid) => { const u = await db.doc(`users/${uid}`).get(); return u.exists ? u.data() : null };
  const hws = await db.collection('assignments').where('due', '>=', today).where('due', '<=', addDays(today, 1)).get();
  for (const a of hws.docs) {
    const A = a.data();
    for (const uid of A.uids || []) {
      const u = await parentOf(uid); if (!u || !u.parentEmail) continue;
      const prog = (await db.doc(`progress/${uid}`).get()).data() || {}, st = (await db.doc(`astatus/${a.id}_${uid}`).get()).data() || {};
      const done = A.items.every((it, i) => it.t === 'lesson' ? ((prog.lessons || {})[it.id] || 0) >= 70 : !!(st.checks && st.checks[i]));
      if (done) continue;
      n += await queueOnce(`hw_${a.id}_${uid}`, { to: u.parentEmail, subject: `Homework due ${A.due}: ${A.title}`, text: `Hello,\n\nA reminder that the homework "${A.title}" for ${u.name} is due on ${A.due} and is not finished yet.\nThe student can open it after signing in: ${SITE}login.html\n\nPurple Queen Chess Academy`, kind: 'reminder' });
    }
  }
  const invs = await db.collection('invoices').where('open', '==', true).get();
  for (const d of invs.docs) {
    const I = d.data(), bal = Math.round((I.amount - (I.paid || 0)) * 100) / 100; if (bal <= 0) continue;
    const days = diffDays(I.due, today); if (days > 3) continue;
    const u = await parentOf(I.uid); if (!u || !u.parentEmail) continue;
    const late = days < 0, key = late ? `fee_${d.id}_late_${Math.floor(-days / 7)}` : `fee_${d.id}_soon`;
    n += await queueOnce(key, { to: u.parentEmail, subject: late ? `Fee overdue: ${I.title}` : `Fee due ${I.due}: ${I.title}`, text: `Hello,\n\nThe fee "${I.title}" for ${I.name} (${I.currency || 'LKR'} ${bal.toFixed(2)} balance) ${late ? 'was due on' : 'is due on'} ${I.due}.\nYou can see it and pay it after signing in with the parent login: ${SITE}login.html\n\nPurple Queen Chess Academy`, kind: 'reminder' });
  }
  console.log(`reminders queued: ${n}`);
}

const out = await db.collection('outbox').where('status', '==', 'pending').limit(40).get();
if (out.size) {
  const user = process.env.GMAIL_USER, pass = process.env.GMAIL_APP_PASSWORD, stub = process.env.MAIL_STUB === '1';
  if (!stub && (!user || !pass)) console.log(`${out.size} email(s) waiting: add GMAIL_USER and GMAIL_APP_PASSWORD secrets to send them.`);
  else {
    let tr = null; if (!stub) { const nm = await import('nodemailer'); tr = nm.default.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass } }) }
    for (const m of out.docs) {
      const r = m.data();
      try {
        if (!stub) await tr.sendMail({ from: `Purple Queen Chess Academy <${user}>`, to: r.to, subject: r.subject, text: r.text });
        await m.ref.update({ status: 'done', doneAt: admin.firestore.FieldValue.serverTimestamp(), stub });
      } catch (e) { await m.ref.update({ status: 'error', error: String(e.message || e).slice(0, 200) }) }
    }
    console.log(`emails sent: ${out.size}`);
  }
}
const oldMail = await db.collection('outbox').where('status', '==', 'done').get();
for (const d of oldMail.docs) { const t = d.get('doneAt'); if (t && t.toMillis() < Date.now() - 30 * 864e5) await d.ref.delete() }
