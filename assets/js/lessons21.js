/* Purple Queen Chess Academy — Level 3 final test.
   30 tasks built from Level 3 Modules 1 to 6 (five per module, spread over the lessons of each module). Pass mark 70%.
   Passing completes Level 3 and unlocks the academy completion certificate. Sinhala text needs coach review. */
(function () {
  const T = (en, si) => ({ en, si });
  const P = window.PQ_PRACTICE || {};
  const mods = (window.PQ_MODULES || []).filter(m => /Level\s*3/.test(m.level.en) && m.lessons.length && m.lessons[0].id.indexOf('l3-') === 0 && m.lessons[0].id !== 'l3-final');
  const tasks = [];
  mods.forEach(m => {
    const n = m.lessons.length;
    for (let j = 0; j < 5; j++) {
      const l = m.lessons[j % n], bank = P[l.id] || [];
      if (bank.length) tasks.push(bank[Math.floor(j / n) % bank.length]);
    }
  });
  window.PQ_MODULE_21 = {
    level: T("Level 3 · Queen", "මට්ටම 3 · රැජින"),
    title: T("Level 3 final test", "තුන්වන මට්ටමේ අවසාන පරීක්ෂණය"),
    lessons: [{
      id: "l3-final", title: T("Final test: 30 tasks", "අවසාන පරීක්ෂණය: කාර්ය 30"), steps: [
        { text: T("This is the Level 3 final test. It has 30 tasks from all six Level 3 modules: positional play, opening preparation, endgames, game analysis, arbiter rules and tournament preparation. You need 70% to pass.", "මෙය තුන්වන මට්ටමේ අවසාන පරීක්ෂණයයි. පොසිෂනල් ක්‍රීඩාව, ඔපනින් සූදානම, එන්ඩ් ගේම්, ක්‍රීඩා විශ්ලේෂණය, ආබිටර් නීති සහ තරඟ සූදානම යන තුන්වන මට්ටමේ මොඩියුල හයෙන්ම කාර්ය 30ක් තියෙනවා. සමත් වෙන්න ඔයාට 70% ක් ඕනේ.") },
        { text: T("Work on your own. Think about structure, plans and rules, and calculate carefully.", "තනියම කරන්න. ස්ට්‍රක්චර් එක, සැලසුම් සහ නීති ගැන හිතලා, ප්‍රවේශමෙන් ගණනය කරන්න.") },
        { text: T("After you pass, you can download the academy certificate for completing all three levels. Congratulations, Queen level!", "ඔයා සමත් වුණාම, මට්ටම් තුනම සම්පූර්ණ කිරීම වෙනුවෙන් ඇකඩමි සහතිකය බාගත කරන්න පුළුවන්. සුබ පැතුම්, රැජින මට්ටම!") }
      ],
    }],
  };
  P["l3-final"] = tasks;
  window.PQ_PRACTICE = P;
  window.PQ_MODULES = (window.PQ_MODULES || []).concat([window.PQ_MODULE_21]);
})();
