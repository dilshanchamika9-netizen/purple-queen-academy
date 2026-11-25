/* Purple Queen Chess Academy — Level 3 · Module 4: Game analysis
   Sinhala text and FIDE wording need coach review (Washini). */
(function () {
  const T = (en, si) => ({ en, si });
  const fp = window.PQ_FP;
  window.PQ_MODULE_18 = {
    level: T("Level 3 · Queen", "මට්ටම 3 · රැජින"),
    title: T("Game analysis", "ක්‍රීඩා විශ්ලේෂණය"),
    lessons: [
      { id: "l3-annotation", title: {en:"Annotating your games",si:"ක්‍රීඩා සටහන් කිරීම"}, steps: [
        { text: {en:"After a game, write comments next to the moves. Chess players use short symbols so everyone can read them.",si:"ක්‍රීඩාවකින් පස්සේ ඇදීම් ළඟ අදහස් ලියන්න. චෙස් ක්‍රීඩකයන් කෙටි සංකේත පාවිච්චි කරනවා, එවිට හැමෝටම කියවන්න පුළුවන්."} },
        { text: {en:"! is a good move. !! is an excellent or brilliant move. ? is a mistake. ?? is a blunder, a very bad mistake.",si:"! හොඳ ඇදීමක්. !! විශිෂ්ට නැත්නම් දීප්තිමත් ඇදීමක්. ? වැරැද්දක්. ?? බ්ලන්ඩර් එකක්, ඉතා නරක වැරැද්දක්."} },
        { text: {en:"!? is an interesting move, maybe risky. ?! is a dubious move: playable but questionable.",si:"!? රසවත් ඇදීමක්, සමහරවිට අවදානම් සහිත. ?! සැක සහිත ඇදීමක්: ක්‍රීඩා කරන්න පුළුවන් නමුත් ප්‍රශ්නාර්ථයි."} },
        { text: {en:"Evaluation symbols: = means equal. += means White is slightly better, =+ means Black is slightly better. +- means White is winning, -+ means Black is winning.",si:"ඇගයුම් සංකේත: = සමානයි. += සුදු ටිකක් හොඳයි, =+ කළු ටිකක් හොඳයි. +- සුදු දිනනවා, -+ කළු දිනනවා."} },
        { text: {en:"Write in your own words too: \"I did not see the knight fork\", \"I ran short of time\". Honest notes help you improve.",si:"ඔයාගේම වචන වලිනුත් ලියන්න: \"මම නයිට් ෆෝක් එක දැක්කේ නෑ\", \"මට වෙලාව මදි වුණා\". අවංක සටහන් ඔයාට දියුණු වෙන්න උදව් වෙනවා."} }
      ] },
      { id: "l3-turning-points", title: {en:"Finding the turning point",si:"හැරවුම් ලක්ෂ්‍යය සොයමු"}, steps: [
        { pos: fp("rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR"), text: {en:"A turning point is the move where the game changed: a blunder, a missed chance, or a brilliant idea. Finding it is the most useful part of analysis.",si:"හැරවුම් ලක්ෂ්‍යය (turning point) කියන්නේ ක්‍රීඩාව වෙනස් වුණු ඇදීමයි: බ්ලන්ඩර් එකක්, මග හැරුණු අවස්ථාවක්, නැත්නම් දීප්තිමත් අදහසක්. විශ්ලේෂණයේ වඩාත්ම ප්‍රයෝජනවත් කොටස ඒක හොයාගැනීමයි."} },
        { text: {en:"Look at where the evaluation changed. Go back from the final result and ask: when did I (or my opponent) lose the advantage?",si:"ඇගයුම වෙනස් වුණු තැන බලන්න. අවසාන ප්‍රතිඵලයේ ඉඳන් පස්සට ගිහින් අහන්න: මම (නැත්නම් ප්‍රතිවාදියා) වාසිය නැති කරගත්තේ කවදාද?"} },
        { pos: fp("rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR"), text: {en:"Example: 1.f3 e5 2.g4?? Qh4#. The turning point is 2.g4. It opens the h4-e1 diagonal to the white king and loses at once.",si:"උදාහරණය: 1.f3 e5 2.g4?? Qh4#. හැරවුම් ලක්ෂ්‍යය 2.g4. ඒක සුදු රජුට h4-e1 විකර්ණය විවෘත කරලා එකවරම පරාද වෙනවා."} },
        { text: {en:"Ask also: was there a better move? Was it a tactic I missed, a plan I did not see, or time trouble? Name the cause.",si:"ඒ වගේම අහන්න: වඩා හොඳ ඇදීමක් තිබුණාද? ඒක මට මග හැරුණු උපක්‍රමයක්ද, මට නොපෙනුණු සැලැස්මක්ද, නැත්නම් වෙලාව මදි වීමක්ද? හේතුවට නමක් දෙන්න."} }
      ] },
      { id: "l3-engines", title: {en:"Using an engine correctly",si:"එන්ජිමක් නිවැරදිව පාවිච්චි කරමු"}, steps: [
        { text: {en:"A chess engine is a computer program that plays very strongly. It is excellent for checking your analysis after a game.",si:"චෙස් එන්ජිමක් (engine) කියන්නේ ඉතා ශක්තිමත්ව ක්‍රීඩා කරන පරිගණක වැඩසටහනක්. ක්‍රීඩාවකින් පස්සේ ඔයාගේ විශ්ලේෂණය පරීක්ෂා කරන්න ඒක විශිෂ්ටයි."} },
        { text: {en:"Never use an engine or any outside help during a tournament game. This is cheating and the penalty is severe.",si:"තරඟ ක්‍රීඩාවක් අතරතුර කිසිවිටෙක එන්ජිමක් හෝ වෙනත් පිට උදව්වක් පාවිච්චි කරන්න එපා. ඒක වංචාවක්, දඬුවම බරපතලයි."} },
        { text: {en:"Analyse first on your own. Write down what you think went wrong. Then turn on the engine and compare. This way you train your own brain.",si:"මුලින් තනියම විශ්ලේෂණය කරන්න. වැරදුණා කියලා ඔයා හිතන දේ ලියන්න. ඊට පස්සේ එන්ජිම ක්‍රියාත්මක කරලා සසඳන්න. මේ විදියට ඔයාගේම මොළය පුහුණු වෙනවා."} },
        { text: {en:"The evaluation is in pawns. +1.5 means White is better by about one and a half pawns. -0.8 means Black is slightly better. 0.00 means equal. #3 means mate in 3.",si:"ඇගයුම පෝන් වලින්. +1.5 කියන්නේ සුදු පෝන් එකහමාරකින් විතර ඉදිරියෙන්. -0.8 කළු ටිකක් හොඳයි. 0.00 සමානයි. #3 කියන්නේ ඇදීම් 3කින් මේට්."} },
        { text: {en:"Do not just copy the best move. Look at the line and ask why. If you cannot explain it in words, you have not learned it yet.",si:"හොඳම ඇදීම ඔහේ පිටපත් කරන්න එපා. ඇදීම් පෙළ බලලා ඇයි කියලා අහන්න. වචන වලින් පැහැදිලි කරන්න බැරි නම් ඔයා ඒක තවම ඉගෙනගෙන නෑ."} }
      ] },
      { id: "l3-review", title: {en:"Your review routine",si:"ඔයාගේ සමාලෝචන රටාව"}, steps: [
        { text: {en:"Review every serious game within a day or two, while you still remember what you were thinking.",si:"හැම බරපතල ක්‍රීඩාවක්ම දවසක් දෙකක් ඇතුළත සමාලෝචනය කරන්න, ඔයා හිතපු දේ තාම මතකයේ තියෙද්දී."} },
        { text: {en:"Step 1: replay the game with your scoresheet. Mark the moments where you were unsure, and the moments where the game changed.",si:"පියවර 1: ඔයාගේ ලකුණු පත්‍රය (scoresheet) එක්ක ක්‍රීඩාව නැවත ක්‍රීඩා කරන්න. ඔයාට විශ්වාස නැති තැන් සහ ක්‍රීඩාව වෙනස් වුණු තැන් සලකුණු කරන්න."} },
        { text: {en:"Step 2: find the turning point and name the cause: opening mistake, tactic missed, bad plan, endgame error, or time trouble.",si:"පියවර 2: හැරවුම් ලක්ෂ්‍යය හොයලා හේතුවට නමක් දෙන්න: ආරම්භයේ වැරැද්ද, මග හැරුණු උපක්‍රමය, නරක සැලැස්ම, අවසාන ක්‍රීඩා වැරැද්ද, නැත්නම් වෙලාව මදි වීම."} },
        { text: {en:"Step 3: write one lesson and one training goal. For example: \"Check for enemy forks before every move.\"",si:"පියවර 3: පාඩමක් සහ පුහුණු ඉලක්කයක් ලියන්න. උදාහරණයක්: \"හැම ඇදීමකටම කලින් සතුරු ෆෝක් බලන්න.\""} },
        { text: {en:"Keep a game notebook. After a few weeks you will see your most common mistake. Fix that first, and share your games with your coach.",si:"ක්‍රීඩා සටහන් පොතක් තියාගන්න. සති කිහිපයකට පස්සේ ඔයාගේ වඩාත්ම පොදු වැරැද්ද ඔයාට පේනවා. මුලින් ඒක නිවැරදි කරලා, ඔයාගේ ක්‍රීඩා පුහුණුකරුට පෙන්වන්න."} }
      ] },
    ],
  };
  const P = {
    "l3-annotation": [
      { type: "choice", q: {en:"What does ?? mean next to a move?",si:"ඇදීමක් ළඟ ?? කියන්නේ මොකක්ද?"}, opts: [{en:"A blunder: a very bad mistake",si:"බ්ලන්ඩර් එකක්: ඉතා නරක වැරැද්දක්"},{en:"An excellent move",si:"විශිෂ්ට ඇදීමක්"},{en:"An interesting move",si:"රසවත් ඇදීමක්"}], a: 0 },
      { type: "choice", q: {en:"What does !! mean?",si:"!! කියන්නේ මොකක්ද?"}, opts: [{en:"A blunder",si:"බ්ලන්ඩර් එකක්"},{en:"An excellent or brilliant move",si:"විශිෂ්ට නැත්නම් දීප්තිමත් ඇදීමක්"},{en:"A draw offer",si:"සමාන කරගැනීමේ යෝජනාවක්"}], a: 1 },
      { type: "choice", q: {en:"What does +- mean?",si:"+- කියන්නේ මොකක්ද?"}, opts: [{en:"Black is winning",si:"කළු දිනනවා"},{en:"The position is equal",si:"ස්ථානය සමානයි"},{en:"White is winning",si:"සුදු දිනනවා"}], a: 2 },
      { type: "choice", q: {en:"What does ?! mean?",si:"?! කියන්නේ මොකක්ද?"}, opts: [{en:"A dubious move",si:"සැක සහිත ඇදීමක්"},{en:"A brilliant move",si:"දීප්තිමත් ඇදීමක්"},{en:"A forced move",si:"බලකරන ඇදීමක්"}], a: 0 },
      { type: "choice", q: {en:"What does = mean as an evaluation?",si:"ඇගයුමක් ලෙස = කියන්නේ මොකක්ද?"}, opts: [{en:"White is winning",si:"සුදු දිනනවා"},{en:"The position is equal",si:"ස්ථානය සමානයි"},{en:"Black is better",si:"කළු වඩා හොඳයි"}], a: 1 }
    ],
    "l3-turning-points": [
      { type: "choice", pos: fp("rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR"), q: {en:"1.f3 e5 2.g4?? Qh4#. Which move was the turning point?",si:"1.f3 e5 2.g4?? Qh4#. හැරවුම් ලක්ෂ්‍ය ඇදීම කුමක්ද?"}, opts: [{en:"1.f3",si:"1.f3"},{en:"1...e5",si:"1...e5"},{en:"2.g4",si:"2.g4"}], a: 2 },
      { type: "move", pos: fp("r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR"), q: {en:"Black has just played 3...Nf6?? It is White's turn. Find the winning move.",si:"කළු දැන් 3...Nf6?? ක්‍රීඩා කළා. සුදුගේ වාරයයි. දිනන ඇදීම සොයන්න."}, hint: {en:"The queen can capture on f7 with check.",si:"රැජිනට f7 කපලා චෙක් දෙන්න පුළුවන්."}, ans: [["h5","f7"]] },
      { type: "choice", q: {en:"What is a turning point?",si:"හැරවුම් ලක්ෂ්‍යයක් කියන්නේ මොකක්ද?"}, opts: [{en:"The move where the game changed",si:"ක්‍රීඩාව වෙනස් වුණු ඇදීම"},{en:"The last move of the game",si:"ක්‍රීඩාවේ අවසාන ඇදීම"},{en:"The first move of the game",si:"ක්‍රීඩාවේ පළමු ඇදීම"}], a: 0 },
      { type: "choice", q: {en:"How do you find the turning point?",si:"හැරවුම් ලක්ෂ්‍යය හොයාගන්නේ කොහොමද?"}, opts: [{en:"Count how many moves were played",si:"ඇදපු ඇදීම් ගණන් කරන්න"},{en:"Look back from the result for where the advantage was lost",si:"ප්‍රතිඵලයේ ඉඳන් පස්සට බලලා වාසිය නැති වුණු තැන හොයන්න"},{en:"Look only at the opening",si:"ආරම්භය විතරක් බලන්න"}], a: 1 },
      { type: "choice", q: {en:"After finding a mistake, what should you ask?",si:"වැරැද්දක් හොයාගත්තට පස්සේ අහන්න ඕනේ මොකක්ද?"}, opts: [{en:"Whose fault was the weather?",si:"කාලගුණය කාගේ වරදද?"},{en:"How can I blame the opponent?",si:"ප්‍රතිවාදියාට දොස් කියන්නේ කොහොමද?"},{en:"What caused it: tactic, plan, or time?",si:"හේතුව මොකක්ද: උපක්‍රමයක්ද, සැලැස්මක්ද, වෙලාවද?"}], a: 2 }
    ],
    "l3-engines": [
      { type: "choice", q: {en:"When can you use an engine in a tournament?",si:"තරඟයකදී එන්ජිමක් පාවිච්චි කරන්න පුළුවන් කවදාද?"}, opts: [{en:"Only after the game, never during it",si:"ක්‍රීඩාවෙන් පස්සේ විතරයි, කවදාවත් ක්‍රීඩාව අතරතුර නෙවෙයි"},{en:"When you are losing",si:"ඔයා පරාද වෙනකොට"},{en:"When the opponent leaves the table",si:"ප්‍රතිවාදියා මේසයෙන් අහකට ගියාම"}], a: 0 },
      { type: "choice", q: {en:"What does +1.5 mean?",si:"+1.5 කියන්නේ මොකක්ද?"}, opts: [{en:"Black is better",si:"කළු වඩා හොඳයි"},{en:"White is better by about one and a half pawns",si:"සුදු පෝන් එකහමාරකින් විතර ඉදිරියෙන්"},{en:"White has 1.5 queens",si:"සුදුට රැජින් 1.5ක් තියෙනවා"}], a: 1 },
      { type: "choice", q: {en:"What does #3 mean?",si:"#3 කියන්නේ මොකක්ද?"}, opts: [{en:"Move number 3",si:"ඇදීම් අංක 3"},{en:"Three pieces are attacked",si:"ඉත්තන් තුනකට ප්‍රහාර"},{en:"Mate in 3 moves",si:"ඇදීම් 3කින් මේට්"}], a: 2 },
      { type: "choice", q: {en:"What is the best way to learn from an engine?",si:"එන්ජිමකින් ඉගෙනගන්න හොඳම ක්‍රමය මොකක්ද?"}, opts: [{en:"Analyse yourself first, then compare and ask why",si:"මුලින් ඔයාම විශ්ලේෂණය කරලා, ඊට පස්සේ සසඳලා ඇයි කියලා අහන්න"},{en:"Copy every engine move without thinking",si:"එන්ජිම ඇදීම් හැමදෙයක්ම නොහිතා පිටපත් කරන්න"},{en:"Let it play your games for you",si:"ඔයාගේ ක්‍රීඩා ඔයා වෙනුවට ක්‍රීඩා කරන්න දෙන්න"}], a: 0 },
      { type: "choice", q: {en:"What does 0.00 mean?",si:"0.00 කියන්නේ මොකක්ද?"}, opts: [{en:"Black is winning",si:"කළු දිනනවා"},{en:"The position is equal",si:"ස්ථානය සමානයි"},{en:"The engine has no answer",si:"එන්ජිමට පිළිතුරක් නෑ"}], a: 1 }
    ],
    "l3-review": [
      { type: "choice", q: {en:"When is the best time to review a game?",si:"ක්‍රීඩාවක් සමාලෝචනය කරන හොඳම වෙලාව කවදාද?"}, opts: [{en:"After a year",si:"අවුරුද්දකට පස්සේ"},{en:"Never",si:"කවදාවත් නෑ"},{en:"Within a day or two",si:"දවසක් දෙකක් ඇතුළත"}], a: 2 },
      { type: "choice", q: {en:"Which is a cause you can name for a mistake?",si:"වැරැද්දකට නමක් දෙන්න පුළුවන් හේතුවක් කුමක්ද?"}, opts: [{en:"Missed tactic, bad plan or time trouble",si:"මග හැරුණු උපක්‍රමයක්, නරක සැලැස්මක් හෝ වෙලාව මදි වීමක්"},{en:"Bad luck",si:"අවාසනාව"},{en:"The weather",si:"කාලගුණය"}], a: 0 },
      { type: "choice", q: {en:"What should the review end with?",si:"සමාලෝචනය අවසන් වෙන්න ඕනේ මොකකින්ද?"}, opts: [{en:"A new chess set",si:"අලුත් චෙස් කට්ටලයක්"},{en:"One lesson and one training goal",si:"පාඩමක් සහ පුහුණු ඉලක්කයක්"},{en:"Deleting the game",si:"ක්‍රීඩාව මකා දැමීම"}], a: 1 },
      { type: "choice", q: {en:"What helps you see your most common mistake?",si:"ඔයාගේ වඩාත්ම පොදු වැරැද්ද පේන්න උදව් වෙන්නේ මොකක්ද?"}, opts: [{en:"Playing faster",si:"වේගවත්ව ක්‍රීඩා කිරීම"},{en:"Avoiding strong opponents",si:"ශක්තිමත් ප්‍රතිවාදීන්ව මග හැරීම"},{en:"A notebook of your reviewed games",si:"ඔයා සමාලෝචනය කළ ක්‍රීඩා වල සටහන් පොතක්"}], a: 2 },
      { type: "choice", q: {en:"Why use your scoresheet in a review?",si:"සමාලෝචනයකදී ඔයාගේ ලකුණු පත්‍රය පාවිච්චි කරන්නේ ඇයි?"}, opts: [{en:"It records every move so you can replay the game",si:"ඒකේ හැම ඇදීමක්ම සටහන් වෙලා තියෙන නිසා ක්‍රීඩාව නැවත ක්‍රීඩා කරන්න පුළුවන්"},{en:"The arbiter requires it",si:"ආබිටර්ට ඕනේ නිසා"},{en:"It improves the clock",si:"ඒකෙන් ඔරලෝසුව දියුණු වෙනවා"}], a: 0 }
    ]
  };
  window.PQ_PRACTICE = Object.assign(window.PQ_PRACTICE || {}, P);
  window.PQ_MODULES = (window.PQ_MODULES || []).concat([window.PQ_MODULE_18]);
})();
