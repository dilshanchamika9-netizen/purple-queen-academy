/* Purple Queen Chess Academy — Level 2 · Module 2: Combinations and calculation
   Puzzle positions: Lichess CC0 database, White to move (Black positions mirrored). Exchange-counting positions are hand-built and engine-checked. Sinhala needs coach review. */
(function () {
  const T = (en, si) => ({ en, si });
  const fp = window.PQ_FP;
  window.PQ_MODULE_9 = {
    level: T("Level 2 · Knight", "මට්ටම 2 · නයිට්"),
    title: T("Combinations and calculation", "සංයෝජන සහ ගණනය කිරීම"),
    lessons: [
      { id: "l2-candidates", title: {en:"Candidate moves",si:"කැන්ඩිඩේට් ඇදීම් (ඇදිය හැකි ඇදීම්)"}, steps: [
        { pos: fp("6k1/6p1/2R2bK1/P6p/1PR5/2P3P1/r5r1/8"), text: {en:"A candidate move is a move worth looking at. Before choosing, write down two or three candidates instead of playing the first move you see.",si:"කැන්ඩිඩේට් මූවි (candidate move) එකක් කියන්නේ සලකා බලන්න වටින ඇදීමක්. තෝරන්න කලින්, ඔයාට පළවෙනියට පෙනෙන ඇදීම ඇදෙන්නේ නැතුව ඇදීම් දෙකක් තුනක් ලියාගන්න."} },
        { text: {en:"Start with forcing moves: checks, captures and threats. They limit what the opponent can do, so they are easier to calculate.",si:"බලකරන ඇදීම් වලින් පටන් ගන්න: චෙක්, කැපීම් සහ තර්ජන. ඒවා සතුරාගේ විකල්ප අඩු කරනවා, ඒ නිසා ගණනය කරන්න ලේසියි."} },
        { pos: fp("6k1/6p1/2R2bK1/P6p/1PR5/2P3P1/r5r1/8"), move: ["c6","c8"], text: {en:"Rc1+. A forcing first move. Now see how the opponent must answer.",si:"Rc1+. බලකරන පළවෙනි ඇදීමක්. දැන් සතුරාට පිළිතුරු දෙන්න වෙන්නේ කොහොමද කියලා බලන්න."} },
        { move: ["f6","d8"], text: {en:"Black replies Bd1.",si:"කළු Bd1 ලෙස පිළිතුරු දෙනවා."} },
        { move: ["c8","d8"], caps: ["d8"], text: {en:"Rxd1#. Checkmate.",si:"Rxd1#. චෙක්මේට්."} },
        { text: {en:"Write down two or three candidates, then calculate the most forcing one first.",si:"කැන්ඩිඩේට් ඇදීම් දෙකක් තුනක් ලියලා, වඩාත්ම බලකරන එක මුලින් ගණනය කරන්න."} }
      ] },
      { id: "l2-checks-captures", title: {en:"Checks, captures, threats",si:"චෙක්, කැපීම්, තර්ජන"}, steps: [
        { pos: fp("r1b2r1k/pp4pp/1b2p1q1/5pB1/1Q4nP/2N3P1/PP2PPB1/R2R2K1"), text: {en:"Before every move, scan in this order: checks, captures, threats. First for you, then for your opponent.",si:"හැම ඇදීමකටම කලින් මේ පිළිවෙලට බලන්න: චෙක්, කැපීම්, තර්ජන. මුලින් ඔයාට, ඊට පස්සේ ඔයාගේ ප්‍රතිවාදියාට."} },
        { text: {en:"This habit finds hanging pieces and stops you from missing your opponent’s threats.",si:"මේ පුරුද්දෙන් ආරක්ෂාවක් නැති ඉත්තන් හොයාගන්න පුළුවන්, ඒ වගේම ප්‍රතිවාදියාගේ තර්ජන මග හැරෙන්නෙත් නෑ."} },
        { pos: fp("r1b2r1k/pp4pp/1b2p1q1/5pB1/1Q4nP/2N3P1/PP2PPB1/R2R2K1"), move: ["b4","f8"], caps: ["f8"], text: {en:"Qxf8#. A capture that wins material because the piece is unprotected.",si:"Qxf8#. ඉත්තාට ආරක්ෂාවක් නැති නිසා ද්‍රව්‍ය දිනාගන්න කැපීමක්."} },
        { text: {en:"Checks, captures, threats. Every move, both sides.",si:"චෙක්, කැපීම්, තර්ජන. හැම ඇදීමකම, දෙපැත්තටම."} }
      ] },
      { id: "l2-exchanges", title: {en:"Counting exchanges",si:"හුවමාරු ගණන් කිරීම"}, steps: [
        { pos: fp("4k3/p7/3p4/4p3/8/5N2/P7/4K3"), hl: ["e5","f3","d6"], text: {en:"Count before you capture. The pawn on e5 is attacked once, by the knight on f3, and defended once, by the pawn on d6.",si:"කපන්න කලින් ගණන් කරන්න. e5 හි පෝන් එකට f3 හි නයිට් එකෙන් එක වතාවක් ප්‍රහාර වෙනවා, d6 හි පෝන් එකෙන් එක වතාවක් ආරක්ෂා වෙනවා."} },
        { moves: [["f3","e5"],["d6","e5"]], caps: ["e5"], text: {en:"Nxe5 dxe5. White wins a pawn (1) but loses a knight (3). The count was equal, but White loses material.",si:"Nxe5 dxe5. සුදු පෝන් එකක් (1) දිනනවා, නයිට් එකක් (3) නැති වෙනවා. ගණන සමානයි, ඒත් සුදුට ද්‍රව්‍ය අහිමි වෙනවා."} },
        { pos: fp("4k3/p7/3p4/4p3/3P4/5N2/P7/4K3"), hl: ["d4","e5","d6"], text: {en:"Now a pawn attacks e5. Capture with the cheapest piece first.",si:"දැන් පෝන් එකකින් e5 ට ප්‍රහාර කරනවා. මුලින් කපන්නේ ලාබම වටිනාකමේ ඉත්තාගෙන්."} },
        { moves: [["d4","e5"],["d6","e5"],["f3","e5"]], caps: ["e5"], text: {en:"dxe5 dxe5 Nxe5. White gives one pawn and takes two. White wins a pawn.",si:"dxe5 dxe5 Nxe5. සුදු පෝන් එකක් දීලා දෙකක් ගන්නවා. සුදු පෝන් එකක් දිනනවා."} },
        { text: {en:"Add it up: what I win minus what I lose. Capture only if the total is positive. Piece values count, not only the number of pieces.",si:"එකතු කරලා බලන්න: මම දිනන දේ අඩු කරන්න මම නැති කරන දේ. එකතුව ධන නම් පමණක් කපන්න. ඉත්තන් ගණන විතරක් නෙමෙයි, ඉත්තන්ගේ වටිනාකමත් වැදගත්."} }
      ] },
      { id: "l2-combinations", title: {en:"Two and three move combinations",si:"ඇදීම් දෙක තුනක සංයෝජන"}, steps: [
        { pos: fp("3r2k1/pp3npp/4Q3/6q1/4Rp2/2P5/PP3PP1/6K1"), text: {en:"A combination is a forcing series of moves that wins something. Often it starts with a sacrifice.",si:"සංයෝජනයක් (combination) කියන්නේ යමක් දිනාගන්න බලකරන ඇදීම් මාලාවක්. බොහෝ වෙලාවට පටන් ගන්නේ පූජාවකින්."} },
        { text: {en:"Calculate one move at a time: your move, the opponent’s best reply, your next move. If it ends well, play it.",si:"එක ඇදීමක් එක ඇදීමක් ගණනය කරන්න: ඔයාගේ ඇදීම, සතුරාගේ හොඳම පිළිතුර, ඔයාගේ ඊළඟ ඇදීම. හොඳින් අවසන් වෙනවා නම් ඒක ඇදෙන්න."} },
        { pos: fp("3r2k1/pp3npp/4Q3/6q1/4Rp2/2P5/PP3PP1/6K1"), move: ["e6","e8"], text: {en:"Qe1+. The first move gives something up to start the combination.",si:"Qe1+. පළවෙනි ඇදීමෙන් සංයෝජනය පටන් ගන්න යමක් අත්හරිනවා."} },
        { move: ["d8","e8"], caps: ["e8"], text: {en:"Black replies Rxe1.",si:"කළු Rxe1 ලෙස පිළිතුරු දෙනවා."} },
        { move: ["e4","e8"], caps: ["e8"], text: {en:"Rxe1#. Checkmate.",si:"Rxe1#. චෙක්මේට්."} },
        { text: {en:"See the end of the line before you play the first move. If you cannot, do not start.",si:"පළවෙනි ඇදීම ඇදෙන්න කලින් මාලාවේ අවසානය බලන්න. බැරි නම් පටන් ගන්න එපා."} }
      ] },
    ],
  };
  const P = {
    "l2-candidates": [
      { type: "move", pos: fp("rr4k1/3bqpp1/7p/pP1np3/P1pP4/4P3/2Q2PPP/1BR2RK1"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"List your checks first. Does one of them lead to mate?",si:"මුලින් ඔයාගේ චෙක් ලැයිස්තුගත කරන්න. ඒවායින් එකක් මේට් එකකට යනවද?"}, ans: [["c2","h7"]] },
      { type: "move", pos: fp("r1b3k1/pp3ppp/7q/3pN3/3Pn3/4P2P/P1Q1BrP1/2R1R1K1"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"List your checks first. Does one of them lead to mate?",si:"මුලින් ඔයාගේ චෙක් ලැයිස්තුගත කරන්න. ඒවායින් එකක් මේට් එකකට යනවද?"}, ans: [["c2","c8"]] },
      { type: "move", pos: fp("4Q3/p3p1r1/2p3Pk/2P2p2/1P2pq2/P6P/6R1/7K"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"List your checks first. Does one of them lead to mate?",si:"මුලින් ඔයාගේ චෙක් ලැයිස්තුගත කරන්න. ඒවායින් එකක් මේට් එකකට යනවද?"}, ans: [["e8","h8"]] },
      { type: "move", pos: fp("1r4k1/5ppp/8/p1Rn4/2QPp3/4P2P/5PP1/qq3NK1"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"List your checks first. Does one of them lead to mate?",si:"මුලින් ඔයාගේ චෙක් ලැයිස්තුගත කරන්න. ඒවායින් එකක් මේට් එකකට යනවද?"}, ans: [["c5","c8"]] },
      { type: "move", pos: fp("1n4k1/5rpp/4R3/1p1p1p2/3Pp1bP/B3P1P1/P1rN1P2/4K2R"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"List your checks first. Does one of them lead to mate?",si:"මුලින් ඔයාගේ චෙක් ලැයිස්තුගත කරන්න. ඒවායින් එකක් මේට් එකකට යනවද?"}, ans: [["e6","e8"]] },
      { type: "choice", q: {en:"What is a candidate move?",si:"කැන්ඩිඩේට් මූවි එකක් කියන්නේ මොකක්ද?"}, opts: [{en:"A move worth looking at before you decide",si:"තීරණය කරන්න කලින් සලකා බලන්න වටින ඇදීමක්"},{en:"The first move you see",si:"ඔයාට පළවෙනියට පෙනෙන ඇදීම"},{en:"A move that is always a capture",si:"හැමවිටම කැපීමක් වන ඇදීමක්"}], a: 0 }
    ],
    "l2-checks-captures": [
      { type: "move", pos: fp("4R3/r1q3pp/2pN1kr1/2Pp4/p2PpnQ1/4P1P1/P5K1/5R2"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Is any enemy piece attacked and not defended?",si:"ප්‍රහාර කරලා ආරක්ෂාවක් නැති සතුරු ඉත්තෙක් ඉන්නවද?"}, ans: [["f1","f4"],["g4","f4"]] },
      { type: "move", pos: fp("R3b1k1/1Br2p1p/1p4p1/8/3B4/7P/r4PP1/6K1"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Is any enemy piece attacked and not defended?",si:"ප්‍රහාර කරලා ආරක්ෂාවක් නැති සතුරු ඉත්තෙක් ඉන්නවද?"}, ans: [["a8","e8"]] },
      { type: "move", pos: fp("6rk/1p3rbq/p7/2P1ppN1/3p1n2/P6P/1P1R1PP1/R5K1"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Is any enemy piece attacked and not defended?",si:"ප්‍රහාර කරලා ආරක්ෂාවක් නැති සතුරු ඉත්තෙක් ඉන්නවද?"}, ans: [["g5","f7"]] },
      { type: "move", pos: fp("5r1k/7r/pb5Q/8/3P4/P1q5/6PP/R6K"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Is any enemy piece attacked and not defended?",si:"ප්‍රහාර කරලා ආරක්ෂාවක් නැති සතුරු ඉත්තෙක් ඉන්නවද?"}, ans: [["h6","f8"]] },
      { type: "move", pos: fp("r1b2rk1/ppp3p1/7p/2bqn3/8/P1NP2P1/1P2P2P/R1BQ1R1K"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Is any enemy piece attacked and not defended?",si:"ප්‍රහාර කරලා ආරක්ෂාවක් නැති සතුරු ඉත්තෙක් ඉන්නවද?"}, ans: [["c3","d5"]] },
      { type: "choice", q: {en:"In which order do you scan the board?",si:"බෝඩ් එක පරීක්ෂා කරන්නේ කුමන පිළිවෙලටද?"}, opts: [{en:"Pawn moves, quiet moves, king moves",si:"පෝන් ඇදීම්, නිශ්ශබ්ද ඇදීම්, රජු ඇදීම්"},{en:"Checks, captures, threats",si:"චෙක්, කැපීම්, තර්ජන"},{en:"Threats, quiet moves, checks",si:"තර්ජන, නිශ්ශබ්ද ඇදීම්, චෙක්"}], a: 1 }
    ],
    "l2-exchanges": [
      { type: "choice", pos: fp("4k3/p7/3p4/4p3/8/5N2/P7/4K3"), mv: ["f3", "e5"], legal: true, q: {en:"White plays Nxe5. Does White win material?",si:"සුදු Nxe5 ඇදුවා. සුදු ද්‍රව්‍ය දිනනවද?"}, opts: [{en:"Yes",si:"ඔව්"},{en:"No",si:"නැහැ"}], a: 1 },
      { type: "choice", pos: fp("4k3/p7/8/4p3/8/5N2/P7/4K3"), mv: ["f3", "e5"], legal: true, q: {en:"White plays Nxe5. Does White win material?",si:"සුදු Nxe5 ඇදුවා. සුදු ද්‍රව්‍ය දිනනවද?"}, opts: [{en:"Yes",si:"ඔව්"},{en:"No",si:"නැහැ"}], a: 0 },
      { type: "choice", pos: fp("4k3/p7/3p4/4p3/3P4/5N2/P7/4K3"), mv: ["d4", "e5"], legal: true, q: {en:"White plays dxe5. Does White win material?",si:"සුදු dxe5 ඇදුවා. සුදු ද්‍රව්‍ය දිනනවද?"}, opts: [{en:"Yes",si:"ඔව්"},{en:"No",si:"නැහැ"}], a: 0 },
      { type: "choice", pos: fp("4k3/p7/3p4/4p3/8/2B2N2/P7/4K3"), mv: ["f3", "e5"], legal: true, q: {en:"White plays Nxe5. Two white pieces attack e5, one black pawn defends it. Does White win material?",si:"සුදු Nxe5 ඇදුවා. සුදු ඉත්තන් දෙකක් e5 ට ප්‍රහාර කරනවා, කළු පෝන් එකක් ආරක්ෂා කරනවා. සුදු ද්‍රව්‍ය දිනනවද?"}, opts: [{en:"Yes",si:"ඔව්"},{en:"No",si:"නැහැ"}], a: 1 },
      { type: "choice", pos: fp("4k3/3r4/8/3p4/8/2N5/3R4/3RK3"), mv: ["c3", "d5"], legal: true, q: {en:"White plays Nxd5. Does White win material?",si:"සුදු Nxd5 ඇදුවා. සුදු ද්‍රව්‍ය දිනනවද?"}, opts: [{en:"Yes",si:"ඔව්"},{en:"No",si:"නැහැ"}], a: 0 },
      { type: "choice", pos: fp("4k3/p7/4p3/3p4/8/8/P7/3RK3"), mv: ["d1", "d5"], legal: true, q: {en:"White plays Rxd5. Does White win material?",si:"සුදු Rxd5 ඇදුවා. සුදු ද්‍රව්‍ය දිනනවද?"}, opts: [{en:"Yes",si:"ඔව්"},{en:"No",si:"නැහැ"}], a: 1 }
    ],
    "l2-combinations": [
      { type: "move", pos: fp("r6k/ppp2Qpp/1n6/2B3q1/3P2r1/3BP3/P2P1RbP/R5K1"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look at the whole line: what do you give, and what do you win back?",si:"මුළු ඇදීම් මාලාවම බලන්න: ඔයා දෙන්නේ මොනවද, ආපහු දිනාගන්නේ මොනවද?"}, ans: [["f7","f8"]] },
      { type: "move", pos: fp("r6k/pp3Qpp/1q6/4r3/4p3/8/PPP3PP/3R1R1K"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look at the whole line: what do you give, and what do you win back?",si:"මුළු ඇදීම් මාලාවම බලන්න: ඔයා දෙන්නේ මොනවද, ආපහු දිනාගන්නේ මොනවද?"}, ans: [["f7","f8"]] },
      { type: "move", pos: fp("4br1k/ppq4p/n4p2/8/1P1B4/PB3PR1/2P3PP/6K1"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look at the whole line: what do you give, and what do you win back?",si:"මුළු ඇදීම් මාලාවම බලන්න: ඔයා දෙන්නේ මොනවද, ආපහු දිනාගන්නේ මොනවද?"}, ans: [["d4","f6"]] },
      { type: "move", pos: fp("r4rk1/pp3pbp/2n5/3q4/3PNpP1/2P5/PPQ2P2/R3K2R"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look at the whole line: what do you give, and what do you win back?",si:"මුළු ඇදීම් මාලාවම බලන්න: ඔයා දෙන්නේ මොනවද, ආපහු දිනාගන්නේ මොනවද?"}, ans: [["e4","f6"]] },
      { type: "move", pos: fp("r1bq1rk1/2p1bpp1/p3p2p/1p2P3/3PN3/3Q1N2/PnB2PPP/R4RK1"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look at the whole line: what do you give, and what do you win back?",si:"මුළු ඇදීම් මාලාවම බලන්න: ඔයා දෙන්නේ මොනවද, ආපහු දිනාගන්නේ මොනවද?"}, ans: [["e4","f6"]] },
      { type: "choice", q: {en:"What is a combination?",si:"සංයෝජනයක් කියන්නේ මොකක්ද?"}, opts: [{en:"Moving the same piece twice",si:"එකම ඉත්තා දෙපාරක් ඇදීම"},{en:"Trading all the pieces",si:"සියලු ඉත්තන් හුවමාරු කිරීම"},{en:"A forcing series of moves that wins something",si:"යමක් දිනාගන්න බලකරන ඇදීම් මාලාවක්"}], a: 2 }
    ]
  };
  window.PQ_PRACTICE = Object.assign(window.PQ_PRACTICE || {}, P);
  window.PQ_MODULES = (window.PQ_MODULES || []).concat([window.PQ_MODULE_9]);
})();
