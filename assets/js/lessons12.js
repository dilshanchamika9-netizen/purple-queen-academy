/* Purple Queen Chess Academy — Level 2 · Module 5: Playing with a clock
   Rules text based on the FIDE Laws of Chess (Art. 6, 6.9, Appendices A and B). Sinhala and the rule wording need review by the arbiter (Washini). */
(function () {
  const T = (en, si) => ({ en, si });
  const fp = window.PQ_FP;
  window.PQ_MODULE_12 = {
    level: T("Level 2 · Knight", "මට්ටම 2 · නයිට්"),
    title: T("Playing with a clock", "ඔරලෝසුවත් සමඟ ක්‍රීඩා කිරීම"),
    lessons: [
      { id: "l2-time-management", title: {en:"Time management",si:"කාලය කළමනාකරණය"}, steps: [
        { text: {en:"A chess clock gives each player a fixed amount of time for the whole game. Time is a resource, just like your pieces.",si:"චෙස් ඔරලෝසුවෙන් හැම ක්‍රීඩකයෙකුටම මුළු ක්‍රීඩාවටම නියමිත කාලයක් ලැබෙනවා. කාලය ඔයාගේ ඉත්තන් වගේම සම්පතක්."} },
        { text: {en:"Play the opening quickly when you know the ideas. Save your time for the middlegame, where the hard decisions are.",si:"අදහස් දන්නවා නම් ඔපනින් එක වේගයෙන් ක්‍රීඩා කරන්න. අමාරු තීරණ තියෙන මිඩල් ගේම් එකට කාලය ඉතිරි කරගන්න."} },
        { text: {en:"Think longer when the position is tense: many captures and checks, or one wrong move loses. Play fast when the move is obvious, like a forced recapture.",si:"තත්වය තදයි නම් වැඩි වෙලාවක් හිතන්න: කැපීම් සහ චෙක් ගොඩක්, නැත්නම් එක වැරදි ඇදීමකින් පරාද වෙනවා. ඇදීම පැහැදිලි නම් ඉක්මනට ඇදෙන්න, උදා බලකරන ආපසු කැපීමක්."} },
        { text: {en:"Think on your opponent’s time too. While they think, plan your reply to their most likely moves.",si:"ප්‍රතිවාදියාගේ වෙලාවෙත් හිතන්න. එයා හිතන අතරේ එයාගේ වඩාත්ම සම්භාවිත ඇදීම් වලට ඔයාගේ පිළිතුරු සැලසුම් කරන්න."} },
        { text: {en:"Glance at the clock every few moves. Do not arrive at the last few minutes with many moves still to play.",si:"ඇදීම් කිහිපයකට වරක් ඔරලෝසුව දිහා බලන්න. තවත් ඇදීම් ගොඩක් ඉතිරිව තියෙද්දී අවසාන මිනිත්තු කිහිපයට එන්න එපා."} }
      ] },
      { id: "l2-increment", title: {en:"Increment and delay",si:"ඉන්ක්‍රිමන්ට් සහ ඩිලේ"}, steps: [
        { text: {en:"Many games use an increment. A time control written 10+5 means 10 minutes for the game plus 5 seconds added after every move you make.",si:"ක්‍රීඩා ගොඩක් ඉන්ක්‍රිමන්ට් (increment) භාවිතා කරනවා. 10+5 කියලා ලියපු කාල පාලනයෙන් අදහස් වෙන්නේ ක්‍රීඩාවට මිනිත්තු 10ක් සහ ඔයා ඇදෙන හැම ඇදීමකට පස්සේම තත්පර 5ක් එකතු වීම."} },
        { text: {en:"Example, 10+5: the clock shows 10:00. You use 3 seconds for a move. Afterwards it shows 10:00 − 0:03 + 0:05 = 10:02.",si:"උදාහරණය, 10+5: ඔරලෝසුව 10:00 පෙන්වනවා. ඔයා ඇදීමකට තත්පර 3ක් ගත්තා. ඊට පස්සේ පෙන්වන්නේ 10:00 − 0:03 + 0:05 = 10:02."} },
        { text: {en:"If you move faster than the increment, your time grows. If you move slower, it still goes down, but more slowly.",si:"ඉන්ක්‍රිමන්ට් එකට වඩා ඉක්මනින් ඇදුවොත් ඔයාගේ කාලය වැඩි වෙනවා. හෙමින් ඇදුවොත් තවමත් අඩු වෙනවා, ඒත් ටිකක් හෙමින්."} },
        { text: {en:"A delay is different. The clock waits for the delay time before it starts counting down, but no time is ever added.",si:"ඩිලේ (delay) එකක් වෙනස්. ඔරලෝසුව පහළට ගණන් කරන්න පටන් ගන්න කලින් ඩිලේ කාලය බලා ඉන්නවා, ඒත් කවදාවත් කාලය එකතු වෙන්නේ නෑ."} },
        { text: {en:"Always check the time control before the game. The organiser announces it.",si:"ක්‍රීඩාවට කලින් කාල පාලනය බලන්න. සංවිධායකයා ඒක ප්‍රකාශ කරනවා."} }
      ] },
      { id: "l2-flag", title: {en:"When the flag falls",si:"ෆ්ලැග් එක වැටෙන විට"}, steps: [
        { text: {en:"Your flag falls when your time reaches zero. A flag is considered fallen when the arbiter sees it, or when a player claims it.",si:"ඔයාගේ කාලය බිංදුවට එනකොට ඔයාගේ ෆ්ලැග් එක (flag) වැටෙනවා. ආබිටර් ඒක දකින විට, නැත්නම් ක්‍රීඩකයෙක් ඒක ඉල්ලුවාම ෆ්ලැග් එක වැටුණා කියලා සලකනවා."} },
        { text: {en:"If your flag falls first, you usually lose the game, even when your position is winning.",si:"ඔයාගේ ෆ්ලැග් එක මුලින් වැටුණොත් සාමාන්‍යයෙන් ඔයා පරාද වෙනවා, ඔයාගේ තත්වය දිනන තත්වයක් වුණත්."} },
        { text: {en:"Exception: if your opponent cannot checkmate you by any possible series of legal moves, the game is a draw.",si:"ව්‍යතිරේකය: ඔයාගේ ප්‍රතිවාදියාට කිසිම නීතිමය ඇදීම් මාලාවකින් ඔයාව චෙක්මේට් කරන්න බැරි නම්, ක්‍රීඩාව ඩ්‍රෝ."} },
        { text: {en:"For example, if your opponent has only a king, or a king and a single knight or bishop while you have only a king, your flag falling is a draw.",si:"උදාහරණයක් ලෙස, ප්‍රතිවාදියාට රජු විතරක්, නැත්නම් රජු සහ නයිට් එකක් හෝ බිෂොප් එකක් විතරක් ඇති අතර ඔයාට රජු විතරක් ඇත්නම්, ඔයාගේ ෆ්ලැග් එක වැටීම ඩ්‍රෝ එකක්."} },
        { text: {en:"A won position is worth nothing without time. Keep an eye on the clock.",si:"කාලය නැතුව දිනන තත්වයකින් වැඩක් නෑ. ඔරලෝසුව දිහා බලාගෙන ඉන්න."} }
      ] },
      { id: "l2-rapid-blitz", title: {en:"Standard, rapid and blitz",si:"ස්ටෑන්ඩර්ඩ්, රැපිඩ් සහ බ්ලිට්ස්"}, steps: [
        { text: {en:"FIDE groups games by time: standard, rapid and blitz. The group depends on the time each player gets.",si:"FIDE ක්‍රීඩා කාලය අනුව කාණ්ඩ කරනවා: ස්ටෑන්ඩර්ඩ්, රැපිඩ් සහ බ්ලිට්ස්. කාණ්ඩය තීරණය වෙන්නේ හැම ක්‍රීඩකයෙකුටම ලැබෙන කාලය අනුවයි."} },
        { text: {en:"Add the starting time to 60 times the increment, in minutes. Blitz: 10 minutes or less. Rapid: more than 10 minutes but less than 60. Standard: 60 minutes or more.",si:"ආරම්භක කාලයට ඉන්ක්‍රිමන්ට් එක මෙන් 60 ගුණයක් (මිනිත්තු වලින්) එකතු කරන්න. බ්ලිට්ස්: මිනිත්තු 10 හෝ ඊට අඩු. රැපිඩ්: මිනිත්තු 10ට වැඩි, 60ට අඩු. ස්ටෑන්ඩර්ඩ්: මිනිත්තු 60 හෝ ඊට වැඩි."} },
        { text: {en:"Examples: 5+3 is 5 + 3 = 8 minutes, blitz. 15+10 is 25 minutes, rapid. 90+30 is 120 minutes, standard.",si:"උදාහරණ: 5+3 = 5 + 3 = මිනිත්තු 8, බ්ලිට්ස්. 15+10 = මිනිත්තු 25, රැපිඩ්. 90+30 = මිනිත්තු 120, ස්ටෑන්ඩර්ඩ්."} },
        { text: {en:"Rapid and blitz have their own rules in the Laws of Chess (Appendices A and B). Often there is no arbiter at every board, so know the rules yourself.",si:"රැපිඩ් සහ බ්ලිට්ස් වලට චෙස් නීති වල (A සහ B ඇමුණුම්) තමන්ගේම නීති තියෙනවා. බොහෝ වෙලාවට හැම බෝඩ් එකකම ආබිටර් කෙනෙක් නැහැ, ඒ නිසා නීති ඔයා දැනගෙන ඉන්න ඕන."} },
        { text: {en:"Before the round, ask the arbiter which rules apply to your event.",si:"වටයට කලින්, ඔයාගේ තරඟයට අදාළ නීති මොනවාද කියලා ආබිටර්ගෙන් අහන්න."} }
      ] },
    ],
  };
  const P = {
    "l2-time-management": [
      { type: "choice", q: {en:"Which moves deserve a long think?",si:"දිගු වෙලාවක් හිතිය යුත්තේ කුමන ඇදීම් වලටද?"}, opts: [{en:"Critical moments with captures and checks to calculate",si:"ගණනය කරන්න කැපීම් සහ චෙක් ඇති තීරණාත්මක මොහොතවල්"},{en:"Obvious forced recaptures",si:"පැහැදිලි බලකරන ආපසු කැපීම්"},{en:"Every move the same",si:"හැම ඇදීමකටම සමානව"}], a: 0 },
      { type: "choice", q: {en:"How can you use your opponent’s thinking time?",si:"ප්‍රතිවාදියාගේ හිතන වෙලාව ඔයාට භාවිතා කළ හැක්කේ කොහොමද?"}, opts: [{en:"Look away from the board",si:"බෝඩ් එකෙන් ඇස් ඉවතට ගැනීම"},{en:"Plan replies to their likely moves",si:"එයාගේ සම්භාවිත ඇදීම් වලට පිළිතුරු සැලසුම් කිරීම"},{en:"Stop thinking until they move",si:"එයා ඇදෙනකම් හිතීම නවත්තන්න"}], a: 1 },
      { type: "choice", q: {en:"Your clock is low and many moves remain. What is the best plan?",si:"ඔයාගේ කාලය අඩුයි, ඇදීම් ගොඩක් ඉතිරියි. හොඳම සැලැස්ම මොකක්ද?"}, opts: [{en:"Think five minutes on the next move",si:"ඊළඟ ඇදීමට මිනිත්තු පහක් හිතන්න"},{en:"Stop looking at the clock",si:"ඔරලෝසුව බලන එක නවත්වන්න"},{en:"Speed up and play simple, safe moves",si:"ඉක්මන් කරලා සරල, ආරක්ෂිත ඇදීම් ඇදෙන්න"}], a: 2 },
      { type: "choice", q: {en:"When can you play quickly in the opening?",si:"ඔපනින් එකේදී ඔයාට ඉක්මනට ඇදෙන්න පුළුවන් කවදාද?"}, opts: [{en:"When you know the ideas and the moves",si:"අදහස් සහ ඇදීම් දන්නා විට"},{en:"Never",si:"කවදාවත් නෑ"},{en:"Only when you are losing",si:"පරාද වෙනකොට විතරයි"}], a: 0 },
      { type: "choice", q: {en:"A forced recapture is the only sensible move. How long should you think?",si:"බලකරන ආපසු කැපීම එකම සාධාරණ ඇදීමයි. කොච්චර වෙලාවක් හිතන්නද?"}, opts: [{en:"As long as possible",si:"හැකි තරම් වෙලාවක්"},{en:"Very little",si:"ඉතා ස්වල්පයක්"},{en:"Ten minutes",si:"මිනිත්තු දහයක්"}], a: 1 }
    ],
    "l2-increment": [
      { type: "choice", q: {en:"Time control 10+5. The clock shows 6:00 and you move after 3 seconds. What does it show now?",si:"කාල පාලනය 10+5. ඔරලෝසුව 6:00 පෙන්වනවා, ඔයා තත්පර 3කට පස්සේ ඇදුවා. දැන් පෙන්වන්නේ මොකද්ද?"}, opts: [{en:"5:57",si:"5:57"},{en:"6:05",si:"6:05"},{en:"6:02",si:"6:02"}], a: 2 },
      { type: "choice", q: {en:"Time control 5+3. You start at 5:00 and move after 1 second. What time do you have?",si:"කාල පාලනය 5+3. ඔයා 5:00 න් පටන් අරන් තත්පර 1කට පස්සේ ඇදුවා. ඔයාට තියෙන වෙලාව කීයද?"}, opts: [{en:"5:02",si:"5:02"},{en:"4:59",si:"4:59"},{en:"5:03",si:"5:03"}], a: 0 },
      { type: "choice", q: {en:"In a 10+5 game you move after exactly 5 seconds. What happens to your time?",si:"10+5 ක්‍රීඩාවක ඔයා හරියටම තත්පර 5කට පස්සේ ඇදුවා. ඔයාගේ කාලයට සිදු වෙන්නේ මොකද්ද?"}, opts: [{en:"It increases by 5 seconds",si:"තත්පර 5කින් වැඩි වෙනවා"},{en:"It stays the same",si:"ඒක එලෙසම තියෙනවා"},{en:"It decreases by 5 seconds",si:"තත්පර 5කින් අඩු වෙනවා"}], a: 1 },
      { type: "choice", q: {en:"What is the main difference between increment and delay?",si:"ඉන්ක්‍රිමන්ට් සහ ඩිලේ අතර ප්‍රධාන වෙනස මොකද්ද?"}, opts: [{en:"Delay adds time; increment does not",si:"ඩිලේ කාලය එකතු කරනවා; ඉන්ක්‍රිමන්ට් නෑ"},{en:"There is no difference",si:"වෙනසක් නෑ"},{en:"Increment adds time; delay only postpones the countdown",si:"ඉන්ක්‍රිමන්ට් කාලය එකතු කරනවා; ඩිලේ ගණන් කිරීම කල් දානවා විතරයි"}], a: 2 },
      { type: "choice", q: {en:"What does 15+10 mean?",si:"15+10 කියන්නේ මොකද්ද?"}, opts: [{en:"15 minutes plus 10 seconds per move",si:"මිනිත්තු 15ක් සහ හැම ඇදීමකටම තත්පර 10ක්"},{en:"15 seconds plus 10 minutes",si:"තත්පර 15ක් සහ මිනිත්තු 10ක්"},{en:"10 minutes in total",si:"මුළු මිනිත්තු 10ක්"}], a: 0 }
    ],
    "l2-flag": [
      { type: "choice", pos: fp("4k3/8/8/8/8/3q4/8/4K3"), q: {en:"White’s flag falls. White has only a king. Black has a king and a queen. What is the result?",si:"සුදුගේ ෆ්ලැග් එක වැටුණා. සුදුට රජු විතරයි. කළුට රජු සහ රැජින ඇත. ප්‍රතිඵලය මොකද්ද?"}, opts: [{en:"Draw",si:"ඩ්‍රෝ"},{en:"White loses on time",si:"සුදු වේලාව නිසා පරාද වෙනවා"},{en:"Black loses",si:"කළු පරාද වෙනවා"}], a: 1 },
      { type: "choice", pos: fp("4k3/8/8/8/8/8/P7/Q3K3"), q: {en:"White’s flag falls. White has a king, queen and pawn. Black has only a king. What is the result?",si:"සුදුගේ ෆ්ලැග් එක වැටුණා. සුදුට රජු, රැජින සහ පෝන් එකක් ඇත. කළුට රජු විතරයි. ප්‍රතිඵලය මොකද්ද?"}, opts: [{en:"White loses on time",si:"සුදු වේලාව නිසා පරාද වෙනවා"},{en:"White wins",si:"සුදු දිනනවා"},{en:"Draw",si:"ඩ්‍රෝ"}], a: 2 },
      { type: "choice", pos: fp("4k3/8/8/8/8/8/8/4K1n1"), q: {en:"White’s flag falls. White has only a king. Black has a king and a knight. What is the result?",si:"සුදුගේ ෆ්ලැග් එක වැටුණා. සුදුට රජු විතරයි. කළුට රජු සහ නයිට් එකක් ඇත. ප්‍රතිඵලය මොකද්ද?"}, opts: [{en:"Draw",si:"ඩ්‍රෝ"},{en:"White loses on time",si:"සුදු වේලාව නිසා පරාද වෙනවා"},{en:"Black loses",si:"කළු පරාද වෙනවා"}], a: 0 },
      { type: "choice", pos: fp("4k2r/8/8/8/8/8/P7/4K3"), q: {en:"White’s flag falls. White has a king and a pawn. Black has a king and a rook. What is the result?",si:"සුදුගේ ෆ්ලැග් එක වැටුණා. සුදුට රජු සහ පෝන් එකක් ඇත. කළුට රජු සහ රුක් එකක් ඇත. ප්‍රතිඵලය මොකද්ද?"}, opts: [{en:"Draw",si:"ඩ්‍රෝ"},{en:"White loses on time",si:"සුදු වේලාව නිසා පරාද වෙනවා"},{en:"Black loses",si:"කළු පරාද වෙනවා"}], a: 1 },
      { type: "choice", q: {en:"Your flag falls and your opponent has only a king. What is the result?",si:"ඔයාගේ ෆ්ලැග් එක වැටුණා, ප්‍රතිවාදියාට රජු විතරයි. ප්‍රතිඵලය මොකද්ද?"}, opts: [{en:"You lose on time",si:"ඔයා වේලාව නිසා පරාද වෙනවා"},{en:"You win",si:"ඔයා දිනනවා"},{en:"Draw, because a lone king cannot checkmate",si:"ඩ්‍රෝ, තනි රජෙකුට චෙක්මේට් කරන්න බැරි නිසා"}], a: 2 }
    ],
    "l2-rapid-blitz": [
      { type: "choice", q: {en:"Time control 5+3. Which group is it?",si:"කාල පාලනය 5+3. ඒක කුමන කාණ්ඩයද?"}, opts: [{en:"Blitz",si:"බ්ලිට්ස්"},{en:"Rapid",si:"රැපිඩ්"},{en:"Standard",si:"ස්ටෑන්ඩර්ඩ්"}], a: 0 },
      { type: "choice", q: {en:"Time control 15+10. Which group is it?",si:"කාල පාලනය 15+10. ඒක කුමන කාණ්ඩයද?"}, opts: [{en:"Blitz",si:"බ්ලිට්ස්"},{en:"Rapid",si:"රැපිඩ්"},{en:"Standard",si:"ස්ටෑන්ඩර්ඩ්"}], a: 1 },
      { type: "choice", q: {en:"Time control 90+30. Which group is it?",si:"කාල පාලනය 90+30. ඒක කුමන කාණ්ඩයද?"}, opts: [{en:"Blitz",si:"බ්ලිට්ස්"},{en:"Rapid",si:"රැපිඩ්"},{en:"Standard",si:"ස්ටෑන්ඩර්ඩ්"}], a: 2 },
      { type: "choice", q: {en:"Time control 25+5. Which group is it?",si:"කාල පාලනය 25+5. ඒක කුමන කාණ්ඩයද?"}, opts: [{en:"Rapid",si:"රැපිඩ්"},{en:"Blitz",si:"බ්ලිට්ස්"},{en:"Standard",si:"ස්ටෑන්ඩර්ඩ්"}], a: 0 },
      { type: "choice", q: {en:"Time control 3+2. Which group is it?",si:"කාල පාලනය 3+2. ඒක කුමන කාණ්ඩයද?"}, opts: [{en:"Rapid",si:"රැපිඩ්"},{en:"Blitz",si:"බ්ලිට්ස්"},{en:"Standard",si:"ස්ටෑන්ඩර්ඩ්"}], a: 1 }
    ]
  };
  window.PQ_PRACTICE = Object.assign(window.PQ_PRACTICE || {}, P);
  window.PQ_MODULES = (window.PQ_MODULES || []).concat([window.PQ_MODULE_12]);
})();
