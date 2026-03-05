import React, { useState, useEffect, useCallback } from "react";
import { Button } from "primereact/button";
import { range, shuffleArray } from "../../../utility/utilities";
import wordList from "./wordList";

//const infinityString = "\u221E";

type Team = "red" | "blue";
type Card = Team | "assassin" | "bystander";
type Clue = [string, number];
type RawScores = Record<string, number[]>;

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
const boardSize = initialKey.length;
const arrayRange = range(0, wordList.length);

const evaluateGapClues = (
  gap: number,
  player: Team,
  codeIndices: number[],
  spyKey: string[],
  clueOptionsList: string[],
  rawScores: RawScores
): Clue[] => {
  return clueOptionsList.reduce<Clue[]>(
    (acc, clue) => {
      const scores = codeIndices.map((index) => rawScores[clue][index]);
      const maxOpponent = spyKey.reduce((max, card, i) => {
        if (card !== player) return Math.max(max, scores[i]);
        return max;
      }, 0);

      const countBetter = scores.filter(
        (score) => score > maxOpponent + gap
      ).length;

      if (acc.length === 0) return [[clue, countBetter]];
      if (countBetter > acc[0][1]) return [[clue, countBetter]];
      if (countBetter === acc[0][1]) return [...acc, [clue, countBetter]];
      return acc;
    },
    [["", -1]]
  );
};

const decideClue = (
  player: Team,
  codeIndices: number[],
  spyKey: Card[],
  clueOptionsList: string[],
  rawScores: RawScores
): Clue => {
  let clueScorePair: [string, number][] = [];
  let bestScore = Number.NEGATIVE_INFINITY;
  for (let gap = 5; gap >= 0; gap--) {
    const newClueScorePair = evaluateGapClues(
      gap,
      player,
      codeIndices,
      spyKey,
      clueOptionsList,
      rawScores
    );
    const newScore = newClueScorePair[0][1] * (gap + 2);
    if (newScore > bestScore) {
      bestScore = newScore;
      clueScorePair = newClueScorePair;
    }
  }
  const result: Clue =
    clueScorePair[Math.floor(Math.random() * clueScorePair.length)];
  return [result[0].toUpperCase(), result[1]];
};

