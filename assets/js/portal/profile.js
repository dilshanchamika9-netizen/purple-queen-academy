// My profile (opened from the avatar menu): details (all optional), fees, attendance, achievements, password.
import { db, F, whoAmI, auth, esc, markSignedIn, logout } from './fb.js';
import './pay.js';
import { feesBlock, attStat, attTable, PASS } from './lms.js';
import { mountUser, avatar, SVG, withLocalMarks } from './shell.js';
const $ = (s) => document.querySelector(s);
const root = $('#portalProfile');
const MODS = window.PQ_MODULES || [];
const LESSONS = MODS.flatMap(m => m.lessons);
const LEVEL = { 1: 'Level 1 · Basic', 2: 'Level 2 · Intermediate', 3: 'Level 3 · Advanced' };
// the details a student may fill in (firestore.rules allows exactly these, plus the photo)
export const FIELDS = [['dob', 'Date of birth', 'date'], ['school', 'School', 'text'], ['grade', 'Grade / class', 'text'], ['city', 'Home town / city', 'text'],
  ['phone', 'Student phone', 'tel'], ['parentPhone', 'Parent phone', 'tel'], ['parentEmail', 'Parent email', 'email']];
const TABS = [['profile', 'My profile', SVG.user], ['fees', 'Fees and payments', SVG.fees], ['attendance', 'Attendance', SVG.cal], ['achievements', 'Achievements', SVG.trophy], ['password', 'Change password', SVG.key]];

