/* Purple Queen Chess Academy — Level 1 · Module 3: Check, checkmate and stalemate
   Same step format as lessons.js / lessons2.js.
   Extra helper: window.PQ_FP(placement) turns a FEN piece-placement string into a position object.
   Extra optional fields (ignored by the player, used by the automatic tests): turn:'b' on a step,
   chk:'check'|'mate'|'stale' on a task, v:'mate'|'set' on a move task. */
(function () {
  const T = (en, si) => ({ en, si });
  const YES = T("Yes", "ඔව්"), NO = T("No", "නැහැ");
  const fp = window.PQ_FP = window.PQ_FP || function (placement) {
    const pos = {}, F = "abcdefgh";
    placement.split("/").forEach((row, i) => {
      let f = 0;
      for (const ch of row) {
        if (/\d/.test(ch)) { f += +ch; continue; }
        pos[F[f] + (8 - i)] = (ch === ch.toUpperCase() ? "w" : "b") + ch.toUpperCase();
        f++;
      }
    });
    return pos;
  };

  /* positions */
  const CK_R = fp("4k3/8/8/8/8/8/8/4R1K1");
  const CK_B = fp("6k1/8/8/8/2B5/8/8/6K1");
  const CK_N = fp("6k1/8/5N2/8/8/8/8/6K1");
  const CK_P = fp("4k3/3P4/8/8/8/8/8/4K3");
  const P3 = fp("R3r3/7k/8/8/8/2B5/8/4K3");
  const K_ONLY = fp("4r3/6k1/8/8/8/8/8/4K3");
  const KN = fp("8/6k1/8/8/8/5n2/6P1/4K3");
  const BR = fp("6k1/5ppp/8/8/8/8/8/R5K1");
  const SCH = fp("r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR");
  const STM = fp("7k/5K2/6Q1/8/8/8/8/8");
  const S1 = fp("7k/5K2/4Q3/8/8/8/8/8");
  const SMO = fp("6rk/5Npp/8/8/8/8/8/6K1");

  window.PQ_MODULE_3 = {
    level: T("Level 1 · Pawn", "මට්ටම 1 · පෝන්"),
    title: T("Check, checkmate and stalemate", "චෙක්, චෙක්මේට් සහ ස්ටේල්මේට්"),
    lessons: [
      { id: "check", title: T("What is check?", "චෙක් කියන්නේ මොකක්ද?"), steps: [
        { pos: CK_R, hl: ["e1", "e8"], text: T("Check means a piece attacks the enemy king. Here the white rook on e1 attacks the black king on e8.", "චෙක් (check) කියන්නේ ඉත්තෙකුට සතුරු රජුට ප්‍රහාර කරන්න පුළුවන් වීම. මෙතන e1 හි තියෙන සුදු රුක් එක e8 හි තියෙන කළු රජුට ප්‍රහාර කරනවා.") },
        { dots: ["e2", "e3", "e4", "e5", "e6", "e7"], hl: ["e8"], text: T("The rook sees along the whole e-file, and nothing is in the way. The king is in check.", "රුක් එකට e සිරස් පේළිය පුරාම පේනවා, අතරේ කිසිම ඉත්තෙක් නෑ. රජුට චෙක්.") },
        { pos: CK_B, dots: ["d5", "e6", "f7"], hl: ["c4", "g8"], text: T("A bishop can give check along a diagonal. The bishop on c4 attacks the king on g8.", "බිෂොප් කෙනෙකුට ඇද පේළියක් දිගේ චෙක් දෙන්න පුළුවන්. c4 හි බිෂොප් g8 හි රජුට ප්‍රහාර කරනවා.") },
        { pos: CK_N, hl: ["f6", "g8"], text: T("A knight gives check with its L-jump. The knight on f6 attacks g8.", "නයිට් කෙනෙක් චෙක් දෙන්නේ එහි L හැඩේ පිම්මෙන්. f6 හි නයිට් g8 ට ප්‍රහාර කරනවා.") },
        { pos: CK_P, hl: ["d7", "e8"], text: T("Even a pawn can give check. A pawn attacks one square diagonally forward: the pawn on d7 attacks e8.", "පෝන් එකකටත් චෙක් දෙන්න පුළුවන්. පෝන් එක ප්‍රහාර කරන්නේ ඉදිරියෙන් ඇදට පිහිටි කොටුවටයි: d7 හි පෝන් e8 ට ප්‍රහාර කරනවා.") },
        { text: T("A king can never be captured. When your king is in check, you must stop the check at once. We learn how in the next lesson.", "රජුව කවදාවත් කපන්න බෑ. ඔයාගේ රජුට චෙක් වුණාම ඒක වහාම නවත්තන්න ඕන. කොහොමද කියලා ඊළඟ පාඩමෙන් ඉගෙන ගමු.") },
      ] },

      { id: "escape-check", title: T("Three ways out of check", "චෙක් එකෙන් ගැලවෙන ක්‍රම තුන"), steps: [
        { pos: P3, hl: ["e1", "e8"], text: T("White is in check from the black rook on e8. You must get out of check on this very move.", "e8 හි කළු රුක් එකෙන් සුදුට චෙක්. මේ ඇදීමෙන්ම චෙක් එකෙන් ගැලවෙන්න ඕන.") },
        { pos: P3, move: ["e1", "d1"], hl: ["d1"], text: T("Way 1: move the king to a square that is not attacked. Kd1 is safe.", "ක්‍රමය 1: රජුව ප්‍රහාර නැති කොටුවකට ඇදන්න. Kd1 ආරක්ෂිතයි.") },
        { pos: P3, move: ["a8", "e8"], caps: ["e8"], text: T("Way 2: capture the piece that gives check. The white rook takes the black rook.", "ක්‍රමය 2: චෙක් දෙන ඉත්තාව කපන්න. සුදු රුක් එක කළු රුක් එක කපනවා.") },
        { pos: P3, move: ["c3", "e5"], hl: ["e5"], text: T("Way 3: block. Put a piece between the checking piece and the king. The bishop goes to e5.", "ක්‍රමය 3: අවහිර කරන්න. චෙක් දෙන ඉත්තාවයි රජුයි අතරට වෙන ඉත්තෙක් දාන්න. බිෂොප් එක e5 ට යනවා.") },
        { pos: KN, hl: ["f3", "e1"], text: T("You cannot block a knight check, because a knight jumps over pieces. Only the king can move away, or you capture the knight.", "නයිට් චෙක් එකක් අවහිර කරන්න බෑ, නයිට් එක ඉත්තන් උඩින් පනිනවා. රජුට ඇදෙන්න හරි, නයිට් එක කපන්න හරි විතරයි පුළුවන්.") },
        { pos: KN, move: ["g2", "f3"], caps: ["f3"], text: T("Here the pawn on g2 captures the knight. If none of the three ways works, it is checkmate.", "මෙතන g2 හි පෝන් එක නයිට් එක කපනවා. මේ ක්‍රම තුනෙන් එකක්වත් බැරි නම් ඒක චෙක්මේට්.") },
      ] },

      { id: "checkmate", title: T("Checkmate", "චෙක්මේට්"), steps: [
        { pos: BR, hl: ["g8"], text: T("Checkmate means the king is in check and there is no way out. The game ends and the player who gave the mate wins.", "චෙක්මේට් (checkmate) කියන්නේ රජුට චෙක් වෙලා ගැලවෙන්න ක්‍රමයක් නැති වීම. ක්‍රීඩාව ඉවරයි, මේට් දුන්නු කෙනා දිනනවා.") },
        { pos: BR, move: ["a1", "a8"], hl: ["a8", "g8"], text: T("Ra8: the rook gives check along the 8th rank.", "Ra8: රුක් එක 8 වන තිරස් පේළිය දිගේ චෙක් දෙනවා.") },
        { xs: ["f8", "h8"], soft: ["f7", "g7", "h7"], text: T("Can the king move? f8 and h8 are attacked by the rook, and the king’s own pawns fill f7, g7 and h7.", "රජුට ඇදෙන්න පුළුවන්ද? f8 සහ h8 රුක් එකට ප්‍රහාර කරන කොටු, f7, g7, h7 රජුගේම පෝන් වලින් පිරිලා.") },
        { hl: ["a8"], text: T("Can anything capture the rook? No. Can anything block between a8 and g8? No. So there is no escape.", "රුක් එක කපන්න කිසිම ඉත්තෙකුට බෑ. a8 සහ g8 අතරට අවහිර කරන්නත් බෑ. ඒ නිසා ගැලවෙන්න ක්‍රමයක් නෑ.") },
        { text: T("That is checkmate. Always ask three questions: can the king move, can I capture the checker, can I block? Three times no means mate.", "ඒක චෙක්මේට්. හැමවිටම ප්‍රශ්න තුනක් අහන්න: රජුට ඇදෙන්න පුළුවන්ද, චෙක් දෙන ඉත්තාව කපන්න පුළුවන්ද, අවහිර කරන්න පුළුවන්ද? තුනටම නැහැ කියන්නේ මේට්.") },
        { pos: SCH, move: ["h5", "f7"], caps: ["f7"], hl: ["c4"], text: T("Another mate: the queen takes f7. The bishop on c4 guards her, so the king cannot take her. Checkmate!", "තව මේට් එකක්: රැජින f7 කපනවා. c4 හි බිෂොප් ඇයව ආරක්ෂා කරන නිසා රජුට ඇයව කපන්න බෑ. චෙක්මේට්!") },
      ] },

      { id: "stalemate", title: T("Stalemate", "ස්ටේල්මේට්"), steps: [
        { pos: STM, hl: ["h8"], text: T("Black to move. The king is not in check, but it has no legal move. This is stalemate, and the game is a draw.", "කළුගේ වාරය. රජුට චෙක් නැහැ, ඒත් නීතිමය ඇදීමක් එකක්වත් නැහැ. මේක ස්ටේල්මේට් (stalemate), ක්‍රීඩාව ඩ්‍රෝ.") },
        { xs: ["g8", "g7", "h7"], text: T("The king cannot go to g8, g7 or h7, because the queen and the white king attack them.", "රජුට g8, g7, h7 වලට යන්න බෑ, රැජිනයි සුදු රජුයි ඒවාට ප්‍රහාර කරන නිසා.") },
        { hl: ["g6", "h8"], text: T("The queen on g6 does not attack h8. So there is no check. No check and no move means stalemate.", "g6 හි රැජින h8 ට ප්‍රහාර කරන්නේ නෑ. ඒ නිසා චෙක් නැහැ. චෙක් නැතුව ඇදීමත් නැත්නම් ඒක ස්ටේල්මේට්.") },
        { text: T("A stalemate is a draw, written ½–½. The side with more pieces does not win. Be careful when you are far ahead!", "ස්ටේල්මේට් එක ඩ්‍රෝ එකක්, ලියන්නේ ½–½ කියලා. ඉත්තන් වැඩියෙන් ඉන්න පැත්තට දිනන්න බෑ. ගොඩක් ඉදිරියෙන් ඉන්නකොට පරිස්සම් වෙන්න!") },
        { pos: S1, move: ["e6", "g6"], hl: ["g6"], text: T("White is winning here. But Qg6?? is stalemate, a draw. A big mistake!", "මෙතන සුදු දිනනවා. ඒත් Qg6?? කියන්නේ ස්ටේල්මේට්, ඩ්‍රෝ. ලොකු වැරැද්දක්!") },
        { pos: S1, move: ["e6", "h6"], hl: ["h6"], text: T("Qh6 is checkmate instead. Before each move ask: does my opponent still have a legal move?", "ඒ වෙනුවට Qh6 චෙක්මේට්. හැම ඇදීමකටම කලින් අහන්න: මගේ ප්‍රතිවාදියාට තවමත් නීතිමය ඇදීමක් තියෙනවද?") },
      ] },

      { id: "check-or-mate", title: T("Check, mate or stalemate?", "චෙක්ද, මේට්ද, ස්ටේල්මේට්ද?"), steps: [
        { pos: fp("6k1/8/5N2/8/8/8/8/6K1"), turn: "b", hl: ["g8"], text: T("Black to move and the king is attacked. Can it move away or capture the knight? Yes. So this is only check.", "කළුගේ වාරය, රජුට ප්‍රහාර වෙලා. රජුට ඇදෙන්න හරි නයිට් එක කපන්න හරි පුළුවන්. ඒ නිසා මේක චෙක් විතරයි.") },
        { pos: SMO, turn: "b", hl: ["f7", "h8"], text: T("Here the king is attacked and every escape is blocked by its own pieces. Nothing captures the knight. Checkmate.", "මෙතන රජුට ප්‍රහාර වෙලා, ගැලවෙන හැම පාරක්ම රජුගේම ඉත්තන් අවහිර කරලා. නයිට් එක කපන්නත් බෑ. චෙක්මේට්.") },
        { pos: fp("7k/8/6QK/8/8/8/8/8"), turn: "b", hl: ["h8"], text: T("The king is not attacked, but it cannot move anywhere. Stalemate.", "රජුට ප්‍රහාර නෑ, ඒත් කොහේවත් ඇදෙන්න බෑ. ස්ටේල්මේට්.") },
        { text: T("Step 1: is the king attacked? If no, and no piece can move at all, it is stalemate.", "පියවර 1: රජුට ප්‍රහාර වෙලාද? නැත්නම්, ඒ වගේම කිසිම ඉත්තෙකුට ඇදෙන්න බැරි නම් ඒක ස්ටේල්මේට්.") },
        { text: T("Step 2: if the king is attacked, look for a way out. A way out exists: check. No way out: checkmate.", "පියවර 2: රජුට ප්‍රහාර වෙලා නම් ගැලවෙන්න ක්‍රමයක් බලන්න. ක්‍රමයක් තියෙනවා නම් චෙක්. ක්‍රමයක් නැත්නම් චෙක්මේට්.") },
      ] },

      { id: "mate-in-one", title: T("Mate in one", "එක ඇදීමකින් මේට්"), steps: [
        { pos: fp("3r2k1/5ppp/8/8/8/8/8/3R2K1"), move: ["d1", "d8"], caps: ["d8"], text: T("Back-rank mate: the king is shut in by its own pawns. The rook takes on d8 and it is mate.", "පසු පේළියේ මේට් (back-rank mate): රජුව ඔහුගේම පෝන් වලින් වැහිලා. රුක් එක d8 කපනවා, ඒක මේට්.") },
        { pos: fp("7k/8/5KQ1/8/8/8/8/8"), move: ["g6", "g7"], hl: ["g7"], text: T("Queen and king: the queen goes next to the king and the white king guards her. Qg7 is mate.", "රැජිනයි රජුයි: රැජින රජුට ළඟින් ඉන්නවා, සුදු රජු ඇයව ආරක්ෂා කරනවා. Qg7 මේට්.") },
        { pos: fp("7k/R7/8/8/8/8/8/1R4K1"), move: ["b1", "b8"], hl: ["b8", "a7"], text: T("Two rooks: one rook cuts off the 7th rank, the other gives check on the 8th. Rb8 is mate.", "රුක් දෙකක්: එක රුක් එකක් 7 වන පේළිය වහනවා, අනිත් එක 8 වන පේළියේ චෙක් දෙනවා. Rb8 මේට්.") },
        { pos: fp("6rk/6pp/8/4N3/8/8/8/6K1"), move: ["e5", "f7"], hl: ["f7"], text: T("Smothered mate: the king is boxed in by its own rook and pawns, and a knight gives check. Nf7 is mate.", "ස්මදර්ඩ් මේට් (smothered mate): රජුව ඔහුගේම රුක් එකයි පෝන් වලින් වැහිලා, නයිට් එකක් චෙක් දෙනවා. Nf7 මේට්.") },
        { text: T("Before every move, check these first: all checks, all captures. A mate in one is always a check.", "හැම ඇදීමකටම කලින් මුලින් බලන්න: සියලුම චෙක්, සියලුම කැපීම්. එක ඇදීමකින් මේට් එක හැමවිටම චෙක් එකක්.") },
      ] },
    ],
  };

  const P = {
    "check": [
      { type: "square", pos: fp("6k1/8/8/8/2B5/8/8/R5K1"), q: T("The black king is in check. Click the white piece that gives check.", "කළු රජුට චෙක්. චෙක් දෙන සුදු ඉත්තා ක්ලික් කරන්න."), ans: ["c4"] },
      { type: "choice", pos: fp("4k3/8/8/4P3/8/8/8/4R1K1"), chk: "none", q: T("Black to move. Is the black king in check?", "කළුගේ වාරය. කළු රජුට චෙක්ද?"), opts: [YES, NO], a: 1 },
      { type: "choice", q: T("Can you block a check that comes from a knight?", "නයිට් කෙනෙක් දෙන චෙක් එකක් අවහිර කරන්න පුළුවන්ද?"), opts: [YES, NO], a: 1 },
      { type: "square", pos: fp("4k3/8/8/1B6/8/8/R7/6K1"), q: T("Click the white piece that gives check.", "චෙක් දෙන සුදු ඉත්තා ක්ලික් කරන්න."), ans: ["b5"] },
      { type: "choice", q: T("Can a king ever be captured in chess?", "චෙස් ක්‍රීඩාවේදී රජුව කපන්න පුළුවන්ද?"), opts: [YES, NO], a: 1 },
      { type: "choice", pos: fp("1k6/8/1R6/8/8/8/8/6K1"), chk: "check", q: T("Black to move. Is the black king in check?", "කළුගේ වාරය. කළු රජුට චෙක්ද?"), opts: [YES, NO], a: 0 },
    ],
    "escape-check": [
      { type: "move", pos: P3, v: "legal", q: T("White is in check. Block the check with the bishop.", "සුදුට චෙක්. බිෂොප් එකෙන් චෙක් එක අවහිර කරන්න."), ans: [["c3", "e5"]] },
      { type: "move", pos: P3, v: "legal", q: T("White is in check. Capture the piece that gives check.", "සුදුට චෙක්. චෙක් දෙන ඉත්තාව කපන්න."), ans: [["a8", "e8"]] },
      { type: "move", pos: K_ONLY, v: "set", q: T("The only way out is to move the king. Move it to a safe square.", "ගැලවෙන්න තියෙන එකම ක්‍රමය රජුව ඇදීම. ආරක්ෂිත කොටුවකට ඇදන්න."), ans: [["e1", "d1"], ["e1", "f1"], ["e1", "d2"], ["e1", "f2"]] },
      { type: "choice", pos: KN, q: T("A knight gives check. Which way out is NOT possible?", "නයිට් කෙනෙක් චෙක් දෙනවා. කුමන ක්‍රමය කරන්න බැරිද?"), opts: [T("Move the king", "රජුව ඇදීම"), T("Capture the knight", "නයිට් එක කැපීම"), T("Block between the knight and the king", "නයිට් එකයි රජුයි අතරට අවහිර කිරීම")], a: 2 },
      { type: "square", pos: KN, q: T("Click the white piece that can capture the checking knight.", "චෙක් දෙන නයිට් එක කපන්න පුළුවන් සුදු ඉත්තා ක්ලික් කරන්න."), ans: ["g2"] },
      { type: "choice", q: T("Your king is in check. May you make a move somewhere else on the board?", "ඔයාගේ රජුට චෙක්. පුවරුවේ වෙන තැනක ඇදීමක් කරන්න පුළුවන්ද?"), opts: [YES, NO], a: 1 },
    ],
    "checkmate": [
      { type: "move", pos: fp("6k1/5ppp/8/8/8/8/R7/6K1"), v: "mate", q: T("White to move. Give checkmate in one move.", "සුදුගේ වාරය. එක ඇදීමකින් චෙක්මේට් දෙන්න."), ans: [["a2", "a8"]] },
      { type: "move", pos: SCH, v: "mate", q: T("White to move. Give checkmate in one move.", "සුදුගේ වාරය. එක ඇදීමකින් චෙක්මේට් දෙන්න."), ans: [["h5", "f7"]] },
      { type: "move", pos: fp("7k/8/5KQ1/8/8/8/8/8"), v: "mate", q: T("White to move. Give checkmate in one move.", "සුදුගේ වාරය. එක ඇදීමකින් චෙක්මේට් දෙන්න."), ans: [["g6", "g7"]] },
      { type: "choice", pos: fp("4R1k1/5pp1/7p/8/8/8/8/6K1"), chk: "check", q: T("Black to move. The rook gives check. Is it checkmate?", "කළුගේ වාරය. රුක් එක චෙක් දෙනවා. ඒක චෙක්මේට්ද?"), opts: [YES, NO], a: 1 },
      { type: "choice", pos: fp("4R1k1/5ppp/8/8/8/8/8/6K1"), chk: "mate", q: T("Black to move. Is this checkmate?", "කළුගේ වාරය. මේක චෙක්මේට්ද?"), opts: [YES, NO], a: 0 },
      { type: "choice", q: T("A player gives checkmate. What is the result?", "කෙනෙක් චෙක්මේට් දුන්නා. ප්‍රතිඵලය මොකක්ද?"), opts: [T("The player who gave the mate wins", "මේට් දුන්නු කෙනා දිනනවා"), T("A draw", "ඩ්‍රෝ"), T("The player who was mated wins", "මේට් වුණු කෙනා දිනනවා")], a: 0 },
    ],
    "stalemate": [
      { type: "move", pos: S1, v: "mate", q: T("White to move. Give checkmate, and avoid stalemate!", "සුදුගේ වාරය. චෙක්මේට් දෙන්න, ස්ටේල්මේට් වළක්වන්න!"), ans: [["e6", "h6"], ["e6", "h3"]] },
      { type: "choice", pos: S1, q: T("White to move. Which move is a stalemate, a draw?", "සුදුගේ වාරය. ස්ටේල්මේට් එකක්, ඩ්‍රෝ එකක් වෙන්නේ කුමන ඇදීමද?"), opts: ["Qh6", "Qg6", "Qe8"], a: 1 },
      { type: "choice", pos: STM, chk: "stale", q: T("Black to move. The king is not in check and cannot move. What is this?", "කළුගේ වාරය. රජුට චෙක් නැහැ, ඇදෙන්නත් බෑ. මේක මොකක්ද?"), opts: [T("Checkmate", "චෙක්මේට්"), T("Stalemate", "ස්ටේල්මේට්"), T("Check", "චෙක්")], a: 1 },
      { type: "choice", pos: fp("7k/5K2/8/8/8/8/8/6Q1"), chk: "none", q: T("Black to move. Is this stalemate?", "කළුගේ වාරය. මේක ස්ටේල්මේට්ද?"), opts: [YES, NO], a: 1 },
      { type: "choice", q: T("What is the result of a stalemate?", "ස්ටේල්මේට් එකක ප්‍රතිඵලය මොකක්ද?"), opts: [T("The player with more pieces wins", "ඉත්තන් වැඩි කෙනා දිනනවා"), T("A draw", "ඩ්‍රෝ"), T("The player who cannot move wins", "ඇදෙන්න බැරි කෙනා දිනනවා")], a: 1 },
      { type: "choice", q: T("You are far ahead. What should you check before each move?", "ඔයා ගොඩක් ඉදිරියෙන්. හැම ඇදීමකටම කලින් මොකක්ද බලන්න ඕන?"), opts: [T("That my opponent still has a legal move", "මගේ ප්‍රතිවාදියාට තවමත් නීතිමය ඇදීමක් තියෙනවද කියලා"), T("That my queen is in the centre", "මගේ රැජින මැද ඉන්නවද කියලා"), T("Nothing, I always win", "කිසිවක් නෑ, මම හැමවිටම දිනනවා")], a: 0 },
    ],
    "check-or-mate": [
      { type: "choice", pos: fp("4R1k1/5ppp/8/8/8/8/8/6K1"), chk: "mate", q: T("Black to move. What is this?", "කළුගේ වාරය. මේක මොකක්ද?"), opts: [T("Check", "චෙක්"), T("Checkmate", "චෙක්මේට්"), T("Stalemate", "ස්ටේල්මේට්")], a: 1 },
      { type: "choice", pos: fp("4R1k1/5pp1/7p/8/8/8/8/6K1"), chk: "check", q: T("Black to move. What is this?", "කළුගේ වාරය. මේක මොකක්ද?"), opts: [T("Check", "චෙක්"), T("Checkmate", "චෙක්මේට්"), T("Stalemate", "ස්ටේල්මේට්")], a: 0 },
      { type: "choice", pos: STM, chk: "stale", q: T("Black to move. What is this?", "කළුගේ වාරය. මේක මොකක්ද?"), opts: [T("Check", "චෙක්"), T("Checkmate", "චෙක්මේට්"), T("Stalemate", "ස්ටේල්මේට්")], a: 2 },
      { type: "choice", pos: fp("6k1/8/5N2/8/8/8/8/6K1"), chk: "check", q: T("Black to move. What is this?", "කළුගේ වාරය. මේක මොකක්ද?"), opts: [T("Check", "චෙක්"), T("Checkmate", "චෙක්මේට්"), T("Stalemate", "ස්ටේල්මේට්")], a: 0 },
      { type: "choice", pos: SMO, chk: "mate", q: T("Black to move. What is this?", "කළුගේ වාරය. මේක මොකක්ද?"), opts: [T("Check", "චෙක්"), T("Checkmate", "චෙක්මේට්"), T("Stalemate", "ස්ටේල්මේට්")], a: 1 },
      { type: "choice", pos: fp("7k/8/6QK/8/8/8/8/8"), chk: "stale", q: T("Black to move. What is this?", "කළුගේ වාරය. මේක මොකක්ද?"), opts: [T("Check", "චෙක්"), T("Checkmate", "චෙක්මේට්"), T("Stalemate", "ස්ටේල්මේට්")], a: 2 },
    ],
    "mate-in-one": [
      { type: "move", pos: fp("3r2k1/5ppp/8/8/8/8/8/3R2K1"), v: "mate", q: T("White to move. Give checkmate in one move.", "සුදුගේ වාරය. එක ඇදීමකින් චෙක්මේට් දෙන්න."), ans: [["d1", "d8"]] },
      { type: "move", pos: fp("6k1/5ppp/8/8/8/8/8/Q5K1"), v: "mate", q: T("White to move. Give checkmate in one move.", "සුදුගේ වාරය. එක ඇදීමකින් චෙක්මේට් දෙන්න."), ans: [["a1", "a8"]] },
      { type: "move", pos: fp("1k6/8/1K6/8/8/8/8/6Q1"), v: "mate", q: T("White to move. Give checkmate in one move.", "සුදුගේ වාරය. එක ඇදීමකින් චෙක්මේට් දෙන්න."), ans: [["g1", "g8"]] },
      { type: "move", pos: fp("7k/R7/8/8/8/8/8/1R4K1"), v: "mate", q: T("White to move. Give checkmate in one move.", "සුදුගේ වාරය. එක ඇදීමකින් චෙක්මේට් දෙන්න."), ans: [["b1", "b8"]] },
      { type: "move", pos: fp("6rk/6pp/8/4N3/8/8/8/6K1"), v: "mate", q: T("White to move. Give checkmate in one move.", "සුදුගේ වාරය. එක ඇදීමකින් චෙක්මේට් දෙන්න."), ans: [["e5", "f7"]] },
      { type: "move", pos: SCH, v: "mate", q: T("White to move. Give checkmate in one move.", "සුදුගේ වාරය. එක ඇදීමකින් චෙක්මේට් දෙන්න."), ans: [["h5", "f7"]] },
    ],
  };

  window.PQ_PRACTICE = Object.assign(window.PQ_PRACTICE || {}, P);
  window.PQ_MODULES = (window.PQ_MODULES || [window.PQ_MODULE]).concat([window.PQ_MODULE_3]);
})();
