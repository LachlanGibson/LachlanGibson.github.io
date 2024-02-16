import React, { useCallback, useEffect } from "react";
import {
  compareNumberArrays,
  countUniqueStrings,
  getPermutations,
  range,
  shuffleArray,
  transformHexColour,
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

type Code = number[];

const compareCodesMemo: Record<string, [number, number]> = {};
const compareCodes = (guess: Code, code: Code): [number, number] => {
  const codeString = guess.join("") + code.join("");
  if (compareCodesMemo[codeString]) {
    return compareCodesMemo[codeString];
  }
  const result = code.reduce<[number, number]>(
    (acc, codeValue, index) => {
      if (codeValue === guess[index]) {
        acc[0]++;
      } else if (guess.includes(codeValue)) {
        acc[1]++;
      }
      return acc;
    },
    [0, 0]
  );
  compareCodesMemo[codeString] = result;
  return result;
};

const expectedNextSizes = (
  possibilities: Code[],
  choices = possibilities
): number[] => {
  return choices.map((guess) => {
    const results = possibilities.map((code) =>
      compareCodes(guess, code).join("")
    );
    const counts = countUniqueStrings(results);
    return (
      counts.reduce((acc, count) => acc + count[1] ** 2, 0) /
      possibilities.length
    );
  });
};

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
  for (let guess of possibilities) {
    let worstTurns = -Infinity;
    const results = possibilities.map((code) =>
      compareCodes(guess, code).join("")
    );
    const counts = countUniqueStrings(results, "ascending");
    alpha = alphaInput;
    for (let [result] of counts) {
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
}> = ({ colour, onClick }) => {
  const lightColour = transformHexColour(colour, 40);
  const darkColour = transformHexColour(colour, -40);

  const customStyle = {
    background: `radial-gradient(circle at 30% 30%, ${lightColour}, ${colour}, ${darkColour})`,
    boxShadow: "0.4rem 0.4rem 0.5rem rgba(0, 0, 0, 0.4)",
  };

  return (
    <div
      className="rounded-full aspect-square"
      style={customStyle}
      onClick={onClick}
    ></div>
  );
};

const EmptyPeg: React.FC<{ onClick?: React.MouseEventHandler }> = ({
  onClick,
}) => {
  return (
    <div
      className="rounded-full aspect-square bg-black"
      style={{ margin: "25%" }}
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
  const [initialPossibleCodes, setinitialPossibleCodes] = React.useState<
    Code[]
  >([]);

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
    setinitialPossibleCodes(permutations);
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
    // If the number of possibilites are too large then choose a guess that minimises the expected size of the remaining possibilities
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
    <>
      <div className="bg-slate-600 rounded max-w-sm mx-auto flex flex-col justify-center">
        <div className="grid grid-flow-col gap-4 mt-4 p-3 rounded bg-slate-500 mx-4">
          {colourOptions.slice(0, numberOfColours).map((colour, index) => {
            return currentGuess.includes(index) ? (
              <EmptyPeg key={index} />
            ) : (
              <MastermindPeg
                key={index}
                colour={colour}
                onClick={() => handleOptionClick(index)}
              />
            );
          })}
        </div>
        <div className="w-full grid grid-cols-[3rem,1fr] gap-4 p-4">
          <div className="border-t pt-3 col-span-2 text-center">
            {gameStatus
              ? gameStatus === "win"
                ? `You won with ${guesses.length} guesses!`
                : "Too many guesses... Here is the correct code."
              : `Guess ${guesses.length + 1}/${maxNumberOfGuesses}`}
          </div>
          {gameStatus && (
            <button
              type="button"
              onClick={resetGame}
              aria-label="Reset game"
              className="text-white font-medium rounded-lg w-10 h-10 m-auto text-2xl border border-slate-700 bg-gray-500 hover:bg-gray-700 active:bg-gray-600"
            >
              <svg
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="h-6 m-auto"
              >
                <path d="M936.571429 603.428571q0 2.857143-0.571429 4-36.571429 153.142857-153.142857 248.285715T509.714286 950.857143q-83.428571 0-161.428572-31.428572T209.142857 829.714286l-73.714286 73.714285q-10.857143 10.857143-25.714285 10.857143t-25.714286-10.857143-10.857143-25.714285v-256q0-14.857143 10.857143-25.714286t25.714286-10.857143h256q14.857143 0 25.714285 10.857143t10.857143 25.714286-10.857143 25.714285l-78.285714 78.285715q40.571429 37.714286 92 58.285714t106.857143 20.571429q76.571429 0 142.857143-37.142858t106.285714-102.285714q6.285714-9.714286 30.285714-66.857143 4.571429-13.142857 17.142858-13.142857h109.714285q7.428571 0 12.857143 5.428572t5.428572 12.857142z m14.285714-457.142857v256q0 14.857143-10.857143 25.714286t-25.714286 10.857143h-256q-14.857143 0-25.714285-10.857143t-10.857143-25.714286 10.857143-25.714285l78.857142-78.857143Q626.857143 219.428571 512 219.428571q-76.571429 0-142.857143 37.142858T262.857143 358.857143q-6.285714 9.714286-30.285714 66.857143-4.571429 13.142857-17.142858 13.142857H101.714286q-7.428571 0-12.857143-5.428572T83.428571 420.571429v-4q37.142857-153.142857 154.285715-248.285715T512 73.142857q83.428571 0 162.285714 31.714286T814.285714 194.285714l74.285715-73.714285q10.857143-10.857143 25.714285-10.857143t25.714286 10.857143 10.857143 25.714285z" />
              </svg>
            </button>
          )}
          {!gameStatus && (
            <button
              type="button"
              onClick={handleSubmit}
              aria-label="Submit guess"
              className="text-white font-medium rounded-lg w-10 h-10 m-auto text-2xl border border-slate-700 bg-gray-500 hover:bg-gray-700 active:bg-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                fill="currentColor"
                className="h-6 m-auto"
              >
                <path d="M143 256.3L7 120.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0L313 86.3c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.4 9.5-24.6 9.5-34 .1zm34 192l136-136c9.4-9.4 9.4-24.6 0-33.9l-22.6-22.6c-9.4-9.4-24.6-9.4-33.9 0L160 352.1l-96.4-96.4c-9.4-9.4-24.6-9.4-33.9 0L7 278.3c-9.4 9.4-9.4 24.6 0 33.9l136 136c9.4 9.5 24.6 9.5 34 .1z" />
              </svg>
            </button>
          )}
          {!gameStatus && (
            <div className="inputRow w-full grid grid-flow-col gap-4">
              {currentGuess.map((guess, index) => {
                if (guess === -1) {
                  return <EmptyPeg key={`currentguess-${index}`} />;
                }
                return (
                  <MastermindPeg
                    key={`currentguess-${index}`}
                    colour={colourOptions[guess]}
                    onClick={() => handleGuessClick(index)}
                  ></MastermindPeg>
                );
              })}
            </div>
          )}
          {gameStatus && (
            <div className="w-full grid grid-flow-col gap-4">
              {code.map((value, index) => {
                return (
                  <MastermindPeg
                    key={`code-${index}`}
                    colour={colourOptions[value]}
                    onClick={() => handleGuessClick(index)}
                  ></MastermindPeg>
                );
              })}
            </div>
          )}
          <div className="border-b h-3 col-span-2"></div>
          {guesses.length > 0 && (
            <div className="text-center flex justify-center items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                fill="currentColor"
                className="h-4"
              >
                <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
              </svg>
              {` \u2013 `}
              <svg
                fill="currentColor"
                className="h-4"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 92 92"
              >
                <path d="M92,55.5c0,1.1-0.4,2.1-1.2,2.8L72.2,76.9c-0.8,0.8-1.8,1.1-2.8,1.1c-1,0-2.1-0.5-2.8-1.2 c-1.6-1.6-1.6-4.2,0-5.8l11.7-12H39.2c-2.2,0-4-1.8-4-4s1.8-4,4-4h39.1L66.6,39.5c-1.6-1.6-1.6-3.9,0-5.4c1.6-1.6,4.1-1.6,5.7,0 l18.6,18.6C91.6,53.4,92,54.4,92,55.5z M13.7,41h39.1c2.2,0,4-1.8,4-4s-1.8-4-4-4H13.7l11.7-12c1.6-1.6,1.6-4.2,0-5.8 s-4.1-1.6-5.7-0.1L1.2,33.7C0.4,34.4,0,35.4,0,36.5s0.4,2.1,1.2,2.8l18.6,18.6c0.8,0.8,1.8,1.2,2.8,1.2c1,0,2.1-0.4,2.8-1.2 c1.6-1.6,1.6-3.9,0-5.4L13.7,41z"></path>
              </svg>
            </div>
          )}
          {guesses.length > 0 && <div className="text-center">Guesses</div>}
          {guesses?.map((guess, row) => (
            <React.Fragment key={`guessRow-${row}`}>
              <div className="flex justify-center items-center">
                <div>{`${guessResults[row][0]} \u2013 ${guessResults[row][1]}`}</div>
              </div>
              <div className="w-full grid grid-flow-col gap-4">
                {guess.map((value, col) => (
                  <MastermindPeg
                    key={`col-${col}`}
                    colour={colourOptions[value]}
                  />
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
        <button
          type="button"
          onClick={resetGame}
          aria-label="Reset game"
          className="text-white font-medium rounded-lg w-10 h-10 m-auto mb-2 text-2xl border border-slate-700 bg-gray-500 hover:bg-gray-700 active:bg-gray-600"
        >
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="h-6 m-auto"
          >
            <path d="M936.571429 603.428571q0 2.857143-0.571429 4-36.571429 153.142857-153.142857 248.285715T509.714286 950.857143q-83.428571 0-161.428572-31.428572T209.142857 829.714286l-73.714286 73.714285q-10.857143 10.857143-25.714285 10.857143t-25.714286-10.857143-10.857143-25.714285v-256q0-14.857143 10.857143-25.714286t25.714286-10.857143h256q14.857143 0 25.714285 10.857143t10.857143 25.714286-10.857143 25.714285l-78.285714 78.285715q40.571429 37.714286 92 58.285714t106.857143 20.571429q76.571429 0 142.857143-37.142858t106.285714-102.285714q6.285714-9.714286 30.285714-66.857143 4.571429-13.142857 17.142858-13.142857h109.714285q7.428571 0 12.857143 5.428572t5.428572 12.857142z m14.285714-457.142857v256q0 14.857143-10.857143 25.714286t-25.714286 10.857143h-256q-14.857143 0-25.714285-10.857143t-10.857143-25.714286 10.857143-25.714285l78.857142-78.857143Q626.857143 219.428571 512 219.428571q-76.571429 0-142.857143 37.142858T262.857143 358.857143q-6.285714 9.714286-30.285714 66.857143-4.571429 13.142857-17.142858 13.142857H101.714286q-7.428571 0-12.857143-5.428572T83.428571 420.571429v-4q37.142857-153.142857 154.285715-248.285715T512 73.142857q83.428571 0 162.285714 31.714286T814.285714 194.285714l74.285715-73.714285q10.857143-10.857143 25.714285-10.857143t25.714286 10.857143 10.857143 25.714285z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={provideHint}
          aria-label="Hint"
          className="text-white font-medium rounded-lg w-10 h-10 m-auto mb-2 text-2xl border border-slate-700 bg-gray-500 hover:bg-gray-700 active:bg-gray-600"
        >
          ?
        </button>
        <label>
          <span>Guesses:</span>
          <input
            className="w-10 text-black"
            type="number"
            min="6"
            max="12"
            value={maxNumberOfGuesses}
            onChange={(e) => setMaxNumberOfGuesses(+e.target.value)}
          />
        </label>
        <label>
          <span>Code size:</span>
          <input
            className="w-10 text-black"
            type="number"
            min={3}
            max={numberOfColours}
            value={codeSize}
            onChange={(e) => setCodeSize(+e.target.value)}
          />
        </label>
        <label>
          <span>Colours:</span>
          <input
            className="w-10 text-black"
            type="number"
            min={codeSize}
            max={maxNumberOfColours}
            value={numberOfColours}
            onChange={(e) => setNumberOfColours(+e.target.value)}
          />
        </label>
        <p>{`Remaining options: ${possibleCodes.length}`}</p>
      </div>
    </>
  );
};

export default GameMastermind;
