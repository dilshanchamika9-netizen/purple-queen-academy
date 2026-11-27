// Builds database.rules.json (Realtime Database rules for live games) from readable parts.
// Run: node tools/build-db-rules.mjs   (CI checks the committed file is up to date)
//
// Data layout
//   staff/{uid}            true for coaches/arbiters (written only by the admin workflow)
//   dir/{sid}              {uid, name, on}  student directory, written by the student (sid = login ID, lower case)
//   ch/{toUid}/{fromUid}   challenge {name, base, inc, col, at, g?}  (g = game id once accepted)
//   games/{g}/meta         {w, b, wn, bn, base, inc, ns, rated, watch, startAt, by, tid?}
//   games/{g}/n            number of half-moves played
//   games/{g}/clk          {t, w, b}  server time of the last move and both clocks (ms) after it
//   games/{g}/moves/{i}    {s: uci move, t: server time}
//   games/{g}/offer        {by, n} draw offer
//   games/{g}/result       {r: '1-0'|'0-1'|'1/2-1/2'|'*', why, by, t}
//   pres/{g}/{uid}         true while connected (onDisconnect removes it)
import { writeFileSync, readFileSync } from 'node:fs';

const TOL = 1000;                       // ms of lag allowed per move
const DELAY = 3000;                     // the clocks start 3 s after the game is created (countdown on screen)
const G = "root.child('games/' + $g)";
const W = `${G}.child('meta/w').val()`, B = `${G}.child('meta/b').val()`;
const N0 = `${G}.child('n').val()`;
const INC = `${G}.child('meta/inc').val()`;
const CLK = (k) => `${G}.child('clk/${k}').val()`;
const open = `!${G}.child('result').exists()`;
const staff = "root.child('staff/' + auth.uid).val() == true";
const player = `(auth.uid == ${W} || auth.uid == ${B})`;
const whiteToMove = `${N0} % 2 == 0`;
const mover = `auth.uid == (${whiteToMove} ? ${W} : ${B})`;
const student = "auth.token.email.matches(/^[a-z0-9]+@pq-students[.]example[.]com$/)";
const nextKey = `'' + ${N0}`;
const and = (...a) => a.map(x => `(${x})`).join(' && ');
const or = (...a) => a.map(x => `(${x})`).join(' || ');

// a move: write n, clk and moves/{n} together in one update
const nWrite = and('auth != null', open, mover,
  `newData.isNumber() && newData.val() == ${N0} + 1`,
  `newData.parent().child('moves/' + ${N0} + '/t').val() == now`,
  "newData.parent().child('clk/t').val() == now");

const sideClock = (me, other) => and(
  `newData.child('${other}').val() == data.child('${other}').val()`,
  `now - data.child('t').val() <= data.child('${me}').val() + ${TOL}`,
  `newData.child('${me}').isNumber() && newData.child('${me}').val() <= data.child('${me}').val() + ${INC} - (now > data.child('t').val() ? now - data.child('t').val() : 0) + ${TOL}`,
  `newData.child('${me}').val() >= 0 - ${TOL}`);
const clkWrite = and('auth != null', open, mover,
  `newData.parent().child('n').val() == ${N0} + 1`,
  "newData.child('t').val() == now",
  `${whiteToMove} ? ${sideClock('w', 'b')} : ${sideClock('b', 'w')}`);

const moveWrite = and('auth != null', open, mover, '!data.exists()',
  `$m == ${nextKey}`,
  `newData.parent().parent().child('n').val() == ${N0} + 1`);
const moveValidate = and("newData.hasChildren(['s', 't'])", "newData.child('s').isString()",
  "newData.child('s').val().matches(/^[a-h][1-8][a-h][1-8][qrbn]?$/)", "newData.child('t').val() == now");

// results a player may write (an arbiter may write any result, also over an existing one)
const R = "newData.child('r').val()", WHY = "newData.child('why').val()";
const flagged = (side) => `now - ${CLK('t')} >= ${CLK(side)}`;
const resultOk = and(
  "newData.child('by').val() == auth.uid", "newData.child('t').val() == now",
  or(
    and(`${WHY} == 'resign'`, `${R} == (auth.uid == ${W} ? '0-1' : '1-0')`),
    and(`${WHY} == 'abort'`, `${N0} < 2`, `${R} == '*'`),
    and(`${WHY} == 'agree'`, `${R} == '1/2-1/2'`, `${G}.child('offer/by').exists()`,
      `${G}.child('offer/by').val() != auth.uid`, `${G}.child('offer/n').val() >= ${N0} - 1`),
    and(`${WHY} == 'time'`, `${whiteToMove} ? (${flagged('w')} && (${R} == '0-1' || ${R} == '1/2-1/2')) : (${flagged('b')} && (${R} == '1-0' || ${R} == '1/2-1/2'))`),
    and(`${WHY} == 'noshow'`, or(
      and(`${N0} == 0`, `auth.uid == ${B}`, `now - ${G}.child('meta/startAt').val() >= ${G}.child('meta/ns').val() + ${DELAY}`, `${R} == '0-1'`),
      and(`${N0} == 1`, `auth.uid == ${W}`, `now - ${CLK('t')} >= ${G}.child('meta/ns').val()`, `${R} == '1-0'`))),
    // checkmate is written by the player who is mated (the side to move), so it cannot be faked by the winner
    and(`${WHY} == 'mate'`, mover, `${R} == (${whiteToMove} ? '0-1' : '1-0')`),
    // board draws: either player; the other client replays the moves and opens a dispute if the claim is false
    and(`${WHY} == 'stalemate' || ${WHY} == 'repetition' || ${WHY} == 'fifty' || ${WHY} == 'material'`, `${R} == '1/2-1/2'`)
  ));
