import time
from collections import Counter
from itertools import permutations

code_size = 4
num_colors = 6

initial_set = tuple(permutations(range(num_colors), code_size))


_compare_codes = {}


def compare_codes(guess, code):
    if (guess, code) in _compare_codes:
        return _compare_codes[(guess, code)]
    correct, switched = 0, 0
    for g, c in zip(guess, code):
        if g == c:
            correct += 1
        elif g in code:
            switched += 1
    _compare_codes[(guess, code)] = (correct, switched)
    return (correct, switched)


def update_possibilities(possibilities, guess, result):
    new_possibilities = list()
    for code in possibilities:
        if compare_codes(guess, code) == result:
            new_possibilities.append(code)
    return tuple(new_possibilities)


def expected_next_sizes(possibilities, choices=None):
    if choices is None:
        choices = possibilities
    sizes = []
    for guess in choices:
        results = [compare_codes(guess, code) for code in possibilities]
        counts = Counter(results)
        expected_size = sum(counts[r] ** 2 for r in counts) / len(results)
        sizes.append((expected_size, guess))
    sizes.sort(reverse=True)
    return sizes


def greedy_reduction(possibilities, choices=None):
    if choices is None:
        choices = possibilities
    # choose guess that greedily minimises the expected size of the set of possibilities
    best_guess = (float("inf"), None)
    for guess in choices:
        results = [compare_codes(guess, code) for code in possibilities]
        counts = Counter(results)
        expected_size = sum(counts[r] ** 2 for r in counts) / len(results)
        best_guess = min(best_guess, (expected_size, guess))
    return best_guess


_required_turns = {}


def required_turns1(possibilities, turns=0):
    if possibilities in _required_turns:
        cashed = _required_turns[possibilities]
        return (turns + cashed[0], cashed[1])
    if len(possibilities) == 1:
        _required_turns[possibilities] = (0, possibilities[0])
        return (turns, possibilities[0])

    # choose the guess that minimises the maximum number of turns
    best_guess = (float("inf"), initial_set[0])
    for guess in possibilities:
        worst_turns = float("-inf")
        for code in possibilities:
            if code == guess:
                worst_turns = max(worst_turns, 1)
                continue
            result = compare_codes(guess, code)
            new_possibilities = update_possibilities(possibilities, guess, result)
            if len(new_possibilities) == len(possibilities):
                worst_turns = float("inf")
                break
            worst_turns = max(
                worst_turns,
                required_turns1(new_possibilities, turns + 1)[0],
            )
        best_guess = min(best_guess, (worst_turns, guess))
    _required_turns[possibilities] = (best_guess[0] - turns, best_guess[1])
    return best_guess


total_function_calls = 0
function_memo = 0
count_alpha_breaks = 0
count_beta_breaks = 0


def required_turns(possibilities, turns=0, alpha=float("-inf"), beta=float("inf")):
    global total_function_calls, function_memo, count_alpha_breaks, count_beta_breaks
    total_function_calls += 1
    if possibilities in _required_turns:
        function_memo += 1
        cashed = _required_turns[possibilities]
        return (turns + cashed[0], cashed[1])
    if len(possibilities) == 1:
        _required_turns[possibilities] = (0, possibilities[0])
        return (turns, possibilities[0])

    # choose the guess that minimises the maximum number of turns
    best_guess = (float("inf"), initial_set[0])
    alpha0 = alpha
    for guess in possibilities:
        worst_turns = float("-inf")
        results = [compare_codes(guess, code) for code in possibilities]
        counts = reversed(Counter(results).most_common())
        alpha = alpha0
        for result, _ in counts:
            new_possibilities = tuple(
                c for c, r in zip(possibilities, results) if r == result
            )
            worst_turns = max(
                worst_turns,
                required_turns(new_possibilities, turns + 1, alpha, beta)[0],
            )
            if worst_turns >= beta:
                count_beta_breaks += 1
                break
            alpha = max(alpha, worst_turns)
        best_guess = min(best_guess, (worst_turns, guess))
        if best_guess[0] <= alpha0:
            count_alpha_breaks += 1
            break
        beta = min(beta, best_guess[0])
    _required_turns[possibilities] = (best_guess[0] - turns, best_guess[1])
    return best_guess


possibilities = initial_set
print(len(possibilities))
possibilities = update_possibilities(possibilities, (0, 1, 2, 3), (1, 1))
print(len(possibilities))
# possibilities = update_possibilities(possibilities, (0, 2, 4, 5), (0, 0))
# print(len(possibilities))
# possibilities = update_possibilities(possibilities, (1, 6, 7, 3), (0, 4))
# print(len(possibilities))
start = time.time()
print(required_turns(possibilities))
print(greedy_reduction(possibilities))
end = time.time()
print(end - start)
print(total_function_calls, function_memo, count_alpha_breaks, count_beta_breaks)
