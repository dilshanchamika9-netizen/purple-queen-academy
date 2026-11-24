/* Purple Queen puzzle trainer — 2,000 Lichess puzzles (CC0) in 5 levels */
(function () {
  const root = document.getElementById('puzzleApp');
  if (!root || !window.Chess) return;
  const $ = (s, r = root) => r.querySelector(s);
  const $$ = (s, r = root) => [...r.querySelectorAll(s)];
  const F = 'abcdefgh';
  const GLYPH = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' };
  const store = {
    get(k, d) { try { const v = localStorage.getItem('pqz-' + k); return v == null ? d : JSON.parse(v) } catch { return d } },
    set(k, v) { try { localStorage.setItem('pqz-' + k, JSON.stringify(v)) } catch {} if (k === 'solved' || k === 'best') window.dispatchEvent(new Event('pq-saved')) },
  };
  const LEVELS = [
    { id: 1, name: 'Beginner', piece: '♙', range: 'under 1000', tip: 'Mates in 1 and 2, hanging pieces' },
    { id: 2, name: 'Improver', piece: '♘', range: '1000 – 1299', tip: 'Forks, pins and short combinations' },
    { id: 3, name: 'Club player', piece: '♗', range: '1300 – 1599', tip: 'Two- and three-move tactics' },
    { id: 4, name: 'Advanced', piece: '♖', range: '1600 – 1999', tip: 'Deeper calculation and endgames' },
    { id: 5, name: 'Expert', piece: '♕', range: '2000 +', tip: 'Tournament-strength puzzles' },
  ];
  const THEMES = [['all', 'All themes'], ['mateIn1', 'Mate in 1'], ['mateIn2', 'Mate in 2'], ['mateIn3', 'Mate in 3'], ['fork', 'Fork'], ['pin', 'Pin'], ['skewer', 'Skewer'],
    ['hangingPiece', 'Hanging piece'], ['discoveredAttack', 'Discovered attack'], ['sacrifice', 'Sacrifice'], ['backRankMate', 'Back-rank mate'], ['promotion', 'Promotion'], ['endgame', 'Endgame']];
  const TNAME = Object.fromEntries(THEMES.concat([['mate', 'Checkmate'], ['deflection', 'Deflection'], ['attraction', 'Attraction'], ['smotheredMate', 'Smothered mate'], ['advancedPawn', 'Advanced pawn'], ['middlegame', 'Middlegame'], ['opening', 'Opening'], ['trappedPiece', 'Trapped piece'], ['interference', 'Interference'], ['xRayAttack', 'X-ray'], ['zugzwang', 'Zugzwang'], ['quietMove', 'Quiet move'], ['defensiveMove', 'Defensive move'], ['capturingDefender', 'Remove the defender'], ['rookEndgame', 'Rook endgame'], ['pawnEndgame', 'Pawn endgame'], ['queenEndgame', 'Queen endgame'], ['bishopEndgame', 'Bishop endgame'], ['knightEndgame', 'Knight endgame'], ['exposedKing', 'Exposed king'], ['kingsideAttack', 'Kingside attack'], ['queensideAttack', 'Queenside attack'], ['doubleCheck', 'Double check']]));

  let ALL = [], level = store.get('level', 1), theme = 'all', solved = store.get('solved', {}), failed = store.get('failed', {});
  let streak = store.get('streak', 0), best = store.get('best', 0);
  let cur = null, game = null, moves = [], idx = 0, orient = 'w', sel = null, busy = false, mistakes = 0, lastMove = null, hinted = false;

  root.innerHTML = `
  <div class="pz-levels" id="pzLevels"></div>
  <div class="pz-themes" id="pzThemes" role="group" aria-label="Theme"></div>
  <div class="pz-main">
    <div class="pz-boardwrap"><div class="lb pz-board" id="pzBoard"></div></div>
    <div class="pz-side">
      <div class="pz-stats"><div><b id="pzStreak">0</b><span>Streak</span></div><div><b id="pzBest">0</b><span>Best streak</span></div><div><b id="pzSolved">0</b><span>Solved</span></div></div>
      <div class="pz-card">
        <div class="pz-turn" id="pzTurn"></div>
        <p class="pz-msg" id="pzMsg" aria-live="polite"></p>
        <div class="pz-meta" id="pzMeta"></div>
        <div class="pz-btns">
          <button type="button" class="btn btn-primary btn-sm" id="pzBack" hidden>↶ Take back</button><button type="button" class="btn btn-ghost btn-sm" id="pzHint">Hint</button>
          <button type="button" class="btn btn-ghost btn-sm" id="pzRetry">Retry</button>
          <button type="button" class="btn btn-ghost btn-sm" id="pzShow">Show solution</button>
          <button type="button" class="btn btn-primary btn-sm" id="pzNext">Next puzzle →</button>
        </div>
      </div>
      <div class="pz-prog"><div class="pz-prog-h"><span id="pzLvName"></span><span id="pzLvCount"></span></div><i><b id="pzLvBar"></b></i></div>
      <p class="pz-src">Puzzles from the Lichess open puzzle database (public domain).</p>
    </div>
  </div>`;

  /* ---------- board ---------- */
  const bEl = $('#pzBoard');
  bEl.innerHTML = '<div class="lb-grid"></div><div class="lb-pieces"></div><div class="lb-files"></div><div class="lb-ranks"></div>';
  const grid = bEl.querySelector('.lb-grid'), layer = bEl.querySelector('.lb-pieces');
  const sqEl = {};
  function buildGrid() {
    grid.innerHTML = '';
    const ranks = orient === 'w' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];
    const files = orient === 'w' ? F.split('') : F.split('').reverse();
    ranks.forEach(r => files.forEach(f => { const s = f + r, d = document.createElement('button'); d.type = 'button'; d.className = 'lsq ' + ((F.indexOf(f) + r) % 2 ? 'd' : 'l'); d.dataset.sq = s; d.setAttribute('aria-label', s); d.innerHTML = '<i class="ov"></i>'; grid.appendChild(d); sqEl[s] = d }));
    bEl.querySelector('.lb-files').innerHTML = files.map(f => `<span>${f}</span>`).join('');
    bEl.querySelector('.lb-ranks').innerHTML = ranks.map(r => `<span>${r}</span>`).join('');
  }
  const xy = (s) => { let f = F.indexOf(s[0]), r = +s[1]; if (orient === 'b') { f = 7 - f; r = 9 - r } return { left: f * 12.5 + '%', top: (8 - r) * 12.5 + '%' } };
  function draw(animFrom) {
    layer.innerHTML = '';
    game.board().forEach((row, ri) => row.forEach((p, fi) => {
      if (!p) return; const s = F[fi] + (8 - ri);
      const e = document.createElement('div'); e.className = 'lpc ' + p.color; e.innerHTML = `<img src="assets/pieces/${p.color}${p.type.toUpperCase()}.svg" alt="" draggable="false">`;
      Object.assign(e.style, xy(animFrom && animFrom.to === s ? animFrom.from : s)); layer.appendChild(e);
      if (animFrom && animFrom.to === s) requestAnimationFrame(() => requestAnimationFrame(() => { Object.assign(e.style, xy(s)); e.classList.add('hop') }));
    }));
    Object.entries(sqEl).forEach(([s, q]) => { q.className = q.className.split(' ').filter(c => ['lsq', 'l', 'd'].includes(c)).join(' ') });
    if (lastMove) [lastMove.from, lastMove.to].forEach(s => sqEl[s].classList.add('tr2'));
    if (game.in_check()) { const k = findKing(game.turn()); if (k) sqEl[k].classList.add('chk') }
    if (sel) { sqEl[sel].classList.add('sel'); game.moves({ square: sel, verbose: true }).forEach(m => sqEl[m.to].classList.add(game.get(m.to) ? 'capt' : 'dot')) }
  }
  function findKing(c) { for (const row of game.board()) for (const p of row) { if (p && p.type === 'k' && p.color === c) return p.square } return null }
  const uci = (m) => m.from + m.to + (m.promotion || '');
  const play = (u) => game.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] || 'q' });

  /* ---------- flow ---------- */
  const pool = () => ALL.filter(p => p.l === level && (theme === 'all' || p.t.includes(theme)));
  function pick() {
    const list = pool(); if (!list.length) return null;
    const unsolved = list.filter(p => !solved[p.id]);
    const from = unsolved.length ? unsolved : list;
    return from[Math.floor(Math.random() * from.length)];
  }
  function load(p) {
    cur = p; if (!p) { msg('No puzzles for this theme at this level. Choose another theme.', ''); return }
    $('#pzBack').hidden = true; backFen = null;
    game = new window.Chess(p.fen); moves = p.m.split(' '); idx = 0; sel = null; mistakes = 0; hinted = false; lastMove = null; busy = true;
    orient = game.turn() === 'w' ? 'b' : 'w';  // the solver plays the side that moves after the first move
    buildGrid(); draw();
    $('#pzTurn').innerHTML = `<span class="dotc ${orient}"></span>${orient === 'w' ? 'White' : 'Black'} to move`;
    msg('Watch the opponent’s move…', '');
    $('#pzMeta').innerHTML = `<span>Rating ${p.r}</span>${p.t.slice(0, 3).map(t => `<span>${TNAME[t] || t}</span>`).join('')}`;
    $('#pzMeta').classList.add('hidden-themes');
    setTimeout(() => { const m = play(moves[0]); lastMove = m; idx = 1; draw(m); busy = false; msg(`Find the best move for ${orient === 'w' ? 'White' : 'Black'}.`, '') }, 650);
    paintSide();
  }
  function msg(t, cls) { const e = $('#pzMsg'); e.className = 'pz-msg ' + (cls || ''); e.textContent = t }
  /* ---------- engine (Stockfish 19 lite, in a Web Worker) ---------- */
  const Engine = (() => {
    let w = null, ok = false, chain = Promise.resolve();
    try {
      w = new Worker('assets/js/vendor/stockfish/stockfish-19-lite-single.js');
      ok = true; w.postMessage('uci'); w.postMessage('isready');
      w.onerror = () => { ok = false };
    } catch { ok = false }
    function analyse(fen, ms) {
      const run = () => new Promise(res => {
        if (!ok) return res(null);
        let score = null, pv = null; const t = setTimeout(() => { w.onmessage = null; res(score ? { score, best: pv } : null) }, ms + 4000);
        w.onmessage = (e) => {
          const line = String(e.data);
          if (line.startsWith('info') && / pv /.test(line)) {
            const m = line.match(/score (cp|mate) (-?\d+)/); const p = line.match(/ pv (\S+)/);
            if (m) score = m[1] === 'cp' ? { cp: +m[2] } : { mate: +m[2] }; if (p) pv = p[1];
          } else if (line.startsWith('bestmove')) { clearTimeout(t); w.onmessage = null; const b = line.split(' ')[1]; res(score ? { score, best: b && b !== '(none)' ? b : pv } : null) }
        };
        w.postMessage('ucinewgame'); w.postMessage('position fen ' + fen); w.postMessage('go movetime ' + ms);
      });
      const r = chain.then(run); chain = r.catch(() => {}); return r;
    }
    return { analyse, get ok() { return ok } };
  })();
  const val = (sc) => sc.mate != null ? (sc.mate > 0 ? 100000 - sc.mate * 100 : -100000 - sc.mate * 100) : sc.cp;
  const show = (v) => Math.abs(v) >= 90000 ? (v > 0 ? 'forced mate' : 'you get mated') : (v >= 0 ? '+' : '−') + (Math.abs(v) / 100).toFixed(1);
  const side = () => orient === 'w' ? 'White' : 'Black';
  const oppName = () => orient === 'w' ? 'Black' : 'White';

  let backFen = null;
  function userMove(from, to) {
    const legal = game.moves({ square: from, verbose: true }).find(m => m.to === to); if (!legal) return false;
    const want = moves[idx];
    const promo = want && want.slice(0, 4) === from + to ? (want[4] || 'q') : 'q';
    const before = game.fen();
    const m = game.move({ from, to, promotion: promo });
    lastMove = m; sel = null; draw(m);
    if (uci(m) === want || game.in_checkmate()) {
      idx++;
      if (idx >= moves.length || game.in_checkmate()) return finish(), true;
      msg('Correct! Keep going…', 'ok'); busy = true;
      setTimeout(() => { const r = play(moves[idx]); lastMove = r; idx++; draw(r); busy = false; msg('Your move again.', '') }, 520);
      return true;
    }
    // a different move: let the engine judge it, and show the opponent's answer
    busy = true; msg('Checking your move…', 'think');
    const afterFen = game.fen();
    Promise.all([Engine.analyse(before, 700), Engine.analyse(afterFen, 700)]).then(([b, a]) => {
      if (!b || !a) { reject(before, null, null); return }
      const bestV = val(b.score), myV = -val(a.score);
      const good = bestV >= 90000 ? myV >= 90000 : myV >= bestV - (bestV > 600 ? 200 : 100);
      if (good) {
        msg(`Good move! It also wins (${show(myV)}). The puzzle’s main line was ${sanOf(before, want)}.`, 'ok');
        idx = moves.length; return finish(true);
      }
      reject(before, a.best, myV, bestV);
    });
    return true;
  }
  function sanOf(fen, u) { try { const g = new window.Chess(fen); return g.move({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] || 'q' }).san } catch { return u } }
  function reject(before, reply, myV, bestV) {
    mistakes++; streak = 0; store.set('streak', 0);
    if (!solved[cur.id]) { failed[cur.id] = 1; store.set('failed', failed) }
    backFen = before; paintSide();
    const done = () => { $('#pzBack').hidden = false; busy = true };
    if (reply && !game.game_over()) {
      setTimeout(() => {
        const r = play(reply); lastMove = r; draw(r);
        const why = myV == null ? '' : myV <= -90000 ? ' Now you get checkmated.' : myV < -150 ? ` Now ${oppName()} is better (${show(myV)}).` : myV < 150 ? ` The position is about equal now (${show(myV)}).` : ` You are still better (${show(myV)}), but the best move wins much more.`;
        msg(`${oppName()} answers ${r.san}.${why} Take the move back and find a stronger one.`, 'err');
        bEl.classList.remove('shake'); void bEl.offsetWidth; bEl.classList.add('shake'); done();
      }, 450);
    } else { msg('That move doesn’t work. Take it back and try again.', 'err'); done() }
  }
  function takeBack() {
    if (!backFen) return; game = new window.Chess(backFen); backFen = null; lastMove = null; sel = null; draw(); busy = false;
    $('#pzBack').hidden = true; msg(`Your move: find the best move for ${side()}.`, '');
  }
  function finish(alt) {
    const clean = mistakes === 0 && !hinted;
    if (clean && !failed[cur.id]) { solved[cur.id] = 1; store.set('solved', solved); streak++; best = Math.max(best, streak); store.set('streak', streak); store.set('best', best) }
    else if (!solved[cur.id]) { failed[cur.id] = 1; store.set('failed', failed) }
    if (!alt) msg(clean ? (game.in_checkmate() ? 'Checkmate! Puzzle solved.' : 'Puzzle solved!') : 'Solved, with help. Try the next one.', 'ok');
    if (clean && window.PQ_CELEBRATE) PQ_CELEBRATE({ title: 'Congratulations!', sub: game.in_checkmate() ? `Checkmate! Streak ${streak}` : `Puzzle solved · streak ${streak}`, size: 'big' });
    $('#pzMeta').classList.remove('hidden-themes');
    bEl.classList.remove('win'); void bEl.offsetWidth; bEl.classList.add('win'); busy = true; paintSide();
  }
  function showSolution() {
    if (!cur) return; if (backFen) { game = new window.Chess(backFen); backFen = null; $('#pzBack').hidden = true; draw() } busy = true; mistakes++;
    const step = () => { if (idx >= moves.length) { msg('Solution shown. Try the next puzzle.', ''); $('#pzMeta').classList.remove('hidden-themes'); if (!solved[cur.id]) { failed[cur.id] = 1; store.set('failed', failed) } streak = 0; store.set('streak', 0); paintSide(); return } const m = play(moves[idx]); lastMove = m; idx++; draw(m); setTimeout(step, 750) };
    step();
  }
  grid.addEventListener('click', e => {
    const b = e.target.closest('.lsq'); if (!b || busy || !game) return;
    const s = b.dataset.sq, p = game.get(s);
    if (sel && s !== sel && game.moves({ square: sel, verbose: true }).some(m => m.to === s)) { userMove(sel, s); return }
    if (p && p.color === game.turn()) { sel = sel === s ? null : s; draw(); return }
    sel = null; draw();
  });

  /* ---------- side panels ---------- */
  function paintSide() {
    const lv = LEVELS[level - 1], list = ALL.filter(p => p.l === level), done = list.filter(p => solved[p.id]).length;
    $('#pzStreak').textContent = streak; $('#pzBest').textContent = best; $('#pzSolved').textContent = Object.keys(solved).length;
    $('#pzLvName').textContent = `Level ${lv.id} · ${lv.name}`; $('#pzLvCount').textContent = `${done} / ${list.length} solved`;
    $('#pzLvBar').style.width = (list.length ? done / list.length * 100 : 0) + '%';
    $('#pzLevels').innerHTML = LEVELS.map(l => { const n = ALL.filter(p => p.l === l.id).length, d = ALL.filter(p => p.l === l.id && solved[p.id]).length;
      return `<button type="button" data-l="${l.id}" aria-pressed="${l.id === level}"><span class="pc">${l.piece}&#xFE0E;</span><b>Level ${l.id} · ${l.name}</b><small>Rating ${l.range}</small><em>${l.tip}</em><i><u style="width:${n ? d / n * 100 : 0}%"></u></i><span class="ct">${d}/${n}</span></button>` }).join('');
    $('#pzThemes').innerHTML = THEMES.map(([k, n]) => { const c = k === 'all' ? ALL.filter(p => p.l === level).length : ALL.filter(p => p.l === level && p.t.includes(k)).length;
      return c ? `<button type="button" data-t="${k}" aria-pressed="${k === theme}">${n} <small>${c}</small></button>` : '' }).join('');
  }
  root.addEventListener('click', e => {
    const lb = e.target.closest('#pzLevels button'); if (lb) { level = +lb.dataset.l; store.set('level', level); theme = 'all'; load(pick()); return }
    const tb = e.target.closest('#pzThemes button'); if (tb) { theme = tb.dataset.t; load(pick()); return }
  });
  $('#pzNext').onclick = () => load(pick());
  $('#pzBack').onclick = takeBack;
  $('#pzRetry').onclick = () => cur && load(cur);
  $('#pzShow').onclick = showSolution;
  $('#pzHint').onclick = () => { if (!cur || busy || idx >= moves.length) return; hinted = true; const f = moves[idx].slice(0, 2); sel = f; draw(); msg('Hint: move the highlighted piece.', '') };

  fetch('assets/data/puzzles.json').then(r => { if (!r.ok) throw 0; return r.json() }).then(d => {
    ALL = d.puzzles; const c = document.getElementById('pzCount'); if (c) c.textContent = ALL.length.toLocaleString('en');
    const q = new URLSearchParams(location.search).get('id'); load(ALL.find(p => p.id === q) || pick());
  }).catch(() => { msg('Puzzles could not be loaded. Refresh the page to try again.', 'err') });
  window.addEventListener('pq-reload', () => { solved = store.get('solved', {}); best = store.get('best', 0); if (ALL.length) paintSide() });
  window.PQ_PUZZLES = { Engine, takeBack, get state() { return { cur, idx, moves, level, theme, streak, orient, fen: game && game.fen() } }, userMove, load, pick };
})();
