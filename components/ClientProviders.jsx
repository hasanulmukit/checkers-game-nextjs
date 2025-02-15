"use client";

import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GameProvider } from "./GameContext";

export default function ClientProviders({ children }) {
  return (
    <GameProvider>
      <DndProvider backend={HTML5Backend}>
        {children}
      </DndProvider>
    </GameProvider>
  );
}
