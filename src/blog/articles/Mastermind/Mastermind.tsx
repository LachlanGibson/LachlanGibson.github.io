import React from "react";
import GameMastermind from "./GameMastermind";
import { BlockMath, InlineMath } from "react-katex";

const Mastermind: React.FC = () => {
  return (
    <>
      <p>This is a work in progress.</p>
      <GameMastermind />
      <p>NOTES</p>
      <p>
        If the code size is <InlineMath math="k" />, then the set of possible
        keys is
      </p>
      <BlockMath
        math={
          "\\mathcal{K}=\\{(k_r,k_w)\\in\\Z_{\\geqslant 0}^2 ~|~ k_r + k_w \\leqslant K\\}"
        }
      />
      <p>The total number of unique keys is then</p>
      <BlockMath math={"|\\mathcal{K}| = \\frac{(K+1)(K+2)}{2}"} />
      <p>
        For any given guess from the set of valid guesses,{" "}
        <InlineMath math={"\\mathcal{G}"} />, we can partition the set of
        possible codes,{" "}
        <InlineMath math={"\\mathcal{P}\\subseteq\\mathcal{G}"} />, into upto{" "}
        <InlineMath math={"|\\mathcal{K}|"} /> nonempty mutually disjoint
        subsets,{" "}
        <InlineMath
          math={"\\mathcal{T}_k(\\mathcal{P},g)\\subseteq\\mathcal{P}"}
        />
        , where <InlineMath math={"k\\in\\mathcal{K}"} />
        . This gives us the framework to consider some myopic strategies by
        using greedy algorithms, which optimise the current turn without
        considering future turns.
        <br />
        <br />
        The first greedy algorthm would be to choose the guess that minimizes
        the maximum number of possible codes after the result is known, thereby
        mitigating the worst case scenario of the next turn.
      </p>
      <BlockMath
        math={
          "\\argmin_{g\\in\\mathcal{G}}\\max_{k\\in\\mathcal{K}}|\\mathcal{T}(\\mathcal{P},g,k)|"
        }
      />
      <p>
        Another greedy algorithm would be to choose the guess that minimises the
        expected number of possible codes after the key is known. This could
        result in a better average performance over multiple games. If all codes
        are equally likely then the probability of each key is the size of the
        corresponding subset divided by the total number of possible codes.
      </p>
      <BlockMath
        math={
          "\\argmin_{g\\in\\mathcal{G}}\\frac{1}{|\\mathcal{P}|}\\sum_{k\\in\\mathcal{K}}|\\mathcal{T}(\\mathcal{P},g,k)|^2"
        }
      />
      <p>
        In practice the factor of <InlineMath math={"|\\mathcal{P}|"} /> can be
        omitted as it is constant for all guesses.
      </p>
    </>
  );
};

export default Mastermind;
