import GameConnectFour from "./connectfour/GameConnectFour";
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
  "connect-four": {
    title: "Connect Four",
    author: "Lachlan Gibson",
    timeElement: <time dateTime="2024-01-09">9 January 2024</time>,
    imageElement: (
      <img src="/images/games/connect-four.webp" alt="Connect Four" />
    ),
    gameElement: <GameConnectFour />,
  },
  "tic-tac-toe": {
    title: "Tic Tac Toe",
    author: "Lachlan Gibson",
    timeElement: <time dateTime="2024-01-09">9 January 2024</time>,
    imageElement: (
      <img src="/images/games/tic-tac-toe.webp" alt="Tic Tac Toe" />
    ),
    gameElement: <GameTicTacToe />,
  },
};

export default gameMetaData;
