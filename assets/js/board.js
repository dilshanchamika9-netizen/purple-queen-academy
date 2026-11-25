/* Purple Queen chessboard component (used by lessons, homework tasks and the coach task builder) */
window.PQ_Board = (function () {
  const F = 'abcdefgh';
  class Board {
    constructor(el) {
      this.el = el; this.pieces = {}; this.click = null;
      el.innerHTML = `<div class="lb-grid"></div><div class="lb-pieces"></div><div class="lb-files">${F.split('').map(f => `<span>${f}</span>`).join('')}</div><div class="lb-ranks">${[8, 7, 6, 5, 4, 3, 2, 1].map(r => `<span>${r}</span>`).join('')}</div>`;
      this.grid = el.querySelector('.lb-grid'); this.layer = el.querySelector('.lb-pieces');
      this.sq = {};
      for (let r = 8; r >= 1; r--) for (let f = 0; f < 8; f++) {
        const s = F[f] + r, d = document.createElement('button');
        d.type = 'button'; d.className = 'lsq ' + ((f + r) % 2 ? 'd' : 'l'); d.dataset.sq = s; d.setAttribute('aria-label', s); d.tabIndex = -1;
        d.innerHTML = '<i class="ov"></i>';
        this.grid.appendChild(d); this.sq[s] = d;
      }
      this.grid.addEventListener('click', e => { const b = e.target.closest('.lsq'); if (b && this.click) this.click(b.dataset.sq) });
    }
    xy(s) { return { left: F.indexOf(s[0]) * 12.5 + '%', top: (8 - +s[1]) * 12.5 + '%' } }
    makePiece(s, p) {
      const e = document.createElement('div'); e.className = 'lpc ' + (p[0] === 'w' ? 'w' : 'b');
      e.innerHTML = `<img src="assets/pieces/${p}.svg" alt="" draggable="false">`; Object.assign(e.style, this.xy(s)); e.dataset.p = p;
      this.layer.appendChild(e); return e;
    }
    setPos(pos, fade = true) {
      Object.values(this.pieces).forEach(e => e.remove()); this.pieces = {};
      Object.entries(pos).forEach(([s, p]) => { const e = this.makePiece(s, p); if (fade) { e.classList.add('in') } this.pieces[s] = e });
    }
    pos() { const o = {}; Object.entries(this.pieces).forEach(([s, e]) => o[s] = e.dataset.p); return o }
    move(from, to, promote, animate = true) {
      const e = this.pieces[from]; if (!e) return;
      if (this.pieces[to]) { const cap = this.pieces[to]; if (animate) { cap.classList.add('cap'); setTimeout(() => cap.remove(), 420) } else cap.remove() }
      delete this.pieces[from]; this.pieces[to] = e;
      if (!animate) e.style.transition = 'none';
      Object.assign(e.style, this.xy(to));
      if (animate) { e.classList.remove('hop'); void e.offsetWidth; e.classList.add('hop'); this.trail(from, to) } else { void e.offsetWidth; e.style.transition = '' }
      if (promote) { const fn = () => { e.dataset.p = promote; e.querySelector('img').src = `assets/pieces/${promote}.svg`; e.classList.add('promo') }; animate ? setTimeout(fn, 520) : fn() }
    }
    remove(s, animate = true) { const e = this.pieces[s]; if (!e) return; delete this.pieces[s]; if (animate) { e.classList.add('cap'); setTimeout(() => e.remove(), 420) } else e.remove() }
    setPiece(s, p, animate = true) { const e = this.pieces[s]; if (!e) return; e.dataset.p = p; e.querySelector('img').src = `assets/pieces/${p}.svg`; if (animate) e.classList.add('promo') }
    trail(a, b) { [a, b].forEach(s => { const q = this.sq[s]; q.classList.add('tr'); setTimeout(() => q.classList.remove('tr'), 1600) }) }
    decorate(st = {}) {
      Object.values(this.sq).forEach(q => { q.className = q.className.split(' ').filter(c => ['lsq', 'l', 'd', 'tr'].includes(c)).join(' '); q.querySelector('.ov').textContent = '' });
      this.el.classList.toggle('show-files', !!st.files); this.el.classList.toggle('show-ranks', !!st.ranks);
      (st.soft || []).forEach(s => this.sq[s].classList.add('soft'));
      (st.hl || []).forEach(s => this.sq[s].classList.add('hl'));
      (st.dots || []).forEach(s => this.sq[s].classList.add(this.pieces[s] ? 'capt' : 'dot'));
      (st.caps || []).forEach(s => this.sq[s].classList.add('capt'));
      (st.xs || []).forEach(s => this.sq[s].classList.add('no'));
      if (st.names) Object.entries(this.sq).forEach(([s, q]) => { q.classList.add('nm'); q.querySelector('.ov').textContent = s });
      Object.entries(st.label || {}).forEach(([s, t]) => { this.sq[s].classList.add('lbl'); this.sq[s].querySelector('.ov').textContent = t });
      Object.entries(st.badges || {}).forEach(([s, t]) => { this.sq[s].classList.add('bdg'); this.sq[s].querySelector('.ov').textContent = t });
    }
    mark(s, cls, ms = 900) { const q = this.sq[s]; q.classList.add(cls); if (ms) setTimeout(() => q.classList.remove(cls), ms) }
  }
  return Board;
})();
