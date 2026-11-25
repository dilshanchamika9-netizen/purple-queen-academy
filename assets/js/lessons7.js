/* Purple Queen Chess Academy — Level 1 promotion test.
   30 tasks built from Modules 1 to 6 (five per module, chosen evenly across each module). Pass mark 70% like every lesson.
   The coach adds the supervised games with notation, then promotes the student. */
(function () {
  const T = (en, si) => ({ en, si });
  const mods = (window.PQ_MODULES || []).slice(0, 6), P = window.PQ_PRACTICE || {};
  const tasks = [];
  mods.forEach(m => {
    const n = m.lessons.length;
    for (let i = 0; i < 5; i++) {
      const l = m.lessons[Math.floor(i * n / 5)], bank = P[l.id] || [];
      const t = bank.find(x => x.type === 'move' || x.type === 'square' || x.type === 'promo') || bank[0];
      if (t) tasks.push(t);
    }
  });
  window.PQ_MODULE_7 = {
    level: T("Level 1 · Pawn", "මට්ටම 1 · පෝන්"),
    title: T("Level 1 promotion test", "පළමු මට්ටමේ උසස්වීම් පරීක්ෂණය"),
    lessons: [{
      id: "l1-promotion", title: T("Promotion test: 30 tasks", "උසස්වීම් පරීක්ෂණය: කාර්ය 30"), steps: [
        { text: T("This is the Level 1 promotion test. It has 30 tasks from all six modules. You need 70% to pass.", "මෙය පළමු මට්ටමේ උසස්වීම් පරීක්ෂණයයි. මොඩියුල හයෙන්ම කාර්ය 30ක් තියෙනවා. සමත් වෙන්න 70%ක් ඕන.") },
        { text: T("Work on your own. Read each task slowly, then click your answer.", "තනියම කරන්න. හැම කාර්යයක්ම හෙමින් කියවලා, ඊට පස්සේ උත්තරය ක්ලික් කරන්න.") },
        { text: T("After you pass, your coach plays supervised games with you and writes the moves. Then you move up to Level 2.", "ඔයා සමත් වුණාම, ඔයාගේ කෝච් ඔයත් එක්ක අධීක්ෂණය යටතේ ක්‍රීඩා කරලා ඇදීම් ලියනවා. ඊට පස්සේ ඔයා 2 මට්ටමට යනවා.") },
      ],
    }],
  };
  P["l1-promotion"] = tasks;
  window.PQ_PRACTICE = P;
  window.PQ_MODULES = (window.PQ_MODULES || []).concat([window.PQ_MODULE_7]);
})();
