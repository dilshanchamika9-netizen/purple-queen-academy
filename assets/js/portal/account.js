import { auth, db, F, whoAmI, logout, esc, markSignedIn, fmtTime, today } from './fb.js';
import './pay.js';
import { feesBlock, attStat, attTable, assignStat, itemLabel, secsInLastDays, dueText, statePill, byId, MODS as LMODS } from './lms.js';
const $ = (s) => document.querySelector(s);
const root = $('#portalAccount');
const MODS = window.PQ_MODULES || (window.PQ_MODULE ? [window.PQ_MODULE] : []);
const LESSONS = MODS.flatMap(m => m.lessons);
const LEVEL = { 1: 'Level 1 · Pawn (Basic)', 2: 'Level 2 · Knight (Intermediate)', 3: 'Level 3 · Queen (Advanced)' };

(async () => {
  const me = await whoAmI();
  if (!me) return (location.href = 'login.html');
  if (me.role === 'coach') return (location.href = 'coach.html');
  if (me.role !== 'student') { await F.signOut(auth); return (location.href = 'login.html') }
  if (me.profile && me.profile.mustChange) return (location.href = 'login.html');
  markSignedIn(true, 'student');
  const p = me.profile || {};
  let prog = {}; try { const s = await F.getDoc(F.doc(db, 'progress', me.user.uid)); if (s.exists()) prog = s.data() } catch {}
  // include anything saved on this device that is not uploaded yet
  try { const lp = JSON.parse(localStorage.getItem('pq-progress') || '{}'); prog.lessons = { ...lp, ...(prog.lessons || {}) }; Object.keys(lp).forEach(k => prog.lessons[k] = Math.max(lp[k], (prog.lessons[k] || 0))) } catch {}
  const L = prog.lessons || {}, passed = LESSONS.filter(l => (L[l.id] || 0) >= 70).length;
  const scores = LESSONS.map(l => L[l.id]).filter(v => v != null), avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  let tm = {}; try { const s = await F.getDoc(F.doc(db, 'time', me.user.uid)); if (s.exists()) tm = s.data() } catch {}
  let assigns = [], st = {};
  try { const q = await F.getDocs(F.query(F.collection(db, 'assignments'), F.where('uids', 'array-contains', me.user.uid))); assigns = q.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.due || '').localeCompare(b.due || '')) } catch {}
  try { const q = await F.getDocs(F.query(F.collection(db, 'astatus'), F.where('uid', '==', me.user.uid))); q.docs.forEach(d => st[d.id] = d.data()) } catch {}
  let sess = []; try { const q = await F.getDocs(F.query(F.collection(db, 'attendance'), F.where('uids', 'array-contains', me.user.uid))); sess = q.docs.map(d => d.data()) } catch {}
  const att = attStat(sess, me.user.uid);
  let invs = []; try { const q = await F.getDocs(F.query(F.collection(db, 'invoices'), F.where('uid', '==', me.user.uid))); invs = q.docs.map(d => ({ id: d.id, ...d.data() })) } catch {}
  const solved = prog.puzzles && prog.puzzles.solved ? Object.keys(prog.puzzles.solved).length : 0;
  const nextIdx = LESSONS.findIndex(l => (L[l.id] || 0) < 70);
  const ICO = {
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M9 7h6"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
    puzzle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M10 3h4v3a2 2 0 1 0 4 0h3v5h-3a2 2 0 1 0 0 4h3v5H3v-5h3a2 2 0 1 0 0-4H3V3z" transform="scale(.9) translate(1.3 1.3)"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 11h18"/></svg>',
    fire: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 4 5 5.5 5 11a5 5 0 0 1-10 0c0-2 1-3.2 2-4.2.2 1.4.9 2.2 1.7 2.7C10 8 10.5 4.5 12 2z"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    chev: '<svg class="chev" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
    arrow: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M12 14v4M8 21h8"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8l-6.2 3.300 1.200-6.900-5-4.900 6.900-1z"/></svg>'
  };
  const xp = prog.xp || 0, lvN = Math.floor(xp / 200) + 1, xpIn = xp % 200, ini = esc((p.name || p.sid || '?').split(' ').map(w => w[0]).join('').slice(0, 2));
  const pct = LESSONS.length ? Math.round(passed / LESSONS.length * 100) : 0;
  // study streak + 14-week heat map from time doc
  const dk = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const dayS = (i) => (tm.days && tm.days[dk(new Date(Date.now() - i * 864e5))]) || 0;
  let streak = 0; for (let i = dayS(0) ? 0 : 1; i < 400 && dayS(i) > 0; i++) streak++;
  const heat = Array.from({ length: 42 }, (_, j) => { const s = dayS(41 - j), c = s === 0 ? '' : s < 600 ? 'h1' : s < 1800 ? 'h2' : s < 3600 ? 'h3' : 'h4'; return `<i class="${c}" title="${dk(new Date(Date.now() - (41 - j) * 864e5))} · ${fmtTime(s)}"></i>` }).join('');
  const nl = nextIdx > -1 ? LESSONS[nextIdx] : null, nlMod = nl ? MODS.findIndex(m => m.lessons.includes(nl)) : -1;
  const nlIdx = nl ? MODS[nlMod].lessons.indexOf(nl) : 0;
  const BADGES = [
    ['First lesson', passed >= 1, ICO.book], ['5 lessons', passed >= 5, ICO.star], ['10 lessons', passed >= 10, ICO.trophy], ['Module done', MODS.some(m => m.lessons.every(l => (L[l.id] || 0) >= 70)), ICO.trophy],
    ['Puzzle starter', solved >= 1, ICO.puzzle], ['25 puzzles', solved >= 25, ICO.target], ['Top mark', scores.some(v => v >= 100), ICO.bolt], ['3-day streak', streak >= 3, ICO.fire]];
  const ring = (v, id) => `<div class="ring"><svg viewBox="0 0 36 36"><circle class="rg-bg" cx="18" cy="18" r="15.9"/><circle class="rg" cx="18" cy="18" r="15.9" stroke-dasharray="${v} 100"/></svg><b>${v}%</b></div>`;
  const levels = [1, 2, 3].map(lv => {
    const idx = MODS.map((m, k) => k).filter(k => PQ_MOD(MODS, k).lv === lv); if (!idx.length) return '';
    const tot = idx.reduce((a, k) => a + MODS[k].lessons.length, 0), dn = idx.reduce((a, k) => a + MODS[k].lessons.filter(l => (L[l.id] || 0) >= 70).length, 0);
    const curLv = nlMod > -1 && idx.includes(nlMod), openIt = curLv || (nlMod === -1 && lv === 1);
    const cards = idx.map(k => {
      const m = MODS[k], modOpen = k === 0 || MODS[k - 1].lessons.every(l => (L[l.id] || 0) >= 70), done = m.lessons.filter(l => (L[l.id] || 0) >= 70).length, nxt = m.lessons.findIndex(l => (L[l.id] || 0) < 70), isCur = k === nlMod;
      const pc = Math.round(done / m.lessons.length * 100);
      return `<article class="modcard${modOpen ? '' : ' locked'}${isCur ? ' cur open' : ''}"><div class="mh"><div><small>${PQ_MOD(MODS, k).label}</small><h4>${esc(m.title.en)}</h4></div>${ring(pc)}</div>
        <ol class="mlist">${m.lessons.map((l, i) => { const v = L[l.id], ok = v >= 70, open = modOpen && (i === 0 || (L[m.lessons[i - 1].id] || 0) >= 70), cur = open && i === nxt;
          const inner = `<span class="n">${ok ? '✓' : open ? i + 1 : '·'}</span><span>${esc(l.title.en)}</span><b>${v != null ? v + '%' : cur ? 'Start' : ''}</b>`;
          return open ? `<li class="${ok ? 'ok' : ''} ${cur ? 'cur' : ''}"><a href="learn.html?m=${k}&l=${i}">${inner}</a></li>` : `<li class="lk">${inner}</li>` }).join('')}</ol>
        <div class="acts">${modOpen ? `<a class="btn btn-primary" href="learn.html?m=${k}${nxt > -1 ? '&l=' + nxt : ''}">${nxt === -1 ? 'Review' : done ? 'Continue' : 'Start'} ${ICO.arrow}</a><button type="button" class="tg">${m.lessons.length} lessons ▾</button>` : `<span class="lockmsg">${ICO.lock} Finish the previous module</span>`}</div></article>` }).join('');
    return `<details class="lvl l${lv} rv-p" ${openIt ? 'open' : ''}><summary><div class="lv-ic">${lv}</div><div><h3>${LEVEL[lv]}</h3><p class="lv-sub">${dn}/${tot} lessons passed</p></div>${ICO.chev}</summary><div class="mods">${cards}</div></details>` }).join('');
  root.innerHTML = `
    <div class="hud">
      <div class="avring"><svg viewBox="0 0 36 36"><defs><linearGradient id="gXp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6E3AE"/><stop offset="1" stop-color="#C9A45C"/></linearGradient><linearGradient id="gRing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8B5FC2"/><stop offset="1" stop-color="#C9A45C"/></linearGradient></defs><circle class="rg-bg" cx="18" cy="18" r="16.5" fill="none" stroke-width="2"/><circle class="rg" cx="18" cy="18" r="16.5" fill="none" stroke-width="2" stroke-linecap="round" stroke-dasharray="${Math.round(xpIn / 200 * 103.7)} 104"/></svg><button type="button" class="av" id="avBtn" title="Change profile photo" aria-label="Change profile photo">${p.photo ? `<img src="${esc(p.photo)}" alt="">` : ini}<span class="cam" aria-hidden="true">📷</span></button><input type="file" id="avFile" accept="image/*" hidden><span class="lv">LV ${lvN}</span></div>
      <div><p class="eyebrow">Student portal · ${esc(p.sid || '')}</p><h1>Hello, <em>${esc((p.name || 'student').split(' ')[0])}</em></h1>
        <p class="sub">${esc(LEVEL[p.level] || 'Level ' + (p.level || 1))}${p.batch ? ' · ' + esc(p.batch) : ''}</p>
        <div class="xpbar"><div class="t"><span>XP ${xpIn} / 200</span><span>NEXT: LV ${lvN + 1}</span></div><i><b data-w="${Math.round(xpIn / 2)}"></b></i></div></div>
      <div class="hud-side"><span class="chipx fire">${ICO.fire}${streak}-day streak</span><span class="chipx">${ICO.bolt}${xp} XP</span>
        <div style="display:flex;gap:8px"><button type="button" class="btn btn-ghost btn-sm" id="accPw">Password</button><button type="button" class="btn btn-ghost btn-sm" id="accOut">Sign out</button></div></div>
    </div>
    <div class="dash">
      <div class="dmain">
        ${nl ? `<a class="mission rv-p" href="learn.html?m=${nlMod}&l=${nlIdx}"><div class="mi">${ICO.play}</div><div><small>Your next mission</small><h2>${esc(nl.title.en)}</h2><p>${PQ_MOD(MODS, nlMod).label} · ${esc(MODS[nlMod].title.en)}</p></div><span class="go">Launch ${ICO.arrow}</span></a>`
          : `<div class="mission rv-p"><div class="mi">${ICO.trophy}</div><div><small>All clear</small><h2>Every lesson passed</h2><p>Ask your coach about promotion.</p></div></div>`}
        <section class="acc-card rv-p" id="hwBox"></section>
        ${levels}
        <section class="acc-card rv-p" id="feeBox"><h3>Fees</h3>${feesBlock(invs, { payBtn: true })}</section>
        <section class="acc-card rv-p"><h3>My attendance</h3>${attTable(att, me.user.uid)}</section>
        <form class="acc-card acc-pw" id="pwForm" hidden><h3>Change password</h3>
          <label for="pw0">Current password<input id="pw0" type="password" autocomplete="current-password"></label>
          <label for="pw1">New password<input id="pw1" type="password" autocomplete="new-password"></label>
          <label for="pw2">New password again<input id="pw2" type="password" autocomplete="new-password"></label>
          <button class="btn btn-primary btn-sm" type="submit">Save password</button><p class="pmsg2" id="pwMsg"></p></form>
      </div>
      <aside class="dside">
        <div class="stats6 rv-p">
          <div class="stat">${ICO.book}<b data-count="${passed}" data-suf="/${LESSONS.length}">0</b><span>Lessons passed</span></div>
          <div class="stat">${ICO.target}<b data-count="${avg}" data-suf="%">0</b><span>Average mark</span></div>
          <div class="stat">${ICO.puzzle}<b data-count="${solved}">0</b><span>Puzzles solved</span></div>
          <div class="stat">${ICO.clock}<b>${fmtTime(secsInLastDays(tm, 7))}</b><span>Study, 7 days</span></div>
          <div class="stat" style="grid-column:1/-1">${ICO.cal}<b>${att.pct == null ? '—' : att.pct + '%'}</b><span>Attendance</span></div>
        </div>
        <section class="acc-card rv-p"><h3>Study activity</h3><div class="heat">${heat}</div><div class="heatcap"><span>6 weeks ago</span><span>Today</span></div></section>
        <section class="acc-card rv-p"><h3>Achievements</h3><div class="badges">${BADGES.map(b => `<div class="bdg${b[1] ? ' on' : ''}"><i>${b[2]}</i>${b[0]}</div>`).join('')}</div></section>
        <section class="acc-card rv-p"><h3>Puzzles</h3><div class="bigpz">${solved}<small>SOLVED · BEST STREAK ${(prog.puzzles && prog.puzzles.best) || 0}</small></div><p style="margin:14px 0 0"><a class="btn btn-ghost" href="puzzle.html">Solve puzzles ${ICO.arrow}</a></p></section>
      </aside>
    </div>`;
  root.querySelectorAll('.modcard .tg').forEach(t => t.onclick = () => t.closest('.modcard').classList.toggle('open'));
  paintHw(); if (window.PQ_UI) PQ_UI.enhance(root);
  function paintHw() {
    const box = $('#hwBox');
    box.innerHTML = '<h3>My homework</h3>' + (assigns.length ? '<ul class="hw-list">' + assigns.map(a => {
      const x = assignStat(a, me.user.uid, prog, st[a.id + '_' + me.user.uid], tm);
      return `<li class="${x.state}"><div class="hw-top"><b>${esc(a.title)}</b><span>Due ${dueText(a)}</span>${statePill(x.state)}</div>${a.note ? `<p class="muted">${esc(a.note)}</p>` : ''}
        <ul class="hw-items">${x.items.map((r, i) => r.it.t === 'lesson'
          ? `<li class="${r.done ? 'ok' : ''}"><span class="n">${r.done ? '✓' : '•'}</span>${(() => { const l = byId[r.it.id]; return l ? `<a href="learn.html?m=${l.mod}&l=${LMODS[l.mod].lessons.findIndex(z => z.id === l.id)}">${esc(itemLabel(r.it, true))}</a>` : esc(r.it.id) })()}<b>${r.mark == null ? '' : r.mark + '%'}</b></li>`
          : r.it.t === 'puzzles' ? `<li class="${r.done ? 'ok' : ''}"><span class="n">${r.done ? '✓' : '•'}</span>${r.total ? `<a href="puzzle.html?hw=${a.id}&set=${r.ids.join(',')}">${esc(itemLabel(r.it, true))}</a>` : esc(itemLabel(r.it, true)) + ' (none left to assign)'}<b>${r.n}/${r.total}</b></li>`
          : r.it.t === 'task' ? `<li class="${r.done ? 'ok' : ''}"><span class="n">${r.done ? '✓' : '•'}</span><a href="task.html?a=${a.id}&i=${i}">${esc(itemLabel(r.it, true))}</a><b>${r.done ? 'Solved' : 'Open'}</b></li>`
          : `<li class="${r.done ? 'ok' : ''}"><label><input type="checkbox" data-a="${a.id}" data-i="${i}" ${r.done ? 'checked' : ''}> ${esc(r.it.text)}</label></li>`).join('')}</ul></li>` }).join('') + '</ul>' : '<p class="muted">No homework right now.</p>');
  }
  $('#hwBox').addEventListener('change', async (e) => {
    const c = e.target.closest('input[data-a]'); if (!c) return;
    const key = c.dataset.a + '_' + me.user.uid, cur = st[key] || { aid: c.dataset.a, uid: me.user.uid, checks: {} };
    const checks = { ...cur.checks }; if (c.checked) checks[c.dataset.i] = true; else delete checks[c.dataset.i];
    const next = { aid: c.dataset.a, uid: me.user.uid, checks };
    try { await F.setDoc(F.doc(db, 'astatus', key), { ...next, updatedAt: F.serverTimestamp() }); st[key] = next; paintHw() } catch { c.checked = !c.checked }
  });
  $('#avBtn').onclick = () => $('#avFile').click();
  $('#avFile').onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const img = await new Promise((ok, no) => { const i = new Image(), u = URL.createObjectURL(f); i.onload = () => { URL.revokeObjectURL(u); ok(i) }; i.onerror = no; i.src = u });
      const c = document.createElement('canvas'); c.width = c.height = 160; const k = Math.min(img.width, img.height), x = c.getContext('2d');
      x.drawImage(img, (img.width - k) / 2, (img.height - k) / 2, k, k, 0, 0, 160, 160);
      const data = c.toDataURL('image/jpeg', .82);
      await F.updateDoc(F.doc(db, 'users', me.user.uid), { photo: data }); p.photo = data;
      $('#avBtn').innerHTML = `<img src="${data}" alt=""><span class="cam" aria-hidden="true">📷</span>`;
    } catch { alert('Could not save the photo. Try a smaller picture.') }
    e.target.value = '';
  };
  $('#accOut').onclick = logout;
  $('#accPw').onclick = () => { $('#pwForm').hidden = !$('#pwForm').hidden };
  $('#pwForm').onsubmit = async (e) => {
    e.preventDefault(); const m = $('#pwMsg'); const a = $('#pw1').value;
    if (a.length < 6) { m.className = 'pmsg2 err'; m.textContent = 'Use at least 6 characters.'; return }
    if (a !== $('#pw2').value) { m.className = 'pmsg2 err'; m.textContent = 'The two new passwords are different.'; return }
    try { await F.reauthenticateWithCredential(auth.currentUser, F.EmailAuthProvider.credential(auth.currentUser.email, $('#pw0').value)); await F.updatePassword(auth.currentUser, a); m.className = 'pmsg2 ok'; m.textContent = 'Password changed.'; e.target.reset() }
    catch (err) { m.className = 'pmsg2 err'; m.textContent = err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' ? 'Current password is not correct.' : 'Could not change the password: ' + (err.code || err.message) }
  };
})();
