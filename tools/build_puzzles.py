"""Read the Lichess puzzle CSV (CC0) from stdin and write assets/data/puzzles.json.
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
seen = {l[0]: 0 for l in LEVELS}
res = {l[0]: [] for l in LEVELS}
rd = csv.reader(sys.stdin)
next(rd)
for row in rd:
    try:
        pid, fen, moves, rating, rdev, pop, plays, themes = row[0], row[1], row[2], int(row[3]), int(row[4]), int(row[5]), int(row[6]), row[7]
    except (ValueError, IndexError):
        continue
    if rdev > 85 or pop < 88 or plays < 400:
        continue
    mv = moves.split()
    if len(mv) < 2 or len(mv) > 8:
        continue
    for lid, lo, hi, cnt in LEVELS:
        if lo <= rating <= hi:
            if lid == 1 and len(mv) > 4:
                break  # beginners: at most 2 moves to find
            item = {'id': pid, 'fen': fen, 'm': moves, 'r': rating, 't': [t for t in themes.split() if t in KEEP_THEMES]}
            seen[lid] += 1
            if len(res[lid]) < cnt * POOL:
                res[lid].append(item)
            else:
                j = random.randrange(seen[lid])
                if j < cnt * POOL:
                    res[lid][j] = item
            break
out = []
for lid, lo, hi, cnt in LEVELS:
    pool = res[lid]
    random.shuffle(pool)
    picked, counts = [], {}
    for it in pool:  # theme balance: no single primary theme above 35%
        key = next((t for t in it['t'] if t in PRIMARY), 'other')
        if counts.get(key, 0) >= cnt * 0.35:
            continue
        counts[key] = counts.get(key, 0) + 1
        picked.append(it)
        if len(picked) == cnt:
            break
    picked.sort(key=lambda x: x['r'])
    for it in picked:
        it['l'] = lid
    out += picked
    print(f'level {lid}: {len(picked)} puzzles (pool {len(pool)}, seen {seen[lid]})', file=sys.stderr)
import os; os.makedirs('assets/data', exist_ok=True)
json.dump({'source': 'Lichess puzzle database (CC0), database.lichess.org', 'count': len(out), 'puzzles': out},
          open('assets/data/puzzles.json', 'w'), separators=(',', ':'))
print('total', len(out), file=sys.stderr)
