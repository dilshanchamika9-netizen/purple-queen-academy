/* Purple Queen Chess Academy — Level 1 · Module 2: Special moves
   Same step format as lessons.js, plus:
   moves [[from,to],[from,to]]  several pieces move together (castling)
   remove [squares]             pieces taken off the board (en passant)
   Practice tasks: type 'move' may carry also [[from,to]] (rook in castling) and remove [squares];
   type 'promo' = move the pawn, then choose the new piece (p: Q R B N). */
(function () {
  const F = 'abcdefgh';
  const T = (en, si) => ({ en, si });
  const YES = T('Yes', 'ඔව්'), NO = T('No', 'නැහැ');

  /* positions (White to move in every example) */
  const K1 = { a1: 'wR', b1: 'wN', c1: 'wB', d1: 'wQ', e1: 'wK', h1: 'wR', a2: 'wP', b2: 'wP', c2: 'wP', d2: 'wP', f2: 'wP', g2: 'wP', h2: 'wP', e4: 'wP', f3: 'wN', c4: 'wB', e8: 'bK' };
  const Q1 = { a1: 'wR', e1: 'wK', h1: 'wR', a2: 'wP', b2: 'wP', c2: 'wP', d2: 'wQ', f2: 'wP', g2: 'wP', h2: 'wP', d4: 'wP', c3: 'wN', e3: 'wB', e8: 'bK' };
  const N0 = { e1: 'wK', h1: 'wR', a1: 'wR', e8: 'bK' };
  const N_BLOCK = { e1: 'wK', h1: 'wR', f1: 'wB', g1: 'wN', e8: 'bK' };
  const N_CHECK = { e1: 'wK', h1: 'wR', e8: 'bR', a8: 'bK' };
  const N_PASS = { e1: 'wK', h1: 'wR', f8: 'bR', a8: 'bK' };
  const N_ROOKQ = { e1: 'wK', a1: 'wR', b8: 'bR', h8: 'bK' };
  const N_ROOKK = { e1: 'wK', h1: 'wR', h8: 'bR', a8: 'bK' };
  const EP0 = { e5: 'wP', d7: 'bP', g1: 'wK', g8: 'bK' };
  const EP_D = { e5: 'wP', d5: 'bP', g1: 'wK', g8: 'bK' };
  const EP_F = { e5: 'wP', f5: 'bP', g1: 'wK', g8: 'bK' };
  const EP_2 = { c5: 'wP', e5: 'wP', d5: 'bP', g1: 'wK', g8: 'bK' };
  const PR1 = { b7: 'wP', g1: 'wK', h6: 'bK' };
  const PR_FOUR = { c4: 'wQ', d4: 'wR', e4: 'wB', f4: 'wN', g1: 'wK' };
  const TK = { c7: 'wP', g1: 'wK', a7: 'bK', a8: 'bR', b8: 'bB', a6: 'bP', b7: 'bP' };
  const TRAP = { g7: 'wP', c2: 'wK', a1: 'bK' };

  window.PQ_MODULE_2 = {
    level: { en: 'Level 1 · Pawn', si: 'මට්ටම 1 · පෝන්' },
    title: { en: 'Special moves', si: 'විශේෂ ඇදීම්' },
    lessons: [
      { id: 'castle-k', title: T('Castling: kingside', 'කාසලින්: රජුගේ පැත්ත'), steps: [
        { pos: K1, text: T('Castling is a special move. It moves two pieces at once: the king and a rook. No other move in chess does this.', 'කාසලින් (castling) කියන්නේ විශේෂ ඇදීමක්. එකවර ඉත්තන් දෙකක් ඇදෙනවා: රජු සහ රුක් එකක්. චෙස්වල වෙන කිසිම ඇදීමක් මෙහෙම නැහැ.') },
        { hl: ['e1', 'h1'], soft: ['f1', 'g1'], text: T('White’s king is on e1 and a rook is on h1. The squares f1 and g1 between them are empty.', 'සුදු රජු e1 මත, රුක් එකක් h1 මත. ඒ දෙක අතර f1 සහ g1 කොටු හිස්.') },
        { moves: [['e1', 'g1'], ['h1', 'f1']], hl: ['g1', 'f1'], text: T('The king moves two squares towards the rook. Then the rook jumps over the king and lands right next to it.', 'රජු රුක් එක පැත්තට කොටු දෙකක් ඇදෙනවා. ඊට පස්සේ රුක් එක රජු උඩින් පැනලා, රජුට යාබද කොටුවේ නතර වෙනවා.') },
        { text: T('This is kingside castling, also called short castling. In notation it is written O-O.', 'මේක රජුගේ පැත්තේ කාසලින් (kingside castling), කෙටි කාසලින් කියලත් කියනවා. ලියන්නේ O-O කියලා.') },
        { hl: ['g1', 'f1'], label: { g1: 'K', f1: 'R' }, text: T('The king ends on g1 and the rook on f1. Your king is now tucked safely behind its pawns, and your rook joins the game.', 'රජු g1 මතත්, රුක් එක f1 මතත් නතර වෙනවා. රජු පෝන් පිටිපස්සේ ආරක්ෂිතව ඉන්නවා, රුක් එකත් ක්‍රීඩාවට එනවා.') },
        { text: T('In a real game, touch the king first and move it two squares. Then move the rook, with the same hand.', 'ඇත්ත ක්‍රීඩාවක දී, මුලින් රජුව අල්ලලා කොටු දෙකක් ඇදගන්න. ඊට පස්සේ ඒ අතින්ම රුක් එක ඇදගන්න.') },
      ] },

      { id: 'castle-q', title: T('Castling: queenside', 'කාසලින්: රැජිනගේ පැත්ත'), steps: [
        { pos: Q1, hl: ['a1', 'e1'], text: T('Now the other side. Queenside castling goes towards the rook on a1.', 'දැන් අනිත් පැත්ත. රැජිනගේ පැත්තේ කාසලින් කරන්නේ a1 මත තියෙන රුක් එක පැත්තට.') },
        { soft: ['b1', 'c1', 'd1'], text: T('Between the king and this rook there are three squares: b1, c1 and d1. All three must be empty.', 'රජුට සහ මේ රුක් එකට අතරේ කොටු තුනක් තියෙනවා: b1, c1 සහ d1. තුනම හිස් වෙන්න ඕන.') },
        { moves: [['e1', 'c1'], ['a1', 'd1']], hl: ['c1', 'd1'], text: T('The king moves two squares to c1. The rook jumps over the king and lands on d1.', 'රජු කොටු දෙකක් ඇදලා c1 ට යනවා. රුක් එක රජු උඩින් පැනලා d1 ට එනවා.') },
        { text: T('This is queenside castling, also called long castling. It is written O-O-O.', 'මේක රැජිනගේ පැත්තේ කාසලින් (queenside castling), දිගු කාසලින් කියලත් කියනවා. ලියන්නේ O-O-O කියලා.') },
        { pos: Q1, hl: ['g1', 'c1'], label: { g1: 'g1', c1: 'c1' }, text: T('Remember: the king always moves exactly two squares. Kingside it lands on g1, queenside on c1.', 'මතක තියාගන්න: රජු හැම වෙලාවෙම ඇදෙන්නේ හරියටම කොටු දෙකයි. රජුගේ පැත්තේදී g1 ටත්, රැජිනගේ පැත්තේදී c1 ටත් යනවා.') },
      ] },

      { id: 'castle-no', title: T('When you cannot castle', 'කාසලින් කරන්න බැරි වෙලාවල්'), steps: [
        { pos: N0, hl: ['e1', 'h1', 'a1'], text: T('You cannot always castle. All of these rules must be true. Let’s learn them one by one.', 'හැම වෙලාවකම කාසලින් කරන්න බැහැ. මේ නීති ඔක්කොම ඇත්ත වෙන්න ඕන. එකින් එක ඉගෙන ගමු.') },
        { soft: ['e1', 'h1'], text: T('Rule 1: the king and the rook have never moved. If the king steps out and comes back, castling is gone for the whole game.', 'නීතිය 1: රජුයි රුක් එකයි කවදාවත් ඇදිලා නැති වෙන්න ඕන. රජු එළියට ගිහින් ආයෙත් ආවත්, ඉතිරි ක්‍රීඩාව පුරාම කාසලින් කරන්න බැහැ.') },
        { pos: N_BLOCK, xs: ['f1', 'g1'], text: T('Rule 2: no pieces between the king and the rook. Here the bishop and the knight are in the way.', 'නීතිය 2: රජුට සහ රුක් එකට අතරේ කිසිම ඉත්තෙක් නොතිබෙන්න ඕන. මෙතන බිෂොප් සහ නයිට් අතරේ තියෙනවා.') },
        { pos: N_CHECK, caps: ['e1'], text: T('Rule 3: the king is not in check. You can never castle out of check.', 'නීතිය 3: රජුට චෙක් නැතිවෙන්න ඕන. චෙක් එකේ ඉඳගෙන කාසලින් කරන්න බැහැ.') },
        { pos: N_PASS, xs: ['f1'], text: T('Rule 4: the king may not pass over, or land on, an attacked square. Here the black rook attacks f1, so castling is not allowed.', 'නීතිය 4: රජු ප්‍රහාරයට ලක්වෙලා තියෙන කොටුවක් උඩින් යන්නත්, ඒ කොටුවක නතර වෙන්නත් බැහැ. මෙතන කළු රුක් එක f1 ට ප්‍රහාර කරන නිසා කාසලින් කරන්න බැහැ.') },
        { pos: N_ROOKQ, hl: ['b1', 'a1'], text: T('Two things do not stop castling: the rook being attacked, or, on the queenside, the b1 square being attacked.', 'මේ දෙක නම් කාසලින් නවත්තන්නේ නැහැ: රුක් එකට ප්‍රහාර එල්ල වෙලා තිබීම, නැත්නම් රැජිනගේ පැත්තේදී b1 කොටුවට ප්‍රහාර එල්ල වෙලා තිබීම.') },
        { moves: [['e1', 'c1'], ['a1', 'd1']], hl: ['c1', 'd1'], text: T('Here the black rook attacks b1, but the king only travels over d1 and c1. So White may castle.', 'මෙතන කළු රුක් එක b1 ට ප්‍රහාර කරනවා, ඒත් රජු යන්නේ d1 සහ c1 හරහා විතරයි. ඒ නිසා සුදුට කාසලින් කරන්න පුළුවන්.') },
      ] },

      { id: 'en-passant', title: T('En passant', 'එන් පාසන්ට්'), steps: [
        { pos: EP0, hl: ['e5', 'd7'], text: T('A white pawn stands on e5. A black pawn is on d7, on its starting square.', 'සුදු පෝන් එකක් e5 මත. කළු පෝන් එකක් d7 මත, ඒක පටන් ගන්න කොටුවේම.') },
        { moves: [['d7', 'd5']], soft: ['d6'], text: T('Black moves the pawn two squares, d7 to d5. It jumps over d6, a square that White’s pawn attacks.', 'කළු පෝන් එක d7 ඉඳන් d5 ට කොටු දෙකක් ඇදෙනවා. ඒ අතරේ තියෙන d6 කොටුවට සුදු පෝන් එකෙන් ප්‍රහාර කරන්න පුළුවන්.') },
        { hl: ['e5'], dots: ['d6'], text: T('White may now capture it “in passing”, as if it had moved only one square. The pawn lands on d6.', 'දැන් සුදුට ඒ පෝන් එක “යන ගමන්” කපන්න පුළුවන්, කොටුවක් විතරක් ඇදුණා වගේ. සුදු පෝන් එක d6 ට යනවා.') },
        { moves: [['e5', 'd6']], remove: ['d5'], hl: ['d6'], text: T('The e5 pawn moves to d6, and the black pawn on d5 is removed. The captured pawn is not on the square where you land.', 'e5 පෝන් එක d6 ට යනවා, d5 හි තිබුණු කළු පෝන් එක ඉවත් වෙනවා. කපපු පෝන් එක ඉන්නේ ඔයා යන කොටුවේ නෙවෙයි.') },
        { pos: EP_D, hl: ['d5'], text: T('You can do this only on the very next move. If White plays something else, the chance is gone.', 'මේක කරන්න පුළුවන් ඊළඟ ඇදීමේදී විතරයි. සුදු වෙන ඇදීමක් කළොත්, ඒ අවස්ථාව නැති වෙනවා.') },
        { pos: EP_2, hl: ['c5', 'e5'], text: T('Only a pawn that has just moved two squares can be captured this way. A white pawn must stand on its 5th rank, a black pawn on its 4th.', 'දැන් ම කොටු දෙකක් ඇදපු පෝන් එකක් විතරයි මෙහෙම කපන්න පුළුවන්. සුදු පෝන් එක 5 වන තිරස් පේළියේත්, කළු පෝන් එක 4 වන තිරස් පේළියේත් ඉන්න ඕන.') },
      ] },

      { id: 'promo-choice', title: T('Promotion: choose your piece', 'පෝන් උසස් කිරීම: ඉත්තා තෝරන්න'), steps: [
        { pos: PR1, hl: ['b7'], text: T('This white pawn is on the 7th rank. It is one step from the last rank.', 'මේ සුදු පෝන් එක 7 වන තිරස් පේළියේ. අන්තිම පේළියට තව එක පියවරයි.') },
        { moves: [['b7', 'b8']], promote: { p: 'wQ' }, hl: ['b8'], text: T('When a pawn reaches the last rank, it must change into a new piece, as part of the same move.', 'පෝන් එකක් අන්තිම පේළියට ගියාම, ඒ ඇදීමේදීම අලුත් ඉත්තෙකුට වෙනස් වෙන්න ඕන.') },
        { pos: PR_FOUR, text: T('You choose: queen, rook, bishop or knight. It need not be a piece you lost: you may even have two queens. Never a king, and never stay a pawn.', 'ඔයාට තෝරන්න පුළුවන්: රැජින, රුක්, බිෂොප් හෝ නයිට්. නැතිවෙච්ච ඉත්තෙක්ම වෙන්න ඕන නැහැ: රැජින දෙන්නෙක් වුණත් හිටින්න පුළුවන්. රජු කරන්න බැහැ, පෝන් එකක් විදිහටම ඉන්නත් බැහැ.') },
        { pos: TK, hl: ['c7'], text: T('Usually the queen is the strongest choice. But sometimes another piece is better. Choosing a piece other than a queen is called under-promotion.', 'සාමාන්‍යයෙන් රැජින තමයි ශක්තිමත්ම තේරීම. ඒත් සමහර වෙලාවට වෙන ඉත්තෙක් වඩා හොඳයි. රැජින නොවෙන ඉත්තෙක් තෝරන එකට under-promotion කියනවා.') },
        { moves: [['c7', 'c8']], promote: { p: 'wN' }, hl: ['c8', 'a7'], text: T('A queen on c8 would not give check. A knight does, and every escape square is blocked: checkmate!', 'මෙතන c8 ට රැජින ගියාම චෙක් එකක් නැහැ. නයිට් එකක් ගියාම චෙක් එකක් වෙනවා, රජුට යන්න කොටුවක් නැහැ: චෙක්මේට්!') },
        { pos: TRAP, hl: ['a1'], text: T('Careful! If White promotes to a queen here, Black has no legal move and is not in check. That is stalemate, a draw.', 'ප්‍රවේසම් වෙන්න! සුදු මෙතන රැජිනට උසස් කළොත්, කළු රජුට යන්න කොටුවක් නැහැ, ඒත් චෙක් එකකුත් නැහැ. ඒක ස්ටේල්මේට් (stalemate), ඒ කියන්නේ ඩ්‍රෝ එකක්.') },
        { moves: [['g7', 'g8']], promote: { p: 'wR' }, hl: ['g8'], text: T('Promote to a rook instead. Black has only one move, Ka2, and then White plays Ra8, checkmate.', 'ඒ වෙනුවට රුක් එකකට උසස් කරන්න. කළුට තියෙන්නේ Ka2 කියන එක ඇදීම විතරයි, ඊට පස්සේ සුදු Ra8 ඇදලා චෙක්මේට් කරනවා.') },
      ] },
    ],
  };
  window.PQ_MODULES = [window.PQ_MODULE, window.PQ_MODULE_2];

  const P2 = {
    'castle-k': [
      { type: 'move', pos: K1, q: T('Castle kingside. Move the king.', 'රජුගේ පැත්තේ කාසලින් කරන්න. රජුව ඇදගන්න.'), ans: [['e1', 'g1']], also: [['h1', 'f1']] },
      { type: 'square', pos: K1, q: T('Click the square where the rook lands after kingside castling.', 'රජුගේ පැත්තේ කාසලින් කළාම රුක් එක නතර වෙන කොටුව ක්ලික් කරන්න.'), ans: ['f1'] },
      { type: 'choice', q: T('How many pieces move in one castling?', 'එක කාසලින් එකකදී ඉත්තන් කීයක් ඇදෙනවද?'), opts: ['1', '2', '3'], a: 1 },
      { type: 'choice', q: T('How is kingside castling written?', 'රජුගේ පැත්තේ කාසලින් ලියන්නේ කොහොමද?'), opts: ['O-O', 'O-O-O', 'Kg1'], a: 0 },
      { type: 'square', pos: K1, q: T('Click the square where the king lands when castling kingside.', 'රජුගේ පැත්තේ කාසලින් කළාම රජු නතර වෙන කොටුව ක්ලික් කරන්න.'), ans: ['g1'] },
      { type: 'choice', q: T('Which piece does the king castle with?', 'රජු කාසලින් කරන්නේ කොයි ඉත්තා එක්කද?'), opts: [T('Knight', 'නයිට්'), T('Rook', 'රුක්'), T('Bishop', 'බිෂොප්')], a: 1 },
    ],
    'castle-q': [
      { type: 'move', pos: Q1, q: T('Castle queenside. Move the king.', 'රැජිනගේ පැත්තේ කාසලින් කරන්න. රජුව ඇදගන්න.'), ans: [['e1', 'c1']], also: [['a1', 'd1']] },
      { type: 'square', pos: Q1, q: T('Click the square where the rook lands after queenside castling.', 'රැජිනගේ පැත්තේ කාසලින් කළාම රුක් එක නතර වෙන කොටුව ක්ලික් කරන්න.'), ans: ['d1'] },
      { type: 'choice', q: T('How is queenside castling written?', 'රැජිනගේ පැත්තේ කාසලින් ලියන්නේ කොහොමද?'), opts: ['O-O', 'O-O-O', 'O-O-O-O'], a: 1 },
      { type: 'choice', q: T('How many squares must be empty between the king and the rook for queenside castling?', 'රැජිනගේ පැත්තේ කාසලින් කරන්න රජුට සහ රුක් එකට අතරේ කොටු කීයක් හිස් වෙන්න ඕනද?'), opts: ['2', '3', '4'], a: 1 },
      { type: 'move', pos: Q1, q: T('Now castle kingside.', 'දැන් රජුගේ පැත්තේ කාසලින් කරන්න.'), ans: [['e1', 'g1']], also: [['h1', 'f1']] },
      { type: 'choice', pos: Q1, hl: ['e1'], q: T('Where does the king land after queenside castling?', 'රැජිනගේ පැත්තේ කාසලින් කළාම රජු නතර වෙන්නේ කොහෙද?'), opts: ['c1', 'b1', 'd1'], a: 0 },
    ],
    'castle-no': [
      { type: 'choice', pos: N_BLOCK, q: T('Can White castle kingside here?', 'මෙතන සුදුට රජුගේ පැත්තට කාසලින් කරන්න පුළුවන්ද?'), opts: [YES, NO], a: 1 },
      { type: 'choice', pos: N_CHECK, q: T('White is in check from the rook. Can White castle?', 'රුක් එකෙන් සුදුට චෙක් වෙලා. කාසලින් කරන්න පුළුවන්ද?'), opts: [YES, NO], a: 1 },
      { type: 'choice', pos: N_PASS, q: T('The black rook attacks f1. Can White castle kingside?', 'කළු රුක් එක f1 ට ප්‍රහාර කරනවා. සුදුට රජුගේ පැත්තට කාසලින් කරන්න පුළුවන්ද?'), opts: [YES, NO], a: 1 },
      { type: 'move', pos: N_ROOKQ, q: T('The black rook attacks b1. White may still castle queenside. Do it.', 'කළු රුක් එක b1 ට ප්‍රහාර කරනවා. ඒත් සුදුට රැජිනගේ පැත්තට කාසලින් කරන්න පුළුවන්. කරන්න.'), ans: [['e1', 'c1']], also: [['a1', 'd1']] },
      { type: 'choice', pos: N0, q: T('The king went to e2 and back to e1 earlier. Can White castle now?', 'රජු කලින් e2 ට ගිහින් ආයෙත් e1 ට ආවා. දැන් කාසලින් කරන්න පුළුවන්ද?'), opts: [YES, NO], a: 1 },
      { type: 'choice', pos: N_ROOKK, q: T('The black rook attacks White’s rook on h1. Can White castle kingside?', 'කළු රුක් එක h1 හි තියෙන සුදු රුක් එකට ප්‍රහාර කරනවා. සුදුට රජුගේ පැත්තට කාසලින් කරන්න පුළුවන්ද?'), opts: [YES, NO], a: 0 },
    ],
    'en-passant': [
      { type: 'move', pos: EP_D, q: T('Black has just played d7–d5. Capture the pawn en passant.', 'කළු දැන් ම d7–d5 ඇදුවා. පෝන් එක එන් පාසන්ට් කරලා කපන්න.'), ans: [['e5', 'd6']], remove: ['d5'] },
      { type: 'move', pos: EP_F, q: T('Black has just played f7–f5. Capture the pawn en passant.', 'කළු දැන් ම f7–f5 ඇදුවා. පෝන් එක එන් පාසන්ට් කරලා කපන්න.'), ans: [['e5', 'f6']], remove: ['f5'] },
      { type: 'square', pos: EP_2, q: T('Black has just played d7–d5. Click a pawn that can capture it en passant.', 'කළු දැන් ම d7–d5 ඇදුවා. ඒක එන් පාසන්ට් කරලා කපන්න පුළුවන් පෝන් එකක් ක්ලික් කරන්න.'), ans: ['c5', 'e5'] },
      { type: 'choice', pos: EP_D, q: T('Black’s pawn moved from d6 to d5, one square. Can White capture it en passant?', 'කළු පෝන් එක d6 ඉඳන් d5 ට එක කොටුවක් ඇදුණා. සුදුට එන් පාසන්ට් කරන්න පුළුවන්ද?'), opts: [YES, NO], a: 1 },
      { type: 'choice', pos: EP_D, q: T('Black played d7–d5, but White played another move first. Can White still capture en passant later?', 'කළු d7–d5 ඇදුවා, ඒත් සුදු මුලින් වෙන ඇදීමක් කළා. පස්සේ දී එන් පාසන්ට් කරන්න පුළුවන්ද?'), opts: [YES, NO], a: 1 },
    ],
    'promo-choice': [
      { type: 'promo', pos: PR1, q: T('Move the pawn to the last rank, then promote it to a queen.', 'පෝන් එක අන්තිම පේළියට ඇදලා, රැජිනට උසස් කරන්න.'), ans: [['b7', 'b8']], p: 'Q' },
      { type: 'promo', pos: TK, q: T('Promote to the piece that gives checkmate.', 'චෙක්මේට් දෙන ඉත්තාට උසස් කරන්න.'), ans: [['c7', 'c8']], p: 'N' },
      { type: 'promo', pos: TRAP, q: T('A queen would be stalemate. Promote to the piece that checkmates in two moves.', 'රැජිනට උසස් කළොත් ස්ටේල්මේට්. ඇදීම් දෙකකින් චෙක්මේට් කරන ඉත්තාට උසස් කරන්න.'), ans: [['g7', 'g8']], p: 'R' },
      { type: 'choice', q: T('Can a pawn promote to a king?', 'පෝන් එකකට රජුට උසස් වෙන්න පුළුවන්ද?'), opts: [YES, NO], a: 1 },
      { type: 'choice', q: T('You already have a queen. Can a pawn promote to a second queen?', 'ඔයාට දැනටමත් රැජිනක් ඉන්නවා. පෝන් එකකට දෙවෙනි රැජිනකට උසස් වෙන්න පුළුවන්ද?'), opts: [YES, NO], a: 0 },
      { type: 'choice', q: T('A pawn reaches the last rank. May it stay a pawn?', 'පෝන් එකක් අන්තිම පේළියට ආවා. ඒකට පෝන් එකක් විදිහටම ඉන්න පුළුවන්ද?'), opts: [YES, NO], a: 1 },
    ],
  };
  window.PQ_PRACTICE = Object.assign(window.PQ_PRACTICE || {}, P2);
  window.PQ_M2_POS = { K1, Q1, N0, N_BLOCK, N_CHECK, N_PASS, N_ROOKQ, N_ROOKK, EP0, EP_D, EP_F, EP_2, PR1, TK, TRAP };
})();
