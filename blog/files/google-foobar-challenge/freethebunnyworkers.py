from itertools import combinations


def solution(num_buns, num_required):
    specification = [[] for i in range(num_buns)]
    comb = combinations(range(num_buns), num_buns - num_required + 1)
    for i, c in enumerate(comb):
        for ind in c:
            specification[ind].append(i)

    return specification
