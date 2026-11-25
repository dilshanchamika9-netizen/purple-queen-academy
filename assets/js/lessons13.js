/* Purple Queen Chess Academy — Level 2 · Module 6: First rated games
   Rules text based on the FIDE Laws of Chess (Art. 8, 9, 11, 12). Sinhala and the rule wording need review by the arbiter (Washini). */
(function () {
  const T = (en, si) => ({ en, si });
  const fp = window.PQ_FP;
  window.PQ_MODULE_13 = {
    level: T("Level 2 · Knight", "මට්ටම 2 · නයිට්"),
    title: T("First rated games", "පළමු ශ්‍රේණිගත ක්‍රීඩා"),
    lessons: [
      { id: "l2-etiquette", title: {en:"Tournament etiquette",si:"තරඟ ආචාර ධර්ම"}, steps: [
        { text: {en:"Be quiet at the board. Do not talk to your opponent, except to offer a draw, or to say “adjust” before you straighten a piece.",si:"බෝඩ් එක ළඟ නිශ්ශබ්දව ඉන්න. ප්‍රතිවාදියාත් එක්ක කතා කරන්න එපා, ඩ්‍රෝ ඉල්ලන්න හෝ ඉත්තෙක් සෙට් කරන්න කලින් “adjust” කියන්න හැර."} },
        { text: {en:"Switch off your mobile phone before the round. A phone that rings during play can cost you the game.",si:"වටයට කලින් ඔයාගේ ජංගම දුරකථනය ක්‍රියා විරහිත කරන්න. ක්‍රීඩා කරන අතරේ දුරකථනයක් නාද වුණොත් ඔයාට ක්‍රීඩාව නැති වෙන්න පුළුවන්."} },
        { text: {en:"Do not disturb your opponent: no staring, no tapping, no noises. Do not talk about other games near the boards.",si:"ප්‍රතිවාදියාට බාධා කරන්න එපා: ඇස් ගහගෙන බලා ඉන්න, තට්ටු කරන්න, ශබ්ද කරන්න එපා. බෝඩ් ළඟ වෙනත් ක්‍රීඩා ගැන කතා කරන්නත් එපා."} },
        { text: {en:"Shake hands before and after the game. Report the result as your arbiter instructs.",si:"ක්‍රීඩාවට කලින් සහ පසුව අත් සලන්න. ආබිටර් උපදෙස් දෙන ආකාරයට ප්‍රතිඵලය වාර්තා කරන්න."} },
        { text: {en:"If there is a problem, stop the clock and call the arbiter. Never argue with your opponent.",si:"ගැටලුවක් ඇත්නම් ඔරලෝසුව නවත්වලා ආබිටර්ව කතා කරන්න. ප්‍රතිවාදියත් එක්ක කවදාවත් වාද කරන්න එපා."} }
      ] },
      { id: "l2-recording", title: {en:"Recording the moves",si:"ඇදීම් සටහන් කිරීම"}, steps: [
        { text: {en:"In a rated game you must write down the moves of both players in algebraic notation on your scoresheet.",si:"ශ්‍රේණිගත ක්‍රීඩාවක ඔයා ක්‍රීඩකයන් දෙදෙනාගේම ඇදීම් ඇල්ජිබ්‍රික් සටහන් ක්‍රමයෙන් ඔයාගේ ස්කෝර්ෂීට් එකේ ලියන්න ඕන."} },
        { text: {en:"Write each move after it is played, one move after the other. Do not write a move in advance.",si:"හැම ඇදීමක්ම ඇදපු පසු එකින් එක ලියන්න. ඇදීමක් කලින් ලියන්න එපා."} },
        { text: {en:"Use the piece letter and the square: Nf3. Add x for a capture, + for check, # for checkmate, and O-O or O-O-O for castling.",si:"ඉත්තාගේ අකුරත් කොටුවත් භාවිතා කරන්න: Nf3. කැපීමකට x, චෙක් එකකට +, චෙක්මේට් එකට #, කාසලින් වලට O-O හෝ O-O-O එකතු කරන්න."} },
        { text: {en:"Exception: if you have less than five minutes left and no increment of 30 seconds or more, you do not have to record until the end of the period.",si:"ව්‍යතිරේකය: ඔයාට මිනිත්තු පහකට අඩු කාලයක් ඉතිරි වී, තත්පර 30ක් හෝ ඊට වැඩි ඉන්ක්‍රිමන්ට් එකක් නැත්නම්, කාල පරිච්ඡේදය අවසන් වන තුරු සටහන් කරන්න ඕන නෑ."} },
        { text: {en:"Keep your scoresheet. It helps you claim a draw and settle disputes.",si:"ඔයාගේ ස්කෝර්ෂීට් එක තියාගන්න. ඩ්‍රෝ ඉල්ලන්නත් ආරවුල් විසඳන්නත් ඒක උදව් වෙනවා."} }
      ] },
      { id: "l2-claiming-draws", title: {en:"Draws and claims",si:"ඩ්‍රෝ සහ ඉල්ලීම්"}, steps: [
        { text: {en:"Draw by agreement: first make your move, then offer the draw, then press the clock. An offer cannot be taken back. It stays until your opponent answers.",si:"එකඟතාවයෙන් ඩ්‍රෝ: මුලින් ඔයාගේ ඇදීම ඇදෙන්න, ඊට පස්සේ ඩ්‍රෝ ඉල්ලන්න, ඊට පස්සේ ඔරලෝසුව ඔබන්න. ඉල්ලීමක් ආපහු ගන්න බෑ. ප්‍රතිවාදියා පිළිතුරු දෙනකම් ඒක තියෙනවා."} },
        { text: {en:"Threefold repetition: the same position appears three times, with the same player to move. You claim it on your own turn by stopping the clock and calling the arbiter.",si:"තුන් වතාවක් පුනරාවර්තනය: එකම ඉත්තන් පිහිටීම තුන් වතාවක් ඇති වෙනවා, ඇදෙන්න ඕන එකම ක්‍රීඩකයා සමඟ. ඔයාගේම වාරයේදී ඔරලෝසුව නවත්වලා ආබිටර්ව කතා කරලා ඒක ඉල්ලන්න ඕන."} },
        { text: {en:"50-move rule: 50 moves by each player with no pawn move and no capture. You claim it in the same way.",si:"ඇදීම් 50ක රීතිය: පෝන් ඇදීමක් හෝ කැපීමක් නැතිව හැම ක්‍රීඩකයෙක්ම ඇදීම් 50ක් ඇදීම. ඒකත් ඒ ආකාරයෙන්ම ඉල්ලන්න."} },
        { text: {en:"Fivefold repetition, and 75 moves by each player with no pawn move or capture, are draws automatically. No claim is needed.",si:"පස් වතාවක් පුනරාවර්තනය වීමත්, පෝන් ඇදීමක් හෝ කැපීමක් නැතිව හැම ක්‍රීඩකයෙක්ම ඇදීම් 75ක් ඇදීමත් ස්වයංක්‍රීයව ඩ්‍රෝ වෙනවා. ඉල්ලන්න ඕන නෑ."} },
        { text: {en:"If you claim wrongly, the arbiter can penalise you, for example with extra time for your opponent. Be sure before you claim.",si:"ඔයා වැරදියට ඉල්ලුවොත් ආබිටර්ට ඔයාට දඩුවම් කරන්න පුළුවන්, උදා ප්‍රතිවාදියාට අමතර කාලයක්. ඉල්ලන්න කලින් විශ්වාසයි කියලා තහවුරු කරගන්න."} }
      ] },
      { id: "l2-arbiter", title: {en:"What the arbiter does",si:"ආබිටර් කරන්නේ මොකද්ද"}, steps: [
        { text: {en:"The arbiter is the referee of the tournament. The arbiter makes sure the Laws of Chess are followed and the event is fair.",si:"ආබිටර් කියන්නේ තරඟයේ විනිසුරුවරයා. චෙස් නීති පිළිපදිනවාද, තරඟය සාධාරණද කියලා ආබිටර් බලනවා."} },
        { text: {en:"The arbiter watches the games, answers questions about the rules, and decides disputes.",si:"ආබිටර් ක්‍රීඩා නිරීක්ෂණය කරනවා, නීති ගැන ප්‍රශ්න වලට පිළිතුරු දෙනවා, ආරවුල් විසඳනවා."} },
        { text: {en:"If you need help, stop the clock and raise your hand. Do not argue with your opponent.",si:"ඔයාට උදව්වක් ඕන නම් ඔරලෝසුව නවත්වලා අත උස්සන්න. ප්‍රතිවාදියාත් එක්ක වාද කරන්න එපා."} },
        { text: {en:"The arbiter can give penalties, from a warning or extra time for the opponent, up to losing the game for serious breaches.",si:"ආබිටර්ට දඩුවම් දෙන්න පුළුවන්, අවවාදයක් හෝ ප්‍රතිවාදියාට අමතර කාලයක් ඉඳලා බරපතල උල්ලංඝනයන් වලට ක්‍රීඩාව පරාද කරන තෙක්."} },
        { text: {en:"You can respectfully appeal an arbiter’s decision to the appeals committee, within the time the organiser sets.",si:"ආබිටර්ගේ තීරණයක් ගැන ඔයාට ගෞරවයෙන් අභියාචනා කමිටුවට අභියාචනා කරන්න පුළුවන්, සංවිධායකයා නියම කරන කාලය ඇතුළත."} }
      ] },
    ],
  };
  const P = {
    "l2-etiquette": [
      { type: "choice", q: {en:"Your phone rings during play. What can happen?",si:"ක්‍රීඩා කරන අතරේ ඔයාගේ දුරකථනය නාද වෙනවා. සිදු විය හැක්කේ මොකද්ද?"}, opts: [{en:"Nothing at all",si:"කිසිවක් සිදු වෙන්නේ නෑ"},{en:"Your opponent loses time",si:"ප්‍රතිවාදියාට කාලය නැති වෙනවා"},{en:"You can lose the game",si:"ඔයාට ක්‍රීඩාව නැති වෙන්න පුළුවන්"}], a: 2 },
      { type: "choice", q: {en:"You have a dispute with your opponent. Who do you call?",si:"ප්‍රතිවාදියත් එක්ක ආරවුලක් ඇතිවුණා. ඔයා කතා කරන්නේ කාවද?"}, opts: [{en:"The arbiter",si:"ආබිටර්"},{en:"A friend in the hall",si:"ශාලාවේ යාළුවෙකු"},{en:"Your opponent’s parent",si:"ප්‍රතිවාදියාගේ දෙමාපියන්"}], a: 0 },
      { type: "choice", q: {en:"You want to straighten a piece on its square. What do you say first?",si:"ඉත්තෙක් එහි කොටුවේ කෙළින් කරන්න ඕන. මුලින් කියන්නේ මොකද්ද?"}, opts: [{en:"“Sorry”",si:"“Sorry”"},{en:"“Adjust”",si:"“Adjust”"},{en:"“Check”",si:"“Check”"}], a: 1 },
      { type: "choice", q: {en:"May you chat with your opponent during the game?",si:"ක්‍රීඩාව අතරේ ප්‍රතිවාදියාත් එක්ක කතා කරන්න පුළුවන්ද?"}, opts: [{en:"Yes, all the time",si:"ඔව්, හැමවිටම"},{en:"Only if you are winning",si:"දිනනවා නම් විතරයි"},{en:"No, except to offer a draw or say “adjust”",si:"නෑ, ඩ්‍රෝ ඉල්ලන්න හෝ “adjust” කියන්න හැර"}], a: 2 },
      { type: "choice", q: {en:"When must your phone be switched off?",si:"ඔයාගේ දුරකථනය ක්‍රියා විරහිත කළ යුත්තේ කවදාද?"}, opts: [{en:"Before the round starts",si:"වටය පටන් ගන්න කලින්"},{en:"After you win",si:"ඔයා දිනපු පසු"},{en:"Never",si:"කවදාවත් නෑ"}], a: 0 }
    ],
    "l2-recording": [
      { type: "choice", q: {en:"When should you write your move?",si:"ඔයාගේ ඇදීම ලියන්න ඕන කවදාද?"}, opts: [{en:"Before you play it",si:"ඇදීමට කලින්"},{en:"After you have played it",si:"ඇදපු පසු"},{en:"Only at the end of the game",si:"ක්‍රීඩාව අවසානයේ විතරයි"}], a: 1 },
      { type: "choice", q: {en:"How do you write a knight moving to f3?",si:"f3 ට යන නයිට් එකක් ලියන්නේ කොහොමද?"}, opts: [{en:"Kf3",si:"Kf3"},{en:"Hf3",si:"Hf3"},{en:"Nf3",si:"Nf3"}], a: 2 },
      { type: "choice", q: {en:"Which symbol means checkmate?",si:"චෙක්මේට් එක කියන්නේ කුමන සංකේතයද?"}, opts: [{en:"#",si:"#"},{en:"+",si:"+"},{en:"x",si:"x"}], a: 0 },
      { type: "choice", q: {en:"When do you not have to record the moves?",si:"ඇදීම් සටහන් කරන්න ඕන නැත්තේ කවදාද?"}, opts: [{en:"When you are winning",si:"ඔයා දිනනවා නම්"},{en:"With under five minutes and no 30-second increment",si:"මිනිත්තු පහකට අඩුවෙලා තත්පර 30 ඉන්ක්‍රිමන්ට් එකක් නැති විට"},{en:"When the arbiter looks away",si:"ආබිටර් වෙන පැත්තකට බලාගෙන ඉන්නකොට"}], a: 1 },
      { type: "choice", q: {en:"Why keep a scoresheet?",si:"ස්කෝර්ෂීට් එකක් තියාගන්නේ ඇයි?"}, opts: [{en:"It gives you extra time",si:"ඒකෙන් අමතර කාලය ලැබෙනවා"},{en:"It is only for the coach",si:"ඒක කෝච් ට විතරයි"},{en:"It helps with draw claims and disputes",si:"ඩ්‍රෝ ඉල්ලීම් වලටයි ආරවුල් වලටයි උදව් වෙනවා"}], a: 2 }
    ],
    "l2-claiming-draws": [
      { type: "choice", q: {en:"When do you offer a draw?",si:"ඩ්‍රෝ ඉල්ලන්නේ කවදාද?"}, opts: [{en:"After making your move, before pressing the clock",si:"ඇදීම ඇදපු පසු, ඔරලෝසුව ඔබන්න කලින්"},{en:"Before making your move",si:"ඇදීම ඇදෙන්න කලින්"},{en:"After pressing the clock",si:"ඔරලෝසුව ඔබපු පසු"}], a: 0 },
      { type: "choice", q: {en:"How do you claim a threefold repetition?",si:"තුන් වතාවක් පුනරාවර්තනය ඉල්ලන්නේ කොහොමද?"}, opts: [{en:"Shout across the hall",si:"ශාලාව පුරා කෑගහන්න"},{en:"On your turn, stop the clock and call the arbiter",si:"ඔයාගේ වාරයේදී ඔරලෝසුව නවත්වලා ආබිටර්ව කතා කරන්න"},{en:"You do not need to; it is never a draw",si:"ඕන නෑ; ඒක කවදාවත් ඩ්‍රෝ එකක් නෙමෙයි"}], a: 1 },
      { type: "choice", q: {en:"How many moves by each player without a pawn move or capture allow a 50-move claim?",si:"පෝන් ඇදීමක් හෝ කැපීමක් නැතිව හැම ක්‍රීඩකයෙක්ම ඇදීම් කීයක් ඇදුවාම ඇදීම් 50ක රීතියෙන් ඉල්ලන්න පුළුවන්ද?"}, opts: [{en:"30",si:"30"},{en:"100",si:"100"},{en:"50",si:"50"}], a: 2 },
      { type: "choice", q: {en:"Fivefold repetition is:",si:"පස් වතාවක් පුනරාවර්තනය කියන්නේ:"}, opts: [{en:"An automatic draw",si:"ස්වයංක්‍රීය ඩ්‍රෝ එකක්"},{en:"A win for the player who started it",si:"එය පටන් ගත් ක්‍රීඩකයාට ජයක්"},{en:"Not allowed",si:"අවසර නෑ"}], a: 0 },
      { type: "choice", q: {en:"After you offer a draw, can you take the offer back?",si:"ඔයා ඩ්‍රෝ ඉල්ලපු පසු, ඒ ඉල්ලීම ආපහු ගන්න පුළුවන්ද?"}, opts: [{en:"Yes, at any time",si:"ඔව්, ඕනෑම වෙලාවක"},{en:"No, it stays until your opponent answers",si:"නෑ, ප්‍රතිවාදියා පිළිතුරු දෙනකම් ඒක තියෙනවා"},{en:"Yes, if you have more time",si:"ඔව්, ඔයාට වැඩි කාලයක් ඇත්නම්"}], a: 1 }
    ],
    "l2-arbiter": [
      { type: "choice", q: {en:"Who makes sure the Laws of Chess are followed?",si:"චෙස් නීති පිළිපදිනවාද කියලා බලන්නේ කවුද?"}, opts: [{en:"The strongest player",si:"ශක්තිමත්ම ක්‍රීඩකයා"},{en:"The parents",si:"දෙමාපියන්"},{en:"The arbiter",si:"ආබිටර්"}], a: 2 },
      { type: "choice", q: {en:"You think your opponent broke a rule. What do you do?",si:"ප්‍රතිවාදියා නීතියක් කඩ කළා කියලා ඔයා හිතනවා. ඔයා කරන්නේ මොකද්ද?"}, opts: [{en:"Stop the clock and call the arbiter",si:"ඔරලෝසුව නවත්වලා ආබිටර්ව කතා කරන්න"},{en:"Argue with your opponent",si:"ප්‍රතිවාදියත් එක්ක වාද කරන්න"},{en:"Leave the hall",si:"ශාලාවෙන් පිටවෙන්න"}], a: 0 },
      { type: "choice", q: {en:"Which is a possible penalty from an arbiter?",si:"ආබිටර් දෙන්න පුළුවන් දඩුවමක් කුමක්ද?"}, opts: [{en:"A free pawn",si:"නොමිලේ පෝන් එකක්"},{en:"Extra time for the opponent",si:"ප්‍රතිවාදියාට අමතර කාලයක්"},{en:"A bigger board",si:"විශාල බෝඩ් එකක්"}], a: 1 },
      { type: "choice", q: {en:"What can you do if you disagree with the arbiter’s decision?",si:"ආබිටර්ගේ තීරණයට ඔයා එකඟ නැත්නම් ඔයාට කළ හැක්කේ මොකද්ද?"}, opts: [{en:"Ignore the decision",si:"තීරණය නොසලකා හරින්න"},{en:"Shout at the arbiter",si:"ආබිටර්ට කෑ ගහන්න"},{en:"Respectfully appeal to the appeals committee",si:"අභියාචනා කමිටුවට ගෞරවයෙන් අභියාචනා කරන්න"}], a: 2 },
      { type: "choice", q: {en:"What does the arbiter do during the round?",si:"වටය අතරතුර ආබිටර් කරන්නේ මොකද්ද?"}, opts: [{en:"Watches the games and decides disputes",si:"ක්‍රීඩා නිරීක්ෂණය කර ආරවුල් විසඳනවා"},{en:"Plays for one of the players",si:"ක්‍රීඩකයෙකු වෙනුවෙන් ක්‍රීඩා කරනවා"},{en:"Gives hints about the best moves",si:"හොඳම ඇදීම් ගැන ඉඟි දෙනවා"}], a: 0 }
    ]
  };
  window.PQ_PRACTICE = Object.assign(window.PQ_PRACTICE || {}, P);
  window.PQ_MODULES = (window.PQ_MODULES || []).concat([window.PQ_MODULE_13]);
})();
