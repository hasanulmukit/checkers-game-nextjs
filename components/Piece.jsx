"use client";

import React from "react";
import { useDrag } from "react-dnd";
import { useGame } from "./GameContext";

const Piece = ({ piece }) => {
  const { forcedPieceId } = useGame();
  const [{ isDragging }, drag] = useDrag({
    type: "PIECE",
    item: { id: piece.id, row: piece.row, col: piece.col },
    canDrag: () => {
      if (forcedPieceId && forcedPieceId !== piece.id) {
        return false;
      }
      return true;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const baseColor = piece.player === "red" ? "bg-red-500" : "bg-black";
  const kingBadge = piece.type === "king" ? "border-4 border-yellow-400" : "";

  return (
    <div
      ref={drag}
      className="w-full h-full flex items-center justify-center cursor-grab"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div
        className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${baseColor} ${kingBadge} shadow-lg transition-transform transform hover:scale-110 flex items-center justify-center`}
      >
        {piece.type === "king" && (
          <span className="text-white text-lg font-bold">K</span>
        )}
      </div>
    </div>
  );
};

export default Piece;
