/* Purple Queen Chess Academy — Level 1 · Module 1: The board and the pieces
   Each step: pos (full position, replaces board), move [from,to], promote {sq,p},
   hl (gold ring), soft (lavender fill), dots (legal squares), caps (capture ring),
   xs (forbidden), names (all square names), files / ranks (emphasise edge labels),
   label {sq:text}, badges {sq:text}, text {en, si}. Position keys: square -> 'wK' etc. */
(function () {
  const F = 'abcdefgh';
  const sq = (f, r) => F[f] + r;
  const all = () => { const a = []; for (let r = 1; r <= 8; r++) for (let f = 0; f < 8; f++) a.push(sq(f, r)); return a; };
  const rank = r => F.split('').map(f => f + r);
  const file = f => [1, 2, 3, 4, 5, 6, 7, 8].map(r => f + r);
  const light = () => all().filter(s => (F.indexOf(s[0]) + +s[1]) % 2 === 0);
  const START = {};
  'RNBQKBNR'.split('').forEach((p, i) => { START[F[i] + '1'] = 'w' + p; START[F[i] + '8'] = 'b' + p; START[F[i] + '2'] = 'wP'; START[F[i] + '7'] = 'bP'; });
  const pick = (pos, keys) => Object.fromEntries(Object.entries(pos).filter(([k]) => keys.includes(k)));
  const line = (from, dirs, max = 8, block = {}) => {
    const out = []; const f0 = F.indexOf(from[0]), r0 = +from[1];
    dirs.forEach(([df, dr]) => { for (let i = 1; i <= max; i++) { const f = f0 + df * i, r = r0 + dr * i; if (f < 0 || f > 7 || r < 1 || r > 8) break; const s = sq(f, r); if (block[s]) break; out.push(s); } });
    return out;
  };
  const ROOK = [[1, 0], [-1, 0], [0, 1], [0, -1]], BISH = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  const KN = (s) => { const f0 = F.indexOf(s[0]), r0 = +s[1]; return [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]].map(([a, b]) => [f0 + a, r0 + b]).filter(([f, r]) => f >= 0 && f < 8 && r >= 1 && r <= 8).map(([f, r]) => sq(f, r)); };

  window.PQ_MODULE = {
    level: { en: 'Level 1 · Pawn', si: 'මට්ටම 1 · පෝන්' },
    title: { en: 'The board and the pieces', si: 'පුවරුව සහ ඉත්තන්' },
    lessons: [
      { id: 'board', title: { en: 'Meet the chessboard', si: 'චෙස් පුවරුව හඳුනාගනිමු' }, steps: [
        { pos: {}, text: { en: 'This is a chessboard. It has 64 squares.', si: 'මේ චෙස් පුවරුවයි. මෙහි කොටු 64ක් තියෙනවා.' } },
        { soft: rank(1), text: { en: 'There are 8 squares across…', si: 'හරහට කොටු 8යි…' } },
        { soft: file('a'), text: { en: '…and 8 squares up. 8 × 8 = 64.', si: '…උඩට කොටු 8යි. 8 × 8 = 64.' } },
        { soft: light(), text: { en: 'The squares are light and dark, one after the other.', si: 'කොටු සුදු සහ කළු (ලා සහ තද) පාටින් එකක් හැර එකක් තියෙනවා.' } },
        { hl: ['h1'], text: { en: 'Golden rule: the corner square on your right must be light. “Light on the right!”', si: 'වැදගත්ම නීතිය: ඔයාගේ දකුණු පැත්තේ කෙළවර කොටුව සුදු (ලා) පාට වෙන්න ඕන. “දකුණට සුදු කොටුව!”' } },
      ], quiz: { q: { en: 'How many squares are on a chessboard?', si: 'චෙස් පුවරුවක කොටු කීයක් තියෙනවද?' }, opts: ['32', '64', '100'], a: 1 } },

      { id: 'files-ranks', title: { en: 'Files and ranks', si: 'සිරස් පේළි සහ තිරස් පේළි' }, steps: [
        { pos: {}, files: true, text: { en: 'The columns going up are called files. They are named with the letters a to h.', si: 'උඩට යන සිරස් පේළි (files) a සිට h දක්වා ඉංග්‍රීසි අකුරුවලින් නම් කරනවා.' } },
        { files: true, soft: file('e'), text: { en: 'This is the e-file.', si: 'මේ e සිරස් පේළියයි.' } },
        { ranks: true, text: { en: 'The rows going across are called ranks. They are numbered 1 to 8.', si: 'හරහට යන තිරස් පේළි (ranks) 1 සිට 8 දක්වා අංකවලින් නම් කරනවා.' } },
        { ranks: true, soft: rank(4), text: { en: 'This is the 4th rank.', si: 'මේ 4 වන තිරස් පේළියයි.' } },
        { pos: START, ranks: true, soft: [...rank(1), ...rank(2), ...rank(7), ...rank(8)], text: { en: 'White starts on ranks 1 and 2. Black starts on ranks 7 and 8.', si: 'සුදු ඉත්තන් 1 සහ 2 තිරස් පේළිවලත්, කළු ඉත්තන් 7 සහ 8 තිරස් පේළිවලත් පටන් ගන්නවා.' } },
      ], quiz: { q: { en: 'What are the columns of the board called?', si: 'පුවරුවේ සිරස් පේළිවලට කියන්නේ මොකක්ද?' }, opts: [{ en: 'Ranks', si: 'තිරස් පේළි (ranks)' }, { en: 'Files', si: 'සිරස් පේළි (files)' }, { en: 'Diagonals', si: 'ඇද පේළි (diagonals)' }], a: 1 } },

      { id: 'coordinates', title: { en: 'Every square has a name', si: 'හැම කොටුවකටම නමක් තියෙනවා' }, steps: [
        { pos: {}, files: true, ranks: true, soft: [...file('e'), ...rank(4)], hl: ['e4'], text: { en: 'Every square has a name: first its letter, then its number.', si: 'හැම කොටුවකටම නමක් තියෙනවා: මුලින් අකුර, ඊට පස්සේ අංකය.' } },
        { files: true, ranks: true, hl: ['e4'], label: { e4: 'e4' }, text: { en: 'This square is e4: the e-file and the 4th rank.', si: 'මේ කොටුව e4: e සිරස් පේළිය සහ 4 වන තිරස් පේළිය.' } },
        { files: true, ranks: true, hl: ['d5'], label: { d5: 'd5' }, text: { en: 'This one is d5.', si: 'මේක d5.' } },
        { files: true, ranks: true, hl: ['a1', 'h1', 'a8', 'h8'], label: { a1: 'a1', h1: 'h1', a8: 'a8', h8: 'h8' }, text: { en: 'The four corners are a1, h1, a8 and h8.', si: 'කෙළවර කොටු හතර a1, h1, a8 සහ h8.' } },
        { names: true, text: { en: 'Here is the name of every square. Players and arbiters use these names to write down every move of a game.', si: 'මෙන්න හැම කොටුවකම නම. ක්‍රීඩකයෝ සහ ආබිටර්වරු තරඟයක හැම ඇදීමක්ම ලියන්නේ මේ නම්වලින්.' } },
      ], quiz: { q: { en: 'What is the name of the gold square?', si: 'රන් පාට කොටුවේ නම මොකක්ද?' }, opts: ['b7', 'g2', 'g7'], a: 1, hl: ['g2'] } },

      { id: 'army', title: { en: 'The chess army', si: 'චෙස් ඉත්තන්' }, steps: [
        { pos: START, text: { en: 'Each player starts with 16 pieces.', si: 'හැම ක්‍රීඩකයෙක්ම ඉත්තන් 16කින් පටන් ගන්නවා.' } },
        { hl: [...rank(2), ...rank(7)], text: { en: '8 pawns each.', si: 'එක් අයෙකුට පෝන් 8 බැගින්.' } },
        { hl: ['a1', 'h1', 'a8', 'h8'], text: { en: '2 rooks each.', si: 'රුක් 2 බැගින්.' } },
        { hl: ['b1', 'g1', 'b8', 'g8'], text: { en: '2 knights each.', si: 'නයිට් 2 බැගින්.' } },
        { hl: ['c1', 'f1', 'c8', 'f8'], text: { en: '2 bishops each.', si: 'බිෂොප් 2 බැගින්.' } },
        { hl: ['d1', 'd8'], text: { en: '1 queen each.', si: 'රැජින 1 බැගින්.' } },
        { hl: ['e1', 'e8'], text: { en: '1 king each. The king is the most important piece: if your king is trapped, you lose the game.', si: 'රජු 1 බැගින්. වැදගත්ම ඉත්තා රජුයි: ඔයාගේ රජුට චෙක්මේට් වුණොත් ඔයා තරඟය පරදිනවා.' } },
      ], quiz: { q: { en: 'How many pawns does each player have?', si: 'එක් ක්‍රීඩකයෙකුට පෝන් කීයක් තියෙනවද?' }, opts: ['6', '8', '10'], a: 1 } },

      { id: 'setup', title: { en: 'Setting up the board', si: 'පුවරුවේ ඉත්තන් තැබීම' }, steps: [
        { pos: {}, hl: ['h1'], text: { en: "Let's set up the pieces. First check: light square on the right.", si: 'ඉත්තන් තියමු. මුලින්ම බලන්න: දකුණු පැත්තේ කෙළවර කොටුව සුදු පාටද කියලා.' } },
        { pos: pick(START, ['a1', 'h1', 'a8', 'h8']), hl: ['a1', 'h1', 'a8', 'h8'], text: { en: 'The rooks go in the corners.', si: 'රුක් කෙළවර කොටුවල තියන්න.' } },
        { pos: pick(START, ['a1', 'h1', 'a8', 'h8', 'b1', 'g1', 'b8', 'g8']), hl: ['b1', 'g1', 'b8', 'g8'], text: { en: 'The knights stand next to the rooks.', si: 'නයිට් රුක් ළඟින් තියන්න.' } },
        { pos: pick(START, ['a1', 'h1', 'a8', 'h8', 'b1', 'g1', 'b8', 'g8', 'c1', 'f1', 'c8', 'f8']), hl: ['c1', 'f1', 'c8', 'f8'], text: { en: 'The bishops stand next to the knights.', si: 'බිෂොප් නයිට් ළඟින් තියන්න.' } },
        { pos: pick(START, ['a1', 'h1', 'a8', 'h8', 'b1', 'g1', 'b8', 'g8', 'c1', 'f1', 'c8', 'f8', 'd1', 'd8']), hl: ['d1', 'd8'], text: { en: 'The queen goes on her own colour: the white queen on a light square, the black queen on a dark square.', si: 'රැජින තියන්නේ ඇගේම පාටේ කොටුවේ: සුදු රැජින සුදු කොටුවේ, කළු රැජින කළු කොටුවේ.' } },
        { pos: pick(START, [...rank(1), ...rank(8)]), hl: ['e1', 'e8'], text: { en: 'The king takes the last square, next to his queen.', si: 'රජු රැජින ළඟ ඉතුරු කොටුවේ.' } },
        { pos: START, hl: [...rank(2), ...rank(7)], text: { en: 'The pawns fill the row in front. The board is ready!', si: 'පෝන් ඉස්සරහ පේළිය පුරවනවා. පුවරුව ලෑස්තියි!' } },
      ], quiz: { q: { en: 'On which square does the white queen start?', si: 'සුදු රැජින පටන් ගන්නේ කොයි කොටුවෙන්ද?' }, opts: ['d1', 'e1', 'd8'], a: 0 } },

      { id: 'rook', title: { en: 'How the rook moves', si: 'රුක් ඇදීම' }, steps: [
        { pos: { d4: 'wR' }, dots: line('d4', ROOK), text: { en: 'The rook moves in straight lines: up, down, left or right.', si: 'රුක් ඇදෙන්නේ කෙළින් පේළිවල: ඉස්සරහට, පස්සට, වමට හෝ දකුණට.' } },
        { move: ['d4', 'd8'], text: { en: 'It can go as far as it likes in one move.', si: 'එක ඇදීමකින් කැමති තරම් දුර යන්න පුළුවන්.' } },
        { pos: { d4: 'wR', d6: 'wP', g4: 'bN' }, dots: line('d4', ROOK, 8, { d6: 1, g4: 1 }), caps: ['g4'], text: { en: 'It cannot jump over pieces. It captures an enemy piece by landing on its square.', si: 'වෙනත් ඉත්තන් උඩින් පනින්න බෑ. විරුද්ධ ඉත්තෙක් ඉන්න කොටුවට ගිහින් ඒ ඉත්තාව කපනවා.' } },
        { move: ['d4', 'g4'], text: { en: 'The rook captures the knight.', si: 'රුක් නයිට්ව කපනවා.' } },
      ], quiz: { q: { en: 'Can a rook move diagonally?', si: 'රුක් එකට ඇද පේළි ඔස්සේ යන්න පුළුවන්ද?' }, opts: [{ en: 'Yes', si: 'ඔව්' }, { en: 'No', si: 'නැහැ' }], a: 1 } },

      { id: 'bishop', title: { en: 'How the bishop moves', si: 'බිෂොප් ඇදීම' }, steps: [
        { pos: { d4: 'wB' }, dots: line('d4', BISH), text: { en: 'The bishop moves diagonally, as far as it likes.', si: 'බිෂොප් ඇදෙන්නේ ඇද පේළි ඔස්සේ, කැමති තරම් දුර.' } },
        { move: ['d4', 'g7'], text: { en: 'From d4 to g7 in one move.', si: 'එක ඇදීමකින් d4 සිට g7 දක්වා.' } },
        { pos: { c1: 'wB', f1: 'wB' }, soft: light(), hl: ['c1', 'f1'], text: { en: 'A bishop always stays on its colour. Each player has one light-square bishop and one dark-square bishop.', si: 'බිෂොප් හැමවිටම එකම පාටේ කොටුවල ඉන්නවා. හැම ක්‍රීඩකයෙකුටම සුදු කොටු බිෂොප් කෙනෙක් සහ කළු කොටු බිෂොප් කෙනෙක් ඉන්නවා.' } },
      ], quiz: { q: { en: 'A bishop on a dark square can reach…', si: 'කළු කොටුවක ඉන්න බිෂොප්ට යන්න පුළුවන්…' }, opts: [{ en: 'only dark squares', si: 'කළු කොටුවලට විතරයි' }, { en: 'any square', si: 'ඕනෑම කොටුවකට' }], a: 0 } },

      { id: 'queen', title: { en: 'How the queen moves', si: 'රැජින ඇදීම' }, steps: [
        { pos: { d4: 'wQ' }, dots: line('d4', [...ROOK, ...BISH]), text: { en: 'The queen moves like a rook and a bishop together: straight or diagonal, any distance.', si: 'රැජින ඇදෙන්නේ රුක් සහ බිෂොප් දෙකම වගේ: කෙළින් හෝ ඇදට, කැමති තරම් දුර.' } },
        { move: ['d4', 'h8'], text: { en: 'She is the strongest piece on the board.', si: 'පුවරුවේ තියෙන බලවත්ම ඉත්තා රැජිනයි.' } },
        { pos: { d4: 'wQ' }, dots: line('d4', [...ROOK, ...BISH]), xs: KN('d4'), text: { en: 'The only move she cannot make is the knight’s L-jump.', si: 'රැජිනට කරන්න බැරි එකම ඇදීම නයිට්ගේ “L” පැනීම.' } },
      ], quiz: { q: { en: 'The queen moves like which two pieces together?', si: 'රැජින ඇදෙන්නේ කොයි ඉත්තන් දෙක එකතු වුණා වගේද?' }, opts: [{ en: 'Rook + bishop', si: 'රුක් + බිෂොප්' }, { en: 'Knight + bishop', si: 'නයිට් + බිෂොප්' }, { en: 'Rook + knight', si: 'රුක් + නයිට්' }], a: 0 } },

      { id: 'king', title: { en: 'How the king moves', si: 'රජු ඇදීම' }, steps: [
        { pos: { e4: 'wK' }, dots: line('e4', [...ROOK, ...BISH], 1), text: { en: 'The king moves one square in any direction.', si: 'රජු ඕනෑම දිශාවකට එක කොටුවක් ඇදෙනවා.' } },
        { move: ['e4', 'e5'], text: { en: 'Slow, but very important.', si: 'හෙමින් ගියත් ගොඩක් වැදගත්.' } },
        { pos: { e5: 'wK', a6: 'bR' }, dots: ['d5', 'f5', 'd4', 'e4', 'f4'], xs: ['d6', 'e6', 'f6'], soft: rank(6), text: { en: 'The king may never move to a square that is attacked. The black rook controls the 6th rank.', si: 'ප්‍රහාරයට ලක්වෙලා තියෙන කොටුවකට රජුට කවදාවත් යන්න බෑ. කළු රුක් 6 වන තිරස් පේළිය පාලනය කරනවා.' } },
      ], quiz: { q: { en: 'How many squares can the king move at a time?', si: 'රජුට එක වරකට කොටු කීයක් ඇදෙන්න පුළුවන්ද?' }, opts: ['1', '2', { en: 'Any number', si: 'ඕනෑම ගණනක්' }], a: 0 } },

      { id: 'knight', title: { en: 'How the knight moves', si: 'නයිට් ඇදීම' }, steps: [
        { pos: { d4: 'wN' }, dots: KN('d4'), text: { en: 'The knight moves in an L: two squares one way, then one square to the side.', si: 'නයිට් ඇදෙන්නේ “L” හැඩයට: එක පැත්තකට කොටු දෙකක්, ඊට පස්සේ පැත්තට එක කොටුවක්.' } },
        { soft: ['d5', 'd6'], hl: ['e6'], text: { en: 'Two up, one to the right: d4 to e6.', si: 'උඩට දෙකයි, දකුණට එකයි: d4 සිට e6.' } },
        { move: ['d4', 'e6'], text: { en: 'Jump!', si: 'පනිනවා!' } },
        { pos: { b1: 'wN', a2: 'wP', b2: 'wP', c2: 'wP', d2: 'wP' }, dots: ['a3', 'c3'], text: { en: 'The knight is the only piece that can jump over other pieces.', si: 'වෙනත් ඉත්තන් උඩින් පනින්න පුළුවන් එකම ඉත්තා නයිට්.' } },
        { move: ['b1', 'c3'], text: { en: 'Every knight move lands on the opposite colour.', si: 'නයිට්ගේ හැම ඇදීමකින්ම පාට මාරු වෙනවා.' } },
      ], quiz: { q: { en: 'Which piece can jump over other pieces?', si: 'වෙනත් ඉත්තන් උඩින් පනින්න පුළුවන් ඉත්තා කවුද?' }, opts: [{ en: 'Bishop', si: 'බිෂොප්' }, { en: 'Knight', si: 'නයිට්' }, { en: 'Queen', si: 'රැජින' }], a: 1 } },

      { id: 'pawn', title: { en: 'How the pawn moves', si: 'පෝන් ඇදීම' }, steps: [
        { pos: { e2: 'wP' }, dots: ['e3', 'e4'], text: { en: 'A pawn moves straight forward. On its first move it may go one or two squares.', si: 'පෝන් ඇදෙන්නේ කෙළින්ම ඉස්සරහට. පළමු ඇදීමේදී කොටු එකක් හෝ දෙකක් යන්න පුළුවන්.' } },
        { move: ['e2', 'e4'], text: { en: 'Two squares forward: e2 to e4.', si: 'ඉස්සරහට කොටු දෙකක්: e2 සිට e4.' } },
        { pos: { e4: 'wP' }, dots: ['e5'], text: { en: 'After that, only one square at a time. A pawn never moves backwards.', si: 'ඊට පස්සේ එක වරකට එක කොටුවයි. පෝන් කවදාවත් පස්සට යන්නේ නැහැ.' } },
        { pos: { e4: 'wP', e5: 'bP', d5: 'bN' }, xs: ['e5'], caps: ['d5'], text: { en: 'It is blocked by the pawn in front. It captures one square diagonally forward.', si: 'ඉස්සරහ ඉන්න පෝන් නිසා මේ පෝන් හිරවෙලා. පෝන් කපන්නේ ඉස්සරහට ඇදට එක කොටුවකින්.' } },
        { move: ['e4', 'd5'], text: { en: 'The pawn captures the knight.', si: 'පෝන් නයිට්ව කපනවා.' } },
        { pos: { e7: 'wP' }, dots: ['e8'], text: { en: 'A pawn that reaches the last rank…', si: 'අන්තිම තිරස් පේළියට යන පෝන්…' } },
        { move: ['e7', 'e8'], promote: { sq: 'e8', p: 'wQ' }, hl: ['e8'], text: { en: '…becomes a queen, rook, bishop or knight. This is called promotion.', si: '…රැජින, රුක්, බිෂොප් හෝ නයිට් බවට පත් වෙනවා. මේකට කියන්නේ පෝන් උසස් කිරීම (promotion).' } },
      ], quiz: { q: { en: 'How does a pawn capture?', si: 'පෝන් කපන්නේ කොහොමද?' }, opts: [{ en: 'Straight forward', si: 'කෙළින්ම ඉස්සරහට' }, { en: 'Diagonally forward', si: 'ඉස්සරහට ඇදට' }, { en: 'Backwards', si: 'පස්සට' }], a: 1 } },

      { id: 'values', title: { en: 'Captures and piece values', si: 'කැපීම සහ ඉත්තන්ගේ වටිනාකම' }, steps: [
        { pos: { b4: 'wP', c4: 'wN', d4: 'wB', e4: 'wR', f4: 'wQ', g4: 'wK' }, badges: { b4: '1', c4: '3', d4: '3', e4: '5', f4: '9', g4: '∞' }, text: { en: 'Pieces have points: pawn 1, knight 3, bishop 3, rook 5, queen 9.', si: 'ඉත්තන්ට ලකුණු තියෙනවා: පෝන් 1, නයිට් 3, බිෂොප් 3, රුක් 5, රැජින 9.' } },
        { hl: ['g4'], badges: { g4: '∞' }, text: { en: 'The king is never captured. The game ends with checkmate before that can happen.', si: 'රජුව කවදාවත් කපන්නේ නැහැ. ඊට කලින් චෙක්මේට් එකෙන් තරඟය ඉවර වෙනවා.' } },
        { pos: { d1: 'wR', d7: 'bN', g8: 'bK', g1: 'wK', b7: 'bB' }, caps: ['d7'], badges: { d1: '5', d7: '3', b7: '3' }, text: { en: 'Count before you capture. Rook takes knight here, then the bishop takes back: you give 5 to win 3.', si: 'කපන්න කලින් ගණන් කරන්න. මෙතන රුක් නයිට්ව කැපුවොත් බිෂොප් ආපහු රුක්ව කපනවා: 3ක් ගන්න 5ක් දෙනවා.' } },
      ], quiz: { q: { en: 'Which piece is worth the most points?', si: 'වැඩිම ලකුණු වටිනාකම තියෙන ඉත්තා කවුද?' }, opts: [{ en: 'Knight', si: 'නයිට්' }, { en: 'Rook', si: 'රුක්' }, { en: 'Bishop', si: 'බිෂොප්' }], a: 1 } },
    ],
  };
})();

