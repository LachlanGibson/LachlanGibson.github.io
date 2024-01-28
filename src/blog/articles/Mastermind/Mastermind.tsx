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

const MastermindPeg: React.FC<{ colour: string }> = ({ colour }) => {
  if (colour === "black") {
    return <div className="rounded-full aspect-square bg-black"></div>;
  }

  const lightColour = transformHexColour(colour, 40);
  const darkColour = transformHexColour(colour, -40);

  const customStyle = {
    background: `radial-gradient(circle at 30% 30%, ${lightColour}, ${colour}, ${darkColour})`,
    boxShadow: "0.4rem 0.4rem 0.5rem rgba(0, 0, 0, 0.4)",
  };

  return <div className="rounded-full aspect-square" style={customStyle}></div>;
};

const Mastermind: React.FC = () => {
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
    <div className="bg-slate-500 max-w-md mx-auto flex flex-col justify-center">
      <div className="grid grid-flow-col gap-4 p-4">
        {colourOptions.reduce((acc, colour, index) => {
          acc.push(<MastermindPeg key={index} colour={colour}></MastermindPeg>);
          return acc;
        }, [] as JSX.Element[])}
      </div>
      <div className="w-full grid grid-cols-1 gap-4 p-4">
        <div className="inputRow w-full grid grid-flow-col gap-4 border-b pb-4">
          {code.map((_, index) => (
            <MastermindPeg key={index} colour={"black"}></MastermindPeg>
          ))}
        </div>
        {guesses?.map((guess, row) => (
          <div key={`guess-${row}`} className="w-full grid grid-flow-col gap-4">
            {guess.map((value, col) => (
              <MastermindPeg
                key={col}
                colour={colourOptions[value]}
              ></MastermindPeg>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mastermind;
