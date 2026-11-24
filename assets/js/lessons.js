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
    level: { en: 'Level 1 · Pawn', si: 'මට්ටම 1 · පාබල සෙබළා' },
    title: { en: 'The board and the pieces', si: 'පුවරුව සහ කැබලි' },
    lessons: [
      { id: 'board', title: { en: 'Meet the chessboard', si: 'චෙස් පුවරුව හඳුනාගනිමු' }, steps: [
        { pos: {}, text: { en: 'This is a chessboard. It has 64 squares.', si: 'මෙය චෙස් පුවරුවයි. එහි කොටු 64ක් ඇත.' } },
        { soft: rank(1), text: { en: 'There are 8 squares across…', si: 'හරහට කොටු 8ක් ඇත…' } },
        { soft: file('a'), text: { en: '…and 8 squares up. 8 × 8 = 64.', si: '…උඩට කොටු 8ක් ඇත. 8 × 8 = 64.' } },
        { soft: light(), text: { en: 'The squares are light and dark, one after the other.', si: 'කොටු ලා සහ තද පැහැයෙන් මාරුවෙන් මාරුවට පිහිටයි.' } },
        { hl: ['h1'], text: { en: 'Golden rule: the corner square on your right must be light. “Light on the right!”', si: 'රන් නීතිය: ඔබේ දකුණු පස කොන් කොටුව ලා පැහැති විය යුතුය. “දකුණට ලා කොටුව!”' } },
      ], quiz: { q: { en: 'How many squares are on a chessboard?', si: 'චෙස් පුවරුවක කොටු කීයක් තිබේද?' }, opts: ['32', '64', '100'], a: 1 } },

      { id: 'files-ranks', title: { en: 'Files and ranks', si: 'සිරස් තීරු සහ තිරස් පේළි' }, steps: [
        { pos: {}, files: true, text: { en: 'The columns going up are called files. They are named with the letters a to h.', si: 'උඩට යන සිරස් තීරු “ෆයිල්” ලෙස හැඳින්වේ. ඒවා a සිට h දක්වා අකුරුවලින් නම් කෙරේ.' } },
        { files: true, soft: file('e'), text: { en: 'This is the e-file.', si: 'මෙය e තීරුවයි.' } },
        { ranks: true, text: { en: 'The rows going across are called ranks. They are numbered 1 to 8.', si: 'හරහට යන තිරස් පේළි “රෑන්ක්” ලෙස හැඳින්වේ. ඒවා 1 සිට 8 දක්වා අංක කෙරේ.' } },
        { ranks: true, soft: rank(4), text: { en: 'This is the 4th rank.', si: 'මෙය 4 වන පේළියයි.' } },
        { pos: START, ranks: true, soft: [...rank(1), ...rank(2), ...rank(7), ...rank(8)], text: { en: 'White starts on ranks 1 and 2. Black starts on ranks 7 and 8.', si: 'සුදු කැබලි 1 සහ 2 පේළිවලද, කළු කැබලි 7 සහ 8 පේළිවලද ආරම්භ වේ.' } },
      ], quiz: { q: { en: 'What are the columns of the board called?', si: 'පුවරුවේ සිරස් තීරු හඳුන්වන්නේ කුමන නමින්ද?' }, opts: [{ en: 'Ranks', si: 'රෑන්ක්' }, { en: 'Files', si: 'ෆයිල්' }, { en: 'Diagonals', si: 'විකර්ණ' }], a: 1 } },

      { id: 'coordinates', title: { en: 'Every square has a name', si: 'සෑම කොටුවකටම නමක්' }, steps: [
        { pos: {}, files: true, ranks: true, soft: [...file('e'), ...rank(4)], hl: ['e4'], text: { en: 'Every square has a name: first its letter, then its number.', si: 'සෑම කොටුවකටම නමක් ඇත: මුලින් අකුර, ඉන්පසු අංකය.' } },
        { files: true, ranks: true, hl: ['e4'], label: { e4: 'e4' }, text: { en: 'This square is e4: the e-file and the 4th rank.', si: 'මෙම කොටුව e4 යි: e තීරුව සහ 4 වන පේළිය.' } },
        { files: true, ranks: true, hl: ['d5'], label: { d5: 'd5' }, text: { en: 'This one is d5.', si: 'මෙය d5 යි.' } },
        { files: true, ranks: true, hl: ['a1', 'h1', 'a8', 'h8'], label: { a1: 'a1', h1: 'h1', a8: 'a8', h8: 'h8' }, text: { en: 'The four corners are a1, h1, a8 and h8.', si: 'කොන් කොටු හතර a1, h1, a8 සහ h8 වේ.' } },
        { names: true, text: { en: 'Here is the name of every square. Players and arbiters use these names to write down every move of a game.', si: 'මෙන්න සෑම කොටුවකම නම. තරඟයක සෑම පියවරක්ම ලියා තැබීමට ක්‍රීඩකයන් සහ විනිසුරුවන් මෙම නම් භාවිත කරයි.' } },
      ], quiz: { q: { en: 'What is the name of the gold square?', si: 'රන් පැහැති කොටුවේ නම කුමක්ද?' }, opts: ['b7', 'g2', 'g7'], a: 1, hl: ['g2'] } },

      { id: 'army', title: { en: 'The chess army', si: 'චෙස් හමුදාව' }, steps: [
        { pos: START, text: { en: 'Each player starts with 16 pieces.', si: 'එක් එක් ක්‍රීඩකයා කැබලි 16කින් ආරම්භ කරයි.' } },
        { hl: [...rank(2), ...rank(7)], text: { en: '8 pawns each.', si: 'එක් අයෙකුට පාබල සෙබළුන් 8 බැගින්.' } },
        { hl: ['a1', 'h1', 'a8', 'h8'], text: { en: '2 rooks each.', si: 'මාලිගා 2 බැගින්.' } },
        { hl: ['b1', 'g1', 'b8', 'g8'], text: { en: '2 knights each.', si: 'අශ්වයන් 2 බැගින්.' } },
        { hl: ['c1', 'f1', 'c8', 'f8'], text: { en: '2 bishops each.', si: 'ඇතුන් 2 බැගින්.' } },
        { hl: ['d1', 'd8'], text: { en: '1 queen each.', si: 'රැජින 1 බැගින්.' } },
        { hl: ['e1', 'e8'], text: { en: '1 king each. The king is the most important piece: if your king is trapped, you lose the game.', si: 'රජු 1 බැගින්. වැදගත්ම කැබැල්ල රජුයි: ඔබේ රජු සිරවුණොත් ඔබ තරඟය පරාජය වේ.' } },
      ], quiz: { q: { en: 'How many pawns does each player have?', si: 'එක් ක්‍රීඩකයෙකුට පාබල සෙබළුන් කී දෙනෙක් සිටීද?' }, opts: ['6', '8', '10'], a: 1 } },

      { id: 'setup', title: { en: 'Setting up the board', si: 'පුවරුව සකස් කිරීම' }, steps: [
        { pos: {}, hl: ['h1'], text: { en: "Let's set up the pieces. First check: light square on the right.", si: 'දැන් කැබලි තබමු. මුලින්ම බලන්න: දකුණට ලා කොටුව.' } },
        { pos: pick(START, ['a1', 'h1', 'a8', 'h8']), hl: ['a1', 'h1', 'a8', 'h8'], text: { en: 'The rooks go in the corners.', si: 'මාලිගා කොන්වල තබන්න.' } },
        { pos: pick(START, ['a1', 'h1', 'a8', 'h8', 'b1', 'g1', 'b8', 'g8']), hl: ['b1', 'g1', 'b8', 'g8'], text: { en: 'The knights stand next to the rooks.', si: 'අශ්වයන් මාලිගා අසලින් තබන්න.' } },
        { pos: pick(START, ['a1', 'h1', 'a8', 'h8', 'b1', 'g1', 'b8', 'g8', 'c1', 'f1', 'c8', 'f8']), hl: ['c1', 'f1', 'c8', 'f8'], text: { en: 'The bishops stand next to the knights.', si: 'ඇතුන් අශ්වයන් අසලින් තබන්න.' } },
        { pos: pick(START, ['a1', 'h1', 'a8', 'h8', 'b1', 'g1', 'b8', 'g8', 'c1', 'f1', 'c8', 'f8', 'd1', 'd8']), hl: ['d1', 'd8'], text: { en: 'The queen goes on her own colour: the white queen on a light square, the black queen on a dark square.', si: 'රැජින ඇගේම පැහැයේ කොටුවේ තබන්න: සුදු රැජින ලා කොටුවේ, කළු රැජින තද කොටුවේ.' } },
        { pos: pick(START, [...rank(1), ...rank(8)]), hl: ['e1', 'e8'], text: { en: 'The king takes the last square, next to his queen.', si: 'රජු රැජින අසල ඉතිරි කොටුවේ තබන්න.' } },
        { pos: START, hl: [...rank(2), ...rank(7)], text: { en: 'The pawns fill the row in front. The board is ready!', si: 'පාබල සෙබළුන් ඉදිරි පේළිය පුරවයි. පුවරුව සූදානම්!' } },
      ], quiz: { q: { en: 'On which square does the white queen start?', si: 'සුදු රැජින ආරම්භ කරන්නේ කුමන කොටුවෙන්ද?' }, opts: ['d1', 'e1', 'd8'], a: 0 } },

      { id: 'rook', title: { en: 'How the rook moves', si: 'මාලිගාව ගමන් කරන ආකාරය' }, steps: [
        { pos: { d4: 'wR' }, dots: line('d4', ROOK), text: { en: 'The rook moves in straight lines: up, down, left or right.', si: 'මාලිගාව සරල රේඛාවලින් ගමන් කරයි: ඉහළට, පහළට, වමට හෝ දකුණට.' } },
        { move: ['d4', 'd8'], text: { en: 'It can go as far as it likes in one move.', si: 'එක් ගමනකින් එයට කැමති තරම් දුර යා හැක.' } },
        { pos: { d4: 'wR', d6: 'wP', g4: 'bN' }, dots: line('d4', ROOK, 8, { d6: 1, g4: 1 }), caps: ['g4'], text: { en: 'It cannot jump over pieces. It captures an enemy piece by landing on its square.', si: 'එයට කැබලි මතින් පැනිය නොහැක. සතුරු කැබැල්ලක කොටුවට ගොස් එය අල්ලා ගනී.' } },
        { move: ['d4', 'g4'], text: { en: 'The rook captures the knight.', si: 'මාලිගාව අශ්වයා අල්ලා ගනී.' } },
      ], quiz: { q: { en: 'Can a rook move diagonally?', si: 'මාලිගාවකට විකර්ණව ගමන් කළ හැකිද?' }, opts: [{ en: 'Yes', si: 'ඔව්' }, { en: 'No', si: 'නැත' }], a: 1 } },

      { id: 'bishop', title: { en: 'How the bishop moves', si: 'ඇතා ගමන් කරන ආකාරය' }, steps: [
        { pos: { d4: 'wB' }, dots: line('d4', BISH), text: { en: 'The bishop moves diagonally, as far as it likes.', si: 'ඇතා විකර්ණව, කැමති තරම් දුර ගමන් කරයි.' } },
        { move: ['d4', 'g7'], text: { en: 'From d4 to g7 in one move.', si: 'එක් ගමනකින් d4 සිට g7 දක්වා.' } },
        { pos: { c1: 'wB', f1: 'wB' }, soft: light(), hl: ['c1', 'f1'], text: { en: 'A bishop always stays on its colour. Each player has one light-square bishop and one dark-square bishop.', si: 'ඇතා සැමවිටම එකම පැහැයේ කොටුවල සිටී. සෑම ක්‍රීඩකයෙකුටම ලා කොටු ඇතෙක් සහ තද කොටු ඇතෙක් සිටී.' } },
      ], quiz: { q: { en: 'A bishop on a dark square can reach…', si: 'තද කොටුවක සිටින ඇතෙකුට යා හැක්කේ…' }, opts: [{ en: 'only dark squares', si: 'තද කොටුවලට පමණි' }, { en: 'any square', si: 'ඕනෑම කොටුවකට' }], a: 0 } },

      { id: 'queen', title: { en: 'How the queen moves', si: 'රැජින ගමන් කරන ආකාරය' }, steps: [
        { pos: { d4: 'wQ' }, dots: line('d4', [...ROOK, ...BISH]), text: { en: 'The queen moves like a rook and a bishop together: straight or diagonal, any distance.', si: 'රැජින මාලිගාවක් සහ ඇතෙකු එකට ගමන් කරන ලෙස ගමන් කරයි: කෙළින් හෝ විකර්ණව, ඕනෑම දුරක්.' } },
        { move: ['d4', 'h8'], text: { en: 'She is the strongest piece on the board.', si: 'ඇය පුවරුවේ ශක්තිමත්ම කැබැල්ලයි.' } },
        { pos: { d4: 'wQ' }, dots: line('d4', [...ROOK, ...BISH]), xs: KN('d4'), text: { en: 'The only move she cannot make is the knight’s L-jump.', si: 'ඇයට කළ නොහැකි එකම ගමන අශ්වයාගේ “L” පැනීමයි.' } },
      ], quiz: { q: { en: 'The queen moves like which two pieces together?', si: 'රැජින ගමන් කරන්නේ කුමන කැබලි දෙක එකට ගමන් කරන ලෙසද?' }, opts: [{ en: 'Rook + bishop', si: 'මාලිගාව + ඇතා' }, { en: 'Knight + bishop', si: 'අශ්වයා + ඇතා' }, { en: 'Rook + knight', si: 'මාලිගාව + අශ්වයා' }], a: 0 } },

      { id: 'king', title: { en: 'How the king moves', si: 'රජු ගමන් කරන ආකාරය' }, steps: [
        { pos: { e4: 'wK' }, dots: line('e4', [...ROOK, ...BISH], 1), text: { en: 'The king moves one square in any direction.', si: 'රජු ඕනෑම දිශාවකට එක් කොටුවක් ගමන් කරයි.' } },
        { move: ['e4', 'e5'], text: { en: 'Slow, but very important.', si: 'මන්දගාමී වුවත් ඉතා වැදගත්.' } },
        { pos: { e5: 'wK', a6: 'bR' }, dots: ['d5', 'f5', 'd4', 'e4', 'f4'], xs: ['d6', 'e6', 'f6'], soft: rank(6), text: { en: 'The king may never move to a square that is attacked. The black rook controls the 6th rank.', si: 'ප්‍රහාරයට ලක්වූ කොටුවකට රජුට කිසිවිටෙක යා නොහැක. කළු මාලිගාව 6 වන පේළිය පාලනය කරයි.' } },
      ], quiz: { q: { en: 'How many squares can the king move at a time?', si: 'රජුට එක් වරකට කොටු කීයක් ගමන් කළ හැකිද?' }, opts: ['1', '2', { en: 'Any number', si: 'ඕනෑම ගණනක්' }], a: 0 } },

      { id: 'knight', title: { en: 'How the knight moves', si: 'අශ්වයා ගමන් කරන ආකාරය' }, steps: [
        { pos: { d4: 'wN' }, dots: KN('d4'), text: { en: 'The knight moves in an L: two squares one way, then one square to the side.', si: 'අශ්වයා “L” හැඩයෙන් ගමන් කරයි: එක් දිශාවකට කොටු දෙකක්, ඉන්පසු පැත්තට එක් කොටුවක්.' } },
        { soft: ['d5', 'd6'], hl: ['e6'], text: { en: 'Two up, one to the right: d4 to e6.', si: 'ඉහළට දෙකක්, දකුණට එකක්: d4 සිට e6 දක්වා.' } },
        { move: ['d4', 'e6'], text: { en: 'Jump!', si: 'පනින්න!' } },
        { pos: { b1: 'wN', a2: 'wP', b2: 'wP', c2: 'wP', d2: 'wP' }, dots: ['a3', 'c3'], text: { en: 'The knight is the only piece that can jump over other pieces.', si: 'අනෙක් කැබලි මතින් පැනිය හැකි එකම කැබැල්ල අශ්වයායි.' } },
        { move: ['b1', 'c3'], text: { en: 'Every knight move lands on the opposite colour.', si: 'අශ්වයාගේ සෑම ගමනක්ම ප්‍රතිවිරුද්ධ පැහැයේ කොටුවකින් අවසන් වේ.' } },
      ], quiz: { q: { en: 'Which piece can jump over other pieces?', si: 'අනෙක් කැබලි මතින් පැනිය හැකි කැබැල්ල කුමක්ද?' }, opts: [{ en: 'Bishop', si: 'ඇතා' }, { en: 'Knight', si: 'අශ්වයා' }, { en: 'Queen', si: 'රැජින' }], a: 1 } },

      { id: 'pawn', title: { en: 'How the pawn moves', si: 'පාබල සෙබළා ගමන් කරන ආකාරය' }, steps: [
        { pos: { e2: 'wP' }, dots: ['e3', 'e4'], text: { en: 'A pawn moves straight forward. On its first move it may go one or two squares.', si: 'පාබල සෙබළා කෙළින්ම ඉදිරියට ගමන් කරයි. පළමු ගමනේදී කොටු එකක් හෝ දෙකක් යා හැක.' } },
        { move: ['e2', 'e4'], text: { en: 'Two squares forward: e2 to e4.', si: 'ඉදිරියට කොටු දෙකක්: e2 සිට e4 දක්වා.' } },
        { pos: { e4: 'wP' }, dots: ['e5'], text: { en: 'After that, only one square at a time. A pawn never moves backwards.', si: 'ඉන්පසු එක් වරකට එක් කොටුවක් පමණි. පාබල සෙබළා කිසිවිටෙක පසුපසට නොයයි.' } },
        { pos: { e4: 'wP', e5: 'bP', d5: 'bN' }, xs: ['e5'], caps: ['d5'], text: { en: 'It is blocked by the pawn in front. It captures one square diagonally forward.', si: 'ඉදිරියේ ඇති සෙබළා නිසා එය අවහිර වී ඇත. එය අල්ලා ගන්නේ ඉදිරියට විකර්ණව එක් කොටුවකින්.' } },
        { move: ['e4', 'd5'], text: { en: 'The pawn captures the knight.', si: 'පාබල සෙබළා අශ්වයා අල්ලා ගනී.' } },
        { pos: { e7: 'wP' }, dots: ['e8'], text: { en: 'A pawn that reaches the last rank…', si: 'අවසාන පේළියට ළඟාවන පාබල සෙබළා…' } },
        { move: ['e7', 'e8'], promote: { sq: 'e8', p: 'wQ' }, hl: ['e8'], text: { en: '…becomes a queen, rook, bishop or knight. This is called promotion.', si: '…රැජින, මාලිගාව, ඇතා හෝ අශ්වයා බවට පත්වේ. මෙය “උසස් කිරීම” ලෙස හැඳින්වේ.' } },
      ], quiz: { q: { en: 'How does a pawn capture?', si: 'පාබල සෙබළා අල්ලා ගන්නේ කෙසේද?' }, opts: [{ en: 'Straight forward', si: 'කෙළින්ම ඉදිරියට' }, { en: 'Diagonally forward', si: 'ඉදිරියට විකර්ණව' }, { en: 'Backwards', si: 'පසුපසට' }], a: 1 } },

      { id: 'values', title: { en: 'Captures and piece values', si: 'අල්ලා ගැනීම සහ කැබලිවල අගය' }, steps: [
        { pos: { b4: 'wP', c4: 'wN', d4: 'wB', e4: 'wR', f4: 'wQ', g4: 'wK' }, badges: { b4: '1', c4: '3', d4: '3', e4: '5', f4: '9', g4: '∞' }, text: { en: 'Pieces have points: pawn 1, knight 3, bishop 3, rook 5, queen 9.', si: 'කැබලිවලට ලකුණු ඇත: පාබල සෙබළා 1, අශ්වයා 3, ඇතා 3, මාලිගාව 5, රැජින 9.' } },
        { hl: ['g4'], badges: { g4: '∞' }, text: { en: 'The king is never captured. The game ends with checkmate before that can happen.', si: 'රජු කිසිවිටෙක අල්ලා ගනු නොලැබේ. ඊට පෙර “චෙක්මේට්” මගින් තරඟය අවසන් වේ.' } },
        { pos: { d1: 'wR', d7: 'bN', g8: 'bK', g1: 'wK', b7: 'bB' }, caps: ['d7'], badges: { d1: '5', d7: '3', b7: '3' }, text: { en: 'Count before you capture. Rook takes knight here, then the bishop takes back: you give 5 to win 3.', si: 'අල්ලා ගැනීමට පෙර ගණන් කරන්න. මෙහි මාලිගාව අශ්වයා අල්ලා ගනී, ඉන්පසු ඇතා ආපසු අල්ලා ගනී: 3ක් දිනීමට 5ක් දෙයි.' } },
      ], quiz: { q: { en: 'Which piece is worth the most points?', si: 'වැඩිම ලකුණු අගයක් ඇත්තේ කුමන කැබැල්ලටද?' }, opts: [{ en: 'Knight', si: 'අශ්වයා' }, { en: 'Rook', si: 'මාලිගාව' }, { en: 'Bishop', si: 'ඇතා' }], a: 1 } },
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
  const YES = T('Yes', 'ඔව්'), NO = T('No', 'නැත');

  window.PQ_PRACTICE = {
    board: [
      { type: 'choice', q: T('How many squares are on a chessboard?', 'චෙස් පුවරුවක කොටු කීයක් තිබේද?'), opts: ['32', '64', '100'], a: 1 },
      { type: 'square', pos: {}, q: T('Click the corner square that must be light on White’s right.', 'සුදු ක්‍රීඩකයාගේ දකුණු පස ලා පැහැති විය යුතු කොන් කොටුව ක්ලික් කරන්න.'), ans: ['h1'] },
      { type: 'square', pos: {}, q: T('Click any dark square.', 'ඕනෑම තද පැහැති කොටුවක් ක්ලික් කරන්න.'), ans: dark() },
      { type: 'choice', q: T('How many squares are in one row?', 'එක් පේළියක කොටු කීයක් තිබේද?'), opts: ['6', '8', '10'], a: 1 },
    ],
    'files-ranks': [
      { type: 'square', pos: {}, q: T('Click any square on the e-file.', 'e තීරුවේ ඕනෑම කොටුවක් ක්ලික් කරන්න.'), ans: file('e') },
      { type: 'square', pos: {}, q: T('Click any square on the 4th rank.', '4 වන පේළියේ ඕනෑම කොටුවක් ක්ලික් කරන්න.'), ans: rank(4) },
      { type: 'square', pos: {}, q: T('Click any square on the a-file.', 'a තීරුවේ ඕනෑම කොටුවක් ක්ලික් කරන්න.'), ans: file('a') },
      { type: 'choice', q: T('What are the columns of the board called?', 'පුවරුවේ සිරස් තීරු හඳුන්වන්නේ කුමන නමින්ද?'), opts: [T('Ranks', 'රෑන්ක්'), T('Files', 'ෆයිල්'), T('Diagonals', 'විකර්ණ')], a: 1 },
      { type: 'choice', pos: START, q: T('Black’s pieces start on which ranks?', 'කළු කැබලි ආරම්භ වන්නේ කුමන පේළිවලද?'), opts: ['1 & 2', '4 & 5', '7 & 8'], a: 2 },
    ],
    coordinates: [
      { type: 'square', pos: {}, q: T('Click e4.', 'e4 ක්ලික් කරන්න.'), ans: ['e4'] },
      { type: 'square', pos: {}, q: T('Click b7.', 'b7 ක්ලික් කරන්න.'), ans: ['b7'] },
      { type: 'square', pos: {}, q: T('Click h3.', 'h3 ක්ලික් කරන්න.'), ans: ['h3'] },
      { type: 'square', pos: {}, q: T('Click d5.', 'd5 ක්ලික් කරන්න.'), ans: ['d5'] },
      { type: 'choice', pos: {}, hl: ['g2'], q: T('What is the name of the gold square?', 'රන් පැහැති කොටුවේ නම කුමක්ද?'), opts: ['b7', 'g2', 'g7'], a: 1 },
      { type: 'choice', q: T('In a square’s name, what comes first?', 'කොටුවක නමේ මුලින්ම එන්නේ කුමක්ද?'), opts: [T('The letter', 'අකුර'), T('The number', 'අංකය')], a: 0 },
    ],
    army: [
      { type: 'square', pos: START, q: T('Click the white queen.', 'සුදු රැජින ක්ලික් කරන්න.'), ans: ['d1'] },
      { type: 'square', pos: START, q: T('Click the white king.', 'සුදු රජු ක්ලික් කරන්න.'), ans: ['e1'] },
      { type: 'square', pos: START, q: T('Click a black knight.', 'කළු අශ්වයෙකු ක්ලික් කරන්න.'), ans: ['b8', 'g8'] },
      { type: 'square', pos: START, q: T('Click a white bishop.', 'සුදු ඇතෙකු ක්ලික් කරන්න.'), ans: ['c1', 'f1'] },
      { type: 'choice', q: T('How many pieces does each player start with?', 'එක් ක්‍රීඩකයෙකු කැබලි කීයකින් ආරම්භ කරයිද?'), opts: ['8', '16', '32'], a: 1 },
    ],
    setup: [
      { type: 'square', pos: without(START, ['d1']), q: T('The white queen is missing. Click her starting square.', 'සුදු රැජින නැත. ඇය ආරම්භ කරන කොටුව ක්ලික් කරන්න.'), ans: ['d1'] },
      { type: 'square', pos: without(START, ['e8']), q: T('The black king is missing. Click his starting square.', 'කළු රජු නැත. ඔහු ආරම්භ කරන කොටුව ක්ලික් කරන්න.'), ans: ['e8'] },
      { type: 'square', pos: without(START, ['a1', 'h1']), q: T('Click a starting square of a white rook.', 'සුදු මාලිගාවක් ආරම්භ කරන කොටුවක් ක්ලික් කරන්න.'), ans: ['a1', 'h1'] },
      { type: 'square', pos: without(START, ['b1', 'g1']), q: T('Click a starting square of a white knight.', 'සුදු අශ්වයෙකු ආරම්භ කරන කොටුවක් ක්ලික් කරන්න.'), ans: ['b1', 'g1'] },
      { type: 'choice', q: T('The white queen starts on a…', 'සුදු රැජින ආරම්භ කරන්නේ…'), opts: [T('light square', 'ලා කොටුවක'), T('dark square', 'තද කොටුවක')], a: 0 },
    ],
    rook: [
      { type: 'move', pos: { d4: 'wR', d7: 'bN' }, q: T('Capture the knight with the rook.', 'මාලිගාවෙන් අශ්වයා අල්ලා ගන්න.'), ans: [['d4', 'd7']] },
      { type: 'square', pos: { a1: 'wR' }, q: T('Click a square the rook can move to.', 'මාලිගාවට යා හැකි කොටුවක් ක්ලික් කරන්න.'), ans: line('a1', ROOK) },
      { type: 'move', pos: { c3: 'wR', c6: 'wP', f3: 'bB', c8: 'bQ' }, q: T('Capture a black piece with the rook.', 'මාලිගාවෙන් කළු කැබැල්ලක් අල්ලා ගන්න.'), ans: [['c3', 'f3']] },
      { type: 'choice', q: T('Can a rook move diagonally?', 'මාලිගාවකට විකර්ණව ගමන් කළ හැකිද?'), opts: [YES, NO], a: 1 },
      { type: 'choice', pos: { d4: 'wR', d6: 'wP' }, q: T('Can this rook reach d8?', 'මෙම මාලිගාවට d8 වෙත යා හැකිද?'), opts: [YES, NO], a: 1 },
    ],
    bishop: [
      { type: 'move', pos: { c1: 'wB', g5: 'bN' }, q: T('Capture the knight with the bishop.', 'ඇතාගෙන් අශ්වයා අල්ලා ගන්න.'), ans: [['c1', 'g5']] },
      { type: 'square', pos: { d4: 'wB' }, q: T('Click a square the bishop can move to.', 'ඇතාට යා හැකි කොටුවක් ක්ලික් කරන්න.'), ans: line('d4', BISH) },
      { type: 'move', pos: { f1: 'wB', b5: 'bR', e4: 'wP' }, q: T('Capture the rook.', 'මාලිගාව අල්ලා ගන්න.'), ans: [['f1', 'b5']] },
      { type: 'choice', q: T('A bishop on a dark square can reach…', 'තද කොටුවක සිටින ඇතෙකුට යා හැක්කේ…'), opts: [T('only dark squares', 'තද කොටුවලට පමණි'), T('any square', 'ඕනෑම කොටුවකට')], a: 0 },
    ],
    queen: [
      { type: 'move', pos: { d1: 'wQ', d8: 'bR', a4: 'bP' }, q: T('Capture the rook with the queen.', 'රැජිනගෙන් මාලිගාව අල්ලා ගන්න.'), ans: [['d1', 'd8']] },
      { type: 'move', pos: { a1: 'wQ', h8: 'bR', a6: 'bN' }, q: T('Capture the rook in one move.', 'එක් ගමනකින් මාලිගාව අල්ලා ගන්න.'), ans: [['a1', 'h8']] },
      { type: 'square', pos: { d4: 'wQ' }, q: T('Click a square the queen can move to.', 'රැජිනට යා හැකි කොටුවක් ක්ලික් කරන්න.'), ans: line('d4', [...ROOK, ...BISH]) },
      { type: 'choice', q: T('The queen moves like which two pieces together?', 'රැජින ගමන් කරන්නේ කුමන කැබලි දෙක එකට ගමන් කරන ලෙසද?'), opts: [T('Rook + bishop', 'මාලිගාව + ඇතා'), T('Knight + bishop', 'අශ්වයා + ඇතා'), T('Rook + knight', 'මාලිගාව + අශ්වයා')], a: 0 },
    ],
    king: [
      { type: 'square', pos: { e4: 'wK' }, q: T('Click a square the king can move to.', 'රජුට යා හැකි කොටුවක් ක්ලික් කරන්න.'), ans: line('e4', [...ROOK, ...BISH], 1) },
      { type: 'square', pos: { e1: 'wK', a2: 'bR' }, q: T('The black rook controls the 2nd rank. Click a safe square for the king.', 'කළු මාලිගාව 2 වන පේළිය පාලනය කරයි. රජුට ආරක්ෂිත කොටුවක් ක්ලික් කරන්න.'), ans: ['d1', 'f1'] },
      { type: 'choice', q: T('How many squares can the king move at a time?', 'රජුට එක් වරකට කොටු කීයක් ගමන් කළ හැකිද?'), opts: ['1', '2', T('Any number', 'ඕනෑම ගණනක්')], a: 0 },
      { type: 'choice', q: T('Can a king move to a square that is attacked?', 'ප්‍රහාරයට ලක්වූ කොටුවකට රජුට යා හැකිද?'), opts: [YES, NO], a: 1 },
    ],
    knight: [
      { type: 'square', pos: { d4: 'wN' }, q: T('Click a square the knight can jump to.', 'අශ්වයාට පැනිය හැකි කොටුවක් ක්ලික් කරන්න.'), ans: KN('d4') },
      { type: 'move', pos: { g1: 'wN', h3: 'bP' }, q: T('Capture the pawn with the knight.', 'අශ්වයාගෙන් පාබල සෙබළා අල්ලා ගන්න.'), ans: [['g1', 'h3']] },
      { type: 'square', pos: { a1: 'wN' }, q: T('From the corner, click a square the knight can reach.', 'කොනේ සිට අශ්වයාට යා හැකි කොටුවක් ක්ලික් කරන්න.'), ans: KN('a1') },
      { type: 'move', pos: { b1: 'wN', a2: 'wP', b2: 'wP', c2: 'wP', d2: 'wP', c3: 'bB' }, q: T('Jump over the pawns and capture the bishop.', 'පාබල සෙබළුන් මතින් පැන ඇතා අල්ලා ගන්න.'), ans: [['b1', 'c3']] },
      { type: 'choice', q: T('Which piece can jump over other pieces?', 'අනෙක් කැබලි මතින් පැනිය හැකි කැබැල්ල කුමක්ද?'), opts: [T('Bishop', 'ඇතා'), T('Knight', 'අශ්වයා'), T('Queen', 'රැජින')], a: 1 },
    ],
    pawn: [
      { type: 'square', pos: { e2: 'wP' }, q: T('Click a square this pawn can move to.', 'මෙම පාබල සෙබළාට යා හැකි කොටුවක් ක්ලික් කරන්න.'), ans: ['e3', 'e4'] },
      { type: 'move', pos: { d4: 'wP', d5: 'bP', e5: 'bN' }, q: T('Capture the knight with the pawn.', 'පාබල සෙබළාගෙන් අශ්වයා අල්ලා ගන්න.'), ans: [['d4', 'e5']] },
      { type: 'move', pos: { a7: 'wP', h8: 'bK' }, q: T('Promote the pawn.', 'පාබල සෙබළා උසස් කරන්න.'), ans: [['a7', 'a8']], promote: 'wQ' },
      { type: 'choice', pos: { c4: 'wP', c5: 'bP' }, q: T('Can the white pawn move?', 'සුදු පාබල සෙබළාට ගමන් කළ හැකිද?'), opts: [YES, NO], a: 1 },
      { type: 'choice', q: T('How does a pawn capture?', 'පාබල සෙබළා අල්ලා ගන්නේ කෙසේද?'), opts: [T('Straight forward', 'කෙළින්ම ඉදිරියට'), T('Diagonally forward', 'ඉදිරියට විකර්ණව'), T('Backwards', 'පසුපසට')], a: 1 },
    ],
    values: [
      { type: 'move', pos: { e4: 'wN', d6: 'bR', f6: 'bP', g5: 'bB' }, q: T('Capture the most valuable black piece.', 'වැඩිම අගයක් ඇති කළු කැබැල්ල අල්ලා ගන්න.'), ans: [['e4', 'd6']] },
      { type: 'choice', q: T('How many points is a queen worth?', 'රැජිනගේ අගය ලකුණු කීයද?'), opts: ['5', '9', '3'], a: 1 },
      { type: 'choice', q: T('Which piece is worth the most points?', 'වැඩිම ලකුණු අගයක් ඇත්තේ කුමන කැබැල්ලටද?'), opts: [T('Knight', 'අශ්වයා'), T('Rook', 'මාලිගාව'), T('Bishop', 'ඇතා')], a: 1 },
      { type: 'choice', q: T('You give a rook (5) for a knight (3). You…', 'ඔබ අශ්වයෙකු (3) සඳහා මාලිගාවක් (5) දෙයි. ඔබ…'), opts: [T('win 2 points', 'ලකුණු 2ක් දිනයි'), T('lose 2 points', 'ලකුණු 2ක් අහිමි කරයි'), T('stay equal', 'සමාන වේ')], a: 1 },
      { type: 'move', pos: { c1: 'wB', h6: 'bQ', a3: 'bP', g1: 'wK', g8: 'bK' }, q: T('Win the most points with one capture.', 'එක් අල්ලා ගැනීමකින් වැඩිම ලකුණු දිනන්න.'), ans: [['c1', 'h6']] },
    ],
  };
})();
