import copy
import random


def minimax_alphabeta(
    previous_board, move, depth, alpha, beta, previous_player, player, noise=None
):
    board = make_move(previous_board, move, previous_player)
    result = check_win(board, move)
    result_dict = {"R_wins": 1, "Y_wins": -1, "tie": 0}
    if result in result_dict:
        return result_dict[result]
    elif depth == 0:
        return evaluate_board(board)

    best_score = float("-inf") if player == "R" else float("inf")
    moves = available_moves(board)

    for move in moves:
        nudge = (random.random() - 0.5) * 2 * noise if noise else 0
        score = nudge + minimax_alphabeta(
            board, move, depth - 1, alpha, beta, player, previous_player, noise
        )
        if player == "R":
            best_score = max(best_score, score)
            alpha = max(alpha, score)
        else:
            best_score = min(best_score, score)
            beta = min(beta, score)
        if alpha >= beta:
            break
    return best_score


def available_moves(board):
    return [col_index for col_index, col in enumerate(board) if not col[0]]


def make_move(board, column_index, player):
    new_board = copy.deepcopy(board)
    for i in reversed(range(len(board[column_index]))):
        if board[column_index][i] == "":
            new_board[column_index][i] = player
            break
    return new_board


def check_win(board, column_index):
    # find row
    row = next(i for i, cell in enumerate(board[column_index]) if cell)
    player = board[column_index][row]

    # check column
    if row <= 2:
        if all(board[column_index][row + i] == player for i in range(1, 4)):
            return f"{player} wins"
    # check row
    if any(all(board[col + i][row] == player for i in range(4)) for col in range(4)):
        return f"{player} wins"

    # check diagonals
    count1, count2 = 0, 0
    for i in range(-3, 4):
        if column_index + i < 0 or column_index + i >= len(board):
            continue
        if row + i >= 0 and row + i < len(board[column_index]):
            if board[column_index + i][row + i] == player:
                count1 += 1
            else:
                count1 = 0
        if row - i >= 0 and row - i < len(board[column_index]):
            if board[column_index + i][row - i] == player:
                count2 += 1
            else:
                count2 = 0
        if count1 >= 4 or count2 >= 4:
            return f"{player} wins"

    # check if board is full
    if all(col[0] for col in board):
        return "tie"

    return "in progress"


# Generate all 69 possible win possibilities that the heuristic will check
win_possibilities = []
for col in range(7):
    win_possibilities += [
        [[col, row], [col, row + 1], [col, row + 2], [col, row + 3]] for row in range(3)
    ]

for col in range(4):
    win_possibilities += [
        [[col, row], [col + 1, row], [col + 2, row], [col + 3, row]] for row in range(6)
    ]
    win_possibilities += [
        [[col, row], [col + 1, row + 1], [col + 2, row + 2], [col + 3, row + 3]]
        for row in range(3)
    ]
    win_possibilities += [
        [[6 - col, row], [5 - col, row + 1], [4 - col, row + 2], [3 - col, row + 3]]
        for row in range(3)
    ]

evaluate_memo = {}


def stringify_board(board):
    rows = range(len(board[0]))
    cols = range(len(board))
    return "\n".join(
        [
            "".join([board[col][row] if board[col][row] else "_" for col in cols])
            for row in rows
        ]
    )


def evaluate_board(board):
    board_string = stringify_board(board)
    if board_string in evaluate_memo:
        return evaluate_memo[board_string]

    count = 0
    for win_possibility in win_possibilities:
        if all(board[col][row] != "Y" for col, row in win_possibility):
            count += 1
        if all(board[col][row] != "R" for col, row in win_possibility):
            count -= 1
    evaluate_memo[board_string] = count / len(win_possibilities)
    return evaluate_memo[board_string]


# Apply minimax to see scores for each move
def get_move_scores(board, depth, noise, player):
    next_player = "Y" if player == "R" else "R"
    scores = {}
    for move in available_moves(board):
        nudge = (random.random() - 0.5) * 2 * noise if noise else 0
        score = nudge + minimax_alphabeta(
            board, move, depth, float("-inf"), float("inf"), player, next_player, noise
        )
        scores[move] = score
    return scores


board = [["" for row in range(6)] for col in range(7)]
move_sequence = [2, 2, 1, 3, 3, 4]
player = "R"
for move in move_sequence:
    board = make_move(board, move, player)
    player = "Y" if player == "R" else "R"
print(stringify_board(board))
print(player, get_move_scores(board, 4, 0, player))
