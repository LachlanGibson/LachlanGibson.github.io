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


def random_guess(possibilities):
    return possibilities[random.randrange(len(possibilities))]


def greedy_reduction(possibilities):
    if len(possibilities) == 1:
        return possibilities
    # choose guess that greedily minimises the expected size of the set of possibilities
    min_size, guesses = float("inf"), []
    for i, guess in enumerate(possibilities):
        results = [compare_codes(guess, possibilities[j]) for j in range(i)] + [
            compare_codes(guess, possibilities[j])
            for j in range(i + 1, len(possibilities))
        ]
        counts = Counter(results)
        expected_size = sum(counts[r] ** 2 for r in counts) / len(results)
        if expected_size < min_size:
            min_size = expected_size
            guesses = [guess]
        elif expected_size == min_size:
            guesses.append(guess)
    return guesses


def minimax_turns(possibilities, turn=0, alpha=float("-inf"), beta=float("inf")):
    if len(possibilities) <= 2:
        return turn if turn > 0 else possibilities

    # choose the guess that minimises the maximum number of turns
    best_guess = float("inf")
    alpha0 = alpha
    for i, guess in enumerate(possibilities):
        worst_turns = float("-inf")
        results = [compare_codes(guess, possibilities[j]) for j in range(i)] + [
            compare_codes(guess, possibilities[j])
            for j in range(i + 1, len(possibilities))
        ]
        counts = reversed(Counter(results).most_common())
        alpha = alpha0
        for result, _ in counts:
            new_possibilities = update_possibilities(possibilities, guess, result)
            worst_turns = max(
                worst_turns,
                minimax_turns(new_possibilities, turn + 1, alpha, beta),
            )
            if worst_turns > beta:
                break
            if worst_turns == beta and turn > 0:
                break
            alpha = max(alpha, worst_turns)

        if turn == 0:
            if worst_turns < best_guess:
                options = [guess]
            elif worst_turns == best_guess:
                options.append(guess)

        best_guess = min(best_guess, worst_turns)
        if best_guess < alpha0:
            break
        if best_guess == alpha0 and turn > 0:
            break
        beta = min(beta, best_guess)
    return best_guess if turn > 0 else tuple(options)


def simulate_game(possibilities, strategy="random"):
    code = random_guess(possibilities)
    turn = 0
    while len(possibilities) > 0:
        if strategy == "random" or turn == 0:
            guess = random_guess(possibilities)
        elif strategy == "greedy":
            guess = random_guess(greedy_reduction(possibilities))
        elif strategy == "minimax":
            guess = random_guess(minimax_turns(possibilities))
        elif strategy == "mixed":
            if len(possibilities) >= 1000:
                guess = random_guess(possibilities)
            elif len(possibilities) >= 100:
                guess = random_guess(greedy_reduction(possibilities))
            else:
                guess = random_guess(minimax_turns(possibilities))
        result = compare_codes(guess, code)
        possibilities = update_possibilities(possibilities, guess, result)
        turn += 1
    return turn


random.seed(seed)
print(f"Code size: {code_size}, Colours: {num_colours}, Seed: {seed}")
for strat in ["mixed"]:  # ["random", "greedy", "minimax", "mixed"]:
    print("====================")
    print("Strategy:", strat)
    for initial in [initial_pos_repeats, initial_pos]:
        print("--------------------")
        print(f"Initial set size: {len(initial)}")
        print(f"Simulating {trials} games...")
        start = time.time()
        turns = [simulate_game(initial, strategy=strat) for _ in range(trials)]
        end = time.time()
        print(Counter(turns))
        print(f"Average turns: {sum(turns) / trials:.4f}")
        print(f"Average time: {(end - start)/trials:.4f} s")
