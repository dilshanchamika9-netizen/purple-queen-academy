/* Module numbering inside a level: PQ_MOD(MODS, k) -> { lv, num, label } */
window.PQ_MOD = function (MODS, k) {
  const lvOf = (m) => +((/Level\s*(\d)/.exec(m && m.level && m.level.en) || [, 1])[1]);
  const lv = lvOf(MODS[k]); let num = 0;
  for (let i = 0; i <= k; i++) if (lvOf(MODS[i]) === lv) num++;
  return { lv, num, label: 'Level ' + lv + ' · Module ' + num };
};

/* Coach unlocks for this student (saved on the device by whoAmI): {m:[module numbers], l:["module:lesson"]} */
window.PQ_UL = function () { try { return JSON.parse(localStorage.getItem('pq-unlock') || '{}') || {} } catch (e) { return {} } };
window.PQ_ULLES = function (k, i) { var u = window.PQ_UL(); return (u.m || []).indexOf(k) >= 0 || (u.l || []).indexOf(k + ':' + i) >= 0 };
window.PQ_ULMOD = function (k) { var u = window.PQ_UL(); return (u.m || []).indexOf(k) >= 0 || (u.l || []).some(function (x) { return x.split(':')[0] === String(k) }) };

/* Strict course order: module k is open only when every lesson of module k-1 is passed (mark >= pass).
   Level 2 starts only after all of Level 1 is done, Level 3 only after Level 2. L = {lessonId: mark}.
   A coach can open any module or lesson for one student (PQ_UL). */
window.PQ_MODOPEN = function (MODS, L, k, pass) {
  pass = pass || 70; if (k <= 0 || window.PQ_ULMOD(k)) return true;
  return MODS[k - 1].lessons.every(function (l) { return ((L || {})[l.id] || 0) >= pass });
};
/* lesson i of module k is open only when every earlier lesson of that module is passed (and the module is open) */
window.PQ_LESSONOPEN = function (MODS, L, k, i, pass) {
  pass = pass || 70; if (window.PQ_ULLES(k, i)) return true; if (!window.PQ_MODOPEN(MODS, L, k, pass)) return false;
  for (var j = 0; j < i; j++) if (((L || {})[MODS[k].lessons[j].id] || 0) < pass) return false;
  return true;
};
