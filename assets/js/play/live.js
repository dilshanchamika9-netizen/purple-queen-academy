// Live game board: same look as the lesson board (.lb / .lsq / .lpc), plus flip, drag, tap-tap and promotion.
const F = 'abcdefgh';
export class LiveBoard {
  constructor(el, { onMove, canMove, legal } = {}) {
    this.el = el; this.flip = false; this.onMove = onMove; this.canMove = canMove; this.legal = legal;
    this.sel = null; this.last = null; this.check = null; this.pos = {}; this.pcs = {};
    el.classList.add('lb', 'live-b');
    el.innerHTML = '<div class="lb-grid"></div><div class="lb-pieces"></div><div class="pv-promo" hidden></div>';
    this.grid = el.querySelector('.lb-grid'); this.layer = el.querySelector('.lb-pieces'); this.promo = el.querySelector('.pv-promo');
    this.sq = {};
    for (let i = 0; i < 64; i++) { const b = document.createElement('div'); b.className = 'lsq'; this.grid.appendChild(b) }
    this.layout();
    el.addEventListener('pointerdown', e => this.down(e));
    window.addEventListener('pointermove', e => this.drag(e));
    window.addEventListener('pointerup', e => this.up(e));
  }
  // square name at grid cell (row 0 = top)
  at(r, f) { return this.flip ? F[7 - f] + (r + 1) : F[f] + (8 - r) }
  xy(s) { const f = F.indexOf(s[0]), r = +s[1]; const c = this.flip ? 7 - f : f, row = this.flip ? r - 1 : 8 - r; return { left: c * 12.5 + '%', top: row * 12.5 + '%' } }
  layout() {
    this.sq = {}; const cells = this.grid.children;
    for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
      const s = this.at(r, f), q = cells[r * 8 + f], fi = F.indexOf(s[0]), rk = +s[1];
      q.className = 'lsq ' + ((fi + rk) % 2 ? 'd' : 'l'); q.dataset.sq = s; q.innerHTML = '';
      if (r === 7) q.insertAdjacentHTML('beforeend', `<span class="cf">${s[0]}</span>`);
      if (f === 0) q.insertAdjacentHTML('beforeend', `<span class="cr">${s[1]}</span>`);
      this.sq[s] = q;
    }
    this.paint();
  }
  setFlip(v) { this.flip = !!v; this.layout(); this.draw(this.pos) }
  // pos: {square: 'wP'}; mv: {from, to} of the move just played (animated when anim)
  set(pos, mv, check, anim) {
    this.pos = pos; this.last = mv || null; this.check = check || null; this.sel = null; this.hidePromo();
    this.draw(pos, anim ? mv : null); this.paint();
  }
  draw(pos, mv) {
    this.layer.innerHTML = ''; this.pcs = {};
    Object.entries(pos).forEach(([s, p]) => {
      const e = document.createElement('div'); e.className = 'lpc ' + p[0]; e.dataset.sq = s;
      e.innerHTML = `<img src="assets/pieces/${p}.svg" alt="" draggable="false">`;
      Object.assign(e.style, this.xy(mv && mv.to === s ? mv.from : s));
      this.layer.appendChild(e); this.pcs[s] = e;
    });
    if (mv && this.pcs[mv.to]) { const e = this.pcs[mv.to]; requestAnimationFrame(() => requestAnimationFrame(() => Object.assign(e.style, this.xy(mv.to)))) }
  }
  paint() {
    Object.values(this.sq).forEach(q => q.classList.remove('lm', 'sel', 'dot', 'capt', 'chk'));
    if (this.last) [this.last.from, this.last.to].forEach(s => this.sq[s] && this.sq[s].classList.add('lm'));
    if (this.check && this.sq[this.check]) this.sq[this.check].classList.add('chk');
    if (this.sel) {
      this.sq[this.sel].classList.add('sel');
      (this.legal ? this.legal(this.sel) : []).forEach(t => this.sq[t].classList.add(this.pos[t] ? 'capt' : 'dot'));
    }
  }
  sqAt(e) { const r = this.grid.getBoundingClientRect(); const f = Math.floor((e.clientX - r.left) / r.width * 8), row = Math.floor((e.clientY - r.top) / r.height * 8); if (f < 0 || f > 7 || row < 0 || row > 7) return null; return this.at(row, f) }
  mine(s) { return this.pos[s] && this.canMove && this.canMove(s) }
  down(e) {
    if (e.target.closest('.pv-promo')) return;
    const s = this.sqAt(e); if (!s) return;
    if (this.sel && s !== this.sel && !this.mine(s)) { this.tryMove(this.sel, s); return }
    if (this.mine(s)) {
      this.sel = s; this.paint();
      const pc = this.pcs[s]; if (pc) { this.dragging = { s, pc, x: e.clientX, y: e.clientY, moved: false }; pc.classList.add('drag'); e.preventDefault() }
    } else { this.sel = null; this.paint() }
  }
  drag(e) {
    const d = this.dragging; if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < 6) return;
    d.moved = true; const r = this.grid.getBoundingClientRect();
    d.pc.style.transition = 'none';
    d.pc.style.left = ((e.clientX - r.left) / r.width * 100 - 6.25) + '%'; d.pc.style.top = ((e.clientY - r.top) / r.height * 100 - 6.25) + '%';
  }
  up(e) {
    const d = this.dragging; if (!d) return; this.dragging = null; d.pc.classList.remove('drag');
    if (!d.moved) { d.pc.style.transition = ''; return }
    const t = this.sqAt(e);
    Object.assign(d.pc.style, this.xy(d.s)); requestAnimationFrame(() => { d.pc.style.transition = '' });
    if (t && t !== d.s) this.tryMove(d.s, t);
  }
  tryMove(from, to) {
    const ok = (this.legal ? this.legal(from) : []).includes(to);
    if (!ok) { this.sel = this.mine(to) ? to : null; this.paint(); return }
    const p = this.pos[from];
    if (p && p[1] === 'P' && (to[1] === '8' || to[1] === '1')) { this.askPromo(from, to, p[0]); return }
    this.sel = null; this.onMove && this.onMove(from, to);
  }
  askPromo(from, to, col) {
    this.promo.hidden = false;
    this.promo.innerHTML = '<div>' + ['q', 'r', 'b', 'n'].map(k => `<button type="button" data-k="${k}"><img src="assets/pieces/${col}${k.toUpperCase()}.svg" alt="${k}"></button>`).join('') + '<button type="button" class="x" data-k="">✕</button></div>';
    this.promo.onclick = (ev) => { const b = ev.target.closest('button'); if (!b) return; this.hidePromo(); this.sel = null; this.paint(); if (b.dataset.k) this.onMove && this.onMove(from, to, b.dataset.k) };
  }
  hidePromo() { this.promo.hidden = true; this.promo.innerHTML = '' }
}
// chess.js board() -> {square: 'wP'}
export function posOf(ch) {
  const o = {}; ch.board().forEach((row, r) => row.forEach((p, f) => { if (p) o[F[f] + (8 - r)] = p.color + p.type.toUpperCase() })); return o;
}
