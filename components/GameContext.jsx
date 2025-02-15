"use client";

import React, { createContext, useContext, useState } from "react";

const GameContext = createContext();
const boardSize = 8;

function initializePieces() {
  const pieces = [];
  // Red pieces (rows 0-2)
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < boardSize; col++) {
      if ((row + col) % 2 === 1) {
        pieces.push({
          id: `red-${row}-${col}`,
          player: "red",
          type: "regular",
          row,
          col,
        });
      }
    }
  }
  // Black pieces (rows 5-7)
  for (let row = boardSize - 3; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if ((row + col) % 2 === 1) {
        pieces.push({
          id: `black-${row}-${col}`,
          player: "black",
          type: "regular",
          row,
          col,
        });
      }
    }
  }
  return pieces;
}

export const GameProvider = ({ children }) => {
  const [pieces, setPieces] = useState(initializePieces());
  const [currentTurn, setCurrentTurn] = useState("red");
  const [forcedPieceId, setForcedPieceId] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [moveLog, setMoveLog] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [lastMove, setLastMove] = useState(null);

  // Save current state for undo functionality
  const saveState = () => {
    const state = {
      pieces: JSON.parse(JSON.stringify(pieces)),
      currentTurn,
      forcedPieceId,
      moveLog: [...moveLog],
      lastMove: lastMove ? { ...lastMove } : null,
    };
    setMoveHistory((prev) => [...prev, state]);
  };

  // Returns the piece at the given coordinates (if any)
  const getPieceAt = (row, col) =>
    pieces.find((p) => p.row === row && p.col === col);

  // Check if any capture is available for the current player's pieces.
  const anyCaptureAvailable = () => {
    return pieces.some((p) => p.player === currentTurn && canCapture(p));
  };

  // Check if a given piece can capture an opponent piece.
  const canCapture = (piece) => {
    let directions = [];
    if (piece.type === "regular") {
      const forward = piece.player === "red" ? 1 : -1;
      directions = [[forward, 1], [forward, -1]];
    } else {
      directions = [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ];
    }
    for (let [dRow, dCol] of directions) {
      const enemyRow = piece.row + dRow;
      const enemyCol = piece.col + dCol;
      const landingRow = piece.row + 2 * dRow;
      const landingCol = piece.col + 2 * dCol;
      if (
        landingRow >= 0 &&
        landingRow < boardSize &&
        landingCol >= 0 &&
        landingCol < boardSize &&
        enemyRow >= 0 &&
        enemyRow < boardSize &&
        enemyCol >= 0 &&
        enemyCol < boardSize
      ) {
        const enemyPiece = getPieceAt(enemyRow, enemyCol);
        if (
          enemyPiece &&
          enemyPiece.player !== piece.player &&
          !getPieceAt(landingRow, landingCol)
        ) {
          return true;
        }
      }
    }
    return false;
  };

  // Validate the move for a given piece.
  const validateMove = (piece, newRow, newCol) => {
    if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize) {
      return { valid: false, reason: "Destination off board" };
    }
    if (getPieceAt(newRow, newCol)) {
      return { valid: false, reason: "Square is occupied" };
    }
    const rowDiff = newRow - piece.row;
    const colDiff = newCol - piece.col;

    let directions = [];
    if (piece.type === "regular") {
      const forward = piece.player === "red" ? 1 : -1;
      directions = [[forward, 1], [forward, -1]];
    } else {
      directions = [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ];
    }

    // Simple move (one diagonal step)
    for (let [dRow, dCol] of directions) {
      if (rowDiff === dRow && colDiff === dCol) {
        if (anyCaptureAvailable()) {
          return { valid: false, reason: "A capture is available, you must capture." };
        }
        return { valid: true, capture: false, capturedPiece: null };
      }
    }

    // Capturing move (two diagonal steps)
    for (let [dRow, dCol] of directions) {
      if (rowDiff === 2 * dRow && colDiff === 2 * dCol) {
        const jumpedRow = piece.row + dRow;
        const jumpedCol = piece.col + dCol;
        const jumpedPiece = getPieceAt(jumpedRow, jumpedCol);
        if (jumpedPiece && jumpedPiece.player !== piece.player) {
          return { valid: true, capture: true, capturedPiece: jumpedPiece };
        }
      }
    }
    return { valid: false, reason: "Invalid move" };
  };

  // Attempt to move a piece.
  const movePiece = (pieceId, newRow, newCol) => {
    if (gameOver) return false; // Do not allow moves if game is over.
    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece) return false;
    if (forcedPieceId && forcedPieceId !== pieceId) return false;
    if (piece.player !== currentTurn) return false;

    const validation = validateMove(piece, newRow, newCol);
    if (!validation.valid) {
      console.log(validation.reason);
      return false;
    }

    saveState(); // Save state for undo

    // Record last move before updating piece position
    const from = { row: piece.row, col: piece.col };
    const to = { row: newRow, col: newCol };
    setLastMove({ from, to });

    // Create move log entry.
    const moveDescription = `${piece.player.toUpperCase()} moved from (${piece.row}, ${piece.col}) to (${newRow}, ${newCol})${
      validation.capture ? " and captured a piece" : ""
    }`;
    setMoveLog((prev) => [...prev, moveDescription]);

    let newPieces = pieces.map((p) => {
      if (p.id === pieceId) {
        return { ...p, row: newRow, col: newCol };
      }
      return p;
    });

    if (validation.capture && validation.capturedPiece) {
      newPieces = newPieces.filter((p) => p.id !== validation.capturedPiece.id);
    }

    const promotionRow = piece.player === "red" ? boardSize - 1 : 0;
    if (newRow === promotionRow && piece.type === "regular") {
      newPieces = newPieces.map((p) => {
        if (p.id === pieceId) {
          return { ...p, type: "king" };
        }
        return p;
      });
    }

    setPieces(newPieces);

    // Check for game over (if one side has no pieces left).
    const redCount = newPieces.filter((p) => p.player === "red").length;
    const blackCount = newPieces.filter((p) => p.player === "black").length;
    if (redCount === 0 || blackCount === 0) {
      setGameOver(true);
      setWinner(redCount > 0 ? "red" : "black");
      return true;
    }

    if (validation.capture) {
      const updatedPiece = newPieces.find((p) => p.id === pieceId);
      if (canCapture(updatedPiece)) {
        setForcedPieceId(pieceId);
        return true;
      }
    }
    setForcedPieceId(null);
    setCurrentTurn(currentTurn === "red" ? "black" : "red");
    return true;
  };

  // Undo the last move.
  const undoMove = () => {
    if (moveHistory.length === 0) return;
    const lastState = moveHistory[moveHistory.length - 1];
    setPieces(lastState.pieces);
    setCurrentTurn(lastState.currentTurn);
    setForcedPieceId(lastState.forcedPieceId);
    setMoveLog(lastState.moveLog);
    setLastMove(lastState.lastMove);
    setMoveHistory(moveHistory.slice(0, moveHistory.length - 1));
    setGameOver(false);
    setWinner(null);
  };

  // Restart the game.
  const resetGame = () => {
    setPieces(initializePieces());
    setCurrentTurn("red");
    setForcedPieceId(null);
    setMoveHistory([]);
    setMoveLog([]);
    setLastMove(null);
    setGameOver(false);
    setWinner(null);
  };

  // Cancel a forced capture move.
  const cancelForcedMove = () => {
    setForcedPieceId(null);
  };

  return (
    <GameContext.Provider
      value={{
        pieces,
        currentTurn,
        forcedPieceId,
        movePiece,
        undoMove,
        resetGame,
        cancelForcedMove,
        moveLog,
        gameOver,
        winner,
        lastMove,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
