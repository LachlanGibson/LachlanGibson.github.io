import React, { useCallback, useEffect } from "react";
import {
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
const minNumberOfColours = 6;
const indexRange = range(0, maxNumberOfColours);
const initialCodeSize = 4;

const compareCodes = (code: number[], guess: number[]): [number, number] => {
  return code.reduce(
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

const Mastermind: React.FC = () => {
  const [maxNumberOfGuesses, setMaxNumberOfGuesses] = React.useState(12);
  const [codeSize, setCodeSize] = React.useState(initialCodeSize);
  const [numberOfColours, setNumberOfColours] = React.useState(6);
  const [code, setCode] = React.useState<number[]>(
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

  const handleOptionClick = useCallback((optionIndex: number) => {
    setCurrentGuess((currentGuess) => {
      const newGuess = [...currentGuess];
      const nextEmptyPegIndex = newGuess.indexOf(-1);
      if (nextEmptyPegIndex !== -1) {
        newGuess[nextEmptyPegIndex] = optionIndex;
        return newGuess;
      }
      return currentGuess;
    });
  }, []);

  const handleGuessClick = useCallback((guessIndex: number) => {
    setCurrentGuess((guess) => {
      const newGuess = [...guess];
      newGuess[guessIndex] = -1;
      return newGuess;
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (currentGuess.includes(-1)) {
      return;
    }
    const result = compareCodes(code, currentGuess);
    if (result[0] === codeSize) {
      setGameStatus("win");
    } else if (guesses.length + 1 >= maxNumberOfGuesses) {
      setGameStatus("lose");
    }

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

  const resetGame = useCallback(() => {
    setCode(
      shuffleArray(indexRange.slice(0, numberOfColours)).slice(0, codeSize)
    );
    setCurrentGuess(Array(codeSize).fill(-1));
    setGuesses([]);
    setGuessResults([]);
    setGameStatus(null);
  }, [codeSize, numberOfColours]);

  return (
    <>
      <p>This is a work in progress.</p>
      <div className="bg-slate-600 rounded max-w-sm mx-auto flex flex-col justify-center">
        <button
          type="button"
          onClick={resetGame}
          className="text-white focus:ring-4 font-medium rounded-lg w-fit mx-auto mt-4 text-sm px-5 py-2.5  bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800"
        >
          Reset
        </button>
        <div className="grid grid-flow-col gap-4 mt-4 p-3 rounded bg-slate-500 mx-4">
          {colourOptions
            .slice(0, numberOfColours)
            .reduce((acc, colour, index) => {
              if (currentGuess.includes(index)) {
                acc.push(<EmptyPeg key={index} />);
              } else {
                acc.push(
                  <MastermindPeg
                    key={index}
                    colour={colour}
                    onClick={() => handleOptionClick(index)}
                  />
                );
              }
              return acc;
            }, [] as JSX.Element[])}
        </div>
        <div className="w-full grid grid-cols-[auto,1fr] gap-4 p-4">
          <div className="border-t pt-3 col-span-2 text-center">
            {gameStatus
              ? gameStatus === "win"
                ? `You won with ${guesses.length} guesses!`
                : "Too many guesses... Here is the correct code."
              : `Guess ${guesses.length + 1}`}
          </div>
          {!gameStatus && (
            <button
              type="button"
              onClick={handleSubmit}
              className="text-white border border-slate-900 font-medium rounded-lg text-sm p-2 h-fit my-auto  bg-gray-500 hover:bg-gray-700 active:bg-gray-600"
            >
              Submit
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
          {gameStatus === "lose" && (
            <div className="w-full grid grid-flow-col gap-4 col-span-2">
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
      </div>
    </>
  );
};

export default Mastermind;
