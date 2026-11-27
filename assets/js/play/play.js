// Purple Queen live play: lobby (challenge a classmate) and the live game screen.
import { F, auth, db, rt, isStudentEmail, sidOf, shortName, initials } from './fbplay.js';
import { LiveBoard, posOf } from './live.js';
const P = window.PQ_PlayCore, Chess = window.Chess;
const app = document.getElementById('playApp');
const R = (p) => F.dbRef(rt, p);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const TCS = [[3, 2, 'Blitz'], [5, 3, 'Blitz'], [10, 0, 'Rapid'], [10, 5, 'Rapid'], [15, 10, 'Rapid']];
const MSGS = ['👋 Hello', '🍀 Good luck', '🤝 Good game', '🙏 Thanks', '👍 Well played', '🔁 Rematch?'];
const NS = 180000, CH_LIFE = 5 * 60000;
const WHY = { mate: 'checkmate', resign: 'resignation', agree: 'agreement', time: 'time', noshow: 'no-show', abort: 'abort', stalemate: 'stalemate', repetition: 'threefold repetition', fifty: 'the 50-move rule', material: 'insufficient material', arbiter: 'arbiter decision' };

let me = null, isStaff = false, offset = 0;
const now = () => Date.now() + offset;
F.onValue(R('.info/serverTimeOffset'), s => { offset = s.val() || 0 });
const store = { get: (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v } catch { return d } }, set: (k, v) => { try { localStorage.setItem(k, v) } catch {} } };

// ---------- sounds (short tones, no files) ----------
let ac = null;
function tone(f, ms, vol = .08, type = 'sine') {
  if (store.get('pq-play-sound', '1') !== '1') return;
  try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f; g.gain.value = vol; o.connect(g); g.connect(ac.destination); const t = ac.currentTime; g.gain.exponentialRampToValueAtTime(.0001, t + ms / 1000); o.start(t); o.stop(t + ms / 1000) } catch {}
}
const SND = { move: () => tone(520, 90), cap: () => tone(300, 140, .1, 'triangle'), chk: () => { tone(760, 90); setTimeout(() => tone(980, 120), 90) }, low: () => tone(880, 120, .06, 'square'), end: () => { tone(523, 160); setTimeout(() => tone(659, 160), 150); setTimeout(() => tone(784, 260), 300) }, ping: () => tone(700, 120) };

// ---------- start ----------
F.onAuthStateChanged(auth, async (u) => {
  if (!u) { app.innerHTML = gate('Sign in to play', 'Live games are for Purple Queen students. Sign in with your Student ID to challenge a classmate.', '<a class="btn btn-primary" href="login.html?next=play.html">Student sign in</a>'); return }
  try { isStaff = (await F.dbGet(R('staff/' + u.uid))).val() === true } catch { isStaff = false }
  const gid = new URLSearchParams(location.search).get('g');
  if (!isStudentEmail(u.email)) {
    me = { uid: u.uid, short: 'Coach', name: 'Coach' };
    if (gid) return openGame(gid);
    app.innerHTML = gate('Coach view', isStaff ? 'Open a game link (play.html?g=…) to watch it live. Tournament boards will be listed here.' : 'Your coach access is being set up. Try again in a few minutes.', '<a class="btn btn-ghost" href="coach.html">Coach portal</a>');
    return;
  }
  let profile = {};
  try { const s = await F.getDoc(F.doc(db, 'users', u.uid)); profile = s.exists() ? s.data() : {} } catch {}
  me = { uid: u.uid, sid: sidOf(u.email), name: profile.name || sidOf(u.email).toUpperCase(), lvl: profile.level || '' };
  me.short = shortName(me.name);
  try { await F.updateDoc(F.doc(db, 'users', u.uid), { lastSeen: F.serverTimestamp(), onPage: 'Playing chess' }) } catch {}
  const dref = R('dir/' + me.sid);
  F.onValue(R('.info/connected'), async s => {
    if (s.val() !== true) return;
    // write the entry first: the database checks the offline update against the existing entry
    try { await F.dbSet(dref, { uid: me.uid, name: me.short, lvl: String(me.lvl || ''), on: true, st: (game && game.myCol && !game.result) ? 'game' : 'lobby', at: F.dbNow() }); await F.onDisconnect(dref).update({ on: false, at: F.dbNow() }) } catch (e) { console.warn('directory', e) }
  });
  listenIncoming();
  if (gid) openGame(gid); else hub();
});
const gate = (h, p, b) => `<div class="pv-gate"><div class="pv-seal">♛</div><h2>${h}</h2><p>${p}</p>${b}</div>`;
const setSt = (st) => { if (me && me.sid) F.dbUpdate(R('dir/' + me.sid), { st, at: F.dbNow() }).catch(() => {}) };

