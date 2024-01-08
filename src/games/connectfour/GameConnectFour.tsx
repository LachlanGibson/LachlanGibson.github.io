import React, { useState } from "react";
import styles from "./GameConnectFour.module.css";

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
  const [slotAbove, setSlotAbove] = useState(["", "", "", "", "", "", ""]);

  return (
    <>
      <p>This is a work in progress</p>
      <div className={styles.gameBoard}>
        <div className={styles.inputRow}>
          {slotAbove.map((cell, cellIndex) => (
            <div key={-1 - cellIndex} className={styles.slotCell}>
              <div className={styles.circle}></div>
            </div>
          ))}
        </div>
        <div className={styles.slots}>
          {board.map((column, columnIndex) => {
            return (
              <div key={columnIndex} className={styles.column}>
                {column.map((cell, cellIndex) => {
                  return (
                    <div key={cellIndex} className={styles.cell}>
                      <div className={styles.circle}></div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default GameConnectFour;