const resultWrite = or('auth != null && ' + staff, and('auth != null', '!data.exists()', open, player, resultOk));

// creating a game: only by an arbiter, or by the player who accepts a challenge from the other player
const M = (k) => `newData.child('meta/${k}').val()`;
const other = `(auth.uid == ${M('w')} ? ${M('b')} : ${M('w')})`;
const createGame = and('auth != null', '!data.exists()', `${M('by')} == auth.uid`,
  `${M('w')} != ${M('b')}`, `newData.child('meta/w').isString() && newData.child('meta/b').isString()`,
  or(staff, and(`auth.uid == ${M('w')} || auth.uid == ${M('b')}`, `root.child('ch/' + auth.uid + '/' + ${other}).exists()`)),
  `${M('startAt')} == now`, `newData.child('n').val() == 0`,
  `newData.child('clk/t').val() >= now + ${DELAY} - 2000 && newData.child('clk/t').val() <= now + ${DELAY} + 2000`,
  `newData.child('clk/w').val() == ${M('base')} && newData.child('clk/b').val() == ${M('base')}`,
  `${M('base')} >= 60000 && ${M('base')} <= 7200000`, `${M('inc')} >= 0 && ${M('inc')} <= 60000`,
  `${M('ns')} >= 60000 && ${M('ns')} <= 900000`,
  "!newData.child('result').exists() && !newData.child('moves').exists() && !newData.child('offer').exists()");

const rules = {
  rules: {
    '.read': false, '.write': false,
    staff: { $uid: { '.read': 'auth != null && auth.uid == $uid', '.write': false } },
    dir: {
      '.read': 'auth != null',
      $sid: {
        '.write': `auth != null && ${student} && auth.token.email == $sid + '@pq-students.example.com'`,
        '.validate': "newData.child('uid').val() == auth.uid && newData.child('name').isString() && newData.child('name').val().length <= 40",
      },
    },
    ch: {
      $to: {
        '.read': 'auth != null && auth.uid == $to',
        $from: {
          '.read': 'auth != null && (auth.uid == $to || auth.uid == $from)',
          // the challenger creates or withdraws it; the receiver (or an arbiter) may only answer or delete an existing one
          '.write': `auth != null && (auth.uid == $from || ((auth.uid == $to || ${staff}) && data.exists()))`,
          '.validate': "!newData.exists() || (newData.child('base').isNumber() && newData.child('inc').isNumber() && newData.child('name').isString() && newData.child('name').val().length <= 40)",
        },
      },
    },
    games: {
      $g: {
        '.read': `auth != null && (${player.replaceAll(G, 'data')} || ${staff} || data.child('meta/watch').val() == true)`,
        '.write': or(createGame, `auth != null && ${staff}`),
        n: { '.write': nWrite },
        clk: { '.write': clkWrite },
        moves: { $m: { '.write': moveWrite, '.validate': moveValidate } },
        offer: {
          '.write': and('auth != null', open, player,
            `!newData.exists() || (newData.child('by').val() == auth.uid && newData.child('n').val() == ${N0})`),
        },
        // preset messages only (no free text): k = index of the message, 0 to 5
        msg: { $uid: {
          '.write': and('auth != null', 'auth.uid == $uid', player),
          '.validate': "newData.child('k').isNumber() && newData.child('k').val() >= 0 && newData.child('k').val() <= 5 && newData.child('t').val() == now",
        } },
        result: {
          '.write': resultWrite,
          '.validate': "newData.child('r').val() == '1-0' || newData.child('r').val() == '0-1' || newData.child('r').val() == '1/2-1/2' || newData.child('r').val() == '*'",
        },
      },
    },
    // each player's own game list: ug/{uid}/{g} = {opp, oppName, col, r, why, tc, rated, t}
    ug: { $uid: { '.read': `auth != null && (auth.uid == $uid || ${staff})`, $g: {
      '.write': 'auth != null && auth.uid == $uid',
      '.validate': "newData.child('r').isString() && newData.child('oppName').isString() && newData.child('oppName').val().length <= 40",
    } } },
    pres: { $g: { '.read': 'auth != null', $uid: { '.write': 'auth != null && auth.uid == $uid' } } },
  },
};

const out = JSON.stringify(rules, null, 2) + '\n';
if (process.argv.includes('--check')) {
  const cur = readFileSync('database.rules.json', 'utf8');
  if (cur !== out) { console.error('database.rules.json is out of date: run node tools/build-db-rules.mjs'); process.exit(1); }
  console.log('database.rules.json is up to date');
} else { writeFileSync('database.rules.json', out); console.log('database.rules.json written'); }