// ---------- lobby ----------
let people = {}, myGames = {}, pick = null, tcI = +store.get('pq-play-tc', 3), col = store.get('pq-play-col', 'r'), q = '', sent = null, sentOff = null, incoming = {};
let hubOn = false;
function hub() {
  hubOn = true; game = null; setSt('lobby');
  history.replaceState(null, '', location.pathname + (location.search.includes('emu') ? '?emu=1' : ''));
  app.innerHTML = `
  <section class="pv-hero"><div><h1>Play a classmate, live.</h1><p>Real clocks, real opponents. Every game is saved to your games list.</p></div>
    <div class="pv-kp"><div><b id="kpN">0</b><small>Games played</small></div><div><b id="kpWLD">0-0-0</b><small>Won · lost · drawn</small></div><div><b id="kpOn">0</b><small>Classmates online</small></div></div></section>
  <div class="pv-grid">
    <div class="pv-card">
      <h2>Challenge a classmate</h2>
      <input id="pvQ" class="pv-in" placeholder="Search by name or Student ID (PQ0007)" autocomplete="off">
      <div class="pv-lbl">Classmates</div><div id="pvPeople" class="pv-ppl"></div>
      <div class="pv-lbl">Time control</div>
      <div class="pv-tcs">${TCS.map((t, i) => `<button type="button" class="pv-tc${i === tcI ? ' on' : ''}" data-tc="${i}"><b>${t[0]}+${t[1]}</b><small>${t[2]}${i === 3 ? ' · default' : ''}</small></button>`).join('')}</div>
      <div class="pv-row2">
        <div><div class="pv-lbl">Colour</div><div class="pv-seg" id="pvCol">${[['r', 'Random'], ['w', '♔ White'], ['b', '♚ Black']].map(([k, t]) => `<button type="button" data-col="${k}" class="${k === col ? 'on' : ''}">${t}</button>`).join('')}</div></div>
        <div><div class="pv-lbl">Game type</div><div class="pv-seg"><button type="button" class="on">Friendly</button><button type="button" disabled title="Rated games start with the academy rating">Rated · soon</button></div></div>
      </div>
      <button type="button" class="btn btn-primary pv-wide" id="pvSend" disabled>Choose a classmate</button>
      <div id="pvSent"></div>
    </div>
    <div class="pv-col">
      <div id="pvInc"></div>
      <div class="pv-card"><h2>My recent games</h2><div id="pvGames"><p class="pv-mut">No games yet. Challenge a classmate to start.</p></div></div>
      <div class="pv-tourn"><span>🏆</span><div><b>Academy tournaments</b><small>Swiss events with your coach as arbiter · coming next</small></div></div>
    </div>
  </div>`;
  const qi = document.getElementById('pvQ'); qi.value = q; qi.oninput = () => { q = qi.value.trim().toLowerCase(); paintPeople() };
  app.querySelectorAll('[data-tc]').forEach(b => b.onclick = () => { tcI = +b.dataset.tc; store.set('pq-play-tc', tcI); app.querySelectorAll('[data-tc]').forEach(x => x.classList.toggle('on', x === b)); paintSend() });
  app.querySelectorAll('[data-col]').forEach(b => b.onclick = () => { col = b.dataset.col; store.set('pq-play-col', col); app.querySelectorAll('[data-col]').forEach(x => x.classList.toggle('on', x === b)); paintSend() });
  document.getElementById('pvSend').onclick = sendChallenge;
  if (!hub.listening) {
    hub.listening = true;
    F.onValue(R('dir'), s => { people = s.val() || {}; if (hubOn) { paintPeople(); paintStats() } });
    F.onValue(R('ug/' + me.uid), s => { myGames = s.val() || {}; if (hubOn) { paintGames(); paintStats() } });
  }
  paintPeople(); paintGames(); paintStats(); paintSent(); paintIncoming();
}
function paintStats() {
  const gs = Object.values(myGames).filter(g => g.r !== '*'); let w = 0, l = 0, d = 0;
  gs.forEach(g => { if (g.r === '1/2-1/2') d++; else if ((g.r === '1-0') === (g.col === 'w')) w++; else l++ });
  const set = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v };
  set('kpN', gs.length); set('kpWLD', `${w}-${l}-${d}`);
  set('kpOn', Object.entries(people).filter(([sid, p]) => sid !== me.sid && p.on).length);
}
function paintPeople() {
  const box = document.getElementById('pvPeople'); if (!box) return;
  const list = Object.entries(people).filter(([sid]) => sid !== me.sid)
    .filter(([sid, p]) => !q || sid.includes(q) || String(p.name || '').toLowerCase().includes(q))
    .sort((a, b) => (b[1].on - a[1].on) || String(a[1].name).localeCompare(String(b[1].name)));
  if (!list.length) { box.innerHTML = `<p class="pv-mut">${q ? 'No classmate matches “' + esc(q) + '”.' : 'No classmates have opened Play yet. They appear here when they do.'}</p>`; return }
  box.innerHTML = list.slice(0, 40).map(([sid, p]) => {
    const st = !p.on ? `<span class="dot off"></span> Last seen ${ago(p.at)}` : p.st === 'game' ? '<span class="dot busy"></span> In a game' : '<span class="dot"></span> Online';
    return `<button type="button" class="pv-pp${pick && pick.sid === sid ? ' sel' : ''}" data-sid="${esc(sid)}"><span class="av">${esc(initials(p.name))}</span><span><b>${esc(p.name)}</b><small>${st} · ${esc(sid.toUpperCase())}${p.lvl ? ' · Level ' + esc(p.lvl) : ''}</small></span></button>`;
  }).join('');
  box.querySelectorAll('[data-sid]').forEach(b => b.onclick = () => { pick = { sid: b.dataset.sid, ...people[b.dataset.sid] }; paintPeople(); paintSend() });
  if (pick && people[pick.sid]) pick = { sid: pick.sid, ...people[pick.sid] };
  paintSend();
}
function paintSend() {
  const b = document.getElementById('pvSend'); if (!b) return; const t = TCS[tcI];
  if (!pick) { b.disabled = true; b.textContent = 'Choose a classmate'; return }
  if (sent) { b.disabled = true; b.textContent = 'Waiting for your challenge to be answered'; return }
  if (!pick.on) { b.disabled = true; b.textContent = `${pick.name} is offline`; return }
  b.disabled = false; b.textContent = `♞ Challenge ${pick.name} · ${t[0]}+${t[1]} Friendly`;
}
const ago = (t) => { if (!t) return 'a while ago'; const m = Math.round((now() - t) / 60000); return m < 1 ? 'just now' : m < 60 ? m + ' min ago' : m < 1440 ? Math.round(m / 60) + ' h ago' : Math.round(m / 1440) + ' d ago' };

