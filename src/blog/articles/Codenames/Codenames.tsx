import React from "react";
import GameCodenames from "./GameCodenames";

const Codenames: React.FC = () => {
  return (
    <>
      <div className="text-red-400 m-4">
        <p className="font-bold text-xl">
          This is a work in progress. Remaining tasks:
        </p>
        <ul className="list-disc ml-8">
          <li>
            Complete game logic
            <ul className="list-disc ml-8">
              <li>Game over conditions</li>
              <li>End turn logic</li>
              <li>Only provide new clue at the start of each turn</li>
              <li>Special guess logic (unlimited, zero)</li>
            </ul>
          </li>
          <li>Improve UI</li>
          <li>Improve AI clues</li>
          <li>
            Write article explaining the game and AI logic
            <ul className="list-disc ml-8">
              <li>Explain the game and rules</li>
              <li>Explain embedding</li>
              <li>Explain the scoring system</li>
              <li>Explain the clue selection process</li>
              <li>Include polished code</li>
            </ul>
          </li>
          <li>Publish AI on GitHub</li>
        </ul>
      </div>
      <GameCodenames />
    </>
  );
};

export default Codenames;
