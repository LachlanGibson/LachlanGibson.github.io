import React, { useCallback, useEffect } from "react";
import { range, shuffleArray } from "../../../utility/utilities";

const colourOptions = [
  "#de473c", //red
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

const Mastermind: React.FC = (props) => {
  const [maxNumberOfGuesses, setMaxNumberOfGuesses] = React.useState(12);
  const [codeSize, setCodeSize] = React.useState(initialCodeSize);
  const [numberOfColours, setNumberOfColours] = React.useState(6);
  const [code, setCode] = React.useState<number[]>(
    shuffleArray(indexRange).slice(0, initialCodeSize)
  );
  const [guesses, setGuesses] = React.useState<number[][]>([
    [5, 1, 2, 3],
    [2, 3, 4, 5],
    [3, 4, 5, 0],
  ]);

  return (
    <div className="bg-slate-500 max-w-md mx-auto">
      <div className="w-full grid grid-cols-1">
        <div className="inputRow w-full grid grid-flow-col">
          {code.map((_, index) => (
            <div
              key={index}
              className="rounded-full aspect-square bg-black m-4"
            ></div>
          ))}
        </div>
        {guesses?.map((guess, row) => (
          <div key={`guess-${row}`} className="w-full grid grid-flow-col">
            {guess.map((value, col) => (
              <div
                key={col}
                className={`rounded-full aspect-square m-4`}
                style={{ backgroundColor: colourOptions[value] }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mastermind;
