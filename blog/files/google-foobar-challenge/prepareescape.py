def solution(map):
    def a_star(map):
        def manhattan_dist(a, b):
            return sum([abs(i - j) for i, j in zip(a, b)])

        def passable(p):
            x, y = p
            return x >= 0 and x < w and y >= 0 and y < h and map[y][x] == 0

        # Generate graph
        edges = dict()
        for x in range(w):
            for y in range(h):
                edges[(x, y)] = []
                for c in [(x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)]:
                    if passable(c):
                        edges[(x, y)].append(c)
        # Initialise algorithm
        start, finish = (w - 1, h - 1), (0, 0)
        v_open, v_closed = set([start]), set()
        dist_t, dist_h = {start: 0}, {start: manhattan_dist(start, finish)}
        continue_loop = True
        c = start
        while continue_loop:
            for adj in edges[c]:
                t = dist_t[c] + 1
                if adj in v_open:
                    if t < dist_t[adj]:
                        dist_t[adj] = t
                        dist_h[adj] = t + manhattan_dist(adj, finish)
                elif adj not in v_closed:
                    v_open.add(adj)
                    dist_t[adj] = t
                    dist_h[adj] = t + manhattan_dist(adj, finish)
            v_closed.add(c)
            v_open.remove(c)

            if len(v_open) < 1:
                continue_loop = False
                distance = -2
            else:
                c = min([(dist_h[v], v) for v in v_open])[1]
                if c == finish:
                    continue_loop = False
                    distance = dist_t[finish]
        return distance + 1

    # Run A* on all possible maps
    h, w = len(map), len(map[0])
    dist_list = [a_star(map)]
    for x in range(w):
        for y in range(h):
            if map[y][x]:
                map[y][x] = 0
                dist_list.append(a_star(map))
                map[y][x] = 1
    return min(d for d in dist_list if d >= 0)
