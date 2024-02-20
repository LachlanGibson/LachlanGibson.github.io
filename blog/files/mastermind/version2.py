import random
import time
from collections import Counter
from itertools import permutations, product

code_size = 4
num_colours = 6
trials = 10000
seed = 4

initial_pos_repeats = tuple(product(range(num_colours), repeat=code_size))
initial_pos = tuple(permutations(range(num_colours), code_size))
_compare_codes = {}


def compare_codes(guess, code):
    memo_key = (guess, code)
    if memo_key in _compare_codes:
        return _compare_codes[memo_key]
    correct, switched = 0, 0
    guess_counts = Counter(guess)
    code_counts = Counter(code)
    for g, c in zip(guess, code):
        if g == c:
            correct += 1
            guess_counts[g] -= 1
            code_counts[c] -= 1
    for g in guess_counts:
        switched += min(guess_counts[g], code_counts[g])
    _compare_codes[memo_key] = (correct, switched)
    return (correct, switched)


def update_possibilities(possibilities, guess, result):
    new_possibilities = list()
    for code in possibilities:
        if compare_codes(guess, code) == result:
            if code != guess:
                new_possibilities.append(code)
    return tuple(new_possibilities)


def expected_turns(possibilities, choices=None):
    if len(possibilities) <= 1:
        return len(possibilities)

    if choices is None:
        choices = possibilities

    next_possibilities = {}
    next_choices = []
    for guess in choices:
        results = [compare_codes(guess, code) for code in possibilities]
        counts = Counter(results)
        if len(counts) == 1:
            break
        next_choices.append(guess)
        next_possibilities[guess] = {}
        for result, count in counts.items():
            next_possibilities[guess][result] = {
                "count": count,
                "possibilities": update_possibilities(possibilities, guess, result),
            }

    best_guess = float("inf")
    for guess in next_choices:
        exp = 1 + sum(
            next_possibilities[guess][result]["count"]
            * expected_turns(
                next_possibilities[guess][result]["possibilities"], next_choices
            )
            for result in next_possibilities[guess]
        )
        best_guess = min(best_guess, exp)
    return best_guess
