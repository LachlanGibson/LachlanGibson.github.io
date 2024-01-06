import React, { useState } from "react";
import "./GameTicTacToe.css";
type Player = "X" | "O";
type GameResult = Player | "Tie" | null;
const GameTicTacToe = () => {
  const [board, setBoard] = useState<string[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [turn, setTurn] = useState<Player>("X");
  const [winner, setWinner] = useState<GameResult>(null);
  const [gameOver, setGameOver] = useState(false);
  const [isXHuman, setIsXHuman] = useState(true);
  const [isOHuman, setIsOHuman] = useState(true);

  const makeMove = (row: number, col: number, player: Player) => {
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
              } ${winner === cell ? "winning-cell" : ""}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              data-hover={turn}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      <div className="checkbox-div">
        <label>
          X is AI
          <input
            type="checkbox"
            checked={!isXHuman}
            onChange={() => setIsXHuman((prev) => !prev)}
          />
        </label>
        <label>
          O is AI
          <input
            type="checkbox"
            checked={!isOHuman}
            onChange={() => setIsOHuman((prev) => !prev)}
          />
        </label>
      </div>
      <button onClick={resetGame} className="reset-button">
        Reset Game
      </button>
    </div>
  );
};

export default GameTicTacToe;
