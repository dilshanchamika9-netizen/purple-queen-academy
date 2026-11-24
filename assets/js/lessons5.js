/* Purple Queen Chess Academy — Level 1 · Module 5: Notation and the Laws of Chess
   Rules follow the FIDE Laws of Chess (Articles 4, 5, 6, 7, 8 and 9). Coaches: please check every rule before publishing.
   Extra test fields: mv:[from,to] + legal:true|false on a choice task = is this move legal in the shown position. */
(function () {
  const T = (en, si) => ({ en, si });
  const YES = T("Yes", "ඔව්"), NO = T("No", "නැහැ");
  const fp = window.PQ_FP;
  const START = fp("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
  const D1 = fp("rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR");
  const NBD = fp("rnbqkbnr/pppppppp/8/8/8/5N2/PPP1PPPP/RNBQKB1R");
  const SCH = fp("r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR");
  const KK = fp("8/8/4k3/8/8/4K3/8/8");
  const KBK = fp("8/8/4k3/8/8/4KB2/8/8");
  const TM = fp("4k3/8/8/3p4/8/2N5/8/4K3");

  window.PQ_MODULE_5 = {
    level: T("Level 1 · Pawn", "මට්ටම 1 · පෝන්"),
    title: T("Notation and the Laws of Chess", "ලිවීමේ ක්‍රමය සහ චෙස් නීති"),
    lessons: [
      { id: "notation", title: T("Algebraic notation", "ඇල්ජිබ්‍රික් නොටේෂන්"), steps: [
        { pos: START, badges: { e1: "K", d1: "Q", a1: "R", c1: "B", b1: "N" }, text: T("We write moves in algebraic notation. Each piece has a capital letter: K king, Q queen, R rook, B bishop, N knight. A pawn has no letter.", "ඇදීම් ලියන්නේ ඇල්ජිබ්‍රික් නොටේෂන් (algebraic notation) වලින්. හැම ඉත්තෙකුටම ලොකු අකුරක් තියෙනවා: K රජු, Q රැජින, R රුක්, B බිෂොප්, N නයිට්. පෝන් එකට අකුරක් නෑ.") },
        { move: ["e2", "e4"], hl: ["e4"], text: T("A pawn move is just the square it goes to. This move is written e4.", "පෝන් ඇදීමක් ලියන්නේ ඒක යන කොටුව විතරයි. මේ ඇදීම e4 කියලා ලියනවා.") },
        { pos: START, move: ["g1", "f3"], hl: ["f3"], text: T("For other pieces write the letter and the square. The knight goes to f3: Nf3. The knight uses N because K is already the king.", "අනිත් ඉත්තන්ට අකුරයි කොටුවයි ලියනවා. නයිට් f3 ට යනවා: Nf3. K රජුට පාවිච්චි වෙන නිසා නයිට් එකට N පාවිච්චි කරනවා.") },
        { pos: D1, move: ["e4", "d5"], caps: ["d5"], text: T("A capture has an x. The pawn from the e-file takes on d5: exd5. A pawn capture starts with the pawn’s file letter.", "කැපීමක් ලියන්නේ x එකක් එක්ක. e පේළියේ පෝන් එක d5 කපනවා: exd5. පෝන් කැපීමක් පටන් ගන්නේ පෝන් එකේ සිරස් පේළියේ අකුරෙන්.") },
        { pos: SCH, move: ["h5", "f7"], caps: ["f7"], text: T("Qxf7# means: the queen captures on f7, and # is checkmate. A single + means check.", "Qxf7# කියන්නේ: රැජින f7 කපනවා, # කියන්නේ චෙක්මේට්. තනි + එකක් කියන්නේ චෙක්.") },
        { text: T("Castling is O-O (kingside) or O-O-O (queenside). Promotion is written like e8=Q.", "කාසලින් ලියන්නේ O-O (රජුගේ පැත්ත) හෝ O-O-O (රැජිනගේ පැත්ත). පෝන් උසස් කිරීම e8=Q වගේ ලියනවා.") },
      ] },

      { id: "scoresheet", title: T("Writing a scoresheet", "ස්කෝර්ෂීට් එකක් ලියමු"), steps: [
        { pos: START, text: T("In a tournament you write every move on a scoresheet. Each row has a number: White’s move first, then Black’s.", "තරඟයකදී හැම ඇදීමක්ම ස්කෝර්ෂීට් (scoresheet) එකක ලියනවා. හැම පේළියකටම අංකයක් තියෙනවා: මුලින් සුදුගේ ඇදීම, ඊට පස්සේ කළුගේ.") },
        { moves: [["e2", "e4"], ["e7", "e5"]], text: T("Row 1: 1. e4 e5.", "1 වන පේළිය: 1. e4 e5.") },
        { moves: [["f1", "c4"], ["b8", "c6"]], text: T("Row 2: 2. Bc4 Nc6.", "2 වන පේළිය: 2. Bc4 Nc6.") },
        { moves: [["d1", "h5"], ["g8", "f6"]], text: T("Row 3: 3. Qh5 Nf6. Write each move after you have made it on the board.", "3 වන පේළිය: 3. Qh5 Nf6. හැම ඇදීමක්ම පුවරුවේ ඇදපු පස්සේ ලියන්න.") },
        { move: ["h5", "f7"], caps: ["f7"], text: T("Row 4: 4. Qxf7#. Checkmate ends the game.", "4 වන පේළිය: 4. Qxf7#. චෙක්මේට් එකෙන් ක්‍රීඩාව ඉවරයි.") },
        { pos: NBD, move: ["b1", "d2"], hl: ["d2", "f3"], text: T("Two knights can go to d2. Add the file of the knight that moves: Nbd2. Without it nobody knows which knight moved.", "නයිට් දෙන්නෙකුට d2 ට යන්න පුළුවන්. ඇදෙන නයිට් එකේ සිරස් පේළියේ අකුර එකතු කරන්න: Nbd2. නැත්නම් ඇදුනේ කුමන නයිට් එකද කියලා කාටවත් තේරෙන්නේ නෑ.") },
        { text: T("At the end write the result: 1-0 White wins, 0-1 Black wins, ½-½ draw. Both players sign both scoresheets.", "අන්තිමට ප්‍රතිඵලය ලියන්න: 1-0 සුදු දිනුවා, 0-1 කළු දිනුවා, ½-½ ඩ්‍රෝ. ක්‍රීඩකයන් දෙන්නාම ස්කෝර්ෂීට් දෙකටම අත්සන් කරනවා.") },
      ] },

      { id: "touch-move", title: T("The touch-move rule", "ටච්-මූව් නීතිය"), steps: [
        { pos: TM, hl: ["c3"], text: T("Touch-move: if you deliberately touch one of your own pieces, you must move that piece, if it has a legal move.", "ටච්-මූව් (touch-move): ඔයාගේම ඉත්තෙක් හිතාමතා අල්ලුවොත්, ඒකට නීතිමය ඇදීමක් තියෙනවා නම් ඒ ඉත්තාවම ඇදන්න ඕන.") },
        { hl: ["d5"], text: T("If you deliberately touch an opponent’s piece, you must capture it, if you can.", "ප්‍රතිවාදියාගේ ඉත්තෙක් හිතාමතා අල්ලුවොත්, කපන්න පුළුවන් නම් ඒක කපන්න ඕන.") },
        { hl: ["c3"], text: T("To straighten a piece, say “J’adoube” or “I adjust” first, then touch it. Only the player whose turn it is may do this.", "ඉත්තෙක් කෙලින් කරන්න ඕන නම් මුලින් “ජඩූබ්” (J’adoube) හෝ “I adjust” කියලා, ඊට පස්සේ අල්ලන්න. ඒක කරන්න පුළුවන් වාරය තියෙන කෙනාට විතරයි.") },
        { text: T("Make every move with one hand only. Use the same hand to press the clock.", "හැම ඇදීමක්ම එක අතකින් විතරක් කරන්න. ඔරලෝසුව එබීමත් ඒ අතින්ම කරන්න.") },
        { pos: fp("4k3/8/8/8/8/8/8/R3K2R"), moves: [["e1", "g1"], ["h1", "f1"]], text: T("To castle, touch the king first, then the rook. If you touch the rook first, you may not castle that move.", "කාසලින් කරන්න නම් මුලින් රජුව අල්ලන්න, ඊට පස්සේ රුක් එක. මුලින් රුක් එක අල්ලුවොත් ඒ ඇදීමේදී කාසලින් කරන්න බෑ.") },
        { text: T("Once you let go of the piece on its new square, the move is made and you cannot change it. Think first, then touch.", "ඉත්තාව අලුත් කොටුවේ තියලා අත අරිනකොට ඇදීම ඉවරයි, ඒක වෙනස් කරන්න බෑ. මුලින් හිතන්න, ඊට පස්සේ අල්ලන්න.") },
      ] },

      { id: "illegal-moves", title: T("Illegal moves and penalties", "නීති විරෝධී ඇදීම් සහ දඬුවම්"), steps: [
        { pos: fp("4r1k1/8/8/8/8/8/4B3/4K3"), xs: ["d3"], hl: ["e2", "e1"], text: T("An illegal move breaks the rules. Here the bishop is pinned to its king by the rook. Bd3 would leave the king in check, so it is illegal.", "නීති විරෝධී ඇදීමක් කියන්නේ නීති කඩන ඇදීමක්. මෙතන බිෂොප් එක රුක් එකෙන් රජුට පින් වෙලා. Bd3 ඇදුවොත් රජුට චෙක් වෙනවා, ඒ නිසා ඒක නීති විරෝධියි.") },
        { pos: fp("4r1k1/8/8/8/8/8/8/4K3"), xs: ["e2"], hl: ["e1"], text: T("A king may never move to an attacked square. Ke2 is illegal because the rook attacks the whole e-file.", "රජුට ප්‍රහාර තියෙන කොටුවකට කවදාවත් යන්න බෑ. Ke2 නීති විරෝධියි, රුක් එක මුළු e සිරස් පේළියටම ප්‍රහාර කරන නිසා.") },
        { text: T("If you see an illegal move, stop the clock and call the arbiter. Do not fix the position yourself.", "නීති විරෝධී ඇදීමක් දැක්කොත් ඔරලෝසුව නවත්තලා ආබිටර් (arbiter) කෙනෙක්ව කතා කරන්න. ඔයාම පුවරුව හදන්න එපා.") },
        { text: T("In a standard game, the first completed illegal move gives the opponent 2 extra minutes. The position is put back.", "සාමාන්‍ය තරඟයකදී, සම්පූර්ණ කරපු පළමු නීති විරෝධී ඇදීමට ප්‍රතිවාදියාට අමතර මිනිත්තු 2ක් ලැබෙනවා. පුවරුව කලින් තිබුණු විදිහට හදනවා.") },
        { text: T("A second completed illegal move by the same player loses the game. If the opponent cannot mate by any legal moves, it is a draw.", "එකම ක්‍රීඩකයා විසින් දෙවැනි නීති විරෝධී ඇදීමක් සම්පූර්ණ කළොත් ඒ ක්‍රීඩාව පරදිනවා. ප්‍රතිවාදියාට කිසිම නීතිමය ඇදීම් පිළිවෙලකින් මේට් කරන්න බැරි නම් ඒක ඩ්‍රෝ.") },
        { text: T("The arbiter decides every question. Stay calm, do not argue, and ask the arbiter.", "හැම ප්‍රශ්නයක්ම තීරණය කරන්නේ ආබිටර්. සන්සුන්ව ඉඳලා, වාද නොකර ආබිටර්ගෙන් අහන්න.") },
      ] },

      { id: "draws", title: T("Ways to draw", "ඩ්‍රෝ වෙන ක්‍රම"), steps: [
        { text: T("A draw gives half a point to each player, written ½–½. There are several ways to get one.", "ඩ්‍රෝ එකකදී ක්‍රීඩකයන් දෙන්නාටම අඩ ලකුණු බැගින් ලැබෙනවා, ½–½ කියලා ලියනවා. ඒකට ක්‍රම කීපයක් තියෙනවා.") },
        { pos: fp("7k/5K2/6Q1/8/8/8/8/8"), hl: ["h8"], text: T("Stalemate: the player to move is not in check and has no legal move. Draw.", "ස්ටේල්මේට්: වාරය තියෙන කෙනාට චෙක් නෑ, ඒත් නීතිමය ඇදීමක් නෑ. ඩ්‍රෝ.") },
        { text: T("Agreement: after making your move, offer a draw. The opponent may accept or refuse. You cannot take an offer back.", "එකඟතාවෙන්: ඔයාගේ ඇදීම කරලා ඩ්‍රෝ එකක් ඉල්ලන්න. ප්‍රතිවාදියාට පිළිගන්න හරි ප්‍රතික්ෂේප කරන්න හරි පුළුවන්. ඉල්ලීමක් ආපහු ගන්න බෑ.") },
        { pos: KBK, hl: ["e3", "f3", "e6"], text: T("Not enough pieces: when nobody can ever checkmate, the game is drawn. King against king, or king and one bishop or knight against king.", "ඉත්තන් මදි: කාටවත් කවදාවත් මේට් කරන්න බැරි වුණාම ක්‍රීඩාව ඩ්‍රෝ. රජු එදිරියෙන් රජු, නැත්නම් රජුයි බිෂොප් එකක් හෝ නයිට් එකක් එදිරියෙන් රජු.") },
        { text: T("Repetition: the same position three times, with the same player to move. The player to move can ask the arbiter for a draw.", "පුනරාවර්තනය: එකම පුවරු තත්ත්වය, එකම ක්‍රීඩකයාට වාරය තියෙන විදිහට, තුන් වතාවක් එනවා. වාරය තියෙන ක්‍රීඩකයාට ආබිටර්ගෙන් ඩ්‍රෝ ඉල්ලන්න පුළුවන්.") },
        { text: T("50-move rule: 50 moves by each player with no pawn move and no capture. The player to move can ask for a draw.", "ඇදීම් 50 නීතිය: ක්‍රීඩකයන් දෙන්නාම ඇදීම් 50 බැගින් පෝන් ඇදීමක් හෝ කැපීමක් නැතුව ඇදුවාම, වාරය තියෙන ක්‍රීඩකයාට ඩ්‍රෝ ඉල්ලන්න පුළුවන්.") },
      ] },

      { id: "clock", title: T("Using a chess clock", "චෙස් ඔරලෝසුව පාවිච්චි කරමු"), steps: [
        { pos: START, text: T("A chess clock has two displays. Only the clock of the player whose turn it is runs. Each player has a fixed time for the whole game.", "චෙස් ඔරලෝසුවේ ප්‍රදර්ශන දෙකක් තියෙනවා. ක්‍රියා කරන්නේ වාරය තියෙන ක්‍රීඩකයාගේ ඔරලෝසුව විතරයි. හැම ක්‍රීඩකයෙකුටම මුළු ක්‍රීඩාවටම නියමිත වෙලාවක් තියෙනවා.") },
        { move: ["e2", "e4"], hl: ["e4"], text: T("First make your move on the board. Then press your side of the clock, with the same hand that made the move.", "මුලින් ඔයාගේ ඇදීම පුවරුවේ කරන්න. ඊට පස්සේ ඇදීම කරපු අතින්ම ඔරලෝසුවේ ඔයාගේ පැත්ත එබන්න.") },
        { text: T("Never press the clock before you move, and never hold or hit it. Handle it gently.", "ඇදීමට කලින් ඔරලෝසුව කිසිවිටෙකත් එබිය යුතු නැහැ. ඔරලෝසුව අල්ලාගෙන ඉන්නවත් ගහන්නවත් එපා, සෙමින් පාවිච්චි කරන්න.") },
        { text: T("Time control 10+5 means 10 minutes for the game, and 5 seconds added after every move you make.", "වෙලා පාලනය 10+5 කියන්නේ ක්‍රීඩාවට මිනිත්තු 10යි, ඔයා හැම ඇදීමක්ම කරපු පස්සේ තත්පර 5ක් එකතු වෙනවා.") },
        { text: T("If your time runs out, you lose. The exception: if your opponent cannot checkmate you by any legal moves, the game is a draw.", "ඔයාගේ වෙලාව ඉවර වුණොත් ඔයා පරදිනවා. ව්‍යතිරේකය: ඔයාගේ ප්‍රතිවාදියාට කිසිම නීතිමය ඇදීම් වලින් ඔයාට මේට් කරන්න බැරි නම් ඒක ඩ්‍රෝ.") },
      ] },
    ],
  };

  const P = {
    "notation": [
      { type: "move", pos: START, v: "legal", q: T("Play Nf3.", "Nf3 ඇදන්න."), ans: [["g1", "f3"]] },
      { type: "move", pos: START, v: "legal", q: T("Play e4.", "e4 ඇදන්න."), ans: [["e2", "e4"]] },
      { type: "move", pos: D1, v: "legal", q: T("Play exd5.", "exd5 ඇදන්න."), ans: [["e4", "d5"]] },
      { type: "choice", q: T("What does Bc4 mean?", "Bc4 කියන්නේ මොකක්ද?"), opts: [T("The bishop moves to c4", "බිෂොප් c4 ට යනවා"), T("A pawn moves to c4", "පෝන් එකක් c4 ට යනවා"), T("The bishop captures on c4", "බිෂොප් c4 කපනවා")], a: 0 },
      { type: "choice", q: T("What does the letter x mean in notation?", "නොටේෂන් වල x අකුරෙන් අදහස් වෙන්නේ මොකක්ද?"), opts: [T("A capture", "කැපීමක්"), T("Check", "චෙක්"), T("Castling", "කාසලින්")], a: 0 },
      { type: "choice", q: T("What does the symbol # mean?", "# සලකුණෙන් අදහස් වෙන්නේ මොකක්ද?"), opts: [T("Checkmate", "චෙක්මේට්"), T("Check", "චෙක්"), T("A capture", "කැපීමක්")], a: 0 },
    ],
    "scoresheet": [
      { type: "choice", q: T("A scoresheet reads: 1. e4 e5 2. Nf3. What was Black’s first move?", "ස්කෝර්ෂීට් එකක ලියලා තියෙන්නේ: 1. e4 e5 2. Nf3. කළුගේ පළමු ඇදීම මොකක්ද?"), opts: ["e4", "e5", "Nf3"], a: 1 },
      { type: "choice", q: T("How is a win for White written?", "සුදු දිනුවා කියලා ලියන්නේ කොහොමද?"), opts: ["1-0", "0-1", "½-½"], a: 0 },
      { type: "choice", pos: NBD, q: T("Two knights can go to d2. How do you write the move of the knight from b1?", "නයිට් දෙන්නෙකුට d2 ට යන්න පුළුවන්. b1 හි නයිට් එකේ ඇදීම ලියන්නේ කොහොමද?"), opts: ["Nbd2", "Nd2", "Nb1"], a: 0 },
      { type: "move", pos: NBD, v: "legal", q: T("Play Nbd2.", "Nbd2 ඇදන්න."), ans: [["b1", "d2"]] },
      { type: "choice", q: T("How is a draw written?", "ඩ්‍රෝ එකක් ලියන්නේ කොහොමද?"), opts: ["1-0", "0-1", "½-½"], a: 2 },
      { type: "choice", q: T("When do you write your move on the scoresheet?", "ඔයාගේ ඇදීම ස්කෝර්ෂීට් එකේ ලියන්නේ කවදාද?"), opts: [T("After I have made it on the board", "පුවරුවේ ඇදපු පස්සේ"), T("Before I make it", "ඇදීමට කලින්"), T("Only at the end of the game", "ක්‍රීඩාව ඉවර වුණාම විතරයි")], a: 0 },
    ],
    "touch-move": [
      { type: "choice", pos: TM, q: T("You deliberately touch your knight, and it has a legal move. What must you do?", "ඔයා හිතාමතා ඔයාගේ නයිට් එක අල්ලුවා, ඒකට නීතිමය ඇදීමක් තියෙනවා. ඔයා කරන්න ඕන මොකක්ද?"), opts: [T("Move that knight", "ඒ නයිට් එකම ඇදීම"), T("Move any piece I like", "මම කැමති ඕනෑම ඉත්තෙක් ඇදීම"), T("Put it back and start again", "ආපහු තියලා ආයෙ පටන් ගැනීම")], a: 0 },
      { type: "choice", q: T("You want to straighten a piece on its square. What do you say first?", "ඔයාට ඉත්තෙක් එහි කොටුවේ කෙලින් කරන්න ඕන. මුලින් මොනවා කියන්නද?"), opts: ["J’adoube", "Check", "Sorry"], a: 0 },
      { type: "choice", pos: TM, q: T("You deliberately touch the black pawn on d5, and your knight can capture it. What must you do?", "ඔයා හිතාමතා d5 හි කළු පෝන් එක අල්ලුවා, ඔයාගේ නයිට් එකට ඒක කපන්න පුළුවන්. ඔයා කරන්න ඕන මොකක්ද?"), opts: [T("Capture it", "ඒක කපන්න"), T("Ignore it", "නොසලකා හරින්න"), T("Move my king", "මගේ රජුව ඇදන්න")], a: 0 },
      { type: "choice", q: T("How many hands do you use to make a move?", "ඇදීමක් කරන්න අත් කීයක් පාවිච්චි කරනවද?"), opts: ["1", "2", T("Either", "ඕනෑම එකක්")], a: 0 },
      { type: "choice", q: T("When you castle, which piece do you touch first?", "කාසලින් කරනකොට මුලින් අල්ලන්නේ කුමන ඉත්තාවද?"), opts: [T("The king", "රජුව"), T("The rook", "රුක් එක"), T("Either one", "ඕනෑම එකක්")], a: 0 },
      { type: "choice", q: T("You put your piece on a new square and let go. May you change your mind?", "ඔයා ඔයාගේ ඉත්තා අලුත් කොටුවක තියලා අත අරිනවා. ඔයාට අදහස වෙනස් කරන්න පුළුවන්ද?"), opts: [YES, NO], a: 1 },
    ],
    "illegal-moves": [
      { type: "choice", pos: fp("4r1k1/8/8/8/8/8/4B3/4K3"), mv: ["e2", "d3"], legal: false, q: T("White plays Bd3. Is this a legal move?", "සුදු Bd3 ඇදුවා. ඒක නීතිමය ඇදීමක්ද?"), opts: [YES, NO], a: 1 },
      { type: "choice", pos: fp("4r1k1/8/8/8/8/8/8/4K3"), mv: ["e1", "e2"], legal: false, q: T("White plays Ke2. Is this a legal move?", "සුදු Ke2 ඇදුවා. ඒක නීතිමය ඇදීමක්ද?"), opts: [YES, NO], a: 1 },
      { type: "choice", pos: fp("6k1/8/8/8/8/8/4B3/6K1"), mv: ["e2", "e5"], legal: false, q: T("White moves the bishop straight up the file, e2 to e5. Is this legal?", "සුදු බිෂොප් එක e2 ඉඳන් e5 ට සිරස්ව ඇදුවා. ඒක නීතිමය ද?"), opts: [YES, NO], a: 1 },
      { type: "choice", q: T("Your opponent makes an illegal move. What do you do?", "ඔයාගේ ප්‍රතිවාදියා නීති විරෝධී ඇදීමක් කළා. ඔයා කරන්නේ මොකක්ද?"), opts: [T("Stop the clock and call the arbiter", "ඔරලෝසුව නවත්තලා ආබිටර්ව කතා කිරීම"), T("Fix the board myself", "මමම පුවරුව හදනවා"), T("Keep playing", "ක්‍රීඩාව දිගටම කරනවා")], a: 0 },
      { type: "choice", q: T("What happens after the first completed illegal move in a standard game?", "සාමාන්‍ය තරඟයක පළමු සම්පූර්ණ නීති විරෝධී ඇදීමට පස්සේ වෙන්නේ මොකක්ද?"), opts: [T("2 minutes are added to the opponent’s clock", "ප්‍රතිවාදියාගේ ඔරලෝසුවට මිනිත්තු 2ක් එකතු වෙනවා"), T("The player loses the game", "ක්‍රීඩකයා ක්‍රීඩාව පරදිනවා"), T("Nothing happens", "කිසිවක් වෙන්නේ නෑ")], a: 0 },
      { type: "choice", q: T("A player completes a second illegal move. What is the usual result?", "ක්‍රීඩකයෙක් දෙවැනි නීති විරෝධී ඇදීමක් සම්පූර්ණ කළා. සාමාන්‍ය ප්‍රතිඵලය මොකක්ද?"), opts: [T("The player loses the game", "ක්‍රීඩකයා ක්‍රීඩාව පරදිනවා"), T("Another 2 minutes", "තවත් මිනිත්තු 2ක්"), T("Only a warning", "අවවාදයක් විතරයි")], a: 0 },
    ],
    "draws": [
      { type: "choice", pos: KK, q: T("Only the two kings are left. What is the result?", "ඉතිරිවෙලා තියෙන්නේ රජවරු දෙන්නා විතරයි. ප්‍රතිඵලය මොකක්ද?"), opts: [T("Draw", "ඩ්‍රෝ"), T("White wins", "සුදු දිනනවා"), T("Black wins", "කළු දිනනවා")], a: 0 },
      { type: "choice", pos: KBK, q: T("White has a king and one bishop, Black has only a king. What is the result?", "සුදුට රජුයි බිෂොප් එකක් විතරයි, කළුට රජු විතරයි. ප්‍රතිඵලය මොකක්ද?"), opts: [T("Draw", "ඩ්‍රෝ"), T("White wins", "සුදු දිනනවා"), T("Black wins", "කළු දිනනවා")], a: 0 },
      { type: "choice", q: T("How many times must the same position appear for a repetition claim?", "පුනරාවර්තන ඉල්ලීමකට එකම පුවරු තත්ත්වය කී වතාවක් එන්න ඕනද?"), opts: ["2", "3", "5"], a: 1 },
      { type: "choice", q: T("In the 50-move rule, how many moves by each player pass with no pawn move and no capture?", "ඇදීම් 50 නීතියේදී, පෝන් ඇදීමක් හෝ කැපීමක් නැතුව ක්‍රීඩකයන් දෙන්නාම කී ඇදීම් ඇදිය යුතුද?"), opts: ["20", "50", "100"], a: 1 },
      { type: "choice", q: T("When may you offer a draw?", "ඩ්‍රෝ එකක් ඉල්ලන්න පුළුවන් කවදාද?"), opts: [T("After making my move, before I press the clock", "මගේ ඇදීම කරලා, ඔරලෝසුව එබීමට කලින්"), T("While my opponent is thinking", "ප්‍රතිවාදියා හිතනකොට"), T("Never", "කවදාවත් බෑ")], a: 0 },
      { type: "choice", q: T("Which of these is NOT a draw?", "මේවායින් ඩ්‍රෝ නොවන්නේ කුමක්ද?"), opts: [T("Checkmate", "චෙක්මේට්"), T("Stalemate", "ස්ටේල්මේට්"), T("Draw by agreement", "එකඟතාවෙන් ඩ්‍රෝ"),], a: 0 },
    ],
    "clock": [
      { type: "choice", q: T("Which hand presses the clock?", "ඔරලෝසුව එබිය යුත්තේ කුමන අතින්ද?"), opts: [T("The hand that made the move", "ඇදීම කරපු අතින්"), T("The other hand", "අනිත් අතින්"), T("Both hands", "අත් දෙකෙන්ම")], a: 0 },
      { type: "choice", pos: fp("4k2r/8/8/8/8/8/8/4K3"), q: T("Black’s time runs out. White has only a king and cannot checkmate. What is the result?", "කළුගේ වෙලාව ඉවරයි. සුදුට රජු විතරයි, මේට් කරන්න බෑ. ප්‍රතිඵලය මොකක්ද?"), opts: [T("Draw", "ඩ්‍රෝ"), T("Black loses", "කළු පරදිනවා"), T("White loses", "සුදු පරදිනවා")], a: 0 },
      { type: "choice", q: T("What does the time control 10+5 mean?", "වෙලා පාලනය 10+5 කියන්නේ මොකක්ද?"), opts: [T("10 minutes plus 5 seconds after each move", "මිනිත්තු 10යි, හැම ඇදීමකටම පස්සේ තත්පර 5ක්"), T("10 seconds plus 5 minutes", "තත්පර 10යි මිනිත්තු 5යි"), T("15 minutes total", "මුළු මිනිත්තු 15යි")], a: 0 },
      { type: "choice", q: T("What do you do right after you make your move?", "ඔයාගේ ඇදීම කරපු ගමන් කරන්නේ මොකක්ද?"), opts: [T("Press the clock", "ඔරලෝසුව එබීම"), T("Wait for the opponent", "ප්‍රතිවාදියා එනතුරු බලා ඉන්න"), T("Write the result", "ප්‍රතිඵලය ලියන්න")], a: 0 },
      { type: "choice", q: T("May you press the clock before you make your move?", "ඔයාගේ ඇදීම කරන්න කලින් ඔරලෝසුව එබුවාට කමක් නැද්ද?"), opts: [YES, NO], a: 1 },
      { type: "choice", q: T("Your time runs out, and your opponent has enough pieces to checkmate. What is the result?", "ඔයාගේ වෙලාව ඉවරයි, ඔයාගේ ප්‍රතිවාදියාට මේට් කරන්න ඉත්තන් ඇති. ප්‍රතිඵලය මොකක්ද?"), opts: [T("I lose", "මම පරදිනවා"), T("Draw", "ඩ්‍රෝ"), T("I win", "මම දිනනවා")], a: 0 },
    ],
  };

  window.PQ_PRACTICE = Object.assign(window.PQ_PRACTICE || {}, P);
  window.PQ_MODULES = (window.PQ_MODULES || []).concat([window.PQ_MODULE_5]);
})();
