import React, { useCallback, useEffect } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import {
  compareNumberArrays,
  countUniqueStrings,
  getPermutations,
  range,
  shuffleArray,
  transformHexColour,
  memoise,
} from "../../../utility/utilities";

const colourOptions = [
  "#e62c2c", //red
  "#5fde3c", //greed
  "#3f3cde", //blue
  "#dedb3c", //yellow
  "#de3cc6", //purple
  "#de6321", //orange
  "#212121", //black
  "#e3e3e3", //white
];
const maxNumberOfColours = colourOptions.length;
const indexRange = range(0, maxNumberOfColours);
const initialCodeSize = 4;
const initialGuessLimit = 12;

type ColourPeg = number;
type Code = ColourPeg[];
type PegKey = [number, number];
type ColourCounts = Record<ColourPeg, number>;

/**
 * Compares a guess code against the secret code and returns feedback in the form of red and white pegs.
 * - Red pegs (first number): Correct color in correct position
 * - White pegs (second number): Correct color in wrong position
 *
 * This implementation correctly handles duplicate colors by:
 * 1. First counting exact matches (red pegs)
 * 2. Then counting remaining colors that appear in both code and guess (white pegs)
 * 3. For duplicates, only counting up to the number of times the color appears in the code
 *
 * @param guess - The code being guessed by the player
 * @param code - The secret code to compare against
 * @returns A tuple of [redPegs, whitePegs] where:
 *          - redPegs: number of correct position and color matches
 *          - whitePegs: number of correct color but wrong position matches
 *
 * @example
 * // If code is [1, 2, 3, 4] and guess is [1, 3, 5, 4]
 * // Returns [2, 1] (2 red pegs for positions 0 and 3, 1 white peg for color 3)
 * const result = compareCodes([1, 3, 5, 4], [1, 2, 3, 4]);
 */
function compareCodes(guess: Code, code: Code): PegKey {
  // count number of correct positions, and number of other colours in code and guess
  const [redKeyCount, codeCounts, guessCounts] = code.reduce(
    (acc, codeColour, index) => {
      const guessColour = guess[index];
      if (codeColour === guessColour) {
        acc[0]++;
      } else {
        acc[1][codeColour] = (acc[1][codeColour] || 0) + 1;
        acc[2][guessColour] = (acc[2][guessColour] || 0) + 1;
      }
      return acc;
    },
    [0, {}, {}] as [number, ColourCounts, ColourCounts]
  );

  // tally white pegs
  const whiteKeyCount = indexRange.reduce((acc, colour) => {
    acc += Math.min(codeCounts[colour] || 0, guessCounts[colour] || 0);
    return acc;
  }, 0);

  return [redKeyCount, whiteKeyCount];
}

const memoisedCompareCodes = memoise(compareCodes);

/**
 * Calculates the expected size of the remaining possibilities after making each possible guess.
 * A lower value indicates a better guess as it's expected to eliminate more possibilities.
 *
 * @param possibilities - Array of possible codes that could be the solution
 * @param choices - Array of codes to consider as potential guesses, defaults to the same array as possibilities
 * @returns An array of numbers corresponding to the expected size of the possibility space after each guess in choices
 */
function expectedNextSizes(
  possibilities: Code[],
  choices: Code[] = possibilities
): number[] {
  return choices.map((guess) => {
    const pegKeyStrings = possibilities.map((code) =>
      memoisedCompareCodes(guess, code).join("")
    );
    const pegKeyCounts = countUniqueStrings(pegKeyStrings);
    return (
      pegKeyCounts.reduce(
        (sumCountSquare, count) => sumCountSquare + count[1] ** 2,
        0
      ) / possibilities.length
    );
  });
}

