import { auth, db, F, idToEmail, isStudentEmail, whoAmI, markSignedIn, esc } from './fb.js';
const $ = (s) => document.querySelector(s);
const box = $('#portalLogin');
const say = (el, t, cls = '') => { el.className = 'pmsg2 ' + cls; el.textContent = t };

function go(role) { location.href = role === 'coach' ? 'coach.html' : 'account.html' }

async function afterSignIn() {
  const me = await whoAmI();
  if (!me) return;
  if (me.role === 'student') {
    markSignedIn(true);
    if (me.profile && me.profile.mustChange) return showChange(me);
    return go('student');
  }
  if (me.role === 'coach') { markSignedIn(true); return go('coach') }
  // signed in but not a student and not a listed coach
  if (!me.user.emailVerified && !isStudentEmail(me.user.email)) {
    showTab('coach'); say($('#cMsg'), 'Please verify your email first: open the link we sent you, then sign in again.', 'err');
  } else { showTab('coach'); say($('#cMsg'), 'This email is not registered as a coach. Ask the academy to add it.', 'err') }
  await F.signOut(auth);
}

function showTab(t) {
  box.querySelectorAll('.ptab').forEach(b => b.setAttribute('aria-selected', b.dataset.t === t));
  $('#stuForm').hidden = t !== 'student'; $('#coachForm').hidden = t !== 'coach'; $('#changeForm').hidden = true;
}
box.querySelectorAll('.ptab').forEach(b => b.addEventListener('click', () => showTab(b.dataset.t)));

$('#stuForm').addEventListener('submit', async (e) => {
  e.preventDefault(); const m = $('#sMsg');
  const id = $('#sId').value.trim(), pw = $('#sPw').value;
  if (!id || !pw) return say(m, 'Enter your student ID and password.', 'err');
  say(m, 'Signing in…');
  try { await F.signInWithEmailAndPassword(auth, idToEmail(id), pw); await afterSignIn() }
  catch (err) { say(m, /too-many/.test(err.code) ? 'Too many tries. Wait a few minutes, then try again.' : 'Student ID or password is not correct. Ask your coach if you forgot your password.', 'err') }
});

$('#coachForm').addEventListener('submit', async (e) => {
  e.preventDefault(); const m = $('#cMsg');
  const em = $('#cEmail').value.trim(), pw = $('#cPw').value;
  if (!em || !pw) return say(m, 'Enter your email and password.', 'err');
  say(m, 'Signing in…');
  try { await F.signInWithEmailAndPassword(auth, em, pw); await afterSignIn() }
  catch (err) { say(m, /too-many/.test(err.code) ? 'Too many tries. Wait a few minutes, then try again.' : 'Email or password is not correct.', 'err') }
});
$('#cCreate').addEventListener('click', async () => {
  const m = $('#cMsg'); const em = $('#cEmail').value.trim(), pw = $('#cPw').value;
  if (!em || pw.length < 8) return say(m, 'Enter your coach email and a new password of at least 8 characters, then press this button again.', 'err');
  try {
    const c = await F.createUserWithEmailAndPassword(auth, em, pw);
    await F.sendEmailVerification(c.user); await F.signOut(auth);
    say(m, 'Account created. We sent a verification link to ' + em + '. Open it, then sign in here.', 'ok');
  } catch (err) { say(m, err.code === 'auth/email-already-in-use' ? 'This email already has an account. Sign in instead, or use “Forgot password”.' : /configuration-not-found|operation-not-allowed/.test(err.code) ? 'Sign-in is not switched on in Firebase yet (Authentication → Email/Password). Ask the website admin.' : 'Could not create the account: ' + (err.code || err.message), 'err') }
});
$('#cGoogle').addEventListener('click', async () => {
  const m = $('#cMsg'); say(m, 'Opening Google…');
  const provider = new F.GoogleAuthProvider(); provider.setCustomParameters({ prompt: 'select_account' });
  try { await F.signInWithPopup(auth, provider); await afterSignIn() }
  catch (err) {
    if (/popup-blocked|operation-not-supported/.test(err.code)) { await F.signInWithRedirect(auth, provider); return }
    if (/popup-closed|cancelled-popup/.test(err.code)) return say(m, '');
    say(m, /unauthorized-domain/.test(err.code) ? 'Google sign-in is not allowed on this website address yet (Firebase → Authentication → Settings → Authorized domains).' : /operation-not-allowed|configuration-not-found/.test(err.code) ? 'Google sign-in is not switched on in Firebase yet.' : 'Google sign-in failed: ' + (err.code || err.message), 'err');
  }
});
F.getRedirectResult(auth).then(r => { if (r) afterSignIn() }).catch(() => {});
$('#cForgot').addEventListener('click', async () => {
  const m = $('#cMsg'); const em = $('#cEmail').value.trim();
  if (!em) return say(m, 'Type your email above first.', 'err');
  try { await F.sendPasswordResetEmail(auth, em); say(m, 'If this email has an account, a reset link is on its way.', 'ok') } catch { say(m, 'If this email has an account, a reset link is on its way.', 'ok') }
});

function showChange(me) {
  $('#stuForm').hidden = true; $('#coachForm').hidden = true; $('#changeForm').hidden = false;
  box.querySelector('.ptabs').hidden = true;
  $('#chHello').textContent = `Welcome${me.profile && me.profile.name ? ', ' + me.profile.name.split(' ')[0] : ''}! Choose your own password.`;
}
$('#changeForm').addEventListener('submit', async (e) => {
  e.preventDefault(); const m = $('#chMsg');
  const a = $('#ch1').value, b = $('#ch2').value;
  if (a.length < 6) return say(m, 'Use at least 6 characters.', 'err');
  if (a !== b) return say(m, 'The two passwords are different.', 'err');
  try {
    await F.updatePassword(auth.currentUser, a);
    await F.updateDoc(F.doc(db, 'users', auth.currentUser.uid), { mustChange: false });
    say(m, 'Password saved.', 'ok'); setTimeout(() => go('student'), 600);
  } catch (err) { say(m, 'Could not save the password: ' + (err.code || err.message), 'err') }
});

// already signed in? continue
whoAmI().then(me => { if (me && (me.role === 'student' || me.role === 'coach')) { if (me.role === 'student' && me.profile && me.profile.mustChange) showChange(me); else go(me.role) } });
const t = new URLSearchParams(location.search).get('as'); if (t === 'coach') showTab('coach');
window.PQ_PORTAL = { esc };
