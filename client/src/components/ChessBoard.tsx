import { Color, PieceSymbol, Square } from "chess.js";
import React, { useState } from "react";
import { Socket } from "socket.io-client";

interface ChessBoardProps {
  board: ( 
    ({
      square: Square;
      type: PieceSymbol;
      color: Color;
    } | null)[])[];
  socket: Socket;
  onMove: (from: string, to: string) => void; // Prop to handle the move
  playerColor: "w" | "b"; // Pass player's color to adjust the board orientation
}

function ChessBoard({ board, socket, onMove, playerColor }: ChessBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  // Function to handle selecting or moving a piece
  const handleSquareClick = (square: Square, piece: { type: PieceSymbol; color: Color } | null) => {
    if (selectedSquare) {
      // If a square is already selected, treat this click as a move destination
      onMove(selectedSquare, square); // Call the parent handler to process the move
      setSelectedSquare(null); // Clear the selection after the move
    } else if (piece) {
      // Select the square if it contains a piece
      setSelectedSquare(square);
    }
  };

  // If the player is black, we need to flip the board
  const renderedBoard = playerColor === "b" ? [...board].reverse() : board;

  return (
    <div className="text-white">
      <div className="flex flex-col">
        {renderedBoard.map((row, i) => (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const squareName = playerColor === "w"
                ? String.fromCharCode(97 + j) + (8 - i) // White's perspective
                : String.fromCharCode(97 + j) + (i + 1); // Black's perspective
              const piece = square ? { type: square.type, color: square.color } : null;

              return (
                <div
                  key={j}
                  onClick={() => handleSquareClick(squareName as Square, piece)}
                  className={`flex h-16 w-16 items-center justify-center cursor-pointer ${
                    (i + j) % 2 === 0 ? "bg-gray-500" : "bg-gray-300"
                  } ${
                    selectedSquare === squareName ? "bg-yellow-400" : ""
                  }`} // Highlight the selected square
                >
                  {square ? (
                    <span
                      className={`text-3xl ${
                        square.color === "w" ? "text-white" : "text-black"
                      }`}
                    >
                      {piece?.type}
                    </span>
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
