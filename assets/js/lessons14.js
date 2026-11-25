/* Purple Queen Chess Academy — Level 2 promotion test.
   30 tasks built from Level 2 Modules 1 to 6 (five per module, spread over the lessons of each module). Pass mark 70%.
   The coach adds the supervised rated-style games, then promotes the student to Level 3. */
(function () {
  const T = (en, si) => ({ en, si });
  const P = window.PQ_PRACTICE || {};
  const mods = (window.PQ_MODULES || []).filter(m => /Level\s*2/.test(m.level.en) && m.lessons.length && m.lessons[0].id.indexOf('l2-') === 0);
  const tasks = [];
  mods.forEach(m => {
    const n = m.lessons.length;
    for (let j = 0; j < 5; j++) {
      const l = m.lessons[j % n], bank = (P[l.id] || []).filter(x => x.type === 'move' || x.pos || true);
      if (bank.length) tasks.push(bank[Math.floor(j / n) % bank.length]);
    }
  });
  window.PQ_MODULE_14 = {
    level: T("Level 2 · Knight", "මට්ටම 2 · නයිට්"),
    title: T("Level 2 promotion test", "දෙවන මට්ටමේ උසස්වීම් පරීක්ෂණය"),
    lessons: [{
      id: "l2-promotion", title: T("Promotion test: 30 tasks", "උසස්වීම් පරීක්ෂණය: කාර්ය 30"), steps: [
        { text: T("This is the Level 2 promotion test. It has 30 tasks from all six Level 2 modules: tactics, combinations, openings, endgames, the clock and tournament rules. You need 70% to pass.", "මෙය දෙවන මට්ටමේ උසස්වීම් පරීක්ෂණයයි. උපක්‍රම, සංයෝජන, ඔපනින්, එන්ඩ් ගේම්, ඔරලෝසුව සහ තරඟ නීති යන දෙවන මට්ටමේ මොඩියුල හයෙන්ම කාර්ය 30ක් තියෙනවා. සමත් වෙන්න ඔයාට 70% ඕන.") },
        { text: T("Work on your own. Look for checks, captures and threats first, then calculate.", "තනියම කරන්න. මුලින් චෙක්, කැපීම් සහ තර්ජන හොයන්න, ඊට පස්සේ ගණනය කරන්න.") },
        { text: T("After you pass, your coach plays supervised rated-style games with you, with a clock and a scoresheet. Then you move up to Level 3.", "ඔයා සමත් වුණාම, ඔයාගේ කෝච් ඔරලෝසුවකුත් ස්කෝර්ෂීට් එකකුත් සමඟ ශ්‍රේණිගත ක්‍රීඩා ආකාරයේ අධීක්ෂණය කරන ලද ක්‍රීඩා ඔයත් එක්ක ක්‍රීඩා කරනවා. ඊට පස්සේ ඔයා තුන්වන මට්ටමට උසස් වෙනවා.") },
      ],
    }],
  };
  P["l2-promotion"] = tasks;
  window.PQ_PRACTICE = P;
  window.PQ_MODULES = (window.PQ_MODULES || []).concat([window.PQ_MODULE_14]);
})();
