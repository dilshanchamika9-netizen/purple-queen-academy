/* Purple Queen Chess Academy — Level 2 · Module 3: Opening repertoire basics
   Hand-built lines (legality checked with python-chess). Sinhala needs coach review. */
(function () {
  const T = (en, si) => ({ en, si });
  const fp = window.PQ_FP;
  window.PQ_MODULE_10 = {
    level: T("Level 2 · Knight", "මට්ටම 2 · නයිට්"),
    title: T("Opening repertoire basics", "ආරම්භක ක්‍රීඩා මූලික"),
    lessons: [
      { id: "l2-italian", title: {en:"The Italian Game",si:"ඉතාලි ක්‍රීඩාව (Italian Game)"}, steps: [
        { pos: fp("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"), text: {en:"The Italian Game starts 1. e4 e5 2. Nf3 Nc6 3. Bc4. It is one of the oldest and most popular openings, and it follows every opening principle.",si:"ඉතාලි ක්‍රීඩාව (Italian Game) පටන් ගන්නේ 1. e4 e5 2. Nf3 Nc6 3. Bc4 වලින්. ඒක පැරණිම, ජනප්‍රියම ආරම්භයක්, හැම ආරම්භක මූලධර්මයක්ම අනුගමනය කරනවා."} },
        { moves: [["e2","e4"],["e7","e5"]], text: {en:"1. e4 e5. White takes the centre with a pawn and Black does the same.",si:"1. e4 e5. සුදු පෝන් එකකින් මැද ගන්නවා, කළුත් ඒකම කරනවා."} },
        { moves: [["g1","f3"],["b8","c6"]], text: {en:"2. Nf3 Nc6. White attacks the e5 pawn, and Black defends it with the knight.",si:"2. Nf3 Nc6. සුදු e5 පෝන් එකට ප්‍රහාර කරනවා, කළු නයිට් එකෙන් ආරක්ෂා කරනවා."} },
        { moves: [["f1","c4"],["f8","c5"]], text: {en:"3. Bc4 Bc5. The bishop aims at f7, the weakest square in Black’s camp. Black copies the idea.",si:"3. Bc4 Bc5. බිෂොප් එක කළු කඳවුරේ දුර්වලම කොටුව වන f7 ට ඉලක්ක කරනවා. කළුත් ඒක අනුකරණය කරනවා."} },
        { moves: [["c2","c3"],["g8","f6"]], text: {en:"4. c3 Nf6. White prepares d4 to build a big centre. Black develops a knight.",si:"4. c3 Nf6. සුදු විශාල මැදක් හදන්න d4 ට සූදානම් වෙනවා. කළු නයිට් එකක් එළියට ගන්නවා."} },
        { move: ["d2","d4"], text: {en:"5. d4. White now has two pawns in the centre. Next steps: castle and finish developing.",si:"5. d4. දැන් සුදුට මැද පෝන් දෙකක් තියෙනවා. ඊළඟට: කාසලින් කරලා ඉතිරි ඉත්තන් එළියට ගන්න."} }
      ] },
      { id: "l2-queens-gambit", title: {en:"The Queen’s Gambit",si:"රැජිනගේ ගැම්බිට් (Queen’s Gambit)"}, steps: [
        { pos: fp("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"), text: {en:"The Queen’s Gambit starts 1. d4 d5 2. c4. White offers the c-pawn to pull Black’s d-pawn away from the centre.",si:"රැජිනගේ ගැම්බිට් (Queen’s Gambit) පටන් ගන්නේ 1. d4 d5 2. c4 වලින්. සුදු c පෝන් එක පූජා කරන්නාක් වගේ ඉදිරිපත් කරන්නේ කළුගේ d පෝන් එක මැදින් ඈත් කරන්න."} },
        { moves: [["d2","d4"],["d7","d5"],["c2","c4"]], text: {en:"1. d4 d5 2. c4. White attacks the d5 pawn with the c-pawn.",si:"1. d4 d5 2. c4. සුදු c පෝන් එකෙන් d5 පෝන් එකට ප්‍රහාර කරනවා."} },
        { moves: [["e7","e6"],["b1","c3"]], text: {en:"2… e6 3. Nc3. Black defends d5 with the e-pawn. White develops a knight and adds pressure on d5.",si:"2… e6 3. Nc3. කළු e පෝන් එකෙන් d5 ආරක්ෂා කරනවා. සුදු නයිට් එකක් එළියට ගෙන d5 ට තද කරනවා."} },
        { moves: [["g8","f6"],["c1","g5"],["f8","e7"]], text: {en:"3… Nf6 4. Bg5 Be7. Both sides develop. White’s bishop pins the knight to the queen.",si:"3… Nf6 4. Bg5 Be7. දෙපැත්තම ඉත්තන් එළියට ගන්නවා. සුදු බිෂොප් එක නයිට් එක රැජිනට පින් කරනවා."} },
        { move: ["e2","e3"], text: {en:"5. e3. White opens the bishop on f1 and protects d4. Then comes Nf3 and castling.",si:"5. e3. සුදු f1 හි බිෂොප් එක විවෘත කරනවා, d4 ආරක්ෂා කරනවා. ඊට පස්සේ Nf3 සහ කාසලින්."} },
        { text: {en:"It is called a gambit, but it is not a real sacrifice. If Black takes on c4, White wins the pawn back with e3 and Bxc4.",si:"මේක ගැම්බිට් එකක් කිව්වට සැබෑ පූජාවක් නෙමෙයි. කළු c4 ට කැපුවොත් සුදු e3 සහ Bxc4 වලින් පෝන් එක ආපහු දිනාගන්නවා."} }
      ] },
      { id: "l2-answer-e4-d4", title: {en:"Answering 1. e4 and 1. d4",si:"1. e4 සහ 1. d4 ට පිළිතුරු දීම"}, steps: [
        { pos: fp("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR"), text: {en:"Playing Black, answer in the same spirit as White: fight for the centre. After 1. e4 the classical reply is 1… e5.",si:"කළු ලෙස ක්‍රීඩා කරද්දී, සුදු වගේම මැද සඳහා සටන් කරන්න. 1. e4 ට පසු සම්භාව්‍ය පිළිතුර 1… e5."} },
        { move: ["e7","e5"], text: {en:"1… e5. Black takes the centre and opens lines for the bishop and queen. Another good reply is 1… c5, the Sicilian.",si:"1… e5. කළු මැද ගන්නවා, බිෂොප් සහ රැජිනට පේළි විවෘත කරනවා. තවත් හොඳ පිළිතුරක් 1… c5, සිසිලියන්."} },
        { pos: fp("rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR"), text: {en:"After 1. d4 the simplest reply is 1… d5. Black blocks the pawn and holds the centre.",si:"1. d4 ට පසු සරලම පිළිතුර 1… d5. කළු පෝන් එක අවහිර කරලා මැද තියාගන්නවා."} },
        { move: ["d7","d5"], text: {en:"1… d5. Now both centres are fixed, and development begins. Another good reply is 1… Nf6.",si:"1… d5. දැන් දෙපැත්තේම මැද ස්ථාවරයි, ඉත්තන් එළියට ගැනීම පටන් ගන්නවා. තවත් හොඳ පිළිතුරක් 1… Nf6."} },
        { text: {en:"Do not answer a centre move with a side pawn move such as 1… a6 or 1… h6. These waste time and leave the centre to White.",si:"මැද පෝන් ඇදීමකට a6 හෝ h6 වගේ පැති පෝන් ඇදීමකින් පිළිතුරු දෙන්න එපා. ඒවා කාලය නාස්ති කරලා මැද සුදුට දෙනවා."} }
      ] },
      { id: "l2-early-queen", title: {en:"Avoiding early queen moves",si:"කලින් රැජින ඇදීම මග හැරීම"}, steps: [
        { pos: fp("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR"), text: {en:"Do not bring your queen out early. The queen is valuable, so the opponent can attack it with smaller pieces and gain time.",si:"රැජින කලින් එළියට ගන්න එපා. රැජින වටිනවා, ඒ නිසා සතුරාට පොඩි ඉත්තන් වලින් ප්‍රහාර කරලා කාලය දිනාගන්න පුළුවන්."} },
        { moves: [["d1","h5"],["b8","c6"]], text: {en:"2. Qh5 Nc6. The queen comes out and attacks e5 and f7. Black simply defends e5 and develops a knight.",si:"2. Qh5 Nc6. රැජින එළියට ඇවිත් e5 සහ f7 ට ප්‍රහාර කරනවා. කළු e5 ආරක්ෂා කරන ගමන් නයිට් එක එළියට ගන්නවා."} },
        { moves: [["f1","c4"],["g7","g6"]], text: {en:"3. Bc4 g6. Black attacks the queen with a pawn. The queen must move again.",si:"3. Bc4 g6. කළු පෝන් එකෙන් රැජිනට ප්‍රහාර කරනවා. රැජින නැවත ඇදෙන්න ඕන."} },
        { moves: [["h5","f3"],["g8","f6"]], text: {en:"4. Qf3 Nf6. Black developed a knight with a gain of time. White has lost two moves with the queen.",si:"4. Qf3 Nf6. කළු කාලයක් දිනාගෙන නයිට් එකක් එළියට ගත්තා. සුදු රැජිනෙන් ඇදීම් දෙකක් නාස්ති කළා."} },
        { pos: fp("r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR"), text: {en:"Be careful too. Here Qxf7 is checkmate if Black does not defend. The early queen can create threats, so always check what it attacks.",si:"ප්‍රවේශම් වෙන්නත් ඕන. මෙතන කළු ආරක්ෂා නොකළොත් Qxf7 චෙක්මේට්. කලින් එළියට ගත් රැජිනට තර්ජන හදන්න පුළුවන්, ඒ නිසා ඒක ප්‍රහාර කරන්නේ මොනවාටද කියලා හැමවිටම බලන්න."} }
      ] },
    ],
  };
  const P = {
    "l2-italian": [
      { type: "move", pos: fp("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, ans: [["e2","e4"]] },
      { type: "move", pos: fp("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, ans: [["g1","f3"]] },
      { type: "move", pos: fp("r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, ans: [["f1","c4"]] },
      { type: "move", pos: fp("r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, ans: [["c2","c3"],["d2","d3"]] },
      { type: "move", pos: fp("r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, ans: [["d2","d4"],["d2","d3"]] },
      { type: "choice", pos: fp("r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R"), q: {en:"Which square does the bishop on c4 aim at?",si:"c4 හි බිෂොප් එක ඉලක්ක කරන්නේ කුමන කොටුවටද?"}, opts: [{en:"f7",si:"f7"},{en:"e5",si:"e5"},{en:"d5",si:"d5"}], a: 0 }
    ],
    "l2-queens-gambit": [
      { type: "move", pos: fp("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, ans: [["d2","d4"]] },
      { type: "move", pos: fp("rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, ans: [["c2","c4"]] },
      { type: "move", pos: fp("rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, ans: [["b1","c3"]] },
      { type: "move", pos: fp("rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, ans: [["c1","g5"],["g1","f3"]] },
      { type: "move", pos: fp("rnbqk2r/ppp1bppp/4pn2/3p2B1/2PP4/2N5/PP2PPPP/R2QKBNR"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, ans: [["e2","e3"],["g1","f3"]] },
      { type: "choice", pos: fp("rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR"), q: {en:"Is the Queen’s Gambit a real sacrifice of a pawn?",si:"රැජිනගේ ගැම්බිට් එක සැබෑ පෝන් පූජාවක්ද?"}, opts: [{en:"No, White can win the pawn back",si:"නැහැ, සුදුට පෝන් එක ආපහු දිනාගන්න පුළුවන්"},{en:"Yes, White never gets it back",si:"ඔව්, සුදුට ආපහු ලැබෙන්නේ නෑ"},{en:"It is not a pawn, it is a bishop",si:"ඒක පෝන් එකක් නෙමෙයි, බිෂොප් එකක්"}], a: 0 }
    ],
    "l2-answer-e4-d4": [
      { type: "choice", pos: fp("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR"), q: {en:"After 1. e4, Black to move. Which move fights for the centre?",si:"1. e4 ට පසු, කළුගේ වාරය. මැද සඳහා සටන් කරන්නේ කුමන ඇදීමද?"}, opts: [{en:"…a6",si:"…a6"},{en:"…e5",si:"…e5"},{en:"…h6",si:"…h6"}], a: 1 },
      { type: "choice", pos: fp("rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR"), q: {en:"After 1. d4, Black to move. Which move fights for the centre?",si:"1. d4 ට පසු, කළුගේ වාරය. මැද සඳහා සටන් කරන්නේ කුමන ඇදීමද?"}, opts: [{en:"…d5",si:"…d5"},{en:"…a5",si:"…a5"},{en:"…h5",si:"…h5"}], a: 0 },
      { type: "choice", pos: fp("rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R"), q: {en:"After 2. Nf3, Black to move. Which move defends the e5 pawn?",si:"2. Nf3 ට පසු, කළුගේ වාරය. e5 පෝන් එක ආරක්ෂා කරන්නේ කුමන ඇදීමද?"}, opts: [{en:"…Nc6",si:"…Nc6"},{en:"…a6",si:"…a6"},{en:"…h6",si:"…h6"}], a: 0 },
      { type: "choice", pos: fp("rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR"), q: {en:"After 2. c4, Black to move. Which move defends the d5 pawn?",si:"2. c4 ට පසු, කළුගේ වාරය. d5 පෝන් එක ආරක්ෂා කරන්නේ කුමන ඇදීමද?"}, opts: [{en:"…a6",si:"…a6"},{en:"…h6",si:"…h6"},{en:"…e6",si:"…e6"}], a: 2 },
      { type: "choice", q: {en:"Which is the better reply to 1. e4: 1… e5 or 1… a6?",si:"1. e4 ට වඩා හොඳ පිළිතුර මොකක්ද: 1… e5 ද 1… a6 ද?"}, opts: [{en:"1… a6",si:"1… a6"},{en:"1… e5",si:"1… e5"},{en:"Both are equally good",si:"දෙකම සමානව හොඳයි"}], a: 1 },
      { type: "choice", q: {en:"Why is a side pawn move such as 1… h6 weak against 1. e4?",si:"1. e4 ට එරෙහිව 1… h6 වගේ පැති පෝන් ඇදීමක් දුර්වල වෙන්නේ ඇයි?"}, opts: [{en:"It does not fight for the centre and wastes time",si:"ඒක මැද සඳහා සටන් කරන්නේ නෑ, කාලය නාස්ති කරනවා"},{en:"It loses a piece at once",si:"ඒකෙන් ඉත්තෙක් එක්වරම නැති වෙනවා"},{en:"It is against the rules",si:"ඒක නීති විරෝධියි"}], a: 0 }
    ],
    "l2-early-queen": [
      { type: "choice", pos: fp("r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR"), q: {en:"Black to move. Which move stops Qxf7 mate?",si:"කළුගේ වාරය. Qxf7 මේට් එක නවත්වන්නේ කුමන ඇදීමද?"}, opts: [{en:"…g6",si:"…g6"},{en:"…a6",si:"…a6"},{en:"…h6",si:"…h6"}], a: 0 },
      { type: "choice", pos: fp("rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR"), q: {en:"After 2. Qh5, Black to move. Which move develops a piece and defends e5?",si:"2. Qh5 ට පසු, කළුගේ වාරය. ඉත්තෙක් එළියට ගන්න ගමන් e5 ආරක්ෂා කරන්නේ කුමන ඇදීමද?"}, opts: [{en:"…a6",si:"…a6"},{en:"…Nc6",si:"…Nc6"},{en:"…h6",si:"…h6"}], a: 1 },
      { type: "choice", q: {en:"Why is an early queen move usually a mistake?",si:"කලින් රැජින ඇදීම සාමාන්‍යයෙන් වැරැද්දක් වෙන්නේ ඇයි?"}, opts: [{en:"The queen can be attacked and you lose time",si:"රැජිනට ප්‍රහාර වෙන්න පුළුවන්, කාලය නාස්ති වෙනවා"},{en:"The queen cannot move that early",si:"රැජිනට ඒ තරම් කලින් ඇදෙන්න බෑ"},{en:"It is not allowed by the rules",si:"නීතියෙන් ඒක අවසර නෑ"}], a: 0 },
      { type: "choice", q: {en:"Which pieces should you develop first?",si:"මුලින් එළියට ගත යුත්තේ කුමන ඉත්තන්ද?"}, opts: [{en:"Knights and bishops",si:"නයිට් සහ බිෂොප්"},{en:"The queen and rooks",si:"රැජින සහ රුක්"},{en:"The king",si:"රජු"}], a: 0 },
      { type: "choice", pos: fp("r1bqkbnr/pppp1p1p/2n3p1/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR"), q: {en:"White’s queen on h5 is attacked by the pawn on g6. What should White do?",si:"h5 හි සුදු රැජිනට g6 හි පෝන් එකෙන් ප්‍රහාර වෙනවා. සුදු කළ යුත්තේ මොකද්ද?"}, opts: [{en:"Move the queen to safety, for example Qf3",si:"රැජින ආරක්ෂිත තැනකට ඇදීම, උදා Qf3"},{en:"Ignore it",si:"නොසලකා හැරීම"},{en:"Castle",si:"කාසලින් කිරීම"}], a: 0 }
    ]
  };
  window.PQ_PRACTICE = Object.assign(window.PQ_PRACTICE || {}, P);
  window.PQ_MODULES = (window.PQ_MODULES || []).concat([window.PQ_MODULE_10]);
})();
