// Purple Queen portal: Firebase setup shared by login, account, coach and progress sync.
import * as F from '../vendor/firebase.mjs';

export const CONFIG = {
  apiKey: 'AIzaSyCqXiPLDV0T3ASvrQyRg-6f0taUpedwngg',
  authDomain: 'purple-queen-38407.firebaseapp.com',
  projectId: 'purple-queen-38407',
  storageBucket: 'purple-queen-38407.firebasestorage.app',
  messagingSenderId: '6697877663',
  appId: '1:6697877663:web:043b2055c09ec28bbfa2aa',
};
// Test mode (?emu=1 on localhost): use the local Firebase emulators.
const EMU = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && (new URLSearchParams(location.search).has('emu') || sessionStorage.getItem('pq-emu') === '1');
if (EMU) sessionStorage.setItem('pq-emu', '1');
const cfg = EMU ? { ...CONFIG, apiKey: 'demo-key', projectId: 'demo-pq' } : CONFIG;

export const app = F.initializeApp(cfg);
export const auth = F.getAuth(app);
export const db = F.getFirestore(app);
if (EMU) { F.connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true }); F.connectFirestoreEmulator(db, '127.0.0.1', 8085) }
export { F, EMU };

export const STUDENT_DOMAIN = 'pq-students.example.com';
export const PARENT_DOMAIN = 'pq-parents.example.com';
// student ID: PQ0001. parent ID: PQ0001-P (the same ID plus P)
export const idToEmail = (sid) => { const k = sid.trim().toLowerCase().replace(/[^a-z0-9]/g, ''); return k + '@' + (/^pq\d+p$/.test(k) ? PARENT_DOMAIN : STUDENT_DOMAIN) };
export const isStudentEmail = (e) => !!e && e.endsWith('@' + STUDENT_DOMAIN);
export const isParentEmail = (e) => !!e && e.endsWith('@' + PARENT_DOMAIN);
export const emailToId = (e) => e.split('@')[0].toUpperCase();
export const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') };
export const fmtTime = (sec) => { sec = Math.round(sec || 0); if (sec < 60) return sec + ' s'; const m = Math.round(sec / 60); return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0') + ' min' };

/* who is signed in: resolves to {user, role, profile} or null */
export function whoAmI() {
  return new Promise(res => {
    const off = F.onAuthStateChanged(auth, async (user) => {
      off(); if (!user) return res(null);
      if (isStudentEmail(user.email)) {
        let profile = null; try { const s = await F.getDoc(F.doc(db, 'users', user.uid)); profile = s.exists() ? s.data() : null } catch {}
        return res({ user, role: 'student', profile });
      }
      if (isParentEmail(user.email)) {
        let profile = null; try { const s = await F.getDoc(F.doc(db, 'users', user.uid)); profile = s.exists() ? s.data() : null } catch {}
        return res({ user, role: 'parent', profile });
      }
      // coach: allowed only if listed in /coaches (the rules decide; reading our own entry proves it)
      try { const s = await F.getDoc(F.doc(db, 'coaches', user.email.toLowerCase())); if (s.exists() && user.emailVerified) return res({ user, role: 'coach', profile: s.data() }) } catch {}
      return res({ user, role: 'none', profile: null });
    });
  });
}
export const markSignedIn = (v) => { try { v ? localStorage.setItem('pq-auth', '1') : localStorage.removeItem('pq-auth') } catch {} };
export async function logout() { markSignedIn(false); await F.signOut(auth); location.href = 'login.html' }
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
