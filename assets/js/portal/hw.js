// Homework steps shared by the student portal (summary) and the homework page (breakdown).
// Rule: lessons in a homework open one after another. A lesson opens only when every earlier lesson
// in the same homework is passed AND the lesson before it in the course is passed.
import { byId, MODS, itemLabel, dueText, PASS } from './lms.js';
import { today } from './fb.js';

export const lessonPos = (id) => { const l = byId[id]; return l ? { m: l.mod, l: MODS[l.mod].lessons.findIndex(z => z.id === id) } : null };
export const lessonHref = (id, aid) => { const p = lessonPos(id); return p ? `lesson.html?m=${p.m}&l=${p.l}${aid ? '&a=' + encodeURIComponent(aid) : ''}` : '' };

export function dueLabel(a) {
  if (!a.due) return { t: 'No due date', c: '' };
  const d = Math.round((new Date(a.due + 'T00:00') - new Date(today() + 'T00:00')) / 864e5);
  return d < 0 ? { t: `Overdue by ${-d} day${d === -1 ? '' : 's'}`, c: 'late' } : d === 0 ? { t: 'Due today', c: 'soon' } : d === 1 ? { t: 'Due tomorrow', c: 'soon' } : { t: `Due in ${d} days · ${dueText(a)}`, c: '' };
}

// A homework made only of lessons from one module is a module study plan: show the module name, no due date.
export function hwView(a, x) {
  const its = x.items.map(r => r.it);
  const lessonOnly = its.length > 0 && its.every(t => t.t === 'lesson');
  let title = a.title;
  if (lessonOnly) {
    const ms = [...new Set(its.map(t => lessonPos(t.id)).filter(Boolean).map(p => p.m))];
    if (ms.length === 1) title = `${PQ_MOD(MODS, ms[0]).label} · ${MODS[ms[0]].title.en}`;
    else if (ms.length > 1) title = 'Lessons from your coach';
  }
  return { title, lessonOnly };
}

// x = assignStat(...) ; L = lesson marks {id: %}
export function hwSteps(a, x, L) {
  let blockBy = null; // title of the first earlier lesson in this homework that is not passed
  return x.items.map((r, i) => {
    const s = { i, r, kind: r.it.t, done: r.done, lock: '', href: '', title: '', sub: '' };
    if (r.it.t === 'lesson') {
      const l = byId[r.it.id], p = lessonPos(r.it.id);
      s.title = l ? l.title.en : r.it.id;
      s.sub = r.mark == null ? 'Not started' : `Best mark ${r.mark}%${r.done ? '' : ` · pass mark ${PASS}%`}`;
      const prev = p && p.l > 0 ? MODS[p.m].lessons[p.l - 1] : null;
      if (blockBy && !r.done) s.lock = `Opens after “${blockBy}”`;
      else if (prev && (L[prev.id] || 0) < PASS && !r.done) s.lock = `Pass “${prev.title.en}” first`;
      else s.href = lessonHref(r.it.id, a.id);
      if (!r.done && !blockBy) blockBy = s.title;
    } else if (r.it.t === 'puzzles') {
      s.title = itemLabel(r.it, true); s.sub = r.total ? `${r.n} of ${r.total} solved` : 'No new puzzles were left to give';
      if (r.total) s.href = `practice.html?hw=${a.id}&set=${r.ids.join(',')}`;
    } else if (r.it.t === 'task') {
      s.title = 'Board task: ' + (r.it.q || ''); s.sub = r.done ? 'Solved' : 'Find the right move on the board';
      s.href = `task.html?a=${a.id}&i=${i}`;
    } else { s.title = r.it.text; s.sub = r.done ? 'Ticked' : 'Tick when you have done it' }
    return s;
  });
}
// the first thing to do in a homework (a step with a link that is not done and not locked)
export const nextStep = (steps) => steps.find(s => !s.done && !s.lock && s.href) || null;