async function sendChallenge(to) {
  const target = to && to.uid ? to : pick; if (!target || sent) return;
  const t = to && to.tc ? to.tc : TCS[tcI], c = to && to.col ? to.col : col;
  const data = { name: me.short, sid: me.sid, base: t[0] * 60000, inc: t[1] * 1000, col: c, rated: false, at: F.dbNow() };
  try { await F.dbSet(R(`ch/${target.uid}/${me.uid}`), data) } catch (e) { toast('Could not send the challenge. Check your internet and try again.'); return }
  sent = { uid: target.uid, name: target.name, tc: `${t[0]}+${t[1]}`, at: now(), col: c };
  sentOff = F.onValue(R(`ch/${target.uid}/${me.uid}`), s => {
    const v = s.val();
    if (!sent) return;
    if (!v) { const n = sent.name; clearSent(); toast(`${n} declined the challenge.`); return }
    if (v.g) { const to = sent.uid; clearSent(); F.dbRemove(R(`ch/${to}/${me.uid}`)).catch(() => {}); openGame(v.g) }
  });
  paintSent(); paintSend();
}
function clearSent() { if (sentOff) sentOff(); sentOff = null; sent = null; paintSent(); paintSend() }
async function cancelSent() { if (!sent) return; const u = sent.uid; clearSent(); try { await F.dbRemove(R(`ch/${u}/${me.uid}`)) } catch {} }
function paintSent() {
  const box = document.getElementById('pvSent'); if (!box) return;
  if (!sent) { box.innerHTML = ''; return }
  const left = Math.max(0, CH_LIFE - (now() - sent.at));
  box.innerHTML = `<div class="pv-sent"><span class="pulse"></span><div><b>Waiting for ${esc(sent.name)}</b><small>${sent.tc} Friendly · expires in ${P.hms(left).slice(2)}</small></div><button type="button" class="btn btn-ghost" id="pvCancel">Cancel</button></div>`;
  document.getElementById('pvCancel').onclick = cancelSent;
}
setInterval(() => { if (sent && now() - sent.at > CH_LIFE) { cancelSent(); toast('Your challenge expired.') } else if (sent && hubOn) paintSent(); if (hubOn) paintIncoming() }, 1000);

function listenIncoming() {
  F.onValue(R('ch/' + me.uid), s => {
    const v = s.val() || {}; const before = Object.keys(incoming).length;
    incoming = Object.fromEntries(Object.entries(v).filter(([, c]) => !c.g));
    if (Object.keys(incoming).length > before) SND.ping();
    paintIncoming(); paintRematch();
  });
}
// a challenge from the opponent while the result screen is open = rematch request
function paintRematch() {
  const mb = document.querySelector('#pvOv .pv-mbtns'); if (!game || !game.result || !mb) return;
  const c = incoming[game.opp]; let row = document.getElementById('pvRem');
  if (!c || now() - c.at > CH_LIFE) { if (row) row.remove(); return }
  if (!row) { row = document.createElement('div'); row.id = 'pvRem'; row.className = 'pv-ban draw pv-rem'; mb.parentNode.insertBefore(row, mb) }
  const ov = document.getElementById('pvOv'); if (ov && ov.dataset.kind === 'res' && ov.hidden) { ov.hidden = false; SND.ping() }
  const you = c.col === 'w' ? 'you play Black' : c.col === 'b' ? 'you play White' : 'random colours';
  row.innerHTML = `<span>↻</span><span>${esc(c.name)} wants a rematch · ${c.base / 60000}+${c.inc / 1000} · ${you}</span><span class="sp"></span><button type="button" class="btn pv-ok" id="pvRemAcc">Accept</button>`;
  document.getElementById('pvRemAcc').onclick = () => { const from = game.opp; leave(); accept(from) };
}
function paintIncoming() {
  const box = document.getElementById('pvInc'); if (!box) return;
  const list = Object.entries(incoming).filter(([, c]) => c.at && now() - c.at < CH_LIFE);
  box.innerHTML = list.map(([from, c]) => {
    const you = c.col === 'w' ? 'You play Black' : c.col === 'b' ? 'You play White' : 'Colours: random';
    return `<div class="pv-inc"><div class="h"><span class="pulse"></span><b>New challenge</b><small>${ago(c.at)}</small></div>
      <div class="h"><span class="av">${esc(initials(c.name))}</span><div><b>${esc(c.name)}</b><small>${c.base / 60000}+${c.inc / 1000} · Friendly · ${you}</small></div></div>
      <div class="pv-row2"><button type="button" class="btn pv-ok" data-acc="${esc(from)}">Accept</button><button type="button" class="btn btn-ghost" data-dec="${esc(from)}">Decline</button></div></div>`;
  }).join('');
  box.querySelectorAll('[data-acc]').forEach(b => b.onclick = () => accept(b.dataset.acc));
  box.querySelectorAll('[data-dec]').forEach(b => b.onclick = () => F.dbRemove(R(`ch/${me.uid}/${b.dataset.dec}`)).catch(() => {}));
}
async function accept(from) {
  const c = incoming[from]; if (!c) return;
  if (sent) await cancelSent();
  const challengerWhite = c.col === 'w' ? true : c.col === 'b' ? false : Math.random() < .5;
  const w = challengerWhite ? from : me.uid, b = challengerWhite ? me.uid : from;
  const g = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const game = {
    meta: { w, b, wn: challengerWhite ? c.name : me.short, bn: challengerWhite ? me.short : c.name, base: c.base, inc: c.inc, ns: NS, rated: false, watch: false, startAt: F.dbNow(), by: me.uid },
    n: 0, clk: { t: now() + P.DELAY, w: c.base, b: c.base },
  };
  try { await F.dbSet(R('games/' + g), game); await F.dbUpdate(R(`ch/${me.uid}/${from}`), { g }) }
  catch (e) { console.warn(e); toast('Could not start the game. The challenge may have been cancelled.'); return }
  openGame(g);
}

