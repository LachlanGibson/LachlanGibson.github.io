from collections import Counter
from math import factorial


def solution(w, h, s):
    """Returns the number of unique, non-equivalent configurations

    The number of unique, non-equivalent configurations that can be found on a
    grid w blocks wide and h blocks tall where each point has s possible
    states. Equivalency is defined as above: any two grids with each point in
    the same state where the actual order of the rows and columns do not matter
    (and can thus be freely swapped around).

    The symmetries of grids form a group. Specifically, the direct product of
    two finite symmetric groups Sw x Sh. This is because grids are symmetric
    under row permutations and column permutations independently. A symmetric
    group of degree n has an order of n!, so the order of Sw x Sh is w!h!.

    The number of configurations is equivalent to the number of orbits in the
    group Sw x Sh. This can be computed using Burnside's counting theorem.

    = 1/w!h! * sum(s^(number of cycles in g)) for every g in Sw x Sh.

    Therefore, the computation can be accelerated by combining the number of
    permutations that share the same cycles.

    Parameters
    ----------
    w : int
        Grid width, [1,12].
    h : int
        Grid height, [1,12].
    s : int
        Number of allowed states, [2,20].

    Returns
    -------
    config : str
        Number of unique, non-equivalent configurations as a decimal string.

    """

    def gcd(a, b):
        # Euclidean algorithm finds the greatest common divisor of +ints a & b
        while b != 0:
            a, b = b, a % b
        return a

    def generate_cycle_lengths(n, m):
        # returns a list of lists containing all combinations of cycle lengths
        # in descending order that add to n without exceeding m.
        h = min(n, m)
        if h <= 0:
            return [[]]
        combinations = []
        for l in range(h, 0, -1):
            for c in generate_cycle_lengths(n - l, l):
                combinations.append([l] + c)
        return combinations

    def num_perms(cycle_counter, n):
        # Number of permutations that contain the cycles in cycle_counter
        num = factorial(n)
        for length, ammount in cycle_counter.items():
            num = num // (length**ammount * factorial(ammount))
        return num

    config = 0
    for w_combs in generate_cycle_lengths(w, w):
        w_num = num_perms(Counter(w_combs), w)
        for h_combs in generate_cycle_lengths(h, h):
            h_num = num_perms(Counter(h_combs), h)
            num_cycles = sum(sum(gcd(a, b) for a in h_combs) for b in w_combs)
            config += w_num * h_num * s**num_cycles
    config = config // (factorial(w) * factorial(h))
    return str(config)
