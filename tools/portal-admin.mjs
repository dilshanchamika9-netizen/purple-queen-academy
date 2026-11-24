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
