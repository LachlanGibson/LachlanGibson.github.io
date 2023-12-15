import React from "react";
import "./GameTicTacToe.css";

const GameTicTacToe = () => {
  const [board, setBoard] = React.useState<string[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [turn, setTurn] = React.useState<"X" | "O">("X");
  const [winner, setWinner] = React.useState<"X" | "O" | "Tie" | null>(null);
  const [gameOver, setGameOver] = React.useState(false);
  const [isXHuman, setIsXHuman] = React.useState(true);
  const [isOHuman, setIsOHuman] = React.useState(true);

  const makeMove = (row: number, col: number, player: "X" | "O") => {
    const newBoard = [...board];
    newBoard[row][col] = player;
    setBoard(newBoard);
    const isWinningMove = checkWinningMove(newBoard, row, col);
    if (isWinningMove) {
      setWinner(turn);
      setGameOver(true);
    } else if (isBoardFull(newBoard)) {
      setWinner("Tie");
      setGameOver(true);
    } else {
      setTurn(turn === "X" ? "O" : "X");
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (turn === "X" && !isXHuman) return;
    if (turn === "O" && !isOHuman) return;
    if (board[row][col] || gameOver) return;

    makeMove(row, col, turn);
  };

  const checkWinningMove = (board: string[][], row: number, col: number) => {
    const currentPlayer = board[row][col];

    let isWinningMove = true;
    for (let i = 0; i < board.length; i++) {
      if (board[i][col] !== currentPlayer) {
        isWinningMove = false;
        break;
      }
    }
    if (isWinningMove) return true;

    isWinningMove = true;
    for (let i = 0; i < board[row].length; i++) {
      if (board[row][i] !== currentPlayer) {
        isWinningMove = false;
        break;
      }
    }
    if (isWinningMove) return true;

    if (row === col) {
      isWinningMove = true;
      for (let i = 0; i < board.length; i++) {
        if (board[i][i] !== currentPlayer) {
          isWinningMove = false;
          break;
        }
      }
      if (isWinningMove) return true;
    }

    if (row + col === board.length - 1) {
      isWinningMove = true;
      for (let i = 0; i < board.length; i++) {
        if (board[i][board.length - 1 - i] !== currentPlayer) {
          isWinningMove = false;
          break;
        }
      }
      if (isWinningMove) return true;
    }

    return false;
  };

  const resetGame = () => {
    setBoard([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setTurn("X");
    setWinner(null);
    setGameOver(false);
  };

  const isBoardFull = (board: string[][]) => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (!board[i][j]) {
          return false;
        }
      }
    }
    return true;
  };

  return (
    <div>
      <div className="winner">
        {winner
          ? winner === "Tie"
            ? "It's a Tie!"
            : `Player ${winner} wins!`
          : `Player ${turn}'s turn`}
      </div>
      <div className="board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${cell.toLowerCase()} ${
                winner ? "game-over" : ""
              }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              data-hover={turn}
            >
              {cell}
            </div>
          ))
        )}
      </div>

      <button onClick={resetGame} className="reset-button">
        Reset Game
      </button>
    </div>
  );
};

export default GameTicTacToe;
