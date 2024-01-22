import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./GameTicTacToe.module.css";
import { BlockMath, InlineMath } from "react-katex";
import TreeDiagram from "./TreeDiagram";
import PythonCodeDisplay from "../ArticleGoogleFoobarChallenge/PythonCodeDisplay";
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
let minimaxMemo: { [key: string]: number } = {};
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
  expectedValue: any
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
      <div className="bg-slate-700 p-2 mt-2 mb-4 mx-auto max-w-md rounded-xl">
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
                id="X-AI-switch"
                type="checkbox"
                role="switch"
                checked={!isXHuman}
                onChange={() => setIsXHuman((prev) => !prev)}
                className="sr-only peer"
              />
              <div className="w-9 h-4 peer-focus:outline-none rounded-full peer bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-mediumtext-gray-300">
                X AI
              </span>
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="O-AI-switch"
                type="checkbox"
                role="switch"
                checked={!isOHuman}
                onChange={() => setIsOHuman((prev) => !prev)}
                className="sr-only peer"
              />
              <div className="w-9 h-4  peer-focus:outline-none rounded-full peer bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-300">
                O AI
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
        <div className="mx-auto text-center text-sm font-medium text-gray-300">
          Precise &harr; Chaotic
        </div>
        <label htmlFor="X-ai-difficulty" className={styles.aiDifficulty}>
          <div className="flex items-center justify-center">
            <input
              id="X-ai-difficulty"
              type="range"
              min="0.01"
              max="1"
              step="0.01"
              value={xTemperature}
              onChange={(e) => setXTemperature(Number(e.target.value))}
            />
            <span className="ms-3 text-sm font-medium text-gray-300">X</span>
          </div>
        </label>
        <label htmlFor="O-ai-difficulty" className={styles.aiDifficulty}>
          <div className="flex items-center justify-center">
            <input
              id="O-ai-difficulty"
              type="range"
              min="0.01"
              max="1"
              step="0.01"
              value={oTemperature}
              onChange={(e) => setOTemperature(Number(e.target.value))}
            />
            <span className="ms-3 text-sm font-medium text-gray-300">O</span>
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
          column, or diagonal. The game is a draw if all nine squares are filled
          and no player has achieved this goal. Under these rules, tic tac toe
          is a{" "}
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
          It is possible to calculate an upper bound on the total number of
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
          assigned to each board state: a win for X as <InlineMath math="+1" />,
          a win for O as <InlineMath math="-1" />, and a draw as{" "}
          <InlineMath math="0" />.
          <br />
          <br />
          In tic-tac-toe, both players choosing moves this way always results in
          a draw. However, optimal play by one player can depend on the other
          player's strategy, and many human players do not choose moves
          optimally. To make the game more interesting, I implemented an AI
          using a{" "}
          <em>Softmax-based probabilistic variant of the minimax algorithm</em>,
          where the AI considers actions as if they are taken randomly, with
          probabilities based on the expected scores. More specifically, the log
          probability of a move is proportional to its expected score, meaning
          the probability of a move is calculated using the{" "}
          <a
            href="https://en.wikipedia.org/wiki/Softmax_function"
            target="_blank"
            rel="noreferrer noopener"
          >
            softmax function
          </a>{" "}
          with a temperature parameter. This means that moves with higher
          expected scores are more likely to be chosen, but not every time. The
          temperature parameter controls the randomness of the AI's play or its
          expectation of the player's play. A lower temperature means the AI
          follows the minimax algorithm more closely, while a higher temperature
          makes all moves more equally likely.
          <br />
          <br />
          To compute the expected resulting score of a move, the AI needs to
          predict how its opponent will play. Therefore, the AI actually
          utilises two temperature parameters, one for choosing its own moves,
          and the other for how it models the other player's strategy. Let's get
          into the details of the mathematics and the algorithm. For a vector{" "}
          <InlineMath math={"\\mathbf{x}"} /> with components{" "}
          <InlineMath math={"x_i"} /> and a temperature{" "}
          <InlineMath math={"T"} />, the softmax function is
        </p>
        <BlockMath
          math={`\\text{Softmax}(x_i, T) = \\frac{e^{x_i / T}}{\\sum_j e^{x_j / T}}.`}
        />
        <p>
          This function normalises the vector so that all probabilitis are
          strictly positive and sum to 1 (try prove it yourself by adding the
          components). The probability, <InlineMath math="P" />, that player,{" "}
          <InlineMath math={"\\mathcal{P}"} />, choosed to move to the board
          state, <InlineMath math="C" /> from the board state{" "}
          <InlineMath math="B" /> is
        </p>
        <BlockMath
          math={
            "\\forall C\\in\\mathcal{C}(B),~ P(C|\\mathcal{P})=\\text{Softmax}((-1)^\\mathcal{P}S(C,1-\\mathcal{P}), T_\\mathcal{P}),"
          }
        />
        <p>
          where <InlineMath math={"\\mathcal{C}(B)"} /> is the set of all board
          states that can be reached in one move from <InlineMath math="B" />,{" "}
          <InlineMath math={"\\mathcal{P}=0"} /> when it is player X's turn, and{" "}
          <InlineMath math={"\\mathcal{P}=1"} /> when it is player O's turn.{" "}
          <InlineMath math="S" /> is the expected score given a board state and
          whos turn it is not. If the game is over then the score is{" "}
          <InlineMath math="+1" /> if X wins, <InlineMath math="-1" /> if O
          wins, and <InlineMath math="0" /> if it is a draw. Otherwise, we can
          calculate the expected score as
        </p>
        <BlockMath
          math={
            "S(B,\\mathcal{P})=\\sum_{C\\in\\mathcal{C}(B)}P(C|\\mathcal{P})S(C,1-\\mathcal{P})"
          }
        />
        <p>
          These two expressions provide a recursive relationship for calculating
          the expected score of any board state. The figure below illustrates an
          exmaple where player X is playing less randomly than player O with{" "}
          <InlineMath math={"T_0=0.2"} /> and <InlineMath math={"T_1=1"} />.
        </p>
        <TreeDiagram />
        <figcaption>
          The top board is the initial board state and it is X's turn. The
          expected score of each board state is shown above each baord. The
          probability of each move is shown as a percentage above each node in
          the tree. X, with a temperature of 0.2, is more likely to choose
          better moves than O which chooses with a temperature of 1.
        </figcaption>
        <PythonCodeDisplay codeFile="/blog/files/tic-tac-toe/example.py" />
      </div>
    </>
  );
};

export default GameTicTacToe;
