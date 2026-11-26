// One homework, step by step (opened from the student portal).
import { auth, db, F, whoAmI, esc, markSignedIn, fmtTime } from './fb.js';
import { assignStat, statePill } from './lms.js';
import { hwView, hwSteps, nextStep, dueLabel } from './hw.js';
import { mountUser, withLocalMarks } from './shell.js';
const $ = (s) => document.querySelector(s);
const root = $('#portalHw');
const aid = new URLSearchParams(location.search).get('a');
const ICON = {
  lesson: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M9 7h6"/></svg>',
  puzzles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M10 3h4v3a2 2 0 1 0 4 0h3v5h-3a2 2 0 1 0 0 4h3v5H3v-5h3a2 2 0 1 0 0-4H3V3z" transform="scale(.9) translate(1.3 1.3)"/></svg>',
  task: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>',
  text: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/></svg>',
  lock: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
};
const KIND = { lesson: 'Lesson', puzzles: 'Puzzles', task: 'Board task', text: 'Task' };

(async () => {
  const me = await whoAmI();
  if (!me) return (location.href = 'login.html');
  if (me.role === 'coach') return (location.href = 'coach.html');
  if (me.role !== 'student') return (location.href = 'login.html');
  markSignedIn(true, 'student');
  mountUser(me.profile || {});
  const uid = me.user.uid;
  let a = null, prog = {}, tm = {}, st = null;
  try { const q = await F.getDocs(F.query(F.collection(db, 'assignments'), F.where('uids', 'array-contains', uid))); const d = q.docs.find(d => d.id === aid); if (d) a = { id: d.id, ...d.data() } } catch {}
  if (!a) { root.innerHTML = '<div class="acc-card"><h3>Homework</h3><p class="muted">This homework was not found. It may have been removed by your coach.</p><a class="btn btn-ghost btn-sm" href="account.html">Back to my portal</a></div>'; return }
  try { const s = await F.getDoc(F.doc(db, 'progress', uid)); if (s.exists()) prog = s.data() } catch {}
  prog = withLocalMarks(prog);
  try { const s = await F.getDoc(F.doc(db, 'time', uid)); if (s.exists()) tm = s.data() } catch {}
  try { const s = await F.getDoc(F.doc(db, 'astatus', aid + '_' + uid)); if (s.exists()) st = s.data() } catch {}

  function paint() {
    const x = assignStat(a, uid, prog, st, tm), hv = hwView(a, x), steps = hwSteps(a, x, prog.lessons || {}), nx = nextStep(steps), du = dueLabel(a);
    const pc = x.total ? Math.round(x.done / x.total * 100) : 0;
    root.innerHTML = `<section class="hwhead acc-card"><div class="hwring" style="--p:${pc}"><b>${x.done}/${x.total}</b><small>done</small></div>
        <div class="hwh-t"><p class="eyebrow">Homework from your coach</p><h1>${esc(hv.title)}</h1><p class="hwh-due ${x.state === 'done' ? '' : du.c}">${x.state === 'done' ? 'Completed' : du.t}${x.secs ? ' · ' + fmtTime(x.secs) + ' studied' : ''}</p>${a.note ? `<p class="hwnote">${esc(a.note)}</p>` : ''}</div>
        <div class="hwh-a">${statePill(x.state)}${nx ? `<a class="btn btn-primary" id="hwGo" href="${nx.href}">${x.done ? 'Continue' : 'Start'} ${ICON.arrow}</a>` : ''}</div></section>
      <section class="acc-card"><h3>Steps</h3><ol class="hwsteps">${steps.map((s, k) => `<li class="hst ${s.done ? 'ok' : s.lock ? 'lk' : nx && nx.i === s.i ? 'now' : ''}">
          <span class="hn">${s.done ? '✓' : s.lock ? ICON.lock : k + 1}</span>
          <span class="hic">${ICON[s.kind] || ICON.text}</span>
          <div class="ht"><small>${KIND[s.kind] || 'Task'}</small><b>${esc(s.title)}</b><span>${s.lock ? esc(s.lock) : esc(s.sub)}</span></div>
          <div class="ha">${s.kind === 'text' ? `<label class="tick"><input type="checkbox" data-i="${s.i}" ${s.done ? 'checked' : ''}> Done</label>`
            : s.lock ? '<span class="lockt">Locked</span>' : s.href ? `<a class="btn ${s.done ? 'btn-ghost' : 'btn-primary'} btn-sm" href="${s.href}">${s.done ? 'Review' : s.kind === 'lesson' && s.r.mark != null ? 'Continue' : 'Start'}</a>` : ''}</div></li>`).join('')}</ol></section>${resultCard(x)}${notesCard()}`;
  }
  function resultCard(x) {
    const it = a.items.find(i => i.t === 'puzzles'), ids = (it && it.sets && it.sets[uid]) || [], pz = (st && st.pz) || {}; if (!ids.length || !(st && st.sub)) return '';
    const sol = ids.filter(id => pz[id] && pz[id].s === 's').length, cl = ids.filter(id => pz[id] && pz[id].s === 's' && !pz[id].r && !pz[id].h).length, hn = ids.reduce((n, id) => n + ((pz[id] && pz[id].h) || 0), 0), rt = ids.reduce((n, id) => n + ((pz[id] && pz[id].r) || 0), 0);
    const bd = []; if (cl >= 3) bd.push('🎯 Sharp eye'); if (!hn) bd.push('🧠 No hints needed'); if (cl === ids.length) bd.push('💎 Flawless'); bd.push('🛡️ Submitted');
    return `<section class="acc-card hwres"><h3>Your result</h3><div class="hwr-t"><div><b>${sol}/${ids.length}</b><small>puzzles solved</small></div><div><b>${cl}</b><small>first try</small></div><div><b>${hn}</b><small>hints</small></div><div><b>${rt}</b><small>retries</small></div></div><p class="hwr-b">${bd.map(x => `<span>${x}</span>`).join('')}</p></section>`;
  }
  function notesCard() {
    const nt = (st && st.notes) || {}, it = a.items.find(i => i.t === 'puzzles'), ids = (it && it.sets && it.sets[uid]) || [];
    const rows = ids.map((id, k) => ({ k, t: (nt[id] || '').trim() })).filter(r => r.t); if (!rows.length) return '';
    return `<section class="acc-card hwnotes"><h3>Notes from your coach</h3><ul>${rows.map(r => `<li><b>Puzzle ${r.k + 1}</b><span>${esc(r.t)}</span></li>`).join('')}</ul></section>`;
  }
  paint();
  root.addEventListener('change', async (e) => {
    const c = e.target.closest('input[data-i]'); if (!c) return;
    const key = aid + '_' + uid, checks = { ...((st && st.checks) || {}) }; if (c.checked) checks[c.dataset.i] = true; else delete checks[c.dataset.i];
    const next = { aid, uid, checks };
    try { await F.setDoc(F.doc(db, 'astatus', key), { ...next, updatedAt: F.serverTimestamp() }, { merge: true }); st = { ...(st || {}), ...next }; paint() } catch { c.checked = !c.checked }
  });
})();