// ---------- game ----------
let game = null;
async function openGame(g) {
  hubOn = false;
  if (game && game.off) game.off.forEach(f => f());
  let meta;
  try { meta = (await F.dbGet(R(`games/${g}/meta`))).val() } catch { meta = null }
  if (!meta) { app.innerHTML = gate('Game not found', 'This game does not exist, or it belongs to other players.', '<button class="btn btn-primary" id="pvBack">Back to Play</button>'); document.getElementById('pvBack').onclick = () => hub(); return }
  const qs = new URLSearchParams(location.search); qs.set('g', g); history.replaceState(null, '', location.pathname + '?' + qs.toString());
  const myCol = meta.w === me.uid ? 'w' : meta.b === me.uid ? 'b' : null;
  if (myCol) setSt('game');
  game = { g, meta, myCol, opp: myCol === 'w' ? meta.b : meta.w, ch: meta.fen ? new Chess(meta.fen) : new Chess(), list: [], n: 0, clk: null, result: null, offer: null, off: [], view: -1, lowWarned: false, claimAt: 0, msgT: 0, oppGone: null, saved: false, openedAt: now() };
  const top = myCol === 'b' ? 'w' : 'b', bot = P.other(top), nm = (s) => s === 'w' ? meta.wn : meta.bn;
  const tcTxt = `${Math.round(meta.base / 60000)}+${Math.round((meta.inc || 0) / 1000)}`;
  document.getElementById('plTitle').textContent = `Friendly · ${tcTxt}`;
  app.innerHTML = `
  <div class="pv-game">
    <div class="pv-bwrap"><div id="pvBoard"></div></div>
    <div class="pv-side">
      <div class="pv-pl" id="plTop"><span class="av">${esc(initials(nm(top)))}</span><div><b>${esc(nm(top))}${top === myCol ? ' (you)' : ''}</b><small id="stTop">${top === 'w' ? 'White' : 'Black'}</small></div><div class="pv-clk" id="clkTop">--:--</div></div>
      <div id="pvBanner"></div>
      <div class="pv-ml" id="pvMl"></div>
      <div class="pv-nav" id="pvNav" hidden><button type="button" data-nav="0" aria-label="First move">⏮</button><button type="button" data-nav="-1" aria-label="Previous move">‹</button><button type="button" data-nav="1" aria-label="Next move">›</button><button type="button" data-nav="9" aria-label="Last move">⏭</button></div>
      <div class="pv-acts" id="pvActs">
        ${myCol ? `<button type="button" class="btn btn-ghost" id="bDraw">½ Offer draw</button><button type="button" class="btn pv-bad" id="bResign">⚑ Resign</button>` : ''}
        <button type="button" class="btn btn-ghost" id="bFlip">⇅ Flip board</button><button type="button" class="btn btn-ghost" id="bSnd"></button>
      </div>
      ${myCol ? `<div class="pv-msgs">${MSGS.map((m, i) => `<button type="button" data-msg="${i}">${m}</button>`).join('')}</div>` : '<p class="pv-mut">You are watching this game.</p>'}
      <div class="pv-pl" id="plBot"><span class="av">${esc(initials(nm(bot)))}</span><div><b>${esc(nm(bot))}${bot === myCol ? ' (you)' : ''}</b><small id="stBot">${bot === 'w' ? 'White' : 'Black'}</small></div><div class="pv-clk" id="clkBot">--:--</div></div>
      <div class="pv-stat"><span class="dot" id="netDot"></span><span id="netTxt">Connecting…</span></div>
    </div>
  </div>
  <div class="pv-ov" id="pvOv" hidden></div><div class="pv-toast" id="pvToast"></div>`;
  game.top = top; game.bot = bot;
  game.board = new LiveBoard(document.getElementById('pvBoard'), {
    onMove: playMove,
    canMove: (s) => game.myCol && !game.result && game.view < 0 && P.toMove(game.n) === game.myCol && game.board.pos[s] && game.board.pos[s][0] === game.myCol,
    legal: (s) => (game.view < 0 && game.myCol && P.toMove(game.n) === game.myCol) ? game.ch.moves({ square: s, verbose: true }).map(m => m.to) : [],
  });
  game.board.setFlip(myCol === 'b');
  game.board.set(posOf(game.ch));
  paintSnd();
  document.getElementById('bFlip').onclick = () => { game.board.setFlip(!game.board.flip); swapPlayers() };
  document.getElementById('bSnd').onclick = () => { store.set('pq-play-sound', store.get('pq-play-sound', '1') === '1' ? '0' : '1'); paintSnd() };
  if (myCol) {
    document.getElementById('bResign').onclick = resignClick;
    document.getElementById('bDraw').onclick = drawClick;
    app.querySelectorAll('[data-msg]').forEach(b => b.onclick = () => sendMsg(+b.dataset.msg));
    const pref = R(`pres/${g}/${me.uid}`);
    F.onDisconnect(pref).remove().catch(() => {}); F.dbSet(pref, true).catch(() => {});
    game.off.push(F.onValue(R(`pres/${g}/${game.opp}`), s => { if (!game) return; game.oppGone = s.val() ? null : (game.oppGone || now()); paintBanner() }));
    game.off.push(F.onValue(R(`games/${g}/msg/${game.opp}`), s => { const v = s.val(); if (v && v.t > game.msgT && now() - v.t < 15000) { game.msgT = v.t; toast(`${game.myCol === 'w' ? meta.bn : meta.wn}: ${MSGS[v.k] || ''}`) } }));
  }
  app.querySelectorAll('[data-nav]').forEach(b => b.onclick = () => nav(+b.dataset.nav));
  const gr = (p) => R(`games/${g}/${p}`);
  game.off.push(F.onChildAdded(gr('moves'), s => addMove(+s.key, s.val())));
  game.off.push(F.onValue(gr('n'), s => { game.n = s.val() || 0; paintTurn() }));
  game.off.push(F.onValue(gr('clk'), s => { game.clk = s.val() }));
  game.off.push(F.onValue(gr('offer'), s => { game.offer = s.val(); paintBanner() }));
  game.off.push(F.onValue(gr('result'), s => { const v = s.val(); if (v) finish(v); else if (game.result) { game.result = null } }));
  game.off.push(F.onValue(R('.info/connected'), s => { const on = s.val() === true; const d = document.getElementById('netDot'), t = document.getElementById('netTxt'); if (d) { d.className = 'dot' + (on ? '' : ' off'); t.textContent = on ? 'Connected' : 'Reconnecting… your clock keeps running' } }));
  game.tick = setInterval(tick, 100);
  game.off.push(() => clearInterval(game.tick));
}
function swapPlayers() {
  const a = document.getElementById('plTop'), b = document.getElementById('plBot'); const ta = a.innerHTML; a.innerHTML = b.innerHTML; b.innerHTML = ta;
  [game.top, game.bot] = [game.bot, game.top];
  a.querySelector('.pv-clk').id = 'clkTop'; b.querySelector('.pv-clk').id = 'clkBot'; a.querySelector('small').id = 'stTop'; b.querySelector('small').id = 'stBot';
  paintTurn();
}
function paintSnd() { const b = document.getElementById('bSnd'); if (b) b.textContent = store.get('pq-play-sound', '1') === '1' ? '🔊 Sound on' : '🔇 Sound off' }

