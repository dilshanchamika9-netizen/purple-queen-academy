/* Purple Queen Chess Academy — Level 3 · Module 1: Positional play
   Board positions are built and checked by code (python-chess). Sinhala text and FIDE wording need coach review (Washini). */
(function () {
  const T = (en, si) => ({ en, si });
  const fp = window.PQ_FP;
  window.PQ_MODULE_15 = {
    level: T("Level 3 · Queen", "මට්ටම 3 · රැජින"),
    title: T("Positional play", "ස්ථානීය ක්‍රීඩාව"),
    lessons: [
      { id: "l3-pawn-structure", title: {en:"Pawn structures",si:"පෝන් ව්‍යුහයන්"}, steps: [
        { pos: fp("6k1/pp3ppp/8/3p4/8/8/PPP2PPP/6K1"), text: {en:"Pawns cannot move backwards, so a pawn structure is permanent. It decides where your pieces belong and what both sides will aim for.",si:"පෝන්වලට පසුපසට ඇදෙන්න බෑ, ඒ නිසා පෝන් ව්‍යුහය ස්ථිරයි. ඔයාගේ ඉත්තන් ඉන්න ඕනේ තැන් සහ දෙපැත්ත ඉලක්ක කරන දේ තීරණය කරන්නේ ඒකයි."} },
        { pos: fp("6k1/pp3ppp/8/3p4/8/8/PPP2PPP/6K1"), text: {en:"An isolated pawn has no friendly pawn on a neighbouring file. No pawn can ever defend it, so pieces must guard it. Here the black d5 pawn is isolated.",si:"හුදකලා පෝන් එකකට (isolated pawn) ළඟ ෆයිල් වල තමන්ගේම පෝන් නෑ. කිසිම පෝන් එකකට ඒක ආරක්ෂා කරන්න බෑ, ඉත්තන්ට ඒක ආරක්ෂා කරන්න වෙනවා. මෙතන කළු d5 පෝන් එක හුදකලායි."} },
        { pos: fp("6k1/5ppp/8/8/2P5/2P5/PP3PPP/6K1"), text: {en:"Doubled pawns are two pawns of one colour on the same file, like c3 and c4 here. They block each other and are harder to defend.",si:"ඩබල්ඩ් පෝන් (doubled pawns) කියන්නේ එකම පාටේ පෝන් දෙකක් එකම ෆයිල් එකේ තියෙන එකයි, මෙතන c3 සහ c4 වගේ. ඒවා එකිනෙකට බාධා කරනවා, ආරක්ෂා කරන්නත් අමාරුයි."} },
        { pos: fp("6k1/pp3ppp/8/3P4/8/8/PP3PPP/6K1"), text: {en:"A passed pawn has no enemy pawn in front of it on its own file or the two neighbouring files. Nothing can stop it with pawns. The white d5 pawn is passed.",si:"පාස්ඩ් පෝන් (passed pawn) එකක් ඉස්සරහට තමන්ගේ ෆයිල් එකේ සහ ළඟ ෆයිල් දෙකේ සතුරු පෝන් නෑ. පෝන් වලින් ඒකට නවත්වන්න බෑ. සුදු d5 පෝන් එක පාස්ඩ් එකක්."} },
        { text: {en:"A backward pawn is behind its neighbours and cannot advance safely. Pawn structure tells you the plan: attack weak pawns, push passed pawns, avoid creating your own weaknesses.",si:"බැක්වර්ඩ් පෝන් (backward pawn) එකක් තමන්ගේ අසල්වැසි පෝන් වලට පිටිපස්සෙන් ඉන්නවා, ආරක්ෂිතව ඉදිරියට යන්න බෑ. පෝන් ව්‍යුහයෙන් සැලැස්ම පේනවා: දුර්වල පෝන් වලට ප්‍රහාර කරන්න, පාස්ඩ් පෝන් ඉදිරියට තල්ලු කරන්න, තමන්ටම දුර්වලකම් හදාගන්න එපා."} }
      ] },
      { id: "l3-good-bad-bishop", title: {en:"Good and bad bishops",si:"හොඳ සහ නරක බිෂොප්"}, steps: [
        { pos: fp("2b3k1/1p3p1p/2p1p1p1/3p4/4P3/1P1P1P1P/2P5/2B3K1"), text: {en:"A bishop stays on one colour of squares for the whole game. Your own pawns standing on that same colour block it.",si:"බිෂොප් කෙනෙක් මුළු ක්‍රීඩාවටම එකම පාට කොටු වල ඉන්නේ. එකම පාට කොටු වල තියෙන ඔයාගේම පෝන් ඒකට බාධා කරනවා."} },
        { pos: fp("2b3k1/1p3p1p/2p1p1p1/3p4/4P3/1P1P1P1P/2P5/2B3K1"), text: {en:"Here all the pawns stand on light squares. The white bishop is dark-squared, so its diagonals are open. It is a good bishop.",si:"මෙතන සියලුම පෝන් ඉන්නේ සුදු පාට කොටු වල. සුදු බිෂොප් තද පාට කොටු වල ඉන්නේ, ඒ නිසා ඒකේ විකර්ණ විවෘතයි. ඒක හොඳ බිෂොප් එකක්."} },
        { pos: fp("2b3k1/1p3p1p/2p1p1p1/3p4/4P3/1P1P1P1P/2P5/2B3K1"), text: {en:"The black bishop is light-squared and its own pawns on c6, d5, e6 and g6 block it. It is a bad bishop.",si:"කළු බිෂොප් සුදු පාට කොටු වල ඉන්නේ, c6, d5, e6 සහ g6 වල ඒකේම පෝන් ඒකට බාධා කරනවා. ඒක නරක බිෂොප් එකක්."} },
        { text: {en:"Rule of thumb: put your pawns on the colour opposite to your bishop. Then the bishop has room and your pawns guard the squares it cannot.",si:"සරල රීතිය: ඔයාගේ පෝන් බිෂොප් එකේ පාටට ප්‍රතිවිරුද්ධ පාටේ තියන්න. එතකොට බිෂොප් එකට ඉඩ තියෙනවා, ඒකට යන්න බැරි කොටු පෝන් වලින් ආරක්ෂා වෙනවා."} },
        { text: {en:"A bad bishop can be improved: move it outside the pawn chain before you close the position, or trade it for an enemy piece.",si:"නරක බිෂොප් එකක් හදාගන්න පුළුවන්: ස්ථානය වැහෙන්න කලින් ඒක පෝන් දාමයෙන් පිටතට ගෙනියන්න, නැත්නම් සතුරු ඉත්තෙක් එක්ක හුවමාරු කරන්න."} }
      ] },
      { id: "l3-outposts", title: {en:"Outposts",si:"අවුට්පෝස්ට්"}, steps: [
        { pos: fp("6k1/pp1p1ppp/8/8/2P5/2N5/PP3PPP/6K1"), text: {en:"An outpost is a square in the enemy half of the board, protected by one of your pawns, which no enemy pawn can ever attack.",si:"අවුට්පෝස්ට් (outpost) එකක් කියන්නේ සතුරු පැත්තේ තියෙන, ඔයාගේ පෝන් එකකින් ආරක්ෂා වෙන, සතුරු පෝන් එකකට කවදාවත් ප්‍රහාර කරන්න බැරි කොටුවක්."} },
        { pos: fp("6k1/pp1p1ppp/8/8/2P5/2N5/PP3PPP/6K1"), text: {en:"In this position d5 is an outpost for White. The pawn on c4 protects it, and Black has no c-pawn or e-pawn left to attack it.",si:"මේ ස්ථානයේ d5 සුදුට අවුට්පෝස්ට් එකක්. c4 පෝන් එක ඒක ආරක්ෂා කරනවා, ඒකට ප්‍රහාර කරන්න කළුට c-පෝන් හෝ e-පෝන් ඉතිරි වෙලා නෑ."} },
        { pos: fp("6k1/pp1p1ppp/8/8/2P5/2N5/PP3PPP/6K1"), text: {en:"A knight is the best piece for an outpost. From d5 it attacks many squares and nobody can chase it away with a pawn.",si:"අවුට්පෝස්ට් එකකට හොඳම ඉත්තා නයිට් එකයි. d5 ඉඳන් ඒක කොටු ගොඩකට ප්‍රහාර කරනවා, පෝන් එකකින් එළවන්නත් කාටවත් බෑ."} },
        { text: {en:"Here the white knight on c3 can jump straight to d5. A knight on a strong outpost can be worth more than a rook.",si:"මෙතන c3 වල සුදු නයිට් එකට කෙලින්ම d5 වෙත පනින්න පුළුවන්. ශක්තිමත් අවුට්පෝස්ට් එකක ඉන්න නයිට් එකක් රුක් එකකටත් වඩා වටිනවා."} },
        { text: {en:"To fight against an outpost, keep a pawn that can attack the square, or trade off the knight that wants to use it.",si:"අවුට්පෝස්ට් එකකට විරුද්ධව සටන් කරන්න ඒ කොටුවට ප්‍රහාර කරන්න පුළුවන් පෝන් එකක් තියාගන්න, නැත්නම් ඒක පාවිච්චි කරන්න යන නයිට් එක හුවමාරු කරන්න."} }
      ] },
      { id: "l3-open-files", title: {en:"Open files and rooks",si:"විවෘත ෆයිල් සහ රුක්"}, steps: [
        { pos: fp("6k1/pp3ppp/8/8/3P4/8/PP3PPP/2R1R1K1"), text: {en:"A file is open when there is no pawn of either colour on it. Rooks need open files, because pawns block them.",si:"ෆයිල් එකක් විවෘතයි (open file) කියන්නේ කිසිම පාටක පෝන් එකක් ඒකේ නැති නම්. රුක් වලට විවෘත ෆයිල් ඕනේ, මොකද පෝන් ඒවාට බාධා කරනවා."} },
        { pos: fp("6k1/pp3ppp/8/8/3P4/8/PP3PPP/2R1R1K1"), text: {en:"Here the c-file and the e-file are open. Both white rooks stand on open files and press into Black's position.",si:"මෙතන c-ෆයිල් එක සහ e-ෆයිල් එක විවෘතයි. සුදු රුක් දෙකම විවෘත ෆයිල් වල ඉඳන් කළුගේ ස්ථානයට පීඩනය දෙනවා."} },
        { text: {en:"A semi-open file has a pawn of only one colour. A rook on it attacks the enemy pawn on that file.",si:"අර්ධ විවෘත ෆයිල් එකක (semi-open file) එක පාටක පෝන් එකක් විතරයි තියෙන්නේ. ඒකේ රුක් එකකට ඒ ෆයිල් එකේ සතුරු පෝන් එකට ප්‍රහාර කරන්න පුළුවන්."} },
        { text: {en:"Best targets: take the open file first, then enter the seventh rank. A rook on the 7th attacks pawns from behind and traps the enemy king.",si:"හොඳම ඉලක්ක: මුලින් විවෘත ෆයිල් එක අල්ලාගන්න, ඊට පස්සේ හත්වන පේළියට ඇතුල් වෙන්න. 7 වන පේළියේ රුක් එකක් පිටිපස්සෙන් පෝන් වලට ප්‍රහාර කරනවා, සතුරු රජුව කොටු කරනවා."} },
        { text: {en:"Double your rooks on the open file: one behind the other. Together they are very hard to stop.",si:"විවෘත ෆයිල් එකේ රුක් දෙකම ඩබල් කරන්න: එකක් අනිත් එකේ පිටිපස්සෙන්. එකට ඒවා නවත්වන්න බොහොම අමාරුයි."} }
      ] },
      { id: "l3-planning", title: {en:"Making a plan",si:"සැලැස්මක් හදමු"}, steps: [
        { text: {en:"Strong players always have a plan. Without one you just react to the opponent and drift.",si:"ශක්තිමත් ක්‍රීඩකයන්ට හැමවිටම සැලැස්මක් තියෙනවා. නැතිනම් ඔයා ප්‍රතිවාදියාට ප්‍රතිචාර දක්වමින් විතරක් ඉන්නවා."} },
        { text: {en:"Step 1: assess the position. Count material. Check both kings. Compare how active the pieces are. Look at the pawn structure.",si:"පියවර 1: ස්ථානය තක්සේරු කරන්න. ඉත්තන් ගණන් කරන්න. රජුන් දෙන්නා පරීක්ෂා කරන්න. ඉත්තන් කොච්චර ක්‍රියාශීලීද කියලා සසඳන්න. පෝන් ව්‍යුහය බලන්න."} },
        { text: {en:"Step 2: find the weaknesses: isolated pawns, weak squares, an unsafe king, a badly placed piece. Aim your plan at the opponent's weakness.",si:"පියවර 2: දුර්වලකම් හොයන්න: හුදකලා පෝන්, දුර්වල කොටු, අනාරක්ෂිත රජු, නරක තැනක ඉන්න ඉත්තෙක්. ඔයාගේ සැලැස්ම ප්‍රතිවාදියාගේ දුර්වලකමට ඉලක්ක කරන්න."} },
        { text: {en:"Step 3: improve your worst piece. Ask: which of my pieces is doing the least? Find a better square for it.",si:"පියවර 3: ඔයාගේ නරකම ඉත්තා හදාගන්න. අහන්න: මගේ කුමන ඉත්තාද අඩුම වැඩ කරන්නේ? ඒකට වඩා හොඳ කොටුවක් හොයන්න."} },
        { text: {en:"Step 4: ask what your opponent wants to do. Stop their plan before you start yours. This is called prophylaxis.",si:"පියවර 4: ප්‍රතිවාදියාට කරන්න ඕනේ මොකක්ද කියලා අහන්න. ඔයාගේ එක පටන් ගන්න කලින් එයාගේ සැලැස්ම නවත්වන්න. මේකට කියන්නේ ප්‍රොෆිලැක්සිස් (prophylaxis) කියලා."} }
      ] },
    ],
  };
  const P = {
    "l3-pawn-structure": [
      { type: "square", pos: fp("6k1/pp3ppp/8/3p4/8/8/PPP2PPP/6K1"), q: {en:"Click the isolated pawn.",si:"හුදකලා පෝන් එක ක්ලික් කරන්න."}, ans: ["d5"] },
      { type: "square", pos: fp("6k1/pp3ppp/8/3P4/8/8/PP3PPP/6K1"), q: {en:"Click the passed pawn.",si:"පාස්ඩ් පෝන් එක ක්ලික් කරන්න."}, ans: ["d5"] },
      { type: "choice", pos: fp("6k1/5ppp/8/8/2P5/2P5/PP3PPP/6K1"), q: {en:"What are doubled pawns?",si:"ඩබල්ඩ් පෝන් කියන්නේ මොනවාද?"}, opts: [{en:"Two pawns of one colour on the same file",si:"එකම පාටේ පෝන් දෙකක් එකම ෆයිල් එකේ"},{en:"Two pawns side by side",si:"එකිනෙක ළඟින් ඉන්න පෝන් දෙකක්"},{en:"A pawn that has reached the last rank",si:"අවසාන පේළියට ගිය පෝන් එකක්"}], a: 0 },
      { type: "choice", pos: fp("6k1/pp3ppp/8/3p4/8/8/PPP2PPP/6K1"), q: {en:"Why is an isolated pawn a weakness?",si:"හුදකලා පෝන් එක දුර්වලකමක් වෙන්නේ ඇයි?"}, opts: [{en:"It cannot be captured",si:"ඒක කපන්න බෑ"},{en:"No pawn can defend it, so pieces must guard it",si:"ඒකට ආරක්ෂා කරන්න පෝන් නෑ, ඉත්තන්ට ආරක්ෂා කරන්න වෙනවා"},{en:"It blocks the king",si:"ඒක රජුට බාධා කරනවා"}], a: 1 },
      { type: "choice", pos: fp("6k1/pp3ppp/8/3P4/8/8/PP3PPP/6K1"), q: {en:"What is a passed pawn?",si:"පාස්ඩ් පෝන් කියන්නේ මොකක්ද?"}, opts: [{en:"A pawn that has already moved two squares",si:"දැනටමත් කොටු දෙකක් ඇදපු පෝන් එකක්"},{en:"A pawn next to the king",si:"රජු ළඟ ඉන්න පෝන් එකක්"},{en:"A pawn with no enemy pawns ahead on its file or the two neighbouring files",si:"ඉස්සරහට තමන්ගේ ෆයිල් එකේ සහ ළඟ ෆයිල් දෙකේ සතුරු පෝන් නැති පෝන් එකක්"}], a: 2 }
    ],
    "l3-good-bad-bishop": [
      { type: "square", pos: fp("2b3k1/1p3p1p/2p1p1p1/3p4/4P3/1P1P1P1P/2P5/2B3K1"), q: {en:"Click the bad bishop.",si:"නරක බිෂොප් එක ක්ලික් කරන්න."}, ans: ["c8"] },
      { type: "choice", pos: fp("2b3k1/1p3p1p/2p1p1p1/3p4/4P3/1P1P1P1P/2P5/2B3K1"), q: {en:"Which bishop is a \"bad bishop\"?",si:"\"නරක බිෂොප්\" යනු කුමක්ද?"}, opts: [{en:"A bishop blocked by its own pawns on the same colour",si:"ඒකේම පාටේ තියෙන තමන්ගේ පෝන් වලින් අවහිර වුණු බිෂොප්"},{en:"A bishop that is on the edge",si:"කෙළවරේ ඉන්න බිෂොප්"},{en:"A bishop that has been captured",si:"කපලා දාපු බිෂොප්"}], a: 0 },
      { type: "choice", q: {en:"Where should you put your pawns to help your bishop?",si:"ඔයාගේ බිෂොප් එකට උදව් වෙන්න පෝන් තියන්න ඕනේ කොතැනද?"}, opts: [{en:"On the same colour as the bishop",si:"බිෂොප් එකේම පාටේ"},{en:"On the colour opposite to the bishop",si:"බිෂොප් එකේ පාටට ප්‍රතිවිරුද්ධ පාටේ"},{en:"It does not matter",si:"ඒක වැදගත් නෑ"}], a: 1 },
      { type: "choice", q: {en:"Which is a way to improve a bad bishop?",si:"නරක බිෂොප් එකක් හදාගන්න ක්‍රමයක් කුමක්ද?"}, opts: [{en:"Push all pawns to its colour",si:"සියලු පෝන් එකේ පාටට තල්ලු කරන්න"},{en:"Leave it in the corner",si:"කෙළවරේ තියන්න"},{en:"Bring it outside the pawn chain or trade it",si:"පෝන් දාමයෙන් පිටතට ගේන්න, නැත්නම් හුවමාරු කරන්න"}], a: 2 },
      { type: "choice", q: {en:"Can a bishop on a light square ever move to a dark square?",si:"සුදු කොටුවක ඉන්න බිෂොප් කෙනෙකුට කවදාහරි තද කොටුවකට යන්න පුළුවන්ද?"}, opts: [{en:"No: it stays on light squares all game",si:"නෑ: ඒක මුළු ක්‍රීඩාවටම සුදු කොටු වල"},{en:"Yes: after 10 moves",si:"ඔව්: ඇදීම් 10කට පස්සේ"},{en:"Yes: when it captures",si:"ඔව්: කපනකොට"}], a: 0 }
    ],
    "l3-outposts": [
      { type: "square", pos: fp("6k1/pp1p1ppp/8/8/2P5/2N5/PP3PPP/6K1"), q: {en:"Click the outpost square for the white knight.",si:"සුදු නයිට් එකට අවුට්පෝස්ට් කොටුව ක්ලික් කරන්න."}, ans: ["d5"] },
      { type: "choice", q: {en:"What is an outpost?",si:"අවුට්පෝස්ට් එකක් කියන්නේ මොකක්ද?"}, opts: [{en:"Any square next to the king",si:"රජු ළඟ ඕනෑම කොටුවක්"},{en:"A square in the enemy half, supported by your pawn, that enemy pawns cannot attack",si:"සතුරු පැත්තේ, ඔයාගේ පෝන් එකකින් ආරක්ෂා වෙන, සතුරු පෝන් වලට ප්‍රහාර කරන්න බැරි කොටුවක්"},{en:"The square where a piece started",si:"ඉත්තෙක් ආරම්භ කළ කොටුව"}], a: 1 },
      { type: "choice", q: {en:"Which piece is usually best on an outpost?",si:"අවුට්පෝස්ට් එකක හොඳම ඉත්තා සාමාන්‍යයෙන් මොකක්ද?"}, opts: [{en:"The king",si:"රජු"},{en:"A pawn",si:"පෝන්"},{en:"A knight",si:"නයිට්"}], a: 2 },
      { type: "choice", q: {en:"Why can't you chase a knight away from an outpost?",si:"අවුට්පෝස්ට් එකකින් නයිට් එකක් එළවන්න බැරි ඇයි?"}, opts: [{en:"No enemy pawn can attack that square",si:"ඒ කොටුවට ප්‍රහාර කරන්න සතුරු පෝන් නෑ"},{en:"Knights cannot be captured",si:"නයිට් කපන්න බෑ"},{en:"The rules forbid it",si:"නීති වලින් තහනම්"}], a: 0 },
      { type: "choice", q: {en:"How can you fight against an enemy outpost?",si:"සතුරු අවුට්පෝස්ට් එකකට විරුද්ධව සටන් කරන්නේ කොහොමද?"}, opts: [{en:"Move the king there",si:"රජු එතනට ගෙනියන්න"},{en:"Keep a pawn that can attack the square, or trade the knight",si:"ඒ කොටුවට ප්‍රහාර කරන්න පුළුවන් පෝන් එකක් තියාගන්න, නැත්නම් නයිට් එක හුවමාරු කරන්න"},{en:"Ignore it",si:"නොසලකා හරින්න"}], a: 1 }
    ],
    "l3-open-files": [
      { type: "square", pos: fp("6k1/pp3ppp/8/8/3P4/8/PP3PPP/R3R1K1"), q: {en:"Click the white rook that is on an open file.",si:"විවෘත ෆයිල් එකක ඉන්න සුදු රුක් එක ක්ලික් කරන්න."}, ans: ["e1"] },
      { type: "choice", pos: fp("6k1/pp3ppp/8/8/3P4/8/PP3PPP/2R1R1K1"), q: {en:"What is an open file?",si:"විවෘත ෆයිල් එකක් කියන්නේ මොකක්ද?"}, opts: [{en:"A file with only white pawns",si:"සුදු පෝන් විතරක් තියෙන ෆයිල් එකක්"},{en:"A file with a king on it",si:"රජු ඉන්න ෆයිල් එකක්"},{en:"A file with no pawns of either colour",si:"කිසිම පාටක පෝන් නැති ෆයිල් එකක්"}], a: 2 },
      { type: "choice", pos: fp("6k1/pp3ppp/8/8/3P4/8/PP3PPP/2R1R1K1"), q: {en:"Which files are open in the diagram?",si:"රූපයේ විවෘත ෆයිල් මොනවාද?"}, opts: [{en:"The c-file and the e-file",si:"c-ෆයිල් සහ e-ෆයිල්"},{en:"Only the a-file",si:"a-ෆයිල් විතරයි"},{en:"The d-file and the f-file",si:"d-ෆයිල් සහ f-ෆයිල්"}], a: 0 },
      { type: "choice", q: {en:"Why do rooks like open files?",si:"රුක් වලට විවෘත ෆයිල් ප්‍රිය ඇයි?"}, opts: [{en:"They can then jump over pieces",si:"ඊට පස්සේ ඒවාට පැනලා යන්න පුළුවන්"},{en:"Pawns do not block them",si:"පෝන් වලින් ඒවාට බාධා වෙන්නේ නෑ"},{en:"They can then move diagonally",si:"ඊට පස්සේ ඒවාට විකර්ණව ඇදෙන්න පුළුවන්"}], a: 1 },
      { type: "choice", q: {en:"What is \"doubling rooks\"?",si:"\"රුක් ඩබල් කිරීම\" කියන්නේ මොකක්ද?"}, opts: [{en:"Capturing two rooks",si:"රුක් දෙකක් කපන එක"},{en:"Moving a rook twice",si:"රුක් එකක් දෙපාරක් ඇදීම"},{en:"Placing both rooks on the same file, one behind the other",si:"රුක් දෙකම එකම ෆයිල් එකක තියන එක, එකක් අනිත් එකේ පිටිපස්සෙන්"}], a: 2 }
    ],
    "l3-planning": [
      { type: "choice", q: {en:"What is the first step in making a plan?",si:"සැලැස්මක් හදන්න පළමු පියවර මොකක්ද?"}, opts: [{en:"Assess the position: material, kings, activity, pawns",si:"ස්ථානය තක්සේරු කරන්න: ඉත්තන්, රජුන්, ක්‍රියාශීලීභාවය, පෝන්"},{en:"Move the first pawn",si:"පළමු පෝන් එක ඇදන්න"},{en:"Offer a draw",si:"සමාන කරගැනීමක් යෝජනා කරන්න"}], a: 0 },
      { type: "choice", pos: fp("6k1/pp3ppp/8/3p4/8/8/PPP2PPP/6K1"), q: {en:"Your opponent has an isolated d-pawn. What is a good plan?",si:"ප්‍රතිවාදියාට හුදකලා d-පෝන් එකක් තියෙනවා. හොඳ සැලැස්මක් මොකක්ද?"}, opts: [{en:"Ignore it and trade queens",si:"ඒක නොසලකා රැජින් හුවමාරු කරන්න"},{en:"Attack it and keep pieces trained on it",si:"ඒකට ප්‍රහාර කරලා ඉත්තන් ඒකට ඉලක්ක කරගන්න"},{en:"Move the king away",si:"රජු ඈතට ගෙනියන්න"}], a: 1 },
      { type: "choice", q: {en:"Which piece should you improve first?",si:"මුලින්ම හදාගන්න ඕනේ කුමන ඉත්තාද?"}, opts: [{en:"Your best-placed piece",si:"ඔයාගේ හොඳම තැනක ඉන්න ඉත්තා"},{en:"A pawn on the edge",si:"කෙළවරේ පෝන් එකක්"},{en:"Your worst-placed piece",si:"ඔයාගේ නරකම තැනක ඉන්න ඉත්තා"}], a: 2 },
      { type: "choice", q: {en:"What is prophylaxis?",si:"ප්‍රොෆිලැක්සිස් (prophylaxis) කියන්නේ මොකක්ද?"}, opts: [{en:"Stopping the opponent's plan before it starts",si:"ප්‍රතිවාදියාගේ සැලැස්ම පටන් ගන්න කලින් නවත්වන එක"},{en:"Attacking the king at once",si:"එකවරම රජුට ප්‍රහාර කරන එක"},{en:"Trading all the pawns",si:"සියලු පෝන් හුවමාරු කරන එක"}], a: 0 },
      { type: "choice", q: {en:"You have no plan. What is the best thing to do?",si:"ඔයාට සැලැස්මක් නෑ. කළ හැකි හොඳම දේ මොකක්ද?"}, opts: [{en:"Make random moves",si:"අහඹු ඇදීම් කරන්න"},{en:"Find the opponent's weakness and aim at it",si:"ප්‍රතිවාදියාගේ දුර්වලකම හොයලා ඒකට ඉලක්ක කරන්න"},{en:"Wait for the opponent to blunder",si:"ප්‍රතිවාදියා වැරදි කරනකල් බලාගෙන ඉන්න"}], a: 1 }
    ]
  };
  window.PQ_PRACTICE = Object.assign(window.PQ_PRACTICE || {}, P);
  window.PQ_MODULES = (window.PQ_MODULES || []).concat([window.PQ_MODULE_15]);
})();
