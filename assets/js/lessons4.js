/* Purple Queen Chess Academy — Level 1 · Module 4: Basic checkmates
   Uses window.PQ_FP from lessons3.js. Every line and every answer is checked by an automatic chess-rules test. */
(function () {
  const T = (en, si) => ({ en, si });
  const YES = T("Yes", "ඔව්"), NO = T("No", "නැහැ");
  const fp = window.PQ_FP;
  const rk = (r) => "abcdefgh".split("").map(f => f + r);
  const MATE1 = T("White to move. Give checkmate in one move.", "සුදුගේ වාරය. එක ඇදීමකින් චෙක්මේට් දෙන්න.");

  const KQ = fp("8/8/8/8/8/5k2/8/Q3K3");
  const LAD = fp("4k3/8/8/8/8/8/8/R3K2R");
  const KR = fp("4k3/8/4K3/8/8/8/8/R7");
  const SMO0 = fp("6rk/6pp/8/4N3/8/8/8/6K1");

  window.PQ_MODULE_4 = {
    level: T("Level 1 · Pawn", "මට්ටම 1 · පෝන්"),
    title: T("Basic checkmates", "මූලික චෙක්මේට්"),
    lessons: [
      { id: "kq-mate", title: T("Queen and king against king", "රැජින සහ රජු එදිරියෙන් රජු"), steps: [
        { pos: KQ, hl: ["a1", "e1", "f3"], text: T("A queen alone cannot mate. You need your king to help. The queen chases, the king walks closer, then the queen mates.", "රැජිනට තනියම මේට් කරන්න බෑ. ඔයාගේ රජුගේ උදව් ඕන. රැජින පන්නනවා, රජු ළඟට එනවා, ඊට පස්සේ රැජින මේට් කරනවා.") },
        { moves: [["a1", "d4"], ["f3", "g3"]], hl: ["d4"], text: T("1. Qd4. The queen cuts the board in half. The black king cannot cross the d-file and the 4th rank.", "1. Qd4. රැජින පුවරුව බාගෙට කපනවා. කළු රජුට d සිරස් පේළියත් 4 වන තිරස් පේළියත් පනින්න බෑ.") },
        { moves: [["d4", "e4"], ["g3", "h2"]], hl: ["e4"], text: T("2. Qe4. The queen follows a knight’s move away from the king and shrinks the box.", "2. Qe4. රැජින රජුගෙන් නයිට් පිම්මක් දුරින් ඉඳගෙන පෙට්ටිය කුඩා කරනවා.") },
        { moves: [["e4", "g4"], ["h2", "h1"]], hl: ["g4"], text: T("3. Qg4. The king is almost in the corner. Careful: Qg3 would be stalemate!", "3. Qg4. රජු කෙළවරට ළං වෙලා. පරිස්සම: Qg3 ස්ටේල්මේට්!") },
        { moves: [["e1", "f2"], ["h1", "h2"]], hl: ["f2"], text: T("4. Kf2. Now the white king comes to help. Black has only one move: Kh2.", "4. Kf2. දැන් සුදු රජු උදව්වට එනවා. කළුට තියෙන්නේ එක ඇදීමයි: Kh2.") },
        { moves: [["g4", "h4"]], hl: ["h4", "h2"], text: T("5. Qh4 is checkmate. The king guards g1, g2 and g3, the queen covers the h-file.", "5. Qh4 චෙක්මේට්. රජු g1, g2, g3 ආවරණය කරනවා, රැජින h සිරස් පේළිය ආවරණය කරනවා.") },
        { text: T("Rules: keep the queen a knight’s move from the king, bring your king close, and before each move check that Black still has a move.", "නීති: රැජින රජුගෙන් නයිට් පිම්මක් දුරින් තියන්න, ඔයාගේ රජුව ළඟට ගේන්න, හැම ඇදීමකටම කලින් කළුට තවමත් ඇදීමක් තියෙනවද කියලා බලන්න.") },
      ] },

      { id: "two-rooks", title: T("Two rooks: the ladder", "රුක් දෙකක්: ඉණිමග"), steps: [
        { pos: LAD, hl: ["a1", "h1", "e8"], text: T("Two rooks can mate a lone king without help from the king. They work like a ladder, one rank at a time.", "රුක් දෙකකට රජුගේ උදව් නැතුවම තනි රජෙකුට මේට් කරන්න පුළුවන්. ඒවා ඉණිමගක් වගේ, එක පේළියක් එක පේළියක් ගානේ වැඩ කරනවා.") },
        { soft: rk(7), text: T("A rook controls a whole rank. A rook on the 7th rank stops the king from stepping onto it.", "රුක් එකකට මුළු තිරස් පේළියක්ම පාලනය කරන්න පුළුවන්. 7 වන පේළියේ රුක් එකක් නිසා රජුට ඒ පේළියට පය තියන්න බෑ.") },
        { moves: [["a1", "a7"], ["e8", "d8"]], hl: ["a7"], text: T("1. Ra7. The king is trapped on the 8th rank. It can only walk along it.", "1. Ra7. රජු 8 වන පේළියේ හිරවෙලා. ඒ දිගේ විතරක් ඇවිදින්න පුළුවන්.") },
        { moves: [["h1", "h8"]], hl: ["h8"], text: T("2. Rh8 is checkmate. The second rook checks from far away, so the king cannot capture it.", "2. Rh8 චෙක්මේට්. දෙවෙනි රුක් එක ඈතින් චෙක් දෙන නිසා රජුට ඒක කපන්න බෑ.") },
        { text: T("Keep the two rooks far apart, on different ranks or files. If a rook stands next to the king, the king can take it.", "රුක් දෙක ඈතින්, වෙනස් පේළි හෝ සිරස් පේළි වල තියන්න. රුක් එකක් රජුට ළඟින් තිබුණොත් රජුට ඒක කපන්න පුළුවන්.") },
      ] },

      { id: "kr-mate", title: T("Rook and king against king", "රුක් සහ රජු එදිරියෙන් රජු"), steps: [
        { pos: KR, hl: ["e6", "e8", "a1"], text: T("A rook and a king can win too, but your king must help. The rook cuts the king off, your king comes close.", "රුක් එකකුයි රජෙකුයි එකතුවෙලත් දිනන්න පුළුවන්, ඒත් ඔයාගේ රජුගේ උදව් ඕන. රුක් එක රජුව වෙන් කරනවා, ඔයාගේ රජු ළඟට එනවා.") },
        { hl: ["e6", "e8"], soft: ["e7"], text: T("The two kings face each other with one square between them. This is called opposition.", "රජවරු දෙන්නා අතරේ එක කොටුවක් තියාගෙන එකිනෙකා දිහා බලාගෙන ඉන්නවා. මේකට ඔපෝසිෂන් (opposition) කියනවා.") },
        { xs: ["d7", "e7", "f7"], text: T("The white king covers d7, e7 and f7. The black king cannot step forward.", "සුදු රජු d7, e7, f7 ආවරණය කරනවා. කළු රජුට ඉදිරියට යන්න බෑ.") },
        { move: ["a1", "a8"], hl: ["a8"], text: T("Ra8 is checkmate. The rook checks along the 8th rank, and the king has no square.", "Ra8 චෙක්මේට්. රුක් එක 8 වන පේළිය දිගේ චෙක් දෙනවා, රජුට කොටුවක් නෑ.") },
        { text: T("The mate always happens on the edge of the board. Push the king to the edge with the rook, then bring your king to face it.", "මේට් එක හැමවිටම පුවරුවේ කෙළවරේදී වෙනවා. රුක් එකෙන් රජුව කෙළවරට තල්ලු කරලා, ඔයාගේ රජුව ඉදිරියට ගෙනැත් මුහුණට මුහුණ ඉන්න.") },
      ] },

      { id: "back-rank", title: T("Back-rank mate", "පසු පේළියේ මේට්"), steps: [
        { pos: fp("6k1/5ppp/8/8/8/8/8/R5K1"), hl: ["g8"], soft: ["f7", "g7", "h7"], text: T("The king sits on its back rank, shut in by its own pawns. This is the most common mate in chess.", "රජු පසු පේළියේ, තමන්ගේම පෝන් වලින් වැහිලා ඉන්නවා. මේක චෙස් වල වැඩියෙන්ම වෙන මේට් එක.") },
        { pos: fp("6k1/5ppp/8/8/8/8/8/R5K1"), move: ["a1", "a8"], hl: ["a8"], text: T("A rook or queen checks on the back rank. The king has nowhere to go. Checkmate.", "රුක් එකක් හෝ රැජිනක් පසු පේළියේ චෙක් දෙනවා. රජුට යන්න තැනක් නෑ. චෙක්මේට්.") },
        { pos: fp("2r3k1/5ppp/8/8/8/8/5PPP/2R3K1"), move: ["c1", "c8"], caps: ["c8"], text: T("You can capture first: the rook takes on c8 with check, and mate. Black cannot take back.", "කලින් කපලත් මේට් කරන්න පුළුවන්: රුක් එක c8 චෙක් එකත් එක්ක කපනවා, මේට්. කළුට ආපහු කපන්න බෑ.") },
        { pos: fp("6k1/5pp1/7p/8/8/8/8/R5K1"), moves: [["a1", "a8"], ["g8", "h7"]], hl: ["h7"], text: T("A pawn on h6 gives the king a flight square on h7. Ra8+ is only check now. This escape square is called luft.", "h6 හි පෝන් එක නිසා රජුට h7 හි පැන යන කොටුවක් තියෙනවා. Ra8+ දැන් චෙක් විතරයි. මේ පැන යන කොටුවට ලුෆ්ට් (luft) කියනවා.") },
        { text: T("To defend: push h7–h6 or g7–g6 early to make luft. To attack: look at the opponent’s back rank every move.", "ආරක්ෂා වෙන්න: කලින්ම h7–h6 හෝ g7–g6 ඇදලා ලුෆ්ට් හදාගන්න. ප්‍රහාර කරන්න: හැම ඇදීමකදීම ප්‍රතිවාදියාගේ පසු පේළිය දිහා බලන්න.") },
      ] },

      { id: "smothered", title: T("Smothered mate (preview)", "ස්මදර්ඩ් මේට් (පෙරදසුන)"), steps: [
        { pos: SMO0, hl: ["h8", "g8", "g7", "h7"], text: T("Black’s king is in the corner. Its own rook and pawns stand on g8, g7 and h7. It has no room at all.", "කළු රජු කෙළවරේ. ඔහුගේම රුක් එකයි පෝන් දෙකත් g8, g7, h7 මත. රජුට කිසිම ඉඩක් නෑ.") },
        { move: ["e5", "f7"], hl: ["f7"], text: T("Nf7 is checkmate. This is a smothered mate: the king is smothered by its own pieces.", "Nf7 චෙක්මේට්. මේක ස්මදර්ඩ් මේට් (smothered mate): රජුව ඔහුගේම ඉත්තන් වලින් හිරකරලා.") },
        { text: T("Only a knight can do it. Other pieces check along a line, and the neighbours can capture or block. A knight jumps in.", "මේක කරන්න පුළුවන් නයිට් කෙනෙකුට විතරයි. අනිත් ඉත්තන් චෙක් දෙන්නේ රේඛාවක් දිගේ, ඒ නිසා අසල්වැසි ඉත්තන්ට කපන්න හරි අවහිර කරන්න හරි පුළුවන්. නයිට් පනිනවා.") },
        { pos: fp("kr6/pp6/4N3/8/8/8/8/6K1"), move: ["e6", "c7"], hl: ["c7"], text: T("It works in the other corner too. Nc7 is mate.", "අනිත් කෙළවරේත් වැඩ කරනවා. Nc7 මේට්.") },
        { text: T("A famous trick sacrifices the queen to force the rook into the corner, then the knight mates. You will learn it in Level 2.", "ප්‍රසිද්ධ උපක්‍රමයක දී රැජින පරිත්‍යාග කරලා රුක් එක කෙළවරට බලෙන් දාලා, ඊට පස්සේ නයිට් එක මේට් කරනවා. ඒක 2 වන මට්ටමේදී ඉගෙන ගමු.") },
      ] },
    ],
  };

  const P = {
    "kq-mate": [
      { type: "move", pos: KQ, v: "legal", q: T("Start the box. Play Qd4 to cut the king off.", "පෙට්ටිය පටන් ගන්න. රජුව වෙන් කරන්න Qd4 ඇදන්න."), ans: [["a1", "d4"]] },
      { type: "move", pos: fp("7k/8/5K2/8/8/8/8/6Q1"), v: "mate", q: MATE1, ans: [["g1", "g7"]] },
      { type: "move", pos: fp("k7/8/1K6/8/8/8/8/6Q1"), v: "mate", q: T("White to move. Give checkmate, and do not stalemate!", "සුදුගේ වාරය. චෙක්මේට් දෙන්න, ස්ටේල්මේට් නොවෙන්න!"), ans: [["g1", "g8"]] },
      { type: "choice", q: T("How far should your queen stay from the enemy king when boxing it in?", "රජුව පෙට්ටියක දාන කොට ඔයාගේ රැජින සතුරු රජුගෙන් කොච්චර දුරින් ඉන්න ඕනද?"), opts: [T("A knight’s move away", "නයිට් පිම්මක් දුරින්"), T("Right next to it", "හරියටම ළඟින්"), T("Far across the board", "පුවරුවේ අනිත් කෙළවරේ")], a: 0 },
      { type: "choice", q: T("Can a lone queen checkmate a lone king without the help of her own king?", "රැජිනට තනියම, ඇගේම රජුගේ උදව් නැතුව, තනි රජෙකුට මේට් කරන්න පුළුවන්ද?"), opts: [YES, NO], a: 1 },
      { type: "choice", pos: fp("7k/5Q2/6K1/8/8/8/8/8"), chk: "stale", q: T("Black to move. What is this?", "කළුගේ වාරය. මේක මොකක්ද?"), opts: [T("Check", "චෙක්"), T("Checkmate", "චෙක්මේට්"), T("Stalemate", "ස්ටේල්මේට්")], a: 2 },
    ],
    "two-rooks": [
      { type: "move", pos: fp("3k4/R7/8/8/8/8/8/1R2K3"), v: "mate", q: MATE1, ans: [["b1", "b8"]] },
      { type: "move", pos: fp("7k/1R6/8/8/8/8/8/R3K3"), v: "mate", q: MATE1, ans: [["a1", "a8"]] },
      { type: "move", pos: LAD, v: "legal", q: T("The king is on the 8th rank. Cut it off: put a rook on the 7th rank.", "රජු 8 වන පේළියේ. රජුව වෙන් කරන්න: රුක් එකක් 7 වන පේළියට දාන්න."), ans: [["a1", "a7"], ["h1", "h7"]] },
      { type: "choice", q: T("Why should the two rooks stay far from the enemy king?", "රුක් දෙක සතුරු රජුගෙන් ඈතින් තියෙන්න ඕන ඇයි?"), opts: [T("A rook next to the king can be captured", "රජුට ළඟින් තියෙන රුක් එකක් කපන්න පුළුවන්"), T("Rooks move slowly", "රුක් හෙමින් ඇදෙනවා"), T("It does not matter", "කිසිම වැදගත්කමක් නෑ")], a: 0 },
      { type: "choice", q: T("Can two rooks checkmate a lone king without the help of their king?", "රුක් දෙකකට තමන්ගේ රජුගේ උදව් නැතුව තනි රජෙකුට මේට් කරන්න පුළුවන්ද?"), opts: [YES, NO], a: 0 },
      { type: "square", pos: LAD, q: T("A rook on which square would cut off the 7th rank? Click one.", "7 වන පේළිය වහන්න රුක් එකක් තියන්න පුළුවන් කොටුවක් ක්ලික් කරන්න."), ans: ["a7", "h7"] },
    ],
    "kr-mate": [
      { type: "move", pos: fp("1k6/8/1K6/8/8/8/8/7R"), v: "mate", q: MATE1, ans: [["h1", "h8"]] },
      { type: "move", pos: fp("k7/8/1K6/8/8/8/8/4R3"), v: "mate", q: MATE1, ans: [["e1", "e8"]] },
      { type: "move", pos: KR, v: "mate", q: MATE1, ans: [["a1", "a8"]] },
      { type: "choice", q: T("Can a rook alone, without its king, checkmate a lone king?", "රුක් එකකට තනියම, තමන්ගේ රජු නැතුව, තනි රජෙකුට මේට් කරන්න පුළුවන්ද?"), opts: [YES, NO], a: 1 },
      { type: "choice", pos: fp("k7/8/K7/8/8/8/8/1R6"), chk: "stale", q: T("Black to move. What is this?", "කළුගේ වාරය. මේක මොකක්ද?"), opts: [T("Check", "චෙක්"), T("Checkmate", "චෙක්මේට්"), T("Stalemate", "ස්ටේල්මේට්")], a: 2 },
      { type: "choice", pos: fp("4k2R/8/4K3/8/8/8/8/8"), chk: "mate", q: T("Black to move. What is this?", "කළුගේ වාරය. මේක මොකක්ද?"), opts: [T("Check", "චෙක්"), T("Checkmate", "චෙක්මේට්"), T("Stalemate", "ස්ටේල්මේට්")], a: 1 },
    ],
    "back-rank": [
      { type: "move", pos: fp("2r3k1/5ppp/8/8/8/8/5PPP/2R3K1"), v: "mate", q: MATE1, ans: [["c1", "c8"]] },
      { type: "move", pos: fp("6k1/5ppp/8/8/8/8/8/3Q2K1"), v: "mate", q: MATE1, ans: [["d1", "d8"]] },
      { type: "move", pos: fp("4r1k1/5ppp/8/8/8/8/5PPP/4R1K1"), v: "mate", q: MATE1, ans: [["e1", "e8"]] },
      { type: "choice", pos: fp("6k1/5ppp/8/8/8/8/8/R5K1"), q: T("Black must defend against Ra8. Which pawn move helps?", "කළු Ra8 එකට එරෙහිව ආරක්ෂා වෙන්න ඕන. කුමන පෝන් ඇදීමෙන් උදව් වෙනවද?"), opts: ["h7–h6", "f7–f5", "g7–g5"], a: 0 },
      { type: "choice", pos: fp("6k1/5pp1/7p/8/8/8/R7/6K1"), q: T("White plays Ra8+. Is it checkmate?", "සුදු Ra8+ ඇදුවොත්, ඒක චෙක්මේට්ද?"), opts: [YES, NO], a: 1 },
      { type: "choice", q: T("What does the word luft mean in chess?", "ලුෆ්ට් (luft) කියන වචනයෙන් චෙස් වලදී අදහස් වෙන්නේ මොකක්ද?"), opts: [T("A flight square made by moving a pawn", "පෝන් එකක් ඇදලා හදාගන්න පැන යන කොටුවක්"), T("A very fast move", "ගොඩක් වේගවත් ඇදීමක්"), T("A kind of draw", "ඩ්‍රෝ වර්ගයක්")], a: 0 },
    ],
    "smothered": [
      { type: "move", pos: SMO0, v: "mate", q: MATE1, ans: [["e5", "f7"]] },
      { type: "move", pos: fp("kr6/pp6/4N3/8/8/8/8/6K1"), v: "mate", q: MATE1, ans: [["e6", "c7"]] },
      { type: "choice", q: T("Which piece gives a smothered mate?", "ස්මදර්ඩ් මේට් එකක් දෙන්නේ කුමන ඉත්තාද?"), opts: [T("A knight", "නයිට්"), T("A bishop", "බිෂොප්"), T("A rook", "රුක්")], a: 0 },
      { type: "choice", q: T("Why can the king not escape a smothered mate?", "ස්මදර්ඩ් මේට් එකකින් රජුට ගැලවෙන්න බැරි ඇයි?"), opts: [T("Its own pieces fill the squares around it", "ඔහුගේම ඉත්තන් වටේ කොටු පුරවලා"), T("The board is too small", "පුවරුව ගොඩක් පොඩියි"), T("Kings cannot move in the corner", "කෙළවරේ රජුට ඇදෙන්න බෑ")], a: 0 },
      { type: "choice", pos: SMO0, q: T("Black’s king is on h8, with its own rook and pawns around it. A white knight is on e5. Which square gives mate?", "කළු රජු h8 මත, වටේ ඔහුගේම රුක් එකයි පෝන් වලුයි. සුදු නයිට් එක e5 මත. මේට් දෙන්නේ කුමන කොටුවෙන්ද?"), opts: ["f7", "f3", "g6"], a: 0 },
      { type: "choice", pos: fp("6rk/5Npp/8/8/8/8/8/6K1"), chk: "mate", q: T("Black to move. What is this?", "කළුගේ වාරය. මේක මොකක්ද?"), opts: [T("Check", "චෙක්"), T("Checkmate", "චෙක්මේට්"), T("Stalemate", "ස්ටේල්මේට්")], a: 1 },
    ],
  };

  window.PQ_PRACTICE = Object.assign(window.PQ_PRACTICE || {}, P);
  window.PQ_MODULES = (window.PQ_MODULES || []).concat([window.PQ_MODULE_4]);
})();
