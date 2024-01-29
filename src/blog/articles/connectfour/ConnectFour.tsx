import React from "react";
import GameConnectFour from "./GameConnectFour";
import { Link } from "react-router-dom";
import PythonCodeDisplay from "../ArticleGoogleFoobarChallenge/PythonCodeDisplay";

const ConnectFour: React.FC = () => {
  return (
    <>
      <GameConnectFour />
      <div>
        <p>
          <a
            href="https://en.wikipedia.org/wiki/Connect_Four"
            target="_blank"
            rel="noopener noreferrer"
          >
            Connect Four
          </a>{" "}
          is a two-player game sold by{" "}
          <a
            href="https://shop.hasbro.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hasbro
          </a>
          , played on a 6x7 grid. Each player alternates dropping colored discs
          (red or yellow) into one of the seven columns. The discs fall to the
          lowest available space within the selected column. The objective is to
          be the first player to align four discs in a row, which can be
          achieved horizontally, vertically, or diagonally. The game reaches a
          draw if all 42 spaces are filled without either player achieving this
          alignment. Given these rules, Connect Four classifies as a{" "}
          <a
            href="https://en.wikipedia.org/wiki/Perfect_information"
            target="_blank"
            rel="noreferrer noopener"
          >
            perfect information
          </a>{" "}
          <a
            href="https://en.wikipedia.org/wiki/Zero-sum_game"
            target="_blank"
            rel="noreferrer noopener"
          >
            zero-sum game
          </a>
          .
          <br />
          <br />
          As a{" "}
          <a
            href="https://en.wikipedia.org/wiki/Solved_game"
            target="_blank"
            rel="noopener noreferrer"
          >
            solved game
          </a>
          , Connect Four allows the first player to always secure a win with
          optimal play. However, identifying the optimal move for each board
          state using a brute-force approach, as I did with my{" "}
          <Link to="/blog/tic-tac-toe/">Tic Tac Toe</Link> AI, is not feasible
          in Connect Four due to the game's complexity. To address this, I
          programmed an AI using the{" "}
          <a
            href="https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning"
            target="_blank"
            rel="noopener noreferrer"
          >
            minimax algorithm with alpha-beta pruning
          </a>{" "}
          for decision-making. However, unlike my approach in Tic Tac Toe, this
          AI does not search the entire{" "}
          <a
            href="https://en.wikipedia.org/wiki/Game_tree"
            target="_blank"
            rel="noopener noreferrer"
          >
            game tree
          </a>
          . Instead, it limits its foresight to a certain number of moves and
          employs a heuristic to estimate the value of non-terminal board states
          at its maximum search depth.
          <br />
          <br />
          The core of the heuristic lies in evaluating the difference in the
          number of potential four-in-a-row alignments for each player. This
          method was chosen based on the intuition that immediate wins and
          losses are identified within the search scope. At the same time, board
          states that preserve more opportunities for future alignments increase
          the likelihood of winning as the game progresses.
          <br />
          <br />
          To introduce an element of unpredictability and to adjust the
          difficulty level, I incorporated random noise into the AI's value
          estimations at each depth. This addition means the AI might
          occasionally select suboptimal moves, particularly when the path to a
          forced win or loss is not immediately evident. Such a strategy ensures
          a balance between challenge and accessibility, making the AI a
          versatile opponent across various skill levels. Below is a Python
          implementation of the algorithm.
        </p>
        <PythonCodeDisplay
          codeFile="/blog/files/connect-four/example.py"
          startOpen={true}
        />
      </div>
    </>
  );
};

export default ConnectFour;
