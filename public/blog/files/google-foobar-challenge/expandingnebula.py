from collections import defaultdict


def solution(g):
    """Returns the number of unique states that can step into g

    g is a boolean array (list of lists of bools) that is an outcome of a
    previous state, s, such that for all rows and cols g[row][col] is True
    if and only if exactly one of the following is True:
    s[row][col], s[row+1][col], s[row][col+1], s[row+1][col+1].

    solution(g) returns the number of unique previous states s that can
    produce g. It does this efficiently in four steps:
        Firstly, rows of g and s are represented as the decimal integers that
        are equal to a binary integer where each digit is given by the column
        of that row. For example, [True, False, True] is "101" in binary which
        is equal to 5 in decimal. Representing the rows as integers allows
        efficient boolean computations using the bitwise operations
        &, |, <<, >>.

        Secondly, every combination of row pairs of s is simulated to generate
        a possible row in g. If such a row exists in g, then these potential
        row pairs are recorded in a dictionary called potentials.

        Thirdly, for every row in g, all possible values of the corresponding
        row in g are tracked as well as the number of unique ways to reach that
        combination, given all the previous rows.

        Fourthly, the total number of unique states, s, is given by adding up
        the number of ways the last row of s is possible for each possible
        value of that last row.

    Parameters
    ----------
    g : list
        list of lists of boolean values with 3-9 rows inclusive, and 3-50
        columns inclusive.

    Returns
    -------
    num_states : int
        The number of possible previous states that could have resulted in g.
        The solution will always be less than one billion (10^9).
    """
    # Minimise the number of columns by transposition
    # This minimizes the number of combinations in two rows
    n, m = len(g), len(g[0])
    if m > n:
        g = transpose(g)
        n, m = m, n

    # Represent each row of g as an integer
    g_ints = [bool_list2int(bl) for bl in g]

    # Find all row pairs that can step into rows of g
    potentials = find_potentials(g_ints, m)

    # Go through each row of g_ints, keeping track of possible rows of the
    # previous row in the previous time step, and the number of ways that row
    # is possible.

    # Initially the first row of the previous timestep could be anything with
    # 1 way for each possibility.
    previous_row = {i: 1 for i in range(2 ** (m + 1))}
    for row in g_ints:
        # current_row tracks the possible values of the current row in the
        # previous timestep as keys, and the number of ways to reach that
        # state as the value.
        current_row = defaultdict(int)
        for i in previous_row:
            for j in potentials[(row, i)]:
                # Accumulate the num of ways of every potential row combination
                current_row[j] += previous_row[i]
        previous_row = current_row

    # The total number of states that can produce the current state is the
    # sum of all ways each potential last row could be produced.
    num_states = sum(previous_row.values())

    return num_states


def find_potentials(g_ints, m):
    """Find all row pairs that can step into a row in the current boolean array


    Parameters
    ----------
    g_ints : list
        A list of integers where each integer represents a row in the boolean
        array of a latter timestep.
    m : int
        The number of columns in the latter array.

    Returns
    -------
    potentials : defaultdict(list)
        A defaultdict containing all combinations of rows that step into a
        row in g_ints. For a given key of the form (row, i), where row is an
        integer in g_ints, the value is a list of integers that work with i to
        step into row.

    """
    potentials = defaultdict(list)
    for i in range(2 ** (m + 1)):
        for j in range(2 ** (m + 1)):
            s = step_row_int(i, j, m)
            if s in g_ints:
                potentials[(s, i)].append(j)
    return potentials


def step_row_int(r1, r2, n):
    """

    Imagine the two boolean rows:
    [
      [r1c1,r1c2,r1c3,...,r1cn,r1cn+1],
      [r2c1,r2c2,r2c3,...,r2cn,r2cn+1]
    ]
    r1 is the int rep of [r1c1,r1c2,r1c3,...,r1cn,r1cn+1],
    r2 is the int rep of [r2c1,r2c2,r2c3,...,r2cn,r2cn+1],
    a  is the int rep of [r1c1,r1c2,r1c3,...,r1cn],
    b  is the int rep of      [r1c2,r1c3,...,r1cn,r1cn+1],
    c is the int rep of [r2c1,r2c2,r2c3,...,r2cn],
    d is the int rep of      [r2c2,r2c3,...,r2cn,r2cn+1],

    Parameters
    ----------
    r1 : int
        Integer representation of a row of booleans.
    r2 : int
        Integer representation of the next row of booleans.
    n : int
        The number of elements in the row after the step.

    Returns
    -------
    int
        Integer representation of the boolean row after a time step.
    """
    # [[a,b],[c,d]]
    b, d, a, c = r1 & ~(1 << n), r2 & ~(1 << n), r1 >> 1, r2 >> 1
    na, nb, nc, nd = ~a, ~b, ~c, ~d
    return (
        (a & nb & nc & nd)
        | (na & b & nc & nd)
        | (na & nb & c & nd)
        | (na & nb & nc & d)
    )


def bool_list2int(bool_list):
    # Convert list of bools to an integer (inverse of int2bool_list)
    return int("".join(map(lambda b: str(int(b)), bool_list)), 2)


def int2bool_list(k, n=None):
    # Convert an integer to a list of bools (inverse of bool_list2int)
    # n is the desired list length
    bl = list(map(lambda b: bool(int(b)), format(k, "b")))
    if n is not None:
        bl = (n - len(bl)) * [False] + bl
    return bl


def transpose(arr):
    # Transpose a 2D list (list of lists of the same length)
    return [list(x) for x in zip(*arr)]


def step(s):
    # Given a state s, returns the next state g
    # This function is for checking, rather than part of the solution
    m = len(s[0]) - 1
    n = len(s) - 1
    ints = [bool_list2int(bl) for bl in s]
    ints2 = [step_row_int(ints[i], ints[i + 1], m) for i in range(n)]
    return [int2bool_list(k, m) for k in ints2]
