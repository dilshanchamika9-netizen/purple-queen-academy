// Shared helpers for homework, time and reports (coach, student and parent pages).
import { esc, fmtTime, today } from './fb.js';
export const MODS = window.PQ_MODULES || [];
export const LESSONS = MODS.flatMap((m, k) => m.lessons.map(l => ({ ...l, mod: k })));
export const byId = Object.fromEntries(LESSONS.map(l => [l.id, l]));
export const lessonName = (id) => byId[id] ? `M${byId[id].mod + 1} · ${byId[id].title.en}` : id;
export const PASS = 70;

// one item of an assignment: {t:'lesson', id} or {t:'text', text}
export function itemState(a, i, prog, st) {
  const it = a.items[i];
  if (it.t === 'lesson') { const m = ((prog || {}).lessons || {})[it.id]; return { done: (m || 0) >= PASS, mark: m == null ? null : m } }
  return { done: !!(st && st.checks && st.checks[i]), mark: null };
}
export function assignStat(a, uid, prog, st, tm) {
  const items = a.items.map((it, i) => ({ it, ...itemState(a, i, prog, st) }));
  const done = items.filter(x => x.done).length;
  let secs = 0; a.items.forEach(it => { if (it.t === 'lesson' && tm && tm.lessons && tm.lessons[it.id]) secs += tm.lessons[it.id].s || 0 });
  const complete = done === items.length, late = !complete && a.due && a.due < today();
  return { items, done, total: items.length, secs, complete, late, state: complete ? 'done' : late ? 'late' : 'open' };
}
export const itemLabel = (it) => it.t === 'lesson' ? lessonName(it.id) : it.t === 'task' ? 'Board task: ' + it.q : it.text;
export const lessonSecs = (tm, id) => (tm && tm.lessons && tm.lessons[id] && tm.lessons[id].s) || 0;
export const lessonAtt = (tm, id) => (tm && tm.lessons && tm.lessons[id] && tm.lessons[id].a) || 0;
export function secsInLastDays(tm, n) {
  if (!tm || !tm.days) return 0; let t = 0;
  for (let i = 0; i < n; i++) { const d = new Date(Date.now() - i * 864e5); const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); t += tm.days[k] || 0 }
  return t;
}
export function dayBars(tm, n = 14) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) { const d = new Date(Date.now() - i * 864e5); const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); out.push({ k, s: (tm && tm.days && tm.days[k]) || 0 }) }
  const max = Math.max(60, ...out.map(o => o.s));
  return `<div class="dbars" role="img" aria-label="Active minutes per day, last ${n} days">${out.map(o => `<i title="${o.k}: ${fmtTime(o.s)}"><b style="height:${Math.max(2, Math.round(o.s / max * 100))}%"></b><em>${o.k.slice(8)}</em></i>`).join('')}</div>`;
}
export const dueText = (a) => a.due ? new Date(a.due + 'T00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'No date';
export const statePill = (s) => `<span class="pill ${s}">${s === 'done' ? 'Done' : s === 'late' ? 'Overdue' : 'Open'}</span>`;
export function toCsv(rows) { return rows.map(r => r.map(c => { const v = String(c ?? ''); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v }).join(',')).join('\r\n') }
export function download(name, text) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove() }, 500) }
// the module/lesson table used for the coach report and the parent page
export function lessonTable(prog, tm) {
  const L = (prog && prog.lessons) || {};
  return MODS.map((m, k) => `<details class="mrep" ${k < 2 ? 'open' : ''}><summary><b>Module ${k + 1}</b> ${esc(m.title.en)} <span>${m.lessons.filter(l => (L[l.id] || 0) >= PASS).length}/${m.lessons.length}</span></summary>
    <table class="stu mini-t"><thead><tr><th>Lesson</th><th>Best mark</th><th>Tries</th><th>Time</th></tr></thead><tbody>${m.lessons.map(l => { const v = L[l.id]; return `<tr><td>${esc(l.title.en)}</td><td class="${v == null ? '' : v >= PASS ? 'good' : 'bad'}">${v == null ? '—' : v + '%'}</td><td>${lessonAtt(tm, l.id) || '—'}</td><td>${lessonSecs(tm, l.id) ? fmtTime(lessonSecs(tm, l.id)) : '—'}</td></tr>` }).join('')}</tbody></table></details>`).join('');
}

// attendance: sessions = [{date,batch,marks:{uid:'p'|'l'|'a'},uids}]
export function attStat(sessions, uid) {
  const mine = sessions.filter(x => (x.uids || []).includes(uid) && x.marks && x.marks[uid]).sort((a, b) => b.date.localeCompare(a.date));
  const c = { p: 0, l: 0, a: 0 }; mine.forEach(x => c[x.marks[uid]]++);
  const total = mine.length;
  return { total, present: c.p, late: c.l, absent: c.a, pct: total ? Math.round((c.p + c.l) / total * 100) : null, recent: mine.slice(0, 10) };
}
export const attLabel = { p: 'Present', l: 'Late', a: 'Absent' };
export const attTable = (a, u) => a.total ? `<table class="stu mini-t"><thead><tr><th>Date</th><th>Class</th><th>Status</th></tr></thead><tbody>${a.recent.map(x => `<tr><td>${x.date}</td><td>${esc(x.batch)}</td><td><span class="pill ${x.marks[u] === 'a' ? 'late' : x.marks[u] === 'l' ? 'open' : 'done'}">${attLabel[x.marks[u]]}</span></td></tr>`).join('')}</tbody></table>` : '<p class="muted">No classes marked yet.</p>';