const requiredTurnsMemo: Record<string, [number, Code]> = {};
const requiredTurns = (
  possibilities: Code[],
  turns = 0,
  alpha = -Infinity,
  beta = Infinity
): [number, Code] => {
  const codeString = possibilities.toString();
  if (requiredTurnsMemo[codeString]) {
    const cashed = requiredTurnsMemo[codeString];
    return [turns + cashed[0], cashed[1]];
  }

  if (possibilities.length === 1) {
    requiredTurnsMemo[codeString] = [0, possibilities[0]];
    return [turns, possibilities[0]];
  }

  let bestGuess: [number, Code] = [Infinity, possibilities[0]];
  const alphaInput = alpha;
  for (const guess of possibilities) {
    let worstTurns = -Infinity;
    const results = possibilities.map((code) =>
      compareCodes(guess, code).join("")
    );
    const counts = countUniqueStrings(results, "ascending");
    alpha = alphaInput;
    for (const [result] of counts) {
      const nextPossibilities = possibilities.filter(
        (code, index) => results[index] === result
      );
      worstTurns = Math.max(
        worstTurns,
        requiredTurns(nextPossibilities, turns + 1, alpha, beta)[0]
      );
      if (worstTurns >= beta) break;
      alpha = Math.max(alpha, worstTurns);
    }
    if (worstTurns < bestGuess[0]) {
      bestGuess = [worstTurns, guess];
    }
    if (bestGuess[0] <= alphaInput) break;
    beta = Math.min(beta, bestGuess[0]);
  }
  requiredTurnsMemo[codeString] = [bestGuess[0] - turns, bestGuess[1]];
  return bestGuess;
};

const MastermindPeg: React.FC<{
  colour: string;
  onClick?: React.MouseEventHandler;
  sizeClass?: string;
}> = ({ colour, onClick, sizeClass = "w-11" }) => {
  const lightColour = transformHexColour(colour, 40);
  const darkColour = transformHexColour(colour, -40);

  const customStyle = {
    background: `radial-gradient(circle at 30% 30%, ${lightColour}, ${colour}, ${darkColour})`,
    boxShadow: "0.4rem 0.4rem 0.5rem rgba(0, 0, 0, 0.4)",
  };

  return (
    <div
      className={`${sizeClass} aspect-square rounded-full`}
      style={customStyle}
      onClick={onClick}
    ></div>
  );
};

const EmptyPeg: React.FC<{
  onClick?: React.MouseEventHandler;
  sizeClass?: string;
}> = ({ onClick, sizeClass = "w-11" }) => {
  return (
    <div
      className={`${sizeClass} aspect-square rounded-full bg-black/95`}
      onClick={onClick}
    ></div>
  );
};

