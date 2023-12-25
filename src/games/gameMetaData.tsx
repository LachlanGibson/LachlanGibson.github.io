import GameTicTacToe from "./tictactoe/GameTicTacToe";

type Game = {
  title: string;
  author: string;
  timeElement: JSX.Element;
  imageElement: JSX.Element;
  lastModifiedElement?: JSX.Element;
  gameElement: JSX.Element;
};

const gameMetaData: { [key: string]: Game } = {
  "tic-tac-toe": {
    title: "Tic Tac Toe",
    author: "Lachlan Gibson",
    timeElement: <time dateTime="2023-12-25">25 December 2023</time>,
    imageElement: (
      <img src="/images/games/tic-tac-toe.webp" alt="Tic Tac Toe" />
    ),
    gameElement: <GameTicTacToe />,
  },
};

export default gameMetaData;
