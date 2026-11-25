/* Purple Queen Chess Academy — Level 3 · Module 3: Advanced endgames
   Practice positions come from the Lichess puzzle database (CC0), White to move (Black-to-move positions mirrored). Sinhala text and FIDE wording need coach review (Washini). */
(function () {
  const T = (en, si) => ({ en, si });
  const fp = window.PQ_FP;
  window.PQ_MODULE_17 = {
    level: T("Level 3 · Queen", "මට්ටම 3 · රැජින"),
    title: T("Advanced endgames", "උසස් එන්ඩ් ගේම්"),
    lessons: [
      { id: "l3-rook-endgames", title: {en:"Rook endgames",si:"රුක් එන්ඩ් ගේම්"}, steps: [
        { pos: fp("7R/7p/3k2p1/5p2/5P2/3r2PP/8/6K1"), text: {en:"Rook endgames are the most common endgames. Keep your rook active: attack pawns and the king, do not sit passively in front of a pawn.",si:"රුක් එන්ඩ් ගේම් තමයි වඩාත්ම සුලභ එන්ඩ් ගේම්. ඔයාගේ රුක් ඇක්ටිව් විදියට තියාගන්න: පෝන් වලටත් රජුටත් ප්‍රහාර කරන්න, පෝන් එකක් ඉස්සරහ පැසිව් විදියට ඉන්න එපා."} },
        { text: {en:"Tarrasch rule: put your rook behind a passed pawn, yours or your opponent's. A rook behind its own pawn gets stronger as the pawn advances.",si:"ටරාෂ් රීතිය: ඔයාගේ රුක් එක පාස්ඩ් පෝන් එකක පිටිපස්සේ තියන්න, ඒක ඔයාගේ එකක් වුණත් ප්‍රතිවාදියාගේ එකක් වුණත්. තමන්ගේ පෝන් එකේ පිටිපස්සේ රුක් එක පෝන් එක ඉදිරියට යද්දී ශක්තිමත් වෙනවා."} },
        { pos: fp("7R/7p/3k2p1/5p2/5P2/3r2PP/8/6K1"), move: ["h8","d8"], text: {en:"Rd8+. Checks and captures come first.",si:"Rd8+. චෙක් සහ කැපීම් මුලින්ම."} },
        { move: ["d6","e6"], text: {en:"Black replies Ke6.",si:"කළු Ke6 ලෙස පිළිතුරු දෙනවා."} },
        { move: ["d8","d3"], caps: ["d3"], text: {en:"Rxd3. White follows up and wins the advantage.",si:"Rxd3. සුදු ඉදිරියට ගිහින් වාසිය දිනාගන්නවා."} },
        { text: {en:"Rook endgames: keep the rook active, put it behind passed pawns, and use checks to win material.",si:"රුක් එන්ඩ් ගේම්: රුක් ඇක්ටිව් විදියට තියාගන්න, පාස්ඩ් පෝන් වල පිටිපස්සේ තියන්න, චෙක් පාවිච්චි කරලා ඉත්තන් දිනන්න."} }
      ] },
      { id: "l3-minor-endgames", title: {en:"Bishop and knight endgames",si:"බිෂොප් සහ නයිට් එන්ඩ් ගේම්"}, steps: [
        { pos: fp("8/P7/1K6/1P6/1k2b3/8/8/8"), text: {en:"In bishop endgames, bishops of the same colour fight for the squares. With bishops of opposite colours the game is often a draw, even a pawn or two down.",si:"බිෂොප් එන්ඩ් ගේම් වලදී එකම පාටේ බිෂොප්වරු කොටු වෙනුවෙන් සටන් කරනවා. ප්‍රතිවිරුද්ධ පාටේ බිෂොප් එක්ක ක්‍රීඩාව බොහෝවිට ඩ්‍රෝ, පෝන් එකක් දෙකක් අඩු වුණත්."} },
        { text: {en:"In knight endgames, the king is a strong piece. Bring it to the centre, and attack pawns. Knights are slow, so count the moves.",si:"නයිට් එන්ඩ් ගේම් වලදී රජු ශක්තිමත් ඉත්තෙක්. ඒක කේන්ද්‍රයට ගෙනල්ලා පෝන් වලට ප්‍රහාර කරන්න. නයිට්ස් හෙමින් ඇදෙන නිසා ඇදීම් ගණන් කරන්න."} },
        { pos: fp("8/P7/1K6/1P6/1k2b3/8/8/8"), move: ["b6","a6"], text: {en:"Ka6. Look for the move that wins a pawn or advances the passed pawn.",si:"Ka6. පෝන් එකක් දිනන, නැත්නම් පාස්ඩ් පෝන් එක ඉදිරියට යවන ඇදීම හොයන්න."} },
        { move: ["b4","c5"], text: {en:"Black replies Kc5.",si:"කළු Kc5 ලෙස පිළිතුරු දෙනවා."} },
        { move: ["b5","b6"], text: {en:"b6. White follows up and wins the advantage.",si:"b6. සුදු ඉදිරියට ගිහින් වාසිය දිනාගන්නවා."} },
        { text: {en:"Minor-piece endgames: activate the king, keep pawns on the opposite colour to your bishop, and watch for opposite-coloured bishops.",si:"බිෂොප්/නයිට් එන්ඩ් ගේම්: රජු ඇක්ටිව් කරන්න, පෝන් බිෂොප් එකේ පාටට ප්‍රතිවිරුද්ධ පාටේ තියන්න, ප්‍රතිවිරුද්ධ පාටේ බිෂොප් ගැන සැලකිලිමත් වෙන්න."} }
      ] },
      { id: "l3-queen-endgames", title: {en:"Queen endgames",si:"රැජින එන්ඩ් ගේම්"}, steps: [
        { pos: fp("7Q/5p2/4p1k1/K4p2/5P2/8/6qp/8"), text: {en:"Queen endgames are full of checks. A king with no pawn cover can often be forced to give up material by a series of checks.",si:"රැජින එන්ඩ් ගේම් චෙක් වලින් පිරිලා. පෝන් ආවරණයක් නැති රජුට චෙක් පෙළකින් ඉත්තන් අහිමි කරන්න බල කරන්න පුළුවන්."} },
        { text: {en:"A queen check that forks the king and the enemy queen wins the queen. If you are worse, look for perpetual check to save the draw.",si:"රජුටත් සතුරු රැජිනටත් එකවර ප්‍රහාර කරන රැජින චෙක් එකකින් රැජින දිනන්න පුළුවන්. ඔයා නරක තත්වයක නම් ඩ්‍රෝ එක බේරාගන්න නිරන්තර චෙක් (perpetual check) හොයන්න."} },
        { pos: fp("7Q/5p2/4p1k1/K4p2/5P2/8/6qp/8"), move: ["h8","g8"], text: {en:"Qg8+. The queen check wins material.",si:"Qg8+. රැජින චෙක් එකෙන් ඉත්තන් දිනනවා."} },
        { move: ["g6","h5"], text: {en:"Black replies Kh5.",si:"කළු Kh5 ලෙස පිළිතුරු දෙනවා."} },
        { move: ["g8","g2"], caps: ["g2"], text: {en:"Qxg2. White follows up and wins the advantage.",si:"Qxg2. සුදු ඉදිරියට ගිහින් වාසිය දිනාගන්නවා."} },
        { text: {en:"Queen endgames: check the king first, look for forks, and remember perpetual check as a defence.",si:"රැජින එන්ඩ් ගේම්: මුලින් රජුට චෙක් දෙන්න, ෆෝක් හොයන්න, ආරක්ෂාවක් ලෙස නිරන්තර චෙක් මතක තියාගන්න."} }
      ] },
      { id: "l3-fortress-zugzwang", title: {en:"Fortress and zugzwang",si:"ෆෝට්‍රස් සහ සුග්ස්වෑන්ග්"}, steps: [
        { pos: fp("8/K7/8/1p1k4/1P6/8/8/8"), text: {en:"Zugzwang means every move makes your position worse, but you must move. In pawn endings the king often wins by making the opponent run out of safe moves.",si:"සුග්ස්වෑන්ග් (zugzwang) කියන්නේ හැම ඇදීමක්ම ඔයාගේ පොසිෂන් එක නරක කරනවා, නමුත් ඔයාට ඇදෙන්නම ඕනේ කියන තත්වයයි. පෝන් එන්ඩ් ගේම් වලදී රජුට බොහෝවිට දිනන්න පුළුවන් ප්‍රතිවාදියාට ආරක්ෂිත ඇදීම් ඉවර වෙන්න සලස්සලා."} },
        { text: {en:"A fortress is the opposite idea: the weaker side builds a position the stronger side cannot break, and so holds the draw despite being behind.",si:"ෆෝට්‍රස් (fortress) එක ඊට විරුද්ධ අදහසයි: දුර්වල පැත්ත ශක්තිමත් පැත්තට බිඳින්න බැරි පොසිෂන් එකක් හදලා, පිටුපසින් හිටියත් ඩ්‍රෝ එක රඳවාගන්නවා."} },
        { pos: fp("8/K7/8/1p1k4/1P6/8/8/8"), move: ["a7","b6"], text: {en:"Kb6. Notice how the king move leaves the opponent without a safe reply.",si:"Kb6. රජුගේ ඇදීම ප්‍රතිවාදියාට ආරක්ෂිත පිළිතුරක් නැති කරන හැටි බලන්න."} },
        { move: ["d5","c4"], text: {en:"Black replies Kc4.",si:"කළු Kc4 ලෙස පිළිතුරු දෙනවා."} },
        { move: ["b6","a5"], text: {en:"Ka5. White follows up and wins the advantage.",si:"Ka5. සුදු ඉදිරියට ගිහින් වාසිය දිනාගන්නවා."} },
        { text: {en:"In pawn endings, count moves, use the opposition, and look for zugzwang. When behind, look for a fortress.",si:"පෝන් එන්ඩ් ගේම් වලදී ඇදීම් ගණන් කරන්න, ප්‍රතිවිරෝධය පාවිච්චි කරන්න, සුග්ස්වෑන්ග් හොයන්න. පිටුපසින් ඉන්නකොට ෆෝට්‍රස් එකක් හොයන්න."} }
      ] },
    ],
  };
  const P = {
    "l3-rook-endgames": [
      { type: "move", pos: fp("8/8/8/3K4/4rk2/8/8/1R6"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look at checks and captures first. Which one wins material?",si:"මුලින් චෙක් සහ කැපීම් බලන්න. කුමක්ද ඉත්තන් දිනන්නේ?"}, ans: [["b1","f1"]] },
      { type: "move", pos: fp("8/r4k2/8/1p4p1/4p3/1P5R/8/6K1"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look at checks and captures first. Which one wins material?",si:"මුලින් චෙක් සහ කැපීම් බලන්න. කුමක්ද ඉත්තන් දිනන්නේ?"}, ans: [["h3","h7"]] },
      { type: "move", pos: fp("2K5/6r1/5kp1/5p1p/5P2/6P1/R6P/8"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look at checks and captures first. Which one wins material?",si:"මුලින් චෙක් සහ කැපීම් බලන්න. කුමක්ද ඉත්තන් දිනන්නේ?"}, ans: [["a2","a6"]] },
      { type: "move", pos: fp("8/1p4r1/8/p1p1p3/P1Pp2k1/3P1R2/1P3KP1/8"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look at checks and captures first. Which one wins material?",si:"මුලින් චෙක් සහ කැපීම් බලන්න. කුමක්ද ඉත්තන් දිනන්නේ?"}, ans: [["f3","g3"]] },
      { type: "move", pos: fp("8/4r1k1/8/p4Pp1/2p3P1/2rp2K1/3R1R2/8"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look at checks and captures first. Which one wins material?",si:"මුලින් චෙක් සහ කැපීම් බලන්න. කුමක්ද ඉත්තන් දිනන්නේ?"}, ans: [["f5","f6"]] },
      { type: "choice", q: {en:"Where should a rook stand relative to a passed pawn?",si:"පාස්ඩ් පෝන් එකකට සාපේක්ෂව රුක් එක ඉන්න ඕනේ කොතැනද?"}, opts: [{en:"Behind the pawn",si:"පෝන් එකේ පිටිපස්සේ"},{en:"In front of the pawn",si:"පෝන් එකේ ඉදිරියෙන්"},{en:"Far away from the pawn",si:"පෝන් එකෙන් ඈතින්"}], a: 0 }
    ],
    "l3-minor-endgames": [
      { type: "move", pos: fp("B7/8/2bk4/1p1p4/1P1K4/2P5/8/8"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which move wins a pawn or advances a passed pawn?",si:"කුමන ඇදීමෙන්ද පෝන් එකක් දිනන්නේ හෝ පාස්ඩ් පෝන් එක ඉදිරියට යන්නේ?"}, ans: [["a8","c6"]] },
      { type: "move", pos: fp("5b2/p7/1p6/1P1Pp3/3pPpP1/5B2/3K1kP1/8"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which move wins a pawn or advances a passed pawn?",si:"කුමන ඇදීමෙන්ද පෝන් එකක් දිනන්නේ හෝ පාස්ඩ් පෝන් එක ඉදිරියට යන්නේ?"}, ans: [["g4","g5"]] },
      { type: "move", pos: fp("2B5/1P6/5p2/3kb2K/7p/7P/8/8"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which move wins a pawn or advances a passed pawn?",si:"කුමන ඇදීමෙන්ද පෝන් එකක් දිනන්නේ හෝ පාස්ඩ් පෝන් එක ඉදිරියට යන්නේ?"}, ans: [["h5","h4"]] },
      { type: "move", pos: fp("8/1p6/p7/P2p1kpB/1P1Pb3/6K1/6P1/8"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which move wins a pawn or advances a passed pawn?",si:"කුමන ඇදීමෙන්ද පෝන් එකක් දිනන්නේ හෝ පාස්ඩ් පෝන් එක ඉදිරියට යන්නේ?"}, ans: [["h5","g4"]] },
      { type: "move", pos: fp("3b1B2/p4k2/Pp6/1P2p1p1/4P2p/3K1P1P/8/8"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which move wins a pawn or advances a passed pawn?",si:"කුමන ඇදීමෙන්ද පෝන් එකක් දිනන්නේ හෝ පාස්ඩ් පෝන් එක ඉදිරියට යන්නේ?"}, ans: [["f8","d6"]] },
      { type: "choice", q: {en:"Bishops of opposite colours in an endgame often lead to:",si:"ප්‍රතිවිරුද්ධ පාටේ බිෂොප් ඇති එන්ඩ් ගේම් එකක ප්‍රතිඵලය බොහෝවිට:"}, opts: [{en:"A win for the side with the dark-squared bishop",si:"තද පාට බිෂොප් එක තියෙන පැත්තට ජයක්"},{en:"A draw, even when one side has an extra pawn",si:"ඩ්‍රෝ, එක පැත්තකට අමතර පෝන් එකක් තිබුණත්"},{en:"A win for Black",si:"කළුට ජයක්"}], a: 1 }
    ],
    "l3-queen-endgames": [
      { type: "move", pos: fp("8/5pp1/3Q2p1/6k1/2p5/2q3P1/5PKP/8"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look at checks and captures first. Which one wins material or mates?",si:"මුලින් චෙක් සහ කැපීම් බලන්න. කුමක්ද ඉත්තන් දිනන්නේ හෝ මේට් කරන්නේ?"}, ans: [["d6","f4"]] },
      { type: "move", pos: fp("8/K5Q1/8/8/8/5k2/8/7q"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look at checks and captures first. Which one wins material or mates?",si:"මුලින් චෙක් සහ කැපීම් බලන්න. කුමක්ද ඉත්තන් දිනන්නේ හෝ මේට් කරන්නේ?"}, ans: [["g7","b7"]] },
      { type: "move", pos: fp("8/5p1p/3Q4/P5pk/8/7P/2p3PK/1q6"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look at checks and captures first. Which one wins material or mates?",si:"මුලින් චෙක් සහ කැපීම් බලන්න. කුමක්ද ඉත්තන් දිනන්නේ හෝ මේට් කරන්නේ?"}, ans: [["g2","g4"]] },
      { type: "move", pos: fp("8/3Q4/1p5p/p1p2p2/2k2q2/2P4P/P5P1/7K"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look at checks and captures first. Which one wins material or mates?",si:"මුලින් චෙක් සහ කැපීම් බලන්න. කුමක්ද ඉත්තන් දිනන්නේ හෝ මේට් කරන්නේ?"}, ans: [["d7","a4"]] },
      { type: "move", pos: fp("8/1Q3p1k/7p/2p1p1p1/2q5/P3PPK1/6PP/8"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Look at checks and captures first. Which one wins material or mates?",si:"මුලින් චෙක් සහ කැපීම් බලන්න. කුමක්ද ඉත්තන් දිනන්නේ හෝ මේට් කරන්නේ?"}, ans: [["b7","e4"]] },
      { type: "choice", q: {en:"You are worse in a queen endgame. What drawing idea should you look for?",si:"ඔයා රැජින එන්ඩ් ගේම් එකක නරක තත්වයක ඉන්නවා. ඩ්‍රෝ එක බේරාගන්න හොයන්න ඕනේ අදහස මොකක්ද?"}, opts: [{en:"Trade queens at once",si:"එකවරම රැජින් හුවමාරු කරන්න"},{en:"Move the king to the corner",si:"රජු කෙළවරට ගෙනියන්න"},{en:"Perpetual check",si:"නිරන්තර චෙක් (perpetual check)"}], a: 2 }
    ],
    "l3-fortress-zugzwang": [
      { type: "move", pos: fp("8/5k2/5p1p/7P/4K1P1/8/8/8"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which king move takes away the opponent's safe replies?",si:"කුමන රජුගේ ඇදීමෙන්ද ප්‍රතිවාදියාගේ ආරක්ෂිත පිළිතුරු අහෝසි වෙන්නේ?"}, ans: [["e4","f5"]] },
      { type: "move", pos: fp("8/8/2pr4/2Pk1p1p/1K1Pp1p1/4P1P1/5P1P/8"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which king move takes away the opponent's safe replies?",si:"කුමන රජුගේ ඇදීමෙන්ද ප්‍රතිවාදියාගේ ආරක්ෂිත පිළිතුරු අහෝසි වෙන්නේ?"}, ans: [["c5","d6"]] },
      { type: "move", pos: fp("8/6p1/2k5/p1p4p/P1K5/2P4P/6P1/8"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which king move takes away the opponent's safe replies?",si:"කුමන රජුගේ ඇදීමෙන්ද ප්‍රතිවාදියාගේ ආරක්ෂිත පිළිතුරු අහෝසි වෙන්නේ?"}, ans: [["h3","h4"]] },
      { type: "move", pos: fp("8/8/5kp1/2K2p1p/5P2/6P1/6P1/8"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which king move takes away the opponent's safe replies?",si:"කුමන රජුගේ ඇදීමෙන්ද ප්‍රතිවාදියාගේ ආරක්ෂිත පිළිතුරු අහෝසි වෙන්නේ?"}, ans: [["c5","d6"]] },
      { type: "move", pos: fp("8/1p3k2/2p3p1/p1P1KpPP/P1P5/8/8/8"), q: {en:"White to move. Find the best move.",si:"සුදුගේ වාරය. හොඳම ඇදීම සොයන්න."}, hint: {en:"Which king move takes away the opponent's safe replies?",si:"කුමන රජුගේ ඇදීමෙන්ද ප්‍රතිවාදියාගේ ආරක්ෂිත පිළිතුරු අහෝසි වෙන්නේ?"}, ans: [["h5","g6"]] },
      { type: "choice", q: {en:"What is a fortress?",si:"ෆෝට්‍රස් එකක් කියන්නේ මොකක්ද?"}, opts: [{en:"A defensive setup the stronger side cannot break, so the game is drawn",si:"ශක්තිමත් පැත්තට බිඳින්න බැරි ආරක්ෂක සැකැස්මක්, ඒ නිසා ක්‍රීඩාව ඩ්‍රෝ"},{en:"A way to checkmate with two rooks",si:"රුක් දෙකකින් චෙක්මේට් කරන ක්‍රමයක්"},{en:"A rook on the seventh rank",si:"හත්වන පේළියේ රුක් එකක්"}], a: 0 }
    ]
  };
  window.PQ_PRACTICE = Object.assign(window.PQ_PRACTICE || {}, P);
  window.PQ_MODULES = (window.PQ_MODULES || []).concat([window.PQ_MODULE_17]);
})();
