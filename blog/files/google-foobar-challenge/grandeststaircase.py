def solution(n):
    _ways = {}

    def ways(x):
        if x in _ways:
            return _ways[x]
        N, M, S = x
        if N > M * (M + 1) // 2:
            result = 0
        elif S <= 0 and N == 0:
            result = 1
        else:
            heights = range(1, min(M, N) + 1)
            result = sum(ways((N - k, k - 1, max(0, S - 1))) for k in heights)
        _ways[x] = result
        return result

    return ways((n, n, 2))
