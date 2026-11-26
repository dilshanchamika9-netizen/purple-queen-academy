// Homework review popup for the coach: score ring, skills, lessons, and a replay of every puzzle the student did
// (wrong moves, retries, hints, time), plus a teaching note the student sees on their homework page.
import { db, F, esc, fmtTime } from './fb.js';
import { PZ_LEVELS, PASS, byId, lessonName } from './lms.js';

const TNAME = { mateIn1: 'Mate in 1', mateIn2: 'Mate in 2', mateIn3: 'Mate in 3', fork: 'Fork', pin: 'Pin', skewer: 'Skewer', hangingPiece: 'Hanging piece', discoveredAttack: 'Discovered attack', sacrifice: 'Sacrifice', backRankMate: 'Back-rank mate', promotion: 'Promotion', endgame: 'Endgame', mate: 'Checkmate', deflection: 'Deflection', attraction: 'Attraction', smotheredMate: 'Smothered mate', advancedPawn: 'Advanced pawn', middlegame: 'Middlegame', opening: 'Opening', trappedPiece: 'Trapped piece', interference: 'Interference', xRayAttack: 'X-ray', zugzwang: 'Zugzwang', quietMove: 'Quiet move', defensiveMove: 'Defensive move', capturingDefender: 'Remove the defender', rookEndgame: 'Rook endgame', pawnEndgame: 'Pawn endgame', queenEndgame: 'Queen endgame', bishopEndgame: 'Bishop endgame', knightEndgame: 'Knight endgame', exposedKing: 'Exposed king', kingsideAttack: 'Kingside attack', queensideAttack: 'Queenside attack', doubleCheck: 'Double check', short: 'Short puzzle', long: 'Long puzzle', veryLong: 'Very long puzzle', oneMove: 'One move', crushing: 'Crushing', advantage: 'Advantage' };
const th = (t) => TNAME[t] || t;
const KIND = ['mateIn1', 'mateIn2', 'mateIn3', 'fork', 'pin', 'skewer', 'hangingPiece', 'discoveredAttack', 'sacrifice', 'backRankMate', 'promotion', 'endgame', 'deflection', 'attraction', 'smotheredMate', 'trappedPiece', 'interference', 'xRayAttack', 'zugzwang', 'capturingDefender', 'doubleCheck', 'quietMove', 'defensiveMove'];
const themesOf = (p) => (p && p.t ? p.t.filter(t => KIND.includes(t)).slice(0, 2) : []);
const sq = (s) => [s.charCodeAt(0) - 97, 8 - +s[1]];
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;

function startFen(p) {
  if (!p || !window.Chess) return null;
  try { const g = new window.Chess(p.fen), m = p.m.split(' ')[0]; g.move({ from: m.slice(0, 2), to: m.slice(2, 4), promotion: m[4] || 'q' }); return g.fen() } catch { return null }
}
function boardHtml(fen) {
  let g = '', s = '';
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) g += `<i class="rvsq ${(r + c) % 2 ? 'd' : 'l'}" data-s="${'abcdefgh'[c] + (8 - r)}"></i>`;
  (fen || '8/8/8/8/8/8/8/8 w').split(' ')[0].split('/').forEach((row, ri) => { let ci = 0; for (const ch of row) { if (/\d/.test(ch)) ci += +ch; else { const w = ch === ch.toUpperCase(); s += `<img class="rvpc" data-s="${'abcdefgh'[ci] + (8 - ri)}" src="assets/pieces/${w ? 'w' : 'b'}${ch.toUpperCase()}.svg" style="left:${ci * 12.5}%;top:${ri * 12.5}%" alt="">`; ci++ } } });
  return g + s;
}
function arrowSvg(m, cls) {
  if (!m || m.length < 4) return '';
  const [a, b] = sq(m.slice(0, 2)), [c, d] = sq(m.slice(2, 4)), x1 = a + .5, y1 = b + .5, x2 = c + .5, y2 = d + .5, l = Math.hypot(x2 - x1, y2 - y1) || 1;
  return `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2 - (x2 - x1) / l * .34}" y2="${y2 - (y2 - y1) / l * .34}" marker-end="url(#rv${cls})"/>`;
}
function ringSvg(p, label, sub) {
  return `<div class="rvring" style="--p:${p}"><svg viewBox="0 0 120 120"><circle class="bg" cx="60" cy="60" r="52"/><circle class="fg" cx="60" cy="60" r="52" pathLength="100" stroke-dasharray="${p} 100"/></svg><div><b>${label}</b><span>${sub}</span></div></div>`;
}
function radarSvg(ax) {
  const n = ax.length; if (n < 3) return '';
  const pt = (i, r) => { const a = (-90 + 360 / n * i) * Math.PI / 180; return [r * Math.cos(a), r * Math.sin(a)] };
  const poly = (r) => ax.map((_, i) => pt(i, r).map(v => v.toFixed(1)).join(',')).join(' ');
  return `<svg class="rvradar" viewBox="-120 -72 240 144" role="img" aria-label="Skills radar"><g class="grid"><polygon points="${poly(55)}"/><polygon points="${poly(36)}"/><polygon points="${poly(18)}"/></g><polygon class="shape" points="${ax.map((a, i) => pt(i, 55 * a.v).map(v => v.toFixed(1)).join(',')).join(' ')}"/>${ax.map((a, i) => { const [x, y] = pt(i, 66); return `<text x="${x.toFixed(1)}" y="${(y + 2).toFixed(1)}" text-anchor="${Math.abs(x) < 6 ? 'middle' : x > 0 ? 'start' : 'end'}">${a.n}</text>` }).join('')}</svg>`;
}

