import React, { useEffect, useState } from "react";
import styles from "./GameConnectFour.module.css";

type GameStatus = "in progress" | "R wins" | "Y wins" | "tie";

const emptyRow = ["", "", "", "", "", "", ""];

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
  const [player, setPlayer] = useState<"R" | "Y">("R");
  const [gameStatus, setgameStatus] = useState<GameStatus>("in progress");

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
