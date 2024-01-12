import React, { useEffect, useRef, useState } from "react";
import { Tree } from "react-d3-tree";

const renderRectSvgNode = ({ nodeDatum }: { nodeDatum: any }) => {
  const gridTextX = ["2.7", "19.2", "36"];
  const gridTextY = ["14", "30.7", "47.4"];
  return (
    <g>
      <rect
        width="60"
        height="80"
        x="-30"
        y="-50"
        fill="white"
        rx="10"
        strokeWidth="2"
      />
      <text
        fill="black"
        strokeWidth="1"
        y="-30"
        textAnchor="middle"
        stroke="transparent"
      >
        {nodeDatum.score}
      </text>
      <text
        fill="#c7405e"
        strokeWidth="0.5"
        y="-55"
        textAnchor="middle"
        stroke="transparent"
      >
        {nodeDatum.probability}
      </text>
      <svg x="-25" y="-25" fill="black" strokeWidth="0.5">
        <line x1="16.6" y1="0" x2="16.6" y2="50" stroke="black" />
        <line x1="33.3" y1="0" x2="33.3" y2="50" stroke="black" />
        <line x1="0" y1="16.7" x2="50" y2="16.7" stroke="black" />
        <line x1="0" y1="33.3" x2="50" y2="33.3" stroke="black" />
        {nodeDatum.board.map((row: string[], i: number) =>
          row.map((cell: string, j: number) => {
            return (
              <text
                x={gridTextX[j]}
                y={gridTextY[i]}
                key={`${j}-${i}`}
                stroke="transparent"
              >
                {cell}
              </text>
            );
          })
        )}
      </svg>
    </g>
  );
};

const TreeDiagram: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const { width } = containerRef.current.getBoundingClientRect();
      setTranslate({ x: width / 2, y: 65 });
    }
  }, []);

  const treeData = [
    {
      name: "Initial State",
      score: 0.9813,
      board: [
        ["X", "X", ""],
        ["O", "O", ""],
        ["X", "O", ""],
      ],
      children: [
        {
          name: "Move 1",
          score: 0.2689,
          probability: "2.52%",
          board: [
            ["X", "X", ""],
            ["O", "O", "X"],
            ["X", "O", ""],
          ],
          children: [
            {
              name: "Move 1.1",
              probability: "73.11%",
              score: 0,
              board: [
                ["X", "X", "O"],
                ["O", "O", "X"],
                ["X", "O", ""],
              ],
              children: [
                {
                  name: "Move 1.1.1",
                  probability: "100%",
                  score: 0,
                  board: [
                    ["X", "X", "O"],
                    ["O", "O", "X"],
                    ["X", "O", "X"],
                  ],
                },
              ],
            },
            {
              name: "Move 1.2",
              probability: "26.89%",
              score: 1,
              board: [
                ["X", "X", ""],
                ["O", "O", "X"],
                ["X", "O", "O"],
              ],
              children: [
                {
                  name: "Move 1.2.1",
                  probability: "100%",
                  score: 1,
                  board: [
                    ["X", "X", "X"],
                    ["O", "O", "X"],
                    ["X", "O", "O"],
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Move 2",
          probability: "97.46%",
          score: 1,
          board: [
            ["X", "X", "X"],
            ["O", "O", ""],
            ["X", "O", ""],
          ],
        },
        {
          name: "Move 3",
          score: -0.7311,
          probability: "0.02%",
          board: [
            ["X", "X", ""],
            ["O", "O", ""],
            ["X", "O", "X"],
          ],
          children: [
            {
              name: "Move 3.1",
              probability: "26.89%",
              score: 0,
              board: [
                ["X", "X", "O"],
                ["O", "O", ""],
                ["X", "O", "X"],
              ],
              children: [
                {
                  name: "Move 3.1.1",
                  probability: "100%",
                  score: 0,
                  board: [
                    ["X", "X", "O"],
                    ["O", "O", "X"],
                    ["X", "O", "X"],
                  ],
                },
              ],
            },
            {
              name: "Move 3.2",
              probability: "73.11%",
              score: -1,
              board: [
                ["X", "X", ""],
                ["O", "O", "O"],
                ["X", "O", "X"],
              ],
            },
          ],
        },
      ],
    },
  ];

  const straightPathFunc = (
    linkDatum: { source: any; target: any },
    orientation: string
  ) => {
    const { source, target } = linkDatum;
    return orientation === "horizontal"
      ? `M${source.y},${source.x}L${target.y},${target.x}`
      : `M${source.x},${source.y}L${target.x},${target.y}`;
  };

  return (
    <div
      ref={containerRef}
      className="overflow-auto mx-auto my-4 max-w-fit bg-slate-600 rounded-lg"
      style={{ height: "470px", cursor: "default" }}
    >
      <Tree
        data={treeData}
        renderCustomNodeElement={renderRectSvgNode}
        orientation="vertical"
        zoomable={false}
        separation={{ siblings: 0.5, nonSiblings: 0.5 }}
        depthFactor={120}
        translate={translate}
        pathFunc={straightPathFunc}
      />
    </div>
  );
};

export default TreeDiagram;
