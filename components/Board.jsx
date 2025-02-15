"use client";

import React from "react";
import Square from "./Square";

const Board = () => {
  const boardSize = 8;
  const squares = [];

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      squares.push(<Square key={`${row}-${col}`} row={row} col={col} />);
    }
  }

  return (
    <div
      className="grid border-4 border-gray-800 rounded-lg overflow-hidden shadow-xl"
      style={{
        gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
        gridTemplateRows: `repeat(${boardSize}, 1fr)`,
        width: "750px",
        height: "750px",
      }}
    >
      {squares}
    </div>
  );
};

export default Board;
