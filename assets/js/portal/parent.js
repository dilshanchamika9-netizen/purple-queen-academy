import { auth, db, F, whoAmI, logout, esc, markSignedIn, fmtTime } from './fb.js';
import { attStat, attTable, MODS, LESSONS, PASS, assignStat, itemLabel, secsInLastDays, dayBars, dueText, statePill, lessonTable } from './lms.js';
const $ = (s) => document.querySelector(s);
const root = $('#portalParent');
const LEVEL = { 1: 'Level 1 · Pawn (Basic)', 2: 'Level 2 · Knight (Intermediate)', 3: 'Level 3 · Queen (Advanced)' };
(async () => {
  const me = await whoAmI();
  if (!me) return (location.href = 'login.html');
  if (me.role === 'coach') return (location.href = 'coach.html');
  if (me.role === 'student') return (location.href = 'account.html');
  if (me.role !== 'parent') { await F.signOut(auth); return (location.href = 'login.html') }
  if (me.profile && me.profile.mustChange) return (location.href = 'login.html');
  markSignedIn(true, 'parent');
  const p = me.profile || {}, kid = p.childUid;
  let child = {}, prog = {}, tm = {}, assigns = [], st = {};
  try { const s = await F.getDoc(F.doc(db, 'users', kid)); if (s.exists()) child = s.data() } catch {}
  child = { name: p.childName, sid: p.childSid, ...child };
  try { const s = await F.getDoc(F.doc(db, 'progress', kid)); if (s.exists()) prog = s.data() } catch {}
  try { const s = await F.getDoc(F.doc(db, 'time', kid)); if (s.exists()) tm = s.data() } catch {}
  try { const q = await F.getDocs(F.query(F.collection(db, 'assignments'), F.where('uids', 'array-contains', kid))); assigns = q.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.due || '').localeCompare(a.due || '')) } catch {}
  try { const q = await F.getDocs(F.query(F.collection(db, 'astatus'), F.where('uid', '==', kid))); q.docs.forEach(d => st[d.id] = d.data()) } catch {}
  let sess = []; try { const q = await F.getDocs(F.query(F.collection(db, 'attendance'), F.where('uids', 'array-contains', kid))); sess = q.docs.map(d => d.data()) } catch {}
  const att = attStat(sess, kid);
  const L = prog.lessons || {}, passed = LESSONS.filter(l => (L[l.id] || 0) >= PASS).length;
  const vals = LESSONS.map(l => L[l.id]).filter(v => v != null), avg = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  const late = assigns.filter(a => assignStat(a, kid, prog, st[a.id + '_' + kid], tm).late).length;
  root.innerHTML = `
    <div class="acc-head"><div class="acc-av">${esc((child.name || '?').split(' ').map(w => w[0]).join('').slice(0, 2))}</div>
      <div><p class="eyebrow">Parent view · ${esc(child.sid || '')}</p><h1><em>${esc(child.name || 'Your child')}</em></h1><p class="acc-sub">${esc(LEVEL[child.level] || '')}${child.batch ? ' · ' + esc(child.batch) : ''}</p></div>
      <div class="acc-actions"><button type="button" class="btn btn-ghost btn-sm" id="accPw">Change password</button><button type="button" class="btn btn-ghost btn-sm" id="accOut">Sign out</button></div></div>
    <div class="acc-stats"><div><b>${passed}/${LESSONS.length}</b><span>Lessons passed</span></div><div><b>${avg}%</b><span>Average mark</span></div><div><b>${fmtTime(secsInLastDays(tm, 7))}</b><span>Study time, 7 days</span></div><div><b>${late}</b><span>Homework overdue</span></div><div><b>${att.pct == null ? '—' : att.pct + '%'}</b><span>Attendance</span></div></div>
    <section class="acc-card"><h3>Homework</h3>${assigns.length ? `<ul class="hw-list">${assigns.map(a => { const x = assignStat(a, kid, prog, st[a.id + '_' + kid], tm);
      return `<li class="${x.state}"><div class="hw-top"><b>${esc(a.title)}</b><span>Due ${dueText(a)}</span>${statePill(x.state)}</div>${a.note ? `<p class="muted">${esc(a.note)}</p>` : ''}<ul class="hw-items">${x.items.map(r => `<li class="${r.done ? 'ok' : ''}"><span class="n">${r.done ? '✓' : '•'}</span><span>${esc(itemLabel(r.it, true))}</span><b>${r.total != null ? r.n + '/' + r.total : r.mark == null ? '' : r.mark + '%'}</b></li>`).join('')}</ul></li>` }).join('')}</ul>` : '<p class="muted">No homework given yet.</p>'}</section>
    <section class="acc-card"><h3>Attendance</h3>${att.total ? `<p><b>${att.pct}%</b> attended · ${att.present} present, ${att.late} late, ${att.absent} absent</p>` : ''}${attTable(att, kid)}</section>
    <section class="acc-card"><h3>Study time</h3><p class="muted small">Active time only: the page open and in use. Total ${fmtTime(tm.total || 0)}.</p>${dayBars(tm)}</section>
    <section class="acc-card"><h3>Lessons and marks</h3>${lessonTable(prog, tm)}</section>
    <form class="acc-card acc-pw" id="pwForm" hidden><h3>Change password</h3>
      <label for="pw0">Current password<input id="pw0" type="password" autocomplete="current-password"></label>
      <label for="pw1">New password<input id="pw1" type="password" autocomplete="new-password"></label>
      <label for="pw2">New password again<input id="pw2" type="password" autocomplete="new-password"></label>
      <button class="btn btn-primary btn-sm" type="submit">Save password</button><p class="pmsg2" id="pwMsg"></p></form>`;
  $('#accOut').onclick = logout;
  $('#accPw').onclick = () => { $('#pwForm').hidden = !$('#pwForm').hidden };
  $('#pwForm').onsubmit = async (e) => {
    e.preventDefault(); const m = $('#pwMsg'); const a = $('#pw1').value;
    if (a.length < 6) { m.className = 'pmsg2 err'; m.textContent = 'Use at least 6 characters.'; return }
    if (a !== $('#pw2').value) { m.className = 'pmsg2 err'; m.textContent = 'The two new passwords are different.'; return }
    try { await F.reauthenticateWithCredential(auth.currentUser, F.EmailAuthProvider.credential(auth.currentUser.email, $('#pw0').value)); await F.updatePassword(auth.currentUser, a); m.className = 'pmsg2 ok'; m.textContent = 'Password changed.'; e.target.reset() }
    catch (err) { m.className = 'pmsg2 err'; m.textContent = err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' ? 'Current password is not correct.' : 'Could not change the password: ' + (err.code || err.message) }
  };
  try { await F.updateDoc(F.doc(db, 'users', me.user.uid), { lastSeen: F.serverTimestamp() }) } catch {}
})();
