import React, { useEffect, useState } from "react";
import styles from "./GameConnectFour.module.css";

type GameStatus = "in progress" | "R wins" | "Y wins" | "tie";
type Player = "R" | "Y";

const emptyRow = ["", "", "", "", "", "", ""];

const winPossibilities = [] as number[][][];
for (let col = 0; col < 7; col++) {
  for (let row = 0; row < 3; row++) {
    winPossibilities.push([
      [col, row],
      [col, row + 1],
      [col, row + 2],
      [col, row + 3],
    ]);
  }
}
for (let col = 0; col < 4; col++) {
  for (let row = 0; row < 6; row++) {
    winPossibilities.push([
      [col, row],
      [col + 1, row],
      [col + 2, row],
      [col + 3, row],
    ]);
  }
}
for (let col = 0; col < 4; col++) {
  for (let row = 0; row < 3; row++) {
    winPossibilities.push([
      [col, row],
      [col + 1, row + 1],
      [col + 2, row + 2],
      [col + 3, row + 3],
    ]);
    winPossibilities.push([
      [6 - col, row],
      [5 - col, row + 1],
      [4 - col, row + 2],
      [3 - col, row + 3],
    ]);
  }
}

const evaluateMemo = {} as { [key: string]: number };

const stringifyBoard = (board: string[][]): string => {
  let transposedBoard = board[0].map((_, colIndex) =>
    board.map((row) => row[colIndex])
  );
  return transposedBoard
    .map((col) => {
      return col.map((cell) => (cell === "" ? "_" : cell)).join("");
    })
    .join("\n");
};