function addMove(i, mv) {
  if (!game || i < game.list.length) return;                // already shown (my own move)
  if (i > game.list.length) { game.pending = game.pending || {}; game.pending[i] = mv; return }
  const r = game.ch.move(P.parseUci(mv.s));
  if (!r) { banner('bad', '⚠ An invalid move was received. Your coach has been asked to check this game.'); return }
  game.list.push(mv);
  afterMove(r, true);
  if (game.pending && game.pending[i + 1]) { const nx = game.pending[i + 1]; delete game.pending[i + 1]; addMove(i + 1, nx) }
}
function afterMove(r, anim) {
  const chk = game.ch.in_check() ? kingSq(game.ch.turn()) : null;
  if (game.view < 0) game.board.set(posOf(game.ch), { from: r.from, to: r.to }, chk, anim);
  (r.captured ? SND.cap : chk ? SND.chk : SND.move)();
  paintMl();
  const end = P.boardEnd(game.ch);
  if (end && game.myCol && !game.result) {
    // checkmate is written by the mated player; draws by either player (first one wins)
    if (end.why !== 'mate' || game.ch.turn() === game.myCol) writeResult(end.r, end.why);
  }
}
const kingSq = (c) => { const b = game.ch.board(); for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) { const p = b[r][f]; if (p && p.type === 'k' && p.color === c) return 'abcdefgh'[f] + (8 - r) } return null };

async function playMove(from, to, promo) {
  if (!game || !game.clk || game.result || P.toMove(game.n) !== game.myCol || game.list.length !== game.n) return;
  const r = game.ch.move({ from, to, promotion: promo || 'q' }); if (!r) return;
  const nc = P.nextClk({ meta: game.meta, n: game.n, clk: game.clk }, now());
  if (nc.flagged) { game.ch.undo(); claimTime(); return }
  const i = game.n, mv = { s: P.uci(r), t: now() };
  game.list.push(mv);
  afterMove(r, false);
  if (game.offer && game.offer.by === game.myCol) game.offer = null;
  try {
    await F.dbUpdate(R(`games/${game.g}`), { n: i + 1, [`moves/${i}`]: { s: mv.s, t: F.dbNow() }, clk: { t: F.dbNow(), ...nc.clk } });
  } catch (e) {
    console.warn('move refused', e); toast('Your move was not accepted (time or connection). The board was refreshed.'); resync();
  }
}
async function resync() {
  const s = (await F.dbGet(R(`games/${game.g}`))).val() || {};
  const rp = P.replay(Chess, s.moves, game.meta.fen);
  game.ch = rp.chess; game.list = rp.list.slice(0, rp.bad < 0 ? rp.list.length : rp.bad); game.n = s.n || 0; game.clk = s.clk;
  const h = game.ch.history({ verbose: true }), last = h[h.length - 1];
  game.board.set(posOf(game.ch), last ? { from: last.from, to: last.to } : null, game.ch.in_check() ? kingSq(game.ch.turn()) : null);
  paintMl(); paintTurn();
}

