import React, { useEffect, useMemo, useState } from "react";
import styles from "./GameTicTacToe.module.css";
type Player = "X" | "O";
type GameResult = Player | "Tie";

const miniumThinkTime = 1000;
let minimaxMemo: { [key: string]: number } = {};

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
  const [isOHuman, setIsOHuman] = useState(false);
  const [aiConsiderCell, setAiConsiderCell] = useState<number[]>([]);
  const [aiNoise, setAiNoise] = useState<number>(0.05);

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
    minimaxMemo = {};
    const actions = availableActions(board);
    const values: [number[], number][] = actions.map((action) => {
      const nextBoard = thinkMove(board, turn, action);
      const value =
        generateNoise(aiNoise) +
        alphaBetaPruning(
          nextBoard,
          -Infinity,
          Infinity,
          turn === "X" ? "O" : "X",
          aiNoise
        );
      //console.log(stringifyBoard(nextBoard));
      //console.log(value);
      return [action, value];
    });

    if (turn === "X") {
      return values.reduce(
        (acc, av) => (acc[1] > av[1] ? acc : av),
        [[0, 0], -Infinity]
      )[0];
    }

    return values.reduce(
      (acc, av) => (acc[1] < av[1] ? acc : av),
      [[0, 0], Infinity]
    )[0];
  };

  const generateNoise = (noise: number | undefined) =>
    noise ? (2 * Math.random() - 1) * noise : 0;

  const makeMove = (row: number, col: number, player: Player) => {
    const newBoard = [...board];
    newBoard[row][col] = player;
    setBoard(newBoard);
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
    const newBoard = copyBoard(board);
    newBoard[action[0]][action[1]] = player;
    return newBoard;
  };

  const stringifyBoard = (board: string[][]): string => {
    return board
      .map((row) => {
        return row.map((cell) => (cell === "" ? "_" : cell)).join("");
      })
      .join("\n");
  };

  const alphaBetaPruning = (
    board: string[][],
    alpha: number,
    beta: number,
    player: Player,
    noise?: number
  ) => {
    const boardString = stringifyBoard(board);
    if (minimaxMemo[boardString]) {
      return minimaxMemo[boardString];
    }

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j]) {
          if (checkWinningMove(board, i, j)) {
            minimaxMemo[boardString] = board[i][j] === "X" ? 1 : -1;
            return minimaxMemo[boardString];
          }
        }
      }
    }

    if (isBoardFull(board)) {
      minimaxMemo[boardString] = 0;
      return minimaxMemo[boardString];
    }

    if (player === "X") {
      let maxValue = -Infinity;
      for (let action of availableActions(board)) {
        const value =
          generateNoise(noise) +
          alphaBetaPruning(
            thinkMove(board, player, action),
            alpha,
            beta,
            "O",
            noise
          );
        maxValue = Math.max(maxValue, value);
        alpha = Math.max(alpha, value);
        if (beta <= alpha) {
          break;
        }
      }
      minimaxMemo[boardString] = maxValue;
      return maxValue;
    } else {
      let minValue = Infinity;
      for (let action of availableActions(board)) {
        const value =
          generateNoise(noise) +
          alphaBetaPruning(
            thinkMove(board, player, action),
            alpha,
            beta,
            "X",
            noise
          );
        minValue = Math.min(minValue, value);
        beta = Math.min(beta, value);
        if (beta <= alpha) {
          break;
        }
      }
      minimaxMemo[boardString] = minValue;
      return minValue;
    }
  };

  const copyBoard = (board: string[][]) => board.map((row) => row.slice());

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
    return board.every((row) => row.every((cell) => cell));
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
    let className = styles.cell + ` ${styles[cell.toLowerCase()]}`;
    if (gameOver) {
      className += " " + styles.gameOver;
      if (winner === cell) {
        className += " " + styles.winningCell;
      }
    }
    if (compareArrays(aiConsiderCell, [rowIndex, colIndex])) {
      className += " " + styles.aiConsiderCell;
    }
    if (isAiTurn) {
      className += " " + styles.aiTurn;
    }
    return className;
  }

  return (
    <>
      <div>
        <p>This is a work in progress</p>
        <div className={styles.winner}>
          {winner
            ? winner === "Tie"
              ? "It's a Tie!"
              : `Player ${winner} wins!`
            : `Player ${turn}'s turn`}
        </div>
        <div className={styles.board}>
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
        <div className={styles.checkboxDiv}>
          <label>
            AI control X
            <input
              type="checkbox"
              checked={!isXHuman}
              onChange={() => setIsXHuman((prev) => !prev)}
            />
          </label>
          <label>
            AI control O
            <input
              type="checkbox"
              checked={!isOHuman}
              onChange={() => setIsOHuman((prev) => !prev)}
            />
          </label>
        </div>
        <label htmlFor="ai-difficulty" className={styles.aiDifficulty}>
          AI noise
          <input
            name="ai-difficulty"
            type="range"
            min="0.01"
            max="0.3"
            step="0.01"
            value={aiNoise}
            onChange={(e) => setAiNoise(Number(e.target.value))}
          />
        </label>

        <button onClick={resetGame} className={styles.resetButton}>
          Reset Game
        </button>
      </div>
      <div>
        <h3>Rules</h3>
        <ul>
          <li>First player is X</li>
          <li>Second player is O</li>
          <li>Click on a cell to place your mark</li>
          <li>
            First player to fill a row, column or diagonal with their mark wins
          </li>
          <li>Game ends in a tie if the board is full and no player has won</li>
        </ul>
        <h3>AI</h3>
        <ul>
          <li>
            Clicking the corresponding checkbox will toggle AI control over a
            player
          </li>
          <li>
            AI is implemented using the minimax algorithm with alpha beta
            pruning, with added noise to distort the AI's decision making.
          </li>
          <li>
            With zero noise, the AI will always win or tie, but with noise can
            sometimes be beaten
          </li>
        </ul>
      </div>
    </>
  );
};

export default GameTicTacToe;