export async function openReview({ a, s, st, prog, tm, puzzles, onNoteSaved }) {
  const uid = s.uid, stDoc = st || {}, pz = stDoc.pz || {}, notes = { ...(stDoc.notes || {}) };
  const sv = ((prog || {}).puzzles || {}).solved || {};
  const lessonIds = (a.items || []).filter(i => i.t === 'lesson').map(i => i.id);
  const pzIds = [].concat(...(a.items || []).filter(i => i.t === 'puzzles').map(i => (i.sets && i.sets[uid]) || []));
  const others = (a.items || []).map((it, i) => ({ it, i })).filter(x => x.it.t === 'task' || x.it.t === 'text');
  const L = (prog || {}).lessons || {};

  // per puzzle
  const P = pzIds.map((id, i) => {
    const r = pz[id] || null, info = puzzles[id] || null;
    let c = 'nt', t = 'Not done';
    if ((r && r.s === 's') || (!r && sv[id])) { const clean = r && !r.r && !r.h; c = !r || clean ? 'ok' : 'wa'; t = clean || !r ? 'Solved on the first try' : 'Solved with help' }
    else if (r && r.s === 'f') { c = 'no'; t = r.k && !r.w ? 'Skipped' : 'Failed' }
    else if (r && (r.r || r.w || r.h)) { c = 'nt'; t = 'In progress' }
    return { id, i, r, info, c, t, th: themesOf(info) };
  });
  const nP = P.length, solved = P.filter(x => x.c === 'ok' || x.c === 'wa').length, clean = P.filter(x => x.c === 'ok').length;
  const hints = P.reduce((n, x) => n + ((x.r && x.r.h) || 0), 0), retries = P.reduce((n, x) => n + ((x.r && x.r.r) || 0), 0);
  const withHints = P.filter(x => x.r && x.r.h).length, tried = P.filter(x => x.r && (x.r.s === 's' || x.r.w || x.r.r || x.r.h || (x.r.s === 'f' && !x.r.k))).length;
  const wrong = P.reduce((n, x) => n + ((x.r && x.r.w) || 0), 0), caps = P.reduce((n, x) => n + (((x.r && x.r.mv) || []).filter(m => m.x).length), 0), mvTotal = P.reduce((n, x) => n + (((x.r && x.r.mv) || []).length), 0);
  const secs = P.reduce((n, x) => n + ((x.r && x.r.sec) || 0), 0);
  const lessonRows = lessonIds.map(id => ({ id, mark: L[id] == null ? null : L[id], att: (tm && tm.lessons && tm.lessons[id] && tm.lessons[id].a) || 0, sec: (tm && tm.lessons && tm.lessons[id] && tm.lessons[id].s) || 0 }));
  const lPass = lessonRows.filter(x => (x.mark || 0) >= PASS).length;
  const total = nP + lessonIds.length, done = solved + lPass, score = pct(done, total);
  const ax = [];
  if (nP) { ax.push({ n: 'Accuracy', v: clean / nP }, { n: 'Tactics', v: solved / nP }, { n: 'Focus', v: 1 - withHints / nP }, { n: 'Persistence', v: P.filter(x => x.c !== 'nt' || (x.r && !x.r.k && x.r.s !== 'f')).length / nP }) }
  if (lessonIds.length) ax.push({ n: 'Lessons', v: lPass / lessonIds.length });
  const avg = ax.length ? ax.reduce((n, x) => n + x.v, 0) / ax.length : 0, tier = !ax.length ? 'Just started' : avg >= .8 ? 'Excelling' : avg >= .55 ? 'On track' : 'Needs support';
  // skills by theme
  const byTheme = {}; P.forEach(x => { if (x.c === 'nt' && !(x.r && x.r.s)) return; x.th.forEach(t => { const o = byTheme[t] || (byTheme[t] = { n: 0, ok: 0, clean: 0 }); o.n++; if (x.c === 'ok' || x.c === 'wa') o.ok++; if (x.c === 'ok') o.clean++ }) });
  const skills = Object.entries(byTheme).map(([t, o]) => ({ t, ...o, p: pct(o.clean, o.n) })).sort((x, y) => y.p - x.p);
  const good = skills.filter(x => x.p >= 70).slice(0, 2).map(x => th(x.t)), weak = skills.filter(x => x.p < 50).slice(-2).map(x => th(x.t));
  const bits = [];
  if (nP && !tried) bits.push('The student has not started the puzzles yet.');
  else if (nP) {
    if (good.length) bits.push(`Strong on <b>${good.join(' and ')}</b>.`);
    if (weak.length) bits.push(`Needs practice on <b>${weak.join(' and ')}</b>.`);
    if (mvTotal >= 2 && caps / mvTotal >= .5) bits.push(`<b>${caps} of ${mvTotal}</b> wrong moves were captures: the student grabs material without checking if the piece is protected.`);
    if (withHints >= 2) bits.push(`Used hints on ${withHints} puzzles.`);
    if (P.some(x => x.r && x.r.k && !x.r.w)) bits.push('Skipped some puzzles without trying.');
  }
  if (lessonIds.length) bits.push(lPass === lessonIds.length ? 'All lessons passed.' : `${lessonIds.length - lPass} of ${lessonIds.length} lessons not yet passed (pass mark ${PASS}%).`);
  if (!bits.length) bits.push('Nothing to review yet.');
  const onTime = stDoc.sub && a.due ? new Date(stDoc.sub).toISOString().slice(0, 10) <= a.due || new Date(stDoc.sub).getTime() <= new Date(a.due + 'T23:59:59').getTime() : false;
  const badges = [];
  if (clean >= 3) badges.push(['🎯', `Sharp eye · ${clean} clean solves`]);
  if (nP && tried && !hints) badges.push(['🧠', 'No hints needed']);
  if (nP && clean === nP) badges.push(['💎', 'Flawless']);
  if (stDoc.sub && onTime) badges.push(['🛡️', 'Submitted on time']);
  if (lessonIds.length && lPass === lessonIds.length) badges.push(['📘', 'All lessons passed']);
  const weakSkill = weak[0];

  const overlay = document.createElement('div'); overlay.className = 'rv-ov'; overlay.setAttribute('role', 'dialog'); overlay.setAttribute('aria-modal', 'true'); overlay.setAttribute('aria-label', 'Homework review');
  const hasP = nP > 0, startTab = hasP ? 'pz' : 'les';
  overlay.innerHTML = `<div class="rv"><button class="rv-x" type="button" aria-label="Close">×</button>
    <div class="rv-hd"><span class="sp-av">${s.photo ? `<img src="${esc(s.photo)}" alt="">` : esc((s.name || '?').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase())}</span>
      <div><h2>${esc(a.title)}</h2><small>${esc(s.name)} · ${esc(s.sid || '')}${s.batch ? ' · ' + esc(s.batch) : ''}</small></div>
      <div class="rv-chips">${a.due ? `<span class="rv-chip">Due ${new Date(a.due + 'T00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>` : ''}${stDoc.sub ? `<span class="rv-chip ok">Submitted ${new Date(stDoc.sub).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>` : nP ? '<span class="rv-chip no">Not submitted yet</span>' : ''}</div></div>
    <div class="rv-hero"><div class="rv-side">${ringSvg(score, score + '%', 'completed')}${radarSvg(ax)}<div class="rv-tier">${tier}</div><small>${nP ? solved + ' of ' + nP + ' puzzles' : ''}${nP && lessonIds.length ? ' · ' : ''}${lessonIds.length ? lPass + ' of ' + lessonIds.length + ' lessons' : ''}</small></div>
      <div class="rv-main"><div class="rv-tiles">
        ${nP ? `<div><small>First-try accuracy</small><b>${pct(clean, nP)}%</b><i>${clean} of ${nP} with no retry or hint</i></div><div><small>Hints used</small><b>${hints}</b><i>on ${withHints} puzzle${withHints === 1 ? '' : 's'}</i></div><div><small>Retries used</small><b>${retries}</b><i>of ${nP * 2} allowed</i></div><div><small>Time on puzzles</small><b>${secs ? fmtTime(secs) : '—'}</b><i>${secs && tried ? 'about ' + fmtTime(secs / tried) + ' each' : 'not recorded yet'}</i></div>`
        : `<div><small>Lessons passed</small><b>${lPass}/${lessonIds.length}</b><i>pass mark ${PASS}%</i></div><div><small>Study time</small><b>${fmtTime(lessonRows.reduce((n, x) => n + x.sec, 0)) || '—'}</b><i>on these lessons</i></div>`}</div>
        <div class="rv-ins"><b>Coach insight</b> ${bits.join(' ')}</div>
        ${badges.length ? `<div class="rv-badges">${badges.map(b => `<span><s>${b[0]}</s>${b[1]}</span>`).join('')}</div>` : ''}</div></div>
    <div class="rv-tabs" role="tablist"><button type="button" role="tab" data-t="les" aria-selected="${startTab === 'les'}">Lessons<em>${lessonIds.length}</em></button><button type="button" role="tab" data-t="pz" aria-selected="${startTab === 'pz'}">Puzzles<em>${nP}</em></button><button type="button" role="tab" data-t="sk" aria-selected="false">Skills</button></div>
    <div class="rv-pane" data-p="les" ${startTab === 'les' ? '' : 'hidden'}>${lessonRows.length ? `<div class="rv-les">${lessonRows.map(x => { const ok = (x.mark || 0) >= PASS; return `<div class="rv-lc"><div><b>${esc(lessonName(x.id))}</b><small>${x.mark == null ? 'Not started' : x.att + ' attempt' + (x.att === 1 ? '' : 's') + ' · ' + fmtTime(x.sec) + ' studied'}</small></div><div class="rv-bar"><i style="width:${x.mark || 0}%"></i><u></u></div><div class="rv-mk ${x.mark == null ? '' : ok ? 'ok' : 'no'}">${x.mark == null ? '—' : x.mark + '% · ' + (ok ? 'Passed' : 'Below ' + PASS + '%')}</div></div>` }).join('')}</div>` : '<p class="muted">This homework has no lessons.</p>'}
      ${others.length ? `<h4>Other tasks</h4><ul class="rv-oth">${others.map(o => `<li class="${stDoc.checks && stDoc.checks[o.i] ? 'ok' : ''}"><span>${stDoc.checks && stDoc.checks[o.i] ? '✓' : '•'}</span>${esc(o.it.t === 'task' ? 'Board task: ' + (o.it.q || '') : o.it.text)}</li>`).join('')}</ul>` : ''}</div>
    <div class="rv-pane" data-p="pz" ${startTab === 'pz' ? '' : 'hidden'}>${nP ? `<div class="rv-nodes">${P.map(x => `<button type="button" class="${x.c}" data-i="${x.i}" aria-pressed="false" title="${esc(x.t)}">${x.i + 1}</button>`).join('')}</div>
      <div class="rv-det"><div><div class="rv-bw"><div class="rv-bg" id="rvBg"></div><svg class="rv-ar" viewBox="0 0 8 8" id="rvAr"><defs><marker id="rvbad" markerWidth="4" markerHeight="4" refX="2.6" refY="2" orient="auto"><path d="M0 0L4 2L0 4z"/></marker><marker id="rvgood" markerWidth="4" markerHeight="4" refX="2.6" refY="2" orient="auto"><path d="M0 0L4 2L0 4z"/></marker></defs></svg></div><div class="rv-leg"><span class="bad">Student played</span><span class="good">Best move</span></div></div>
        <div><div class="rv-ph"><h3 id="rvT"></h3><span class="rv-chip" id="rvS"></span></div><div class="rv-fx" id="rvFx"></div><ol class="rv-tl" id="rvTl"></ol>
          <div class="rv-teach"><b>Teaching note</b> <small>The student sees this on their homework page.</small><textarea id="rvNote" maxlength="300" placeholder="Example: before every capture, ask: is the piece protected?"></textarea>
            <div class="rv-act"><button type="button" class="btn btn-primary btn-sm" id="rvSave">Save note</button><span id="rvMsg" class="rv-msg"></span><span class="sp"></span><button type="button" class="btn btn-ghost btn-sm" id="rvReplay">▶ Replay on board</button><button type="button" class="btn btn-ghost btn-sm" id="rvPrev">← Previous</button><button type="button" class="btn btn-ghost btn-sm" id="rvNext">Next →</button></div></div></div></div>` : '<p class="muted">This homework has no puzzles.</p>'}</div>
    <div class="rv-pane" data-p="sk" hidden>${skills.length ? `<h4>Results by puzzle type</h4>${skills.map(x => `<div class="rv-sk"><span>${esc(th(x.t))}</span><div class="rv-bar ${x.p >= 70 ? 'ok' : x.p >= 40 ? 'wa' : 'no'}"><i style="width:${x.p}%"></i></div><span>${x.clean}/${x.n} clean</span></div>`).join('')}<p class="muted">Clean means solved on the first try with no hint.${weakSkill ? ' Suggested focus: ' + esc(weakSkill) + '.' : ''}</p>` : '<p class="muted">No puzzle results yet.</p>'}</div></div>`;
  document.body.appendChild(overlay); document.body.classList.add('rv-open');
  const $ = (q) => overlay.querySelector(q), $$ = (q) => [...overlay.querySelectorAll(q)];
  const prevFocus = document.activeElement;
  const close = () => { overlay.remove(); document.body.classList.remove('rv-open'); document.removeEventListener('keydown', key); if (prevFocus && prevFocus.focus) prevFocus.focus() };
  const key = (e) => { if (e.key === 'Escape') close() };
  document.addEventListener('keydown', key);
  overlay.addEventListener('click', (e) => { if (e.target === overlay || e.target.closest('.rv-x')) close() });
  $$('.rv-tabs button').forEach(b => b.onclick = () => { $$('.rv-tabs button').forEach(x => x.setAttribute('aria-selected', x === b)); $$('.rv-pane').forEach(p => p.hidden = p.dataset.p !== b.dataset.t) });
  $('.rv-x').focus();

  if (!nP) return;
  let cur = Math.max(0, P.findIndex(x => x.c === 'no' || x.c === 'wa'));
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  function fenFor(x) { const mv = x.r && x.r.mv && x.r.mv[0]; return mv && mv.f ? mv.f : startFen(x.info) }
  function bestFor(x) { const mv = x.r && x.r.mv && x.r.mv[0]; if (mv && mv.b) return mv.b; const m = x.info && x.info.m ? x.info.m.split(' ')[1] : ''; return m || '' }
  function show(i) {
    cur = i; const x = P[i], r = x.r || {}, mv = r.mv || [];
    $$('.rv-nodes button').forEach(b => b.setAttribute('aria-pressed', +b.dataset.i === i));
    $('#rvBg').innerHTML = boardHtml(fenFor(x) || undefined);
    const best = bestFor(x), bad = mv[0] && mv[0].m;
    $('#rvAr').querySelectorAll('line').forEach(l => l.remove());
    $('#rvAr').insertAdjacentHTML('beforeend', (bad ? arrowSvg(bad, 'bad') : '') + (x.c !== 'nt' || bad ? arrowSvg(best, 'good') : ''));
    $('#rvT').textContent = 'Puzzle ' + (i + 1); $('#rvS').textContent = x.t; $('#rvS').className = 'rv-chip ' + (x.c === 'ok' ? 'ok' : x.c === 'no' ? 'no' : x.c === 'wa' ? 'wa' : '');
    const whoMoves = x.info && x.info.fen ? ((x.info.fen.split(' ')[1] === 'w') ? 'Black' : 'White') : '';
    $('#rvFx').innerHTML = [x.info ? `<span class="rv-th">${esc(PZ_LEVELS[x.info.l] || '')}${x.info.r ? ' · rating ' + x.info.r : ''}</span>` : '', whoMoves ? `<span class="rv-th">${whoMoves} to move</span>` : '', ...x.th.map(t => `<span class="rv-th">${esc(th(t))}</span>`), r.sec ? `<span class="rv-th">${fmtTime(r.sec)} spent</span>` : ''].join('');
    const ev = [];
    if (!x.r && x.c === 'nt') ev.push(['nt', 'Not attempted', 'The student has not opened this puzzle yet.']);
    else {
      if (!x.r) ev.push(['ok', 'Solved earlier', 'Solved before this homework was given.']);
      mv.forEach((m, k) => { ev.push(['no', `Try ${m.n || k + 1} · played ${esc(m.s || m.m)}`, `${m.o ? 'Opponent answered ' + esc(m.o) + '. ' : ''}${m.b ? 'Best was ' + esc(bestSan(m)) + '.' : ''}${m.x ? ' A capture.' : ''}`]); if (k < (r.r || 0)) ev.push(['wa', `Retry ${k + 1}`, 'The student restarted the puzzle.']) });
      for (let k = mv.length; k < (r.r || 0); k++) ev.push(['wa', `Retry ${k + 1}`, 'The student restarted the puzzle.']);
      if (r.h) ev.push(['wa', `Hint used ×${r.h}`, 'The hint highlighted the piece to move.']);
      if (r.s === 's') ev.push(['ok', 'Solved', r.r || r.h ? 'Found the solution with help.' : 'Found the solution first time. No hint, no retry, no wrong move.']);
      else if (r.s === 'f') ev.push(['no', r.k && !r.w ? 'Skipped' : 'Failed', r.k ? 'The student pressed Next puzzle without solving it.' : 'No retries left, so the puzzle was closed.']);
      else if (x.r) ev.push(['nt', 'In progress', 'The student left the puzzle open.']);
    }
    $('#rvTl').innerHTML = ev.map(e => `<li class="${e[0]}"><b>${e[1]}</b><small>${e[2]}</small></li>`).join('');
    $('#rvNote').value = notes[x.id] || ''; $('#rvMsg').textContent = ''; $('#rvReplay').disabled = !fenFor(x);
  }
  function bestSan(m) { try { const g = new window.Chess(m.f), mm = g.move({ from: m.b.slice(0, 2), to: m.b.slice(2, 4), promotion: m.b[4] || 'q' }); return mm.san } catch { return m.b } }
  function movePiece(from, to) {
    const t = $(`.rvpc[data-s="${to}"]`); if (t) t.style.opacity = 0;
    const e = $(`.rvpc[data-s="${from}"]`); if (!e) return; const [c, r] = sq(to); e.style.left = c * 12.5 + '%'; e.style.top = r * 12.5 + '%'; e.dataset.s = to + '*';
  }
  async function replay() {
    const x = P[cur], mv = x.r && x.r.mv && x.r.mv[0], best = bestFor(x); const f = fenFor(x); if (!f) return;
    $('#rvReplay').disabled = true; const mine = cur;
    const reset = () => { $('#rvBg').innerHTML = boardHtml(f) };
    reset(); await wait(500); if (cur !== mine) return;
    if (mv && mv.m) { movePiece(mv.m.slice(0, 2), mv.m.slice(2, 4)); const q = $(`.rvsq[data-s="${mv.m.slice(2, 4)}"]`); if (q) q.classList.add('bad'); await wait(1700); if (cur !== mine) return; reset(); await wait(350) }
    if (best) { movePiece(best.slice(0, 2), best.slice(2, 4)); const q = $(`.rvsq[data-s="${best.slice(2, 4)}"]`); if (q) q.classList.add('good') }
    await wait(900); $('#rvReplay').disabled = false;
  }
  $('.rv-nodes').onclick = (e) => { const b = e.target.closest('button[data-i]'); if (b) show(+b.dataset.i) };
  $('#rvPrev').onclick = () => show((cur + nP - 1) % nP); $('#rvNext').onclick = () => show((cur + 1) % nP); $('#rvReplay').onclick = replay;
  $('#rvSave').onclick = async () => {
    const x = P[cur], text = $('#rvNote').value.trim().slice(0, 300), b = $('#rvSave'); b.disabled = true; $('#rvMsg').textContent = 'Saving…'; $('#rvMsg').className = 'rv-msg';
    try {
      await F.setDoc(F.doc(db, 'astatus', a.id + '_' + uid), { aid: a.id, uid, notes: { ...notes, [x.id]: text }, updatedAt: F.serverTimestamp() }, { merge: true });
      if (text) notes[x.id] = text; else delete notes[x.id];
      if (onNoteSaved) onNoteSaved({ ...notes }); $('#rvMsg').textContent = 'Saved. The student can see it.'; $('#rvMsg').className = 'rv-msg ok';
    } catch { $('#rvMsg').textContent = 'Could not save. Try again.'; $('#rvMsg').className = 'rv-msg no' }
    b.disabled = false;
  };
  show(cur);
}
