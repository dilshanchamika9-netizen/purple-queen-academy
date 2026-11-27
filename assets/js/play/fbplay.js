// Firebase for live play: same project and sign-in as the portal, plus the Realtime Database.
// Uses its own bundle (vendor/firebase-play.mjs) so the other pages keep their smaller bundle.
import * as F from '../vendor/firebase-play.mjs';

const CONFIG = {
  apiKey: 'AIzaSyCqXiPLDV0T3ASvrQyRg-6f0taUpedwngg',
  authDomain: 'purple-queen-38407.firebaseapp.com',
  projectId: 'purple-queen-38407',
  storageBucket: 'purple-queen-38407.firebasestorage.app',
  messagingSenderId: '6697877663',
  appId: '1:6697877663:web:043b2055c09ec28bbfa2aa',
  databaseURL: 'https://purple-queen-38407-default-rtdb.asia-southeast1.firebasedatabase.app',
};
const EMU = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && (new URLSearchParams(location.search).has('emu') || sessionStorage.getItem('pq-emu') === '1');
if (EMU) sessionStorage.setItem('pq-emu', '1');
const cfg = EMU ? { ...CONFIG, apiKey: 'demo-key', projectId: 'demo-pq', databaseURL: 'http://127.0.0.1:9000/?ns=demo-pq-default-rtdb' } : CONFIG;

export const app = F.initializeApp(cfg)   // default app name: shares the saved sign-in with the portal;
export const auth = F.getAuth(app);
export const db = F.getFirestore(app);
export const rt = F.getDatabase(app);
if (EMU) {
  F.connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  F.connectFirestoreEmulator(db, '127.0.0.1', 8085);
  F.connectDatabaseEmulator(rt, '127.0.0.1', 9000);
}
export { F, EMU };
export const STUDENT_DOMAIN = 'pq-students.example.com';
export const isStudentEmail = (e) => !!e && e.endsWith('@' + STUDENT_DOMAIN);
export const sidOf = (e) => e.split('@')[0].toLowerCase();
// "Kavindu Perera" -> "Kavindu P." (children's names are never shown in full on play screens)
export const shortName = (n) => { const p = String(n || '').trim().split(/\s+/).filter(Boolean); if (!p.length) return 'Student'; return (p[0] + (p[1] ? ' ' + p[1][0].toUpperCase() + '.' : '')).slice(0, 40) };
export const initials = (n) => String(n || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(x => x[0].toUpperCase()).join('');
