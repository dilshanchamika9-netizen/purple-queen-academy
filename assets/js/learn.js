/* Purple Queen lesson player: animated lessons, practice with scoring, progress, certificate */
(function () {
  const MODS = window.PQ_MODULES || (window.PQ_MODULE ? [window.PQ_MODULE] : []), P = window.PQ_PRACTICE;
  let mi = 0, M = MODS[0];
  const root = document.getElementById('learnApp');
  if (!root || !M) return;
  const $ = (s, r = root) => r.querySelector(s);
  const $$ = (s, r = root) => [...r.querySelectorAll(s)];
  const F = 'abcdefgh';
  const GLYPH = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };
  const PASS = 70;
  const store = {
    get(k, d) { try { const v = localStorage.getItem('pq-' + k); return v == null ? d : JSON.parse(v) } catch { return d } },
    set(k, v) { try { localStorage.setItem('pq-' + k, JSON.stringify(v)) } catch {} if (k === 'progress' || k === 'xp') window.dispatchEvent(new Event('pq-saved')) },
  };
  let lang = store.get('lang', 'en');
  let progress = store.get('progress', {});      // lessonId -> best %
  let xp = store.get('xp', 0);
  let coachView = store.get('coach', false);
  const tx = (o) => o == null ? '' : typeof o === 'string' ? o : (o[lang] || o.en);

  /* ---------------- voice ---------------- */
  let voiceOn = store.get('voice', true), manifest = null;
  const audio = new Audio(); audio.preload = 'auto';
  const hash = (s) => { let h = 0x811c9dc5; for (const c of s) { h ^= c.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0 } return h.toString(16).padStart(8, '0') };
  fetch('assets/audio/manifest.json', { cache: 'no-cache' }).then(r => r.ok ? r.json() : {}).then(m => { manifest = m }).catch(() => { manifest = {} });
  function sysVoice(l) { try { const vs = speechSynthesis.getVoices(); return vs.find(v => v.lang && v.lang.toLowerCase().startsWith(l === 'si' ? 'si' : 'en')) } catch { return null } }
  function hush() { try { audio.pause(); speechSynthesis && speechSynthesis.cancel() } catch {} }
  /* speak(obj) -> Promise resolving when speech ends (or at once when silent) */
  function speak(o) {
    hush();
    if (!voiceOn || !o || !o.en) return Promise.resolve(false);
    const text = tx(o), key = lang + '|' + text, h = hash(key);
    if (manifest && manifest[h]) {
      return new Promise(res => { audio.src = `assets/audio/${lang}/${h}.mp3`; audio.onended = () => res(true); audio.onerror = () => res(false); audio.play().catch(() => res(false)) });
    }
    const v = sysVoice(lang);
    if (v && 'speechSynthesis' in window) {
      return new Promise(res => { const u = new SpeechSynthesisUtterance(text); u.voice = v; u.lang = v.lang; u.rate = .92; u.onend = () => res(true); u.onerror = () => res(false); speechSynthesis.speak(u) });
    }
    return Promise.resolve(false);
  }

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

  /* ---------------- layout ---------------- */
  root.innerHTML = `
  <aside class="lp-side">
    <div class="lp-mods" id="modTabs"></div>
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
        <button type="button" class="vbtn" id="voiceBtn" aria-pressed="true"></button><div class="seg lang" role="group" aria-label="Language"><button type="button" data-lang="en">English</button><button type="button" data-lang="si">සිංහල</button></div>
        <div class="seg mode" role="tablist"><button type="button" data-mode="watch" role="tab"></button><button type="button" data-mode="practice" role="tab"></button></div>
      </div>
    </header>
    <div class="lp-stage">
      <div class="lp-boardwrap"><div class="lb" id="board"></div></div>
      <div class="lp-panel" id="panel"></div>
    </div>
  </section>`;

  const UI = {
    get level() { return M.level }, get module() { return M.title },
    mod: { en: 'Module', si: 'මොඩියුලය' }, nextMod: { en: 'Next module', si: 'ඊළඟ මොඩියුලය' },
    lockedMod: { en: 'Finish the previous module to open this one.', si: 'මේක විවෘත වෙන්න කලින් මොඩියුලය අවසන් කරන්න ඕන.' },
    pcQ: { en: 'Queen', si: 'රැජින' }, pcR: { en: 'Rook', si: 'රුක්' }, pcB: { en: 'Bishop', si: 'බිෂොප්' }, pcN: { en: 'Knight', si: 'නයිට්' },
    pickNew: { en: 'Now choose the new piece.', si: 'දැන් අලුත් ඉත්තා තෝරන්න.' },
    coach: { en: 'Coach view: open all lessons', si: 'කෝච් සඳහා: සියලුම පාඩම් විවෘත කරන්න' },
    watch: { en: '▶ Watch lesson', si: '▶ පාඩම නරඹන්න' }, practice: { en: '✎ Practice', si: '✎ පුහුණුව' },
    lesson: { en: 'Lesson', si: 'පාඩම' }, of: { en: 'of', si: '/' },
    play: { en: 'Play', si: 'පටන් ගන්න' }, pause: { en: 'Pause', si: 'නවත්වන්න' }, replay: { en: 'Replay', si: 'ආයෙත් බලන්න' },
    toPractice: { en: 'Start practice', si: 'පුහුණුව අරඹන්න' },
    task: { en: 'Task', si: 'කාර්යය' }, score: { en: 'Score', si: 'ලකුණු' },
    right: { en: 'Correct!', si: 'නිවැරදියි!' }, wrong: { en: 'Not quite. The answer is shown in gold.', si: 'වැරදියි. නිවැරදි උත්තරය රන් පාටින් පෙන්නලා තියෙනවා.' },
    next: { en: 'Next', si: 'ඊළඟ' }, finish: { en: 'See my result', si: 'ප්‍රතිඵලය බලන්න' },
    passed: { en: 'Lesson passed!', si: 'පාඩම පාස්!' }, failed: { en: 'Almost there', si: 'තව ටිකයි' },
    passNote: { en: `You need ${PASS}% to pass and open the next lesson.`, si: `පාස් වෙලා ඊළඟ පාඩම විවෘත කරන්න ${PASS}% ඕන.` },
    retry: { en: 'Try again', si: 'නැවත උත්සාහ කරන්න' }, nextLesson: { en: 'Next lesson', si: 'ඊළඟ පාඩම' }, rewatch: { en: 'Watch again', si: 'නැවත නරඹන්න' },
    locked: { en: 'Pass the previous lesson to open this one.', si: 'මේක විවෘත වෙන්න කලින් පාඩම පාස් වෙන්න ඕන.' },
    best: { en: 'Best', si: 'හොඳම' },
    pickPiece: { en: 'Click the white piece, then its square.', si: 'සුදු ඉත්තා ක්ලික් කරලා, ඊට පස්සේ කොටුව ක්ලික් කරන්න.' },
    clickSq: { en: 'Click a square on the board.', si: 'පුවරුවේ කොටුවක් ක්ලික් කරන්න.' },
    cert: { en: '🏆 Get module certificate', si: '🏆 සහතිකය ලබාගන්න' },
    voiceOn: { en: 'Voice on', si: 'හඬ ඇත' }, voiceOff: { en: 'Voice off', si: 'හඬ නැත' },
  };
  const board = new Board($('#board'));
  let li = 0, si = 0, mode = 'watch', timer = null, playing = false;

  const lkey = () => mi ? 'li' + (mi + 1) : 'li';
  const modDone = (k) => MODS[k].lessons.every(l => (progress[l.id] || 0) >= PASS);
  const modOpen = (k) => coachView || k === 0 || modDone(k - 1);
  const unlocked = (i) => coachView || (i === 0 ? modOpen(mi) : (progress[M.lessons[i - 1].id] || 0) >= PASS);
  const done = () => M.lessons.filter(l => (progress[l.id] || 0) >= PASS).length;

  function paintStatic() {
    $$('[data-t]').forEach(e => e.textContent = tx(UI[e.dataset.t]));
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
    $$('.mode button').forEach(b => { b.textContent = tx(UI[b.dataset.mode]); b.setAttribute('aria-selected', b.dataset.mode === mode) });
    $('#coachView').checked = coachView;
    const vb = $('#voiceBtn'); vb.setAttribute('aria-pressed', voiceOn); vb.innerHTML = (voiceOn ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="m17 9 5 6M22 9l-5 6"/></svg>') + '<span>' + tx(voiceOn ? UI.voiceOn : UI.voiceOff) + '</span>';
    document.documentElement.lang = lang === 'si' ? 'si' : 'en';
    const n = done(), pct = Math.round(n / M.lessons.length * 100);
    $('#ringFg').style.strokeDasharray = `${pct * 0.974} 100`; $('#ringTxt').textContent = pct + '%';
    $('#xpTxt').textContent = xp;
    $('#modTabs').hidden = MODS.length < 2;
    $('#modTabs').innerHTML = MODS.map((m, k) => `<button type="button" data-m="${k}" class="${k === mi ? 'cur' : ''} ${modOpen(k) ? '' : 'lock'}" title="${tx(m.title)}">${modOpen(k) ? '' : '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>'}${tx(UI.mod)} ${k + 1}</button>`).join('');
    const cb = $('#certBtn'); cb.hidden = n < M.lessons.length; cb.textContent = tx(UI.cert);
    $('#lessonList').innerHTML = M.lessons.map((l, i) => {
      const best = progress[l.id], ok = (best || 0) >= PASS, lock = !unlocked(i);
      return `<li><button type="button" data-i="${i}" class="${i === li ? 'cur' : ''} ${ok ? 'ok' : ''} ${lock ? 'lock' : ''}" ${lock ? 'aria-disabled="true"' : ''}>
        <span class="n">${ok ? '✓' : lock ? '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>' : i + 1}</span><span class="t">${tx(l.title)}</span>${best != null ? `<span class="s">${best}%</span>` : ''}</button></li>` }).join('');
    $('#lessonNum').textContent = `${tx(UI.lesson)} ${li + 1} ${tx(UI.of)} ${M.lessons.length}`;
    $('#lessonTitle').textContent = tx(M.lessons[li].title);
  }

  /* ---------------- watch mode ---------------- */
  const mvs = (st) => st.moves || (st.move ? [st.move] : []);
  function applyStep(pos, st) {
    if (st.pos) pos = { ...st.pos };
    const m = mvs(st); m.forEach(([a, b], k) => { pos[b] = (st.promote && k === m.length - 1) ? st.promote.p : pos[a]; delete pos[a] });
    (st.remove || []).forEach(q => delete pos[q]);
    return pos;
  }
  function stateAt(i) {
    const steps = M.lessons[li].steps; let pos = {};
    for (let k = 0; k <= i; k++) pos = applyStep(pos, steps[k]);
    return pos;
  }
  let speakId = 0, spoken = Promise.resolve(false), talk = false;
  function showStep(i, animate) {
    const steps = M.lessons[li].steps; const st = steps[i];
    const mv = mvs(st);
    const playMoves = () => { mv.forEach(([a, b], k) => board.move(a, b, st.promote && k === mv.length - 1 ? st.promote.p : undefined, true)); (st.remove || []).forEach(q => board.remove(q, true)) };
    if (animate && i === si + 1 && !st.pos && (mv.length || st.remove)) playMoves();
    else if (animate && i === si + 1 && st.pos) { board.setPos(st.pos, true) }
    else if (!(animate && i === si + 1)) { const prev = i > 0 ? stateAt(i - 1) : {}; if ((mv.length || st.remove) && !st.pos && animate) { board.setPos(prev, false); playMoves() } else board.setPos(stateAt(i), false) }
    si = i; board.decorate(st);
    const p = $('#panel .cap'); if (p) { p.classList.remove('swap'); void p.offsetWidth; p.classList.add('swap'); p.textContent = tx(st.text) }
    if (talk) { const my = ++speakId; spoken = speak(st.text).then(ok => my === speakId && ok) } else { spoken = Promise.resolve(false) }
    $$('#panel .dots i').forEach((d, k) => d.className = k < i ? 'past' : k === i ? 'now' : '');
    const last = i === steps.length - 1;
    $('#panel .go-prac').classList.toggle('pulse', last);
    if (last) stop();
  }
  function play() { playing = true; talk = true; $('#playBtn').innerHTML = '❚❚ <span>' + tx(UI.pause) + '</span>'; schedule() }
  function stop() { playing = false; clearTimeout(timer); speakId++; const b = $('#playBtn'); if (b) b.innerHTML = (si === M.lessons[li].steps.length - 1 ? '↻ <span>' + tx(UI.replay) : '▶ <span>' + tx(UI.play)) + '</span>' }
  function schedule() {
    clearTimeout(timer); const st = M.lessons[li].steps[si], my = speakId, t0 = Date.now();
    const minMs = 2600 + tx(st.text).length * 32;
    const advance = () => { if (!playing || my !== speakId) return; if (si < M.lessons[li].steps.length - 1) { showStep(si + 1, true); if (playing) schedule() } };
    spoken.then(ok => { if (my !== speakId) return; const wait = ok ? 900 : Math.max(0, minMs - (Date.now() - t0)); timer = setTimeout(advance, wait) });
  }
  function renderWatch(autoplay = true) {
    mode = 'watch'; paintStatic(); stop(); board.click = null; root.classList.remove('practicing');
    const steps = M.lessons[li].steps;
    $('#panel').innerHTML = `<div class="dots">${steps.map(() => '<i></i>').join('')}</div><p class="cap"></p>
      <div class="ctrl"><button type="button" class="ic" id="prevBtn" aria-label="Previous step">‹</button><button type="button" class="pl" id="playBtn"></button><button type="button" class="ic" id="nextBtn" aria-label="Next step">›</button></div>
      <button type="button" class="btn btn-primary go-prac">${tx(UI.toPractice)} →</button>`;
    talk = autoplay; si = -1; board.setPos({}, false); showStep(0, false);
    $('#prevBtn').onclick = () => { stop(); talk = true; if (si > 0) showStep(si - 1, false) };
    $('#nextBtn').onclick = () => { stop(); talk = true; if (si < steps.length - 1) showStep(si + 1, true) };
    $('#playBtn').onclick = () => { if (playing) { stop(); hush(); return } talk = true; if (si === steps.length - 1) showStep(0, false); else showStep(si, false); play() };
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
    answered = false; sel = null; hush();
    const t = tasks[ti];
    board.setPos(t.pos || {}, true); board.decorate({ hl: t.hl, files: true, ranks: true });
    const hint = t.type === 'move' || t.type === 'promo' ? tx(UI.pickPiece) : t.type === 'square' ? tx(UI.clickSq) : '';
    $('#panel').innerHTML = `<div class="pbar"><span>${tx(UI.task)} ${ti + 1}/${tasks.length}</span><i><b style="width:${ti / tasks.length * 100}%"></b></i><span>${tx(UI.score)} ${score}</span></div>
      <p class="q">${tx(t.q)}</p>${hint ? `<p class="hint">${hint}</p>` : ''}
      ${t.type === 'choice' ? `<div class="opts">${t.opts.map((o, k) => `<button type="button" data-k="${k}"><i>${'ABC'[k]}</i>${tx(o)}</button>`).join('')}</div>` : ''}
      <div class="fb" id="fb" aria-live="polite"></div><button type="button" class="btn btn-primary nx" id="nxBtn" hidden></button>`;
    root.classList.toggle('board-dim', t.type === 'choice' && !t.pos);
    speak(t.q);
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
        if (ok) { board.move(from, s, t.promote, true); (t.also || []).forEach(([a, b]) => board.move(a, b, null, true)); (t.remove || []).forEach(q => board.remove(q, true)) } else board.mark(s, 'bad', 0);
        answer(ok, () => { if (!ok) { const [a, b] = t.ans[0]; board.decorate({ hl: [a, b], files: true, ranks: true }); board.mark(s, 'bad', 0) } });
      };
    }
    else if (t.type === 'promo') {
      board.click = (s) => {
        if (answered || $('#promoBox')) return;
        const p = board.pos()[s];
        if (p && p[0] === 'w') { if (sel) board.sq[sel].classList.remove('sel'); sel = s; board.sq[s].classList.add('sel'); return }
        if (!sel) return;
        const ok = t.ans.some(([a, b]) => a === sel && b === s);
        const from = sel; board.sq[from].classList.remove('sel'); sel = null;
        if (!ok) { board.mark(s, 'bad', 0); answer(false, () => { const [a, b] = t.ans[0]; board.decorate({ hl: [a, b], files: true, ranks: true }); board.mark(s, 'bad', 0) }); return }
        board.move(from, s, null, true);
        const box = document.createElement('div'); box.id = 'promoBox'; box.className = 'opts promo';
        box.innerHTML = '<p class="hint" style="grid-column:1/-1;margin:0">' + tx(UI.pickNew) + '</p>' + ['Q', 'R', 'B', 'N'].map(k => `<button type="button" data-k="${k}"><img src="assets/pieces/w${k}.svg" alt="" width="34" height="34"><span>${tx(UI['pc' + k])}</span></button>`).join('');
        $('#fb').before(box);
        box.querySelectorAll('button').forEach(b => b.onclick = () => {
          if (answered) return; const k = b.dataset.k; board.setPiece(s, 'w' + k, true);
          answer(k === t.p, () => { box.querySelectorAll('button').forEach(x => { x.disabled = true; if (x.dataset.k === t.p) x.classList.add('right') }); if (k !== t.p) b.classList.add('wrong') });
        });
      };
    }
  }
  function answer(ok, reveal) {
    if (answered) return; answered = true;
    if (ok) { score++; xp += 10; store.set('xp', xp); $('#xpTxt').textContent = xp; burst(); if (window.PQ_CELEBRATE) PQ_CELEBRATE({ title: tx(UI.right), sub: '+10 XP', size: 'small' }) }
    reveal();
    const fb = $('#fb'); fb.className = 'fb ' + (ok ? 'ok' : 'err'); fb.textContent = ok ? tx(UI.right) + ' +10 XP' : tx(UI.wrong);
    const nb = $('#nxBtn'); nb.hidden = false; nb.textContent = ti < tasks.length - 1 ? tx(UI.next) + ' →' : tx(UI.finish);
    nb.onclick = () => { if (ti < tasks.length - 1) { ti++; showTask() } else result() }; nb.focus({ preventScroll:true });
  }
  function burst() { const b = $('#board'); b.classList.remove('win'); void b.offsetWidth; b.classList.add('win') }
  function result() {
    hush(); board.click = null; root.classList.remove('board-dim');
    const pct = Math.round(score / tasks.length * 100), id = M.lessons[li].id;
    window.dispatchEvent(new CustomEvent('pq-attempt', { detail: { id, pct } }));
    const prevBest = progress[id]; if (prevBest == null || pct > prevBest) { progress[id] = pct; store.set('progress', progress) }
    const pass = pct >= PASS, stars = pct >= 90 ? 3 : pct >= PASS ? 2 : pct >= 50 ? 1 : 0;
    paintStatic();
    $('#panel').innerHTML = `<div class="res ${pass ? 'pass' : 'fail'}">
      <div class="gauge" style="--p:${pct}"><b>${pct}%</b><span>${score}/${tasks.length}</span></div>
      <div class="stars">${[1, 2, 3].map(n => `<i class="${n <= stars ? 'on' : ''}">★</i>`).join('')}</div>
      <h3>${tx(pass ? UI.passed : UI.failed)}</h3><p>${pass ? '' : tx(UI.passNote)}</p>
      <p class="bst">${tx(UI.best)}: ${progress[id]}%</p>
      <div class="ra">${pass && li < M.lessons.length - 1 ? `<button type="button" class="btn btn-primary" id="goNext">${tx(UI.nextLesson)} →</button>` : ''}${pass && li === M.lessons.length - 1 && mi < MODS.length - 1 ? `<button type="button" class="btn btn-primary" id="goMod">${tx(UI.nextMod)} →</button>` : ''}
      <button type="button" class="btn btn-ghost" id="goRetry">${tx(UI.retry)}</button><button type="button" class="btn btn-ghost" id="goWatch">${tx(UI.rewatch)}</button></div></div>`;
    const gn = $('#goNext'); if (gn) gn.onclick = () => openLesson(li + 1);
    const gm = $('#goMod'); if (gm) gm.onclick = () => switchModule(mi + 1);
    $('#goRetry').onclick = renderPractice; $('#goWatch').onclick = () => renderWatch(true);
    if (pass) { board.el.classList.add('win'); if (window.PQ_CELEBRATE) PQ_CELEBRATE({ title: lang === 'si' ? 'සුබ පැතුම්!' : 'Congratulations!', sub: tx(UI.passed) + ' ' + pct + '%', size: 'big' }) }
  }

  /* ---------------- certificate ---------------- */
  function certificate() {
    const name = store.get('name', '');
    const dlg = document.getElementById('certDlg'); if (!dlg) return;
    const md = dlg.querySelector('.md'); if (md) md.textContent = `${M.level.en.split(' ·')[0]} · Module ${mi + 1}: ${M.title.en}`;
    const cp = dlg.querySelector('.cp'); if (cp) cp.textContent = `with a pass in all ${M.lessons.length} lessons and practice sessions.`;
    dlg.querySelector('#certName').value = name;
    const paint = () => { const n = dlg.querySelector('#certName').value.trim(); dlg.querySelector('.cn').textContent = n || '—'; store.set('name', n) };
    dlg.querySelector('#certName').oninput = paint; paint();
    dlg.querySelector('.cd').textContent = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', '');
  }

  /* ---------------- wiring ---------------- */
  function switchModule(k) { if (!modOpen(k)) return; hush(); mi = k; M = MODS[k]; store.set('mi', mi); const sv = store.get(lkey(), null); li = sv == null ? Math.max(0, M.lessons.findIndex(l => (progress[l.id] || 0) < PASS)) : Math.min(sv, M.lessons.length - 1); if (!unlocked(li)) li = 0; renderWatch(false) }
  function openLesson(i) { if (!unlocked(i)) return; li = i; store.set(lkey(), li); renderWatch(true); root.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
  root.addEventListener('click', e => {
    const l = e.target.closest('#lessonList button'); if (l) { const i = +l.dataset.i; if (unlocked(i)) openLesson(i); else { l.classList.add('shake'); setTimeout(() => l.classList.remove('shake'), 500); l.title = tx(UI.locked) } }
    const mt = e.target.closest('#modTabs button'); if (mt) { const k = +mt.dataset.m; if (modOpen(k)) switchModule(k); else { mt.classList.add('shake'); setTimeout(() => mt.classList.remove('shake'), 500); mt.title = tx(UI.lockedMod) } }
    const lg = e.target.closest('.lang button'); if (lg) { hush(); lang = lg.dataset.lang; store.set('lang', lang); mode === 'watch' ? (paintStatic(), showStep(si, false), stop()) : (paintStatic(), showTask()) }
    const md = e.target.closest('.mode button'); if (md) md.dataset.mode === 'practice' ? renderPractice() : renderWatch(true);
  });
  $('#voiceBtn').addEventListener('click', () => { voiceOn = !voiceOn; store.set('voice', voiceOn); if (!voiceOn) hush(); paintStatic() });
  $('#coachView').addEventListener('change', e => { coachView = e.target.checked; store.set('coach', coachView); paintStatic() });
  $('#certBtn').addEventListener('click', certificate);
  document.addEventListener('keydown', e => {
    if (mode !== 'watch' || /input|textarea/i.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight') $('#nextBtn').click(); if (e.key === 'ArrowLeft') $('#prevBtn').click();
  });
  const smi = store.get('mi', null);
  mi = smi == null ? Math.max(0, MODS.findIndex((m, k) => !modDone(k))) : Math.min(smi, MODS.length - 1); if (!modOpen(mi)) mi = 0; M = MODS[mi];
  const saved = store.get(lkey(), null); li = saved == null ? Math.max(0, M.lessons.findIndex(l => (progress[l.id] || 0) < PASS)) : Math.min(saved, M.lessons.length - 1); if (!unlocked(li)) li = 0;
  { const qp = new URLSearchParams(location.search), qm = qp.get('m'), ql = qp.get('l');
    if (qm != null && MODS[+qm] && modOpen(+qm)) { mi = +qm; M = MODS[mi]; li = 0; if (!unlocked(0)) li = 0; if (ql != null && M.lessons[+ql] && unlocked(+ql)) li = +ql; else li = Math.max(0, M.lessons.findIndex(l => (progress[l.id] || 0) < PASS)); if (!unlocked(li)) li = 0; store.set('mi', mi); store.set(lkey(), li) } }
  renderWatch(false);
  window.addEventListener('pq-reload', () => { progress = store.get('progress', {}); xp = store.get('xp', 0); paintStatic() });
  window.PQ_LEARN = { openLesson, switchModule, board, get state() { return { mi, li, si, mode, ti, score } } };
})();
