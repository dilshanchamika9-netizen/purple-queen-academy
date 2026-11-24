/* Fireworks + sound for correct answers. PQ_CELEBRATE({ title, sub, size: 'big' | 'small' }) */
(function () {
  const store = { get(k, d) { try { const v = localStorage.getItem('pq-' + k); return v == null ? d : JSON.parse(v) } catch { return d } }, set(k, v) { try { localStorage.setItem('pq-' + k, JSON.stringify(v)) } catch {} } };
  let soundOn = store.get('sound', true), ctx = null;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COLORS = ['#C9A45C', '#F7E7BF', '#C2A3E6', '#8C5FC2', '#FFFFFF', '#E9CC8A', '#B795DD'];

  /* ---------- sound (Web Audio, no files) ---------- */
  function ac() { if (!ctx) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ctx = new A() } if (ctx.state === 'suspended') ctx.resume(); return ctx }
  function tone(f, t, d, type = 'sine', g = .18) {
    const c = ac(); if (!c) return; const o = c.createOscillator(), v = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, c.currentTime + t);
    v.gain.setValueAtTime(0.0001, c.currentTime + t); v.gain.exponentialRampToValueAtTime(g, c.currentTime + t + .02); v.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t + d);
    o.connect(v).connect(c.destination); o.start(c.currentTime + t); o.stop(c.currentTime + t + d + .05);
  }
  function boom(t, g = .35) {
    const c = ac(); if (!c) return; const len = c.sampleRate * .6, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    const s = c.createBufferSource(), f = c.createBiquadFilter(), v = c.createGain(); s.buffer = buf; f.type = 'lowpass'; f.frequency.value = 900;
    v.gain.value = g; s.connect(f).connect(v).connect(c.destination); s.start(c.currentTime + t);
  }
  function crackle(t) { const c = ac(); if (!c) return; for (let i = 0; i < 14; i++) tone(2400 + Math.random() * 2600, t + Math.random() * .5, .04, 'square', .025) }
  function fanfare(big) {
    if (!soundOn) return;
    const notes = big ? [523.25, 659.25, 783.99, 1046.5] : [659.25, 987.77];
    notes.forEach((f, i) => { tone(f, i * .11, .35, 'triangle', .16); tone(f * 2, i * .11, .25, 'sine', .05) });
    if (big) { tone(1046.5, .48, .9, 'triangle', .14); tone(1318.5, .48, .9, 'sine', .08); [0.15, 0.7, 1.2].forEach(t => { boom(t); crackle(t + .12) }) }
  }

  /* ---------- fireworks canvas ---------- */
  let cv, g, parts = [], raf = null;
  function canvas() {
    if (cv) return; cv = document.createElement('canvas'); cv.className = 'pq-fx'; cv.setAttribute('aria-hidden', 'true'); document.body.appendChild(cv); g = cv.getContext('2d');
    const fit = () => { const r = devicePixelRatio || 1; cv.width = innerWidth * r; cv.height = innerHeight * r; g.setTransform(r, 0, 0, r, 0, 0) }; fit(); addEventListener('resize', fit);
  }
  function burst(x, y, n) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, s = 2 + Math.random() * 5.5; parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 70 + Math.random() * 40, c: COLORS[i % COLORS.length], r: 1.6 + Math.random() * 2.2 }) } }
  function rocket(delay) { setTimeout(() => { const x = innerWidth * (.15 + Math.random() * .7), y = innerHeight * (.15 + Math.random() * .3); burst(x, y, 70); loop() }, delay) }
  function loop() {
    if (raf) return;
    const step = () => {
      g.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach(p => { p.vy += .07; p.vx *= .985; p.vy *= .985; p.x += p.vx; p.y += p.vy; p.life--; g.globalAlpha = Math.max(0, Math.min(1, p.life / 50)); g.fillStyle = p.c; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 7); g.fill() });
      parts = parts.filter(p => p.life > 0); g.globalAlpha = 1;
      if (parts.length) raf = requestAnimationFrame(step); else { raf = null; g.clearRect(0, 0, innerWidth, innerHeight) }
    };
    raf = requestAnimationFrame(step);
  }

  /* ---------- banner ---------- */
  let banner, hideT;
  function showBanner(title, sub, big) {
    if (!banner) { banner = document.createElement('div'); banner.className = 'pq-cheer'; banner.setAttribute('role', 'status'); document.body.appendChild(banner) }
    banner.innerHTML = `<span class="crown">♛&#xFE0E;</span><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}<button type="button" class="snd" aria-label="Sound">${soundOn ? '🔊&#xFE0E; Sound on' : '🔈&#xFE0E; Sound off'}</button>`;
    banner.querySelector('.snd').onclick = (e) => { e.stopPropagation(); soundOn = !soundOn; store.set('sound', soundOn); e.target.innerHTML = soundOn ? '🔊&#xFE0E; Sound on' : '🔈&#xFE0E; Sound off' };
    banner.classList.toggle('big', big); banner.classList.remove('show'); void banner.offsetWidth; banner.classList.add('show');
    clearTimeout(hideT); hideT = setTimeout(() => banner.classList.remove('show'), big ? 3200 : 1800);
  }

  window.PQ_CELEBRATE = function ({ title = 'Congratulations!', sub = '', size = 'big' } = {}) {
    const big = size === 'big';
    fanfare(big);
    showBanner(title, sub, big);
    if (reduce) return;
    canvas();
    if (big) { [0, 350, 800, 1250].forEach(rocket) } else { burst(innerWidth / 2, innerHeight * .35, 45); loop() }
  };
  window.PQ_SOUND = { get on() { return soundOn }, tone };
})();
