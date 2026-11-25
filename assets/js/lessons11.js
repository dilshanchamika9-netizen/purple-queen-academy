/* Purple Queen Chess Academy — Level 2 · Module 4: Endgames
   King and pawn tasks: answers computed by an exhaustive King+Pawn v King solver (tablebase-style), checked against known theory. Lucena, Philidor and rook endgames still to be added. Sinhala needs coach review. */
(function () {
  const T = (en, si) => ({ en, si });
  const fp = window.PQ_FP;
  window.PQ_MODULE_11 = {
    level: T("Level 2 · Knight", "මට්ටම 2 · නයිට්"),
    title: T("Endgames", "එන්ඩ් ගේම් (Endgames)"),
    lessons: [
      { id: "l2-key-squares", title: {en:"Key squares",si:"කී ස්කොවෙයාර්ස් (ප්‍රධාන කොටු)"}, steps: [
        { pos: fp("4k3/8/8/3KP3/8/8/8/8"), hl: ["d6", "e6", "f6"], text: {en:"A pawn needs its king. The key squares of this pawn are d6, e6 and f6. If the white king reaches one of them, White wins.",si:"පෝන් එකකට තමන්ගේ රජු අවශ්‍යයි. මේ පෝන් එකේ කී ස්කොවෙයාර්ස් (key squares) d6, e6 සහ f6. සුදු රජු ඒවායින් එකකට ගියොත් සුදු දිනනවා."} },
        { pos: fp("8/4k3/8/4P3/8/8/3K4/8"), hl: ["d6", "e6", "f6"], text: {en:"If the white king is too far away to reach a key square, Black holds the draw by keeping the king in front of the pawn.",si:"සුදු රජුට කී ස්කොවෙයාර් එකකට යන්න බැරි තරම් ඈතයි නම්, කළු රජු පෝන් එක ඉදිරියේ තියාගෙන ඩ්‍රෝ කරගන්නවා."} },
        { pos: fp("4k3/8/8/3KP3/8/8/8/8"), hl: ["d6"], move: ["d5","d6"], text: {en:"Back to the first position. Kd6 puts the white king on a key square.",si:"පළවෙනි තත්වයට ආපහු. Kd6 සුදු රජු කී ස්කොවෙයාර් එකකට ගෙනියනවා."} },
        { moves: [["e8","f8"],["e5","e6"]], text: {en:"Black has no good defence. After Kf8 e6, the pawn goes forward with the king beside it.",si:"කළුට හොඳ ආරක්ෂාවක් නෑ. Kf8 e6 න් පස්සේ, රජු ළඟින් තියාගෙන පෝන් එක ඉදිරියට යනවා."} },
        { moves: [["f8","g8"],["e6","e7"]], text: {en:"…Kg8 e7. The pawn is on the seventh rank and the king protects the road ahead.",si:"…Kg8 e7. පෝන් එක හත්වන පේළියේ, රජු ඉදිරි මාවත ආරක්ෂා කරනවා."} },
        { text: {en:"Rule: put your king in front of the pawn, on a key square. Then the pawn walks up and promotes.",si:"රීතිය: ඔයාගේ රජු පෝන් එකේ ඉදිරියට, කී ස්කොවෙයාර් එකකට ගෙන යන්න. ඊට පස්සේ පෝන් එක ඉදිරියට ගිහින් උසස් වෙනවා."} }
      ] },
      { id: "l2-opposition", title: {en:"The opposition",si:"ඔපොසිෂන් (Opposition)"}, steps: [
        { pos: fp("8/4k3/8/4K3/4P3/8/8/8"), hl: ["e6"], text: {en:"Opposition: the two kings face each other on the same file with one square between. The side that does NOT have to move has the opposition.",si:"ඔපොසිෂන් (opposition): රජුන් දෙදෙනා එකම සිරස් පේළියේ කොටුවක් පරතරයකින් මුහුණට මුහුණ ලා ඉන්නවා. ඇදෙන්න ඕන නැති පැත්තට ඔපොසිෂන් එක තියෙනවා."} },
        { moves: [["e5","d5"],["e7","d7"]], text: {en:"Here it is White’s turn, so Black has the opposition. White steps aside with Kd5, Black answers Kd7, and White cannot make progress. Draw.",si:"මෙතන සුදුගේ වාරය, ඒ නිසා ඔපොසිෂන් එක කළුට. සුදු Kd5 ඇදීමෙන් පැත්තකට යනවා, කළු Kd7 න් පිළිතුරු දෙනවා, සුදුට ඉදිරියට යන්න බෑ. ඩ්‍රෝ."} },
        { pos: fp("8/4k3/8/4K3/4P3/8/8/8"), move: ["e7","f7"], text: {en:"Same position, but Black is to move. Now White has the opposition. Black must step aside.",si:"එකම තත්වය, ඒත් කළුගේ වාරය. දැන් ඔපොසිෂන් එක සුදුට. කළුට පැත්තකට යන්න වෙනවා."} },
        { moves: [["e5","f5"],["f7","g7"]], text: {en:"White then moves to a key square, for example Ke6 or Kf6, and wins the pawn race.",si:"ඊට පස්සේ සුදු කී ස්කොවෙයාර් එකකට, උදා Ke6 හෝ Kf6 ට යනවා, පෝන් ජවනිකාව දිනනවා."} },
        { text: {en:"Take the opposition: move so that your king faces the enemy king and it is the enemy’s turn. In a king and pawn ending, whoever has the opposition often wins.",si:"ඔපොසිෂන් එක ගන්න: ඔයාගේ රජු සතුරු රජුට මුහුණ ලා තියන්න, ඊට පස්සේ ඇදෙන්න ඕන සතුරාට. රජු සහ පෝන් ක්‍රීඩාවක ඔපොසිෂන් එක තියෙන කෙනා බොහෝ වෙලාවට දිනනවා."} }
      ] },
      { id: "l2-square-pawn", title: {en:"The square of the pawn",si:"පෝන් එකේ ස්කොවෙයාර් එක (Square of the pawn)"}, steps: [
        { pos: fp("6k1/8/8/8/3P4/8/8/K7"), hl: ["d4", "d8", "h8", "h4"], text: {en:"The square of the pawn tells you if a lone king can catch a pawn. Count the squares the pawn needs to promote, then draw a square with that side length.",si:"පෝන් එකේ ස්කොවෙයාර් එක (square of the pawn) මගින් තනි රජෙකුට පෝන් එකක් අල්ලන්න පුළුවන්ද කියලා කියනවා. පෝන් එකට උසස් වෙන්න ඕන කොටු ගණන ගණන් කරලා, ඒ දිගින් ස්කොවෙයාර් එකක් අඳින්න."} },
        { hl: ["d4", "d8", "h8", "h4"], text: {en:"The pawn on d4 needs 4 moves to reach d8, so the square is d4, d8, h8, h4. If the king is inside the square and it is the king’s move, it catches the pawn.",si:"d4 හි පෝන් එකට d8 ට යන්න ඇදීම් 4ක් ඕන, ඒ නිසා ස්කොවෙයාර් එක d4, d8, h8, h4. රජු ස්කොවෙයාර් එක ඇතුළේ ඉඳලා ඇදෙන්න ඕන රජුට නම්, ඒ රජු පෝන් එක අල්ලනවා."} },
        { moves: [["g8","f7"],["d4","d5"]], text: {en:"Black to move. Kf7 and the pawn runs to d5. The king is still inside the new, smaller square.",si:"කළුගේ වාරය. Kf7 සහ පෝන් එක d5 ට දුවනවා. රජු තවමත් අලුත්, පොඩි ස්කොවෙයාර් එක ඇතුළේ."} },
        { moves: [["f7","e7"],["d5","d6"]], text: {en:"…Ke7 d6+. The pawn gives check, but the king is next to it.",si:"…Ke7 d6+. පෝන් එක චෙක් දෙනවා, ඒත් රජු ඒක ළඟින්."} },
        { move: ["e7","d7"], text: {en:"…Kd7. The king stops the pawn. The white king is too far away to help, so it is a draw.",si:"…Kd7. රජු පෝන් එක නවත්වනවා. සුදු රජු උදව් කරන්න ඈතයි, ඒ නිසා ඩ්‍රෝ."} },
        { pos: fp("8/8/8/1k4P1/8/8/8/7K"), hl: ["g5", "g8", "d8", "d5"], text: {en:"Here the king on b5 is outside the square of the g5 pawn (g5, g8, d8, d5). The king cannot catch it. The pawn promotes.",si:"මෙතන b5 හි රජු g5 පෝන් එකේ ස්කොවෙයාර් එකට (g5, g8, d8, d5) පිටින්. රජුට ඒක අල්ලන්න බෑ. පෝන් එක උසස් වෙනවා."} }
      ] },
    ],
  };
  const P = {
    "l2-key-squares": [
      { type: "move", pos: fp("8/8/4k3/1K6/3P4/8/8/8"), q: {en:"White to move. Find the winning move.",si:"සුදුගේ වාරය. ජයග්‍රහණය ලබා දෙන ඇදීම සොයන්න."}, ans: [["b5","c5"],["b5","c6"]] },
      { type: "move", pos: fp("8/8/8/5Pk1/3K4/8/8/8"), q: {en:"White to move. Find the winning move.",si:"සුදුගේ වාරය. ජයග්‍රහණය ලබා දෙන ඇදීම සොයන්න."}, ans: [["d4","e5"]] },
      { type: "move", pos: fp("8/K2k4/8/2P5/8/8/8/8"), q: {en:"White to move. Find the winning move.",si:"සුදුගේ වාරය. ජයග්‍රහණය ලබා දෙන ඇදීම සොයන්න."}, ans: [["a7","b7"],["a7","b6"]] },
      { type: "move", pos: fp("2k5/8/8/4P3/6K1/8/8/8"), q: {en:"White to move. Find the winning move.",si:"සුදුගේ වාරය. ජයග්‍රහණය ලබා දෙන ඇදීම සොයන්න."}, ans: [["g4","g5"],["g4","f5"]] },
      { type: "move", pos: fp("8/3k2K1/8/8/4P3/8/8/8"), q: {en:"White to move. Find the winning move.",si:"සුදුගේ වාරය. ජයග්‍රහණය ලබා දෙන ඇදීම සොයන්න."}, ans: [["g7","f7"],["g7","f6"]] },
      { type: "choice", pos: fp("4k3/8/8/3KP3/8/8/8/8"), q: {en:"Which square is a key square for the white pawn on e5?",si:"e5 හි සුදු පෝන් එකට කී ස්කොවෙයාර් එකක් වන්නේ කුමන කොටුවද?"}, opts: [{en:"a8",si:"a8"},{en:"e6",si:"e6"},{en:"h1",si:"h1"}], a: 1 }
    ],
    "l2-opposition": [
      { type: "move", pos: fp("8/8/8/8/2Pk4/K7/8/8"), q: {en:"White to move. Which king move wins? Use the opposition and the key squares.",si:"සුදුගේ වාරය. ජයග්‍රහණය ලබා දෙන රජු ඇදීම කුමක්ද? ඔපොසිෂන් එකයි කී ස්කොවෙයාර්ස් වලයි භාවිතා කරන්න."}, ans: [["a3","b4"]] },
      { type: "move", pos: fp("8/8/1k6/8/2PK4/8/8/8"), q: {en:"White to move. Which king move wins? Use the opposition and the key squares.",si:"සුදුගේ වාරය. ජයග්‍රහණය ලබා දෙන රජු ඇදීම කුමක්ද? ඔපොසිෂන් එකයි කී ස්කොවෙයාර්ස් වලයි භාවිතා කරන්න."}, ans: [["d4","d5"]] },
      { type: "move", pos: fp("8/2k5/8/8/2KP4/8/8/8"), q: {en:"White to move. Which king move wins? Use the opposition and the key squares.",si:"සුදුගේ වාරය. ජයග්‍රහණය ලබා දෙන රජු ඇදීම කුමක්ද? ඔපොසිෂන් එකයි කී ස්කොවෙයාර්ස් වලයි භාවිතා කරන්න."}, ans: [["c4","c5"]] },
      { type: "move", pos: fp("8/6k1/8/8/3K1P2/8/8/8"), q: {en:"White to move. Which king move wins? Use the opposition and the key squares.",si:"සුදුගේ වාරය. ජයග්‍රහණය ලබා දෙන රජු ඇදීම කුමක්ද? ඔපොසිෂන් එකයි කී ස්කොවෙයාර්ස් වලයි භාවිතා කරන්න."}, ans: [["d4","e5"]] },
      { type: "choice", pos: fp("8/8/4k3/8/4K3/8/8/8"), q: {en:"White king e4, black king e6. It is White’s move. Who has the opposition?",si:"සුදු රජු e4, කළු රජු e6. සුදුගේ වාරය. ඔපොසිෂන් එක කාටද?"}, opts: [{en:"White",si:"සුදු"},{en:"Black",si:"කළු"}], a: 1 },
      { type: "choice", pos: fp("8/8/4k3/8/4K3/8/8/8"), q: {en:"Same kings, but now it is Black’s move. Who has the opposition?",si:"එකම රජුන්, ඒත් දැන් කළුගේ වාරය. ඔපොසිෂන් එක කාටද?"}, opts: [{en:"White",si:"සුදු"},{en:"Black",si:"කළු"}], a: 0 }
    ],
    "l2-square-pawn": [
      { type: "choice", pos: fp("1k6/8/8/8/5P2/8/8/7K"), q: {en:"Black to move. Can the black king catch the pawn?",si:"කළුගේ වාරය. කළු රජුට පෝන් එක අල්ලන්න පුළුවන්ද?"}, opts: [{en:"Yes, the king is inside the square",si:"ඔව්, රජු ස්කොවෙයාර් එක ඇතුළේ"},{en:"No, the pawn promotes",si:"නැහැ, පෝන් එක උසස් වෙනවා"}], a: 0 },
      { type: "choice", pos: fp("8/6k1/8/2P5/8/8/8/K7"), q: {en:"White to move. Can the black king catch the pawn?",si:"සුදුගේ වාරය. කළු රජුට පෝන් එක අල්ලන්න පුළුවන්ද?"}, opts: [{en:"Yes, the king is inside the square",si:"ඔව්, රජු ස්කොවෙයාර් එක ඇතුළේ"},{en:"No, the pawn promotes",si:"නැහැ, පෝන් එක උසස් වෙනවා"}], a: 1 },
      { type: "choice", pos: fp("5k2/8/8/8/2P5/8/8/K7"), q: {en:"Black to move. Can the black king catch the pawn?",si:"කළුගේ වාරය. කළු රජුට පෝන් එක අල්ලන්න පුළුවන්ද?"}, opts: [{en:"Yes, the king is inside the square",si:"ඔව්, රජු ස්කොවෙයාර් එක ඇතුළේ"},{en:"No, the pawn promotes",si:"නැහැ, පෝන් එක උසස් වෙනවා"}], a: 0 },
      { type: "choice", pos: fp("8/8/8/1k4P1/8/8/8/7K"), q: {en:"Black to move. Can the black king catch the pawn?",si:"කළුගේ වාරය. කළු රජුට පෝන් එක අල්ලන්න පුළුවන්ද?"}, opts: [{en:"Yes, the king is inside the square",si:"ඔව්, රජු ස්කොවෙයාර් එක ඇතුළේ"},{en:"No, the pawn promotes",si:"නැහැ, පෝන් එක උසස් වෙනවා"}], a: 1 },
      { type: "choice", pos: fp("8/5k2/8/3P4/8/8/8/K7"), q: {en:"White to move. Can the black king catch the pawn?",si:"සුදුගේ වාරය. කළු රජුට පෝන් එක අල්ලන්න පුළුවන්ද?"}, opts: [{en:"Yes, the king is inside the square",si:"ඔව්, රජු ස්කොවෙයාර් එක ඇතුළේ"},{en:"No, the pawn promotes",si:"නැහැ, පෝන් එක උසස් වෙනවා"}], a: 0 },
      { type: "choice", pos: fp("8/8/k7/4P3/8/8/8/7K"), q: {en:"White to move. Can the black king catch the pawn?",si:"සුදුගේ වාරය. කළු රජුට පෝන් එක අල්ලන්න පුළුවන්ද?"}, opts: [{en:"Yes, the king is inside the square",si:"ඔව්, රජු ස්කොවෙයාර් එක ඇතුළේ"},{en:"No, the pawn promotes",si:"නැහැ, පෝන් එක උසස් වෙනවා"}], a: 1 }
    ]
  };
  window.PQ_PRACTICE = Object.assign(window.PQ_PRACTICE || {}, P);
  window.PQ_MODULES = (window.PQ_MODULES || []).concat([window.PQ_MODULE_11]);
})();
