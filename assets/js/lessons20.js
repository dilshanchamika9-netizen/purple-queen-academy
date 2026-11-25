/* Purple Queen Chess Academy — Level 3 · Module 6: Tournament preparation
   Sinhala text and FIDE wording need coach review (Washini). */
(function () {
  const T = (en, si) => ({ en, si });
  const fp = window.PQ_FP;
  window.PQ_MODULE_20 = {
    level: T("Level 3 · Queen", "මට්ටම 3 · රැජින"),
    title: T("Tournament preparation", "තරඟ සූදානම"),
    lessons: [
      { id: "l3-physical-prep", title: {en:"Physical preparation",si:"ශාරීරික සූදානම"}, steps: [
        { text: {en:"Chess is a long mental effort. A tired body means a tired brain, and tired players blunder.",si:"චෙස් කියන්නේ දිගු මානසික වෑයමක්. වෙහෙසට පත් ශරීරයක් කියන්නේ වෙහෙසට පත් මොළයක්, වෙහෙසට පත් ක්‍රීඩකයන් බ්ලන්ඩර් කරනවා."} },
        { text: {en:"Sleep well, especially the night before. Eight to nine hours is good for young players.",si:"හොඳින් නිදාගන්න, විශේෂයෙන් ඊට කලින් රාත්‍රියේ. තරුණ ක්‍රීඩකයන්ට පැය අටේ නවයේ නින්දක් හොඳයි."} },
        { text: {en:"Eat a light, healthy meal before the round and keep water and a small snack in your bag. Avoid heavy food and too much sugar.",si:"වටයට කලින් සැහැල්ලු සෞඛ්‍ය සම්පන්න ආහාර වේලක් ගන්න, ඔයාගේ බෑග් එකේ වතුර සහ පොඩි කෑමක් තියාගන්න. බර ආහාර සහ අධික සීනි වළක්වන්න."} },
        { text: {en:"Arrive early, with your pen and ID. Rushing at the last minute raises stress before the first move.",si:"කලින් එන්න, ඔයාගේ පෑනත් හැඳුනුම්පතත් එක්ක. අවසන් මොහොතේ ඉක්මන් වීම පළමු ඇදීමට කලින් ආතතිය වැඩි කරනවා."} },
        { text: {en:"Regular exercise helps concentration. A short walk between rounds is a good habit.",si:"නිතිපතා ව්‍යායාම සාන්ද්‍රණයට උදව් වෙනවා. වටයන් අතර කෙටි ඇවිදීමක් හොඳ පුරුද්දක්."} }
      ] },
      { id: "l3-mental-prep", title: {en:"Mental preparation",si:"මානසික සූදානම"}, steps: [
        { text: {en:"Nerves before a game are normal. Even champions feel them. Turn the energy into focus.",si:"ක්‍රීඩාවකට කලින් ස්නායු අවුල් වීම සාමාන්‍යයි. චැම්පියන්ලාටත් එහෙම දැනෙනවා. ඒ ශක්තිය අවධානය බවට හරවන්න."} },
        { text: {en:"Breathe slowly: in for four counts, out for four counts. Do it a few times before the first move.",si:"හෙමින් හුස්ම ගන්න: ගණන් හතරක් ඇතුළට, ගණන් හතරක් පිටතට. පළමු ඇදීමට කලින් කිහිප වතාවක් ඒක කරන්න."} },
        { text: {en:"Focus on the move in front of you, not on the result. Think about the best move, not about winning or losing.",si:"ඔයා ඉස්සරහා තියෙන ඇදීම ගැන අවධානය යොමු කරන්න, ප්‍රතිඵලය ගැන නෙවෙයි. දිනීම හෝ පරාද වීම ගැන නෙවෙයි, හොඳම ඇදීම ගැන හිතන්න."} },
        { text: {en:"If you make a mistake, do not panic. Take a breath and play on. Your opponent can also make mistakes, and many games turn around.",si:"වැරැද්දක් කළොත් කලබල වෙන්න එපා. හුස්මක් අරන් ක්‍රීඩා කරන්න. ඔයාගේ ප්‍රතිවාදියාත් වැරදි කරන්න පුළුවන්, ගොඩක් ක්‍රීඩා හැරෙනවා."} },
        { text: {en:"Respect every opponent. Play every game as if it matters, whether you face a higher or a lower rated player.",si:"හැම ප්‍රතිවාදියාටම ගරු කරන්න. ඔයා වැඩි හෝ අඩු ශ්‍රේණිගත ක්‍රීඩකයෙක්ව හමු වුණත්, හැම ක්‍රීඩාවක්ම වැදගත් කියලා ක්‍රීඩා කරන්න."} }
      ] },
      { id: "l3-between-rounds", title: {en:"Between rounds",si:"වටයන් අතර"}, steps: [
        { text: {en:"Between rounds you have limited time. Use it well: rest the brain, eat lightly and drink water.",si:"වටයන් අතර ඔයාට සීමිත වෙලාවක් තියෙනවා. ඒක හොඳින් පාවිච්චි කරන්න: මොළයට විවේකයක් දෙන්න, සැහැල්ලුවෙන් කන්න, වතුර බොන්න."} },
        { text: {en:"Forget the last game, whether you won or lost. Do not replay it for hours. You can review it after the tournament.",si:"ඔයා දිනුවත් පරාද වුණත් අන්තිම ක්‍රීඩාව අමතක කරන්න. පැය ගණන් ඒක නැවත ක්‍රීඩා කරන්න එපා. තරඟයෙන් පස්සේ ඒක සමාලෝචනය කරන්න පුළුවන්."} },
        { text: {en:"Check the pairings as soon as they are posted. Find your board number, your colour and your opponent.",si:"පෙළගැස්වීම් ප්‍රදර්ශනය කළ විගස බලන්න. ඔයාගේ බෝඩ් අංකය, පාට සහ ප්‍රතිවාදියා හොයාගන්න."} },
        { text: {en:"Prepare briefly for the opponent, then relax. Walk, breathe, or talk about something else with friends. Keep your phone off.",si:"ප්‍රතිවාදියා ගැන කෙටියෙන් සූදානම් වෙලා, ඊට පස්සේ විවේක ගන්න. ඇවිදින්න, හුස්ම ගන්න, නැත්නම් මිතුරන් එක්ක වෙන දෙයක් ගැන කතා කරන්න. ඔයාගේ දුරකථනය ක්‍රියා විරහිතව තියන්න."} },
        { text: {en:"Return to the playing hall in time. Remember that in many tournaments a player who is very late can lose the game.",si:"ක්‍රීඩා ශාලාවට වෙලාවට ආපසු එන්න. බොහෝ තරඟ වලදී ඉතා ප්‍රමාද වන ක්‍රීඩකයෙකුට ක්‍රීඩාව පරාද වෙන්න පුළුවන් බව මතක තියාගන්න."} }
      ] },
      { id: "l3-checklist", title: {en:"Your tournament checklist",si:"ඔයාගේ තරඟ ලැයිස්තුව"}, steps: [
        { text: {en:"A checklist stops you forgetting things when you are nervous. Prepare it the evening before.",si:"ලැයිස්තුවක් ඔයා ස්නායු අවුලින් ඉන්නකොට දේවල් අමතක වීම වළක්වනවා. කලින් සවස ඒක සූදානම් කරගන්න."} },
        { text: {en:"Bring: ID or registration confirmation, a pen (black or blue), water, a snack, and the tournament information. A chess set only if the organiser asks.",si:"රැගෙන එන්න: හැඳුනුම්පත හෝ ලියාපදිංචි තහවුරු කිරීම, පෑනක් (කළු හෝ නිල්), වතුර, කෑමක්, සහ තරඟ තොරතුරු. සංවිධායකයා ඉල්ලුවොත් පමණක් චෙස් කට්ටලයක්."} },
        { text: {en:"Know the rules: time control, touch-move, how to claim a draw, what to do with your scoresheet. The arbiter is there to help.",si:"නීති දැනගන්න: කාල පාලනය, ස්පර්ශ කළ ඇදීම, සමානයක් ඉල්ලන හැටි, ඔයාගේ ලකුණු පත්‍රයට කළ යුතු දේ. ආබිටර් ඉන්නේ උදව් කරන්න."} },
        { text: {en:"During the game: write every move, check the clock, stay seated and silent, and offer a draw only after you move and before you press the clock.",si:"ක්‍රීඩාව අතරතුර: හැම ඇදීමක්ම ලියන්න, ඔරලෝසුව බලන්න, වාඩි වෙලා නිශ්ශබ්දව ඉන්න, ඔයා ඇදුවට පස්සේ සහ ඔරලෝසුව ඔබන්න කලින් විතරක් සමානයක් යෝජනා කරන්න."} },
        { text: {en:"After the game: shake hands, report the result as instructed, and take a short break. Then write one lesson for your review notebook.",si:"ක්‍රීඩාවෙන් පස්සේ: අත් සලන්න, උපදෙස් දෙන ආකාරයට ප්‍රතිඵලය වාර්තා කරන්න, කෙටි විවේකයක් ගන්න. ඊට පස්සේ ඔයාගේ සමාලෝචන පොතට පාඩමක් ලියන්න."} }
      ] },
    ],
  };
  const P = {
    "l3-physical-prep": [
      { type: "choice", q: {en:"Why does sleep matter before a tournament?",si:"තරඟයකට කලින් නින්ද වැදගත් ඇයි?"}, opts: [{en:"A rested brain thinks better and blunders less",si:"විවේක ගත් මොළයක් වඩා හොඳින් හිතනවා, බ්ලන්ඩර් අඩුයි"},{en:"It makes the clock slower",si:"ඒකෙන් ඔරලෝසුව හෙමින් යනවා"},{en:"It is required by the Laws",si:"ඒක නීති වලින් අවශ්‍යයි"}], a: 0 },
      { type: "choice", q: {en:"What is a good meal before the round?",si:"වටයට කලින් හොඳ ආහාර වේලක් මොකක්ද?"}, opts: [{en:"A very heavy meal",si:"ඉතා බර ආහාර වේලක්"},{en:"A light, healthy meal",si:"සැහැල්ලු සෞඛ්‍ය සම්පන්න ආහාර වේලක්"},{en:"Only sweets",si:"ගුලි වර්ග විතරයි"}], a: 1 },
      { type: "choice", q: {en:"What should you keep in your bag?",si:"ඔයාගේ බෑග් එකේ තියාගන්න ඕනේ මොනවාද?"}, opts: [{en:"Only a phone, switched on",si:"ක්‍රියාත්මක කළ දුරකථනයක් විතරයි"},{en:"Nothing",si:"කිසිවක් නෑ"},{en:"Water, a small snack, pen and ID",si:"වතුර, පොඩි කෑමක්, පෑනක් සහ හැඳුනුම්පත"}], a: 2 },
      { type: "choice", q: {en:"Why arrive early?",si:"කලින් එන්නේ ඇයි?"}, opts: [{en:"To avoid rushing and stress",si:"ඉක්මන් වීම සහ ආතතිය වළක්වන්න"},{en:"To play more moves",si:"වැඩි ඇදීම් ක්‍රීඩා කරන්න"},{en:"To pick a better board",si:"වඩා හොඳ බෝඩ් එකක් තෝරන්න"}], a: 0 },
      { type: "choice", q: {en:"Which helps your concentration?",si:"ඔයාගේ සාන්ද්‍රණයට උදව් වන්නේ මොකක්ද?"}, opts: [{en:"Staying up late",si:"රෑ ගොඩක් වෙලා ඇහැරී සිටීම"},{en:"Regular exercise and short walks",si:"නිතිපතා ව්‍යායාම සහ කෙටි ඇවිදීම්"},{en:"Skipping meals",si:"ආහාර මඟහැරීම"}], a: 1 }
    ],
    "l3-mental-prep": [
      { type: "choice", q: {en:"You feel nervous before the game. What is true?",si:"ක්‍රීඩාවට කලින් ඔයාට ස්නායු අවුලක් දැනෙනවා. සත්‍ය කුමක්ද?"}, opts: [{en:"You should not play",si:"ඔයා ක්‍රීඩා නොකළ යුතුයි"},{en:"It means you will lose",si:"ඒකෙන් කියන්නේ ඔයා පරාද වෙනවා කියලා"},{en:"It is normal; turn the energy into focus",si:"ඒක සාමාන්‍යයි; ඒ ශක්තිය අවධානය බවට හරවන්න"}], a: 2 },
      { type: "choice", q: {en:"What helps you calm down?",si:"ඔයාව සන්සුන් කරන්න උදව් වෙන්නේ මොකක්ද?"}, opts: [{en:"Slow, deep breathing",si:"හෙමින්, ගැඹුරු හුස්ම ගැනීම"},{en:"Drinking a lot of coffee",si:"කෝපි ගොඩක් බීම"},{en:"Skipping breakfast",si:"උදෑසන ආහාරය මඟහැරීම"}], a: 0 },
      { type: "choice", q: {en:"What should you think about during the game?",si:"ක්‍රීඩාව අතරතුර හිතන්න ඕනේ මොකක්ද?"}, opts: [{en:"The final result",si:"අවසාන ප්‍රතිඵලය"},{en:"The best move in front of you",si:"ඉස්සරහා තියෙන හොඳම ඇදීම"},{en:"What people will say",si:"මිනිස්සු මොනවා කියයිද කියලා"}], a: 1 },
      { type: "choice", q: {en:"You blundered. What is the best reaction?",si:"ඔයා බ්ලන්ඩර් කළා. හොඳම ප්‍රතිචාරය මොකක්ද?"}, opts: [{en:"Resign at once",si:"එකවරම අතහරින්න"},{en:"Get angry at the opponent",si:"ප්‍රතිවාදියාට තරහ වෙන්න"},{en:"Breathe, stay calm and keep playing",si:"හුස්ම ගන්න, සන්සුන්ව ඉඳලා ක්‍රීඩා කරන්න"}], a: 2 },
      { type: "choice", q: {en:"You face a much lower rated player. What do you do?",si:"ඔයා වඩා අඩු ශ්‍රේණිගත ක්‍රීඩකයෙක්ව හමු වෙනවා. ඔයා කරන්නේ මොකක්ද?"}, opts: [{en:"Respect them and play your best",si:"ඔවුන්ට ගරු කරලා ඔයාගේ උපරිමය දෙන්න"},{en:"Play carelessly",si:"නොසැලකිල්ලෙන් ක්‍රීඩා කරන්න"},{en:"Offer a draw at once",si:"එකවරම සමානයක් යෝජනා කරන්න"}], a: 0 }
    ],
    "l3-between-rounds": [
      { type: "choice", q: {en:"What should you do after a lost game in the middle of a tournament?",si:"තරඟය මැද පරාද වුණු ක්‍රීඩාවකින් පස්සේ ඔයා කරන්නේ මොකක්ද?"}, opts: [{en:"Replay it for hours",si:"පැය ගණන් ඒක නැවත ක්‍රීඩා කරන්න"},{en:"Reset and focus on the next game",si:"යළි පිහිටුවාගෙන ඊළඟ ක්‍රීඩාවට අවධානය යොමු කරන්න"},{en:"Withdraw from the tournament",si:"තරඟයෙන් ඉවත් වෙන්න"}], a: 1 },
      { type: "choice", q: {en:"When should you check the pairings?",si:"පෙළගැස්වීම් බලන්න ඕනේ කවදාද?"}, opts: [{en:"Five minutes after the round starts",si:"වටය පටන් ගත්තට විනාඩි පහකට පස්සේ"},{en:"Never",si:"කවදාවත් නෑ"},{en:"As soon as they are posted",si:"ඒවා ප්‍රදර්ශනය කළ විගස"}], a: 2 },
      { type: "choice", q: {en:"What should you find in the pairings?",si:"පෙළගැස්වීම් වලින් හොයාගන්න ඕනේ මොනවාද?"}, opts: [{en:"Board number, colour and opponent",si:"බෝඩ් අංකය, පාට සහ ප්‍රතිවාදියා"},{en:"The arbiter's phone number",si:"ආබිටර්ගේ දුරකථන අංකය"},{en:"The prize list",si:"ත්‍යාග ලැයිස්තුව"}], a: 0 },
      { type: "choice", q: {en:"How much should you prepare for the next opponent?",si:"ඊළඟ ප්‍රතිවාදියා ගැන කොච්චර සූදානම් වෙන්න ඕනේද?"}, opts: [{en:"All day without rest",si:"විවේකයක් නැතුව මුළු දවසම"},{en:"Briefly, then rest",si:"කෙටියෙන්, ඊට පස්සේ විවේක ගන්න"},{en:"Not at all, never look",si:"කිසිසේත් නෑ, කවදාවත් නොබලන්න"}], a: 1 },
      { type: "choice", q: {en:"Why return to the hall in time?",si:"ක්‍රීඩා ශාලාවට වෙලාවට ආපසු එන්නේ ඇයි?"}, opts: [{en:"To get a better colour",si:"වඩා හොඳ පාටක් ගන්න"},{en:"Nothing happens if you are late",si:"ප්‍රමාද වුණොත් කිසිවක් වෙන්නේ නෑ"},{en:"A very late player can lose the game",si:"ඉතා ප්‍රමාද වන ක්‍රීඩකයෙකුට ක්‍රීඩාව පරාද වෙන්න පුළුවන්"}], a: 2 }
    ],
    "l3-checklist": [
      { type: "choice", q: {en:"When should you prepare your tournament bag?",si:"ඔයාගේ තරඟ බෑග් එක සූදානම් කරන්න ඕනේ කවදාද?"}, opts: [{en:"The evening before",si:"කලින් සවස"},{en:"In the middle of the round",si:"වටය මැද"},{en:"After the tournament",si:"තරඟයෙන් පස්සේ"}], a: 0 },
      { type: "choice", q: {en:"Which should you bring?",si:"ඔයා රැගෙන එන්න ඕනේ කුමක්ද?"}, opts: [{en:"A switched-on phone",si:"ක්‍රියාත්මක කළ දුරකථනයක්"},{en:"ID, pen, water, a snack",si:"හැඳුනුම්පත, පෑන, වතුර, කෑමක්"},{en:"A chess engine",si:"චෙස් එන්ජිමක්"}], a: 1 },
      { type: "choice", q: {en:"When can you offer a draw?",si:"සමානයක් යෝජනා කරන්න පුළුවන් කවදාද?"}, opts: [{en:"While your opponent is thinking",si:"ප්‍රතිවාදියා හිතන අතරතුර"},{en:"Any time you like",si:"ඔයාට ඕනේ ඕනෑම වෙලාවක"},{en:"After making your move, before pressing the clock",si:"ඔයා ඇදුවට පස්සේ, ඔරලෝසුව ඔබන්න කලින්"}], a: 2 },
      { type: "choice", q: {en:"What do you do at the end of the game?",si:"ක්‍රීඩාව අවසානයේ ඔයා කරන්නේ මොකක්ද?"}, opts: [{en:"Shake hands and report the result",si:"අත් සලලා ප්‍රතිඵලය වාර්තා කරන්න"},{en:"Leave without saying anything",si:"කිසිවක් නොකියා පිටවෙන්න"},{en:"Argue about the moves",si:"ඇදීම් ගැන තර්ක කරන්න"}], a: 0 },
      { type: "choice", q: {en:"What should you do after the game for your improvement?",si:"ඔයාගේ දියුණුව සඳහා ක්‍රීඩාවෙන් පස්සේ කළ යුත්තේ මොකක්ද?"}, opts: [{en:"Delete the scoresheet",si:"ලකුණු පත්‍රය මකන්න"},{en:"Write one lesson in your review notebook",si:"ඔයාගේ සමාලෝචන පොතේ පාඩමක් ලියන්න"},{en:"Forget the game",si:"ක්‍රීඩාව අමතක කරන්න"}], a: 1 }
    ]
  };
  window.PQ_PRACTICE = Object.assign(window.PQ_PRACTICE || {}, P);
  window.PQ_MODULES = (window.PQ_MODULES || []).concat([window.PQ_MODULE_20]);
})();
