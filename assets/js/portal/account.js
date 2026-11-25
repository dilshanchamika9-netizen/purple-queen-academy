// My portal (student home): two doors (Lessons, Puzzles) and the homework from the coach. Nothing else.
import { db, F, whoAmI, auth, esc, markSignedIn } from './fb.js';
import { hwView, hwSteps, nextStep as hwNext, dueLabel } from './hw.js';
import { assignStat, PASS, PZ_LEVELS } from './lms.js';
import { mountUser, SVG } from './shell.js';
const $ = (s) => document.querySelector(s);
const root = $('#portalAccount');
const MODS = window.PQ_MODULES || [];
export const LEVEL = { 1: 'Level 1 · Basic', 2: 'Level 2 · Intermediate', 3: 'Level 3 · Advanced' };

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
  // include anything saved on this device that is not uploaded yet
  try { const lp = JSON.parse(localStorage.getItem('pq-progress') || '{}'); prog.lessons = { ...(prog.lessons || {}) }; Object.keys(lp).forEach(k => prog.lessons[k] = Math.max(lp[k], prog.lessons[k] || 0)) } catch {}
  const LS = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v) } catch { return d } };
  prog.puzzles = { solved: { ...LS('pqz-solved', {}), ...((prog.puzzles && prog.puzzles.solved) || {}) }, best: Math.max(LS('pqz-best', 0), (prog.puzzles && prog.puzzles.best) || 0) };
  let tm = {}; try { const s = await F.getDoc(F.doc(db, 'time', uid)); if (s.exists()) tm = s.data() } catch {}
  let assigns = [], st = {};
  try { const q = await F.getDocs(F.query(F.collection(db, 'assignments'), F.where('uids', 'array-contains', uid))); assigns = q.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999')) } catch {}
  try { const q = await F.getDocs(F.query(F.collection(db, 'astatus'), F.where('uid', '==', uid))); q.docs.forEach(d => st[d.id] = d.data()) } catch {}

  // ---- lessons: the student's level (set by the coach); modules open one after another ----
  const L = prog.lessons || {}, passed = (l) => (L[l.id] || 0) >= PASS;
  const lvNow = +p.level || 1, lvOf = (k) => PQ_MOD(MODS, k).lv;
  try { localStorage.setItem('pq-level', String(lvNow)) } catch {}
  const idx = MODS.map((m, k) => k).filter(k => lvOf(k) === lvNow);
  const modDone = (k) => MODS[k].lessons.every(passed);
  const modOpen = (k) => k === 0 || lvOf(k) < lvNow || modDone(k - 1) || (lvOf(k) === lvNow && lvOf(k - 1) < lvNow);
  const lTot = idx.reduce((a, k) => a + MODS[k].lessons.length, 0), lDn = idx.reduce((a, k) => a + MODS[k].lessons.filter(passed).length, 0);
  const mDn = idx.filter(modDone).length;
  const curK = idx.find(k => modOpen(k) && !modDone(k));
  const curL = curK != null ? MODS[curK].lessons.findIndex(l => !passed(l)) : -1;
  const segs = idx.map(k => `<i><b style="width:${Math.round(MODS[k].lessons.filter(passed).length / MODS[k].lessons.length * 100)}%"></b></i>`).join('');
  const lessonGo = curK != null
    ? `<a class="sp-go" href="lesson.html?m=${curK}&l=${curL}"><div><span>Up next</span><b>${PQ_MOD(MODS, curK).label.replace(/^Level \d+ · /, '')} · ${esc(MODS[curK].title.en)}</b></div><span class="circ">${SVG.arrow}</span></a>`
    : `<a class="sp-go" href="course.html"><div><span>All done</span><b>Every lesson in ${LEVEL[lvNow] || 'your level'} is passed</b></div><span class="circ">${SVG.arrow}</span></a>`;

  // ---- puzzles ----
  const solvedN = Object.keys(prog.puzzles.solved).length, pzLv = Math.min(5, Math.max(1, +LS('pqz-level', 1) || 1));

  const hr = new Date().getHours(), greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  root.innerHTML = `
    <div class="sp-hello"><div><h1>${greet}, ${esc((p.name || 'student').split(' ')[0])}</h1><p>Pick up where you left off.</p></div><span class="sp-tag">${esc(LEVEL[lvNow] || 'Level ' + lvNow)}${p.batch ? ' · ' + esc(p.batch) : ''}</span></div>
    <div class="sp-doors">
      <section class="sp-door" id="doorLessons"><img class="ghost" src="assets/pieces/wK.svg" alt=""><small>Lessons</small><h2><a href="course.html">Learn chess</a></h2><p>${esc(LEVEL[lvNow] || '')} · ${idx.length} modules · step by step</p>
        <div class="sp-stat"><div><b>${mDn} / ${idx.length}</b><span>Modules done</span></div><div><b>${lDn} / ${lTot}</b><span>Lessons passed</span></div></div>
        <div class="sp-segs" aria-hidden="true">${segs}</div>${lessonGo}</section>
      <section class="sp-door pz" id="doorPuzzles"><img class="ghost" src="assets/pieces/wN.svg" alt=""><small>Puzzles</small><h2><a href="practice.html">Puzzle training</a></h2><p id="pzSub">2,500 puzzles · 5 levels</p>
        <div class="sp-stat"><div><b>${solvedN}</b><span>Puzzles solved</span></div><div><b>${prog.puzzles.best}</b><span>Best streak</span></div></div>
        <div class="sp-segs" id="pzSegs" aria-hidden="true">${'<i><b style="width:0"></b></i>'.repeat(5)}</div>
        <a class="sp-go" href="practice.html"><div><span>Up next</span><b id="pzNext">Level ${pzLv} · ${PZ_LEVELS[pzLv]}</b></div><span class="circ">${SVG.arrow}</span></a></section>
    </div>
    <section class="sp-hwsec" id="hwBox"></section>`;
  paintHw();
  // puzzles per level (same file the puzzle page uses, so it is usually cached)
  try {
    const d = await (await fetch('assets/data/puzzles.json')).json(), per = {}, got = {};
    d.puzzles.forEach(z => { per[z.l] = (per[z.l] || 0) + 1; if (prog.puzzles.solved[z.id]) got[z.l] = (got[z.l] || 0) + 1 });
    $('#pzSub').textContent = `${d.puzzles.length.toLocaleString('en-US')} puzzles · 5 levels`;
    $('#pzSegs').innerHTML = [1, 2, 3, 4, 5].map(l => `<i><b style="width:${per[l] ? Math.round((got[l] || 0) / per[l] * 100) : 0}%"></b></i>`).join('');
    $('#pzNext').textContent = `Level ${pzLv} · ${PZ_LEVELS[pzLv]} · ${got[pzLv] || 0} / ${per[pzLv] || 0} solved`;
  } catch {}

  function hwCard({ a, x }) {
    const hv = hwView(a, x), du = dueLabel(a), steps = hwSteps(a, x, L), nx = hwNext(steps);
    let lt = 0, ld = 0, pt = 0, pd = 0, tt = 0, td = 0;
    x.items.forEach(r => { if (r.it.t === 'lesson') { lt++; if (r.done) ld++ } else if (r.it.t === 'puzzles') { pt += r.total || 0; pd += r.n || 0 } else { tt++; if (r.done) td++ } });
    const all = lt + pt + tt, dn = ld + pd + td, pc = all ? Math.round(dn / all * 100) : 0;
    const chip = (cls, ico, left, tot, one, many) => tot ? `<div class="sp-pc ${cls}${left ? '' : ' ok'}"><i>${left ? ico : SVG.check}</i><div><strong>${left}</strong> <span>${left === 1 ? one : many} ${left ? 'pending' : 'done'}</span></div></div>` : '';
    const dueC = x.state === 'late' ? 'late' : !a.due ? 'none' : du.c === 'soon' ? 'soon' : '';
    return `<li class="sp-hw ${x.state}"><div class="sp-hwh"><a class="hwlink" href="homework.html?a=${a.id}">${esc(hv.title)}</a><span class="sp-due ${dueC}">${esc(du.t.replace(/ · .*/, ''))}</span></div>
      <div class="sp-pend">${chip('', SVG.book, lt - ld, lt, 'lesson', 'lessons')}${chip('pz', SVG.puzzle, pt - pd, pt, 'puzzle', 'puzzles')}${chip('tk', SVG.board, tt - td, tt, 'task', 'tasks')}</div>
      <div class="sp-hwf"><div class="sp-tr"><b style="width:${pc}%"></b></div><em>${dn} / ${all} done</em>${nx ? `<a class="sp-btn p" href="${nx.href}">${dn ? 'Continue' : 'Start'} ${SVG.arrow}</a>` : `<a class="sp-btn" href="homework.html?a=${a.id}">Open ${SVG.arrow}</a>`}</div></li>`;
  }
  function paintHw() {
    const s2 = assigns.map(a => ({ a, x: assignStat(a, uid, prog, st[a.id + '_' + uid], tm) }));
    const op = s2.filter(s => s.x.state !== 'done'), dn = s2.filter(s => s.x.state === 'done');
    $('#hwBox').innerHTML = `<p class="sp-eyb">Homework from your coach<span>${op.length ? op.length + ' to do' : s2.length ? 'All done' : ''}</span></p>`
      + (op.length ? `<ul class="sp-hwgrid">${op.map(hwCard).join('')}</ul>` : `<div class="sp-empty">${s2.length ? 'No homework to do right now. Well done!' : 'No homework yet. Your coach will add it here.'}</div>`)
      + (dn.length ? `<details class="sp-fold"><summary>Completed homework (${dn.length})</summary><ul>${dn.map(({ a, x }) => `<li><a href="homework.html?a=${a.id}">${esc(hwView(a, x).title)}<span>Completed ✓</span></a></li>`).join('')}</ul></details>` : '');
  }
})();
