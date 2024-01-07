import React, { useEffect, useState } from "react";
import "./GameTicTacToe.css";
type Player = "X" | "O";
type GameResult = Player | "Tie" | null;

const miniumThinkTime = 1000;

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
  const [aiConsiderCell, setAiConsiderCell] = useState<number[]>([]);
  const [isAiTurn, setIsAiTurn] = useState(false);

  useEffect(() => {
    if (checkAiTurn()) {
      setIsAiTurn(() => true);
      const options = availableActions(board);
      const thinkInterval = setInterval(() => {
        const cell = options[Math.floor(Math.random() * options.length)];
        setAiConsiderCell(() => cell);
      }, 100);

      const startTime = Date.now();
      const [placeRow, placeCol] = aiChooseMove(board);
      const endTime = Date.now();
      const thinkTime = endTime - startTime;
      if (thinkTime < miniumThinkTime) {
        setTimeout(() => {
          clearInterval(thinkInterval);
          makeMove(placeRow, placeCol, turn);
        }, miniumThinkTime - thinkTime);
      } else {
        clearInterval(thinkInterval);
        makeMove(placeRow, placeCol, turn);
      }

      return () => clearInterval(thinkInterval);
    } else {
      setIsAiTurn(() => false);
      setAiConsiderCell(() => []);
    }
  }, [turn, isXHuman, isOHuman, gameOver]);

  const availableActions = (board: string[][]) => {
    const actions: number[][] = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        !board[i][j] && actions.push([i, j]);
      }
    }
    return actions;
  };

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
    setTurn(() => "X");
    setWinner(() => null);
    setGameOver(() => false);
    setAiConsiderCell(() => []);
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

  const checkAiTurn = () => {
    if (gameOver) return false;
    if (turn === "X") return !isXHuman;
    if (turn === "O") return !isOHuman;
    return false;
  };

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
              className={`cell ${cell.toLowerCase()}${
                winner ? " game-over" : ""
              }${winner === cell ? " winning-cell" : ""}${
                compareArrays(aiConsiderCell, [rowIndex, colIndex])
                  ? " ai-consider-cell"
                  : ""
              }${isAiTurn ? " ai-turn" : ""}`}
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