function tick() {
  if (!game || !game.clk) return;
  const st = { meta: game.meta, n: game.n, clk: game.clk, result: game.result };
  const c = P.clocks(st, now());
  [['clkTop', game.top], ['clkBot', game.bot]].forEach(([id, side]) => {
    const e = document.getElementById(id); if (!e) return;
    const ms = c[side]; e.textContent = fmt(ms);
    e.classList.toggle('run', c.run === side); e.classList.toggle('low', c.run === side && ms < 10000);
  });
  if (game.result) return;
  // countdown before the clocks start
  const ov = document.getElementById('pvOv');
  if (game.n === 0 && now() < game.clk.t) showStart(Math.ceil((game.clk.t - now()) / 1000));
  else if (ov && ov.dataset.kind === 'start') { ov.hidden = true; ov.dataset.kind = '' }
  if (game.myCol && c.run === game.myCol && c[game.myCol] < 10000 && !game.lowWarned) { game.lowWarned = true; SND.low() }
  if (game.myCol && c.run === game.myCol && c[game.myCol] >= 10000) game.lowWarned = false;
  // flag fall: any player may claim once the clock is really at zero (the database checks the time)
  if (game.myCol && c.run && c[c.run] <= 0) claimTime();
  // no-show: White has not moved 3 min after the start / Black has not answered 3 min after White's first move
  if (game.myCol === 'b' && game.n === 0 && now() - game.meta.startAt >= game.meta.ns + P.DELAY) claim('0-1', 'noshow');
  if (game.myCol === 'w' && game.n === 1 && now() - game.clk.t >= game.meta.ns) claim('1-0', 'noshow');
  if (game.oppGone) paintBanner();
}
const fmt = (ms) => { if (ms < 10000) { return '0:0' + (ms / 1000).toFixed(1) } const s = Math.ceil(ms / 1000); const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0') };
function claimTime() { const side = P.toMove(game.n); claim(P.timeResult(game.ch, side), 'time') }
function claim(r, why) { if (now() - game.claimAt < 800) return; game.claimAt = now(); writeResult(r, why, true) }
async function writeResult(r, why, quiet) {
  try { await F.dbSet(R(`games/${game.g}/result`), { r, why, by: me.uid, t: F.dbNow() }) }
  catch (e) { if (!quiet) console.warn('result refused', why, e) }
}
function showStart(sec) {
  const ov = document.getElementById('pvOv'); if (!ov) return;
  if (ov.dataset.kind !== 'start') {
    ov.dataset.kind = 'start'; ov.hidden = false; const m = game.meta;
    ov.innerHTML = `<div class="pv-modal"><div class="pv-vs"><div><span class="av big">${esc(initials(m.wn))}</span><b>${esc(m.wn)}</b><small>♔ White</small></div><div class="sc">vs</div><div><span class="av big">${esc(initials(m.bn))}</span><b>${esc(m.bn)}</b><small>♚ Black</small></div></div>
      <p class="pv-mut">${Math.round(m.base / 60000)}+${Math.round((m.inc || 0) / 1000)} · Friendly · Game starts in</p><div class="pv-count" id="pvCount">${sec}</div>
      <div class="pv-rules"><div>⏱ <b>White's clock starts</b> when the countdown ends. Make your first move within <b>3 min</b> or you lose by no-show.</div><div>🤝 Draw offers and Resign are on the right. You can abort only before move 2.</div><div>🔒 No help, no engines, stay on this tab. Your coach can see every game.</div></div></div>`;
  } else { const c = document.getElementById('pvCount'); if (c) c.textContent = sec }
}
function paintTurn() {
  if (!game) return; const t = P.toMove(game.n);
  const st = (side) => (side === 'w' ? 'White' : 'Black') + (game.result ? '' : t === side ? (side === game.myCol ? ' · your move' : ' · to move') : '');
  const a = document.getElementById('stTop'), b = document.getElementById('stBot');
  if (a) a.textContent = st(game.top); if (b) b.textContent = st(game.bot);
  const d = document.getElementById('bDraw');
  if (d && !game.result) { if (game.n < 2) { d.textContent = '✕ Abort game'; d.dataset.mode = 'abort' } else { d.textContent = '½ Offer draw'; d.dataset.mode = 'draw' } }
}
function paintMl() {
  const box = document.getElementById('pvMl'); if (!box) return;
  const h = game.ch.history(); let html = '';
  for (let i = 0; i < h.length; i += 2) html += `<i>${i / 2 + 1}.</i><span data-i="${i}">${h[i]}</span><span data-i="${i + 1}">${h[i + 1] || ''}</span>`;
  box.innerHTML = html || '<p class="pv-mut" style="grid-column:1/-1">Moves appear here.</p>';
  const cur = game.view < 0 ? h.length - 1 : game.view;
  const c = box.querySelector(`[data-i="${cur}"]`); if (c) { c.classList.add('cur'); c.scrollIntoView({ block: 'nearest' }) }
  box.querySelectorAll('[data-i]').forEach(s => s.onclick = () => { if (game.result && s.textContent) { game.view = +s.dataset.i; showView() } });
}
// replay after the game: step through the moves
function nav(d) {
  const tot = game.ch.history().length; let v = game.view < 0 ? tot - 1 : game.view;
  v = d === 0 ? -1 : d === 9 ? tot - 1 : Math.max(-1, Math.min(tot - 1, v + d));
  game.view = v; showView();
}
function showView() {
  const h = game.ch.history({ verbose: true }), c = game.meta.fen ? new Chess(game.meta.fen) : new Chess();
  for (let i = 0; i <= game.view; i++) c.move(h[i]);
  const last = h[game.view];
  game.board.set(posOf(c), last ? { from: last.from, to: last.to } : null, null);
  paintMl();
}

// ---------- draw, resign, messages ----------
let resignArm = 0;
function resignClick() {
  const b = document.getElementById('bResign');
  if (Date.now() - resignArm > 3000) { resignArm = Date.now(); b.textContent = 'Press again to resign'; b.classList.add('arm'); setTimeout(() => { if (b.isConnected && !game.result) { b.textContent = '⚑ Resign'; b.classList.remove('arm') } }, 3000); return }
  writeResult(game.myCol === 'w' ? '0-1' : '1-0', 'resign');
}
function drawClick() {
  const b = document.getElementById('bDraw');
  if (b.dataset.mode === 'abort') { writeResult('*', 'abort'); return }
  if (game.offer && game.offer.by === me.uid && game.offer.n >= game.n - 1) { toast('Draw offer already sent.'); return }
  F.dbSet(R(`games/${game.g}/offer`), { by: me.uid, n: game.n }).then(() => toast('Draw offered.')).catch(() => toast('Could not offer a draw.'));
}
let msgAt = 0;
function sendMsg(k) { if (Date.now() - msgAt < 3000) return; msgAt = Date.now(); F.dbSet(R(`games/${game.g}/msg/${me.uid}`), { k, t: F.dbNow() }).then(() => toast('Sent: ' + MSGS[k])).catch(() => {}) }
function paintBanner() {
  const box = document.getElementById('pvBanner'); if (!box || !game) return;
  if (game.result) { box.innerHTML = ''; return }
  const o = game.offer;
  if (o && o.by !== me.uid && game.myCol && o.n >= game.n - 1) {
    if (box.dataset.k !== 'offer') {
      box.dataset.k = 'offer';
      box.innerHTML = `<div class="pv-ban draw"><span>🤝</span><span>${esc(game.myCol === 'w' ? game.meta.bn : game.meta.wn)} offers a draw</span><span class="sp"></span><button type="button" class="btn pv-ok" id="dAcc">Accept</button><button type="button" class="btn btn-ghost" id="dDec">Decline</button></div>`;
      document.getElementById('dAcc').onclick = () => writeResult('1/2-1/2', 'agree');
      document.getElementById('dDec').onclick = () => F.dbRemove(R(`games/${game.g}/offer`)).catch(() => {});
    }
    return;
  }
  // shown only after 5 s away (the opponent may still be opening the game)
  if (game.oppGone && game.myCol && game.clk && now() > game.clk.t && now() - game.oppGone > 5000) {
    box.dataset.k = 'gone';
    box.innerHTML = `<div class="pv-ban disc">⚠ ${esc(game.myCol === 'w' ? game.meta.bn : game.meta.wn)} disconnected ${P.hms(now() - game.oppGone).slice(2)} ago. Their clock keeps running.</div>`;
    return;
  }
  box.dataset.k = ''; box.innerHTML = '';
}
function banner(kind, text) { const box = document.getElementById('pvBanner'); if (box) { box.dataset.k = kind; box.innerHTML = `<div class="pv-ban disc">${esc(text)}</div>` } }
let toastT = 0;
function toast(t) { let e = document.getElementById('pvToast'); if (!e) { e = document.createElement('div'); e.id = 'pvToast'; e.className = 'pv-toast'; document.body.appendChild(e) } e.textContent = t; e.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => e.classList.remove('on'), 3200) }