(async () => {
  const me = await whoAmI();
  if (!me) return (location.href = 'login.html');
  if (me.role === 'coach') return (location.href = 'coach.html');
  if (me.role !== 'student') { await F.signOut(auth); return (location.href = 'login.html') }
  if (me.profile && me.profile.mustChange) return (location.href = 'login.html');
  markSignedIn(true, 'student');
  const p = me.profile || {}, uid = me.user.uid;
  mountUser(p);
  let prog = {}; try { const s = await F.getDoc(F.doc(db, 'progress', uid)); if (s.exists()) prog = s.data() } catch {}
  prog = withLocalMarks(prog);
  let tm = {}; try { const s = await F.getDoc(F.doc(db, 'time', uid)); if (s.exists()) tm = s.data() } catch {}
  let sess = []; try { const q = await F.getDocs(F.query(F.collection(db, 'attendance'), F.where('uids', 'array-contains', uid))); sess = q.docs.map(d => d.data()) } catch {}
  let invs = []; try { const q = await F.getDocs(F.query(F.collection(db, 'invoices'), F.where('uid', '==', uid))); invs = q.docs.map(d => ({ id: d.id, ...d.data() })) } catch {}
  const att = attStat(sess, uid);
  const L = prog.lessons || {}, passedN = LESSONS.filter(l => (L[l.id] || 0) >= PASS).length, scores = LESSONS.map(l => L[l.id]).filter(v => v != null);
  let solved = {}; try { solved = JSON.parse(localStorage.getItem('pqz-solved') || '{}') } catch {}
  const solvedN = Object.keys({ ...solved, ...((prog.puzzles && prog.puzzles.solved) || {}) }).length;
  const dk = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const dayS = (i) => (tm.days && tm.days[dk(new Date(Date.now() - i * 864e5))]) || 0;
  let streak = 0; for (let i = dayS(0) ? 0 : 1; i < 400 && dayS(i) > 0; i++) streak++;
  const BADGES = [
    ['First lesson', 'Pass one lesson', passedN >= 1, SVG.book], ['5 lessons', 'Pass five lessons', passedN >= 5, SVG.book], ['10 lessons', 'Pass ten lessons', passedN >= 10, SVG.trophy],
    ['Module done', 'Finish a whole module', MODS.some(m => m.lessons.every(l => (L[l.id] || 0) >= PASS)), SVG.trophy], ['Puzzle starter', 'Solve one puzzle', solvedN >= 1, SVG.puzzle],
    ['25 puzzles', 'Solve 25 puzzles', solvedN >= 25, SVG.puzzle], ['Top mark', 'Score 100% in a lesson', scores.some(v => v >= 100), SVG.check], ['3-day streak', 'Study three days in a row', streak >= 3, SVG.cal]];

  root.innerHTML = `<div class="sp-prof">
    <nav class="sp-tabs" aria-label="Profile sections">${TABS.map(([k, t, i]) => `<a href="#${k}" data-t="${k}">${i}${t}</a>`).join('')}</nav>
    <div>
      <section class="sp-card" data-p="profile"><h2>My profile</h2><p class="sub">Everything here is optional. Your coach can see these details.</p>
        <div class="sp-photo"><span id="pfAv">${avatar(p)}</span><div><b>${esc(p.name || '')}</b><small>Profile photo · a square picture looks best</small>
          <div class="acts"><button type="button" class="sp-btn" id="avBtn">${p.photo ? 'Change photo' : 'Add photo'}</button>${p.photo ? '<button type="button" class="sp-btn" id="avDel">Remove</button>' : ''}</div><input type="file" id="avFile" accept="image/*" hidden></div></div>
        <div class="sp-fixed"><div><small>Name</small><b>${esc(p.name || '—')}</b></div><div><small>Student ID</small><b>${esc(p.sid || '—')}</b></div><div><small>Level</small><b>${esc(LEVEL[p.level] || 'Level ' + (p.level || 1))}${p.batch ? ' · ' + esc(p.batch) : ''}</b></div></div>
        <form class="sp-form" id="pfForm" novalidate><h3>About me</h3>
          ${FIELDS.slice(0, 4).map(([k, t, ty]) => `<label for="pf_${k}"><em>${t} <span>(optional)</span></em><input id="pf_${k}" name="${k}" type="${ty}" maxlength="80" value="${esc(p[k] || '')}"${ty === 'date' ? ` max="${dk(new Date())}"` : ''}></label>`).join('')}
          <h3>Contact</h3>
          ${FIELDS.slice(4).map(([k, t, ty]) => `<label for="pf_${k}"${k === 'parentEmail' ? ' class="full"' : ''}><em>${t} <span>(optional)</span></em><input id="pf_${k}" name="${k}" type="${ty}" maxlength="80" value="${esc(p[k] || '')}"></label>`).join('')}
          <div class="sp-save"><button class="sp-btn p" type="submit">Save details</button><span class="sp-msg" id="pfMsg" role="status"></span></div></form></section>
      <section class="sp-card" data-p="fees" id="feeBox"><h2>Fees and payments</h2><p class="sub">Your class fees, payments and receipts.</p>${feesBlock(invs, { payBtn: true })}</section>
      <section class="sp-card" data-p="attendance" id="spAtt"><h2>Attendance</h2><p class="sub">Classes marked by your coach.</p>${att.total ? `<div class="sp-attsum"><b>${att.pct}%</b><span>${att.present} present · ${att.late} late · ${att.absent} absent<br>${att.total} classes</span></div>${attTable(att, uid)}` : '<p class="muted">No classes marked yet.</p>'}</section>
      <section class="sp-card" data-p="achievements"><h2>Achievements</h2><p class="sub">${BADGES.filter(b => b[2]).length} of ${BADGES.length} earned</p><div class="sp-badges">${BADGES.map(b => `<div class="sp-badge${b[2] ? ' on' : ''}"><i>${b[3]}</i>${b[0]}<small>${b[1]}</small></div>`).join('')}</div></section>
      <section class="sp-card" data-p="password"><h2>Change password</h2><p class="sub">Use at least 6 characters.</p>
        <form class="sp-form" id="pwForm"><label for="pw0" class="full">Current password<input id="pw0" type="password" autocomplete="current-password"></label>
          <label for="pw1">New password<input id="pw1" type="password" autocomplete="new-password"></label><label for="pw2">New password again<input id="pw2" type="password" autocomplete="new-password"></label>
          <div class="sp-save"><button class="sp-btn p" type="submit">Save password</button><button class="sp-btn" type="button" id="pfOut">Sign out</button><span class="sp-msg" id="pwMsg" role="status"></span></div></form></section>
    </div></div>`;

  const show = () => { const t = (location.hash || '#profile').slice(1), ok = TABS.some(x => x[0] === t) ? t : 'profile';
    root.querySelectorAll('[data-p]').forEach(s => s.hidden = s.dataset.p !== ok); root.querySelectorAll('.sp-tabs a').forEach(a => a.classList.toggle('on', a.dataset.t === ok)); window.scrollTo(0, 0) };
  window.addEventListener('hashchange', show); show();

  const refreshAv = () => { $('#pfAv').innerHTML = avatar(p); mountUser(p); $('#avBtn').textContent = p.photo ? 'Change photo' : 'Add photo' };
  $('#avBtn').onclick = () => $('#avFile').click();
  if ($('#avDel')) $('#avDel').onclick = async () => { try { await F.updateDoc(F.doc(db, 'users', uid), { photo: '' }); p.photo = ''; refreshAv(); $('#avDel').remove() } catch { alert('Could not remove the photo.') } };
  $('#avFile').onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const img = await new Promise((ok, no) => { const i = new Image(), u = URL.createObjectURL(f); i.onload = () => { URL.revokeObjectURL(u); ok(i) }; i.onerror = no; i.src = u });
      const c = document.createElement('canvas'); c.width = c.height = 160; const k = Math.min(img.width, img.height), x = c.getContext('2d');
      x.drawImage(img, (img.width - k) / 2, (img.height - k) / 2, k, k, 0, 0, 160, 160);
      const data = c.toDataURL('image/jpeg', .82);
      await F.updateDoc(F.doc(db, 'users', uid), { photo: data }); p.photo = data; refreshAv();
    } catch { alert('Could not save the photo. Try a smaller picture.') }
    e.target.value = '';
  };
  $('#pfForm').onsubmit = async (e) => {
    e.preventDefault(); const m = $('#pfMsg'), up = {};
    FIELDS.forEach(([k]) => { up[k] = $('#pf_' + k).value.trim().slice(0, 80) });
    if (up.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(up.parentEmail)) { m.className = 'sp-msg err'; m.textContent = 'The parent email does not look right.'; return }
    if (up.dob && up.dob > dk(new Date())) { m.className = 'sp-msg err'; m.textContent = 'The date of birth cannot be in the future.'; return }
    const changed = Object.fromEntries(Object.entries(up).filter(([k, v]) => v !== (p[k] || '')));
    if (!Object.keys(changed).length) { m.className = 'sp-msg ok'; m.textContent = 'Nothing to save.'; return }
    try { await F.updateDoc(F.doc(db, 'users', uid), changed); Object.assign(p, changed); m.className = 'sp-msg ok'; m.textContent = 'Saved.' }
    catch (err) { m.className = 'sp-msg err'; m.textContent = 'Could not save: ' + (err.code || err.message) }
  };
  $('#pfOut').onclick = logout;
  $('#pwForm').onsubmit = async (e) => {
    e.preventDefault(); const m = $('#pwMsg'); const a = $('#pw1').value;
    if (a.length < 6) { m.className = 'sp-msg err'; m.textContent = 'Use at least 6 characters.'; return }
    if (a !== $('#pw2').value) { m.className = 'sp-msg err'; m.textContent = 'The two new passwords are different.'; return }
    try { await F.reauthenticateWithCredential(auth.currentUser, F.EmailAuthProvider.credential(auth.currentUser.email, $('#pw0').value)); await F.updatePassword(auth.currentUser, a); m.className = 'sp-msg ok'; m.textContent = 'Password changed.'; e.target.reset() }
    catch (err) { m.className = 'sp-msg err'; m.textContent = err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' ? 'Current password is not correct.' : 'Could not change the password: ' + (err.code || err.message) }
  };
})();
