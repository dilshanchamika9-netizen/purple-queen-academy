// Lessons page: level tabs, modules in order (done / active / locked), lessons inside each module.
import { db, F, whoAmI, auth, esc, markSignedIn } from './fb.js';
import { PASS } from './lms.js';
import { mountUser, SVG } from './shell.js';
const $ = (s) => document.querySelector(s);
const root = $('#portalCourse');
const MODS = window.PQ_MODULES || [];
const LEVEL = { 1: 'Level 1 · Basic', 2: 'Level 2 · Intermediate', 3: 'Level 3 · Advanced' };

(async () => {
  const me = await whoAmI();
  if (!me) return (location.href = 'login.html');
  if (me.role === 'coach') return (location.href = 'coach.html');
  if (me.role !== 'student') { await F.signOut(auth); return (location.href = 'login.html') }
  if (me.profile && me.profile.mustChange) return (location.href = 'login.html');
  markSignedIn(true, 'student');
  const p = me.profile || {}, uid = me.user.uid;
  mountUser(p);
  let prog = {}; try { const s = await F.getDoc(F.doc(db, 'progress', uid)); if (s.exists()) prog = s.data() } catch {}
  try { const lp = JSON.parse(localStorage.getItem('pq-progress') || '{}'); prog.lessons = { ...(prog.lessons || {}) }; Object.keys(lp).forEach(k => prog.lessons[k] = Math.max(lp[k], prog.lessons[k] || 0)) } catch {}
  const L = prog.lessons || {}, passed = (l) => (L[l.id] || 0) >= PASS;
  const lvNow = +p.level || 1, lvOf = (k) => PQ_MOD(MODS, k).lv;
  const modDone = (k) => MODS[k].lessons.every(passed);
  // same rule as the lesson player: earlier levels stay open, the first module of the student's level opens, then one after another
  const modOpen = (k) => k === 0 || lvOf(k) < lvNow || modDone(k - 1) || (lvOf(k) === lvNow && lvOf(k - 1) < lvNow);
  const levels = [...new Set(MODS.map((m, k) => lvOf(k)))].sort();
  let lv = +new URLSearchParams(location.search).get('lv') || lvNow; if (lv > lvNow || !levels.includes(lv)) lv = lvNow;

  function paint() {
    const idx = MODS.map((m, k) => k).filter(k => lvOf(k) === lv);
    const curK = idx.find(k => modOpen(k) && !modDone(k));
    root.innerHTML = `<div class="sp-lvtabs" role="tablist">${levels.map(v => { const ix = MODS.map((m, k) => k).filter(k => lvOf(k) === v), t = ix.reduce((a, k) => a + MODS[k].lessons.length, 0), d = ix.reduce((a, k) => a + MODS[k].lessons.filter(passed).length, 0), lk = v > lvNow;
        return `<button type="button" role="tab" data-lv="${v}" class="${v === lv ? 'on' : ''}${lk ? ' lk' : ''}" aria-selected="${v === lv}" ${lk ? 'aria-disabled="true" title="Opens when your coach moves you to this level"' : ''}>${LEVEL[v] || 'Level ' + v}<em>${lk ? '🔒 ' : ''}${d}/${t}</em></button>` }).join('')}</div>
      ${lv < lvNow ? '<p class="sp-lvnote">You have finished this level. Every lesson is open for review.</p>' : ''}
      <div class="sp-mods">${idx.map(k => {
        const m = MODS[k], open = modOpen(k), dn = modDone(k), n = m.lessons.filter(passed).length, act = k === curK, pc = Math.round(n / m.lessons.length * 100);
        const st = dn ? '<span class="sp-st d">Done</span>' : act ? '<span class="sp-st a">Active</span>' : open ? '<span class="sp-st a">Open</span>' : '<span class="sp-st l">Locked</span>';
        const nxt = m.lessons.findIndex(l => !passed(l));
        const ls = open ? m.lessons.map((l, i) => {
          const ok = passed(l), on = ok || nxt === -1 || i <= nxt, v = L[l.id], isNext = i === nxt; // strictly one after another
          const inner = `<i>${ok ? SVG.check : on ? i + 1 : SVG.lock}</i><span>${i + 1} · ${esc(l.title.en)}</span>${ok ? `<span class="s">${v}%</span>` : isNext ? `<span class="s">${v != null ? 'Continue' : 'Start'}</span>` : ''}`;
          return on ? `<li class="${ok ? 'd' : isNext ? 'a' : ''}"><a href="lesson.html?m=${k}&l=${i}">${inner}</a></li>` : `<li class="l"><div>${inner}</div></li>`;
        }).join('') : '';
        return `<article class="sp-mod${dn ? ' dn' : ''}${act ? ' act open' : ''}${open ? '' : ' lk'}" data-k="${k}"><button type="button" ${open ? 'aria-expanded="' + act + '"' : 'disabled'}>
            <span class="sp-num">${dn ? SVG.check : open ? PQ_MOD(MODS, k).num : SVG.lock}</span>
            <span class="t"><small>${PQ_MOD(MODS, k).label.replace(/^Level \d+ · /, '')}${act ? ' · active now' : ''}</small><b>${esc(m.title.en)}</b></span>
            <span class="sp-row"><span class="sp-tr"><b style="width:${pc}%"></b></span><em>${n}/${m.lessons.length}</em>${st}</span></button>
          ${open ? `<ol class="sp-ls">${ls}</ol>` : ''}</article>`;
      }).join('')}</div>`;
  }
  paint();
  root.addEventListener('click', (e) => {
    const t = e.target.closest('.sp-lvtabs button'); if (t) { if (t.classList.contains('lk')) return; lv = +t.dataset.lv; history.replaceState(null, '', '?lv=' + lv); paint(); return }
    const b = e.target.closest('.sp-mod > button'); if (b && !b.disabled) { const a = b.parentElement; a.classList.toggle('open'); b.setAttribute('aria-expanded', a.classList.contains('open')) }
  });
})();
