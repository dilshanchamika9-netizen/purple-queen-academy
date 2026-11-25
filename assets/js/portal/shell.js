// Student app bar: avatar button with the profile menu (profile, fees, attendance, achievements, password, sign out).
import { esc, logout } from './fb.js';

export const SVG = {
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20.5c1.4-3.6 4.4-5.5 8-5.5s6.6 1.9 8 5.5"/></svg>',
  fees: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 11h18"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M12 14v4M8 21h8"/></svg>',
  key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/></svg>',
  out: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3"/></svg>',
  chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M9 7h6"/></svg>',
  puzzle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M10 3h4v3a2 2 0 1 0 4 0h3v5h-3a2 2 0 1 0 0 4h3v5H3v-5h3a2 2 0 1 0 0-4H3V3z" transform="scale(.9) translate(1.3 1.3)"/></svg>',
  board: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
};
export const initials = (p) => esc((p.name || p.sid || '?').trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase());
export const avatar = (p) => `<span class="sp-av">${p.photo ? `<img src="${esc(p.photo)}" alt="">` : initials(p)}</span>`;

export function mountUser(p) {
  const box = document.getElementById('spUser'); if (!box) return;
  const first = esc((p.name || 'Student').split(' ')[0]);
  box.innerHTML = `<button type="button" class="sp-ubtn" id="spUBtn" aria-haspopup="menu" aria-expanded="false" aria-controls="spMenu"><span class="nm">${first}</span>${avatar(p)}${SVG.chev}</button>
    <div class="sp-menu" id="spMenu" role="menu">
      <div class="sp-mh">${avatar(p)}<div><b>${esc(p.name || 'Student')}</b><small>${esc(p.sid || '')}</small></div></div>
      <a role="menuitem" href="profile.html#profile">${SVG.user}My profile</a>
      <a role="menuitem" href="profile.html#fees">${SVG.fees}Fees and payments</a>
      <a role="menuitem" href="profile.html#attendance">${SVG.cal}Attendance</a>
      <a role="menuitem" href="profile.html#achievements">${SVG.trophy}Achievements</a>
      <a role="menuitem" href="profile.html#password">${SVG.key}Change password</a>
      <hr><button type="button" role="menuitem" class="out" id="spOut">${SVG.out}Sign out</button>
    </div>`;
  const b = box.querySelector('#spUBtn'), m = box.querySelector('#spMenu');
  const set = (v) => { m.classList.toggle('on', v); b.setAttribute('aria-expanded', String(v)) };
  b.onclick = (e) => { e.stopPropagation(); set(!m.classList.contains('on')) };
  document.addEventListener('click', (e) => { if (!box.contains(e.target)) set(false) });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false) });
  m.addEventListener('click', (e) => { if (e.target.closest('a')) set(false) });
  box.querySelector('#spOut').onclick = logout;
}

// Lesson marks: the server copy plus anything saved on this device that is not uploaded yet.
// After an admin reset (higher epoch on the server) the old marks kept on this device are thrown away, not merged back.
export function withLocalMarks(prog) {
  prog = prog || {};
  try {
    const ep = +JSON.parse(localStorage.getItem('pq-epoch') || '0') || 0;
    if ((prog.epoch || 0) > ep) { localStorage.setItem('pq-progress', '{}'); localStorage.setItem('pq-xp', '0'); localStorage.setItem('pq-epoch', String(prog.epoch)) }
    const lp = JSON.parse(localStorage.getItem('pq-progress') || '{}'); prog.lessons = { ...(prog.lessons || {}) };
    Object.keys(lp).forEach(k => prog.lessons[k] = Math.max(lp[k], prog.lessons[k] || 0));
  } catch { prog.lessons = prog.lessons || {} }
  return prog;
}
