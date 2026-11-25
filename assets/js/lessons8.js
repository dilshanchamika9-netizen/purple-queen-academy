/* Purple Queen Chess Academy — Level 2 · Module 1: Tactical motifs
   Practice positions come from the Lichess puzzle database (CC0, database.lichess.org), shown with White to move
   (positions where Black was to move are mirrored). Worked examples use the same puzzles.
   Step captions for the worked example are generic; Sinhala text needs coach review. */
(function () {
  const T = (en, si) => ({ en, si });
  const fp = window.PQ_FP;
  window.PQ_MODULE_8 = {
    level: T("Level 2 · Knight", "මට්ටම 2 · නයිට්"),
    title: T("Tactical motifs", "උපක්‍රම මූලධර්ම"),
    lessons: [
      { id: "l2-discovered", title: {en:"Discovered attack",si:"ඩිස්කවර්ඩ් ඇටැක් (විවෘත ප්‍රහාරය)"}, steps: [
        { pos: fp("8/2rnkpbp/p5p1/3p4/2bP4/2N1PP2/5KPP/1RR5"), text: {en:"A discovered attack happens when one piece moves out of the way and uncovers an attack from the piece standing behind it.",si:"ඩිස්කවර්ඩ් ඇටැක් (discovered attack) එකක් කියන්නේ එක ඉත්තෙක් අතු වෙලා යනකොට, ඒක පිටිපස්සේ හිටපු ඉත්තාගේ ප්‍රහාරය විවෘත වීම."} },
        { text: {en:"The piece that moves can make its own threat or give check. Then the opponent faces two threats at once.",si:"ඇදෙන ඉත්තාට තමන්ගේම තර්ජනයක් හෝ චෙක් එකක් දෙන්න පුළුවන්. එතකොට සතුරාට එකවර තර්ජන දෙකකට මුහුණ දෙන්න වෙනවා."} },
        { pos: fp("8/2rnkpbp/p5p1/3p4/2bP4/2N1PP2/5KPP/1RR5"), move: ["c3","d5"], caps: ["d5"], text: {en:"Nxd5+. The piece moves away and uncovers an attack from the piece behind it.",si:"Nxd5+. ඉත්තා අතු වෙලා ඒක පිටිපස්සේ ඉන්න ඉත්තාගේ ප්‍රහාරය විවෘත කරනවා."} },
        { move: ["c4","d5"], caps: ["d5"], text: {en:"Black replies Bxd5.",si:"කළු Bxd5 ලෙස පිළිතුරු දෙනවා."} },
        { move: ["c1","c7"], caps: ["c7"], text: {en:"Rxc7. White follows up and wins the advantage.",si:"Rxc7. සුදු ඉදිරියට ගිහින් වාසිය දිනාගන්නවා."} },
        { text: {en:"Before each move ask: which of my pieces stands in front of another of mine? Moving it can create a double threat.",si:"හැම ඇදීමකටම කලින් අහන්න: මගේ කුමන ඉත්තා මගේම තවත් ඉත්තෙකුගේ ඉදිරියෙන් ඉන්නවද? ඒක ඇදුවොත් ද්විත්ව තර්ජනයක් හදන්න පුළුවන්."} }
      ] },
      { id: "l2-double-check", title: {en:"Double check",si:"ඩබල් චෙක්"}, steps: [
        { pos: fp("r1b1kb1r/ppp2ppp/5q2/3p4/3P4/2P2N1P/PP1NB1P1/R3Q1K1"), text: {en:"A double check is check from two pieces at the same time. One move gives check and uncovers a second check.",si:"ඩබල් චෙක් (double check) එකක් කියන්නේ ඉත්තන් දෙකකින් එකවර දෙන චෙක් එකක්. එක ඇදීමකින් චෙක් එකක් දීලා දෙවැනි චෙක් එකත් විවෘත කරනවා."} },
        { text: {en:"You cannot capture or block two checking pieces in one move. The king must move. That is why a double check is so strong.",si:"ඉත්තන් දෙකක චෙක් එක එක ඇදීමකින් කපන්නවත් අවහිර කරන්නවත් බෑ. රජුට ඇදෙන්නම වෙනවා. ඒකයි ඩබල් චෙක් එක මේ තරම් ශක්තිමත්."} },
        { pos: fp("r1b1kb1r/ppp2ppp/5q2/3p4/3P4/2P2N1P/PP1NB1P1/R3Q1K1"), move: ["e2","b5"], text: {en:"Bb5+. This move gives check with two pieces at once.",si:"Bb5+. මේ ඇදීමෙන් ඉත්තන් දෙකකින් එකවර චෙක් දෙනවා."} },
        { move: ["e8","d8"], text: {en:"Black replies Kd8.",si:"කළු Kd8 ලෙස පිළිතුරු දෙනවා."} },
        { move: ["e1","e8"], text: {en:"Qe8#. Checkmate.",si:"Qe8#. චෙක්මේට්."} },
        { text: {en:"When the enemy king is exposed, look for a double check. The king must move, and often it walks into mate.",si:"සතුරු රජු නිරාවරණයි නම් ඩබල් චෙක් එකක් හොයන්න. රජුට ඇදෙන්න වෙනවා, බොහෝ වෙලාවට මේට් වෙනවා."} }
      ] },
      { id: "l2-deflection", title: {en:"Deflection",si:"ඩිෆ්ලෙක්ෂන් (ඉවතට ඇද දැමීම)"}, steps: [
        { pos: fp("2rr1k2/pb4pQ/1p1qp1Bp/3np3/8/P7/1P3PPP/3RR1K1"), text: {en:"Deflection means forcing a defending piece away from the square or the job it is guarding.",si:"ඩිෆ්ලෙක්ෂන් (deflection) කියන්නේ ආරක්ෂා කරන ඉත්තෙක් එයා ආරක්ෂා කරන කොටුවෙන් හෝ වැඩෙන් බලෙන් ඈත් කිරීම."} },
        { text: {en:"You attack the defender, often with a capture or a check. It must react, and what it guarded is left alone.",si:"ආරක්ෂකයාට ප්‍රහාර කරනවා, බොහෝ වෙලාවට කැපීමකින් හෝ චෙක් එකකින්. එයාට ප්‍රතිචාර දක්වන්න වෙනවා, ඒ ආරක්ෂා කළ දේ තනි වෙනවා."} },
        { pos: fp("2rr1k2/pb4pQ/1p1qp1Bp/3np3/8/P7/1P3PPP/3RR1K1"), move: ["h7","h8"], text: {en:"Qh8+. This move pulls the defender away from its job.",si:"Qh8+. මේ ඇදීමෙන් ආරක්ෂකයා එයාගේ වැඩෙන් ඈත් කරනවා."} },
        { move: ["f8","e7"], text: {en:"Black replies Ke7.",si:"කළු Ke7 ලෙස පිළිතුරු දෙනවා."} },
        { move: ["h8","g7"], caps: ["g7"], text: {en:"Qxg7#. Checkmate.",si:"Qxg7#. චෙක්මේට්."} },
        { text: {en:"Ask: what is guarding the target, and can I drag it away?",si:"අහන්න: ඉලක්කය ආරක්ෂා කරන්නේ මොකද්ද, ඒක ඈතට ඇද දාන්න පුළුවන්ද?"} }
      ] },
      { id: "l2-decoy", title: {en:"Decoy",si:"ඩිකෝයි (ඇද ගැනීම)"}, steps: [
        { pos: fp("2b1Rrk1/1p1p1ppp/3N4/8/5n2/3r4/5PPP/4R1K1"), text: {en:"A decoy lures an enemy piece, often the king or the queen, onto a square where it can be attacked.",si:"ඩිකෝයි (decoy) එකක් කියන්නේ සතුරු ඉත්තෙක්, බොහෝ වෙලාවට රජු හෝ රැජින, ප්‍රහාර කරන්න පුළුවන් කොටුවකට ඇද ගැනීම."} },
        { text: {en:"Often you sacrifice a piece. The enemy takes it, and the capturing piece lands on a bad square.",si:"බොහෝ වෙලාවට ඉත්තෙක් පූජා කරනවා. සතුරා ඒක කපනවා, ඒත් කපපු ඉත්තා වැරදි කොටුවකට වැටෙනවා."} },
        { pos: fp("2b1Rrk1/1p1p1ppp/3N4/8/5n2/3r4/5PPP/4R1K1"), move: ["e8","f8"], caps: ["f8"], text: {en:"Rxf8+. A sacrifice that drags the enemy piece onto a square where it is vulnerable.",si:"Rxf8+. සතුරු ඉත්තා අනාරක්ෂිත කොටුවකට ඇද ගන්න පූජාවක්."} },
        { move: ["g8","f8"], caps: ["f8"], text: {en:"Black replies Kxf8.",si:"කළු Kxf8 ලෙස පිළිතුරු දෙනවා."} },
        { move: ["e1","e8"], text: {en:"Re8#. Checkmate.",si:"Re8#. චෙක්මේට්."} },
        { text: {en:"Ask: where would I love the enemy king or queen to stand? Then look for a way to force it there.",si:"අහන්න: සතුරු රජු හෝ රැජින ඉන්න ඕන කොහෙද? ඊට පස්සේ එතනට බල කරන විදිය හොයන්න."} }
      ] },
      { id: "l2-remove-defender", title: {en:"Removing the defender",si:"ආරක්ෂකයා ඉවත් කිරීම"}, steps: [
        { pos: fp("5rk1/pp3nbp/4b1p1/8/3rp3/6BP/PP3PPN/3RRBK1"), text: {en:"If a piece is protected, capture the piece that protects it. Then the first piece is left without protection.",si:"ඉත්තෙක් ආරක්ෂා වෙලා නම්, ඒක ආරක්ෂා කරන ඉත්තා කපන්න. එතකොට පළවෙනි ඉත්තාට ආරක්ෂාවක් නැති වෙනවා."} },
        { text: {en:"Count the defenders. If you can remove one, the target falls.",si:"ආරක්ෂකයන් ගණන් කරන්න. එකක් ඉවත් කරන්න පුළුවන් නම් ඉලක්කය වැටෙනවා."} },
        { pos: fp("5rk1/pp3nbp/4b1p1/8/3rp3/6BP/PP3PPN/3RRBK1"), move: ["d1","d4"], caps: ["d4"], text: {en:"Rxd4. This capture removes a defender.",si:"Rxd4. මේ කැපීමෙන් ආරක්ෂකයෙක් ඉවත් වෙනවා."} },
        { move: ["g7","d4"], caps: ["d4"], text: {en:"Black replies Bxd4.",si:"කළු Bxd4 ලෙස පිළිතුරු දෙනවා."} },
        { move: ["e1","e4"], caps: ["e4"], text: {en:"Rxe4. White follows up and wins the advantage.",si:"Rxe4. සුදු ඉදිරියට ගිහින් වාසිය දිනාගන්නවා."} },
        { text: {en:"Do not attack a protected piece head on. Take its defender first.",si:"ආරක්ෂා වුණ ඉත්තෙකුට කෙළින්ම ප්‍රහාර කරන්න එපා. මුලින් එහි ආරක්ෂකයා කපන්න."} }
      ] },
    ],
  };
  const P = {
    "l2-discovered": [
      { type: "move", pos: fp("3k3r/p7/5n1p/1pp5/4b3/2Pn2P1/P2N1PP1/3R1K1R"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look for one of your pieces that is blocking your own rook, bishop or queen.",si:"ඔයාගේම රුක්, බිෂොප් හෝ රැජින අවහිර කරගෙන ඉන්න ඉත්තෙක් හොයන්න."}, ans: [["d2","e4"]] },
      { type: "move", pos: fp("rn2r1k1/pp3ppp/1q1p1b2/3P4/4NP2/8/PPP1Q2P/R1B1K2R"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look for one of your pieces that is blocking your own rook, bishop or queen.",si:"ඔයාගේම රුක්, බිෂොප් හෝ රැජින අවහිර කරගෙන ඉන්න ඉත්තෙක් හොයන්න."}, ans: [["e4","f6"]] },
      { type: "move", pos: fp("8/5pp1/pk2p2p/4Pn2/KP6/4P3/5BPP/8"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look for one of your pieces that is blocking your own rook, bishop or queen.",si:"ඔයාගේම රුක්, බිෂොප් හෝ රැජින අවහිර කරගෙන ඉන්න ඉත්තෙක් හොයන්න."}, ans: [["e3","e4"]] },
      { type: "move", pos: fp("3r2k1/5p1p/6p1/8/1p3q2/1P1pR2P/P2Q2P1/7K"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look for one of your pieces that is blocking your own rook, bishop or queen.",si:"ඔයාගේම රුක්, බිෂොප් හෝ රැජින අවහිර කරගෙන ඉන්න ඉත්තෙක් හොයන්න."}, ans: [["e3","e8"]] },
      { type: "move", pos: fp("r4rk1/pp3pbp/2n5/3q4/3PNpP1/2P5/PPQ2P2/R3K2R"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look for one of your pieces that is blocking your own rook, bishop or queen.",si:"ඔයාගේම රුක්, බිෂොප් හෝ රැජින අවහිර කරගෙන ඉන්න ඉත්තෙක් හොයන්න."}, ans: [["e4","f6"]] },
      { type: "choice", q: {en:"What is a discovered attack?",si:"ඩිස්කවර්ඩ් ඇටැක් එකක් කියන්නේ මොකක්ද?"}, opts: [{en:"A piece moves away and uncovers an attack from another piece",si:"එක ඉත්තෙක් අතු වෙලා තවත් ඉත්තෙකුගේ ප්‍රහාරය විවෘත කිරීම"},{en:"A pawn reaches the last rank",si:"පෝන් එකක් අවසන් පේළියට යාම"},{en:"The king moves two squares",si:"රජු කොටු දෙකක් ඇදීම"}], a: 0 }
    ],
    "l2-double-check": [
      { type: "move", pos: fp("8/4r1k1/8/p4Pp1/2p3P1/2rp2K1/3R1R2/8"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look for a move that gives check and also uncovers a second check.",si:"චෙක් එකක් දීලා දෙවැනි චෙක් එකත් විවෘත කරන ඇදීමක් හොයන්න."}, ans: [["f5","f6"]] },
      { type: "move", pos: fp("4RN1k/p4qp1/p2p3p/7P/5pb1/P7/1PP3PK/8"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look for a move that gives check and also uncovers a second check.",si:"චෙක් එකක් දීලා දෙවැනි චෙක් එකත් විවෘත කරන ඇදීමක් හොයන්න."}, ans: [["f8","g6"]] },
      { type: "move", pos: fp("3qr3/p4kp1/3b2np/2p5/3p4/2PP1BP1/Pr2P2B/RN3R1K"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look for a move that gives check and also uncovers a second check.",si:"චෙක් එකක් දීලා දෙවැනි චෙක් එකත් විවෘත කරන ඇදීමක් හොයන්න."}, ans: [["f3","d5"]] },
      { type: "move", pos: fp("r2q4/pb1p3p/k1n5/1r6/Pp6/2N1B3/1PP3PP/R3K2R"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look for a move that gives check and also uncovers a second check.",si:"චෙක් එකක් දීලා දෙවැනි චෙක් එකත් විවෘත කරන ඇදීමක් හොයන්න."}, ans: [["a4","b5"]] },
      { type: "move", pos: fp("8/3n2k1/6p1/2q3Pp/n1pNP1b1/6P1/2P3BK/Q7"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look for a move that gives check and also uncovers a second check.",si:"චෙක් එකක් දීලා දෙවැනි චෙක් එකත් විවෘත කරන ඇදීමක් හොයන්න."}, ans: [["d4","e6"]] },
      { type: "choice", q: {en:"How can you answer a double check?",si:"ඩබල් චෙක් එකකට පිළිතුරු දෙන්නේ කොහොමද?"}, opts: [{en:"By capturing one of the checking pieces",si:"චෙක් දෙන ඉත්තන්ගෙන් එකක් කැපීමෙන්"},{en:"Only by moving the king",si:"රජු ඇදීමෙන් පමණයි"},{en:"By blocking with a pawn",si:"පෝන් එකකින් අවහිර කිරීමෙන්"}], a: 1 }
    ],
    "l2-deflection": [
      { type: "move", pos: fp("4rk1r/pp3ppp/2p5/3nN3/8/2P5/PP2RPPP/R5K1"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Find the piece that guards something important. Can you force it to move?",si:"වැදගත් දෙයක් ආරක්ෂා කරන ඉත්තා හොයන්න. එයාව ඇදෙන්න බල කරන්න පුළුවන්ද?"}, ans: [["e5","d7"]] },
      { type: "move", pos: fp("rn4nQ/pbp2kq1/1p1pp1p1/6B1/2BP4/2P5/P1P2P1P/R3K3"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Find the piece that guards something important. Can you force it to move?",si:"වැදගත් දෙයක් ආරක්ෂා කරන ඉත්තා හොයන්න. එයාව ඇදෙන්න බල කරන්න පුළුවන්ද?"}, ans: [["c4","e6"]] },
      { type: "move", pos: fp("6b1/1Q1R2bk/6p1/q3pp1p/2Pp4/3P4/5PPP/r4NK1"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Find the piece that guards something important. Can you force it to move?",si:"වැදගත් දෙයක් ආරක්ෂා කරන ඉත්තා හොයන්න. එයාව ඇදෙන්න බල කරන්න පුළුවන්ද?"}, ans: [["d7","g7"]] },
      { type: "move", pos: fp("6k1/pp4p1/4p2p/2n5/2P3B1/3r1Q1P/q4PP1/5RK1"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Find the piece that guards something important. Can you force it to move?",si:"වැදගත් දෙයක් ආරක්ෂා කරන ඉත්තා හොයන්න. එයාව ඇදෙන්න බල කරන්න පුළුවන්ද?"}, ans: [["g4","e6"]] },
      { type: "move", pos: fp("r1bqrbk1/pp3pp1/2n1p2p/3pN2n/5B2/2PBP2P/PPQN1PP1/R3K2R"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Find the piece that guards something important. Can you force it to move?",si:"වැදගත් දෙයක් ආරක්ෂා කරන ඉත්තා හොයන්න. එයාව ඇදෙන්න බල කරන්න පුළුවන්ද?"}, ans: [["d3","h7"]] },
      { type: "choice", q: {en:"What is deflection?",si:"ඩිෆ්ලෙක්ෂන් කියන්නේ මොකක්ද?"}, opts: [{en:"Moving a pawn forward two squares",si:"පෝන් එක කොටු දෙකක් ඉදිරියට ඇදීම"},{en:"Trading queens",si:"රැජින හුවමාරු කිරීම"},{en:"Forcing a defender away from the job it is doing",si:"ආරක්ෂකයෙක් එයාගේ වැඩෙන් ඈත් කිරීම"}], a: 2 }
    ],
    "l2-decoy": [
      { type: "move", pos: fp("2r5/4R1pp/p4nkn/1pB3q1/3P4/P4PQ1/P5PP/K7"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which enemy piece would you like to see on another square? Offer something to pull it there.",si:"සතුරු කුමන ඉත්තා වෙනත් කොටුවක දකින්න ඔයාට ඕනද? එතනට ඇද ගන්න යමක් පූජා කරන්න."}, ans: [["e7","g7"]] },
      { type: "move", pos: fp("2r2r1k/1pp1nBpp/p7/3R1Q2/8/1P2P3/q4PPP/5RK1"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which enemy piece would you like to see on another square? Offer something to pull it there.",si:"සතුරු කුමන ඉත්තා වෙනත් කොටුවක දකින්න ඔයාට ඕනද? එතනට ඇද ගන්න යමක් පූජා කරන්න."}, ans: [["f5","h7"]] },
      { type: "move", pos: fp("r1b2r1k/2p1q1pn/1p1pB3/3Pp3/1PP1Pp2/7R/5PPP/3Q1RK1"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which enemy piece would you like to see on another square? Offer something to pull it there.",si:"සතුරු කුමන ඉත්තා වෙනත් කොටුවක දකින්න ඔයාට ඕනද? එතනට ඇද ගන්න යමක් පූජා කරන්න."}, ans: [["h3","h7"]] },
      { type: "move", pos: fp("2kr4/1p3pp1/p1q1p3/n3P3/2P2PP1/1P1R4/1K1bQ3/2B5"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which enemy piece would you like to see on another square? Offer something to pull it there.",si:"සතුරු කුමන ඉත්තා වෙනත් කොටුවක දකින්න ඔයාට ඕනද? එතනට ඇද ගන්න යමක් පූජා කරන්න."}, ans: [["d3","d8"]] },
      { type: "move", pos: fp("5rk1/1q3ppp/p2Q4/8/Pp3P2/5PK1/1r5P/3RR3"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which enemy piece would you like to see on another square? Offer something to pull it there.",si:"සතුරු කුමන ඉත්තා වෙනත් කොටුවක දකින්න ඔයාට ඕනද? එතනට ඇද ගන්න යමක් පූජා කරන්න."}, ans: [["d6","f8"]] },
      { type: "choice", q: {en:"What does a decoy do?",si:"ඩිකෝයි එකක් කරන්නේ මොකක්ද?"}, opts: [{en:"Lures an enemy piece onto a bad square",si:"සතුරු ඉත්තෙක් නරක කොටුවකට ඇද ගැනීම"},{en:"Protects a pawn",si:"පෝන් එකක් ආරක්ෂා කිරීම"},{en:"Opens the centre",si:"මැද විවෘත කිරීම"}], a: 0 }
    ],
    "l2-remove-defender": [
      { type: "move", pos: fp("rn1q1rk1/p1pp1pp1/1p2pn1p/6B1/3Pb3/P1P2N2/2P1QPPP/R3KB1R"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which piece is guarding the target? Can you take that guard?",si:"ඉලක්කය ආරක්ෂා කරන්නේ කුමන ඉත්තාද? ඒ ආරක්ෂකයා කපන්න පුළුවන්ද?"}, ans: [["g5","f6"]] },
      { type: "move", pos: fp("3rr1k1/1ppQqpp1/p6p/4p3/1PP1Pp2/P2R3P/2P2PP1/5RK1"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which piece is guarding the target? Can you take that guard?",si:"ඉලක්කය ආරක්ෂා කරන්නේ කුමන ඉත්තාද? ඒ ආරක්ෂකයා කපන්න පුළුවන්ද?"}, ans: [["d7","e7"]] },
      { type: "move", pos: fp("5rk1/2p2ppp/5rq1/p3p3/1pNnP3/1P2R1P1/PQ3P1P/R4K2"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which piece is guarding the target? Can you take that guard?",si:"ඉලක්කය ආරක්ෂා කරන්නේ කුමන ඉත්තාද? ඒ ආරක්ෂකයා කපන්න පුළුවන්ද?"}, ans: [["c4","e5"]] },
      { type: "move", pos: fp("r3k1nr/pppb2pp/2n5/1B2b3/4R3/8/PPP2PPP/RNBK4"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which piece is guarding the target? Can you take that guard?",si:"ඉලක්කය ආරක්ෂා කරන්නේ කුමන ඉත්තාද? ඒ ආරක්ෂකයා කපන්න පුළුවන්ද?"}, ans: [["b5","c6"]] },
      { type: "move", pos: fp("1r3r1k/4q1pp/1p3n2/p2b1p2/PbN1p3/1P2P3/1B2BPPP/R2Q1RK1"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which piece is guarding the target? Can you take that guard?",si:"ඉලක්කය ආරක්ෂා කරන්නේ කුමන ඉත්තාද? ඒ ආරක්ෂකයා කපන්න පුළුවන්ද?"}, ans: [["b2","f6"]] },
      { type: "choice", q: {en:"What is removing the defender?",si:"ආරක්ෂකයා ඉවත් කිරීම කියන්නේ මොකක්ද?"}, opts: [{en:"Moving the king to safety",si:"රජු ආරක්ෂිත තැනකට ඇදීම"},{en:"Capturing the piece that protects a target",si:"ඉලක්කයක් ආරක්ෂා කරන ඉත්තා කැපීම"},{en:"Promoting a pawn",si:"පෝන් එකක් උසස් කිරීම"}], a: 1 }
    ]
  };
  window.PQ_PRACTICE = Object.assign(window.PQ_PRACTICE || {}, P);
  window.PQ_MODULES = (window.PQ_MODULES || []).concat([window.PQ_MODULE_8]);
})();
