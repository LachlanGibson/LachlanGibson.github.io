import React from "react";
import { BlockMath, InlineMath } from "react-katex";
import TreeDiagram from "./TreeDiagram";
import PythonCodeDisplay from "../ArticleGoogleFoobarChallenge/PythonCodeDisplay";
import GameTicTacToe from "./GameTicTacToe";

const TicTacToe = () => {
  return (
    <>
      <GameTicTacToe />
      <div className="overflow-x-auto">
        <p>
          <a
            href="https://en.wikipedia.org/wiki/Tic-tac-toe"
            target="_blank"
            rel="noreferrer noopener"
          >
            Tic-tac-toe
          </a>
          , also known as noughts and crosses, is a simple two-player game
          played on a 3x3 grid. Each player alternates marking a space in the
          grid with their symbol: the first player uses 'X' and the second 'O'.
          The goal is to be the first to get three of their symbols along a row,
          column, or diagonal. The game is a draw if all nine squares are filled
          and no player has achieved this goal. Under these rules, tic tac toe
          is a{" "}
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
          It is possible to calculate an upper bound on the total number of
          achievable unique board states as <InlineMath math={"3^9=19683"} />,
          since there are nine squares, each with three possible states: empty,
          X, or O. However, most of these states are unreachable, such as those
          where two players have three in a row simultaneously, or where player
          O has taken more turns than player X. Therefore, the actual number of
          unique accessible board states is only <InlineMath math="5478" />.
          This makes it feasible for the computer to use a brute force approach
          to explore all possibilities when calculating the optimal move for
          each board state. A typical approach to solving a two-player zero-sum
          game is finding the{" "}
          <a
            href="https://en.wikipedia.org/wiki/Nash_equilibrium"
            target="_blank"
            rel="noreferrer noopener"
          >
            Nash equilibrium
          </a>{" "}
          using the{" "}
          <a
            href="https://en.wikipedia.org/wiki/Minimax"
            target="_blank"
            rel="noreferrer noopener"
          >
            minimax
          </a>{" "}
          algorithm, which identifies the optimal move for each player, assuming
          the opponent also plays optimally. This involves recursively exploring
          all possible moves and their outcomes, with player X aiming to
          maximise the score and player O aiming to minimise it. Scores are
          assigned to each board state: a win for X as <InlineMath math="+1" />,
          a win for O as <InlineMath math="-1" />, and a draw as{" "}
          <InlineMath math="0" />.
          <br />
          <br />
          In tic-tac-toe, both players choosing moves this way always results in
          a draw. However, optimal play by one player can depend on the other
          player's strategy, and many human players do not choose moves
          optimally. To make the game more interesting, I implemented an AI
          using a{" "}
          <em>softmax-based probabilistic variant of the minimax algorithm</em>,
          where the AI considers actions as if they are taken randomly, with
          probabilities based on the expected scores. More specifically, the
          log-probability of a move is proportional to its expected score,
          meaning the probability of a move is calculated using the{" "}
          <a
            href="https://en.wikipedia.org/wiki/Softmax_function"
            target="_blank"
            rel="noreferrer noopener"
          >
            softmax function
          </a>{" "}
          with a temperature parameter. This means that moves with higher
          expected scores are more likely to be chosen, but not every time. The
          temperature parameter controls the randomness of the AI's play or its
          expectation of its opponent's play. Lower temperatures mean the AI
          follows the minimax algorithm more closely, while higher temperatures
          makes all moves more equally likely.
          <br />
          <br />
          To compute the expected resulting score of a move, the AI needs to
          predict how its opponent will play. Therefore, the AI actually
          utilises two temperature parameters, one for choosing its own moves,
          and the other for how it models the other player's strategy. Let's get
          into the details of the mathematics of the algorithm. For a vector{" "}
          <InlineMath math={"\\mathbf{x}"} /> with components{" "}
          <InlineMath math={"x_i"} /> and a temperature{" "}
          <InlineMath math={"T"} />, the softmax function is
        </p>
        <BlockMath
          math={`\\text{Softmax}(x_i, T) = \\frac{e^{x_i / T}}{\\sum_j e^{x_j / T}}.`}
        />
        <p>
          This function normalises the vector so that all probabilitis are
          strictly positive and sum to 1 (try prove it yourself by adding the
          components). The probability, <InlineMath math="P" />, that player,{" "}
          <InlineMath math={"\\mathcal{P}"} />, chooses to move to the board
          state, <InlineMath math="C" /> from the board state{" "}
          <InlineMath math="B" /> is
        </p>
        <BlockMath
          math={
            "\\forall C\\in\\mathcal{C}(B),~ P(C|\\mathcal{P})=\\text{Softmax}(\\mathcal{P}S(C,-\\mathcal{P}), T_\\mathcal{P}),"
          }
        />
        <p>
          where <InlineMath math={"\\mathcal{C}(B)"} /> is the set of all board
          states that can be reached in one move from <InlineMath math="B" />,{" "}
          <InlineMath math={"\\mathcal{P}=+1"} /> when it is player X's turn,
          and <InlineMath math={"\\mathcal{P}=-1"} /> when it is player O's
          turn. <InlineMath math="S" /> is the expected score given a board
          state and whos turn it is not. If the game is over then the score is{" "}
          <InlineMath math="+1" /> if X wins, <InlineMath math="-1" /> if O
          wins, and <InlineMath math="0" /> if it is a draw. Otherwise, we can
          calculate the expected score as
        </p>
        <BlockMath
          math={
            "S(B,\\mathcal{P})=\\sum_{C\\in\\mathcal{C}(B)}P(C|\\mathcal{P})S(C,-\\mathcal{P})"
          }
        />
        <p>
          These two expressions provide a recursive relationship for calculating
          the expected score of any board state. The AI uses this recursive
          function to compute the expected scores of all its available next
          moves. It then uses the softmax function to convert these scores into
          probabilities and randomly chooses a move based on those
          probabilities. The figure below illustrates an exmaple where player X
          is playing less randomly than player O with{" "}
          <InlineMath math={"T_1=0.2"} /> and <InlineMath math={"T_{-1}=1"} />.
        </p>
        <TreeDiagram />
        <figcaption className="mb-4">
          The top board is the initial board state and it is X's turn. The
          expected score of each board state is shown above each baord. The
          probability of each move is shown as a percentage above each node in
          the tree. X, with a temperature of 0.2, is more likely to choose
          better moves than O which chooses with a temperature of 1.
        </figcaption>
        <p>
          In this example, if X is controlled by the AI, then it has a 97.46%
          chance of picking the winning move immediately. It also has a 0.02%
          chance of choosing the bottom right corner which would allow O to win
          next turn. However, O has a high temperature of 1, so it still has a
          26.89% chance of not choosing that winning move.
        </p>
        <div className="grid gap-4 justify-center grid-cols-1 sm2:grid-cols-2 max-w-2xl mx-auto my-4">
          <img
            className="w-full"
            src="/blog/files/tic-tac-toe/p_estimates_T1.svg"
            alt=""
          />
          <img
            className="w-full"
            src="/blog/files/tic-tac-toe/p_estimates_T0.1.svg"
            alt=""
          />
        </div>
        <figcaption className="mb-4">
          Estimated win probabilities of each player depending on{" "}
          <InlineMath math="T_O" /> when <InlineMath math="T_X=1" /> (left) and{" "}
          <InlineMath math="T_X=0.1" /> (right). Probabilities were estimated by
          simulating 1000 games for each combination of temperatures.
        </figcaption>
        <div className="grid gap-4 justify-center grid-cols-1 sm2:grid-cols-2 max-w-2xl mx-auto my-4">
          <img
            className="w-full"
            src="/blog/files/tic-tac-toe/scores_T1.svg"
            alt=""
          />
          <img
            className="w-full"
            src="/blog/files/tic-tac-toe/scores_T0.1.svg"
            alt=""
          />
        </div>
        <figcaption className="mb-4">
          Expected final scores when X starts on a corner, the centre or an
          edge, depending on <InlineMath math="T_O" /> when{" "}
          <InlineMath math="T_X=1" /> (left) and <InlineMath math="T_X=0.1" />{" "}
          (right). If player X plays with a high temperature then their best
          first move is always the centre, but if they play with a low
          temperature then their best first move is usually a corner.
        </figcaption>
        <p>
          Below is some Python code showing how the scores can be computed using
          recursive functions.
        </p>
        <PythonCodeDisplay
          codeFile="/blog/files/tic-tac-toe/example.py"
          startOpen={true}
        />
      </div>
    </>
  );
};

export default TicTacToe;
