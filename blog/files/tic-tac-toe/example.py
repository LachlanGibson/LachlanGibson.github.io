import matplotlib.pyplot as plt
import numpy as np

_scores = {}


def score(board_state, player, temperatures, return_probs=False):
    pos_str = stringify_board(board_state)
    if not return_probs and pos_str in _scores:
        return _scores[pos_str]

    game_over, winner = check_gameover(board_state)
    if game_over:
        _scores[pos_str] = winner
        return _scores[pos_str]
    moves = get_moves(board_state)
    values = np.array(
        [
            score(make_move(board_state, player, move), -player, temperatures)
            for move in moves
        ]
    )
    probs = softmax(player * values, temperatures[player])
    _scores[pos_str] = np.dot(values, probs)
    if return_probs:
        return moves, values, probs
    return _scores[pos_str]


def stringify_board(board_state):
    return "\n".join("".join("_XO"[cell] for cell in row) for row in board_state)


def softmax(z, T):
    z = np.array(z)
    e_z = np.exp(z / T)
    return e_z / e_z.sum(axis=0)


def get_moves(board_state):
    return list(zip(*np.where(board_state == 0)))


def make_move(board_state, player, move):
    new_board = board_state.copy()
    new_board[move] = player
    return new_board


def check_gameover(board_state):
    sums = np.stack(
        [
            *board_state,  # Rows
            *board_state.T,  # Columns
            board_state.diagonal(),  # Main diagonal
            np.fliplr(board_state).diagonal(),  # Anti-diagonal
        ]
    ).sum(1)
    if 3 in sums:
        return (True, 1)
    if -3 in sums:
        return (True, -1)
    return (0 not in board_state, 0)


def print_probs(board_state, player, temperatures):
    move_scores = score(board_state, player, temperatures, return_probs=True)
    board_score = score(board_state, player, temperatures)
    print("Current board: {0:.4f}".format(board_score))
    print(stringify_board(board_state))
    for m, v, p in zip(*move_scores):
        print("Move [{0},{1}]: {2:.4f}, {3:.4f}%".format(*m, v, p * 100))


def simulate_game(temperatures, print_game=False):
    board = np.zeros([3, 3], dtype=int)
    player = 1
    game_over = False
    while not game_over:
        moves, _, probs = score(board, player, temperatures, return_probs=True)
        move = moves[np.random.choice(len(moves), p=probs)]
        board = make_move(board, player, move)
        game_over, winner = check_gameover(board)
        player = -player
        if print_game:
            print("\n" + stringify_board(board))
    return winner


def count_wins(temperatures, trials):
    X, O = 0, 0
    for t in range(trials):
        winner = simulate_game(temperatures)
        if winner > 0:
            X += 1
        elif winner < 0:
            O += 1
    return X / trials, O / trials, (trials - X - O) / trials


# print example
board = np.array([[1, 1, 0], [-1, -1, 0], [1, -1, 0]])
print_probs(board, 1, {1: 0.2, -1: 1})

# plot win probabilities via simulation
temps = np.arange(0.1, 1.1, 0.1)
num_trials = 1000
np.random.seed(745)
for T in [0.1, 1]:
    counts = []
    for t in temps:
        _scores = {}
        counts.append(count_wins({1: T, -1: t}, num_trials))
    plt.figure(figsize=[4, 3])
    plt.plot(temps, counts, label=["X Win", "O Win", "Tie"])
    plt.axis([0, 1.1, 0, 1])
    plt.xlabel("$T_O$")
    plt.ylabel("Probability")
    plt.title(f"Win Estimates with $T_X$={T}")
    plt.legend()
    plt.savefig(f"p_estimates_T{T}.svg", bbox_inches="tight")

# plot expected scores based on first move
board_corner = np.array([[1, 0, 0], [0, 0, 0], [0, 0, 0]])
board_centre = np.array([[0, 0, 0], [0, 1, 0], [0, 0, 0]])
board_edge = np.array([[0, 1, 0], [0, 0, 0], [0, 0, 0]])
for T in [0.1, 1]:
    scores = []
    for t in temps:
        _scores = {}
        scores.append(
            [
                score(board_corner, -1, {1: T, -1: t}),
                score(board_centre, -1, {1: T, -1: t}),
                score(board_edge, -1, {1: T, -1: t}),
            ]
        )
    plt.figure(figsize=[4, 3])
    plt.plot(temps, scores, label=["Corner", "Centre", "Edge"])
    plt.axis([0, 1.1, -1, 1])
    plt.grid()
    plt.xlabel("$T_O$")
    plt.ylabel("Score")
    plt.title(f"Expected Scores with $T_X$={T}")
    plt.legend(loc="lower right")
    plt.savefig(f"scores_T{T}.svg", bbox_inches="tight")
