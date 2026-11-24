/* Purple Queen: futuristic effects layer. Pure decoration: nothing here is needed to use the site.
   Off or reduced for phones, touch screens and "reduce motion". */
(function () {
  const d = document, b = d.body, root = d.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const el = (tag, cls, html) => { const e = d.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e };

  /* aurora + grid behind everything */
  const au = el('div', 'fx-aurora', '<i></i><i></i><i></i>'); au.setAttribute('aria-hidden', 'true'); b.prepend(au);

  /* scroll progress */
  const bar = el('div', 'fx-progress'); bar.setAttribute('aria-hidden', 'true'); b.appendChild(bar);
  let tick = false;
  const onScroll = () => { if (tick) return; tick = true; requestAnimationFrame(() => { const h = root.scrollHeight - innerHeight; bar.style.setProperty('--p', h > 0 ? Math.min(1, scrollY / h).toFixed(4) : 0); tick = false }) };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* glowing cards with a cursor spotlight */
  const CARDS = '.level, .ex-card, .tcard, .cc, .ccard, .extra, .acc-card, .tile, .jl';
  d.querySelectorAll(CARDS).forEach(c => {
    if (getComputedStyle(c).position === 'static') c.style.position = 'relative';
    c.classList.add('fx-card'); c.appendChild(el('span', 'fx-spot'));
  });
  if (fine && !reduce) {
    const cur = el('div', 'fx-cursor'); cur.setAttribute('aria-hidden', 'true'); b.appendChild(cur);
    let raf = 0, mx = 0, my = 0, tgt = null;
    d.addEventListener('pointermove', e => {
      mx = e.clientX; my = e.clientY; tgt = e.target;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0; cur.style.opacity = 1; cur.style.setProperty('--cx', mx + 'px'); cur.style.setProperty('--cy', my + 'px');
        const c = tgt && tgt.closest && tgt.closest('.fx-card');
        if (c) { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (mx - r.left) + 'px'); c.style.setProperty('--my', (my - r.top) + 'px') }
      });
    }, { passive: true });
    d.addEventListener('pointerleave', () => { cur.style.opacity = 0 });
  }

  /* floating glass pieces in the hero and page headers */
  if (!reduce && innerWidth >= 900) {
    const put = (host, items) => {
      if (!host) return; if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
      items.forEach(([p, css, delay]) => { const i = el('img', 'fx-float'); i.src = 'assets/pieces/' + p + '.svg'; i.alt = ''; i.setAttribute('aria-hidden', 'true'); i.width = 96; i.height = 96; i.style.cssText = css; i.style.animationDelay = delay + 's'; host.appendChild(i) });
    };
    put(d.querySelector('.hero'), [
      ['wQ', 'left:44%;top:5%;width:74px;height:74px', 0], ['bN', 'left:1.5%;bottom:5%;width:88px;height:88px', -4],
      ['wR', 'right:2%;top:7%;width:66px;height:66px', -8], ['bP', 'left:41%;bottom:3%;width:58px;height:58px', -2]]);
    d.querySelectorAll('.page-top').forEach(h => { if (h.classList.contains('portal-page')) return; put(h, [['wK', 'right:3%;top:18%;width:132px;height:132px', 0], ['bB', 'right:17%;bottom:6%;width:78px;height:78px', -5]]) });
  }

  /* opening-moves ticker under the hero (home page) */
  const facts = d.querySelector('.facts');
  if (facts && d.querySelector('.hero')) {
    const line = ['1. e4 e5', '2. Nf3 Nc6', '3. Bb5 a6', '4. Ba4 Nf6', '5. O-O Be7', '6. Re1 b5', '7. Bb3 d6', '8. c3 O-O', '9. h3 Nb8', '10. d4 Nbd7'];
    const row = line.map(m => `<span>${m}</span><span><b>♛</b></span>`).join('');
    const t = el('div', 'fx-ticker', `<div>${row}${row}</div>`); t.setAttribute('aria-hidden', 'true'); facts.parentNode.insertBefore(t, facts);
  }

  /* count-up numbers in the facts band */
  const nums = [...d.querySelectorAll('.fact b')].map(n => { const t = n.firstChild; const m = t && t.nodeType === 3 && /^(\d+(?:\.\d+)?)(K?)$/.exec(t.textContent.trim()); return m ? { n, t, to: parseFloat(m[1]), dec: (m[1].split('.')[1] || '').length, suf: m[2] } : null }).filter(Boolean);
  if (nums.length && !reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      const o = nums.find(x => x.n === e.target), t0 = performance.now(), dur = 1400;
      const step = now => { const k = Math.min(1, (now - t0) / dur), v = o.to * (1 - Math.pow(1 - k, 3)); o.t.textContent = v.toFixed(o.dec) + o.suf; if (k < 1) requestAnimationFrame(step) };
      requestAnimationFrame(step);
    }), { threshold: .6 });
    nums.forEach(o => { o.t.textContent = (0).toFixed(o.dec) + o.suf; io.observe(o.n) });
  }
})();
