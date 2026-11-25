"""Read the Lichess puzzle CSV (CC0) from stdin and write assets/data/puzzles.json (public practice) and assets/data/hwpuzzles.json (homework pool).
Usage: curl -L https://database.lichess.org/lichess_db_puzzle.csv.zst | zstd -dc | python3 tools/build_puzzles.py
"""
import csv, sys, json, random
random.seed(64)
LEVELS = [  # (id, min rating, max rating, count)
    (1, 0, 999, 400), (2, 1000, 1299, 400), (3, 1300, 1599, 400), (4, 1600, 1999, 400), (5, 2000, 9999, 400)]
KEEP_THEMES = {'mateIn1', 'mateIn2', 'mateIn3', 'mate', 'fork', 'pin', 'skewer', 'hangingPiece', 'discoveredAttack', 'doubleCheck',
               'sacrifice', 'deflection', 'attraction', 'backRankMate', 'smotheredMate', 'promotion', 'advancedPawn', 'endgame',
               'middlegame', 'opening', 'trappedPiece', 'interference', 'xRayAttack', 'zugzwang', 'quietMove', 'defensiveMove',
               'capturingDefender', 'rookEndgame', 'pawnEndgame', 'queenEndgame', 'bishopEndgame', 'knightEndgame',
               'exposedKing', 'kingsideAttack', 'queensideAttack'}
PRIMARY = ('mateIn1', 'mateIn2', 'mateIn3', 'fork', 'pin', 'skewer', 'hangingPiece', 'discoveredAttack', 'endgame', 'sacrifice')
POOL = 6
NEW = ('pin', 'fork', 'discoveredAttack', 'mateIn2', 'mateIn3')   # pin, double attack (fork), discovered attack, mate in 2, mate in 3
PUB_EXTRA = 20      # extra public puzzles per level per new theme (5 x 20 = 100 per level)
HW_NEW = 60         # homework puzzles per level per new theme (5 x 60 = 300), the other 300 per level mix all other themes
HW_PER_LEVEL = 600
import os
OLD = []
if os.path.exists('assets/data/puzzles.json'):
    OLD = json.load(open('assets/data/puzzles.json'))['puzzles']
OLD_IDS = {p['id'] for p in OLD}


class Res:
    def __init__(self, n):
        self.n, self.seen, self.items = n, 0, []

    def add(self, it):
        self.seen += 1
        if len(self.items) < self.n:
            self.items.append(it)
        else:
            j = random.randrange(self.seen)
            if j < self.n:
                self.items[j] = it


pub = {(l[0], th): Res(PUB_EXTRA * POOL) for l in LEVELS for th in NEW}
hwn = {(l[0], th): Res(HW_NEW * POOL) for l in LEVELS for th in NEW}
hwo = {l[0]: Res((HW_PER_LEVEL - HW_NEW * len(NEW)) * POOL) for l in LEVELS}
seen = {l[0]: 0 for l in LEVELS}
rd = csv.reader(sys.stdin)
next(rd)
for row in rd:
    try:
        pid, fen, moves, rating, rdev, pop, plays, themes = row[0], row[1], row[2], int(row[3]), int(row[4]), int(row[5]), int(row[6]), row[7]
    except (ValueError, IndexError):
        continue
    if rdev > 85 or pop < 88 or plays < 400 or pid in OLD_IDS:
        continue
    mv = moves.split()
    if len(mv) < 2 or len(mv) > 8:
        continue
    th = [x for x in themes.split() if x in KEEP_THEMES]
    nt = next((x for x in NEW if x in th), None)
    for lid, lo, hi, cnt in LEVELS:
        if lo <= rating <= hi:
            if lid == 1 and len(mv) > 4 and nt != 'mateIn3':
                break  # beginners: at most 2 moves to find (three-move mates only as their own theme)
            seen[lid] += 1
            item = {'id': pid, 'fen': fen, 'm': moves, 'r': rating, 't': th}
            if nt:
                pub[(lid, nt)].add(item)
                hwn[(lid, nt)].add(item)
            else:
                hwo[lid].add(item)
            break

extra, hw, used = [], [], set()
for lid, lo, hi, cnt in LEVELS:
    for th in NEW:  # public additions first
        c = pub[(lid, th)].items
        random.shuffle(c)
        for it in c[:PUB_EXTRA]:
            it = dict(it); it['l'] = lid; extra.append(it); used.add(it['id'])
for lid, lo, hi, cnt in LEVELS:
    lvl = []
    for th in NEW:
        c = [x for x in hwn[(lid, th)].items if x['id'] not in used]
        random.shuffle(c)
        lvl += c[:HW_NEW]
    rest = [x for x in hwo[lid].items if x['id'] not in used]
    random.shuffle(rest)
    counts, other = {}, []
    for it in rest:  # no single primary theme above 25% of the mixed part
        key = next((x for x in it['t'] if x in PRIMARY), 'other')
        if counts.get(key, 0) >= (HW_PER_LEVEL - len(lvl)) * 0.25 + 1:
            continue
        counts[key] = counts.get(key, 0) + 1
        other.append(it)
        if len(lvl) + len(other) == HW_PER_LEVEL:
            break
    lvl += other
    for it in lvl:
        it = dict(it); it['l'] = lid; hw.append(it)
    print(f'level {lid}: +{sum(1 for e in extra if e["l"] == lid)} public, {len(lvl)} homework (seen {seen[lid]})', file=sys.stderr)
random.shuffle(hw)
os.makedirs('assets/data', exist_ok=True)
src = 'Lichess puzzle database (CC0), database.lichess.org'
if not OLD:
    print('WARNING: no existing puzzles.json, public set has only the extra puzzles', file=sys.stderr)
pubout = OLD + extra
json.dump({'source': src, 'count': len(pubout), 'puzzles': pubout}, open('assets/data/puzzles.json', 'w'), separators=(',', ':'))
json.dump({'source': src, 'count': len(hw), 'puzzles': hw}, open('assets/data/hwpuzzles.json', 'w'), separators=(',', ':'))
print('public', len(pubout), 'homework', len(hw), file=sys.stderr)
