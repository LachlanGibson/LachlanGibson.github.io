import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { Slider } from "primereact/slider";
import styles from "./GameConnectFour.module.css";
import { copy2DArray } from "../../../utility/utilities";

type GameStatus = "in progress" | "R wins" | "Y wins" | "tie";
type Player = "R" | "Y";
type Coordinates = [number, number];
type CoordinateSet = Coordinates[];
type Board = string[][];

const miniumThinkTime = 900;
const decidedTime = 900;
const thinkFlowRate = 300;

const winPossibilities = [] as CoordinateSet[];
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

const findWinningCells = (
  board: Board,
  player: Player,
): CoordinateSet | undefined => {
  for (const winPossibility of winPossibilities) {
    const cell = winPossibility.find(
      ([col, row]) => board[col][row] !== player,
    );
    if (!cell) {
      return winPossibility;
    }
  }
};

const evaluateMemo: Record<string, number> = {};

const stringifyBoard = (board: Board): string => {
  return board
    .map((col) => {
      return col.map((cell) => (cell === "" ? "_" : cell)).join("");
    })
    .join("\n");
};

const minimax = (
  prevBoard: Board,
  action: number,
  depth: number,
  alpha: number,
  beta: number,
  prevPlayer: Player,
  player: Player,
  noise?: number,
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

const evaluateBoard = (board: Board) => {
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

const thinkStep = (board: Board, columnIndex: number, player: Player) => {
  const newBoard = copy2DArray(board);
  for (let i = newBoard[columnIndex].length - 1; i >= 0; i--) {
    if (newBoard[columnIndex][i] === "") {
      newBoard[columnIndex][i] = player;
      break;
    }
  }
  return newBoard;
};

const checkWin = (board: Board, columnIndex: number): GameStatus => {
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
  const [, win] = board.reduce(
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
    [0, false] as [number, boolean],
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

const availableMoves = (board: Board): number[] => {
  return board.reduce((acc, col, colIndex) => {
    if (!col[0]) {
      acc.push(colIndex);
    }
    return acc;
  }, [] as number[]);
};

const GameConnectFour: React.FC = () => {
  // note that the board array elements are in the order of columns, not rows
  const [board, setBoard] = useState<Board>([
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
  ]);
  const [player, setPlayer] = useState<Player>("R");
  const [gameStatus, setgameStatus] = useState<GameStatus>("in progress");
  const [noise, setNoise] = useState<number>(0.022);
  const [depth, setDepth] = useState<number>(4);
  const [isRAI, setIsRAI] = useState<boolean>(false);
  const [isYAI, setIsYAI] = useState<boolean>(true);
  const [aiConsiderCell, setAiConsiderCell] = useState<number>();
  const [lastCoordinates, setLastCoordinates] = useState<[number, number]>();
  const [winningCells, setWinningCells] = useState<CoordinateSet>();
  const [showScores, setShowScores] = useState<boolean>(false);

  const isAiTurn = useMemo(() => {
    if (gameStatus !== "in progress") return false;
    if (player === "R") return isRAI;
    if (player === "Y") return isYAI;
    return false;
  }, [player, isRAI, isYAI, gameStatus]);

  const currentScores = useMemo(() => {
    if (gameStatus !== "in progress") return undefined;
    if (!showScores) return undefined;
    const moves = availableMoves(board);
    const scores = moves.map((action) => {
      const score = minimax(
        board,
        action,
        depth,
        -Infinity,
        Infinity,
        player,
        player === "R" ? "Y" : "R",
      );
      return score;
    });
    return [moves, scores];
  }, [board, depth, gameStatus, player, showScores]);

  const makeMove = useCallback(
    (columnIndex: number) => {
      if (board[columnIndex][0] !== "" || gameStatus !== "in progress") {
        return;
      }
      const currentPlayer = player;
      const newBoard = thinkStep(board, columnIndex, currentPlayer);
      setBoard(newBoard);
      setPlayer((prev) => (prev === "R" ? "Y" : "R"));
      setLastCoordinates([
        columnIndex,
        newBoard[columnIndex].findIndex((cell) => cell),
      ]);
      const result = checkWin(newBoard, columnIndex);
      if (result !== "in progress") {
        const winCells = findWinningCells(newBoard, currentPlayer);
        setWinningCells(winCells);
        setgameStatus(result);
      }
    },
    [board, gameStatus, player],
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
            noise,
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
    const thinkInterval = setInterval(
      () => {
        //const cell = options[Math.floor(Math.random() * options.length)];
        const cell = options[optionIndex];
        optionIndex = (optionIndex + 1) % options.length;
        setAiConsiderCell(cell);
      },
      Math.floor(thinkFlowRate / options.length),
    );

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
    setLastCoordinates(undefined);
    setWinningCells(undefined);
  };

  const highlightSlot = (colIndex: number) => {
    let className = styles.column;
    if (isAiTurn) {
      if (colIndex === aiConsiderCell) {
        className += " " + styles.slotConsider;
      }
    } else if (gameStatus === "in progress") {
      className += " " + styles.humanTurn;
    }
    return className;
  };

  const checkLastCell = (colIndex: number, cellIndex: number) => {
    if (lastCoordinates && gameStatus === "in progress") {
      return (
        lastCoordinates[0] === colIndex && lastCoordinates[1] === cellIndex
      );
    }
    return false;
  };

  const isAWinningCell = (colIndex: number, cellIndex: number) => {
    if (winningCells) {
      return winningCells.some(
        ([winColIndex, winCellIndex]) =>
          winColIndex === colIndex && winCellIndex === cellIndex,
      );
    }
    return false;
  };

  return (
    <div className="mx-auto mt-2 mb-4 max-w-md p-0">
      <div className={styles.gameBoard}>
        <div className={styles.headerMessage}>
          {gameStatus !== "in progress"
            ? gameStatus === "tie"
              ? "It's a Tie!"
              : `${gameStatus === "R wins" ? "Blue" : "Yellow"} wins!`
            : `${player === "R" ? "Blue" : "Yellow"}'s turn`}
        </div>
        <div className={styles.slots}>
          {board.map((column, columnIndex) => {
            return (
              <div
                key={columnIndex}
                className={highlightSlot(columnIndex)}
                onClick={() => {
                  if (!isAiTurn) makeMove(columnIndex);
                }}
              >
                {column.map((cell, cellIndex) => {
                  return (
                    <div
                      key={cellIndex}
                      className={`${styles.cell} ${
                        isAWinningCell(columnIndex, cellIndex)
                          ? styles.winningCell
                          : ""
                      }`}
                    >
                      <div
                        className={`${styles.circle} ${
                          checkLastCell(columnIndex, cellIndex)
                            ? styles.lastCell
                            : ""
                        } ${cell ? styles[cell] : ""}`}
                      ></div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="grid h-5 w-full grid-cols-7 px-[min(1.5rem,6%)] text-[min(1rem,80%)] text-(--site-text)">
          {showScores &&
            currentScores &&
            board.map((column, columnIndex) => {
              return (
                <div key={columnIndex} className="w-full text-center">
                  {currentScores[0].includes(columnIndex)
                    ? Math.round(
                        currentScores[1][
                          currentScores[0].indexOf(columnIndex)
                        ] * 1000,
                      ) /
                        10 +
                      "%"
                    : ""}
                </div>
              );
            })}
        </div>
      </div>
      <Button
        type="button"
        onClick={resetGame}
        label="Reset Game"
        className={`${styles.settings} ${styles.resetButton}`}
      />
      <div
        className={`flex flex-col items-center justify-center ${styles.settings}`}
      >
        <div className="mt-1 text-xs font-medium text-(--site-text-muted)">
          AI Settings
        </div>
        <div className="m-1 flex w-full items-center justify-center gap-4">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-start justify-center gap-1">
              <label className="flex items-center gap-2">
                <InputSwitch
                  inputId="X-AI-switch"
                  checked={isRAI}
                  onChange={() => setIsRAI((prev) => !prev)}
                />
                <span className="text-sm font-medium">Blue</span>
              </label>
              <label className="flex items-center gap-2">
                <InputSwitch
                  inputId="O-AI-switch"
                  checked={isYAI}
                  onChange={() => setIsYAI((prev) => !prev)}
                />
                <span className="text-sm font-medium">Yellow</span>
              </label>
            </div>
          </div>
          <div className="flex flex-col items-start justify-center gap-1">
            <label
              htmlFor="ai-noise"
              className="flex items-center justify-center"
            >
              <span className="w-12 text-sm font-medium">Noise</span>
              <Slider
                id="ai-noise"
                min={0.001}
                max={0.1}
                step={0.001}
                value={noise}
                onChange={(e) => setNoise(Number(e.value))}
                className="w-28"
              />
            </label>
            <div className="flex items-center">
              <span className="block w-12 text-sm font-medium">Depth</span>
              <div className="relative flex max-w-32 items-center">
                <Button
                  type="button"
                  severity="secondary"
                  disabled={depth <= 0}
                  onClick={() => setDepth((prev) => Math.max(prev - 1, 0))}
                >
                  -
                </Button>
                <div className="block w-8 text-center text-sm">{depth}</div>
                <Button
                  type="button"
                  severity="secondary"
                  disabled={depth >= 6}
                  onClick={() => setDepth((prev) => Math.min(prev + 1, 6))}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>
        <label className="flex items-center gap-2">
          <InputSwitch
            inputId="show_scores-switch"
            checked={showScores}
            onChange={() => setShowScores((prev) => !prev)}
          />
          <span className="text-sm font-medium">Show Scores</span>
        </label>
      </div>
    </div>
  );
};

export default GameConnectFour;
