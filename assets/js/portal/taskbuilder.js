// Coach tool: set up a position on a board, choose the right answer, and add it to a homework as a board task.
import { esc } from './fb.js';
const PIECES = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP', 'bK', 'bQ', 'bR', 'bB', 'bN', 'bP'];
const NAME = { K: 'King', Q: 'Queen', R: 'Rook', B: 'Bishop', N: 'Knight', P: 'Pawn' };
const START = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
export const toPlacement = (pos) => [8, 7, 6, 5, 4, 3, 2, 1].map(r => { let o = '', e = 0; for (const f of 'abcdefgh') { const p = pos[f + r]; if (!p) { e++; continue } if (e) { o += e; e = 0 } o += p[0] === 'w' ? p[1] : p[1].toLowerCase() } return o + (e || '') }).join('/');

export function initBuilder(box, onAdd) {
  const Board = window.PQ_Board, fp = window.PQ_FP;
  let pos = {}, ans = [], sel = null, tool = 'wK', mode = 'edit', kind = 'move';
  box.innerHTML = `<div class="tb">
    <div class="tb-head"><b>Board task</b><span class="muted small">Set up the position, then choose the right answer. White always moves first.</span></div>
    <label for="tbQ">Question<input id="tbQ" placeholder="e.g. White to move. Win the queen."></label>
    <div class="row2"><label for="tbKind">Student must<select id="tbKind"><option value="move">Make the right move (White)</option><option value="square">Click the right square</option></select></label>
      <div class="tb-modes" role="group" aria-label="Board mode"><button type="button" class="mini on" data-m="edit">1 · Place pieces</button><button type="button" class="mini" data-m="ans">2 · Mark the answer</button></div></div>
    <div class="tb-wrap"><div class="tb-board"><div class="lb" id="tbBoard"></div></div>
      <div class="tb-side"><div class="tb-pal" id="tbPal">${PIECES.map(p => `<button type="button" class="tbp ${p === 'wK' ? 'on' : ''}" data-p="${p}" title="${(p[0] === 'w' ? 'White ' : 'Black ') + NAME[p[1]]}"><img src="assets/pieces/${p}.svg" alt="${(p[0] === 'w' ? 'White ' : 'Black ') + NAME[p[1]]}" width="34" height="34"></button>`).join('')}<button type="button" class="tbp" data-p="erase" title="Remove a piece">✕</button></div>
        <div class="tb-acts"><button type="button" class="mini" id="tbStart">Start position</button><button type="button" class="mini" id="tbClear">Clear board</button><button type="button" class="mini" id="tbUndo">Clear answers</button></div>
        <p class="small" id="tbHelp"></p><div id="tbAns" class="tb-ans"></div></div></div>
    <p class="pmsg2" id="tbMsg"></p><button type="button" class="btn btn-ghost btn-sm" id="tbAdd">Add this task to the homework</button></div>`;
  const $ = (s) => box.querySelector(s), board = new Board($('#tbBoard'));
  const redraw = () => {
    board.setPos(pos, false);
    board.decorate({ hl: kind === 'square' ? ans : ans.flatMap(a => [a.slice(0, 2), a.slice(2)]), files: true, ranks: true });
    if (sel) board.sq[sel].classList.add('sel');
    $('#tbAns').innerHTML = ans.length ? 'Right answer: ' + ans.map(a => `<span class="chip">${kind === 'square' ? a : a.slice(0, 2) + ' → ' + a.slice(2)}</span>`).join(' ') : '';
    $('#tbHelp').textContent = mode === 'edit' ? 'Pick a piece, then click squares to place it. Use ✕ to remove.' : kind === 'move' ? 'Click the White piece, then the square it should go to. You can add more than one right answer.' : 'Click each square that counts as right. Click again to remove it.';
  };
  const msg = (t, ok) => { const m = $('#tbMsg'); m.textContent = t; m.className = 'pmsg2 ' + (t ? (ok ? 'ok' : 'err') : '') };
  box.addEventListener('click', (e) => {
    const p = e.target.closest('.tbp'); if (p) { tool = p.dataset.p; box.querySelectorAll('.tbp').forEach(x => x.classList.toggle('on', x === p)); mode = 'edit'; syncModes(); redraw(); return }
    const m = e.target.closest('[data-m]'); if (m) { mode = m.dataset.m; sel = null; syncModes(); redraw() }
  });
  const syncModes = () => box.querySelectorAll('.tb-modes .mini').forEach(x => x.classList.toggle('on', x.dataset.m === mode));
  $('#tbKind').onchange = (e) => { kind = e.target.value; ans = []; sel = null; redraw() };
  $('#tbStart').onclick = () => { pos = fp(START); ans = []; sel = null; redraw() };
  $('#tbClear').onclick = () => { pos = {}; ans = []; sel = null; redraw() };
  $('#tbUndo').onclick = () => { ans = []; sel = null; redraw() };
  board.click = (s) => {
    msg('');
    if (mode === 'edit') { if (tool === 'erase') delete pos[s]; else pos[s] = tool; ans = []; redraw(); return }
    if (kind === 'square') { ans = ans.includes(s) ? ans.filter(x => x !== s) : ans.concat(s); redraw(); return }
    if (!sel) { if (pos[s] && pos[s][0] === 'w') { sel = s; redraw() } return }
    if (s === sel) { sel = null; redraw(); return }
    if (pos[s] && pos[s][0] === 'w') { sel = s; redraw(); return }
    const g = new window.Chess();
    if (!g.load(toPlacement(pos) + ' w - - 0 1')) { sel = null; redraw(); return msg('The position is not valid. Each side needs exactly one king.') }
    const r = g.move({ from: sel, to: s, promotion: 'q' });
    if (!r) { sel = null; redraw(); return msg('That move is not legal for White in this position.') }
    if (/[pkq]/.test(r.flags)) { sel = null; redraw(); return msg('Promotion and castling moves cannot be used in a board task.') }
    const k = sel + s; if (!ans.includes(k)) ans.push(k); sel = null; redraw();
  };
  $('#tbAdd').onclick = () => {
    const q = $('#tbQ').value.trim();
    if (!q) return msg('Write the question first.');
    if (!Object.keys(pos).length) return msg('Place some pieces on the board.');
    if (kind === 'move') { const g = new window.Chess(); if (!g.load(toPlacement(pos) + ' w - - 0 1')) return msg('The position is not valid. Each side needs exactly one king.') }
    if (!ans.length) return msg('Mark at least one right answer (step 2).');
    onAdd({ t: 'task', kind, q, fen: toPlacement(pos), ans: ans.slice() });
    $('#tbQ').value = ''; ans = []; sel = null; redraw(); msg('Task added below. Add more, or press “Assign homework”.', true);
  };
  pos = fp(START); redraw();
}
