import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./GameConnectFour.module.css";
import { copy2DArray } from "../../../utility/utilities";

type GameStatus = "in progress" | "R wins" | "Y wins" | "tie";
type Player = "R" | "Y";

const emptyRow = ["", "", "", "", "", "", ""];
const miniumThinkTime = 600;
const decidedTime = 400;

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
  return board
    .map((col) => {
      return col.map((cell) => (cell === "" ? "_" : cell)).join("");
    })
    .join("\n");
};

const minimax = (
  prevBoard: string[][],
  action: number,
  depth: number,
  alpha: number,
  beta: number,
  prevPlayer: Player,
  player: Player,
  noise?: number
) => {
  const board = thinkStep(prevBoard, action, prevPlayer);
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
      minimax(board, action, depth - 1, alpha, beta, player, prevPlayer, noise);
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

const thinkStep = (board: string[][], columnIndex: number, player: Player) => {
  const newBoard = copy2DArray(board);
  for (let i = newBoard[columnIndex].length - 1; i >= 0; i--) {
    if (newBoard[columnIndex][i] === "") {
      newBoard[columnIndex][i] = player;
      break;
    }
  }
  return newBoard;
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
  let [, win] = board.reduce(
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

const availableMoves = (board: string[][]): number[] => {
  return board.reduce((acc, col, colIndex) => {
    if (!col[0]) {
      acc.push(colIndex);
    }
    return acc;
  }, [] as number[]);
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
  const [noise, setNoise] = useState<number>(0.022);
  const [depth, setDepth] = useState<number>(4);
  const [isRAI, setIsRAI] = useState<boolean>(false);
  const [isYAI, setIsYAI] = useState<boolean>(true);
  const [aiConsiderCell, setAiConsiderCell] = useState<number>();

  const isAiTurn = useMemo(() => {
    if (gameStatus !== "in progress") return false;
    if (player === "R") return isRAI;
    if (player === "Y") return isYAI;
    return false;
  }, [player, isRAI, isYAI, gameStatus]);

  const makeMove = useCallback(
    (columnIndex: number) => {
      if (board[columnIndex][0] !== "" || gameStatus !== "in progress") {
        return;
      }
      const newBoard = thinkStep(board, columnIndex, player);
      setBoard(newBoard);
      setPlayer((prev) => (prev === "R" ? "Y" : "R"));
      const result = checkWin(newBoard, columnIndex);
      if (result !== "in progress") {
        setgameStatus(result);
      }
    },
    [board, gameStatus, player]
  );

  useEffect(() => {
    if (!isAiTurn) {
      setAiConsiderCell(undefined);
      return;
    }

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
            player,
            player === "R" ? "Y" : "R",
            noise
          );
        if (
          (score > bestScore && player === "R") ||
          (score < bestScore && player === "Y")
        ) {
          bestScore = score;
          bestMove = action;
        }
      }
      return bestMove;
    };

    const options = availableMoves(board);
    let optionIndex = 0;
    const thinkInterval = setInterval(() => {
      //const cell = options[Math.floor(Math.random() * options.length)];
      const cell = options[optionIndex];
      optionIndex = (optionIndex + 1) % options.length;
      setAiConsiderCell(cell);
    }, Math.floor(140 / options.length));

    let decidedTimeout: NodeJS.Timeout;
    const startTime = Date.now();
    const placeCol = aiChooseMove();
    const endTime = Date.now();
    const thinkTime = endTime - startTime;
    if (thinkTime >= miniumThinkTime) {
      clearInterval(thinkInterval);
      setAiConsiderCell(placeCol);
      decidedTimeout = setTimeout(() => {
        makeMove(placeCol);
      }, decidedTime);
      return () => {
        clearInterval(thinkInterval);
        clearTimeout(decidedTimeout);
      };
    }
    const timeout = setTimeout(() => {
      clearInterval(thinkInterval);
      setAiConsiderCell(placeCol);
      decidedTimeout = setTimeout(() => {
        makeMove(placeCol);
      }, decidedTime);
    }, miniumThinkTime - thinkTime);
    return () => {
      clearInterval(thinkInterval);
      clearTimeout(timeout);
      clearTimeout(decidedTimeout);
    };
  }, [
    player,
    gameStatus,
    isRAI,
    isYAI,
    makeMove,
    isAiTurn,
    board,
    noise,
    depth,
  ]);

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

  const previewCellClassName = (cell: string, cellIndex: number) => {
    let className = styles.circle;
    if (isAiTurn) {
      if (cellIndex === aiConsiderCell) {
        className += " " + styles[player];
      }
    } else {
      className += ` ${cell ? styles[player] : ""}`;
    }
    return className;
  };

  return (
    <>
      <p>This is a work in progress</p>
      <div className="bg-slate-700 p-2 mt-2 mb-4 mx-auto max-w-md rounded-xl">
        <div className="text-2xl text-center">
          {gameStatus !== "in progress"
            ? gameStatus === "tie"
              ? "It's a Tie!"
              : `${gameStatus === "R wins" ? "Red" : "Yellow"} wins!`
            : `${player === "R" ? "Red" : "Yellow"}'s turn`}
        </div>
        <div className={styles.gameBoard}>
          <div className={styles.inputRow}>
            {slotAbove.map((cell, cellIndex) => (
              <div
                key={-1 - cellIndex}
                className={styles.slotCell}
                onClick={() => {
                  if (!isAiTurn) makeMove(cellIndex);
                }}
                onMouseEnter={() => handleMouseEnter(cellIndex)}
                onMouseLeave={handleMouseLeave}
              >
                <div className={previewCellClassName(cell, cellIndex)}></div>
              </div>
            ))}
          </div>
          <div className={styles.slots}>
            {board.map((column, columnIndex) => {
              return (
                <div
                  key={columnIndex}
                  className={styles.column}
                  onClick={() => {
                    if (!isAiTurn) makeMove(columnIndex);
                  }}
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
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className={styles.checkboxDiv}>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="X-AI-switch"
                  type="checkbox"
                  role="switch"
                  checked={isRAI}
                  onChange={() => setIsRAI((prev) => !prev)}
                  className="sr-only peer"
                />
                <div className="w-9 h-4  peer-focus:outline-none rounded-full peer bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-300">
                  Red AI
                </span>
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="O-AI-switch"
                  type="checkbox"
                  role="switch"
                  checked={isYAI}
                  onChange={() => setIsYAI((prev) => !prev)}
                  className="sr-only peer"
                />
                <div className="w-9 h-4 peer-focus:outline-none rounded-full peer bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white  after:border after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-300">
                  Yellow AI
                </span>
              </label>
            </div>
            <button
              type="button"
              onClick={resetGame}
              className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5  bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800"
            >
              Reset
            </button>
          </div>
          <div className="flex items-center mb-1">
            <span className="block ml-0 mr-2 ms-3 text-sm font-medium text-gray-300">
              Search depth
            </span>
            <div className="relative flex items-center max-w-[8rem]">
              <button
                type="button"
                id="decrement-button"
                disabled={depth <= 0}
                onClick={() => setDepth((prev) => Math.max(prev - 1, 0))}
                className="bg-gray-600 hover:bg-gray-500 rounded-s-lg px-3 pb-3 pt-2.5 h-8 "
              >
                <svg
                  className="w-3 h-3 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 2"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h16"
                  />
                </svg>
              </button>
              <div className="bg-gray-600 border-x-0 border-gray-300 h-8 w-4 text-center text-sm  block text-white">
                <div className="w-fit h-fit m-auto pt-1.5">{depth}</div>
              </div>
              <button
                type="button"
                id="increment-button"
                disabled={depth >= 6}
                onClick={() => setDepth((prev) => Math.min(prev + 1, 6))}
                className=" bg-gray-600 hover:bg-gray-500 rounded-e-lg px-3 pb-3 pt-2.5 h-8"
              >
                <svg
                  className="w-3 h-3 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          <label
            htmlFor="ai-noise"
            className="flex items-center justify-center"
          >
            <span className="text-sm font-medium text-gray-300">AI noise</span>
            <input
              id="ai-noise"
              type="range"
              min="0.001"
              max="0.1"
              step="0.001"
              value={noise}
              onChange={(e) => setNoise(Number(e.target.value))}
              className="ml-1"
            />
          </label>
        </div>
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
