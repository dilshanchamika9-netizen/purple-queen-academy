/* Purple Queen Chess Academy — Level 2 · Module 7: Tactics and rook endgames (overloading, zwischenzug, Lucena, Philidor, rook endgame rules)
   Board positions are built and checked by code (python-chess) and checked with the Stockfish engine. Sinhala text needs coach review (Washini). */
(function () {
  const T = (en, si) => ({ en, si });
  const fp = window.PQ_FP;
  window.PQ_MODULE_22 = {
    level: T("Level 2 · Knight", "මට්ටම 2 · නයිට්"),
    title: T("Tactics and rook endgames", "උපක්‍රම සහ රුක් අවසන් ක්‍රීඩා"),
    lessons: [
      { id: "l2-overloading", title: {en:"Overloading",si:"අධිභාරය (Overloading)"}, steps: [
        { pos: fp("2r3k1/5ppp/2n5/8/8/8/PP1Q1PPP/2R3K1"), text: {en:"A piece is overloaded when it has to guard two things at once. It can only do one job. Attack one of the two and the other one falls.",si:"ඉත්තෙක් අධිභාරයට (overloaded) පත්වෙන්නේ එකවර දේවල් දෙකක් ආරක්ෂා කරන්න වුණාම. ඒකට කරන්න පුළුවන් වැඩක් එකයි. එකක් ප්‍රහාර කළොත් අනිත් එක වැටෙනවා."} },
        { text: {en:"Look at the black rook on c8. It guards the knight on c6. It also guards the back rank: if it leaves c8, the king on g8 has no escape square and a queen check on the 8th rank is mate.",si:"කළු රුක් එක c8 දිහා බලන්න. ඒක c6 වල නයිට් එක ආරක්ෂා කරනවා. ඒකම පසුපස පේළියත් (back rank) ආරක්ෂා කරනවා: ඒක c8 ඉඳන් ඉවත් වුණොත් g8 වල රජුට පැනලා යන්න කොටුවක් නෑ, 8 වන පේළියේ රැජින චෙක් එකක් චෙක්මේට්."} },
        { pos: fp("2r3k1/5ppp/2n5/8/8/8/PP1Q1PPP/2R3K1"), move: ["c1","c6"], caps: ["c6"], text: {en:"Rxc6. White takes the knight. If the rook takes back, it has to leave the back rank.",si:"Rxc6. සුදු නයිට් එක කපනවා. රුක් එක ආපහු කැපුවොත් ඒක පසුපස පේළියෙන් ඉවත් වෙන්න වෙනවා."} },
        { move: ["c8","c6"], caps: ["c6"], text: {en:"Black replies Rxc6. The rook has done one job and left the other.",si:"කළු Rxc6 ලෙස කපනවා. රුක් එක එක වැඩක් කරලා අනිත් වැඩේ අතහැර දැම්මා."} },
        { move: ["d2","d8"], text: {en:"Qd8#. Checkmate. Nothing can block or capture, and the king has no square to go to.",si:"Qd8#. චෙක්මේට්. අවහිර කරන්නවත් කපන්නවත් බෑ, රජුට යන්න කොටුවකුත් නෑ."} },
        { text: {en:"Before you attack, ask: which enemy piece has two jobs? Hit one job and the other collapses. Overloading often hides behind a back-rank weakness.",si:"ප්‍රහාර කරන්න කලින් අහන්න: කුමන සතුරු ඉත්තාට වැඩ දෙකක් තියෙනවද? එක වැඩකට පහර දුන්නොත් අනිත් එක කඩා වැටෙනවා. අධිභාරය බොහෝවිට පසුපස පේළියේ දුර්වලකමක් පිටිපස්සේ සැඟවිලා තියෙනවා."} }
      ] },
      { id: "l2-zwischenzug", title: {en:"Zwischenzug: the in-between move",si:"ස්විෂන්සුග්: අතරමැදි ඇදීම"}, steps: [
        { text: {en:"A zwischenzug is German for \"in-between move\". Instead of making the move your opponent expects, you first play a check or a capture that changes everything.",si:"ස්විෂන්සුග් (zwischenzug) කියන්නේ ජර්මන් බසින් \"අතරමැදි ඇදීම\". සතුරා බලාපොරොත්තු වෙන ඇදීම කරනවා වෙනුවට, ඔයා මුලින් ඔක්කොම වෙනස් කරන චෙක් එකක් හෝ කැපීමක් කරනවා."} },
        { pos: fp("2R2rk1/pp3ppp/8/8/5r2/3q4/PP3PPP/5QK1"), text: {en:"Here Black's queen has just captured on d3. The natural reply is Qxd3. But then Black plays Rxc8+ and takes White's rook. The result is about equal.",si:"මෙතන කළු රැජින දැන් d3 එකේ කැපුවා. ස්වභාවික පිළිතුර Qxd3. ඒත් එතකොට කළු Rxc8+ කරලා සුදුගේ රුක් එක ගන්නවා. ප්‍රතිඵලය ආසන්න වශයෙන් සමානයි."} },
        { pos: fp("2R2rk1/pp3ppp/8/8/5r2/3q4/PP3PPP/5QK1"), move: ["c8","f8"], caps: ["f8"], text: {en:"Rxf8+! Take the rook first, with check. Black must deal with the check, so the queen on d3 has no time to escape.",si:"Rxf8+! මුලින් චෙක් එකත් එක්ක රුක් එක කපනවා. කළු චෙක් එකට පිළිතුරු දෙන්න ඕනේ, ඒ නිසා d3 වල රැජිනට ගැලවෙන්න වෙලාවක් නෑ."} },
        { move: ["g8","f8"], caps: ["f8"], text: {en:"Black has to reply Kxf8. There is no other legal answer.",si:"කළු Kxf8 ලෙස පිළිතුරු දෙන්න වෙනවා. වෙන නීත්‍යනුකූල පිළිතුරක් නෑ."} },
        { move: ["f1","d3"], caps: ["d3"], text: {en:"Now Qxd3. White has won the queen and the rook, and Black has only won one rook.",si:"දැන් Qxd3. සුදු රැජින සහ රුක් එක දිනාගත්තා, කළු දිනාගත්තේ රුක් එකක් විතරයි."} },
        { text: {en:"Before you recapture, stop and ask: do I have a check or a capture that I can play first? If it improves the position, play it first and recapture later.",si:"නැවත කපන්න කලින් නවතින්න, අහන්න: මට මුලින් කරන්න පුළුවන් චෙක් එකක් හෝ කැපීමක් තියෙනවද? ඒකෙන් ස්ථානය හොඳ වෙනවා නම් ඒක මුලින් කරලා පස්සේ නැවත කපන්න."} }
      ] },
      { id: "l2-lucena", title: {en:"The Lucena position",si:"ලුසීනා ස්ථානය"}, steps: [
        { pos: fp("3K4/3P2k1/8/8/8/8/r7/5R2"), text: {en:"The Lucena position is the most important winning position in rook endgames. White has a rook and a pawn on the seventh rank against a rook. The pawn is one step from queening.",si:"ලුසීනා (Lucena) ස්ථානය රුක් අවසන් ක්‍රීඩා වල වැදගත්ම දිනන ස්ථානයයි. සුදුට රුක් එකක් සහ හත්වන පේළියේ පෝන් එකක් තියෙනවා, කළුට රුක් එකක් විතරයි. පෝන් එක රැජිනක් වෙන්න තියෙන්නේ එක පියවරයි."} },
        { text: {en:"The white king stands in front of the pawn on d8, but the pawn also blocks it. The black king is cut off along the f-file by the white rook. The problem: how can the king step out and hide from the rook checks?",si:"සුදු රජු d8 එකේ පෝන් එකට ඉස්සරහින් ඉන්නවා, ඒත් පෝන් එකම රජුට බාධාවක්. කළු රජුව සුදු රුක් එකෙන් f-ෆයිල් එකේ කපලා (cut off) තියෙනවා. ප්‍රශ්නය: රජුට එළියට ඇවිත් රුක් චෙක් වලින් සැඟවෙන්නේ කොහොමද?"} },
        { pos: fp("3K4/3P2k1/8/8/8/8/r7/5R2"), move: ["f1","f4"], text: {en:"Rf4! This is the bridge. The rook goes to the fourth rank so that later it can block checks along the rank.",si:"Rf4! මේක පාලම (bridge). රුක් එක හතරවන පේළියට යනවා, පස්සේ පේළිය දිගේ එන චෙක් අවහිර කරන්න."} },
        { move: ["a2","a1"], text: {en:"Black waits with Ra1.",si:"කළු Ra1 කරලා බලාගෙන ඉන්නවා."} },
        { move: ["d8","e7"], text: {en:"Ke7. The king steps out of the corner, next to its pawn.",si:"Ke7. රජු කොනෙන් එළියට ඇවිත් තමන්ගේ පෝන් එක ළඟට එනවා."} },
        { move: ["a1","e1"], text: {en:"Re1+. Black checks.",si:"Re1+. කළු චෙක් දෙනවා."} },
        { move: ["e7","d6"], text: {en:"Kd6. The king moves toward the rook that will block.",si:"Kd6. රජු අවහිර කරන රුක් එක දිහාවට යනවා."} },
        { move: ["e1","d1"], text: {en:"Rd1+.",si:"Rd1+."} },
        { move: ["d6","e6"], text: {en:"Ke6.",si:"Ke6."} },
        { move: ["d1","e1"], text: {en:"Re1+.",si:"Re1+."} },
        { move: ["e6","d5"], text: {en:"Kd5. Now the king is on the fourth rank, level with the rook.",si:"Kd5. දැන් රජු හතරවන පේළියේ, රුක් එකත් එක්ක එකම පේළියේ."} },
        { move: ["e1","d1"], text: {en:"Rd1+. The last check.",si:"Rd1+. අන්තිම චෙක් එක."} },
        { move: ["f4","d4"], text: {en:"Rd4! The bridge works. The rook blocks the check.",si:"Rd4! පාලම වැඩ කරනවා. රුක් එක චෙක් එක අවහිර කරනවා."} },
        { move: ["d1","d4"], caps: ["d4"], text: {en:"Black takes: Rxd4+.",si:"කළු කපනවා: Rxd4+."} },
        { move: ["d5","d4"], caps: ["d4"], text: {en:"Kxd4. The pawn queens next move and White wins.",si:"Kxd4. ඊළඟ ඇදීමෙන් පෝන් එක රැජිනක් වෙනවා, සුදු දිනනවා."} },
        { text: {en:"The recipe: 1) the enemy king is cut off. 2) Build the bridge with the rook on the fourth rank. 3) Walk the king out toward the checking rook. 4) Block the check with the rook.",si:"ක්‍රමය: 1) සතුරු රජුව කපලා තියෙනවා. 2) හතරවන පේළියේ රුක් එකෙන් පාලම හදන්න. 3) චෙක් දෙන රුක් එක දිහාවට රජුව එළියට ගෙනයන්න. 4) රුක් එකෙන් චෙක් එක අවහිර කරන්න."} }
      ] },
      { id: "l2-philidor", title: {en:"The Philidor position",si:"ෆිලිඩෝ ස්ථානය"}, steps: [
        { pos: fp("4k3/8/r7/3KP3/8/1R6/8/8"), text: {en:"The Philidor position is the main drawing method in rook endgames. The defender has a rook against a rook and a pawn, and still holds the draw.",si:"ෆිලිඩෝ (Philidor) ස්ථානය රුක් අවසන් ක්‍රීඩා වල සමානකම ලබාගන්න ප්‍රධාන ක්‍රමයයි. ආරක්ෂා කරන පැත්තට රුක් එකක් විතරයි, සතුරාට රුක් එකයි පෝන් එකකුයි, ඒත් සමානකම රකින්න පුළුවන්."} },
        { text: {en:"Black keeps the rook on the sixth rank. The white king cannot cross that line to help the pawn. The black king waits in front of the pawn on the back rank.",si:"කළු රුක් එක හයවන පේළියේ තියාගන්නවා. සුදු රජුට ඒ ඉර පහු කරලා පෝන් එකට උදව් කරන්න බෑ. කළු රජු පසුපස පේළියේ පෝන් එකට ඉස්සරහින් බලාගෙන ඉන්නවා."} },
        { pos: fp("4k3/8/r7/3KP3/8/1R6/8/8"), move: ["e5","e6"], text: {en:"White pushes the pawn to the sixth rank. Now the rook on the sixth rank has no job.",si:"සුදු පෝන් එක හයවන පේළියට තල්ලු කරනවා. දැන් හයවන පේළියේ රුක් එකට වැඩක් නෑ."} },
        { move: ["a6","a1"], text: {en:"Ra1! The rook goes far back to the first rank. From there it checks from behind.",si:"Ra1! රුක් එක පළමු පේළියට ඈතට යනවා. එතැනින් පිටිපස්සෙන් චෙක් දෙනවා."} },
        { move: ["b3","b8"], text: {en:"White tries Rb8+ to chase the king.",si:"සුදු රජුව එළවන්න Rb8+ උත්සාහ කරනවා."} },
        { move: ["e8","e7"], text: {en:"Ke7. The king steps up and attacks the pawn.",si:"Ke7. රජු ඉදිරියට ඇවිත් පෝන් එකට ප්‍රහාර කරනවා."} },
        { move: ["b8","b7"], text: {en:"Rb7+. Another check.",si:"Rb7+. තවත් චෙක් එකක්."} },
        { move: ["e7","f6"], text: {en:"Kf6. The king attacks the pawn on e6 again. White cannot make progress and the game is a draw.",si:"Kf6. රජු නැවතත් e6 වල පෝන් එකට ප්‍රහාර කරනවා. සුදුට ඉදිරියට යන්න බෑ, ක්‍රීඩාව සමානයි."} },
        { text: {en:"The rules: 1) rook on the sixth rank while the pawn is on the fifth. 2) When the pawn reaches the sixth rank, the rook goes to the first rank. 3) Keep checking from behind. 4) Keep the king near the pawn's path.",si:"රීති: 1) පෝන් එක පස්වන පේළියේ ඉන්නකල් රුක් එක හයවන පේළියේ. 2) පෝන් එක හයවන පේළියට එනකොට රුක් එක පළමු පේළියට. 3) පිටිපස්සෙන් චෙක් දිගටම දෙන්න. 4) රජු පෝන් එකේ මාර්ගය ළඟ තියාගන්න."} }
      ] },
      { id: "l2-rook-endgames", title: {en:"Rook endgame rules",si:"රුක් අවසන් ක්‍රීඩා රීති"}, steps: [
        { text: {en:"Rook endgames are the most common endgames in chess. Many of them are drawn if the defender plays actively. Learn four rules.",si:"රුක් අවසන් ක්‍රීඩා චෙස් වල වඩාත්ම සුලභ අවසන් ක්‍රීඩායි. ආරක්ෂා කරන පැත්ත ක්‍රියාශීලීව ක්‍රීඩා කළොත් ඒවායින් බොහොමයක් සමානයි. රීති හතරක් ඉගෙන ගන්න."} },
        { pos: fp("6k1/8/8/P7/8/8/8/R5K1"), text: {en:"Rule 1: put your rook behind a passed pawn. The rook on a1 supports the pawn on a5 from behind, and it stays active the whole way.",si:"රීතිය 1: පාස්ඩ් පෝන් එකක පිටිපස්සේ රුක් එක තියන්න. a1 වල රුක් එක a5 වල පෝන් එකට පිටිපස්සෙන් උදව් කරනවා, මුළු ගමනටම ක්‍රියාශීලීව ඉන්නවා."} },
        { pos: fp("r5k1/1R3ppp/8/8/8/8/5PPP/6K1"), text: {en:"Rule 2: keep the rook active. White's rook on b7 attacks the pawn on f7 and ties Black down. Black's rook on a8 is passive.",si:"රීතිය 2: රුක් එක ක්‍රියාශීලීව තියන්න. b7 වල සුදු රුක් එක f7 වල පෝන් එකට ප්‍රහාර කරලා කළුව බැඳලා දානවා. a8 වල කළු රුක් එක අක්‍රියයි."} },
        { pos: fp("6k1/8/8/8/4R3/8/1P3K2/8"), text: {en:"Rule 3: cut off the enemy king. The white rook on e4 stops the black king from crossing the e-file, so it can never reach the pawn on b2.",si:"රීතිය 3: සතුරු රජුව කපන්න. e4 වල සුදු රුක් එක කළු රජුට e-ෆයිල් එක පහු කරන්න දෙන්නේ නෑ, ඒ නිසා b2 වල පෝන් එකට කවදාවත් ළඟා වෙන්න බෑ."} },
        { text: {en:"Rule 4: do not be passive. When you defend, attack the enemy from behind or from the side, and keep giving checks. A passive rook loses, an active rook draws.",si:"රීතිය 4: අක්‍රිය වෙන්න එපා. ආරක්ෂා කරද්දී සතුරාට පිටිපස්සෙන් හෝ පැත්තෙන් ප්‍රහාර කරන්න, චෙක් දිගටම දෙන්න. අක්‍රිය රුක් එක පරාජය වෙනවා, ක්‍රියාශීලී රුක් එක සමාන කරගන්නවා."} }
      ] }
    ],
  };
  const P = {
    "l2-overloading": [
      { type: "square", pos: fp("2r3k1/5ppp/2n5/8/8/8/PP1Q1PPP/2R3K1"), q: {en:"Click the overloaded black piece. It has two jobs.",si:"අධිභාරයට පත් කළු ඉත්තා ක්ලික් කරන්න. ඒකට වැඩ දෙකක් තියෙනවා."}, ans: ["c8"] },
      { type: "choice", q: {en:"What does \"overloaded\" mean in chess?",si:"චෙස් වල \"overloaded\" කියන්නේ මොකක්ද?"}, opts: [{en:"A piece that has to guard two things at once",si:"එකවර දේවල් දෙකක් ආරක්ෂා කරන්න වුණු ඉත්තෙක්"},{en:"A piece that has moved too many times",si:"වැඩි වාර ගණනක් ඇදුණු ඉත්තෙක්"},{en:"A queen that is attacked",si:"ප්‍රහාර ලබන රැජිනක්"}], a: 0 },
      { type: "choice", q: {en:"How do you win material against an overloaded piece?",si:"අධිභාරයට පත් ඉත්තෙකුට එරෙහිව ඉත්තන් දිනාගන්නේ කොහොමද?"}, opts: [{en:"Ignore it and play on the other side",si:"ඒක නොසලකා අනිත් පැත්තේ ක්‍රීඩා කරන්න"},{en:"Attack one of the things it guards",si:"ඒ ආරක්ෂා කරන දේවල් වලින් එකකට ප්‍රහාර කරන්න"},{en:"Trade your queen at once",si:"ඔයාගේ රැජින එකවර හුවමාරු කරන්න"}], a: 1 },
      { type: "choice", pos: fp("2r3k1/5ppp/2n5/8/8/8/PP1Q1PPP/2R3K1"), q: {en:"White to move. Which move wins by overloading the rook on c8?",si:"සුදුගේ වාරය. c8 වල රුක් එකේ අධිභාරය උපයෝගී කරගෙන දිනන ඇදීම කුමක්ද?"}, opts: [{en:"a3",si:"a3"},{en:"h3",si:"h3"},{en:"Rxc6",si:"Rxc6"},{en:"Kf1",si:"Kf1"}], a: 2 },
      { type: "choice", q: {en:"In the example, why can the rook not take back on c6 safely?",si:"උදාහරණයේ, රුක් එකට c6 එකේ ආපහු ආරක්ෂිතව කපන්න බැරි ඇයි?"}, opts: [{en:"It leaves the back rank, so Qd8 is mate",si:"ඒක පසුපස පේළිය අතහරිනවා, ඒ නිසා Qd8 චෙක්මේට්"},{en:"Because the knight is protected twice",si:"නයිට් එක දෙපාරක් ආරක්ෂා වෙලා තියෙන නිසා"},{en:"Because rooks cannot capture knights",si:"රුක් වලට නයිට් කපන්න බැරි නිසා"}], a: 0 }
    ],
    "l2-zwischenzug": [
      { type: "move", pos: fp("2R2rk1/pp3ppp/8/8/5r2/3q4/PP3PPP/5QK1"), q: {en:"White to move. Find the in-between move.",si:"සුදුගේ වාරය. අතරමැදි ඇදීම සොයන්න."}, ans: [["c8","f8"]] },
      { type: "choice", pos: fp("6k1/pp1R1ppp/8/8/1r6/5r1q/PP1Q1PPP/6K1"), q: {en:"White to move. Which move checkmates?",si:"සුදුගේ වාරය. චෙක්මේට් කරන්නේ කුමන ඇදීමද?"}, opts: [{en:"Rd8#",si:"Rd8#"},{en:"Qxb4",si:"Qxb4"},{en:"Rxb7",si:"Rxb7"},{en:"h3",si:"h3"}], a: 0 },
      { type: "choice", q: {en:"What is a zwischenzug?",si:"ස්විෂන්සුග් කියන්නේ මොකක්ද?"}, opts: [{en:"A way of castling",si:"කැසල් කරන ක්‍රමයක්"},{en:"A pawn promotion",si:"පෝන් උසස් කිරීමක්"},{en:"An in-between move played before the expected reply",si:"බලාපොරොත්තු වෙන පිළිතුරට කලින් කරන අතරමැදි ඇදීමක්"}], a: 2 },
      { type: "choice", q: {en:"You can recapture a piece. What should you check first?",si:"ඔයාට ඉත්තෙක් නැවත කපන්න පුළුවන්. මුලින් මොනවද බලන්න ඕනේ?"}, opts: [{en:"Whether a check or capture is stronger first",si:"මුලින් චෙක් එකක් හෝ කැපීමක් වඩා ශක්තිමත්ද කියලා"},{en:"Nothing, always recapture at once",si:"කිසිවක් නෑ, හැමවිටම එකවර නැවත කපන්න"},{en:"Whether you can castle",si:"කැසල් කරන්න පුළුවන්ද කියලා"}], a: 0 },
      { type: "choice", q: {en:"Why is a check a good in-between move?",si:"චෙක් එකක් හොඳ අතරමැදි ඇදීමක් වෙන්නේ ඇයි?"}, opts: [{en:"Checks win a pawn by the rules",si:"නීතිය අනුව චෙක් වලින් පෝන් එකක් ලැබෙනවා"},{en:"The opponent must answer it, so you choose the moment",si:"සතුරාට ඒකට පිළිතුරු දෙන්න වෙනවා, ඒ නිසා වෙලාව තෝරන්නේ ඔයා"},{en:"Checks make the opponent skip a turn",si:"චෙක් වලින් සතුරාගේ වාරය මඟහැරෙනවා"}], a: 1 }
    ],
    "l2-lucena": [
      { type: "square", pos: fp("3K4/3P2k1/8/8/8/8/r7/5R2"), q: {en:"Click the pawn that is about to promote.",si:"උසස් වෙන්න ළඟින් ඉන්න පෝන් එක ක්ලික් කරන්න."}, ans: ["d7"] },
      { type: "choice", pos: fp("3K4/3P2k1/8/8/8/8/r7/5R2"), q: {en:"What is the Lucena position?",si:"ලුසීනා ස්ථානය කියන්නේ මොකක්ද?"}, opts: [{en:"A drawing rook ending",si:"සමාන රුක් අවසානයක්"},{en:"A queen against rook ending",si:"රැජින එදිරිව රුක් අවසානයක්"},{en:"A winning rook ending: pawn on the seventh, own king in front, enemy king cut off",si:"දිනන රුක් අවසානයක්: හත්වන පේළියේ පෝන්, ඉස්සරහ තමන්ගේ රජු, සතුරු රජු කපලා"}], a: 2 },
      { type: "choice", q: {en:"What does \"building a bridge\" mean?",si:"\"පාලම හදනවා\" කියන්නේ මොකක්ද?"}, opts: [{en:"Putting the rook on the fourth rank so it can block checks",si:"චෙක් අවහිර කරන්න රුක් එක හතරවන පේළියට දාන එක"},{en:"Moving the king next to the pawn",si:"රජු පෝන් එක ළඟට ගෙනයන එක"},{en:"Trading rooks",si:"රුක් හුවමාරු කරන එක"}], a: 0 },
      { type: "choice", q: {en:"What is the result of the Lucena position with correct play?",si:"නිවැරදි ක්‍රීඩාවෙන් ලුසීනා ස්ථානයේ ප්‍රතිඵලය මොකක්ද?"}, opts: [{en:"A draw",si:"සමානයි"},{en:"A win for the side with the pawn",si:"පෝන් එක තියෙන පැත්තට ජයක්"},{en:"A win for the defender",si:"ආරක්ෂා කරන පැත්තට ජයක්"}], a: 1 },
      { type: "choice", q: {en:"Why must the enemy king be cut off first?",si:"සතුරු රජුව මුලින්ම කපන්න ඕනේ ඇයි?"}, opts: [{en:"To give a check",si:"චෙක් එකක් දෙන්න"},{en:"Because the rules say so",si:"නීතියේ තියෙන නිසා"},{en:"So it cannot come back to stop the pawn",si:"ඒකට ආපහු ඇවිත් පෝන් එක නවත්තන්න බැරි වෙන්න"}], a: 2 }
    ],
    "l2-philidor": [
      { type: "square", pos: fp("4k3/8/r7/3KP3/8/1R6/8/8"), q: {en:"Click the defending rook.",si:"ආරක්ෂා කරන රුක් එක ක්ලික් කරන්න."}, ans: ["a6"] },
      { type: "choice", pos: fp("4k3/8/r7/3KP3/8/1R6/8/8"), q: {en:"What is the Philidor position?",si:"ෆිලිඩෝ ස්ථානය කියන්නේ මොකක්ද?"}, opts: [{en:"A drawing defence in rook against rook and pawn",si:"රුක් එදිරිව රුක් සහ පෝන් එකේ සමානකම රකින ආරක්ෂාවක්"},{en:"A winning attack with two rooks",si:"රුක් දෙකකින් දිනන ප්‍රහාරයක්"},{en:"A queen opening",si:"රැජින ආරම්භයක්"}], a: 0 },
      { type: "choice", q: {en:"Why does the rook stay on the sixth rank?",si:"රුක් එක හයවන පේළියේ ඉන්නේ ඇයි?"}, opts: [{en:"It attacks the pawn directly",si:"ඒක පෝන් එකට කෙලින්ම ප්‍රහාර කරනවා"},{en:"It stops the enemy king from advancing",si:"සතුරු රජුට ඉදිරියට එන්න නොදී නවත්තනවා"},{en:"It protects the black king from checks",si:"ඒක කළු රජුව චෙක් වලින් ආරක්ෂා කරනවා"}], a: 1 },
      { type: "choice", q: {en:"The pawn reaches the sixth rank. Where does the defending rook go?",si:"පෝන් එක හයවන පේළියට පැමිණියා. ආරක්ෂා කරන රුක් එක කොහාටද යන්නේ?"}, opts: [{en:"It stays on the sixth rank",si:"ඒක හයවන පේළියේම ඉන්නවා"},{en:"It takes the pawn at once",si:"ඒක එකවර පෝන් එක කපනවා"},{en:"To the first rank, to check from behind",si:"පළමු පේළියට, පිටිපස්සෙන් චෙක් දෙන්න"}], a: 2 },
      { type: "choice", q: {en:"What is the result of correct Philidor defence?",si:"නිවැරදි ෆිලිඩෝ ආරක්ෂාවේ ප්‍රතිඵලය මොකක්ද?"}, opts: [{en:"A draw",si:"සමානයි"},{en:"A win for White",si:"සුදුට ජයක්"},{en:"A win for Black",si:"කළුට ජයක්"}], a: 0 }
    ],
    "l2-rook-endgames": [
      { type: "square", pos: fp("r5k1/1R3ppp/8/8/8/8/5PPP/6K1"), q: {en:"Click the rook that is on the seventh rank.",si:"හත්වන පේළියේ ඉන්න රුක් එක ක්ලික් කරන්න."}, ans: ["b7"] },
      { type: "square", pos: fp("6k1/8/8/P7/8/8/8/R5K1"), q: {en:"Click the rook that stands behind the passed pawn.",si:"පාස්ඩ් පෝන් එකේ පිටිපස්සේ ඉන්න රුක් එක ක්ලික් කරන්න."}, ans: ["a1"] },
      { type: "choice", q: {en:"Where should the rook stand to support a passed pawn?",si:"පාස්ඩ් පෝන් එකකට උදව් කරන්න රුක් එක ඉන්න ඕනේ කොහේද?"}, opts: [{en:"In front of the pawn",si:"පෝන් එකට ඉස්සරහින්"},{en:"Behind the pawn",si:"පෝන් එකේ පිටිපස්සේ"},{en:"In the corner, far away",si:"ඈතින් කොනක"}], a: 1 },
      { type: "choice", pos: fp("6k1/8/8/8/4R3/8/1P3K2/8"), q: {en:"What does \"cutting off the king\" mean?",si:"\"රජුව කපනවා\" කියන්නේ මොකක්ද?"}, opts: [{en:"Capturing the enemy king",si:"සතුරු රජු කපන එක"},{en:"Trading both rooks",si:"රුක් දෙකම හුවමාරු කරන එක"},{en:"Using the rook on a file or rank so the enemy king cannot cross it",si:"රුක් එකෙන් ෆයිල් එකක් හෝ පේළියක් අල්ලලා සතුරු රජුට ඒක පහු කරන්න බැරි කරන එක"}], a: 2 },
      { type: "choice", q: {en:"You are defending a rook endgame. What is the best approach?",si:"ඔයා රුක් අවසන් ක්‍රීඩාවක් ආරක්ෂා කරනවා. හොඳම ක්‍රමය මොකක්ද?"}, opts: [{en:"Keep the rook active and give checks",si:"රුක් එක ක්‍රියාශීලීව තියලා චෙක් දෙන්න"},{en:"Keep the rook passive on the back rank",si:"රුක් එක පසුපස පේළියේ අක්‍රියව තියන්න"},{en:"Give up the rook for a pawn",si:"රුක් එක පෝන් එකකට දෙන්න"}], a: 0 },
      { type: "choice", pos: fp("r5k1/1R3ppp/8/8/8/8/5PPP/6K1"), q: {en:"Which rook is better placed?",si:"වඩා හොඳ ස්ථානයක ඉන්නේ කුමන රුක් එකද?"}, opts: [{en:"The passive rook on the back rank",si:"පසුපස පේළියේ අක්‍රිය රුක් එක"},{en:"The active rook on the seventh rank",si:"හත්වන පේළියේ ක්‍රියාශීලී රුක් එක"},{en:"Both are equal",si:"දෙකම සමානයි"}], a: 1 }
    ]
  };
  window.PQ_PRACTICE = Object.assign(window.PQ_PRACTICE || {}, P);
  window.PQ_MODULES = (window.PQ_MODULES || []).concat([window.PQ_MODULE_22]);
})();
