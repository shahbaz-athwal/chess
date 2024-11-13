import { useGameStore } from "@/hooks/useGameStore";
import type { Color, PieceSymbol, Square } from "chess.js";
import Image from "next/image";
import React, { useState } from "react";

interface ChessBoardProps {
  onMove: (from: string, to: string) => void;
}

function ChessBoard({ onMove }: ChessBoardProps) {
  const { board, playerColor } = useGameStore();

  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);

  const handleSquareClick = (
    square: Square,
    piece: { type: PieceSymbol; color: Color } | null
  ) => {
    if (selectedSquare) {
      onMove(selectedSquare, square);
      setSelectedSquare(null);
    } else if (piece) {
      setSelectedSquare(square);
    }
  };

  const renderedBoard =
    playerColor === "b"
      ? board.map((row) => [...row].reverse()).reverse() // Reverse both rows and columns
      : board;

  return (
    <div className="text-white p-2 sm:p-0">
      <div className="mt-2 flex flex-col items-center">
        {renderedBoard.map((row, i) => (
          <div key={i} className="flex">
            {row.map((square, j) => {
              const squareName =
                playerColor === "w"
                  ? String.fromCharCode(97 + j) + (8 - i) // White's perspective
                  : String.fromCharCode(97 + (7 - j)) + (i + 1); // Black's perspective, reversed columns

              const piece = square
                ? { type: square.type, color: square.color }
                : null;

              return (
                <div
                  key={j}
                  onClick={() => handleSquareClick(squareName as Square, piece)}
                  className={`flex aspect-square w-11 sm:w-16 cursor-pointer items-center justify-center ${
                    (i + j) % 2 === 0 ? "bg-zinc-800/50" : "bg-zinc-300"
                  } ${selectedSquare === squareName ? "bg-yellow-600" : ""}`}
                >
                  {square ? (
                    <Image
                      alt={square.square}
                      width={40}
                      height={40}
                      className="w-[80%] h-[80%]"
                      src={`/${
                        square?.color === "b"
                          ? `b${square.type}`
                          : `w${square.type}`
                      }.png`}
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