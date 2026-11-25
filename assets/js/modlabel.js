/* Module numbering inside a level: PQ_MOD(MODS, k) -> { lv, num, label } */
window.PQ_MOD = function (MODS, k) {
  const lvOf = (m) => +((/Level\s*(\d)/.exec(m && m.level && m.level.en) || [, 1])[1]);
  const lv = lvOf(MODS[k]); let num = 0;
  for (let i = 0; i <= k; i++) if (lvOf(MODS[i]) === lv) num++;
  return { lv, num, label: 'Level ' + lv + ' · Module ' + num };
};
