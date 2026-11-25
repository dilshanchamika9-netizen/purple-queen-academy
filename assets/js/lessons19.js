/* Purple Queen Chess Academy — Level 3 · Module 5: Arbiter rules for competition
   FIDE wording must be checked by Washini (International Arbiter) before publishing. Sinhala text and FIDE wording need coach review (Washini). */
(function () {
  const T = (en, si) => ({ en, si });
  const fp = window.PQ_FP;
  window.PQ_MODULE_19 = {
    level: T("Level 3 · Queen", "මට්ටම 3 · රැජින"),
    title: T("Arbiter rules for competition", "තරඟ සඳහා ආබිටර් නීති"),
    lessons: [
      { id: "l3-appeals", title: {en:"Disputes and appeals",si:"ආරවුල් සහ අභියාචනා"}, steps: [
        { text: {en:"If you think your opponent broke a rule, do not argue and do not touch the pieces. Stop the clock if the Laws say so, and call the arbiter.",si:"ප්‍රතිවාදියා නීතියක් කඩ කළා කියලා ඔයා හිතනවා නම් තර්ක කරන්න එපා, ඉත්තන්ට අත ගහන්න එපා. නීති වලින් කියනවා නම් ඔරලෝසුව නවත්වලා ආබිටර්ව කතා කරන්න."} },
        { text: {en:"Tell the arbiter what happened, calmly and briefly. Let your opponent explain too. The arbiter decides according to the Laws of Chess.",si:"ඇති වුණු දේ ආබිටර්ට සන්සුන්ව සහ කෙටියෙන් කියන්න. ඔයාගේ ප්‍රතිවාදියාටත් පැහැදිලි කරන්න ඉඩ දෙන්න. ආබිටර් චෙස් නීති අනුව තීරණය කරනවා."} },
        { text: {en:"If you disagree with the decision, accept it for now, keep playing, and appeal after the game. Never refuse to continue.",si:"තීරණයට ඔයා එකඟ නැත්නම් දැනට ඒක පිළිගෙන ක්‍රීඩාව දිගටම කරගෙන ගිහින් ක්‍රීඩාවෙන් පස්සේ අභියාචනා කරන්න. දිගටම ක්‍රීඩා කරන්න බැහැ කියන්න එපා."} },
        { text: {en:"An appeal normally goes to an appeals committee. It is usually in writing, within a time limit set by the organiser, and may need a fee that is returned if you win.",si:"අභියාචනාවක් සාමාන්‍යයෙන් අභියාචනා කමිටුවකට (appeals committee) යනවා. ඒක සාමාන්‍යයෙන් ලිඛිතව, සංවිධායකයා තීරණය කරන කාල සීමාවක් ඇතුළත, ගාස්තුවක් සමඟ, ඔයා දිනුවොත් ආපසු ලැබෙන ගාස්තුවක්."} },
        { text: {en:"Always respect the arbiter and the committee. Good sportsmanship is part of being a champion.",si:"ආබිටර්ට සහ කමිටුවට හැමවිටම ගරු කරන්න. හොඳ ක්‍රීඩා ගුණය කොටසක් චැම්පියන් කෙනෙකු වීමේ."} }
      ] },
      { id: "l3-devices", title: {en:"Electronic devices",si:"ඉලෙක්ට්‍රොනික උපාංග"}, steps: [
        { text: {en:"Electronic devices can be used to cheat, so the Laws of Chess control them strictly.",si:"ඉලෙක්ට්‍රොනික උපාංග වංචා කරන්න පාවිච්චි කරන්න පුළුවන්, ඒ නිසා චෙස් නීති ඒවා තදින් පාලනය කරනවා."} },
        { text: {en:"Mobile phones and other electronic means of communication are not allowed in the playing venue unless they are completely switched off, or the arbiter gives permission.",si:"ජංගම දුරකථන සහ වෙනත් ඉලෙක්ට්‍රොනික සන්නිවේදන උපාංග ක්‍රීඩා ස්ථානයේ අවසර නැත, ඒවා සම්පූර්ණයෙන්ම ක්‍රියා විරහිත කරලා නැත්නම්, නැත්නම් ආබිටර් අවසර දුන්නා නම් විතරයි."} },
        { text: {en:"Switch the phone off completely before the round and keep it in your bag. Silent mode is not enough.",si:"වටයට කලින් දුරකථනය සම්පූර්ණයෙන්ම ක්‍රියා විරහිත කරලා ඔයාගේ බෑග් එකේ තියන්න. නිශ්ශබ්ද ක්‍රමය (silent) ප්‍රමාණවත් නෑ."} },
        { text: {en:"If a device rings or is found during play, the arbiter can give a penalty, which can be the loss of the game.",si:"ක්‍රීඩාව අතරතුර උපාංගයක් නාද වුණොත් හෝ හොයාගත්තොත් ආබිටර්ට දඬුවමක් දෙන්න පුළුවන්, ඒක ක්‍රීඩාව පරාද වීම වෙන්න පුළුවන්."} },
        { text: {en:"The arbiter may ask to inspect your belongings. Cooperate politely. Refusing can also lead to a penalty.",si:"ආබිටර් ඔයාගේ බඩු පරීක්ෂා කරන්න ඉල්ලන්න පුළුවන්. ආචාරශීලීව සහයෝගය දෙන්න. ප්‍රතික්ෂේප කිරීමත් දඬුවමකට හේතු වෙන්න පුළුවන්."} }
      ] },
      { id: "l3-fair-play", title: {en:"Fair play",si:"සාධාරණ ක්‍රීඩාව"}, steps: [
        { text: {en:"Fair play means every player wins or loses by their own thinking. Nobody may help you during your game.",si:"සාධාරණ ක්‍රීඩාව (fair play) කියන්නේ හැම ක්‍රීඩකයෙක්ම දිනන හෝ පරාද වෙන්නේ තමන්ගේම හිතීමෙන් කියන එකයි. ඔයාගේ ක්‍රීඩාව අතරතුර ඔයාට කවුරුවත් උදව් කරන්න බෑ."} },
        { text: {en:"You may not get advice from anyone: a coach, a parent, a friend or a spectator. You may not use notes, books or an engine during your game.",si:"ඔයාට කිසිවෙකුගෙන් උපදෙස් ගන්න බෑ: පුහුණුකරුවෙක්, දෙමාපියෙක්, මිතුරෙක් හෝ ප්‍රේක්ෂකයෙක්. ඔයාගේ ක්‍රීඩාව අතරතුර සටහන්, පොත් හෝ එන්ජිමක් පාවිච්චි කරන්න බෑ."} },
        { text: {en:"You also may not leave the playing area without the arbiter's permission. Ask first if you need the toilet.",si:"අනිත් අතට ආබිටර්ගේ අවසරයක් නැතුව ක්‍රීඩා ප්‍රදේශයෙන් පිටවෙන්නත් බෑ. වැසිකිළියට යන්න ඕනේ නම් මුලින් අහන්න."} },
        { text: {en:"Spectators and parents must stay silent and must not show moves or reactions. A player's game must not be disturbed.",si:"ප්‍රේක්ෂකයන් සහ දෙමාපියන් නිශ්ශබ්දව ඉන්න ඕනේ, ඇදීම් හෝ ප්‍රතිචාර පෙන්වන්න හොඳ නෑ. ක්‍රීඩකයෙකුගේ ක්‍රීඩාවට බාධා කරන්න හොඳ නෑ."} },
        { text: {en:"Cheating harms everyone. A player caught cheating can be disqualified and banned. Honest losses teach you more than dishonest wins.",si:"වංචාව හැමෝටම හානි කරනවා. වංචාවකට අහුවෙන ක්‍රීඩකයෙකුව ප්‍රතික්ෂේප කරන්න සහ තහනම් කරන්න පුළුවන්. අවංක පරාජයන් අවංක නොවන ජයග්‍රහණවලට වඩා ඔයාට ඉගැන්වෙනවා."} }
      ] },
      { id: "l3-tiebreaks", title: {en:"Scoring and tiebreaks",si:"ලකුණු දීම සහ ටයි-බ්‍රේක්"}, steps: [
        { text: {en:"A win scores 1 point, a draw scores half a point (½), a loss scores 0. The player with the most points wins the tournament.",si:"ජයක් ලකුණු 1ක්, සමානයක් ලකුණු අඩක් (½), පරාජයක් ලකුණු 0. වැඩිම ලකුණු ඇති ක්‍රීඩකයා තරඟය දිනනවා."} },
        { text: {en:"When players have the same score, tiebreaks decide the order. The organiser announces the tiebreaks before the tournament starts.",si:"ක්‍රීඩකයන්ට සමාන ලකුණු තියෙද්දී ටයි-බ්‍රේක් (tiebreaks) මගින් පිළිවෙල තීරණය කරනවා. තරඟය පටන් ගන්න කලින් සංවිධායකයා ටයි-බ්‍රේක් ප්‍රකාශ කරනවා."} },
        { text: {en:"Buchholz: the sum of the final scores of all the opponents you played. A higher number means you met stronger opponents.",si:"බුක්හෝල්ස් (Buchholz): ඔයා සමඟ ක්‍රීඩා කළ සියලුම ප්‍රතිවාදීන්ගේ අවසාන ලකුණු එකතුව. වැඩි අගයක් කියන්නේ ඔයා ශක්තිමත් ප්‍රතිවාදීන් හමු වුණා කියලා."} },
        { text: {en:"Sonneborn-Berger: the final scores of the opponents you beat, plus half the final scores of the opponents you drew with.",si:"සොනෙබෝන්-බර්ගර් (Sonneborn-Berger): ඔයා පරාද කළ ප්‍රතිවාදීන්ගේ අවසාන ලකුණු, ඔයා සමාන වුණු ප්‍රතිවාදීන්ගේ අවසාන ලකුණු වලින් අඩක් එක්ක එකතු කරලා."} },
        { text: {en:"Other common tiebreaks: the result of the direct encounter between the tied players, and the number of wins. Always read the tournament rules.",si:"වෙනත් පොදු ටයි-බ්‍රේක්: සමාන ලකුණු ඇති ක්‍රීඩකයන් අතර ඍජු ගැටුමේ ප්‍රතිඵලය, සහ ජයග්‍රහණ ගණන. තරඟ නීති හැමවිටම කියවන්න."} }
      ] },
      { id: "l3-swiss", title: {en:"Swiss pairings and round-robin",si:"ස්විස් සහ රවුන්ඩ්-රොබින්"}, steps: [
        { text: {en:"In a round-robin every player plays every other player. With n players you need n − 1 rounds. 8 players need 7 rounds.",si:"රවුන්ඩ්-රොබින් (round-robin) එකක හැම ක්‍රීඩකයෙක්ම අනිත් හැමෝම එක්ක ක්‍රීඩා කරනවා. ක්‍රීඩකයන් n දෙනෙකුට වටයන් n − 1ක් ඕනේ. ක්‍රීඩකයන් 8 දෙනෙකුට වටයන් 7ක්."} },
        { text: {en:"A Swiss tournament is for many players and few rounds. Nobody is knocked out. Each round, players with the same score are paired against each other.",si:"ස්විස් තරඟයක් (Swiss) ක්‍රීඩකයන් ගොඩක් සහ වටයන් ස්වල්පයක් සඳහායි. කිසිවෙකු ඉවත් වෙන්නේ නෑ. හැම වටයකම එකම ලකුණු ඇති ක්‍රීඩකයන් එකිනෙකා එක්ක ක්‍රීඩා කරනවා."} },
        { text: {en:"Two players never meet twice in a Swiss. Pairings try to give every player an equal number of White and Black games, and no one gets the same colour three times in a row.",si:"ස්විස් එකක ක්‍රීඩකයන් දෙදෙනෙක් දෙපාරක් හමු වෙන්නේ නෑ. පෙළගැස්වීම් වලින් හැම ක්‍රීඩකයෙකුටම සුදු සහ කළු ක්‍රීඩා සමාන ගණනක් දෙන්න උත්සාහ කරනවා, කිසිවෙකුට එකම පාට පිළිවෙලින් තුන් වතාවක් ලැබෙන්නේ නෑ."} },
        { text: {en:"After round 1, winners play winners and losers play losers. Over the rounds, strong players meet each other and the standings become clear.",si:"පළමු වටයෙන් පස්සේ දිනපු අය දිනපු අය එක්ක, පරාද වුණු අය පරාද වුණු අය එක්ක ක්‍රීඩා කරනවා. වටයන් යනකොට ශක්තිමත් ක්‍රීඩකයන් එකිනෙකා හමු වෙලා ස්ථාන පැහැදිලි වෙනවා."} },
        { text: {en:"A bye means you have no opponent in a round (when the number of players is odd). A bye is usually scored as a point or a half point, as the rules state.",si:"බයි (bye) කියන්නේ ක්‍රීඩකයන් ගණන ඔත්තේ නම් වටයක ඔයාට ප්‍රතිවාදියෙක් නැති වීමයි. නීතිවල සඳහන් පරිදි බයි එකකට සාමාන්‍යයෙන් ලකුණු එකක් හෝ අඩක් ලැබෙනවා."} }
      ] },
    ],
  };
  const P = {
    "l3-appeals": [
      { type: "choice", q: {en:"You think your opponent broke a rule. What do you do first?",si:"ප්‍රතිවාදියා නීතියක් කඩ කළා කියලා ඔයා හිතනවා. මුලින්ම කරන්නේ මොකක්ද?"}, opts: [{en:"Call the arbiter",si:"ආබිටර්ව කතා කරන්න"},{en:"Argue with the opponent",si:"ප්‍රතිවාදියා එක්ක තර්ක කරන්න"},{en:"Leave the board",si:"බෝඩ් එකෙන් පිටවෙන්න"}], a: 0 },
      { type: "choice", q: {en:"Who decides a dispute during a game?",si:"ක්‍රීඩාවක් අතරතුර ආරවුලක් තීරණය කරන්නේ කවුද?"}, opts: [{en:"The stronger player",si:"ශක්තිමත් ක්‍රීඩකයා"},{en:"The arbiter",si:"ආබිටර්"},{en:"The spectators",si:"ප්‍රේක්ෂකයන්"}], a: 1 },
      { type: "choice", q: {en:"You disagree with the arbiter's decision. What should you do?",si:"ආබිටර්ගේ තීරණයට ඔයා එකඟ නෑ. ඔයා කළ යුත්තේ මොකක්ද?"}, opts: [{en:"Stop playing",si:"ක්‍රීඩා කිරීම නවත්වන්න"},{en:"Shout at the arbiter",si:"ආබිටර්ට කෑගහන්න"},{en:"Keep playing and appeal after the game",si:"ක්‍රීඩාව දිගටම කරලා ක්‍රීඩාවෙන් පස්සේ අභියාචනා කරන්න"}], a: 2 },
      { type: "choice", q: {en:"Who hears an appeal?",si:"අභියාචනයක් අහන්නේ කවුද?"}, opts: [{en:"The appeals committee",si:"අභියාචනා කමිටුව"},{en:"Your opponent",si:"ඔයාගේ ප්‍රතිවාදියා"},{en:"Your coach",si:"ඔයාගේ පුහුණුකරු"}], a: 0 },
      { type: "choice", q: {en:"Who sets the time limit for an appeal?",si:"අභියාචනයක් සඳහා කාල සීමාව තීරණය කරන්නේ කවුද?"}, opts: [{en:"The winner of the game",si:"ක්‍රීඩාව දිනපු කෙනා"},{en:"The organiser",si:"සංවිධායකයා"},{en:"Nobody, there is no limit",si:"කවුරුවත් නෑ, සීමාවක් නෑ"}], a: 1 }
    ],
    "l3-devices": [
      { type: "choice", q: {en:"When is a mobile phone allowed in the playing venue?",si:"ක්‍රීඩා ස්ථානයේ ජංගම දුරකථනයක් අවසර ඇත්තේ කවදාද?"}, opts: [{en:"When it is on silent",si:"නිශ්ශබ්ද ක්‍රමයේ ඇති විට"},{en:"Always",si:"හැමවිටම"},{en:"When it is completely switched off or the arbiter permits",si:"සම්පූර්ණයෙන්ම ක්‍රියා විරහිත කළ විට හෝ ආබිටර් අවසර දුන් විට"}], a: 2 },
      { type: "choice", q: {en:"Your phone is on silent in your pocket. Is that fine?",si:"ඔයාගේ දුරකථනය නිශ්ශබ්ද ක්‍රමයේ සාක්කුවේ තියෙනවා. ඒක ඉවසන්න පුළුවන්ද?"}, opts: [{en:"No: it must be completely switched off",si:"නෑ: ඒක සම්පූර්ණයෙන්ම ක්‍රියා විරහිත කරන්න ඕනේ"},{en:"Yes",si:"ඔව්"},{en:"Yes, if it is a small phone",si:"ඔව්, පොඩි දුරකථනයක් නම්"}], a: 0 },
      { type: "choice", q: {en:"What can happen if your phone rings during play?",si:"ක්‍රීඩාව අතරතුර ඔයාගේ දුරකථනය නාද වුණොත් මොකද වෙන්නේ?"}, opts: [{en:"Nothing",si:"කිසිවක් නෑ"},{en:"The arbiter can penalise you, even with a loss of the game",si:"ආබිටර්ට ඔයාට දඬුවම් දෙන්න පුළුවන්, ක්‍රීඩාව පරාද වීමත් පවා"},{en:"Your opponent must pay",si:"ඔයාගේ ප්‍රතිවාදියා ගෙවන්න ඕනේ"}], a: 1 },
      { type: "choice", q: {en:"The arbiter asks to inspect your bag. What do you do?",si:"ආබිටර් ඔයාගේ බෑග් එක පරීක්ෂා කරන්න ඉල්ලනවා. ඔයා කරන්නේ මොකක්ද?"}, opts: [{en:"Refuse",si:"ප්‍රතික්ෂේප කරන්න"},{en:"Run away",si:"ඉවතට දුවන්න"},{en:"Cooperate politely",si:"ආචාරශීලීව සහයෝගය දෙන්න"}], a: 2 },
      { type: "choice", q: {en:"Where should a switched-off phone be kept?",si:"ක්‍රියා විරහිත කළ දුරකථනය තියාගන්න ඕනේ කොහේද?"}, opts: [{en:"In your bag",si:"ඔයාගේ බෑග් එකේ"},{en:"On the board",si:"බෝඩ් එක උඩ"},{en:"Next to the clock",si:"ඔරලෝසුව ළඟ"}], a: 0 }
    ],
    "l3-fair-play": [
      { type: "choice", q: {en:"Your coach whispers a move suggestion during your game. Is that allowed?",si:"ඔයාගේ ක්‍රීඩාව අතරතුර ඔයාගේ පුහුණුකරු ඇදීමක් කොඳුරනවා. ඒක අවසරද?"}, opts: [{en:"Yes",si:"ඔව්"},{en:"No: nobody may advise you during the game",si:"නෑ: ක්‍රීඩාව අතරතුර ඔයාට කවුරුවත් උපදෙස් දෙන්න බෑ"},{en:"Yes, if the coach is an arbiter",si:"ඔව්, පුහුණුකරු ආබිටර් කෙනෙක් නම්"}], a: 1 },
      { type: "choice", q: {en:"You need the toilet during your game. What do you do?",si:"ඔයාගේ ක්‍රීඩාව අතරතුර ඔයාට වැසිකිළියට යන්න ඕනේ. ඔයා කරන්නේ මොකක්ද?"}, opts: [{en:"Just leave",si:"සරලවම යන්න"},{en:"Ask your opponent only",si:"ප්‍රතිවාදියාගෙන් විතරක් අහන්න"},{en:"Ask the arbiter for permission",si:"ආබිටර්ගෙන් අවසර ඉල්ලන්න"}], a: 2 },
      { type: "choice", q: {en:"May you look at notes during your game?",si:"ඔයාගේ ක්‍රීඩාව අතරතුර සටහන් බලන්න පුළුවන්ද?"}, opts: [{en:"No",si:"නෑ"},{en:"Yes, if they are your own",si:"ඔව්, ඒවා ඔයාගේම නම්"},{en:"Yes, for the opening",si:"ඔව්, ආරම්භය සඳහා"}], a: 0 },
      { type: "choice", q: {en:"What can happen to a player who cheats?",si:"වංචා කරන ක්‍රීඩකයෙකුට මොකද වෙන්න පුළුවන්ද?"}, opts: [{en:"A prize",si:"ත්‍යාගයක්"},{en:"Disqualification or a ban",si:"ප්‍රතික්ෂේප කිරීමක් හෝ තහනමක්"},{en:"Nothing",si:"කිසිවක් නෑ"}], a: 1 },
      { type: "choice", q: {en:"What should spectators do during games?",si:"ක්‍රීඩා අතරතුර ප්‍රේක්ෂකයන් කළ යුත්තේ මොකක්ද?"}, opts: [{en:"Tell the players the best move",si:"ක්‍රීඩකයන්ට හොඳම ඇදීම කියන්න"},{en:"Talk loudly",si:"හයියෙන් කතා කරන්න"},{en:"Stay silent and not disturb the players",si:"නිශ්ශබ්දව ඉඳලා ක්‍රීඩකයන්ට බාධා නොකරන්න"}], a: 2 }
    ],
    "l3-tiebreaks": [
      { type: "choice", q: {en:"A player wins 3 games, draws 2 and loses 1. How many points?",si:"ක්‍රීඩකයෙක් ක්‍රීඩා 3ක් දිනලා, 2ක් සමාන කරලා, 1ක් පරාද වෙනවා. ලකුණු කීයද?"}, opts: [{en:"5",si:"5"},{en:"3.5",si:"3.5"},{en:"6",si:"6"},{en:"4",si:"4"}], a: 3 },
      { type: "choice", q: {en:"You played B (finished with 3.0), C (2.5), D (1.0) and E (2.0). What is your Buchholz score?",si:"ඔයා B (අවසාන ලකුණු 3.0), C (2.5), D (1.0) සහ E (2.0) සමඟ ක්‍රීඩා කළා. ඔයාගේ බුක්හෝල්ස් ලකුණු කීයද?"}, opts: [{en:"8.5",si:"8.5"},{en:"6.5",si:"6.5"},{en:"9",si:"9"},{en:"7.5",si:"7.5"}], a: 0 },
      { type: "choice", q: {en:"Same opponents. You beat B and C, lost to D, drew with E. What is your Sonneborn-Berger score?",si:"එම ප්‍රතිවාදීන්ම. ඔයා B සහ C පරාද කළා, D ට පරාද වුණා, E සමඟ සමාන වුණා. ඔයාගේ සොනෙබෝන්-බර්ගර් ලකුණු කීයද?"}, opts: [{en:"8.5",si:"8.5"},{en:"6.5",si:"6.5"},{en:"5.5",si:"5.5"},{en:"7",si:"7"}], a: 1 },
      { type: "choice", q: {en:"What is Buchholz?",si:"බුක්හෝල්ස් කියන්නේ මොකක්ද?"}, opts: [{en:"The sum of your opponents' final scores",si:"ඔයාගේ ප්‍රතිවාදීන්ගේ අවසාන ලකුණු එකතුව"},{en:"The number of your wins",si:"ඔයාගේ ජයග්‍රහණ ගණන"},{en:"Your rating",si:"ඔයාගේ ශ්‍රේණිගත අගය"}], a: 0 },
      { type: "choice", q: {en:"Who announces the tiebreaks?",si:"ටයි-බ්‍රේක් ප්‍රකාශ කරන්නේ කවුද?"}, opts: [{en:"The winner",si:"ජයග්‍රාහකයා"},{en:"The organiser, before the tournament",si:"තරඟයට කලින් සංවිධායකයා"},{en:"Each player decides",si:"හැම ක්‍රීඩකයාම තීරණය කරයි"}], a: 1 }
    ],
    "l3-swiss": [
      { type: "choice", q: {en:"In a round-robin with 8 players, how many rounds are needed?",si:"ක්‍රීඩකයන් 8 දෙනෙකු සිටින රවුන්ඩ්-රොබින් එකකට වටයන් කීයක් ඕනේද?"}, opts: [{en:"7",si:"7"},{en:"8",si:"8"},{en:"9",si:"9"},{en:"4",si:"4"}], a: 0 },
      { type: "choice", q: {en:"In a round-robin with 10 players, how many rounds are needed?",si:"ක්‍රීඩකයන් 10 දෙනෙකු සිටින රවුන්ඩ්-රොබින් එකකට වටයන් කීයක් ඕනේද?"}, opts: [{en:"10",si:"10"},{en:"9",si:"9"},{en:"11",si:"11"},{en:"5",si:"5"}], a: 1 },
      { type: "choice", q: {en:"In a Swiss tournament, who plays whom?",si:"ස්විස් තරඟයක කවුද කවුරු එක්ක ක්‍රීඩා කරන්නේ?"}, opts: [{en:"Strongest against weakest only",si:"ශක්තිමත්ම අයත් දුර්වලම අයත් විතරයි"},{en:"Players with the same score meet",si:"සමාන ලකුණු ඇති ක්‍රීඩකයන් හමු වෙනවා"},{en:"Random players every round",si:"හැම වටයකම අහඹු ක්‍රීඩකයන්"}], a: 1 },
      { type: "choice", q: {en:"Can two players meet twice in a Swiss tournament?",si:"ස්විස් තරඟයක ක්‍රීඩකයන් දෙදෙනෙකුට දෙපාරක් හමු වෙන්න පුළුවන්ද?"}, opts: [{en:"Yes, every round",si:"ඔව්, හැම වටයකදීම"},{en:"Yes, in the last round",si:"ඔව්, අවසාන වටයේදී"},{en:"No",si:"නෑ"}], a: 2 },
      { type: "choice", q: {en:"What is a bye?",si:"බයි (bye) කියන්නේ මොකක්ද?"}, opts: [{en:"A round with no opponent, when the number of players is odd",si:"ක්‍රීඩකයන් ගණන ඔත්තේ නම් ප්‍රතිවාදියෙක් නැති වටයක්"},{en:"A draw offer",si:"සමාන කිරීමේ යෝජනාවක්"},{en:"A penalty for being late",si:"ප්‍රමාද වීමට දඬුවමක්"}], a: 0 }
    ]
  };
  window.PQ_PRACTICE = Object.assign(window.PQ_PRACTICE || {}, P);
  window.PQ_MODULES = (window.PQ_MODULES || []).concat([window.PQ_MODULE_19]);
})();
