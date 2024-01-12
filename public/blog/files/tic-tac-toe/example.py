import numpy as np

# board = np.zeros([3, 3], dtype=int)
board = np.array([[1, 1, 0], [-1, -1, 0], [1, -1, 0]])
temperature = {1: 0.2, -1: 1}
_scores = {}


def score(board_state, player, print_probs=False):
    pos_str = stringify_board(board_state)
    if pos_str in _scores and not print_probs:
        return _scores[pos_str]

    game_over, winner = check_gameover(board_state)
    if game_over:
        _scores[pos_str] = winner
        return _scores[pos_str]
    values = np.array(
        [
            score(make_move(board_state, player, move), -player)
            for move in get_moves(board_state)
        ]
    )
    probs = softmax(player * values, temperature[player])
    _scores[pos_str] = np.dot(values, probs)
    if print_probs:
        print("Current board: {0:.4f}".format(_scores[pos_str]))
        print(pos_str)
        for i, move in enumerate(get_moves(board_state)):
            print(
                "Move [{0},{1}]: {2:.4f}, {3:.4f}%".format(
                    *move, values[i], probs[i] * 100
                )
            )
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
    elif -3 in sums:
        return (True, -1)
    elif 0 not in board_state:
        return (True, 0)
    return (False, None)


score(board, 1, print_probs=True)
