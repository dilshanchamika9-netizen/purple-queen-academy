/* Purple Queen Chess Academy — Level 1 · Module 6: First tactics and openings
   Extra test fields: fork:true (the answer move must attack two or more enemy pieces or give check plus attack),
   pinSq:"c6" (after the answer move that piece may have no legal move), turn:"b" on a choice task with mv. */
(function () {
  const T = (en, si) => ({ en, si });
  const YES = T("Yes", "ඔව්"), NO = T("No", "නැහැ");
  const fp = window.PQ_FP;
  const START = fp("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
  const H1 = fp("4k3/8/8/3b4/8/2N5/8/4K3");
  const H2 = fp("4k3/8/2p5/3b4/8/2N5/8/4K3");
  const F1 = fp("r3k3/8/8/1N6/8/8/8/4K3");
  const PN1 = fp("4k3/8/2n5/8/8/8/8/4KB2");
  const SK1 = fp("4q3/8/8/4k3/8/8/8/R5K1");
  const OP1 = fp("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR");
  const CAS = fp("r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R");
  const SCH0 = fp("r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR");
  const FOOL = fp("rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR");

  window.PQ_MODULE_6 = {
    level: T("Level 1 · Pawn", "මට්ටම 1 · පෝන්"),
    title: T("First tactics and openings", "මුල්ම උපක්‍රම සහ ආරම්භක ඇදීම්"),
    lessons: [
      { id: "hanging", title: T("Hanging pieces", "ආරක්ෂාවක් නැති ඉත්තන්"), steps: [
        { pos: H1, hl: ["d5"], text: T("A piece is hanging when it is attacked and nobody defends it. The black bishop on d5 is attacked by the knight and has no defender.", "ඉත්තෙකුට ප්‍රහාර වෙලා ඒකට ආරක්ෂාවක් නැත්නම් ඒක ආරක්ෂාවක් නැති (hanging) ඉත්තෙක්. d5 හි කළු බිෂොප් එකට නයිට් එකෙන් ප්‍රහාර වෙලා, ආරක්ෂාවක් නෑ.") },
        { pos: H1, move: ["c3", "d5"], caps: ["d5"], text: T("Nxd5. White wins a bishop for free. Always look for hanging pieces first.", "Nxd5. සුදු නොමිලේ බිෂොප් එකක් දිනනවා. හැමවිටම මුලින් ආරක්ෂාවක් නැති ඉත්තන් හොයන්න.") },
        { pos: H2, hl: ["c6", "d5"], text: T("Now the pawn on c6 defends the bishop. It is not hanging any more.", "දැන් c6 හි පෝන් එක බිෂොප් එක ආරක්ෂා කරනවා. ඒක තවදුරටත් ආරක්ෂාවක් නැති ඉත්තෙක් නෙමෙයි.") },
        { pos: H2, move: ["c3", "d5"], caps: ["d5"], text: T("If we take, Black takes back with the pawn: knight for bishop, an equal trade, and no gain.", "අපි කැපුවොත් කළු පෝන් එකෙන් ආපහු කපනවා: නයිට් එකට බිෂොප් එකක්, සමාන හුවමාරුවක්, ලාභයක් නෑ.") },
        { text: T("Before every move ask two questions: can I take something that is hanging, and is anything of mine hanging?", "හැම ඇදීමකටම කලින් ප්‍රශ්න දෙකක් අහන්න: ආරක්ෂාවක් නැති දෙයක් මට කපන්න පුළුවන්ද, මගේ ඉත්තෙකුට ආරක්ෂාවක් නැති වෙලාද?") },
      ] },

      { id: "fork", title: T("The fork", "ෆෝක් එක"), steps: [
        { pos: F1, hl: ["b5", "a8", "e8"], text: T("A fork is one piece attacking two or more enemy pieces at once. The enemy can save only one of them.", "ෆෝක් (fork) එකක් කියන්නේ එක ඉත්තෙක් එකවර සතුරු ඉත්තන් දෙකකට හෝ වැඩි ගණනකට ප්‍රහාර කිරීම. සතුරාට ඒවායින් එකක් විතරයි බේරගන්න පුළුවන්.") },
        { pos: F1, moves: [["b5", "c7"], ["e8", "d7"]], hl: ["c7", "a8", "e8"], text: T("Nc7+ attacks the king and the rook together. The king must deal with the check.", "Nc7+ රජුටත් රුක් එකටත් එකවර ප්‍රහාර කරනවා. රජුට චෙක් එක ගැන කල්පනා කරන්න වෙනවා.") },
        { moves: [["c7", "a8"]], caps: ["a8"], text: T("Nxa8. The knight takes the rook. A fork with check, a royal fork, always wins the other piece.", "Nxa8. නයිට් එක රුක් එක කපනවා. චෙක් එකත් එක්ක ෆෝක් එකක් (රාජකීය ෆෝක් එකක්) අනිත් ඉත්තාව හැමවිටම දිනනවා.") },
        { pos: fp("4k3/8/3r1n2/8/4P3/8/8/4K3"), move: ["e4", "e5"], hl: ["e5", "d6", "f6"], text: T("A pawn can fork too. The pawn on e5 attacks the rook and the knight, and they are worth more than a pawn.", "පෝන් එකකටත් ෆෝක් කරන්න පුළුවන්. e5 හි පෝන් එක රුක් එකටත් නයිට් එකටත් ප්‍රහාර කරනවා, ඒවා පෝන් එකකට වඩා වටිනවා.") },
        { text: T("Knights are great at forking because their jump cannot be blocked. Before each move ask: does this attack two things?", "නයිට් ෆෝක් කරන්න හොඳයි, ඒවායේ පිම්ම අවහිර කරන්න බැරි නිසා. හැම ඇදීමකටම කලින් අහන්න: මේකෙන් දෙයක් දෙකකට ප්‍රහාර වෙනවද?") },
      ] },

      { id: "pin", title: T("The pin", "පින් එක"), steps: [
        { pos: PN1, hl: ["f1", "c6", "e8"], text: T("A pin freezes a piece. It cannot move because a more valuable piece stands behind it on the same line.", "පින් (pin) එකකින් ඉත්තෙක් නිශ්චලයි. ඒකට ඇදෙන්න බෑ, එකම රේඛාවේ ඒක පිටිපස්සේ තවත් වටිනා ඉත්තෙක් ඉන්න නිසා.") },
        { pos: PN1, move: ["f1", "b5"], hl: ["b5", "c6", "e8"], text: T("Bb5 pins the knight to the king. The king is behind the knight on the diagonal b5–e8.", "Bb5 නයිට් එක රජුට පින් කරනවා. රජු b5–e8 ඇද පේළියේ නයිට් එක පිටිපස්සේ ඉන්නවා.") },
        { xs: ["a5", "a7", "b4", "b8", "d4", "d8", "e5", "e7"], text: T("Every knight move is now illegal, because it would leave the king in check. This is an absolute pin.", "දැන් නයිට් එකේ හැම ඇදීමක්ම නීති විරෝධියි, රජුට චෙක් වෙන නිසා. මේක පරිපූර්ණ පින් එකක් (absolute pin).") },
        { pos: fp("3qk3/8/5n2/8/8/8/8/2B1K3"), move: ["c1", "g5"], hl: ["g5", "f6", "d8"], text: T("Here Bg5 pins the knight to the queen. The knight can move, but then White wins the queen. This is a relative pin.", "මෙතන Bg5 නයිට් එක රැජිනට පින් කරනවා. නයිට් එකට ඇදෙන්න පුළුවන්, ඒත් එතකොට සුදු රැජින දිනනවා. මේක සාපේක්ෂ පින් එකක් (relative pin).") },
        { text: T("To break a pin: capture the pinning piece, block the line, or move the piece behind it away.", "පින් එකක් කඩන්න: පින් කරන ඉත්තාව කපන්න, රේඛාව අවහිර කරන්න, නැත්නම් පිටිපස්සේ ඉන්න ඉත්තාව ඇදලා ඉවත් කරන්න.") },
      ] },

      { id: "skewer", title: T("The skewer", "ස්කීවර් එක"), steps: [
        { pos: SK1, hl: ["a1", "e5", "e8"], text: T("A skewer is like a pin turned around. You attack a valuable piece in front, it must move, and you capture the piece behind it.", "ස්කීවර් (skewer) එකක් කියන්නේ පිටුපැත්තට හැරවූ පින් එකක් වගේ. ඉදිරියෙන් ඉන්න වටිනා ඉත්තාට ප්‍රහාර කරනවා, ඒක ඇදෙන්න ඕන, ඊට පස්සේ පිටිපස්සේ ඉන්න ඉත්තාව කපනවා.") },
        { pos: SK1, moves: [["a1", "e1"], ["e5", "d5"]], hl: ["e1", "e8"], text: T("Re1+ attacks the king. The king must leave the e-file.", "Re1+ රජුට ප්‍රහාර කරනවා. රජුට e සිරස් පේළිය අතහරින්න වෙනවා.") },
        { moves: [["e1", "e8"]], caps: ["e8"], text: T("Rxe8. The rook takes the queen that stood behind the king.", "Rxe8. රුක් එක රජු පිටිපස්සේ හිටපු රැජින කපනවා.") },
        { text: T("In a pin the weaker piece is in front. In a skewer the stronger piece is in front.", "පින් එකක දී දුර්වල ඉත්තා ඉදිරියේ. ස්කීවර් එකක දී ශක්තිමත් ඉත්තා ඉදිරියේ.") },
        { text: T("Rooks, bishops and queens skewer along lines. Look for a king and a queen on the same file, rank or diagonal.", "රුක්, බිෂොප් සහ රැජින රේඛා දිගේ ස්කීවර් කරනවා. එකම සිරස් පේළියක, තිරස් පේළියක හෝ ඇද පේළියක රජුයි රැජිනයි ඉන්නවද කියලා බලන්න.") },
      ] },

      { id: "opening-principles", title: T("Opening principles", "ආරම්භක මූලධර්ම"), steps: [
        { pos: START, hl: ["e4", "d4", "e5", "d5"], text: T("The opening is the first 8 to 12 moves. Five ideas: control the centre, develop your pieces, castle early, move each piece once, and keep your queen at home.", "ආරම්භය කියන්නේ මුල් ඇදීම් 8 ඉඳන් 12 දක්වා. අදහස් පහයි: මැද පාලනය කරන්න, ඉත්තන් එළියට ගන්න, කලින් කාසලින් කරන්න, එක ඉත්තෙක් එක වතාවයි ඇදන්න, රැජින ගෙදර තියන්න.") },
        { moves: [["e2", "e4"], ["e7", "e5"]], hl: ["e4", "e5"], text: T("1. e4 e5. Both sides put a pawn in the centre. Central pawns give your pieces room.", "1. e4 e5. දෙපැත්තම පෝන් එකක් මැදට දානවා. මැද පෝන් වලින් ඉත්තන්ට ඉඩ ලැබෙනවා.") },
        { moves: [["g1", "f3"], ["b8", "c6"]], hl: ["f3", "c6"], text: T("2. Nf3 Nc6. Knights come out toward the centre, where they are strongest.", "2. Nf3 Nc6. නයිට් මැද පැත්තට එනවා, එතන ඒවා වඩාත්ම ශක්තිමත්.") },
        { moves: [["f1", "c4"], ["g8", "f6"]], hl: ["c4", "f6"], text: T("3. Bc4 Nf6. Bishops come out too. Now the kingside is ready for castling.", "3. Bc4 Nf6. බිෂොප් වරුත් එළියට එනවා. දැන් රජුගේ පැත්ත කාසලින් කරන්න සූදානම්.") },
        { pos: CAS, moves: [["e1", "g1"], ["h1", "f1"]], hl: ["g1", "f1"], text: T("4. O-O. The king is safe and the rook joins the game. This is why we castle early.", "4. O-O. රජු ආරක්ෂිතයි, රුක් එක ක්‍රීඩාවට එකතු වෙනවා. අපි කලින් කාසලින් කරන්නේ ඒකයි.") },
        { pos: fp("rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR"), hl: ["h5"], text: T("Avoid bringing the queen out early. Here Qh5 can be chased by Black’s pieces, and White loses time.", "රැජින කලින් එළියට ගන්න එපා. මෙතන Qh5 එක කළුගේ ඉත්තන්ට පන්නගන්න පුළුවන්, සුදුට වෙලාව නැති වෙනවා.") },
      ] },

      { id: "opening-traps", title: T("Common opening traps", "සාමාන්‍ය ආරම්භක උගුල්"), steps: [
        { pos: SCH0, hl: ["h5", "c4", "f7"], text: T("The scholar’s mate: the queen and the bishop both aim at f7. At the start, only the king defends f7.", "ස්කොලර්ස් මේට් (scholar’s mate): රැජිනයි බිෂොප් එකයි දෙන්නාම f7 ඉලක්ක කරනවා. මුලදී f7 ආරක්ෂා කරන්නේ රජු විතරයි.") },
        { pos: SCH0, move: ["h5", "f7"], caps: ["f7"], text: T("Qxf7# is checkmate in four moves. The bishop on c4 guards the queen.", "Qxf7# ඇදීම් හතරකින් චෙක්මේට්. c4 හි බිෂොප් එක රැජින ආරක්ෂා කරනවා.") },
        { pos: SCH0, hl: ["g7", "e7", "g8"], text: T("To defend, play ...g6 to attack the queen, or ...Qe7 to guard f7. Do not ignore the threat.", "ආරක්ෂා වෙන්න ...g6 ඇදලා රැජිනට ප්‍රහාර කරන්න, නැත්නම් f7 ආරක්ෂා කරන්න ...Qe7 ඇදන්න. තර්ජනය නොසලකා හරින්න එපා.") },
        { pos: FOOL, hl: ["d8", "h4", "e1"], text: T("The fool’s mate is the fastest mate. After 1. f3 e5 2. g4, the diagonal to the king is open.", "ෆූල්ස් මේට් (fool’s mate) කියන්නේ වේගවත්ම මේට් එක. 1. f3 e5 2. g4 වුණාම රජුට යන ඇද පේළිය විවෘතයි.") },
        { text: T("Lesson: do not weaken the pawns in front of your king, and before each move ask what your opponent is threatening.", "පාඩම: රජුට ඉදිරියෙන් තියෙන පෝන් දුර්වල කරන්න එපා, හැම ඇදීමකටම කලින් ප්‍රතිවාදියා තර්ජනය කරන්නේ මොකක්ද කියලා අහන්න.") },
      ] },
    ],
  };

  const P = {
    "hanging": [
      { type: "move", pos: H1, v: "legal", q: T("Capture the hanging bishop.", "ආරක්ෂාවක් නැති බිෂොප් එක කපන්න."), ans: [["c3", "d5"]] },
      { type: "choice", pos: H2, q: T("Is the black bishop on d5 hanging?", "d5 හි කළු බිෂොප් එකට ආරක්ෂාවක් නැද්ද?"), opts: [YES, NO], a: 1 },
      { type: "square", pos: fp("4k3/8/p7/1p1b4/8/2N5/8/4K3"), q: T("The knight attacks two black pieces. Click the one that is hanging.", "නයිට් එක කළු ඉත්තන් දෙන්නෙකුට ප්‍රහාර කරනවා. ආරක්ෂාවක් නැති ඉත්තා ක්ලික් කරන්න."), ans: ["d5"] },
      { type: "move", pos: fp("4k3/8/8/4q3/8/8/4R3/4K3"), v: "legal", q: T("Capture the black queen.", "කළු රැජින කපන්න."), ans: [["e2", "e5"]] },
      { type: "choice", q: T("When is a piece hanging?", "ඉත්තෙකුට ආරක්ෂාවක් නැතැයි කියන්නේ කවදාද?"), opts: [T("It is attacked and nobody defends it", "ඒකට ප්‍රහාර වෙලා, ආරක්ෂා කරන කෙනෙක් නැති වෙලාව"), T("It is far from the king", "රජුගෙන් ඈතින් ඉන්න වෙලාව"), T("It has not moved yet", "ඒක තවම ඇදිලා නැති වෙලාව")], a: 0 },
      { type: "choice", q: T("What should you check before every move?", "හැම ඇදීමකටම කලින් මොනවද බලන්න ඕන?"), opts: [T("Can I take something free, and is anything of mine hanging?", "මට නොමිලේ දෙයක් කපන්න පුළුවන්ද, මගේ ඉත්තෙකුට ආරක්ෂාවක් නැති වෙලාද?"), T("Only my own king", "මගේ රජු විතරයි"), T("Nothing, just move fast", "කිසිවක් නෑ, වේගයෙන් ඇදන්න")], a: 0 },
    ],
    "fork": [
      { type: "move", pos: F1, fork: true, v: "legal", q: T("Fork the king and the rook with your knight.", "ඔයාගේ නයිට් එකෙන් රජුටයි රුක් එකටයි ෆෝක් කරන්න."), ans: [["b5", "c7"]] },
      { type: "move", pos: fp("4k3/8/3r1n2/8/4P3/8/8/4K3"), fork: true, v: "legal", q: T("Fork the rook and the knight with a pawn.", "පෝන් එකෙන් රුක් එකටයි නයිට් එකටයි ෆෝක් කරන්න."), ans: [["e4", "e5"]] },
      { type: "move", pos: fp("2q3k1/8/8/3N4/8/8/8/4K3"), fork: true, v: "legal", q: T("Fork the king and the queen with your knight.", "ඔයාගේ නයිට් එකෙන් රජුටයි රැජිනටයි ෆෝක් කරන්න."), ans: [["d5", "e7"]] },
      { type: "choice", q: T("What is a fork?", "ෆෝක් එකක් කියන්නේ මොකක්ද?"), opts: [T("One piece attacks two or more enemy pieces at once", "එක ඉත්තෙක් එකවර සතුරු ඉත්තන් දෙකකට හෝ වැඩි ගණනකට ප්‍රහාර කිරීම"), T("Two pieces defend each other", "ඉත්තන් දෙකක් එකිනෙකා ආරක්ෂා කිරීම"), T("A king that cannot move", "ඇදෙන්න බැරි රජෙක්")], a: 0 },
      { type: "choice", q: T("Which piece is hard to block when it forks, because it jumps?", "පනින නිසා ෆෝක් කරනකොට අවහිර කරන්න අමාරු ඉත්තා කුමක්ද?"), opts: [T("The knight", "නයිට්"), T("The bishop", "බිෂොප්"), T("The rook", "රුක්")], a: 0 },
      { type: "choice", pos: F1, q: T("Nc7+ forks the king and the rook on a8. What does White win?", "Nc7+ රජුටත් a8 හි රුක් එකටත් ෆෝක් කරනවා. සුදු දිනන්නේ මොකක්ද?"), opts: [T("The rook", "රුක් එක"), T("Nothing", "කිසිවක් නෑ"), T("The queen", "රැජින")], a: 0 },
    ],
    "pin": [
      { type: "move", pos: PN1, pinSq: "c6", v: "legal", q: T("Pin the black knight to the king with your bishop.", "ඔයාගේ බිෂොප් එකෙන් කළු නයිට් එක රජුට පින් කරන්න."), ans: [["f1", "b5"]] },
      { type: "move", pos: fp("3qk3/8/5n2/8/8/8/8/2B1K3"), v: "legal", q: T("Pin the black knight to the black queen.", "කළු නයිට් එක කළු රැජිනට පින් කරන්න."), ans: [["c1", "g5"]] },
      { type: "choice", pos: fp("4k3/8/2n5/1B6/8/8/8/4K3"), mv: ["c6", "d4"], turn: "b", legal: false, q: T("Black to move. May the pinned knight go to d4?", "කළුගේ වාරය. පින් වෙලා ඉන්න නයිට් එකට d4 ට යන්න පුළුවන්ද?"), opts: [YES, NO], a: 1 },
      { type: "square", pos: fp("4k3/8/2n5/1B6/8/8/8/4K3"), q: T("Click the pinned piece.", "පින් වෙලා ඉන්න ඉත්තා ක්ලික් කරන්න."), ans: ["c6"] },
      { type: "choice", q: T("A pin is absolute when the piece behind is…", "පිටිපස්සේ තියෙන ඉත්තා කුමක්ද වුණොත් පින් එක පරිපූර්ණ වෙනවාද?"), opts: [T("The king", "රජු"), T("The queen", "රැජින"), T("A pawn", "පෝන් එකක්")], a: 0 },
      { type: "choice", q: T("Which is a good way to deal with a pin?", "පින් එකක් ගැන කටයුතු කරන හොඳ ක්‍රමයක් කුමක්ද?"), opts: [T("Capture the pinning piece", "පින් කරන ඉත්තාව කපන්න"), T("Move the pinned piece anyway", "පින් වෙලා ඉන්න ඉත්තාව කොහොම හරි ඇදීම"), T("Ignore it", "නොසලකා හරින්න")], a: 0 },
    ],
    "skewer": [
      { type: "move", pos: SK1, v: "legal", q: T("Skewer the king and the queen with your rook.", "ඔයාගේ රුක් එකෙන් රජුටයි රැජිනටයි ස්කීවර් කරන්න."), ans: [["a1", "e1"]] },
      { type: "move", pos: fp("8/8/8/8/3k2q1/8/8/R6K"), v: "legal", q: T("Skewer the king and the queen with your rook.", "ඔයාගේ රුක් එකෙන් රජුටයි රැජිනටයි ස්කීවර් කරන්න."), ans: [["a1", "a4"]] },
      { type: "square", pos: fp("4q3/8/8/4k3/8/8/4R3/6K1"), q: T("The rook checks the king. Click the piece White wins next.", "රුක් එක රජුට චෙක් දෙනවා. සුදු ඊළඟට දිනන ඉත්තා ක්ලික් කරන්න."), ans: ["e8"] },
      { type: "choice", q: T("In a skewer, which piece stands in front?", "ස්කීවර් එකක දී ඉදිරියෙන් ඉන්නේ කුමන ඉත්තාද?"), opts: [T("The more valuable piece", "වඩා වටිනා ඉත්තා"), T("The less valuable piece", "අඩු වටිනාකමක් ඇති ඉත්තා"), T("Always a pawn", "හැමවිටම පෝන් එකක්")], a: 0 },
      { type: "choice", q: T("After the king steps aside in a skewer, what happens?", "ස්කීවර් එකකදී රජු පැත්තකට ගියාට පස්සේ වෙන්නේ මොකක්ද?"), opts: [T("You capture the piece behind it", "පිටිපස්සේ ඉන්න ඉත්තා ඔයා කපනවා"), T("Nothing", "කිසිවක් නෑ"), T("The game is a draw", "ක්‍රීඩාව ඩ්‍රෝ")], a: 0 },
      { type: "choice", q: T("Which one describes a skewer?", "ස්කීවර් එකක් විස්තර කරන්නේ කුමක්ද?"), opts: [T("Attack a valuable piece so it moves, then take the piece behind", "වටිනා ඉත්තාට ප්‍රහාර කරලා ඒක ඇදුණාම පිටිපස්සේ ඉන්න ඉත්තා කැපීම"), T("A piece that cannot move because the king is behind", "පිටිපස්සේ රජු ඉන්න නිසා ඇදෙන්න බැරි ඉත්තෙක්"), T("A knight attacking two pieces", "ඉත්තන් දෙකකට ප්‍රහාර කරන නයිට් එකක්")], a: 0 },
    ],
    "opening-principles": [
      { type: "move", pos: START, v: "legal", q: T("Take the centre. Move a central pawn two squares.", "මැද අල්ලගන්න. මැද පෝන් එකක් කොටු දෙකක් ඇදන්න."), ans: [["e2", "e4"], ["d2", "d4"]] },
      { type: "move", pos: OP1, v: "legal", q: T("Develop a knight toward the centre.", "නයිට් එකක් මැද පැත්තට එළියට ගන්න."), ans: [["g1", "f3"], ["b1", "c3"]] },
      { type: "move", pos: CAS, v: "legal", also: [["h1", "f1"]], q: T("Your king is ready. Castle kingside.", "ඔයාගේ රජු සූදානම්. රජුගේ පැත්තට කාසලින් කරන්න."), ans: [["e1", "g1"]] },
      { type: "choice", q: T("Which one is NOT an opening principle?", "මේවායින් ආරම්භක මූලධර්මයක් නොවන්නේ කුමක්ද?"), opts: [T("Control the centre", "මැද පාලනය කරන්න"), T("Bring the queen out early", "රැජින කලින් එළියට ගන්න"), T("Develop your pieces", "ඉත්තන් එළියට ගන්න")], a: 1 },
      { type: "choice", q: T("Why do we castle early?", "අපි කලින් කාසලින් කරන්නේ ඇයි?"), opts: [T("The king gets safe and the rook joins the game", "රජු ආරක්ෂිත වෙනවා, රුක් එක ක්‍රීඩාවට එකතු වෙනවා"), T("To lose time", "වෙලාව නාස්ති කරන්න"), T("To capture pawns", "පෝන් කපන්න")], a: 0 },
      { type: "choice", q: T("How often should you move the same piece in the opening?", "ආරම්භයේදී එකම ඉත්තා කී වතාවක් ඇදිය යුතුද?"), opts: [T("As little as possible: bring a new piece out each move", "හැකි තරම් අඩුවෙන්: හැම ඇදීමකදීම අලුත් ඉත්තෙක් එළියට ගන්න"), T("As often as I can", "මට හැකි තරම් වැඩියෙන්"), T("Ten times", "දස වතාවක්")], a: 0 },
    ],
    "opening-traps": [
      { type: "move", pos: SCH0, v: "mate", q: T("White to move. Give checkmate in one move.", "සුදුගේ වාරය. එක ඇදීමකින් චෙක්මේට් දෙන්න."), ans: [["h5", "f7"]] },
      { type: "choice", pos: SCH0, q: T("Black to move. Which move defends against Qxf7#?", "කළුගේ වාරය. Qxf7# එකට එරෙහිව ආරක්ෂා වෙන්නේ කුමන ඇදීමද?"), opts: ["…Nf6", "…g6", "…a6"], a: 1 },
      { type: "choice", pos: FOOL, q: T("Black to move. Which move is checkmate?", "කළුගේ වාරය. චෙක්මේට් වෙන්නේ කුමන ඇදීමද?"), opts: ["…Qh4", "…Qg5", "…Bb4"], a: 0 },
      { type: "choice", q: T("Which square does the scholar’s mate attack?", "ස්කොලර්ස් මේට් එක ප්‍රහාර කරන්නේ කුමන කොටුවටද?"), opts: ["f7", "e5", "d5"], a: 0 },
      { type: "choice", q: T("The fool’s mate happens after White moves which pawns?", "ෆූල්ස් මේට් එක වෙන්නේ සුදු කුමන පෝන් ඇදුවාම ද?"), opts: [T("The f- and g-pawns", "f සහ g පෝන්"), T("The a- and b-pawns", "a සහ b පෝන්"), T("The queen’s pawns only", "රැජිනගේ පැත්තේ පෝන් විතරයි")], a: 0 },
      { type: "choice", q: T("What is the best habit against opening traps?", "ආරම්භක උගුල් වලට එරෙහිව හොඳම පුරුද්ද මොකක්ද?"), opts: [T("Before each move, ask what my opponent threatens", "හැම ඇදීමකටම කලින් ප්‍රතිවාදියා තර්ජනය කරන්නේ මොකක්ද කියලා අහනවා"), T("Move the queen out at once", "රැජින එකපාරටම එළියට ගන්නවා"), T("Never develop knights", "නයිට් කවදාවත් එළියට ගන්නේ නෑ")], a: 0 },
    ],
  };

  window.PQ_PRACTICE = Object.assign(window.PQ_PRACTICE || {}, P);
  window.PQ_MODULES = (window.PQ_MODULES || []).concat([window.PQ_MODULE_6]);
})();
