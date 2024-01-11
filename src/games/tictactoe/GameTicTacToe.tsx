import React, { useEffect, useMemo, useState } from "react";
import styles from "./GameTicTacToe.module.css";
type Player = "X" | "O";
type GameResult = Player | "Tie";
type Action = [number, number];

const miniumThinkTime = 700;
let minimaxMemo: { [key: string]: number } = {};
let expectedValueMemo: { [key: string]: number } = {};

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

  const availableActions = (board: string[][]): Action[] =>
    board.reduce<Action[]>((acc, row, i) => {
      row.forEach((cell, j) => cell || acc.push([i, j]));
      return acc;
    }, []);

  const aiChooseMove = (board: string[][]) => {
    expectedValueMemo = {};
    const [moves, values] = getActionValues(board, turn);
    const probs = softMax(values, turn === "X" ? xTemperature : -oTemperature);
    const cumProb = probs.reduce(
      (acc, prob) => [...acc, acc[acc.length - 1] + prob],
      [0]
    );
    const rand = Math.random();
    const index = cumProb.findIndex((prob) => prob > rand) - 1;
    return moves[index];
  };

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

  const thinkMove = (board: string[][], player: Player, action: Action) => {
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

  const softMax = (values: number[], temperature: number) => {
    const valuesExp = values.map((value) => Math.exp(value / temperature));
    const valuesExpSum = valuesExp.reduce((acc, value) => acc + value, 0);
    return valuesExp.map((value) => value / valuesExpSum);
  };

  const dotProduct = (arr1: number[], arr2: number[]) => {
    return arr1.reduce((acc, value, index) => acc + value * arr2[index], 0);
  };

  const getActionValues = (
    board: string[][],
    player: Player
  ): [Action[], number[]] => {
    const actions = availableActions(board);
    const values = availableActions(board).map((move) => {
      return expectedValue(board, player, move);
    });
    return [actions, values];
  };

  const expectedValue = (
    prevBoard: string[][],
    prevPlayer: Player,
    move: Action
  ) => {
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
    const [, values] = getActionValues(board, player);

    const probs = softMax(
      values,
      player === "X" ? xTemperature : -oTemperature
    );
    expectedValueMemo[boardString] = dotProduct(values, probs);
    return expectedValueMemo[boardString];
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
        <label htmlFor="X-ai-difficulty" className={styles.aiDifficulty}>
          X temperature (higher is more random)
          <input
            name="X-ai-difficulty"
            type="range"
            min="0.01"
            max="1"
            step="0.01"
            value={xTemperature}
            onChange={(e) => setXTemperature(Number(e.target.value))}
          />
        </label>
        <label htmlFor="O-ai-difficulty" className={styles.aiDifficulty}>
          O temperature (higher is more random)
          <input
            name="O-ai-difficulty"
            type="range"
            min="0.01"
            max="1"
            step="0.01"
            value={oTemperature}
            onChange={(e) => setOTemperature(Number(e.target.value))}
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
            AI is implemented using a Softmax-based Probabilistic variant of the
            minimax algorithm, where the AI assumes actions are taken at random
            based on a temperature.
          </li>
          <li>
            The temperature sliders indicate how random the AI plays or expects
            the player to play. These correspond to a temperature used in the
            softmax function when calculating probabilities.
          </li>
          <li>
            An AI player with low temperature will almost always play optimally,
            assuming the temperature level of the opponent matches the other
            slider. The closer both sliders are to zero, the closer the
            algorithm follows the minimax algorithm.
          </li>
        </ul>
      </div>
    </>
  );
};

export default GameTicTacToe;