const GameCodenames: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [rawScores, setRawScores] = useState<RawScores>({});
  const [spyMasterKey, setSpyMasterKey] = useState<Card[]>([]);
  const [boardIndices, setBoardIndices] = useState<number[]>(
    range(0, boardSize)
  );
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [turn, setTurn] = useState<Team>("red");
  const [clueOptions, setClueOptions] = useState<Record<Team, string[]>>({
    red: [],
    blue: [],
  });
  const [currentClue, setCurrentClue] = useState<Clue>(["", 0]);
  const [guessNumber, setGuessNumber] = useState(0);

  const updateClue = useCallback(() => {
    const remainingIndices = boardIndices.filter(
      (i, arrayIndex) => !revealed[arrayIndex]
    );
    const remainingKey = spyMasterKey.filter(
      (card, arrayIndex) => !revealed[arrayIndex]
    );

    const clue = decideClue(
      turn,
      remainingIndices,
      remainingKey,
      clueOptions[turn],
      rawScores
    );
    setCurrentClue(clue);
    console.log(clue);
  }, [boardIndices, clueOptions, rawScores, revealed, spyMasterKey, turn]);

  const reset = useCallback(() => {
    const newKey = shuffleArray(initialKey);
    const newIndices = shuffleArray(arrayRange).slice(0, boardSize);

    const assassinPosition = newKey.findIndex((card) => card === "assassin");
    const assassinIndex = newIndices[assassinPosition];
    const newClueOptions = {
      red: [] as string[],
      blue: [] as string[],
    };
    for (const [word, scores] of Object.entries(rawScores)) {
      if (scores[assassinIndex] > 0) {
        newClueOptions.red.push(word);
        newClueOptions.blue.push(word);
      }
    }

    setClueOptions(newClueOptions);
    setSpyMasterKey(newKey);
    setBoardIndices(newIndices);
    setTurn("red");
    setRevealed(new Array(boardSize).fill(false));
  }, [rawScores]);

  useEffect(() => {
    updateClue();
  }, [updateClue, turn]);

  useEffect(() => {
    if (!loading) return;
    fetch("/blog/files/codenames/sim_scores.json")
      .then((response) => response.json())
      .then((simStringScores: { [key: string]: string }) => {
        const simScores: { [word: string]: number[] } = {};
        for (const [word, strings] of Object.entries(simStringScores)) {
          simScores[word] = strings.split("").map(Number);
        }
        setRawScores(simScores);
      })
      .catch((error) => console.error("Error fetching the JSON file:", error));
  }, [loading]);

  useEffect(() => {
    if (!rawScores) return;
    if (loading) {
      setLoading(false);
      reset();
    }
  }, [loading, rawScores, reset]);

  const cardStyle = (index: number): React.CSSProperties => {
    const isHidden = !revealed[index];
    if (isHidden) {
      return {
        backgroundColor: "var(--site-surface-alt)",
        color: "var(--site-text)",
      };
    }
    if (spyMasterKey[index] === "red") {
      return { backgroundColor: "#f87171", color: "#1f2937" };
    }
    if (spyMasterKey[index] === "blue") {
      return { backgroundColor: "#38bdf8", color: "#082f49" };
    }
    if (spyMasterKey[index] === "assassin") {
      return { backgroundColor: "#111827", color: "#e5e7eb" };
    }
    return { backgroundColor: "#9ca3af", color: "#111827" };
  };

  const transitionClass = "transition duration-300 ease-in-out";

  const handleGuess = (index: number) => {
    if (revealed[index] || loading) return;
    setRevealed((prev) => {
      const newRevealed = [...prev];
      newRevealed[index] = true;
      return newRevealed;
    });
    if (spyMasterKey[index] === turn) {
      setGuessNumber((prev) => prev + 1);
    } else {
      setGuessNumber(0);
      setTurn((prev) => (prev === "red" ? "blue" : "red"));
    }
  };

  return (
    <>
      <div
        className="sm2:p-2 mx-auto flex max-w-3xl flex-col items-center rounded-lg border border-(--site-border) bg-(--site-surface) p-1"
      >
        {loading && <div className="mb-2 text-center text-2xl">Loading...</div>}
        {!loading && (
          <div
            className="mb-2 text-center text-2xl"
            style={{ color: turn === "red" ? "#f87171" : "#38bdf8" }}
          >
            {`${turn === "red" ? "Red" : "Blue"}'s clue: ${currentClue[0]} x ${
              currentClue[1]
            }. Guesses: ${guessNumber}`}
          </div>
        )}
        <div
          className={`sm2:gap-2 grid w-full gap-1`}
          style={{
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(7.5rem,32%), 1fr))",
          }}
        >
          {boardIndices.map((wordIndex, i) => (
            <button
              key={i}
              type="button"
              disabled={revealed[i]}
              onClick={() => handleGuess(i)}
              className={`sm2:h-12 m-0 h-9 rounded-md px-0 text-center shadow-md ${transitionClass} ${
                revealed[i]
                  ? "text-xs"
                  : "sm2:text-base text-xs font-bold sm:text-lg"
              }`}
              style={{
                ...cardStyle(i),
                border: "1px solid var(--site-border)",
                width: "100%",
              }}
            >
              {`${loading ? "..." : wordList[wordIndex].toUpperCase()}`}
            </button>
          ))}
        </div>
        <div className="mt-2 flex flex-col items-center">
          <Button type="button" onClick={reset} label="Reset" />
        </div>
      </div>
    </>
  );
};

export default GameCodenames;
