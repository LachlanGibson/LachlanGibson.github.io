def solution(entrances, exits, path):
    """
    Push-Relabel Algorithm for Maximum Flow
    """
    # Trivial case where there is one entrance and one exit and no other rooms
    if len(path) == 2:
        return min(sum(row) for row in path)

    cap = path

    def add_super_node(nodes, source):
        # add a single source/sink to account for all other sources/sinks
        for row in cap:
            row.append(0)
        cap.append([0 for i in range(len(cap) + 1)])
        for s in nodes:
            if source:
                cap[-1][s] = sum(cap[s])
            else:
                cap[s][-1] = sum(row[s] for row in cap)

    def push(u, v, delta=None):
        # increase flow from node u to node v
        if delta is None:
            delta = min(excess[u], cap[u][v] - flow[u][v])
        flow[u][v] += delta
        flow[v][u] -= delta
        excess[u] -= delta
        excess[v] += delta

    def relabel(u):
        # change height of node u
        height[u] = 1 + min(h for v, h in enumerate(height) if cap[u][v] > flow[u][v])

    def find_excess_nodes():
        # list of non-sorce/sink nodes with excess flow
        return [i for i, e in enumerate(excess) if e and i != s and i != t]

    # Create super source and super sink if needed
    s, t = entrances[0], exits[0]
    if len(entrances) > 1:
        add_super_node(entrances, True)
        s = len(cap) - 1
    if len(exits) > 1:
        add_super_node(exits, False)
        t = len(cap) - 1

    n = len(cap)
    nodes = range(n)
    graph = {i: [j for j in nodes if cap[i][j] or cap[j][i]] for i in nodes}

    # initialise heights and pre-flow
    height = [0 for u in nodes]
    height[s] = n
    excess = [0 for u in nodes]
    flow = [[0 for v in nodes] for u in nodes]
    for v in graph[s]:
        if cap[s][v]:
            push(s, v, delta=cap[s][v])

    excess_nodes = find_excess_nodes()
    while len(excess_nodes) > 0:
        relabel_check = True
        # choose excess node with largest height
        u = max((height[i], i) for i in excess_nodes)[1]
        # prioritise push if possible
        for v in graph[u]:
            if cap[u][v] > flow[u][v] and height[u] == height[v] + 1:
                push(u, v)
                relabel_check = False
                break
        if relabel_check:
            relabel(u)
        else:
            excess_nodes = find_excess_nodes()

    return sum(flow[s])
