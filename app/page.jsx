"use client";
import React from "react";
import Board from "../components/Board";
import { useGame } from "../components/GameContext";

export default function Home() {
  const {
    currentTurn,
    undoMove,
    resetGame,
    cancelForcedMove,
    forcedPieceId,
    moveLog,
    gameOver,
    winner,
  } = useGame();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-500 p-4">
      <h1 className="text-5xl font-extrabold text-white mb-8">Checkers</h1>
      <div className="flex flex-col md:flex-row items-center">
        {/* Board Container */}
        <div className="relative">
          {/* Board with blur if game over */}
          <div className={`${gameOver ? "filter blur-sm" : ""}`}>
            <Board />
          </div>
          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
                <h2 className="text-4xl font-bold text-red-700 mb-4">Game Over!</h2>
                <p className="text-2xl text-gray-800">{winner.toUpperCase()} wins the game!</p>
              </div>
            </div>
          )}
        </div>
        {/* Control Panel */}
        <div className="mt-8 md:mt-0 md:ml-8 flex flex-col space-y-4 w-full md:w-auto">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="mb-4">
              {!gameOver && (
                <div>
                  <span className="text-2xl font-bold text-gray-800">
                    Current Turn:{" "}
                  </span>
                  <span className={`text-2xl font-bold ${currentTurn === "red" ? "text-red-500" : "text-black"}`}>
                    {currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-4">
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-lg"
                onClick={resetGame}
              >
                Restart Game
              </button>
              <button
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition text-lg"
                onClick={undoMove}
              >
                Undo Move
              </button>
              {forcedPieceId && (
                <button
                  className="px-6 py-3 bg-yellow-600 text-white rounded-lg shadow hover:bg-yellow-700 transition text-lg"
                  onClick={cancelForcedMove}
                >
                  Cancel Forced Move
                </button>
              )}
            </div>
          </div>
          {/* Move History Panel */}
          <div className="bg-white rounded-lg p-4 shadow-lg w-full md:w-80 max-h-80 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-2">Move History</h2>
            <ul className="list-disc list-inside space-y-1">
              {moveLog.map((move, index) => (
                <li key={index} className="text-lg">
                  {move}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
