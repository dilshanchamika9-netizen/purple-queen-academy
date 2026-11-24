/* Purple Queen lesson player: animated lessons, practice with scoring, progress, certificate */
(function () {
  const M = window.PQ_MODULE, P = window.PQ_PRACTICE;
  const root = document.getElementById('learnApp');
  if (!root || !M) return;
  const $ = (s, r = root) => r.querySelector(s);
  const $$ = (s, r = root) => [...r.querySelectorAll(s)];
  const F = 'abcdefgh';
  const GLYPH = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };
  const PASS = 70;
  const store = {
    get(k, d) { try { const v = localStorage.getItem('pq-' + k); return v == null ? d : JSON.parse(v) } catch { return d } },
    set(k, v) { try { localStorage.setItem('pq-' + k, JSON.stringify(v)) } catch {} },
  };
  let lang = store.get('lang', 'en');
  let progress = store.get('progress', {});      // lessonId -> best %
  let xp = store.get('xp', 0);
  let coachView = store.get('coach', false);
  const tx = (o) => o == null ? '' : typeof o === 'string' ? o : (o[lang] || o.en);

  /* ---------------- board ---------------- */
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
      e.innerHTML = `<span>${GLYPH[p[1]]}&#xFE0E;</span>`; Object.assign(e.style, this.xy(s)); e.dataset.p = p;
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
      if (promote) { const fn = () => { e.dataset.p = promote; e.querySelector('span').innerHTML = GLYPH[promote[1]] + '&#xFE0E;'; e.classList.add('promo') }; animate ? setTimeout(fn, 520) : fn() }
    }
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

  /* ---------------- layout ---------------- */
  root.innerHTML = `
  <aside class="lp-side">
    <div class="lp-mod"><span class="lp-lv" data-t="level"></span><b data-t="module"></b>
      <div class="lp-ring"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5" class="bg"/><circle cx="18" cy="18" r="15.5" class="fg" id="ringFg"/></svg><span id="ringTxt">0%</span></div>
      <div class="lp-xp"><span>XP</span><b id="xpTxt">0</b></div>
    </div>
    <ol class="lp-list" id="lessonList"></ol>
    <label class="lp-coach"><input type="checkbox" id="coachView"> <span data-t="coach"></span></label>
    <button class="lp-cert" type="button" id="certBtn" hidden></button>
  </aside>
  <section class="lp-main">
    <header class="lp-top">
      <div><span class="lp-num" id="lessonNum"></span><h2 id="lessonTitle"></h2></div>
      <div class="lp-tools">
        <div class="seg lang" role="group" aria-label="Language"><button type="button" data-lang="en">English</button><button type="button" data-lang="si">සිංහල</button></div>
        <div class="seg mode" role="tablist"><button type="button" data-mode="watch" role="tab"></button><button type="button" data-mode="practice" role="tab"></button></div>
      </div>
    </header>
    <div class="lp-stage">
      <div class="lp-boardwrap"><div class="lb" id="board"></div></div>
      <div class="lp-panel" id="panel"></div>
    </div>
  </section>`;

  const UI = {
    level: M.level, module: M.title,
    coach: { en: 'Coach view: open all lessons', si: 'පුහුණුකරු දර්ශනය: සියලු පාඩම් විවෘත කරන්න' },
    watch: { en: '▶ Watch lesson', si: '▶ පාඩම නරඹන්න' }, practice: { en: '✎ Practice', si: '✎ පුහුණුව' },
    lesson: { en: 'Lesson', si: 'පාඩම' }, of: { en: 'of', si: '/' },
    play: { en: 'Play', si: 'ධාවනය' }, pause: { en: 'Pause', si: 'නවත්වන්න' }, replay: { en: 'Replay', si: 'නැවත' },
    toPractice: { en: 'Start practice', si: 'පුහුණුව අරඹන්න' },
    task: { en: 'Task', si: 'කාර්යය' }, score: { en: 'Score', si: 'ලකුණු' },
    right: { en: 'Correct!', si: 'නිවැරදියි!' }, wrong: { en: 'Not quite. The answer is shown in gold.', si: 'නිවැරදි නැත. නිවැරදි පිළිතුර රන් පැහැයෙන් පෙන්වා ඇත.' },
    next: { en: 'Next', si: 'ඊළඟ' }, finish: { en: 'See my result', si: 'ප්‍රතිඵලය බලන්න' },
    passed: { en: 'Lesson passed!', si: 'පාඩම සමත්!' }, failed: { en: 'Almost there', si: 'තව ටිකයි' },
    passNote: { en: `You need ${PASS}% to pass and open the next lesson.`, si: `සමත් වීමට සහ ඊළඟ පාඩම විවෘත කිරීමට ${PASS}% අවශ්‍යයි.` },
    retry: { en: 'Try again', si: 'නැවත උත්සාහ කරන්න' }, nextLesson: { en: 'Next lesson', si: 'ඊළඟ පාඩම' }, rewatch: { en: 'Watch again', si: 'නැවත නරඹන්න' },
    locked: { en: 'Pass the previous lesson to open this one.', si: 'මෙය විවෘත කිරීමට පෙර පාඩම සමත් වන්න.' },
    best: { en: 'Best', si: 'හොඳම' },
    pickPiece: { en: 'Click the white piece, then its square.', si: 'සුදු කැබැල්ල ක්ලික් කර, ඉන්පසු කොටුව ක්ලික් කරන්න.' },
    clickSq: { en: 'Click a square on the board.', si: 'පුවරුවේ කොටුවක් ක්ලික් කරන්න.' },
    cert: { en: '🏆 Get module certificate', si: '🏆 සහතිකය ලබාගන්න' },
  };
  const board = new Board($('#board'));
  let li = 0, si = 0, mode = 'watch', timer = null, playing = false;

  const unlocked = (i) => coachView || i === 0 || (progress[M.lessons[i - 1].id] || 0) >= PASS;
  const done = () => M.lessons.filter(l => (progress[l.id] || 0) >= PASS).length;

  function paintStatic() {
    $$('[data-t]').forEach(e => e.textContent = tx(UI[e.dataset.t]));
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
    $$('.mode button').forEach(b => { b.textContent = tx(UI[b.dataset.mode]); b.setAttribute('aria-selected', b.dataset.mode === mode) });
    $('#coachView').checked = coachView;
    document.documentElement.lang = lang === 'si' ? 'si' : 'en';
    const n = done(), pct = Math.round(n / M.lessons.length * 100);
    $('#ringFg').style.strokeDasharray = `${pct * 0.974} 100`; $('#ringTxt').textContent = pct + '%';
    $('#xpTxt').textContent = xp;
    const cb = $('#certBtn'); cb.hidden = n < M.lessons.length; cb.textContent = tx(UI.cert);
    $('#lessonList').innerHTML = M.lessons.map((l, i) => {
      const best = progress[l.id], ok = (best || 0) >= PASS, lock = !unlocked(i);
      return `<li><button type="button" data-i="${i}" class="${i === li ? 'cur' : ''} ${ok ? 'ok' : ''} ${lock ? 'lock' : ''}" ${lock ? 'aria-disabled="true"' : ''}>
        <span class="n">${ok ? '✓' : lock ? '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>' : i + 1}</span><span class="t">${tx(l.title)}</span>${best != null ? `<span class="s">${best}%</span>` : ''}</button></li>` }).join('');
    $('#lessonNum').textContent = `${tx(UI.lesson)} ${li + 1} ${tx(UI.of)} ${M.lessons.length}`;
    $('#lessonTitle').textContent = tx(M.lessons[li].title);
  }

  /* ---------------- watch mode ---------------- */
  function stateAt(i) {
    const steps = M.lessons[li].steps; let pos = {};
    for (let k = 0; k <= i; k++) { const s = steps[k]; if (s.pos) pos = { ...s.pos }; if (s.move) { const [a, b] = s.move; pos[b] = s.promote ? s.promote.p : pos[a]; delete pos[a] } }
    return pos;
  }
  function showStep(i, animate) {
    const steps = M.lessons[li].steps; const st = steps[i];
    if (animate && i === si + 1 && !st.pos && st.move) { board.move(st.move[0], st.move[1], st.promote && st.promote.p, true) }
    else if (animate && i === si + 1 && st.pos) { board.setPos(st.pos, true) }
    else if (!(animate && i === si + 1)) { const prev = i > 0 ? stateAt(i - 1) : {}; if (st.move && animate) { board.setPos(prev, false); board.move(st.move[0], st.move[1], st.promote && st.promote.p, true) } else board.setPos(stateAt(i), false) }
    si = i; board.decorate(st);
    const p = $('#panel .cap'); if (p) { p.classList.remove('swap'); void p.offsetWidth; p.classList.add('swap'); p.textContent = tx(st.text) }
    $$('#panel .dots i').forEach((d, k) => d.className = k < i ? 'past' : k === i ? 'now' : '');
    const last = i === steps.length - 1;
    $('#panel .go-prac').classList.toggle('pulse', last);
    if (last) stop();
  }
  function play() { playing = true; $('#playBtn').innerHTML = '❚❚ <span>' + tx(UI.pause) + '</span>'; schedule() }
  function stop() { playing = false; clearTimeout(timer); const b = $('#playBtn'); if (b) b.innerHTML = (si === M.lessons[li].steps.length - 1 ? '↻ <span>' + tx(UI.replay) : '▶ <span>' + tx(UI.play)) + '</span>' }
  function schedule() { clearTimeout(timer); const st = M.lessons[li].steps[si]; const ms = 2600 + tx(st.text).length * 32; timer = setTimeout(() => { if (!playing) return; if (si < M.lessons[li].steps.length - 1) { showStep(si + 1, true); if (playing) schedule() } }, ms) }
  function renderWatch(autoplay = true) {
    mode = 'watch'; paintStatic(); stop(); board.click = null; root.classList.remove('practicing');
    const steps = M.lessons[li].steps;
    $('#panel').innerHTML = `<div class="dots">${steps.map(() => '<i></i>').join('')}</div><p class="cap"></p>
      <div class="ctrl"><button type="button" class="ic" id="prevBtn" aria-label="Previous step">‹</button><button type="button" class="pl" id="playBtn"></button><button type="button" class="ic" id="nextBtn" aria-label="Next step">›</button></div>
      <button type="button" class="btn btn-primary go-prac">${tx(UI.toPractice)} →</button>`;
    si = -1; board.setPos({}, false); showStep(0, false);
    $('#prevBtn').onclick = () => { stop(); if (si > 0) showStep(si - 1, false) };
    $('#nextBtn').onclick = () => { stop(); if (si < steps.length - 1) showStep(si + 1, true) };
    $('#playBtn').onclick = () => { if (playing) { stop(); return } if (si === steps.length - 1) { showStep(0, false) } play() };
    $('.go-prac').onclick = () => renderPractice();
    autoplay ? play() : stop();
  }

  /* ---------------- practice mode ---------------- */
  let tasks = [], ti = 0, score = 0, answered = false, sel = null;
  function renderPractice() {
    mode = 'practice'; stop(); paintStatic(); root.classList.add('practicing');
    tasks = P[M.lessons[li].id] || []; ti = 0; score = 0; showTask();
  }
  function showTask() {
    answered = false; sel = null;
    const t = tasks[ti];
    board.setPos(t.pos || {}, true); board.decorate({ hl: t.hl, files: true, ranks: true });
    const hint = t.type === 'move' ? tx(UI.pickPiece) : t.type === 'square' ? tx(UI.clickSq) : '';
    $('#panel').innerHTML = `<div class="pbar"><span>${tx(UI.task)} ${ti + 1}/${tasks.length}</span><i><b style="width:${ti / tasks.length * 100}%"></b></i><span>${tx(UI.score)} ${score}</span></div>
      <p class="q">${tx(t.q)}</p>${hint ? `<p class="hint">${hint}</p>` : ''}
      ${t.type === 'choice' ? `<div class="opts">${t.opts.map((o, k) => `<button type="button" data-k="${k}"><i>${'ABC'[k]}</i>${tx(o)}</button>`).join('')}</div>` : ''}
      <div class="fb" id="fb" aria-live="polite"></div><button type="button" class="btn btn-primary nx" id="nxBtn" hidden></button>`;
    root.classList.toggle('board-dim', t.type === 'choice' && !t.pos);
    if (t.type === 'choice') { $$('.opts button').forEach(b => b.onclick = () => answer(+b.dataset.k === t.a, () => { $$('.opts button').forEach(x => { x.disabled = true; if (+x.dataset.k === t.a) x.classList.add('right') }); if (+b.dataset.k !== t.a) b.classList.add('wrong') })); board.click = null }
    else if (t.type === 'square') { board.click = (s) => { if (answered) return; const ok = t.ans.includes(s); board.mark(s, ok ? 'good' : 'bad', 0); answer(ok, () => { if (!ok) board.decorate({ hl: t.ans.length <= 8 ? t.ans : [], soft: t.ans.length > 8 ? t.ans : [], files: true, ranks: true }); board.mark(s, ok ? 'good' : 'bad', 0) }) } }
    else if (t.type === 'move') {
      board.click = (s) => {
        if (answered) return;
        const p = board.pos()[s];
        if (p && p[0] === 'w') { if (sel) board.sq[sel].classList.remove('sel'); sel = s; board.sq[s].classList.add('sel'); return }
        if (!sel) return;
        const ok = t.ans.some(([a, b]) => a === sel && b === s);
        const from = sel; board.sq[from].classList.remove('sel'); sel = null;
        if (ok) board.move(from, s, t.promote, true); else board.mark(s, 'bad', 0);
        answer(ok, () => { if (!ok) { const [a, b] = t.ans[0]; board.decorate({ hl: [a, b], files: true, ranks: true }); board.mark(s, 'bad', 0) } });
      };
    }
  }
  function answer(ok, reveal) {
    if (answered) return; answered = true;
    if (ok) { score++; xp += 10; store.set('xp', xp); $('#xpTxt').textContent = xp; burst() }
    reveal();
    const fb = $('#fb'); fb.className = 'fb ' + (ok ? 'ok' : 'err'); fb.textContent = ok ? tx(UI.right) + ' +10 XP' : tx(UI.wrong);
    const nb = $('#nxBtn'); nb.hidden = false; nb.textContent = ti < tasks.length - 1 ? tx(UI.next) + ' →' : tx(UI.finish);
    nb.onclick = () => { if (ti < tasks.length - 1) { ti++; showTask() } else result() }; nb.focus({ preventScroll:true });
  }
  function burst() { const b = $('#board'); b.classList.remove('win'); void b.offsetWidth; b.classList.add('win') }
  function result() {
    board.click = null; root.classList.remove('board-dim');
    const pct = Math.round(score / tasks.length * 100), id = M.lessons[li].id;
    const prevBest = progress[id]; if (prevBest == null || pct > prevBest) { progress[id] = pct; store.set('progress', progress) }
    const pass = pct >= PASS, stars = pct >= 90 ? 3 : pct >= PASS ? 2 : pct >= 50 ? 1 : 0;
    paintStatic();
    $('#panel').innerHTML = `<div class="res ${pass ? 'pass' : 'fail'}">
      <div class="gauge" style="--p:${pct}"><b>${pct}%</b><span>${score}/${tasks.length}</span></div>
      <div class="stars">${[1, 2, 3].map(n => `<i class="${n <= stars ? 'on' : ''}">★</i>`).join('')}</div>
      <h3>${tx(pass ? UI.passed : UI.failed)}</h3><p>${pass ? '' : tx(UI.passNote)}</p>
      <p class="bst">${tx(UI.best)}: ${progress[id]}%</p>
      <div class="ra">${pass && li < M.lessons.length - 1 ? `<button type="button" class="btn btn-primary" id="goNext">${tx(UI.nextLesson)} →</button>` : ''}
      <button type="button" class="btn btn-ghost" id="goRetry">${tx(UI.retry)}</button><button type="button" class="btn btn-ghost" id="goWatch">${tx(UI.rewatch)}</button></div></div>`;
    const gn = $('#goNext'); if (gn) gn.onclick = () => openLesson(li + 1);
    $('#goRetry').onclick = renderPractice; $('#goWatch').onclick = () => renderWatch(true);
    if (pass) board.el.classList.add('win');
  }

  /* ---------------- certificate ---------------- */
  function certificate() {
    const name = store.get('name', '');
    const dlg = document.getElementById('certDlg'); if (!dlg) return;
    dlg.querySelector('#certName').value = name;
    const paint = () => { const n = dlg.querySelector('#certName').value.trim(); dlg.querySelector('.cn').textContent = n || '—'; store.set('name', n) };
    dlg.querySelector('#certName').oninput = paint; paint();
    dlg.querySelector('.cd').textContent = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', '');
  }

  /* ---------------- wiring ---------------- */
  function openLesson(i) { if (!unlocked(i)) return; li = i; store.set('li', li); renderWatch(true); root.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
  root.addEventListener('click', e => {
    const l = e.target.closest('#lessonList button'); if (l) { const i = +l.dataset.i; if (unlocked(i)) openLesson(i); else { l.classList.add('shake'); setTimeout(() => l.classList.remove('shake'), 500); l.title = tx(UI.locked) } }
    const lg = e.target.closest('.lang button'); if (lg) { lang = lg.dataset.lang; store.set('lang', lang); mode === 'watch' ? (paintStatic(), showStep(si, false), stop()) : (paintStatic(), showTask()) }
    const md = e.target.closest('.mode button'); if (md) md.dataset.mode === 'practice' ? renderPractice() : renderWatch(true);
  });
  $('#coachView').addEventListener('change', e => { coachView = e.target.checked; store.set('coach', coachView); paintStatic() });
  $('#certBtn').addEventListener('click', certificate);
  document.addEventListener('keydown', e => {
    if (mode !== 'watch' || /input|textarea/i.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight') $('#nextBtn').click(); if (e.key === 'ArrowLeft') $('#prevBtn').click();
  });
  const saved = store.get('li', 0); li = Math.min(saved, M.lessons.length - 1); if (!unlocked(li)) li = 0;
  renderWatch(false);
  window.PQ_LEARN = { openLesson, board, get state() { return { li, si, mode, ti, score } } };
})();
