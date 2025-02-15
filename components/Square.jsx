"use client";

import React from "react";
import { useDrop } from "react-dnd";
import { useGame } from "./GameContext";
import Piece from "./Piece";

const Square = ({ row, col }) => {
  const { pieces, movePiece, lastMove } = useGame();
  const piece = pieces.find((p) => p.row === row && p.col === col);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "PIECE",
    drop: (item) => {
      movePiece(item.id, row, col);
    },
    canDrop: () => (row + col) % 2 === 1,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isDark = (row + col) % 2 === 1;
  const bgColor = isDark ? "bg-gray-700" : "bg-gray-300";
  let highlight = "";
  if (isOver && canDrop) {
    highlight = "ring-4 ring-green-300";
  } else if (isOver && !canDrop) {
    highlight = "ring-4 ring-red-300";
  }
  // Highlight if part of last move
  if (
    lastMove &&
    ((lastMove.from.row === row && lastMove.from.col === col) ||
      (lastMove.to.row === row && lastMove.to.col === col))
  ) {
    highlight = "ring-4 ring-yellow-400";
  }

  return (
    <div
      ref={drop}
      className={`${bgColor} relative w-full h-full ${highlight} transition-all`}
    >
      {piece && <Piece piece={piece} />}
    </div>
  );
};

export default Square;
