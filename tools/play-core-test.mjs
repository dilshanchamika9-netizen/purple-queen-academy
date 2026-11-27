// Unit tests for assets/js/play/core.js (clocks, game end, flag fall, PGN). Run: node tools/play-core-test.mjs
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(readFileSync('assets/js/vendor/chess.js', 'utf8'), ctx);
const Chess = ctx.window.Chess;
const P = require('../assets/js/play/core.js');

let fails = 0, n = 0;
const eq = (a, b, m) => { n++; const g = JSON.stringify(a) === JSON.stringify(b); console.log((g ? 'PASS ' : 'FAIL ') + m + (g ? '' : ` :: got ${JSON.stringify(a)} want ${JSON.stringify(b)}`)); if (!g) fails++ };
const seq = (s) => s.split(' ').map((x, i) => ({ s: x, t: 1000 * (i + 1) }));

// clocks
const g = { meta: { base: 600000, inc: 5000, startAt: 0 }, n: 0, clk: { t: 0, w: 600000, b: 600000 } };
eq(P.clocks(g, 30000), { w: 570000, b: 600000, run: 'w' }, 'white clock runs from the start');
eq(P.nextClk(g, 30000).clk, { w: 575000, b: 600000 }, 'increment added after the move');
eq(P.clocks({ ...g, n: 1, clk: { t: 30000, w: 575000, b: 600000 } }, 40000), { w: 575000, b: 590000, run: 'b' }, 'black clock starts after white moves');
eq(P.clocks({ ...g, result: { r: '1-0' } }, 99999), { w: 600000, b: 600000, run: null }, 'no clock runs after the result');
eq(P.flagged(g, 600001), 'w', 'flag fall detected');
eq(P.flagged(g, 599000), null, 'no flag before zero');
eq(P.clocks(g, 999999).w, 0, 'clock never below zero');
eq(P.nextClk(g, 700000).flagged, true, 'a move after flag fall is marked flagged');

// replay and game end
const mate = P.replay(Chess, seq('e2e4 e7e5 f1c4 b8c6 d1h5 g8f6 h5f7'));
eq([mate.bad, P.boardEnd(mate.chess)], [-1, { r: '1-0', why: 'mate' }], 'scholar mate: 1-0 by mate');
eq(P.replay(Chess, seq('e2e4 e2e4')).bad, 1, 'illegal move found at its index');
eq(P.replay(Chess, { 1: { s: 'e7e5', t: 2 }, 0: { s: 'e2e4', t: 1 } }).bad, -1, 'moves stored as an object replay in index order');
const stale = P.replay(Chess, seq('e2e3 a7a5 d1h5 a8a6 h5a5 h7h5 h2h4 a6h6 a5c7 f7f6 c7d7 e8f7 d7b7 d8d3 b7b8 d3h7 b8c8 f7g6 c8e6'));
eq([stale.bad, P.boardEnd(stale.chess)], [-1, { r: '1/2-1/2', why: 'stalemate' }], 'Loyd 10-move stalemate');
const rep = P.replay(Chess, seq('g1f3 g8f6 f3g1 f6g8 g1f3 g8f6 f3g1 f6g8'));
eq(P.boardEnd(rep.chess), { r: '1/2-1/2', why: 'repetition' }, 'threefold repetition');
eq(P.boardEnd(P.replay(Chess, seq('e2e4 e7e5')).chess), null, 'normal position: game goes on');
const promo = P.replay(Chess, [{ s: 'a7a8q', t: 1 }], '7k/P7/8/8/8/8/8/K7 w - - 0 1');
eq([promo.bad, promo.chess.get('a8')], [-1, { type: 'q', color: 'w' }], 'promotion move applied');

// flag fall and insufficient material (FIDE 6.9)
const pos = (fen) => new Chess(fen);
eq(P.timeResult(pos('8/8/8/8/8/2k5/8/K6r w - - 0 1'), 'w'), '0-1', 'white flags, black has a rook: 0-1');
eq(P.timeResult(pos('8/8/8/8/8/2k5/8/K6n w - - 0 1'), 'w'), '1/2-1/2', 'white flags, black has only K+N v K: draw');
eq(P.timeResult(pos('8/8/8/8/8/2k5/8/K6R b - - 0 1'), 'w'), '1/2-1/2', 'white flags, black has a lone king: draw');
eq(P.timeResult(pos('8/8/8/8/8/2k5/P7/K6n w - - 0 1'), 'w'), '0-1', 'K+N v K+P: mate possible, 0-1');
eq(P.timeResult(pos('8/8/8/8/1b6/2k5/8/K1B5 w - - 0 1'), 'w'), '1/2-1/2', 'only same-colour bishops: draw');
eq(P.timeResult(pos('8/8/8/8/2b5/2k5/8/K1B5 w - - 0 1'), 'w'), '0-1', 'opposite-colour bishops: mate possible, 0-1');

// claims
eq(P.claimValid(mate.chess, { r: '1-0', why: 'mate' }), true, 'true mate claim accepted');
eq(P.claimValid(mate.chess, { r: '0-1', why: 'mate' }), false, 'mate claim for the wrong side refused');
eq(P.claimValid(P.replay(Chess, seq('e2e4')).chess, { r: '1/2-1/2', why: 'stalemate' }), false, 'false stalemate claim refused');
eq(P.claimValid(rep.chess, { r: '1/2-1/2', why: 'repetition' }), true, 'true repetition claim accepted');
eq(P.claimValid(rep.chess, { r: '0-1', why: 'resign' }), true, 'non-board results are not checked here');

// PGN
const game = { meta: { base: 600000, inc: 5000, startAt: Date.UTC(2026, 10, 28, 4), wn: 'Kavindu P.', bn: 'Nethmi S.' }, moves: { 0: { s: 'e2e4', t: Date.UTC(2026, 10, 28, 4) + 10000 }, 1: { s: 'e7e5', t: Date.UTC(2026, 10, 28, 4) + 25000 } }, result: { r: '1-0', why: 'resign' } };
const txt = P.pgn(Chess, game);
eq(txt.includes('[White "Kavindu P."]') && txt.includes('[TimeControl "600+5"]') && txt.includes('[Date "2026.11.28"]'), true, 'PGN headers');
eq(/1\. e4 \{\[%clk 0:09:55\]\} e5 \{\[%clk 0:09:50\]\} 1-0/.test(txt), true, 'PGN moves with clocks');
eq(P.moveClocks(game.meta, P.toList(game.moves)), [595000, 590000], 'clock after each move from server times');
const back = new Chess(); eq(back.load_pgn(txt), true, 'PGN loads back into chess.js');

console.log(`\n${n - fails}/${n} PASS`);
process.exit(fails ? 1 : 0);
