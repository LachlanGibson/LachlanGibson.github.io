import React, { useState, useEffect, useCallback } from "react";
import { range, shuffleArray } from "../../../utility/utilities";
import wordList from "./wordList";

type Team = "red" | "blue";
type Card = Team | "assassin" | "bystander";

const initialKey: Card[] = [
  "assassin",
  "red",
  "red",
  "red",
  "red",
  "red",
  "red",
  "red",
  "red",
  "red",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "blue",
  "bystander",
  "bystander",
  "bystander",
  "bystander",
  "bystander",
  "bystander",
  "bystander",
];
const boardSize = 25;

function MyComponent() {
  const [rawScores, setRawScores] = useState();
  const [spyMasterKey, setSpyMasterKey] = useState<Card[]>([]);
  const [boardIndices, setBoardIndices] = useState<number[]>(
    range(0, wordList.length)
  );
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [turn, setTurn] = useState<Team>("red");

  const reset = useCallback(() => {
    setSpyMasterKey(shuffleArray(initialKey));
    setBoardIndices((prev) => shuffleArray(prev));
    setTurn("red");
    setRevealed(new Array(boardSize).fill(false));
  }, []);

  useEffect(() => {
    fetch("/blog/files/codenames/glove.6B.300d_compressed_scores.json")
      .then((response) => response.json())
      .then((jsonData) => setRawScores(jsonData))
      .catch((error) => console.error("Error fetching the JSON file:", error));
  }, []);

  useEffect(() => {
    if (!rawScores) return;
    reset();
  }, [rawScores, reset]);

  const cardClassName = (index: number) => {
    const name = revealed[index]
      ? "text-xs text-slate-500"
      : "font-bold sm:text-lg sm2:text-base text-xs text-black";
    if (!revealed[index]) return name + " bg-white";
    if (spyMasterKey[index] === "red")
      return name + " bg-red-400 text-slate-700";
    if (spyMasterKey[index] === "blue") return name + " bg-sky-400";
    if (spyMasterKey[index] === "assassin") return name + " bg-gray-900";
    return name + " bg-gray-400";
  };

  const transitionClass = "transition duration-300 ease-in-out";

  const handleGuess = (index: number) => {
    if (revealed[index]) return;
    setRevealed((prev) => {
      const newRevealed = [...prev];
      newRevealed[index] = true;
      return newRevealed;
    });
    setTurn((prev) => (prev === "red" ? "blue" : "red"));
  };

  return (
    <div className="max-w-3xl mx-auto bg-slate-500 sm2:p-2 p-1 rounded-lg flex flex-col items-center">
      <div
        className={`text-2xl mb-2 text-cente ${
          turn === "red" ? "text-red-400" : "text-sky-400"
        }`}
      >
        {turn === "red" ? "Red's clue: " : "Blue's clue: "}
      </div>
      <div
        className={`grid sm:grid-cols-5 sm2:grid-cols-4 grid-cols-3 sm2:gap-2 gap-1 w-full`}
      >
        {boardIndices.slice(0, boardSize).map((wordIndex, i) => (
          <button
            key={i}
            disabled={revealed[i]}
            onClick={() => handleGuess(i)}
            className={`sm2:h-12 h-9 px-0 rounded-md shadow-md m-0 text-center ${transitionClass} ${cardClassName(
              i
            )}`}
          >
            {wordList[wordIndex].toUpperCase()}
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center mt-2">
        <button
          type="button"
          onClick={reset}
          className="text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5  bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default MyComponent;