// ---------- result ----------
async function finish(res) {
  if (!game || (game.result && game.result.t === res.t)) return;
  const first = !game.result; game.result = res;
  // a false board claim (stalemate etc.) is flagged for the arbiter
  if (['stalemate', 'repetition', 'fifty', 'material', 'mate'].includes(res.why) && !P.claimValid(game.ch, res) && game.list.length === game.n) banner('bad', '⚠ This result does not match the board. Your coach will check it.');
  paintTurn(); paintBanner();
  F.dbRemove(R(`pres/${game.g}/${me.uid}`)).catch(() => {});
  if (game.myCol) setSt('lobby');
  document.getElementById('pvActs').innerHTML = `<button type="button" class="btn btn-ghost" id="bFlip2">⇅ Flip board</button><button type="button" class="btn btn-ghost" id="bPgn">⬇ PGN</button>`;
  document.getElementById('bFlip2').onclick = () => { game.board.setFlip(!game.board.flip); swapPlayers() };
  document.getElementById('bPgn').onclick = downloadPgn;
  document.getElementById('pvNav').hidden = false;
  const m = document.querySelector('.pv-msgs'); if (m) m.remove();
  const old = res.t && res.t < game.openedAt - 3000;   // opened from the games list: no pop-up, go to replay
  if (game.myCol && !game.saved) {
    game.saved = true;
    const have = await F.dbGet(R(`ug/${me.uid}/${game.g}`)).then(s => s.exists()).catch(() => false);
    if (!have) F.dbSet(R(`ug/${me.uid}/${game.g}`), { opp: game.opp, oppName: game.myCol === 'w' ? game.meta.bn : game.meta.wn, col: game.myCol, r: res.r, why: res.why, tc: `${Math.round(game.meta.base / 60000)}+${Math.round((game.meta.inc || 0) / 1000)}`, rated: false, t: F.dbNow() }).catch(e => console.warn('save game', e));
  }
  if (first && !old) { SND.end(); showResult(res) }
  else if (old) { game.view = -1; paintMl() }
}
function showResult(res) {
  const ov = document.getElementById('pvOv'); if (!ov) return;
  const mc = game.myCol, m = game.meta;
  let head, icon;
  if (res.r === '*') { head = 'Game aborted'; icon = '✕' }
  else if (res.r === '1/2-1/2') { head = 'Draw by ' + (WHY[res.why] || res.why); icon = '🤝' }
  else {
    const winW = res.r === '1-0';
    if (!mc) { head = (winW ? m.wn : m.bn) + ' won by ' + (WHY[res.why] || res.why); icon = '🏆' }
    else if ((mc === 'w') === winW) { head = 'You won by ' + (WHY[res.why] || res.why); icon = '🏆' }
    else { head = 'You lost by ' + (WHY[res.why] || res.why); icon = '♟' }
  }
  const moves = Math.ceil(game.ch.history().length / 2);
  ov.dataset.kind = 'res'; ov.hidden = false;
  ov.innerHTML = `<div class="pv-modal"><div class="pv-trophy">${icon}</div><h3>${esc(head)}</h3>
    <p class="pv-mut">${esc(m.wn)} vs ${esc(m.bn)} · ${Math.round(m.base / 60000)}+${Math.round((m.inc || 0) / 1000)} Friendly · ${moves} move${moves === 1 ? '' : 's'}</p>
    <div class="pv-vs"><div><span class="av big">${esc(initials(m.wn))}</span><b>${esc(m.wn)}</b></div><div class="sc">${res.r === '1/2-1/2' ? '½ – ½' : res.r === '*' ? '–' : res.r.replace('-', ' – ')}</div><div><span class="av big">${esc(initials(m.bn))}</span><b>${esc(m.bn)}</b></div></div>
    <div class="pv-mbtns">${mc ? '<button type="button" class="btn btn-primary" id="rRe">↻ Rematch</button>' : ''}<button type="button" class="btn pv-gold" id="rRev">🔍 Replay game</button><button type="button" class="btn btn-ghost" id="rPgn">⬇ Download PGN</button><button type="button" class="btn btn-ghost" id="rBack">← Back to Play</button></div></div>`;
  const close = () => { ov.hidden = true };   // kind stays 'res' so a rematch request can reopen it
  if (mc) document.getElementById('rRe').onclick = () => { const opp = { uid: game.opp, name: mc === 'w' ? m.bn : m.wn, tc: [Math.round(m.base / 60000), Math.round((m.inc || 0) / 1000)], col: mc === 'w' ? 'b' : 'w' }; leave(); hub(); sendChallenge(opp) };
  document.getElementById('rRev').onclick = () => { close(); game.view = game.ch.history().length - 1; showView() };
  document.getElementById('rPgn').onclick = downloadPgn;
  document.getElementById('rBack').onclick = () => { leave(); hub() };
  ov.onclick = (e) => { if (e.target === ov) close() };
  paintRematch();
}
function leave() { if (game && game.off) game.off.forEach(f => { try { f() } catch {} }); game = null; document.getElementById('plTitle').textContent = 'Live games' }
function downloadPgn() {
  const txt = P.pgn(Chess, { meta: game.meta, moves: game.list, result: game.result });
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'application/x-chess-pgn' }));
  a.download = `purple-queen-${game.meta.wn}-vs-${game.meta.bn}.pgn`.replace(/[^\w.-]+/g, '_'); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function paintGames() {
  const box = document.getElementById('pvGames'); if (!box) return;
  const list = Object.entries(myGames).sort((a, b) => (b[1].t || 0) - (a[1].t || 0)).slice(0, 8);
  if (!list.length) { box.innerHTML = '<p class="pv-mut">No games yet. Challenge a classmate to start.</p>'; return }
  box.innerHTML = list.map(([g, x]) => {
    const k = x.r === '*' ? ['d', 'ABORTED'] : x.r === '1/2-1/2' ? ['d', 'DRAW'] : ((x.r === '1-0') === (x.col === 'w') ? ['w', 'WIN'] : ['l', 'LOSS']);
    return `<button type="button" class="pv-gm" data-g="${esc(g)}"><span class="res ${k[0]}">${k[1]}</span><span><b>vs ${esc(x.oppName)}</b><small>${esc(cap(WHY[x.why] || x.why))} · ${esc(x.tc)} · ${ago(x.t)}</small></span><span class="go">Replay ›</span></button>`;
  }).join('');
  box.querySelectorAll('[data-g]').forEach(b => b.onclick = () => openGame(b.dataset.g));
}
const cap = (s) => String(s || '').charAt(0).toUpperCase() + String(s || '').slice(1);
// leaving the page during a live game
window.addEventListener('beforeunload', (e) => { if (game && game.myCol && !game.result && game.n > 0) { e.preventDefault(); e.returnValue = '' } });
document.getElementById('plBack').addEventListener('click', (e) => { if (game) { e.preventDefault(); if (game.myCol && !game.result && game.n > 0 && !confirm('Your game is still running and your clock keeps going. Leave anyway?')) return; leave(); hub() } });