/* Practice after each lesson.
   type 'square': click a square (any in ans counts). type 'move': move a white piece, ans = [[from,to],...].
   type 'choice': pick one option. pos = board position for the task, hl = gold squares. */
(function () {
  const F = 'abcdefgh';
  const sq = (f, r) => F[f] + r;
  const all = () => { const a = []; for (let r = 1; r <= 8; r++) for (let f = 0; f < 8; f++) a.push(sq(f, r)); return a; };
  const dark = () => all().filter(s => (F.indexOf(s[0]) + +s[1]) % 2 === 1);
  const rank = r => F.split('').map(f => f + r);
  const file = f => [1, 2, 3, 4, 5, 6, 7, 8].map(r => f + r);
  const line = (from, dirs, max = 8, block = {}) => { const out = []; const f0 = F.indexOf(from[0]), r0 = +from[1];
    dirs.forEach(([df, dr]) => { for (let i = 1; i <= max; i++) { const f = f0 + df * i, r = r0 + dr * i; if (f < 0 || f > 7 || r < 1 || r > 8) break; const s = sq(f, r); out.push(s); if (block[s]) break; } }); return out; };
  const ROOK = [[1, 0], [-1, 0], [0, 1], [0, -1]], BISH = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  const KN = (s) => { const f0 = F.indexOf(s[0]), r0 = +s[1]; return [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]].map(([a, b]) => [f0 + a, r0 + b]).filter(([f, r]) => f >= 0 && f < 8 && r >= 1 && r <= 8).map(([f, r]) => sq(f, r)); };
  const START = {}; 'RNBQKBNR'.split('').forEach((p, i) => { START[F[i] + '1'] = 'w' + p; START[F[i] + '8'] = 'b' + p; START[F[i] + '2'] = 'wP'; START[F[i] + '7'] = 'bP'; });
  const without = (pos, keys) => Object.fromEntries(Object.entries(pos).filter(([k]) => !keys.includes(k)));
  const T = (en, si) => ({ en, si });
  const YES = T('Yes', 'ඔව්'), NO = T('No', 'නැහැ');

  window.PQ_PRACTICE = {
    board: [
      { type: 'choice', q: T('How many squares are on a chessboard?', 'චෙස් පුවරුවක කොටු කීයක් තියෙනවද?'), opts: ['32', '64', '100'], a: 1 },
      { type: 'square', pos: {}, q: T('Click the corner square that must be light on White’s right.', 'සුදු ක්‍රීඩකයාගේ දකුණු පැත්තේ සුදු පාට වෙන්න ඕන කෙළවර කොටුව ක්ලික් කරන්න.'), ans: ['h1'] },
      { type: 'square', pos: {}, q: T('Click any dark square.', 'ඕනෑම කළු කොටුවක් ක්ලික් කරන්න.'), ans: dark() },
      { type: 'choice', q: T('How many squares are in one row?', 'එක පේළියක කොටු කීයක් තියෙනවද?'), opts: ['6', '8', '10'], a: 1 },
    ],
    'files-ranks': [
      { type: 'square', pos: {}, q: T('Click any square on the e-file.', 'e සිරස් පේළියේ ඕනෑම කොටුවක් ක්ලික් කරන්න.'), ans: file('e') },
      { type: 'square', pos: {}, q: T('Click any square on the 4th rank.', '4 වන තිරස් පේළියේ ඕනෑම කොටුවක් ක්ලික් කරන්න.'), ans: rank(4) },
      { type: 'square', pos: {}, q: T('Click any square on the a-file.', 'a සිරස් පේළියේ ඕනෑම කොටුවක් ක්ලික් කරන්න.'), ans: file('a') },
      { type: 'choice', q: T('What are the columns of the board called?', 'පුවරුවේ සිරස් පේළිවලට කියන්නේ මොකක්ද?'), opts: [T('Ranks', 'තිරස් පේළි (ranks)'), T('Files', 'සිරස් පේළි (files)'), T('Diagonals', 'ඇද පේළි (diagonals)')], a: 1 },
      { type: 'choice', pos: START, q: T('Black’s pieces start on which ranks?', 'කළු ඉත්තන් පටන් ගන්නේ කොයි තිරස් පේළිවලද?'), opts: ['1 & 2', '4 & 5', '7 & 8'], a: 2 },
    ],
    coordinates: [
      { type: 'square', pos: {}, q: T('Click e4.', 'e4 ක්ලික් කරන්න.'), ans: ['e4'] },
      { type: 'square', pos: {}, q: T('Click b7.', 'b7 ක්ලික් කරන්න.'), ans: ['b7'] },
      { type: 'square', pos: {}, q: T('Click h3.', 'h3 ක්ලික් කරන්න.'), ans: ['h3'] },
      { type: 'square', pos: {}, q: T('Click d5.', 'd5 ක්ලික් කරන්න.'), ans: ['d5'] },
      { type: 'choice', pos: {}, hl: ['g2'], q: T('What is the name of the gold square?', 'රන් පාට කොටුවේ නම මොකක්ද?'), opts: ['b7', 'g2', 'g7'], a: 1 },
      { type: 'choice', q: T('In a square’s name, what comes first?', 'කොටුවක නමේ මුලින්ම එන්නේ මොකක්ද?'), opts: [T('The letter', 'අකුර'), T('The number', 'අංකය')], a: 0 },
    ],
    army: [
      { type: 'square', pos: START, q: T('Click the white queen.', 'සුදු රැජින ක්ලික් කරන්න.'), ans: ['d1'] },
      { type: 'square', pos: START, q: T('Click the white king.', 'සුදු රජු ක්ලික් කරන්න.'), ans: ['e1'] },
      { type: 'square', pos: START, q: T('Click a black knight.', 'කළු නයිට් කෙනෙක් ක්ලික් කරන්න.'), ans: ['b8', 'g8'] },
      { type: 'square', pos: START, q: T('Click a white bishop.', 'සුදු බිෂොප් කෙනෙක් ක්ලික් කරන්න.'), ans: ['c1', 'f1'] },
      { type: 'choice', q: T('How many pieces does each player start with?', 'එක් ක්‍රීඩකයෙක් ඉත්තන් කීයකින් පටන් ගන්නවද?'), opts: ['8', '16', '32'], a: 1 },
    ],
    setup: [
      { type: 'square', pos: without(START, ['d1']), q: T('The white queen is missing. Click her starting square.', 'සුදු රැජින නැහැ. ඇය පටන් ගන්න කොටුව ක්ලික් කරන්න.'), ans: ['d1'] },
      { type: 'square', pos: without(START, ['e8']), q: T('The black king is missing. Click his starting square.', 'කළු රජු නැහැ. රජු පටන් ගන්න කොටුව ක්ලික් කරන්න.'), ans: ['e8'] },
      { type: 'square', pos: without(START, ['a1', 'h1']), q: T('Click a starting square of a white rook.', 'සුදු රුක් එකක් පටන් ගන්න කොටුවක් ක්ලික් කරන්න.'), ans: ['a1', 'h1'] },
      { type: 'square', pos: without(START, ['b1', 'g1']), q: T('Click a starting square of a white knight.', 'සුදු නයිට් කෙනෙක් පටන් ගන්න කොටුවක් ක්ලික් කරන්න.'), ans: ['b1', 'g1'] },
      { type: 'choice', q: T('The white queen starts on a…', 'සුදු රැජින පටන් ගන්නේ…'), opts: [T('light square', 'සුදු කොටුවක'), T('dark square', 'කළු කොටුවක')], a: 0 },
    ],
    rook: [
      { type: 'move', pos: { d4: 'wR', d7: 'bN' }, q: T('Capture the knight with the rook.', 'රුක් එකෙන් නයිට්ව කපන්න.'), ans: [['d4', 'd7']] },
      { type: 'square', pos: { a1: 'wR' }, q: T('Click a square the rook can move to.', 'රුක් එකට යන්න පුළුවන් කොටුවක් ක්ලික් කරන්න.'), ans: line('a1', ROOK) },
      { type: 'move', pos: { c3: 'wR', c6: 'wP', f3: 'bB', c8: 'bQ' }, q: T('Capture a black piece with the rook.', 'රුක් එකෙන් කළු ඉත්තෙක්ව කපන්න.'), ans: [['c3', 'f3']] },
      { type: 'choice', q: T('Can a rook move diagonally?', 'රුක් එකට ඇද පේළි ඔස්සේ යන්න පුළුවන්ද?'), opts: [YES, NO], a: 1 },
      { type: 'choice', pos: { d4: 'wR', d6: 'wP' }, q: T('Can this rook reach d8?', 'මේ රුක් එකට d8 ට යන්න පුළුවන්ද?'), opts: [YES, NO], a: 1 },
    ],
    bishop: [
      { type: 'move', pos: { c1: 'wB', g5: 'bN' }, q: T('Capture the knight with the bishop.', 'බිෂොප්ගෙන් නයිට්ව කපන්න.'), ans: [['c1', 'g5']] },
      { type: 'square', pos: { d4: 'wB' }, q: T('Click a square the bishop can move to.', 'බිෂොප්ට යන්න පුළුවන් කොටුවක් ක්ලික් කරන්න.'), ans: line('d4', BISH) },
      { type: 'move', pos: { f1: 'wB', b5: 'bR', e4: 'wP' }, q: T('Capture the rook.', 'රුක් එක කපන්න.'), ans: [['f1', 'b5']] },
      { type: 'choice', q: T('A bishop on a dark square can reach…', 'කළු කොටුවක ඉන්න බිෂොප්ට යන්න පුළුවන්…'), opts: [T('only dark squares', 'කළු කොටුවලට විතරයි'), T('any square', 'ඕනෑම කොටුවකට')], a: 0 },
    ],
    queen: [
      { type: 'move', pos: { d1: 'wQ', d8: 'bR', a4: 'bP' }, q: T('Capture the rook with the queen.', 'රැජිනගෙන් රුක් එක කපන්න.'), ans: [['d1', 'd8']] },
      { type: 'move', pos: { a1: 'wQ', h8: 'bR', a6: 'bN' }, q: T('Capture the rook in one move.', 'එක ඇදීමකින් රුක් එක කපන්න.'), ans: [['a1', 'h8']] },
      { type: 'square', pos: { d4: 'wQ' }, q: T('Click a square the queen can move to.', 'රැජිනට යන්න පුළුවන් කොටුවක් ක්ලික් කරන්න.'), ans: line('d4', [...ROOK, ...BISH]) },
      { type: 'choice', q: T('The queen moves like which two pieces together?', 'රැජින ඇදෙන්නේ කොයි ඉත්තන් දෙක එකතු වුණා වගේද?'), opts: [T('Rook + bishop', 'රුක් + බිෂොප්'), T('Knight + bishop', 'නයිට් + බිෂොප්'), T('Rook + knight', 'රුක් + නයිට්')], a: 0 },
    ],
    king: [
      { type: 'square', pos: { e4: 'wK' }, q: T('Click a square the king can move to.', 'රජුට යන්න පුළුවන් කොටුවක් ක්ලික් කරන්න.'), ans: line('e4', [...ROOK, ...BISH], 1) },
      { type: 'square', pos: { e1: 'wK', a2: 'bR' }, q: T('The black rook controls the 2nd rank. Click a safe square for the king.', 'කළු රුක් 2 වන තිරස් පේළිය පාලනය කරනවා. රජුට ආරක්ෂිත කොටුවක් ක්ලික් කරන්න.'), ans: ['d1', 'f1'] },
      { type: 'choice', q: T('How many squares can the king move at a time?', 'රජුට එක වරකට කොටු කීයක් ඇදෙන්න පුළුවන්ද?'), opts: ['1', '2', T('Any number', 'ඕනෑම ගණනක්')], a: 0 },
      { type: 'choice', q: T('Can a king move to a square that is attacked?', 'ප්‍රහාරයට ලක්වෙලා තියෙන කොටුවකට රජුට යන්න පුළුවන්ද?'), opts: [YES, NO], a: 1 },
    ],
    knight: [
      { type: 'square', pos: { d4: 'wN' }, q: T('Click a square the knight can jump to.', 'නයිට්ට පනින්න පුළුවන් කොටුවක් ක්ලික් කරන්න.'), ans: KN('d4') },
      { type: 'move', pos: { g1: 'wN', h3: 'bP' }, q: T('Capture the pawn with the knight.', 'නයිට්ගෙන් පෝන් එක කපන්න.'), ans: [['g1', 'h3']] },
      { type: 'square', pos: { a1: 'wN' }, q: T('From the corner, click a square the knight can reach.', 'කෙළවරේ ඉඳන් නයිට්ට යන්න පුළුවන් කොටුවක් ක්ලික් කරන්න.'), ans: KN('a1') },
      { type: 'move', pos: { b1: 'wN', a2: 'wP', b2: 'wP', c2: 'wP', d2: 'wP', c3: 'bB' }, q: T('Jump over the pawns and capture the bishop.', 'පෝන් උඩින් පැනලා බිෂොප්ව කපන්න.'), ans: [['b1', 'c3']] },
      { type: 'choice', q: T('Which piece can jump over other pieces?', 'වෙනත් ඉත්තන් උඩින් පනින්න පුළුවන් ඉත්තා කවුද?'), opts: [T('Bishop', 'බිෂොප්'), T('Knight', 'නයිට්'), T('Queen', 'රැජින')], a: 1 },
    ],
    pawn: [
      { type: 'square', pos: { e2: 'wP' }, q: T('Click a square this pawn can move to.', 'මේ පෝන් එකට යන්න පුළුවන් කොටුවක් ක්ලික් කරන්න.'), ans: ['e3', 'e4'] },
      { type: 'move', pos: { d4: 'wP', d5: 'bP', e5: 'bN' }, q: T('Capture the knight with the pawn.', 'පෝන් එකෙන් නයිට්ව කපන්න.'), ans: [['d4', 'e5']] },
      { type: 'move', pos: { a7: 'wP', h8: 'bK' }, q: T('Promote the pawn.', 'පෝන් එක උසස් කරන්න (promotion).'), ans: [['a7', 'a8']], promote: 'wQ' },
      { type: 'choice', pos: { c4: 'wP', c5: 'bP' }, q: T('Can the white pawn move?', 'සුදු පෝන් එකට ඇදෙන්න පුළුවන්ද?'), opts: [YES, NO], a: 1 },
      { type: 'choice', q: T('How does a pawn capture?', 'පෝන් කපන්නේ කොහොමද?'), opts: [T('Straight forward', 'කෙළින්ම ඉස්සරහට'), T('Diagonally forward', 'ඉස්සරහට ඇදට'), T('Backwards', 'පස්සට')], a: 1 },
    ],
    values: [
      { type: 'move', pos: { e4: 'wN', d6: 'bR', f6: 'bP', g5: 'bB' }, q: T('Capture the most valuable black piece.', 'වැඩිම වටිනාකම තියෙන කළු ඉත්තාව කපන්න.'), ans: [['e4', 'd6']] },
      { type: 'choice', q: T('How many points is a queen worth?', 'රැජිනගේ වටිනාකම ලකුණු කීයද?'), opts: ['5', '9', '3'], a: 1 },
      { type: 'choice', q: T('Which piece is worth the most points?', 'වැඩිම ලකුණු වටිනාකම තියෙන ඉත්තා කවුද?'), opts: [T('Knight', 'නයිට්'), T('Rook', 'රුක්'), T('Bishop', 'බිෂොප්')], a: 1 },
      { type: 'choice', q: T('You give a rook (5) for a knight (3). You…', 'ඔයා නයිට් කෙනෙක් (3) වෙනුවට රුක් එකක් (5) දෙනවා. ඔයා…'), opts: [T('win 2 points', 'ලකුණු 2ක් දිනනවා'), T('lose 2 points', 'ලකුණු 2ක් පරදිනවා'), T('stay equal', 'සමානයි')], a: 1 },
      { type: 'move', pos: { c1: 'wB', h6: 'bQ', a3: 'bP', g1: 'wK', g8: 'bK' }, q: T('Win the most points with one capture.', 'එක කැපීමකින් වැඩිම ලකුණු දිනන්න.'), ans: [['c1', 'h6']] },
    ],
  };
})();
