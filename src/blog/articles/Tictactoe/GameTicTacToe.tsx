import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { Slider } from "primereact/slider";
import styles from "./GameTicTacToe.module.css";
import {
  compareNumberArrays,
  copy2DArray,
  dotProduct,
  randomChoice,
  softMaxT,
} from "../../../utility/utilities";
type Player = "X" | "O";
type GameResult = Player | "Tie";
type Action = [number, number];

const miniumThinkTime = 500;
const decidedTime = 300;
const minimaxMemo: { [key: string]: number } = {};
let expectedValueMemo: { [key: string]: number } = {};

const availableActions = (board: string[][]): Action[] =>
  board.reduce<Action[]>((acc, row, i) => {
    row.forEach((cell, j) => cell || acc.push([i, j]));
    return acc;
  }, []);

const thinkMove = (board: string[][], player: Player, action: Action) => {
  const newBoard = copy2DArray(board);
  newBoard[action[0]][action[1]] = player;
  return newBoard;
};

const getActionValues = (
  board: string[][],
  player: Player,
  expectedValue: (board: string[][], player: Player, move: Action) => number
): [Action[], number[]] => {
  const actions = availableActions(board);
  const values = availableActions(board).map((move) => {
    return expectedValue(board, player, move);
  });
  return [actions, values];
};

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
  const [xTemperature, setXTemperature] = useState<number>(0.1);
  const [oTemperature, setOTemperature] = useState<number>(0.1);

  const isAiTurn = useMemo(() => {
    if (gameOver) return false;
    if (turn === "X") return !isXHuman;
    if (turn === "O") return !isOHuman;
    return false;
  }, [turn, isXHuman, isOHuman, gameOver]);

  const makeMove = useCallback(
    (row: number, col: number, player: Player) => {
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
    },
    [board, turn]
  );

  const expectedValue = useCallback(
    (prevBoard: string[][], prevPlayer: Player, move: Action) => {
      const board = thinkMove(prevBoard, prevPlayer, move);
      const boardString = stringifyBoard(board);
      if (expectedValueMemo[boardString]) {
        return expectedValueMemo[boardString];
      }
      if (checkWinningMove(board, move[0], move[1])) {
        minimaxMemo[boardString] = prevPlayer === "X" ? 1 : -1;
        return minimaxMemo[boardString];
      }

      if (isBoardFull(board)) {
        minimaxMemo[boardString] = 0;
        return minimaxMemo[boardString];
      }

      const player = prevPlayer === "X" ? "O" : "X";
      const [, values] = getActionValues(board, player, expectedValue);

      const probs = softMaxT(
        values,
        player === "X" ? xTemperature : -oTemperature
      );
      expectedValueMemo[boardString] = dotProduct(values, probs);
      return expectedValueMemo[boardString];
    },
    [oTemperature, xTemperature]
  );

  useEffect(() => {
    if (!isAiTurn) {
      setAiConsiderCell(() => []);
      return;
    }

    const aiChooseMove = (board: string[][]) => {
      expectedValueMemo = {};
      const [moves, values] = getActionValues(board, turn, expectedValue);
      const probs = softMaxT(
        values,
        turn === "X" ? xTemperature : -oTemperature
      );
      const index = randomChoice(probs);
      return moves[index];
    };

    const options = availableActions(board);
    const thinkInterval = setInterval(() => {
      const cell = options[Math.floor(Math.random() * options.length)];
      setAiConsiderCell(cell);
    }, 100);

    let decidedTimeout: NodeJS.Timeout;
    const startTime = Date.now();
    const [placeRow, placeCol] = aiChooseMove(board);
    const endTime = Date.now();
    const thinkTime = endTime - startTime;
    if (thinkTime >= miniumThinkTime) {
      clearInterval(thinkInterval);
      setAiConsiderCell([placeRow, placeCol]);
      decidedTimeout = setTimeout(() => {
        makeMove(placeRow, placeCol, turn);
      }, decidedTime);
      return () => {
        clearInterval(thinkInterval);
        clearTimeout(decidedTimeout);
      };
    }
    const timeout = setTimeout(() => {
      clearInterval(thinkInterval);
      setAiConsiderCell([placeRow, placeCol]);
      decidedTimeout = setTimeout(() => {
        makeMove(placeRow, placeCol, turn);
      }, decidedTime);
    }, miniumThinkTime - thinkTime);
    return () => {
      clearInterval(thinkInterval);
      clearTimeout(timeout);
      clearTimeout(decidedTimeout);
    };
  }, [
    turn,
    isXHuman,
    isOHuman,
    gameOver,
    oTemperature,
    xTemperature,
    makeMove,
    board,
    expectedValue,
    isAiTurn,
  ]);

  const stringifyBoard = (board: string[][]): string => {
    return board
      .map((row) => {
        return row.map((cell) => (cell === "" ? "_" : cell)).join("");
      })
      .join("\n");
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
    return board.every((row) => row.every((cell) => cell));
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
    if (compareNumberArrays(aiConsiderCell, [rowIndex, colIndex])) {
      className += " " + styles.aiConsiderCell;
    }
    if (isAiTurn) {
      className += " " + styles.aiTurn;
    }
    return className;
  }

  return (
    <>
      <div className="mx-auto mt-2 mb-4 max-w-lg rounded-xl border border-(--site-border) bg-(--site-surface) p-3 shadow-(--site-shadow)">
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
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
          <div className={styles.checkboxDiv}>
            <label className="flex items-center gap-2">
              <InputSwitch
                inputId="X-AI-switch"
                checked={!isXHuman}
                onChange={() => setIsXHuman((prev) => !prev)}
              />
              <span className={styles.controlLabel}>X AI</span>
            </label>
            <label className="flex items-center gap-2">
              <InputSwitch
                inputId="O-AI-switch"
                checked={!isOHuman}
                onChange={() => setIsOHuman((prev) => !prev)}
              />
              <span className={styles.controlLabel}>O AI</span>
            </label>
          </div>
          <Button type="button" onClick={resetGame} label="Reset" size="small" />
        </div>
        <div className="mx-auto mt-2 text-center text-sm font-medium text-(--site-text-muted)">
          Precise &harr; Chaotic
        </div>
        <label htmlFor="X-ai-difficulty">
          <div className="mt-1 flex items-center justify-center gap-2">
            <Slider
              id="X-ai-difficulty"
              min={0.01}
              max={1}
              step={0.01}
              value={xTemperature}
              onChange={(e) => setXTemperature(Number(e.value))}
              className="w-40"
            />
            <span className="w-4 text-center text-sm font-medium">X</span>
          </div>
        </label>
        <label htmlFor="O-ai-difficulty">
          <div className="flex items-center justify-center gap-2">
            <Slider
              id="O-ai-difficulty"
              min={0.01}
              max={1}
              step={0.01}
              value={oTemperature}
              onChange={(e) => setOTemperature(Number(e.value))}
              className="w-40"
            />
            <span className="w-4 text-center text-sm font-medium">O</span>
          </div>
        </label>
      </div>
    </>
  );
};

export default GameTicTacToe;
