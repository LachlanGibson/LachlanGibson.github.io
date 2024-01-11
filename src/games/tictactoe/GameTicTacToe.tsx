import React, { useEffect, useMemo, useState } from "react";
import styles from "./GameTicTacToe.module.css";
import { BlockMath, InlineMath } from "react-katex";
type Player = "X" | "O";
type GameResult = Player | "Tie";
type Action = [number, number];

const miniumThinkTime = 500;
const decidedTime = 300;
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
      <div className="bg-neutral-800 p-2 mt-2 mb-4 mx-auto max-w-lg rounded-xl">
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
        <div className="flex items-center justify-center">
          <div className={styles.checkboxDiv}>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                role="switch"
                checked={!isXHuman}
                onChange={() => setIsXHuman((prev) => !prev)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                X AI
              </span>
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                role="switch"
                checked={!isOHuman}
                onChange={() => setIsOHuman((prev) => !prev)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                O AI
              </span>
            </label>
          </div>
          <button
            type="button"
            onClick={resetGame}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Reset
          </button>
        </div>
        <div className="mx-auto text-center text-sm font-medium text-gray-900 dark:text-gray-300">
          Precise &harr; Chaotic
        </div>
        <label htmlFor="X-ai-difficulty" className={styles.aiDifficulty}>
          <div className="flex items-center justify-center">
            <input
              name="X-ai-difficulty"
              type="range"
              min="0.01"
              max="1"
              step="0.01"
              value={xTemperature}
              onChange={(e) => setXTemperature(Number(e.target.value))}
            />
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              X
            </span>
          </div>
        </label>
        <label htmlFor="O-ai-difficulty" className={styles.aiDifficulty}>
          <div className="flex items-center justify-center">
            <input
              name="O-ai-difficulty"
              type="range"
              min="0.01"
              max="1"
              step="0.01"
              value={oTemperature}
              onChange={(e) => setOTemperature(Number(e.target.value))}
            />
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              O
            </span>
          </div>
        </label>
      </div>
      <div className="overflow-x-auto">
        <p>
          <a
            href="https://en.wikipedia.org/wiki/Tic-tac-toe"
            target="_blank"
            rel="noreferrer noopener"
          >
            Tic-tac-toe
          </a>
          , also known as noughts and crosses, is a simple two-player game
          played on a 3x3 grid. Each player alternates marking a space in the
          grid with their symbol: the first player uses 'X' and the second 'O'.
          The goal is to be the first to get three of their symbols in a row,
          column, or diagonal. If all nine squares are filled and no player has
          three in a row, the game is a draw. Under these rules, it is a{" "}
          <a
            href="https://en.wikipedia.org/wiki/Perfect_information"
            target="_blank"
            rel="noreferrer noopener"
          >
            perfect information
          </a>{" "}
          <a
            href="https://en.wikipedia.org/wiki/Zero-sum_game"
            target="_blank"
            rel="noreferrer noopener"
          >
            zero-sum game
          </a>
          .
          <br />
          <br />
          It's possible to calculate an upper bound on the total number of
          achievable unique board states as <InlineMath math={"3^9=19683"} />,
          since there are nine squares, each with three possible states: empty,
          X, or O. However, many of these states are unreachable, such as those
          where two players have three in a row simultaneously, or where the
          total number of Xs is not equal to or one more than the number of Os.
          Therefore, the actual number of unique board states is only{" "}
          <InlineMath math="5478" />. This makes it feasible for the computer to
          use a brute force approach to explore all possibilities when
          calculating the optimal move for each board state. A typical approach
          to solving a two-player zero-sum game is finding the{" "}
          <a
            href="https://en.wikipedia.org/wiki/Nash_equilibrium"
            target="_blank"
            rel="noreferrer noopener"
          >
            Nash equilibrium
          </a>{" "}
          using the{" "}
          <a
            href="https://en.wikipedia.org/wiki/Minimax"
            target="_blank"
            rel="noreferrer noopener"
          >
            minimax
          </a>{" "}
          algorithm, which identifies the optimal move for each player, assuming
          the opponent also plays optimally. This involves recursively exploring
          all possible moves and their outcomes, with player X aiming to
          maximise the score and player O aiming to minimise it. Scores are
          assigned to each board state: a win as <InlineMath math="+1" />, a
          loss as <InlineMath math="-1" />, and a draw as{" "}
          <InlineMath math="0" />.
          <br />
          <br />
          In tic-tac-toe, both players choosing moves this way typically results
          in a draw. However, optimal play by one player actually depends on the
          other player's choices, and many human players do not choose moves
          optimally. To make the game more interesting, I implemented an AI
          using a{" "}
          <em>Softmax-based probabilistic variant of the minimax algorithm</em>,
          where the AI considers actions as if they are taken randomly, based on
          a temperature parameter. The likelihood of choosing an action is
          determined by the expected value of that action, calculated using the{" "}
          <a
            href="https://en.wikipedia.org/wiki/Softmax_function"
            target="_blank"
            rel="noreferrer noopener"
          >
            softmax function
          </a>
          . Moves with higher expected values are more likely to be chosen, but
          not always. The temperature parameter controls the randomness of the
          AI's play or its expectation of the player's play. A lower temperature
          means the AI follows the minimax algorithm more closely, while a
          higher temperature makes all moves increasingly likely.
          <br />
          <br />
          Let's get into the details of the mathematics and the algorithm. For a
          vector with components <InlineMath math={"x_i"} /> and a temperature{" "}
          <InlineMath math={"T"} />, the softmax function is
        </p>
        <BlockMath
          math={`\\text{Softmax}(x_i, T) = \\frac{e^{x_i / T}}{\\sum_j e^{x_j / T}}.`}
        />
        <p>
          This function will normalise the vector so that all probabilitis are
          strictly positive and sum to 1. The probability,{" "}
          <InlineMath math="P" />, of choosing to move to the board state,{" "}
          <InlineMath math="C" /> from the board state <InlineMath math="B" />{" "}
          is
        </p>
        <BlockMath math={"P(C|\\text{X})=\\text{Softmax}(V(C), T_\\text{X})"} />
        <BlockMath
          math={`V(B)=
          \\begin{cases}
            +1, & \\text{X wins}\\\\
            -1, & \\text{O wins}\\\\
            0, & \\text{draw}\\\\
          \\sum_{C\\in\\mathcal{C}(B)}P(C|\\mathcal{P})V(C), & \\text{otherwise}
          \\end{cases}`}
        />
      </div>
    </>
  );
};

export default GameTicTacToe;
