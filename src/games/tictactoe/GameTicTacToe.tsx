import React, { useEffect, useMemo, useState } from "react";
import "./GameTicTacToe.css";
type Player = "X" | "O";
type GameResult = Player | "Tie";

const miniumThinkTime = 1000;

const GameTicTacToe = () => {
  const [board, setBoard] = useState<string[][]>([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const [turn, setTurn] = useState<Player>("X");
  const [winner, setWinner] = useState<GameResult>();
  const [gameOver, setGameOver] = useState(false);
  const [isXHuman, setIsXHuman] = useState(true);
  const [isOHuman, setIsOHuman] = useState(true);
  const [aiConsiderCell, setAiConsiderCell] = useState<number[]>([]);

  const isAiTurn = useMemo(() => {
    if (gameOver) return false;
    if (turn === "X") return !isXHuman;
    if (turn === "O") return !isOHuman;
    return false;
  }, [turn, isXHuman, isOHuman, gameOver]);

  useEffect(() => {
    if (!isAiTurn) {
      setAiConsiderCell(() => []);
      return;
    }
    const options = availableActions(board);
    const thinkInterval = setInterval(() => {
      const cell = options[Math.floor(Math.random() * options.length)];
      setAiConsiderCell(cell);
    }, 100);

    const startTime = Date.now();
    const [placeRow, placeCol] = aiChooseMove(board);
    const endTime = Date.now();
    const thinkTime = endTime - startTime;
    if (thinkTime >= miniumThinkTime) {
      clearInterval(thinkInterval);
      makeMove(placeRow, placeCol, turn);
      return () => clearInterval(thinkInterval);
    }
    const timeout = setTimeout(() => {
      clearInterval(thinkInterval);
      makeMove(placeRow, placeCol, turn);
    }, miniumThinkTime - thinkTime);
    return () => {
      clearInterval(thinkInterval);
      clearTimeout(timeout);
    };
  }, [turn, isXHuman, isOHuman, gameOver]);

  const availableActions = (board: string[][]): number[][] =>
    board.reduce<number[][]>((acc, row, i) => {
      row.forEach((cell, j) => cell || acc.push([i, j]));
      return acc;
    }, []);

  const aiChooseMove = (board: string[][]) => {
    const actions = availableActions(board);
    return actions[Math.floor(Math.random() * actions.length)];
  };

  const makeMove = (row: number, col: number, player: Player) => {
    const newBoard = [...board];
    newBoard[row][col] = player;
    setBoard(() => newBoard);
    const isWinningMove = checkWinningMove(newBoard, row, col);
    if (isWinningMove) {
      setWinner(() => turn);
      setGameOver(() => true);
    } else if (isBoardFull(newBoard)) {
      setWinner(() => "Tie");
      setGameOver(() => true);
    } else {
      setTurn((prev) => (prev === "X" ? "O" : "X"));
    }
  };

  const thinkMove = (board: string[][], player: Player, action: number[]) => {
    const newBoard = [...board];
    newBoard[action[0]][action[1]] = player;
    return newBoard;
  };

  const alphaBetaPruning = (
    board: string[][],
    alpha: number,
    beta: number,
    player: Player,
    noise?: number
  ) => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (!board[i][j]) {
          if (checkWinningMove(board, i, j)) {
            return player === "X" ? 1 : -1;
          }
        }
      }
    }

    if (isBoardFull(board)) {
      return 0;
    }

    if (player === "X") {
      let maxValue = -Infinity;
      for (let action of availableActions(board)) {
        const nudge = noise ? (2 * Math.random() - 1) * noise : 0;
        const value =
          nudge +
          alphaBetaPruning(thinkMove(board, player, action), alpha, beta, "O");
        maxValue = Math.max(maxValue, value);
        alpha = Math.max(alpha, value);
        if (beta <= alpha) {
          break;
        }
      }
      return maxValue;
    } else {
      let minValue = Infinity;
      for (let action of availableActions(board)) {
        const nudge = noise ? (2 * Math.random() - 1) * noise : 0;
        const value =
          nudge +
          alphaBetaPruning(thinkMove(board, player, action), alpha, beta, "X");
        minValue = Math.min(minValue, value);
        beta = Math.min(beta, value);
        if (beta <= alpha) {
          break;
        }
      }
      return minValue;
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
    setBoard(() => [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setTurn("X");
    setWinner(undefined);
    setGameOver(false);
    setAiConsiderCell([]);
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

  const compareArrays = (arr1: number[], arr2: number[]) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((item, index) => item === arr2[index]);
  };

  function createCellClassName(
    cell: string,
    rowIndex: number,
    colIndex: number
  ) {
    let className = `cell ${cell.toLowerCase()}`;
    if (gameOver) {
      className += " game-over";
      if (winner === cell) {
        className += " winning-cell";
      }
    }
    if (compareArrays(aiConsiderCell, [rowIndex, colIndex])) {
      className += " ai-consider-cell";
    }
    if (isAiTurn) {
      className += " ai-turn";
    }
    return className;
  }

  return (
    <div>
      <p>This is a work in progress</p>
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
              className={createCellClassName(cell, rowIndex, colIndex)}
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
