import { Color, PieceSymbol, Square } from "chess.js";
import React, { useState } from "react";
import { Socket } from "socket.io-client";

interface ChessBoardProps {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: Socket;
  onMove: (from: string, to: string) => void;
  playerColor: "w" | "b";
}

function ChessBoard({ board, socket, onMove, playerColor }: ChessBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  const handleSquareClick = (
    square: Square,
    piece: { type: PieceSymbol; color: Color } | null,
  ) => {
    if (selectedSquare) {
      // If a square is already selected, treat this click as a move destination
      onMove(selectedSquare, square); // Call the parent handler to process the move
      setSelectedSquare(null); // Clear the selection after the move
    } else if (piece) {
      setSelectedSquare(square);
    }
  };

  // If the player is black, we need to flip the board
  const renderedBoard = playerColor === "b" ? [...board].reverse() : board;

  return (
    <div className="text-white">
      <div className="mt-12 flex flex-col items-center">
        {renderedBoard.map((row, i) => (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const squareName =
                playerColor === "w"
                  ? String.fromCharCode(97 + j) + (8 - i) // White's perspective
                  : String.fromCharCode(97 + j) + (i + 1); // Black's perspective
              const piece = square
                ? { type: square.type, color: square.color }
                : null;

              return (
                <div
                  key={j}
                  onClick={() => handleSquareClick(squareName as Square, piece)}
                  className={`flex h-12 w-12 cursor-pointer items-center justify-center ${
                    (i + j) % 2 === 0 ? "bg-gray-500" : "bg-gray-300"
                  } ${selectedSquare === squareName ? "bg-yellow-600" : ""}`}
                >
                  {square ? (
                    <img
                      className="w-[2.25rem]"
                      src={`/${square?.color === "b" ? `b${square.type}` : `w${square.type}`}.png`}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChessBoard;
