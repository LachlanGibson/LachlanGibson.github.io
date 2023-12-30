import React from "react";
import "./GameConnectFour.css";

const GameConnectFour: React.FC = () => {
  // note that the board array elements are in the order of columns, not rows
  const [board, setBoard] = React.useState<string[][]>([
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
    ["", "", "", "", "", ""],
  ]);

  return (
    <>
      <div className="game-board">
        {board.map((column, columnIndex) => {
          return (
            <div key={columnIndex} className="column">
              {column.map((cell, cellIndex) => {
                return <div key={cellIndex} className="cell"></div>;
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default GameConnectFour;
