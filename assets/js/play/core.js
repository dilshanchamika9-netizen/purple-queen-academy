/* Purple Queen live play: chess core (no page or database code).
   Clocks are worked out from server timestamps stored with each move, never from the device clock.
   Works in the browser (window.PQ_PlayCore, uses window.Chess) and in Node tests (module.exports). */
(function (root, make) {
  const api = make();
  if (typeof module === 'object' && module.exports) module.exports = api; else root.PQ_PlayCore = api;
})(typeof self !== 'undefined' ? self : this, function () {
  const TOL = 1000, DELAY = 3000;                    // must match tools/build-db-rules.mjs
  const toMove = (n) => (n % 2 === 0 ? 'w' : 'b');
  const other = (s) => (s === 'w' ? 'b' : 'w');

  // remaining time of both players at server time `now`; the side to move is running
  function clocks(g, now) {
    const c = g.clk || { t: now, w: 0, b: 0 }, run = g.result ? null : toMove(g.n || 0);
    const out = { w: c.w, b: c.b, run };
    if (run) out[run] = Math.max(0, c[run] - Math.max(0, now - c.t));
    return out;
  }
  // clocks to store with the mover's next move (the database adds t = server time)
  function nextClk(g, now) {
    const side = toMove(g.n || 0), c = g.clk, inc = g.meta.inc || 0;
    const left = c[side] - Math.max(0, now - c.t);
    const res = { w: c.w, b: c.b };
    res[side] = Math.max(0, Math.round(left + inc));
    return { side, flagged: left <= 0, clk: res };
  }
  const flagged = (g, now) => { if (g.result) return null; const s = toMove(g.n || 0); return clocks(g, now)[s] <= 0 ? s : null };

  const uci = (m) => m.from + m.to + (m.promotion || '');
  const parseUci = (s) => ({ from: s.slice(0, 2), to: s.slice(2, 4), promotion: s[4] || undefined });
  // moves: object or array keyed by index -> {s, t}; returns a chess.js game and the first bad index (or -1)
  function replay(Chess, moves, fen) {
    const ch = fen ? new Chess(fen) : new Chess(), list = toList(moves);
    for (let i = 0; i < list.length; i++) {
      if (!list[i] || !ch.move(parseUci(list[i].s))) return { chess: ch, bad: i, list };
    }
    return { chess: ch, bad: -1, list };
  }
  function toList(moves) {
    if (!moves) return [];
    if (Array.isArray(moves)) return moves;
    const out = []; Object.keys(moves).forEach(k => { out[+k] = moves[k] }); return out;
  }

  // checkmate, stalemate and the automatic draws, from the board alone
  function boardEnd(ch) {
    if (ch.in_checkmate()) return { r: ch.turn() === 'w' ? '0-1' : '1-0', why: 'mate' };
    if (ch.in_stalemate()) return { r: '1/2-1/2', why: 'stalemate' };
    if (ch.insufficient_material()) return { r: '1/2-1/2', why: 'material' };
    if (ch.in_threefold_repetition()) return { r: '1/2-1/2', why: 'repetition' };
    if (ch.in_draw()) return { r: '1/2-1/2', why: 'fifty' };
    return null;
  }
  // can `side` still checkmate by any legal series of moves? (FIDE 6.9: flag fall is a draw if not)
  // Cases treated as "cannot mate": lone king; king + one knight or one bishop when the other side has only a king;
  // only bishops, all on squares of one colour, on both sides with no other pieces.
  function canMate(ch, side) {
    const own = [], opp = [], bishopColours = new Set();
    const b = ch.board();
    for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
      const p = b[r][f]; if (!p || p.type === 'k') continue;
      (p.color === side ? own : opp).push(p.type);
      if (p.type === 'b') bishopColours.add((r + f) % 2);
    }
    if (!own.length) return false;
    if (own.some(t => t === 'q' || t === 'r' || t === 'p')) return true;
    if (own.length === 1 && !opp.length) return false;
    const all = own.concat(opp);
    if (all.every(t => t === 'b') && bishopColours.size === 1) return false;
    return true;
  }
  const timeResult = (ch, flaggedSide) =>
    canMate(ch, other(flaggedSide)) ? (flaggedSide === 'w' ? '0-1' : '1-0') : '1/2-1/2';
  // is a board-based result claim true for this position?
  function claimValid(ch, res) {
    if (!res || !['mate', 'stalemate', 'repetition', 'fifty', 'material'].includes(res.why)) return true;
    const e = boardEnd(ch);
    if (!e) return false;
    if (res.why === 'mate') return e.why === 'mate' && e.r === res.r;
    if (res.why === 'repetition') return ch.in_threefold_repetition();
    if (res.why === 'fifty') return ch.in_draw();
    return e.why === res.why;
  }

  // clock left after each move, from the stored server times (for PGN and the move list)
  function moveClocks(meta, list) {
    const left = { w: meta.base, b: meta.base }, out = [];
    let last = meta.startAt;
    list.forEach((m, i) => {
      const s = toMove(i);
      left[s] = left[s] - Math.max(0, m.t - last) + (meta.inc || 0);
      last = m.t; out.push(Math.max(0, left[s]));
    });
    return out;
  }
  const hms = (ms) => { const s = Math.max(0, Math.round(ms / 1000)); return `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}` };
  const WHY = { mate: 'Normal', resign: 'Normal', agree: 'Normal', stalemate: 'Normal', repetition: 'Normal', fifty: 'Normal', material: 'Normal', time: 'Time forfeit', noshow: 'Abandoned', abort: 'Abandoned', arbiter: 'Rules infraction' };
  function pgn(Chess, game, extra = {}) {
    const m = game.meta, rp = replay(Chess, game.moves, m.fen), list = rp.list, clk = moveClocks(m, list);
    const res = game.result ? game.result.r : '*', d = new Date(m.startAt || Date.now());
    const tags = {
      Event: extra.event || (m.tid ? 'Purple Queen tournament' : 'Purple Queen online game'),
      Site: 'Purple Queen Chess Academy', Date: `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.${String(d.getUTCDate()).padStart(2, '0')}`,
      Round: extra.round || '-', White: m.wn || 'White', Black: m.bn || 'Black', Result: res,
      TimeControl: `${Math.round(m.base / 1000)}+${Math.round((m.inc || 0) / 1000)}`,
      Termination: game.result ? (WHY[game.result.why] || 'Normal') : 'Unterminated',
    };
    if (m.fen) { tags.SetUp = '1'; tags.FEN = m.fen }
    const ch = m.fen ? new Chess(m.fen) : new Chess();
    let body = '';
    list.forEach((mv, i) => {
      const r = ch.move(parseUci(mv.s)); if (!r) return;
      if (ch.turn() === 'b') body += `${Math.floor(i / 2) + 1}. `; else if (i === 0) body += '1... ';
      body += `${r.san} {[%clk ${hms(clk[i])}]} `;
    });
    return Object.entries(tags).map(([k, v]) => `[${k} "${String(v).replace(/"/g, "'")}"]`).join('\n') + '\n\n' + body + res + '\n';
  }

  return { TOL, DELAY, toMove, other, clocks, nextClk, flagged, uci, parseUci, replay, toList, boardEnd, canMate, timeResult, claimValid, moveClocks, hms, pgn };
});
