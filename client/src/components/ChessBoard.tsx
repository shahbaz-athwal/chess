import { Color, PieceSymbol, Square } from "chess.js";
import React from "react";

function ChessBoard({
  board,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
}) {
  return (
    <div className="text-white">
      <div className="flex flex-col">
        {board.map((row, i) => (
          <div key={i} className="flex">
            {row.map((square, j) => (
              <div
                key={j}
                className={`flex h-16 w-16 items-center justify-center ${
                  (i + j) % 2 === 0 ? "bg-gray-500" : "bg-gray-300"
                }`}
              >
                {square ? (
                  <span
                    className={`text-3xl ${
                      square.color === "w" ? "text-white" : "text-black"
                    }`}
                  >
                    {square.type}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChessBoard;
