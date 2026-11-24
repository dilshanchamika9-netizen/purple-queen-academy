
(() => {
  const WA = '94771691435';
  const TZ = 'Asia/Colombo';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const waLink = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  $$('[data-wa]').forEach(a => { a.href = waLink(a.dataset.wa) });
  $('#yr').textContent = new Date().getFullYear();

  // header
  const hdr = $('#hdr'), menuBtn = $('#menuBtn');
  addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 10), { passive:true });
  menuBtn.addEventListener('click', () => { const o = hdr.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', o) });
  $$('#nav a').forEach(a => a.addEventListener('click', () => { hdr.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false) }));

  // portal dialog
  const dlg = $('#portalDlg');
  if (dlg) {
    $$('[data-portal]').forEach(b => b.addEventListener('click', () => dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', '')));
    $('#dlgX').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close() });
  }
  $$('dialog').forEach(d => { const x = d.querySelector('.x'); if (x && d.id !== 'portalDlg') x.addEventListener('click', () => d.close()); d.addEventListener('click', e => { if (e.target === d) d.close() }) });

  // copy
  $$('.copy').forEach(b => b.addEventListener('click', async () => {
    const el = document.getElementById(b.dataset.copy), txt = el.textContent.trim();
    const ok = () => { b.textContent = 'Copied'; b.classList.add('done'); setTimeout(() => { b.textContent = 'Copy'; b.classList.remove('done') }, 1600) };
    try { await navigator.clipboard.writeText(txt); ok() }
    catch { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = 'Selected' ; setTimeout(() => b.textContent = 'Copy', 1600) }
  }));

  // ---------- time helpers (academy time, Asia/Colombo) ----------
  const nowParts = () => {
    const f = new Intl.DateTimeFormat('en-GB', { timeZone:TZ, weekday:'short', hour:'2-digit', minute:'2-digit', hour12:false });
    const p = Object.fromEntries(f.formatToParts(new Date()).map(x => [x.type, x.value]));
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return { dow:days.indexOf(p.weekday), mins:(+p.hour % 24) * 60 + +p.minute };
  };
  const fmt = (m) => { const h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? 'PM' : 'AM'; return `${((h + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${ap}` };

  // ---------- schedule ----------
  const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const T = (h, m = 0) => h * 60 + m;
  // dow: 1=Mon … 6=Sat, 0=Sun
  const CLASSES = [
    { dow:1, start:T(16), end:T(17,30), level:'Basic', mode:'physical', coach:'Junior Coach', seats:4, cap:12 },
    { dow:1, start:T(18,30), end:T(20), level:'Intermediate', mode:'online', coach:'Senior Coach', seats:3, cap:10 },
    { dow:2, start:T(16), end:T(17,30), level:'Basic', mode:'online', coach:'Junior Coach', seats:6, cap:12 },
    { dow:2, start:T(18,30), end:T(20), level:'Advanced', mode:'online', coach:'Head Coach', seats:2, cap:8 },
    { dow:3, start:T(17), end:T(18,30), level:'Intermediate', mode:'physical', coach:'Senior Coach', seats:5, cap:10 },
    { dow:4, start:T(16), end:T(17,30), level:'Basic', mode:'physical', coach:'Junior Coach', seats:7, cap:12 },
    { dow:4, start:T(19), end:T(20,30), level:'Advanced', mode:'online', coach:'Head Coach', seats:1, cap:8 },
    { dow:5, start:T(18,30), end:T(20), level:'Tournament practice', mode:'online', coach:'Head Coach', seats:8, cap:16, note:'All levels · rapid games with arbiter review' },
    { dow:6, start:T(8,30), end:T(10), level:'Basic', mode:'physical', coach:'Junior Coach', seats:2, cap:12 },
    { dow:6, start:T(10,30), end:T(12), level:'Intermediate', mode:'physical', coach:'Senior Coach', seats:0, cap:10 },
    { dow:6, start:T(14), end:T(15,30), level:'Advanced', mode:'physical', coach:'Head Coach', seats:3, cap:8 },
    { dow:0, start:T(9), end:T(10,30), level:'Open games & analysis', mode:'online', coach:'Senior Coach', seats:10, cap:20, note:'All levels · bring your tournament games' },
  ];
  const DOW_ORDER = [1,2,3,4,5,6,0];
  const NOTE = { 'Basic':'Level 1 · beginners', 'Intermediate':'Level 2 · rules known', 'Advanced':'Level 3 · competitive' };
  let curDay = nowParts().dow, curMode = 'all';
  const tabs = $('#dayTabs');
  if (tabs) {
  tabs.innerHTML = DOW_ORDER.map(d => { const n = CLASSES.filter(c => c.dow === d).length;
    return `<button class="tab" role="tab" type="button" data-d="${d}" aria-selected="${d === curDay}">${DAYS[(d + 6) % 7].slice(0, 3)}<small>${n} ${n === 1 ? 'class' : 'classes'}</small></button>` }).join('');
  tabs.addEventListener('click', e => { const b = e.target.closest('.tab'); if (!b) return; curDay = +b.dataset.d; $$('.tab', tabs).forEach(t => t.setAttribute('aria-selected', t === b)); renderSlots() });
  $('#modeSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; curMode = b.dataset.mode; $$('#modeSeg button').forEach(x => x.setAttribute('aria-pressed', x === b)); renderSlots() });
  const modeHTML = m => m === 'online' ? '<span class="mode online"><svg><use href="#i-online"/></svg>Online</span>' : '<span class="mode physical"><svg><use href="#i-pin"/></svg>Physical · Gampaha</span>';
  function renderSlots() {
    const list = CLASSES.filter(c => c.dow === curDay && (curMode === 'all' || c.mode === curMode)).sort((a, b) => a.start - b.start);
    const dayName = DAYS[(curDay + 6) % 7];
    $('#slots').innerHTML = list.length ? list.map((c, i) => {
      const pct = Math.round((c.cap - c.seats) / c.cap * 100);
      const cls = c.seats === 0 ? 'none' : c.seats <= 3 ? 'low' : '';
      const seatTxt = c.seats === 0 ? '<b>Full</b> · waiting list open' : `<b>${c.seats} ${c.seats === 1 ? 'seat' : 'seats'} left</b> of ${c.cap}`;
      const msg = `Hello Purple Queen Chess Academy! I would like to ${c.seats === 0 ? 'join the waiting list for' : 'book'} the ${c.level} class (${c.mode}) on ${dayName} at ${fmt(c.start)}.`;
      return `<div class="slot" style="animation-delay:${i * 60}ms"><div class="time">${fmt(c.start)}<span>to ${fmt(c.end)}</span></div>
        <div class="what"><b>${c.level}</b><span>${c.note || NOTE[c.level]}</span></div>
        <div class="mode-w">${modeHTML(c.mode)}</div>
        <div class="seats ${cls}">${seatTxt}<div class="bar"><i style="width:${pct}%"></i></div></div>
        <a class="btn ${c.seats === 0 ? 'btn-ghost' : 'btn-primary'} btn-sm" href="${waLink(msg)}" target="_blank" rel="noopener">${c.seats === 0 ? 'Waiting list' : 'Book'}</a></div>` }).join('')
      : `<div class="empty">No ${curMode === 'all' ? '' : curMode + ' '}classes on ${dayName}. Try another day${curMode === 'all' ? '' : ' or show all formats'}.</div>`;
  }
  renderSlots();
  }

  // next class (hero card)
  (function nextClass() {
    if (!$('#nextClassName')) return;
    const { dow, mins } = nowParts();
    let best = null;
    for (let add = 0; add < 8 && !best; add++) {
      const d = (dow + add) % 7;
      const opts = CLASSES.filter(c => c.dow === d && c.seats > 0 && (add > 0 || c.start > mins)).sort((a, b) => a.start - b.start);
      if (opts.length) best = { c:opts[0], add };
    }
    if (!best) return;
    const { c, add } = best;
    const when = add === 0 ? 'Today' : add === 1 ? 'Tomorrow' : DAYS[(c.dow + 6) % 7];
    $('#nextClassName').textContent = `${c.level} · ${c.mode === 'online' ? 'Online' : 'Physical'}`;
    $('#nextClassMeta').innerHTML = `<span class="dot"></span>${when} ${fmt(c.start)} · ${c.seats} ${c.seats === 1 ? 'seat' : 'seats'} left`;
  })();

  // ---------- tournaments ----------
  const TOURS = [
    { name:'Purple Queen Rapid Open', short:'Rapid Open', date:'2026-12-14T08:30:00+05:30', venue:'Gampaha', format:'Swiss · 7 rounds', tc:'15 min + 10 s', cats:'Open · U8 · U10 · U12 · U14 · U16', blurb:'Our flagship open event for all ages, with age-group prizes and arbiter-run pairings.' },
    { name:'Junior Christmas Blitz', short:'Christmas Blitz', date:'2026-12-27T15:00:00+05:30', venue:'Online', format:'Arena · 90 min', tc:'3 min + 2 s', cats:'U10 · U14', blurb:'' },
    { name:'Inter-School Team Championship', short:'School Teams', date:'2027-01-24T08:00:00+05:30', venue:'Gampaha', format:'Teams of 4 · 6 rounds', tc:'25 min + 5 s', cats:'U13 · U17', blurb:'' },
  ];
  const upcoming = TOURS.filter(t => new Date(t.date) > new Date());
  const MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const dParts = iso => { const d = new Date(iso); const f = new Intl.DateTimeFormat('en-GB', { timeZone:TZ, day:'numeric', month:'numeric', weekday:'long', year:'numeric', hour:'numeric', minute:'2-digit', hour12:true }); const p = Object.fromEntries(f.formatToParts(d).map(x => [x.type, x.value])); return { day:p.day, mon:MON[+p.month - 1], wd:p.weekday, yr:p.year, time:`${p.hour}:${p.minute} ${(p.dayPeriod || '').toUpperCase()}` } };
  const ft = upcoming[0];
  if (ft && $('#featuredT')) {
    const p = dParts(ft.date);
    $('#featuredT').innerHTML = `<span class="k">Next tournament · ${p.wd} ${p.day} ${p.mon} ${p.yr}</span><h3>${ft.name}</h3><p>${ft.blurb}</p>
      <div class="tmeta"><div><span>Venue</span>${ft.venue}</div><div><span>Format</span>${ft.format}</div><div><span>Time control</span>${ft.tc}</div><div style="grid-column:1/-1"><span>Categories</span>${ft.cats}</div></div>
      <div class="big-cd" id="bigCd"></div>
      <a class="btn btn-primary" href="${waLink(`Hello! I would like to register for the ${ft.name} on ${p.day} ${p.mon} ${p.yr}. Player name: , Age: , Rating (if any): `)}" target="_blank" rel="noopener">Register on WhatsApp<svg><use href="#i-arrow"/></svg></a>`;
  } else if ($('#featuredT')) {
    $('#featuredT').innerHTML = `<span class="k">Tournaments</span><h3>New dates coming soon</h3><p>Follow the academy on Facebook to hear about the next event first.</p>`;
  }
  if ($('#nextTourName')) { if (ft) $('#nextTourName').textContent = ft.short; else $('.float.f2').hidden = true }
  const tl = $('#tlist');
  if (tl) tl.insertAdjacentHTML('afterbegin', upcoming.slice(1).map(t => { const p = dParts(t.date);
    return `<a class="titem rv" style="text-decoration:none" href="${waLink(`Hello! I would like to register for the ${t.name} on ${p.day} ${p.mon} ${p.yr}.`)}" target="_blank" rel="noopener"><div class="date"><b>${p.day}</b><span>${p.mon}</span></div><div><h4>${t.name}</h4><p>${t.venue} · ${t.tc} · ${t.cats}</p></div><span class="in" data-until="${t.date}"></span></a>` }).join(''));

  function tick() {
    const now = Date.now();
    if (ft) {
      let s = Math.max(0, Math.floor((new Date(ft.date) - now) / 1000));
      const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
      const big = $('#bigCd'); if (big) big.innerHTML = [[d,'Days'],[h,'Hours'],[m,'Mins'],[sec,'Secs']].map(([v,l]) => `<div><b>${String(v).padStart(2,'0')}</b><span>${l}</span></div>`).join('');
      if ($('#heroCd')) $('#heroCd').innerHTML = [[d,'days'],[h,'hrs'],[m,'min']].map(([v,l]) => `<span>${v}<i>${l}</i></span>`).join('');
    }
    $$('[data-until]').forEach(e => { const dd = Math.ceil((new Date(e.dataset.until) - now) / 86400000); e.textContent = dd <= 0 ? 'Today' : dd === 1 ? 'Tomorrow' : `In ${dd} days` });
  }
  tick(); setInterval(tick, 1000);

  // ---------- school form ----------
  if ($('#schoolForm')) $('#schoolForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, done = $('#formDone');
    const req = ['sf-school', 'sf-name'].map(id => document.getElementById(id));
    const miss = req.filter(i => !i.value.trim());
    req.forEach(i => i.style.borderColor = i.value.trim() ? '' : 'var(--full)');
    if (miss.length) { done.className = 'form-done show'; done.textContent = 'Add the school name and a contact person, then try again.'; miss[0].focus(); return }
    const v = id => document.getElementById(id).value.trim();
    const msg = `Hello Purple Queen Chess Academy! We would like a chess programme for our school.\nSchool: ${v('sf-school')}\nContact: ${v('sf-name')}\nGrades: ${v('sf-grades')}\nStudents: ${v('sf-count') || 'not sure yet'}\n${v('sf-note') ? 'Notes: ' + v('sf-note') : ''}`;
    done.className = 'form-done show';
    done.innerHTML = `Your message is ready. <a class="btn btn-primary btn-sm" style="margin-top:10px" href="${waLink(msg)}" target="_blank" rel="noopener">Open WhatsApp to send</a>`;
  });

  // ---------- 3D board + knight tour ----------
  const grid = $('#bgrid');
  if (grid) {
  const N = 8, cells = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const s = document.createElement('div'); s.className = 'sq ' + ((r + c) % 2 ? 'd' : 'l');
    s.style.left = c * 12.5 + '%'; s.style.top = r * 12.5 + '%'; s.innerHTML = '<div class="glow"></div>';
    grid.appendChild(s); cells.push(s);
  }
  const place = (el, r, c) => { el.style.left = c * 12.5 + '%'; el.style.top = r * 12.5 + '%' };
  const mk = (cls, html, r, c) => { const p = document.createElement('div'); p.className = 'piece ' + cls; p.innerHTML = '<div class="shadow"></div><div class="stand">' + html + '</div>'; place(p, r, c); grid.appendChild(p); return p };
  mk('queen', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="92 76 150 180"><g><path d="M165.27,128.13L162.93,128.64L161.42,129.03L159.22,129.70L157.81,130.20L155.78,131.04L154.48,131.66L153.23,132.32L152.04,133.04L150.35,134.20L149.30,135.04L148.31,135.93L147.38,136.87L146.52,137.86L146.11,138.37L145.35,139.44L145.00,140.00L144.27,140.95L143.58,141.93L142.71,143.27L142.11,144.32L141.37,145.78L140.87,146.92L140.26,148.50L139.86,149.74L139.50,151.04L139.18,152.38L138.76,154.75L138.46,157.28L138.35,158.89L138.00,166.15L137.84,168.56L155.31,190.89L155.94,187.92L156.65,184.90L157.39,182.08L158.00,180.00L159.79,176.44L161.01,173.91L162.00,171.75L162.91,169.56L163.56,167.82L164.11,166.09L164.55,164.39L164.86,162.74L165.00,161.15L165.00,160.00L164.88,159.06L164.66,157.81L164.38,156.55L163.96,154.96L162.47,150.04L161.88,147.98L161.36,145.84L161.00,144.00L161.06,143.04L161.24,142.17L161.54,141.38L161.94,140.67L162.45,140.04L162.75,139.76L163.23,139.38L163.58,139.15L164.15,138.84L164.56,138.67L165.20,138.44L166.38,138.17L167.67,138.02L168.99,138.01L170.18,138.12L171.30,138.36L172.35,138.71L173.32,139.16L174.21,139.72L175.02,140.37L175.74,141.11L176.37,141.92L176.70,142.45L177.00,143.00L177.52,142.10L178.00,141.42L178.68,140.66L179.29,140.10L180.13,139.49L180.87,139.06L181.85,138.63L182.70,138.36L183.82,138.12L184.76,138.02L186.05,138.01L187.11,138.09L188.34,138.32L189.23,138.59L190.05,138.94L190.77,139.38L191.40,139.90L191.81,140.34L192.17,140.84L192.46,141.38L192.69,141.96L192.86,142.59L192.97,143.27L193.00,144.00L192.64,145.84L192.21,147.63L191.63,149.70L189.95,155.28L189.54,156.87L189.22,158.44L189.00,160.00L189.00,161.15L189.14,162.74L189.45,164.39L189.77,165.66L190.29,167.38L190.92,169.13L191.62,170.87L192.39,172.62L193.39,174.76L196.00,180.00L196.46,181.55L197.06,183.74L197.64,186.08L198.20,188.55L198.73,191.13L199.38,194.50L199.98,198.00L200.67,202.33L201.31,206.76L202.10,212.62L202.33,213.84L202.59,215.03L203.22,217.32L203.77,218.95L204.36,220.53L205.01,222.04L205.68,223.49L206.38,224.88L207.32,226.64L210.24,231.68L211.17,233.36L211.50,234.00L211.60,234.37L211.67,234.93L211.63,235.49L211.50,236.03L211.28,236.56L210.83,237.24L210.23,237.88L209.68,238.33L209.05,238.75L208.35,239.14L207.29,239.59L206.10,239.97L205.13,240.20L204.45,240.32L203.00,240.50L200.33,241.19L198.08,241.85L196.61,242.35L195.24,242.88L193.98,243.46L193.00,244.00L193.00,247.50L197.74,245.97L202.22,244.65L206.28,243.57L210.50,242.59L213.38,242.00L215.57,241.62L217.79,241.27L220.01,240.98L222.25,240.75L223.75,240.63L225.25,240.54L228.13,240.42L229.35,240.31L230.51,240.15L232.30,239.80L233.87,239.36L235.18,238.86L235.63,238.64L236.20,238.31L236.66,237.98L236.90,237.76L237.08,237.54L237.19,237.32L237.25,237.10L237.23,236.89L237.15,236.69L237.00,236.50L234.57,235.50L232.18,234.36L230.94,233.71L229.69,233.01L227.52,231.65L225.72,230.37L224.87,229.68L224.04,228.98L222.63,227.62L221.89,226.84L220.81,225.62L219.44,223.90L218.14,222.08L216.94,220.20L215.83,218.24L214.85,216.25L213.99,214.21L213.26,212.16L212.82,210.61L212.47,209.06L212.28,208.04L212.14,207.02L212.05,206.00L212.00,205.00L212.00,203.47L212.05,201.87L212.17,200.23L212.34,198.55L212.55,196.83L212.81,195.10L213.21,192.78L214.02,188.76L215.06,184.36L215.72,181.80L216.50,179.00L217.13,179.02L217.60,179.00L218.23,178.91L218.69,178.81L219.28,178.61L219.69,178.43L220.09,178.20L220.45,177.94L220.78,177.64L221.07,177.30L221.32,176.92L221.53,176.50L221.67,176.04L221.74,175.71L221.80,175.19L221.80,174.78L221.68,173.97L221.44,173.23L221.27,172.89L220.97,172.41L220.37,171.69L219.67,171.06L218.76,170.42L217.83,169.87L216.20,169.00L216.01,166.33L215.58,157.81L215.31,155.24L214.91,152.84L214.61,151.48L214.27,150.17L213.88,148.91L213.29,147.30L212.80,146.15L212.27,145.04L211.69,143.97L210.86,142.59L209.97,141.27L209.00,140.00L208.28,138.90L207.48,137.86L207.06,137.35L206.16,136.39L205.20,135.48L204.18,134.61L203.10,133.80L201.96,133.04L200.77,132.32L199.52,131.66L198.22,131.04L196.88,130.47L195.49,129.94L194.05,129.46L192.58,129.03L191.07,128.64L189.52,128.29L187.13,127.85L185.50,127.61L183.85,127.41L182.17,127.25L179.61,127.08L177.00,127.00L174.39,127.08L172.68,127.18L170.15,127.41L168.50,127.61L166.87,127.85ZM140.17,167.99L139.91,168.00L139.59,167.91L139.37,167.78L139.19,167.59L139.04,167.29L139.00,167.04L139.03,166.78L139.12,166.53L141.24,163.44L143.42,160.10L145.64,156.50L147.76,152.85L149.24,150.16L150.59,147.59L151.58,145.16L152.40,143.29L153.16,141.71L153.99,140.21L154.67,139.12L155.41,138.05L156.23,137.00L157.13,135.98L157.97,135.11L158.90,134.27L159.93,133.46L160.82,132.84L162.03,132.10L163.07,131.55L164.18,131.02L165.34,130.55L166.57,130.12L167.86,129.74L169.22,129.40L170.63,129.12L172.13,128.90L173.68,128.74L175.30,128.63L176.57,128.60L177.86,128.61L179.52,128.68L181.10,128.81L182.62,129.00L183.73,129.19L185.14,129.48L186.47,129.83L187.76,130.23L188.96,130.67L190.12,131.16L191.20,131.68L192.45,132.38L193.41,132.99L194.48,133.77L195.30,134.44L196.21,135.30L197.33,136.49L198.33,137.70L199.22,138.94L200.01,140.21L200.84,141.71L201.60,143.29L202.42,145.16L203.41,147.59L204.50,149.68L205.92,152.28L207.80,155.55L209.75,158.77L212.31,162.77L214.85,166.47L214.96,166.71L215.00,166.97L214.97,167.23L214.88,167.47L214.73,167.69L214.53,167.85L214.29,167.96L213.96,168.00L213.71,167.96L213.47,167.85L213.19,167.58L211.10,164.56L209.10,161.51L207.23,158.50L205.35,155.32L203.56,152.15L201.61,148.45L200.58,145.93L199.79,144.12L199.06,142.63L198.29,141.23L197.45,139.89L196.62,138.76L195.55,137.50L194.48,136.40L193.63,135.65L192.88,135.06L191.86,134.37L190.98,133.83L190.03,133.33L189.03,132.86L187.96,132.42L186.82,132.02L185.62,131.67L184.36,131.36L183.02,131.09L181.98,130.93L180.53,130.76L179.39,130.67L177.81,130.61L176.59,130.60L175.39,130.63L173.85,130.73L172.74,130.84L171.32,131.04L170.30,131.22L169.00,131.51L167.77,131.84L166.60,132.22L165.50,132.64L164.46,133.09L163.49,133.58L162.36,134.23L161.52,134.78L160.56,135.50L159.85,136.10L159.05,136.86L158.03,137.97L157.14,139.08L156.33,140.22L155.51,141.57L154.84,142.81L154.21,144.12L153.42,145.93L152.43,148.37L151.88,149.47L150.73,151.62L149.50,153.83L148.11,156.25L146.77,158.50L144.25,162.52L141.75,166.25L140.73,167.68L140.47,167.88ZM159.80,149.93L159.97,149.77L160.18,149.66L160.46,149.60L160.70,149.62L160.92,149.70L161.11,149.84L161.26,150.02L161.36,150.23L161.40,150.46L161.39,150.64L161.18,151.87L160.87,153.35L160.51,154.79L160.10,156.18L159.64,157.51L159.14,158.80L158.61,160.04L158.03,161.23L157.42,162.38L156.65,163.70L155.99,164.75L155.29,165.76L154.36,167.03L153.72,167.86L153.04,168.66L152.20,169.58L151.47,170.32L150.59,171.15L149.67,171.95L148.60,172.80L147.52,173.56L146.46,174.23L145.70,174.65L145.24,174.87L144.89,174.89L144.66,174.84L144.51,174.75L144.26,174.51L144.15,174.30L144.11,174.13L144.10,173.95L144.14,173.72L144.32,173.41L144.54,173.23L145.27,172.84L146.10,172.34L147.38,171.46L148.81,170.32L150.21,169.03L151.43,167.76L152.56,166.41L153.96,164.53L155.12,162.76L155.97,161.29L156.65,159.97L157.38,158.35L157.95,156.90L158.46,155.37L158.84,154.05L159.30,152.11L159.62,150.30L159.68,150.13ZM194.89,152.95L195.23,154.32L195.70,155.89L196.14,157.15L196.72,158.59L197.35,159.97L198.03,161.29L198.76,162.55L199.65,163.95L200.96,165.79L201.93,167.02L202.97,168.20L204.20,169.43L205.48,170.56L206.76,171.57L207.90,172.34L208.73,172.84L209.46,173.23L209.68,173.41L209.86,173.72L209.90,173.95L209.89,174.13L209.85,174.30L209.74,174.51L209.49,174.75L209.17,174.88L208.82,174.88L208.59,174.80L207.84,174.40L206.93,173.86L205.86,173.13L204.93,172.44L203.87,171.56L202.97,170.74L202.23,170.03L200.82,168.50L199.64,167.03L198.15,164.95L196.95,163.04L195.85,160.99L195.29,159.80L194.86,158.80L194.08,156.72L193.57,155.08L193.20,153.65L192.88,152.17L192.61,150.64L192.60,150.41L192.68,150.12L192.85,149.88L193.08,149.70L193.42,149.60L193.77,149.64L194.08,149.81L194.30,150.08L194.38,150.30L194.59,151.54ZM134.04,178.28L134.72,178.61L135.62,178.88L136.55,179.01L137.50,179.00L138.28,181.80L139.07,184.89L139.73,187.63L140.34,190.47L141.00,193.94L141.52,197.41L141.83,200.23L141.99,202.94L142.00,205.00L141.95,206.00L141.86,207.02L141.72,208.04L141.53,209.06L141.31,210.09L140.89,211.64L140.21,213.70L139.38,215.74L138.42,217.75L137.35,219.71L136.17,221.62L134.90,223.45L133.54,225.20L132.47,226.44L131.74,227.23L130.49,228.49L129.41,229.45L127.98,230.59L126.48,231.65L124.31,233.01L123.06,233.71L121.82,234.36L119.43,235.50L117.00,236.50L116.85,236.69L116.77,236.89L116.75,237.10L116.81,237.32L117.01,237.65L117.34,237.98L117.80,238.31L118.37,238.64L119.06,238.96L119.85,239.26L120.73,239.54L121.70,239.80L123.49,240.15L125.05,240.35L126.28,240.45L128.00,240.50L130.25,240.63L131.75,240.75L133.99,240.98L137.69,241.50L141.34,242.14L143.50,242.59L145.62,243.06L147.72,243.57L150.44,244.28L153.09,245.02L155.64,245.78L161.00,247.50L161.00,244.00L160.02,243.46L158.76,242.88L157.39,242.35L155.70,241.79L153.67,241.19L151.00,240.50L149.55,240.32L148.22,240.05L147.29,239.79L146.17,239.38L145.65,239.14L144.95,238.75L144.32,238.33L143.77,237.88L143.30,237.41L142.93,236.91L142.64,236.39L142.50,236.03L142.37,235.49L142.33,234.93L142.40,234.37L142.50,234.00L143.56,232.03L146.68,226.64L148.09,223.96L148.99,222.04L149.64,220.53L150.23,218.95L150.78,217.32L151.41,215.03L151.67,213.84L151.90,212.62L153.00,204.54L153.93,198.53L137.78,177.89L138.38,177.57L138.88,177.20L160.24,204.49L160.54,204.78L160.81,204.94L161.10,205.05L161.48,205.10L161.10,205.42L160.90,205.76L160.85,206.14L160.95,206.52L163.92,210.40L164.26,210.60L164.58,210.65L164.90,210.60L165.19,210.45L168.86,207.63L169.05,207.36L169.13,207.12L169.15,206.86L169.08,206.54L168.95,206.31L166.22,202.74L166.03,202.55L165.81,202.42L165.55,202.35L165.36,202.35L165.10,202.40L164.92,202.48L163.05,203.90L163.10,203.59L163.07,203.17L162.97,202.87L162.76,202.51L140.18,173.66L140.08,172.98L139.88,172.35L139.59,171.76L139.31,171.35L138.87,170.88L138.47,170.57L137.87,170.25L137.38,170.08L117.64,144.88L117.85,143.14L118.48,139.24L118.71,137.48L118.85,135.70L118.86,134.22L118.79,133.31L118.67,132.46L118.54,131.84L118.31,131.03L118.09,130.42L117.72,129.65L117.41,129.12L117.05,128.61L116.34,127.78L115.90,127.37L115.39,126.97L114.54,126.45L114.06,126.24L113.50,126.05L112.59,125.87L112.03,125.84L111.47,125.86L110.99,125.92L110.46,126.04L109.95,126.21L109.45,126.42L108.70,126.84L107.89,127.45L107.28,128.06L106.65,128.88L106.21,129.63L105.88,130.40L105.64,131.21L105.48,132.25L104.44,132.13L103.60,132.15L102.72,132.27L101.72,132.56L101.22,132.76L100.73,133.00L100.00,133.46L99.22,134.11L98.65,134.75L98.19,135.42L97.83,136.16L97.57,136.95L97.43,137.71L97.41,138.58L97.48,139.24L97.69,140.13L98.02,140.96L98.36,141.60L98.94,142.46L99.51,143.12L100.18,143.74L100.91,144.28L101.67,144.74L102.47,145.14L103.29,145.47L104.14,145.75L105.00,145.98L106.76,146.33L108.53,146.59L113.53,147.14L114.73,147.34L115.68,147.55L133.74,170.62L133.33,170.95L133.02,171.28L132.66,171.80L132.43,172.25L132.25,172.74L132.11,173.28L132.03,173.87L132.00,174.50L132.50,177.00L132.73,177.35L133.03,177.65ZM108.33,133.58L108.26,132.86L108.31,132.16L108.47,131.50L108.72,130.87L109.07,130.29L109.61,129.67L110.10,129.27L110.77,128.89L111.46,128.68L112.02,128.64L112.58,128.70L113.16,128.89L113.75,129.24L114.20,129.61L114.66,130.10L115.15,130.79L115.34,131.14L115.58,131.70L115.87,132.72L116.03,133.85L116.06,135.32L115.98,136.63L115.83,137.99L115.08,142.73L114.86,144.51L113.09,144.26L109.42,143.87L107.76,143.66L106.18,143.38L104.72,142.99L104.04,142.76L103.41,142.49L102.84,142.19L102.31,141.85L101.83,141.47L101.41,141.05L101.00,140.54L100.76,140.15L100.48,139.61L100.27,138.93L100.20,138.46L100.23,137.88L100.37,137.34L100.61,136.83L100.96,136.35L101.40,135.92L102.06,135.47L102.66,135.20L103.30,135.01L103.98,134.93L104.66,134.95L105.35,135.09L105.85,135.27L106.54,135.62L106.80,135.70L107.17,135.72L107.52,135.65L107.77,135.54L107.99,135.38L108.23,135.11L108.36,134.87L108.44,134.61L108.47,134.33L108.45,134.06ZM162.22,103.78L162.35,103.87L162.50,103.90L191.50,103.90L191.70,103.85L191.85,103.70L191.90,103.50L191.90,87.50L191.85,87.30L191.73,87.17L191.56,87.10L191.38,87.12L191.23,87.21L185.07,93.84L177.34,80.80L177.26,80.70L177.15,80.63L177.03,80.60L176.90,80.61L176.76,80.68L176.66,80.80L168.93,93.84L162.77,87.21L162.67,87.14L162.54,87.10L162.42,87.11L162.30,87.16L162.15,87.30L162.10,87.50L162.10,103.50L162.13,103.65ZM164.06,111.46L164.09,113.44L164.22,114.90L164.38,115.94L164.51,116.60L164.87,117.85L165.21,118.73L165.48,119.30L166.11,120.36L166.66,121.11L167.07,121.59L168.00,122.50L168.56,122.95L169.31,123.47L169.88,123.82L170.62,124.21L171.19,124.47L171.94,124.76L172.69,124.99L173.44,125.17L174.19,125.31L175.12,125.42L176.06,125.48L177.00,125.50L177.94,125.48L178.88,125.42L179.81,125.31L180.56,125.17L181.88,124.82L182.62,124.55L183.19,124.30L184.31,123.71L185.44,122.95L186.00,122.50L186.48,122.05L187.34,121.11L188.06,120.10L188.66,119.02L189.13,117.85L189.49,116.60L189.74,115.25L189.89,113.81L189.94,112.27L189.89,110.19L189.76,108.40L189.50,106.00L164.50,106.00L164.20,108.86L164.11,110.19ZM157.22,104.74L156.73,106.76L156.25,108.93L155.86,110.97L155.49,113.16L155.15,115.53L154.89,117.68L154.61,120.44L154.41,122.93L154.18,126.71L154.10,128.44L154.12,128.72L154.26,129.15L154.53,129.51L154.75,129.68L155.00,129.81L155.44,129.90L155.89,129.84L156.15,129.74L156.38,129.59L156.68,129.25L156.81,129.00L156.88,128.74L157.06,125.21L157.28,122.13L157.53,119.31L157.87,116.31L158.38,112.86L158.93,109.82L159.59,106.82L160.37,103.78L160.40,103.50L160.37,103.23L160.30,102.97L160.17,102.73L159.99,102.51L159.78,102.34L159.54,102.21L159.28,102.13L159.00,102.10L158.73,102.13L158.47,102.20L158.23,102.33L157.95,102.57L157.71,102.96ZM195.92,102.44L195.53,102.20L195.18,102.11L194.81,102.11L194.38,102.25L194.07,102.45L193.79,102.80L193.63,103.23L193.60,103.60L193.65,103.87L194.47,107.10L195.00,109.50L195.51,112.15L195.97,115.11L196.38,118.42L196.68,121.65L196.90,124.68L197.12,128.74L197.19,129.00L197.32,129.25L197.62,129.59L197.85,129.74L198.11,129.84L198.38,129.89L198.65,129.89L199.09,129.77L199.33,129.63L199.53,129.45L199.78,129.07L199.87,128.81L199.90,128.53L199.79,126.14L199.63,123.45L199.26,119.03L198.96,116.38L198.63,113.93L198.26,111.67L197.81,109.27L197.13,106.17L196.35,103.13L196.21,102.80ZM162.86,243.61L162.48,243.85L162.24,244.12L162.05,244.54L162.00,244.90L162.01,248.78L162.11,249.14L162.29,249.45L162.48,249.65L162.78,249.86L163.04,249.95L163.40,250.00L173.69,250.00L174.05,249.93L174.38,249.76L174.65,249.52L174.86,249.22L174.95,248.96L175.00,248.60L174.99,244.72L174.89,244.36L174.71,244.05L174.52,243.85L174.22,243.64L173.96,243.55L173.60,243.50L163.40,243.50L163.13,243.53ZM179.95,243.57L179.55,243.79L179.29,244.05L179.07,244.45L179.00,244.90L179.01,248.78L179.11,249.14L179.29,249.45L179.48,249.65L179.78,249.86L180.04,249.95L180.40,250.00L190.69,250.00L191.05,249.93L191.38,249.76L191.65,249.52L191.86,249.22L191.95,248.96L192.00,248.60L191.99,244.72L191.89,244.36L191.71,244.05L191.52,243.85L191.22,243.64L190.96,243.55L190.60,243.50L180.40,243.50Z" fill="#5B2C91" fill-rule="evenodd"/></g></svg>`, 3, 3);
  mk('ghost', '<img src="assets/pieces/wR.svg" alt="">', 0, 7); mk('ghost', '<img src="assets/pieces/wB.svg" alt="">', 1, 1); mk('ghost', '<img src="assets/pieces/wP.svg" alt="">', 6, 6);
  const knight = mk('knight', '<img src="assets/pieces/bN.svg" alt="">', 7, 1);
  // Warnsdorff tour avoiding occupied squares
  const blocked = new Set(['3,3', '0,7', '1,1', '6,6']);
  const K = [[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]];
  const ok = (r, c, seen) => r >= 0 && r < N && c >= 0 && c < N && !seen.has(r + ',' + c) && !blocked.has(r + ',' + c);
  function tour(r, c) {
    const seen = new Set([r + ',' + c]), path = [[r, c]];
    while (path.length < 60) {
      const nx = K.map(([a, b]) => [r + a, c + b]).filter(([a, b]) => ok(a, b, seen));
      if (!nx.length) break;
      nx.sort((p, q) => K.filter(([a, b]) => ok(p[0] + a, p[1] + b, seen)).length - K.filter(([a, b]) => ok(q[0] + a, q[1] + b, seen)).length);
      [r, c] = nx[0]; seen.add(r + ',' + c); path.push([r, c]);
    }
    return path;
  }
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let path = tour(7, 1), step = 0;
  if (!reduce) setInterval(() => {
    if (document.hidden) return;
    step++; if (step >= path.length) { path.forEach(([a, b]) => cells[a * N + b].classList.remove('trail')); path = tour(path[path.length - 1][0], path[path.length - 1][1]); step = 1; if (path.length < 2) { path = tour(7, 1); } }
    const [r, c] = path[step] || path[0];
    const cell = cells[r * N + c]; cell.classList.add('trail'); setTimeout(() => cell.classList.remove('trail'), 2600);
    knight.classList.remove('hop'); void knight.offsetWidth; knight.classList.add('hop'); place(knight, r, c);
  }, 1100);
  // gentle tilt with pointer
  const stage = $('#stage'), b3 = $('#board3d');
  if (!reduce && matchMedia('(pointer:fine)').matches) {
    stage.addEventListener('pointermove', e => { const r = stage.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      b3.style.transform = `rotateX(${58 - y * 10}deg) rotateZ(${-38 + x * 12}deg)` });
    stage.addEventListener('pointerleave', () => b3.style.transform = '');
  }

  }

  // ---------- puzzle: mate in one (Rd8#) ----------
  if ($('#pboard')) {
  const START = { g1:'wK', d1:'wR', f2:'wP', g2:'wP', h2:'wP', a3:'wP', g8:'bK', b2:'bQ', f7:'bP', g7:'bP', h7:'bP', a7:'bP' };
  const GLYPH = { K:'♚', Q:'♛', R:'♜', B:'♝', N:'♞', P:'♟' };
  const files = 'abcdefgh';
  let pos, sel = null, solved = false;
  const pb = $('#pboard'), pmsg = $('#pmsg');
  const say = (t, cls = '') => { pmsg.className = 'pmsg ' + cls; pmsg.textContent = t };
  // pseudo-legal moves for white (enough for this position)
  function moves(sq) {
    const pc = pos[sq]; if (!pc || pc[0] !== 'w') return [];
    const f = files.indexOf(sq[0]), r = +sq[1], out = [], t = pc[1];
    const at = (ff, rr) => (ff >= 0 && ff < 8 && rr >= 1 && rr <= 8) ? files[ff] + rr : null;
    const slide = dirs => dirs.forEach(([df, dr]) => { let ff = f + df, rr = r + dr, s; while ((s = at(ff, rr))) { if (pos[s]) { if (pos[s][0] === 'b') out.push(s); break } out.push(s); ff += df; rr += dr } });
    const jump = ds => ds.forEach(([df, dr]) => { const s = at(f + df, r + dr); if (s && (!pos[s] || pos[s][0] === 'b')) out.push(s) });
    if (t === 'R') slide([[1,0],[-1,0],[0,1],[0,-1]]);
    if (t === 'K') jump([[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]);
    if (t === 'P') { const s1 = at(f, r + 1); if (s1 && !pos[s1]) { out.push(s1); const s2 = at(f, r + 2); if (r === 2 && s2 && !pos[s2]) out.push(s2) } [[-1,1],[1,1]].forEach(([df, dr]) => { const s = at(f + df, r + dr); if (s && pos[s] && pos[s][0] === 'b') out.push(s) }) }
    // king may not step onto squares the black queen attacks (b2 queen)
    return out;
  }
  function drawBoard() {
    pb.innerHTML = '';
    for (let r = 8; r >= 1; r--) for (let f = 0; f < 8; f++) {
      const sq = files[f] + r, b = document.createElement('button');
      b.type = 'button'; b.className = 'cell ' + ((f + r) % 2 ? 'd' : 'l'); b.dataset.sq = sq;
      const pc = pos[sq];
      b.setAttribute('aria-label', sq + (pc ? ' ' + (pc[0] === 'w' ? 'white ' : 'black ') + ({K:'king',Q:'queen',R:'rook',B:'bishop',N:'knight',P:'pawn'})[pc[1]] : ''));
      b.innerHTML = (pc ? `<span class="${pc[0]}">${GLYPH[pc[1]]}&#xFE0E;</span>` : '') + (f === 0 ? `<span class="coord r">${r}</span>` : '') + (r === 1 ? `<span class="coord f">${files[f]}</span>` : '');
      if (sq === sel) b.classList.add('sel');
      if (sel && moves(sel).includes(sq)) b.classList.add('hint');
      if (solved && sq === 'g8') b.classList.add('mate');
      pb.appendChild(b);
    }
  }
  function reset() { pos = { ...START }; sel = null; solved = false; say('Look at Black\'s king. Where can it run?'); drawBoard() }
  pb.addEventListener('click', e => {
    const b = e.target.closest('.cell'); if (!b || solved) return;
    const sq = b.dataset.sq;
    if (sel && moves(sel).includes(sq)) {
      const from = sel; sel = null;
      if (from === 'd1' && sq === 'd8') { pos.d8 = pos.d1; delete pos.d1; solved = true; drawBoard(); say('Checkmate! Rd8#. The king is trapped behind its own pawns: a classic back-rank mate.', 'ok'); return }
      const keep = { ...pos }; pos[sq] = pos[from]; delete pos[from]; drawBoard();
      say('Not mate. Black has a way out. Try again.', 'err'); pb.classList.remove('shake'); void pb.offsetWidth; pb.classList.add('shake');
      setTimeout(() => { pos = keep; drawBoard() }, 700); return;
    }
    if (pos[sq] && pos[sq][0] === 'w') { sel = sel === sq ? null : sq; drawBoard(); return }
    sel = null; drawBoard();
  });
  $('#pReset').addEventListener('click', reset);
  $('#pHint').addEventListener('click', () => { if (solved) return; sel = 'd1'; drawBoard(); say('Your rook on d1 controls a whole file. Follow it to the end.') });
  reset();
  }
})();