const GameConnectFour: React.FC = () => {
  // note that the board array elements are in the order of columns, not rows
  const [board, setBoard] = useState<string[][]>([
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
  ]);
  const [slotAbove, setSlotAbove] = useState([...emptyRow]);
  const [player, setPlayer] = useState<Player>("R");
  const [gameStatus, setgameStatus] = useState<GameStatus>("in progress");
  const [noise, setNoise] = useState<number>(0);
  const [depth, setDepth] = useState<number>(4);
  const [isRAI, setIsRAI] = useState<boolean>(false);
  const [isYAI, setIsYAI] = useState<boolean>(true);

  useEffect(() => {
    if (gameStatus !== "in progress") {
      return;
    }
    if (player === "R" && isRAI) {
      const move = aiChooseMove();
      makeMove(move);
    } else if (player === "Y" && isYAI) {
      const move = aiChooseMove();
      makeMove(move);
    }
    console.log(evaluateMemo);
  }, [player, gameStatus, isRAI, isYAI]);

  const handleMouseEnter = (columnIndex: number) => {
    if (gameStatus !== "in progress") {
      return;
    }
    const newSlotAbove = [...emptyRow];
    newSlotAbove[columnIndex] = "hover";
    setSlotAbove(newSlotAbove);
  };

  const handleMouseLeave = () => {
    setSlotAbove([...emptyRow]);
  };

  const availableMoves = (board: string[][]): number[] => {
    return board.reduce((acc, col, colIndex) => {
      if (!col[0]) {
        acc.push(colIndex);
      }
      return acc;
    }, [] as number[]);
  };

  const thinkStep = (board: string[][], columnIndex: number) => {
    const newBoard = board.map((col) => [...col]);
    for (let i = newBoard[columnIndex].length - 1; i >= 0; i--) {
      if (newBoard[columnIndex][i] === "") {
        newBoard[columnIndex][i] = player;
        break;
      }
    }
    return newBoard;
  };

  const makeMove = (columnIndex: number) => {
    if (board[columnIndex][0] !== "" || gameStatus !== "in progress") {
      return;
    }
    const newBoard = thinkStep(board, columnIndex);
    setBoard(newBoard);
    setPlayer((prev) => (prev === "R" ? "Y" : "R"));
    const result = checkWin(newBoard, columnIndex);
    if (result !== "in progress") {
      setgameStatus(result);
    }
  };

  const checkWin = (board: string[][], columnIndex: number): GameStatus => {
    // find row
    let row = -1;
    for (let i = 0; i < board[columnIndex].length; i++) {
      if (board[columnIndex][i] !== "") {
        row = i;
        break;
      }
    }
    if (row < 0) {
      return "in progress";
    }

    const player = board[columnIndex][row];

    // check column
    if (row <= 2) {
      let win = true;
      for (let i = 0; i < 4; i++) {
        if (row + i >= board[columnIndex].length) {
          win = false;
          break;
        }
        if (board[columnIndex][row + i] !== player) {
          win = false;
          break;
        }
      }
      if (win) {
        return player === "R" ? "R wins" : "Y wins";
      }
    }

    // check row
    let [_, win] = board.reduce(
      (acc, col): [number, boolean] => {
        let [count, win] = acc;
        if (col[row] === player) {
          count++;
        } else {
          count = 0;
        }
        if (count >= 4) {
          win = true;
        }
        return [count, win];
      },
      [0, false] as [number, boolean]
    );
    if (win) {
      return player === "R" ? "R wins" : "Y wins";
    }

    // check diagonals
    let [count1, count2] = [0, 0];
    for (let i = -3; i <= 3; i++) {
      if (columnIndex + i < 0 || columnIndex + i >= board.length) {
        continue;
      }
      if (board[columnIndex + i][row + i] === player) {
        count1++;
      } else {
        count1 = 0;
      }
      if (board[columnIndex + i][row - i] === player) {
        count2++;
      } else {
        count2 = 0;
      }
      if (count1 >= 4 || count2 >= 4) {
        return player === "R" ? "R wins" : "Y wins";
      }
    }

    // check if board is full
    if (board.every((col) => col[0])) {
      return "tie";
    }

    return "in progress";
  };

  const resetGame = () => {
    setBoard([
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["", "", "", "", "", ""],
    ]);
    setPlayer("R");
    setgameStatus("in progress");
  };

  const minimax = (
    prevBoard: string[][],
    action: number,
    depth: number,
    alpha: number,
    beta: number,
    player: Player,
    noise?: number
  ) => {
    const board = thinkStep(prevBoard, action);
    const result = checkWin(board, action);

    if (result === "R wins") {
      return 1;
    } else if (result === "Y wins") {
      return -1;
    } else if (result === "tie") {
      return 0;
    } else if (depth === 0) {
      return evaluateBoard(board);
    }

    let bestScore = player === "R" ? -Infinity : Infinity;
    const moves = availableMoves(board);
    for (const action of moves) {
      const nudge = noise ? (Math.random() - 0.5) * 2 * noise : 0;
      const score =
        nudge +
        minimax(
          board,
          action,
          depth - 1,
          alpha,
          beta,
          player === "R" ? "Y" : "R",
          noise
        );
      if (player === "R") {
        bestScore = Math.max(bestScore, score);
        alpha = Math.max(alpha, score);
      } else {
        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, score);
      }
      if (alpha >= beta) {
        break;
      }
    }
    return bestScore;
  };

  const evaluateBoard = (board: string[][]) => {
    const boardString = stringifyBoard(board);
    if (evaluateMemo[boardString]) {
      return evaluateMemo[boardString];
    }
    // count the difference in number of ways to connect four for each player
    const count = winPossibilities.reduce((acc, winPossibility): number => {
      if (winPossibility.every(([col, row]) => board[col][row] !== "Y")) {
        acc++;
      }
      if (winPossibility.every(([col, row]) => board[col][row] !== "R")) {
        acc--;
      }
      return acc;
    }, 0);
    evaluateMemo[boardString] = count / winPossibilities.length;
    return evaluateMemo[boardString];
  };

  const aiChooseMove = () => {
    const moves = availableMoves(board);
    let bestScore = player === "R" ? -Infinity : Infinity;
    let bestMove = moves[0];
    for (const action of moves) {
      const nudge = noise ? (Math.random() - 0.5) * 2 * noise : 0;
      const score =
        nudge +
        minimax(
          board,
          action,
          depth,
          -Infinity,
          Infinity,
          player === "R" ? "Y" : "R",
          noise
        );
      if (score > bestScore && player === "R") {
        bestScore = score;
        bestMove = action;
      }
      if (score < bestScore && player === "Y") {
        bestScore = score;
        bestMove = action;
      }
    }
    return bestMove;
  };

  return (
    <>
      <div>
        <p>This is a work in progress</p>
        <h2>{gameStatus}</h2>
        <div className={styles.gameBoard}>
          <div className={styles.inputRow}>
            {slotAbove.map((cell, cellIndex) => (
              <div key={-1 - cellIndex} className={styles.slotCell}>
                <div
                  className={`${styles.circle} ${cell ? styles[player] : ""}`}
                ></div>
              </div>
            ))}
          </div>
          <div className={styles.slots}>
            {board.map((column, columnIndex) => {
              return (
                <div
                  key={columnIndex}
                  className={styles.column}
                  onClick={() => makeMove(columnIndex)}
                  onMouseEnter={() => handleMouseEnter(columnIndex)}
                  onMouseLeave={handleMouseLeave}
                >
                  {column.map((cell, cellIndex) => {
                    return (
                      <div key={cellIndex} className={styles.cell}>
                        <div
                          className={`${styles.circle} ${
                            cell ? styles[cell] : ""
                          }`}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <button onClick={resetGame} className={styles.resetButton}>
          Reset Game
        </button>
      </div>
      <div>
        <h3>Rules</h3>
        <ul>
          <li>Players alternate turns</li>
          <li>
            Players choose a column with available space to place a piece in the
            lowest available slot
          </li>
          <li>
            The first player to get four of their pieces in a row wins the game
          </li>
          <li>The four in a row can be horizontal, vertical, or diagonal</li>
          <li>
            If the board is full and neither player has four in a row, the game
            is a tie
          </li>
        </ul>
      </div>
    </>
  );
};

export default GameConnectFour;
