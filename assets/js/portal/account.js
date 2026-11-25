import { auth, db, F, whoAmI, logout, esc, markSignedIn, fmtTime, today } from './fb.js';
import './pay.js';
import { hwSteps, nextStep as hwNext, dueLabel as hwDue, lessonHref as lHref } from './hw.js';
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
  // ---------- how the coach panel drives this page ----------
  // coach sets the level  -> we open that level and keep earlier levels open for review
  // coach gives homework  -> it comes first, and the "next" button follows the homework
  const lvNow = +p.level || 1, lvOf = (k) => PQ_MOD(MODS, k).lv, passedL = (l) => (L[l.id] || 0) >= 70;
  try { localStorage.setItem('pq-level', String(lvNow)) } catch {}
  const modDone = (k) => MODS[k].lessons.every(passedL);
  const modOpenK = (k) => k === 0 || lvOf(k) < lvNow || modDone(k - 1) || (lvOf(k) === lvNow && lvOf(k - 1) < lvNow);
  const lessonHref = (id, aid) => lHref(id, aid) || 'lesson.html';
  const lessonSub = (id) => { const l = byId[id]; return l ? PQ_MOD(MODS, l.mod).label : '' };
  const uid = me.user.uid, stats = assigns.map(a => ({ a, x: assignStat(a, uid, prog, st[a.id + '_' + uid], tm) }));
  const openHw = stats.filter(s => s.x.state !== 'done'), doneHw = stats.filter(s => s.x.state === 'done');
  // next step: first unfinished lesson in open homework, else the first lesson not passed in the student's level
  let nextStep = null;
  for (const s of openHw) { const n = hwSteps(s.a, s.x, L).find(z => z.kind === 'lesson' && !z.done && !z.lock); if (n) { nextStep = { id: n.r.it.id, from: s.a.title, aid: s.a.id }; break } }
  if (!nextStep) { const k = MODS.findIndex((m, k) => lvOf(k) === lvNow && modOpenK(k) && m.lessons.some(l => !passedL(l))); if (k > -1) nextStep = { id: MODS[k].lessons.find(l => !passedL(l)).id, from: '' } }
  const levels = [1, 2, 3].map(lv => {
    const idx = MODS.map((m, k) => k).filter(k => lvOf(k) === lv); if (!idx.length) return '';
    const tot = idx.reduce((a, k) => a + MODS[k].lessons.length, 0), dn = idx.reduce((a, k) => a + MODS[k].lessons.filter(passedL).length, 0);
    const tag = lv === lvNow ? '<span class="lvtag now">Your level</span>' : lv < lvNow ? '<span class="lvtag">Review</span>' : '<span class="lvtag lk">Opens when your coach promotes you</span>';
    const cards = lv > lvNow ? '' : idx.map(k => {
      const m = MODS[k], mo = modOpenK(k), done = m.lessons.filter(passedL).length, nxt = m.lessons.findIndex(l => !passedL(l)), isCur = nextStep && m.lessons.some(l => l.id === nextStep.id);
      const pc = Math.round(done / m.lessons.length * 100);
      return `<article class="modcard${mo ? '' : ' locked'}${isCur ? ' cur open' : ''}"><div class="mh"><div><small>${PQ_MOD(MODS, k).label}</small><h4>${esc(m.title.en)}</h4></div>${ring(pc)}</div>
        <ol class="mlist">${m.lessons.map((l, i) => { const v = L[l.id], ok = v >= 70, open = mo && (i === 0 || passedL(m.lessons[i - 1])), cur = open && i === nxt;
          const inner = `<span class="n">${ok ? '✓' : open ? i + 1 : '·'}</span><span>${esc(l.title.en)}</span><b>${v != null ? v + '%' : cur ? 'Start' : ''}</b>`;
          return open ? `<li class="${ok ? 'ok' : ''} ${cur ? 'cur' : ''}"><a href="lesson.html?m=${k}&l=${i}">${inner}</a></li>` : `<li class="lk">${inner}</li>` }).join('')}</ol>
        <div class="acts">${mo ? `<a class="btn btn-primary" href="lesson.html?m=${k}${nxt > -1 ? '&l=' + nxt : ''}">${nxt === -1 ? 'Review' : done ? 'Continue' : 'Start'} ${ICO.arrow}</a><button type="button" class="tg">${m.lessons.length} lessons ▾</button>` : `<span class="lockmsg">${ICO.lock} Finish the previous module</span>`}</div></article>` }).join('');
    return `<details class="lvl l${lv}${lv > lvNow ? ' lvlock' : ''}" ${lv === lvNow ? 'open' : ''}><summary><div class="lv-ic">${lv}</div><div><h3>${LEVEL[lv]} ${tag}</h3><p class="lv-sub">${dn}/${tot} lessons passed</p></div>${lv > lvNow ? ICO.lock : ICO.chev}</summary>${cards ? `<div class="mods">${cards}</div>` : ''}</details>` }).join('');
  const lvIdx = MODS.map((m, k) => k).filter(k => lvOf(k) === lvNow), lvTot = lvIdx.reduce((a, k) => a + MODS[k].lessons.length, 0), lvDn = lvIdx.reduce((a, k) => a + MODS[k].lessons.filter(passedL).length, 0);
  const nlL = nextStep && byId[nextStep.id];
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
        ${nlL ? `<a class="mission rv-p" href="${lessonHref(nextStep.id, nextStep.aid)}"><div class="mi">${ICO.play}</div><div><small>${nextStep.from ? 'Next step · homework' : 'Your next lesson'}</small><h2>${esc(nlL.title.en)}</h2><p>${lessonSub(nextStep.id)} · ${esc(MODS[nlL.mod].title.en)}${nextStep.from ? ' · ' + esc(nextStep.from) : ''}</p></div><span class="go">Start ${ICO.arrow}</span></a>`
          : `<div class="mission rv-p"><div class="mi">${ICO.trophy}</div><div><small>All clear</small><h2>Every lesson in your level is passed</h2><p>Solve puzzles, and ask your coach about the promotion test.</p></div></div>`}
        <section class="acc-card rv-p" id="hwBox"></section>
        <section class="course rv-p"><div class="sec-t"><h3>My lessons</h3><span>${LEVEL[lvNow] || ''} · ${lvDn}/${lvTot} passed</span></div>${levels}</section>
        <div class="duo">
          <section class="acc-card rv-p" id="feeBox"><h3>Fees</h3>${feesBlock(invs, { payBtn: true })}</section>
          <section class="acc-card rv-p"><h3>My attendance</h3>${att.total ? `<div class="attsum"><b>${att.pct}%</b><span>${att.present} present · ${att.late} late · ${att.absent} absent<br><small>${att.total} classes</small></span></div><details class="more"><summary>Show classes</summary>${attTable(att, me.user.uid)}</details>` : '<p class="muted">No classes marked yet.</p>'}</section>
        </div>
        <form class="acc-card acc-pw" id="pwForm" hidden><h3>Change password</h3>
          <label for="pw0">Current password<input id="pw0" type="password" autocomplete="current-password"></label>
          <label for="pw1">New password<input id="pw1" type="password" autocomplete="new-password"></label>
          <label for="pw2">New password again<input id="pw2" type="password" autocomplete="new-password"></label>
          <button class="btn btn-primary btn-sm" type="submit">Save password</button><p class="pmsg2" id="pwMsg"></p></form>
      </div>
      <aside class="dside">
        <div class="stats6 rv-p">
          <div class="stat">${ICO.book}<b>${lvDn}/${lvTot}</b><span>Level ${lvNow} lessons</span></div>
          <div class="stat">${ICO.target}<b data-count="${avg}" data-suf="%">0</b><span>Average mark</span></div>
          <a class="stat statlink" href="practice.html">${ICO.puzzle}<b data-count="${solved}">0</b><span>Puzzles solved →</span></a>
          <div class="stat">${ICO.clock}<b>${fmtTime(secsInLastDays(tm, 7))}</b><span>Study, 7 days</span></div>
          ${att.total ? `<div class="stat" style="grid-column:1/-1">${ICO.cal}<b>${att.pct}%</b><span>Attendance · ${att.total} classes</span></div>` : ''}
        </div>
        <a class="pzcta rv-p" href="practice.html"><span class="pzi">${ICO.puzzle}</span><span><b>Puzzle training</b><small>2,500 puzzles in five levels · ${solved} solved</small></span>${ICO.arrow}</a>
        <section class="acc-card rv-p"><h3>Study activity</h3><div class="heat">${heat}</div><div class="heatcap"><span>6 weeks ago</span><span>Today</span></div></section>
        <section class="acc-card rv-p"><h3>Achievements</h3><div class="badges">${BADGES.map(b => `<div class="bdg${b[1] ? ' on' : ''}"><i>${b[2]}</i>${b[0]}</div>`).join('')}</div></section>
      </aside>
    </div>`;
  root.querySelectorAll('.modcard .tg').forEach(t => t.onclick = () => t.closest('.modcard').classList.toggle('open'));
  paintHw(); if (window.PQ_UI) PQ_UI.enhance(root);
  function hwCard({ a, x }) {
    const du = hwDue(a), pc = x.total ? Math.round(x.done / x.total * 100) : 0, steps = hwSteps(a, x, L), nx = x.state !== 'done' && hwNext(steps);
    const kinds = { lesson: 0, puzzles: 0, task: 0, text: 0 }; x.items.forEach(r => kinds[r.it.t] = (kinds[r.it.t] || 0) + (r.it.t === 'puzzles' ? (r.total || 0) : 1));
    const what = [kinds.lesson ? kinds.lesson + (kinds.lesson > 1 ? ' lessons' : ' lesson') : '', kinds.puzzles ? kinds.puzzles + ' puzzles' : '', kinds.task ? kinds.task + (kinds.task > 1 ? ' board tasks' : ' board task') : '', kinds.text ? kinds.text + (kinds.text > 1 ? ' tasks' : ' task') : ''].filter(Boolean).join(' · ');
    return `<li class="hwc ${x.state}"><div class="hw-top"><div class="hwt"><a class="hwlink" href="homework.html?a=${a.id}"><b>${esc(a.title)}</b></a><span class="due ${x.state === 'done' ? '' : du.c}">${x.state === 'done' ? 'Completed' : du.t}</span></div>${statePill(x.state)}</div>
      ${a.note && x.state !== 'done' ? `<p class="hwnote">${esc(a.note)}</p>` : ''}
      <p class="hwwhat">${what}</p>
      <div class="hwprog"><i><b style="width:${pc}%"></b></i><em>${x.done}/${x.total} done</em><a class="btn btn-ghost btn-sm" href="homework.html?a=${a.id}">Open</a>${nx ? `<a class="btn btn-primary btn-sm" href="${nx.href}">${x.done ? 'Continue' : 'Start'} ${ICO.arrow}</a>` : ''}</div></li>`;
  }
  function paintHw() {
    const box = $('#hwBox'), s2 = assigns.map(a => ({ a, x: assignStat(a, uid, prog, st[a.id + '_' + uid], tm) }));
    const op = s2.filter(s => s.x.state !== 'done'), dn = s2.filter(s => s.x.state === 'done');
    box.innerHTML = `<div class="sec-t"><h3>Homework from your coach</h3><span>${op.length ? op.length + ' to do' : 'All done'}</span></div>`
      + (s2.length ? `<ul class="hw-list">${op.map(hwCard).join('')}</ul>${op.length ? '' : '<p class="muted">No homework to do right now. Well done!</p>'}`
        + (dn.length ? `<details class="hwdone"${op.length ? '' : ' open'}><summary>Completed homework (${dn.length})</summary><ul class="hw-list">${dn.map(hwCard).join('')}</ul></details>` : '')
        : '<p class="muted">No homework yet. Your coach will add it here.</p>');
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
