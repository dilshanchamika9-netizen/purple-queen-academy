// Realtime Database for live games (run by portal-admin.yml with the Firebase service account).
//   node tools/deploy-db.mjs --rules   creates the database if missing (Singapore), publishes database.rules.json, syncs staff
//   node tools/deploy-db.mjs           syncs staff only (coaches listed in Firestore /coaches -> staff/{uid} = true)
import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';
const P = 'purple-queen-38407', ID = `${P}-default-rtdb`, LOC = 'asia-southeast1';
export const DB_URL = `https://${ID}.${LOC}.firebasedatabase.app`;
const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!sa) { console.log('No service account: skipping.'); process.exit(0); }
const cred = admin.credential.cert(JSON.parse(sa));
admin.initializeApp({ credential: cred, databaseURL: DB_URL });
const token = async () => (await cred.getAccessToken()).access_token;
const api = async (method, url, body, raw) => {
  const r = await fetch(url, { method, headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json' }, body: body === undefined ? undefined : (raw ? body : JSON.stringify(body)) });
  const t = await r.text(); let j; try { j = JSON.parse(t) } catch { j = t }
  return { ok: r.ok, status: r.status, j };
};

if (process.argv.includes('--rules')) {
  // 1) database instance
  const base = `https://firebasedatabase.googleapis.com/v1beta/projects/${P}/locations`;
  let got = await api('GET', `${base}/${LOC}/instances/${ID}`);
  if (got.status === 403 && JSON.stringify(got.j).includes('SERVICE_DISABLED')) {
    const en = await api('POST', `https://serviceusage.googleapis.com/v1/projects/${P}/services/firebasedatabase.googleapis.com:enable`, {});
    console.log('Enable Realtime Database API:', en.status, en.ok ? 'ok' : JSON.stringify(en.j).slice(0, 300));
    await new Promise(r => setTimeout(r, 30000));
    got = await api('GET', `${base}/${LOC}/instances/${ID}`);
  }
  if (got.ok) console.log('Database exists:', got.j.databaseUrl || DB_URL, got.j.state || '');
  else {
    const mk = await api('POST', `${base}/${LOC}/instances?databaseId=${ID}`, { type: 'DEFAULT_DATABASE' });
    if (!mk.ok) { console.log('::error::Could not create the Realtime Database:', mk.status, JSON.stringify(mk.j).slice(0, 500)); process.exit(1); }
    console.log('Database created:', mk.j.databaseUrl || DB_URL);
    await new Promise(r => setTimeout(r, 10000));
  }
  // 2) rules
  const rules = readFileSync('database.rules.json', 'utf8');
  const pub = await api('PUT', `${DB_URL}/.settings/rules.json`, rules, true);
  if (!pub.ok) { console.log('::error::Rules not published:', pub.status, JSON.stringify(pub.j).slice(0, 500)); process.exit(1); }
  console.log('Database rules published');
}

// 3) staff = coaches who have signed in at least once
const coaches = (await admin.firestore().collection('coaches').get()).docs.map(d => d.id);
const staff = {};
for (const email of coaches) {
  try { const u = await admin.auth().getUserByEmail(email); if (u.emailVerified || (u.providerData || []).some(p => p.providerId === 'google.com')) staff[u.uid] = true }
  catch { /* not signed in yet */ }
}
await admin.database().ref('staff').set(staff);
console.log(`staff: ${Object.keys(staff).length} of ${coaches.length} coaches`);
process.exit(0);