const GameMastermind: React.FC = () => {
  const [maxNumberOfGuesses, setMaxNumberOfGuesses] =
    React.useState(initialGuessLimit);
  const [codeSize, setCodeSize] = React.useState(initialCodeSize);
  const [numberOfColours, setNumberOfColours] = React.useState(6);
  const [code, setCode] = React.useState<Code>(
    shuffleArray(indexRange.slice(0, numberOfColours)).slice(0, initialCodeSize)
  );
  const [currentGuess, setCurrentGuess] = React.useState<number[]>(
    Array(initialCodeSize).fill(-1)
  );
  const [guesses, setGuesses] = React.useState<number[][]>([]);
  const [guessResults, setGuessResults] = React.useState<[number, number][]>(
    []
  );
  const [gameStatus, setGameStatus] = React.useState<"win" | "lose" | null>(
    null
  );

  const [possibleCodes, setPossibleCodes] = React.useState<Code[]>([]);
  const [, setInitialPossibleCodes] = React.useState<Code[]>([]);

  const handleOptionClick = useCallback(
    (optionIndex: number) => {
      if (gameStatus) return;
      setCurrentGuess((currentGuess) => {
        const newGuess = [...currentGuess];
        const nextEmptyPegIndex = newGuess.indexOf(-1);
        if (nextEmptyPegIndex !== -1) {
          newGuess[nextEmptyPegIndex] = optionIndex;
          return newGuess;
        }
        return currentGuess;
      });
    },
    [gameStatus]
  );

  const handleGuessClick = useCallback(
    (guessIndex: number) => {
      if (gameStatus) return;
      setCurrentGuess((guess) => {
        const newGuess = [...guess];
        newGuess[guessIndex] = -1;
        return newGuess;
      });
    },
    [gameStatus]
  );

  const resetGame = useCallback(() => {
    setCode(
      shuffleArray(indexRange.slice(0, numberOfColours)).slice(0, codeSize)
    );
    setCurrentGuess(Array(codeSize).fill(-1));
    setGuesses([]);
    setGuessResults([]);
    setGameStatus(null);
    const permutations = getPermutations(
      indexRange.slice(0, numberOfColours),
      codeSize
    );
    setPossibleCodes(permutations);
    setInitialPossibleCodes(permutations);
  }, [codeSize, numberOfColours]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const handleSubmit = useCallback(() => {
    if (currentGuess.includes(-1)) {
      return;
    }
    const result = compareCodes(currentGuess, code);
    if (result[0] === codeSize) {
      setGameStatus("win");
    } else if (guesses.length + 1 >= maxNumberOfGuesses) {
      setGameStatus("lose");
    }

    setPossibleCodes((prevCodes) =>
      prevCodes.filter((prevCode) =>
        compareNumberArrays(result, compareCodes(currentGuess, prevCode))
      )
    );

    setGuessResults((guessResults) => {
      const newGuessResults = [...guessResults];
      newGuessResults.unshift(result);
      return newGuessResults;
    });
    setGuesses((guesses) => {
      const newGuesses = [...guesses];
      newGuesses.unshift(currentGuess);
      return newGuesses;
    });
    setCurrentGuess(Array(codeSize).fill(-1));
  }, [code, codeSize, currentGuess, guesses.length, maxNumberOfGuesses]);

  const provideHint = useCallback(() => {
    if (gameStatus) return;
    // Guess randomly if no guesses have been made or if there are too many possibilities
    if (guesses.length === 0 || possibleCodes.length >= 1000) {
      const hint =
        possibleCodes[Math.floor(Math.random() * possibleCodes.length)];
      setCurrentGuess(hint);
      return;
    }
    // If there is only one possibility left then choose that
    if (possibleCodes.length === 1) {
      setCurrentGuess(possibleCodes[0]);
      return;
    }
    // If the number of possibilities are too large then choose a guess that minimises the expected size of the remaining possibilities
    if (possibleCodes.length >= 100) {
      const expectedSizes = expectedNextSizes(possibleCodes);
      const hint =
        possibleCodes[expectedSizes.indexOf(Math.min(...expectedSizes))];
      setCurrentGuess(hint);
      return;
    }
    // Choose a guess that minimises the maximum number of remaining guesses
    const [, hint] = requiredTurns(possibleCodes, guesses.length);
    setCurrentGuess(hint);
  }, [gameStatus, guesses.length, possibleCodes]);

  return (
    <div className="mx-auto flex max-w-lg flex-col rounded border border-(--site-border) bg-(--site-surface) p-4">
      <div
        className="grid justify-items-center gap-2 rounded bg-(--site-surface-alt) p-3 md:gap-3"
        style={{
          gridTemplateColumns: `repeat(${numberOfColours}, minmax(0, 1fr))`,
        }}
      >
        {colourOptions.slice(0, numberOfColours).map((colour, index) =>
          currentGuess.includes(index) ? (
            <EmptyPeg key={index} sizeClass="w-full max-w-11" />
          ) : (
            <MastermindPeg
              key={index}
              colour={colour}
              sizeClass="w-full max-w-11"
              onClick={() => handleOptionClick(index)}
            />
          )
        )}
      </div>

      <div className="mt-4 grid w-full grid-cols-[3rem_1fr] gap-4 border-t border-(--site-border) pt-4">
        <div className="col-span-2 text-center text-2xl font-semibold">
          {gameStatus
            ? gameStatus === "win"
              ? `You won with ${guesses.length} guesses!`
              : "Too many guesses... Here is the correct code."
            : `Guess ${guesses.length + 1}/${maxNumberOfGuesses}`}
        </div>
        <Button
          type="button"
          onClick={gameStatus ? resetGame : handleSubmit}
          aria-label={gameStatus ? "Reset game" : "Submit guess"}
          icon={gameStatus ? "pi pi-refresh" : "pi pi-check"}
          className="m-auto h-10 w-10"
          text
        />
        <div
          className="grid w-full justify-items-center gap-2 md:gap-3"
          style={{ gridTemplateColumns: `repeat(${codeSize}, minmax(0, 1fr))` }}
        >
          {(gameStatus ? code : currentGuess).map((value, index) => {
            if (!gameStatus && value === -1) {
              return <EmptyPeg key={`currentguess-${index}`} />;
            }
            return (
              <MastermindPeg
                key={`${gameStatus ? "code" : "currentguess"}-${index}`}
                colour={colourOptions[value]}
                onClick={!gameStatus ? () => handleGuessClick(index) : undefined}
              />
            );
          })}
        </div>

        <div className="col-span-2 border-t border-(--site-border) pt-4">
          <div className="mx-auto mb-3 flex w-fit items-center gap-2 text-sm text-(--site-text-muted)">
            <span className="font-semibold">History</span>
            <span>(red-white)</span>
          </div>
          <div className="grid grid-cols-[3rem_1fr] gap-x-4 gap-y-2">
            {guesses.map((guess, row) => (
              <React.Fragment key={`guessRow-${row}`}>
                <div className="flex items-center justify-center text-sm font-semibold">
                  {`${guessResults[row][0]} - ${guessResults[row][1]}`}
                </div>
                <div
                  className="grid w-full justify-items-center gap-2 md:gap-3"
                  style={{
                    gridTemplateColumns: `repeat(${guess.length}, minmax(0, 1fr))`,
                  }}
                >
                  {guess.map((value, col) => (
                    <MastermindPeg
                      key={`col-${row}-${col}`}
                      colour={colourOptions[value]}
                    />
                  ))}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-(--site-border) pt-4">
        <div className="mb-4 flex items-center justify-center gap-3">
          <Button
            type="button"
            onClick={resetGame}
            aria-label="Reset game"
            icon="pi pi-refresh"
            className="h-10 w-10"
            text
          />
          <Button
            type="button"
            onClick={provideHint}
            aria-label="Hint"
            icon="pi pi-question"
            className="h-10 w-10"
            text
          />
        </div>

        <div className="mx-auto grid w-full max-w-xs gap-2">
          <label className="grid grid-cols-[1fr_5rem] items-center gap-3 text-sm">
            <span>Guesses:</span>
            <InputNumber
              inputClassName="w-full text-center"
              className="w-20"
              min={6}
              max={12}
              value={maxNumberOfGuesses}
              onValueChange={(e) => {
                if (e.value !== null) setMaxNumberOfGuesses(Number(e.value));
              }}
              useGrouping={false}
            />
          </label>
          <label className="grid grid-cols-[1fr_5rem] items-center gap-3 text-sm">
            <span>Code size:</span>
            <InputNumber
              inputClassName="w-full text-center"
              className="w-20"
              min={3}
              max={numberOfColours}
              value={codeSize}
              onValueChange={(e) => {
                if (e.value !== null) setCodeSize(Number(e.value));
              }}
              useGrouping={false}
            />
          </label>
          <label className="grid grid-cols-[1fr_5rem] items-center gap-3 text-sm">
            <span>Colours:</span>
            <InputNumber
              inputClassName="w-full text-center"
              className="w-20"
              min={codeSize}
              max={maxNumberOfColours}
              value={numberOfColours}
              onValueChange={(e) => {
                if (e.value !== null) setNumberOfColours(Number(e.value));
              }}
              useGrouping={false}
            />
          </label>
          <p className="mt-1 text-center text-xl font-semibold">{`Remaining options: ${possibleCodes.length}`}</p>
        </div>
      </div>
    </div>
  );
};

export default GameMastermind;
