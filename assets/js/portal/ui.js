// Shared futuristic UI layer: theme, ripple, reveal, counters, tilt, page transitions.
(function () {
  const de = document.documentElement, ls = { get(k) { try { return localStorage.getItem(k) } catch { return null } }, set(k, v) { try { localStorage.setItem(k, v) } catch {} } };
  const saved = ls.get('pq-theme') === 'dark' ? 'dark' : 'light';
  de.dataset.theme = saved;
  const ready = (f) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', f) : f();
  const ICON = { sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>', moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' };
  ready(() => {
    document.body.classList.add('pqp');
    const fab = document.createElement('div'); fab.className = 'fab';
    const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Switch light / dark theme');
    const paint = () => { b.innerHTML = de.dataset.theme === 'dark' ? ICON.sun : ICON.moon };
    paint(); b.onclick = () => { de.dataset.theme = de.dataset.theme === 'dark' ? 'light' : 'dark'; ls.set('pq-theme', de.dataset.theme); paint() };
    b.className = 'themebtn'; const cta = document.querySelector('.hdr-cta');
    // desktop: top right of the header; phone: small round button at the bottom right (no room in the header)
    const b2 = b.cloneNode(true); b2.className = ''; b2.onclick = b.onclick; const paint2 = paint; 
    if (cta) { cta.appendChild(b); fab.classList.add('fab-m') }
    fab.appendChild(b2); document.body.appendChild(fab);
    // portal and puzzle pages: the light / dark button always sits in the top right of the header
    const tb = b.cloneNode(true), host = document.getElementById('spUser'), pl = document.querySelector('.pl-bar .pl-prog');
    if (host) { tb.className = 'themebtn top-theme'; host.parentNode.insertBefore(tb, host); fab.style.display = 'none' }
    else if (pl) { tb.className = 'themebtn top-theme'; pl.appendChild(tb); fab.style.display = 'none' }
    const all = () => [b, b2].concat(host || pl ? [tb] : []);
    const sync = () => { all().forEach(x => x.innerHTML = de.dataset.theme === 'dark' ? ICON.sun : ICON.moon) };
    const flip = () => { de.dataset.theme = de.dataset.theme === 'dark' ? 'light' : 'dark'; ls.set('pq-theme', de.dataset.theme); sync() };
    all().forEach(x => x.onclick = flip); sync();
    // ripple
    document.addEventListener('pointerdown', (e) => {
      const t = e.target.closest('.btn, .mission .go'); if (!t) return;
      const r = t.getBoundingClientRect(), s = Math.max(r.width, r.height) * 2, d = document.createElement('span');
      d.className = 'rip'; d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
      if (getComputedStyle(t).position === 'static') t.style.position = 'relative';
      t.appendChild(d); setTimeout(() => d.remove(), 650);
    });
    // page transition
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]'); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target || a.hasAttribute('download')) return;
      const h = a.getAttribute('href'); if (!h || h[0] === '#' || /^(mailto|tel|javascript|https?:)/i.test(h)) return;
      e.preventDefault(); document.body.classList.add('leaving'); setTimeout(() => (location.href = a.href), 150);
    });
    addEventListener('pageshow', (e) => { if (e.persisted) document.body.classList.remove('leaving') });
    window.PQ_UI = { enhance };
    enhance(document);
  });
  function enhance(scope) {
    // reveal
    const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target) } }), { threshold: .08 }) : null;
    scope.querySelectorAll('.rv-p:not(.in)').forEach((el) => io ? io.observe(el) : el.classList.add('in'));
    // counters
    scope.querySelectorAll('[data-count]').forEach((el) => {
      if (el.dataset.done) return; el.dataset.done = 1;
      const to = +el.dataset.count, suf = el.dataset.suf || '', pre = el.dataset.pre || '', t0 = performance.now(), dur = 900;
      const step = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = pre + Math.round(to * e) + suf; if (k < 1) requestAnimationFrame(step) };
      requestAnimationFrame(step);
    });
    // animated bars
    scope.querySelectorAll('[data-w]').forEach((el) => requestAnimationFrame(() => setTimeout(() => (el.style.width = el.dataset.w + '%'), 80)));
    // tilt
    if (matchMedia('(hover:hover)').matches) scope.querySelectorAll('.modcard, .stat').forEach((el) => {
      if (el.dataset.tilt) return; el.dataset.tilt = 1;
      el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = `perspective(700px) rotateX(${-y * 5}deg) rotateY(${x * 6}deg) translateY(-3px)` });
      el.addEventListener('pointerleave', () => (el.style.transform = ''));
    });
  }
})();
