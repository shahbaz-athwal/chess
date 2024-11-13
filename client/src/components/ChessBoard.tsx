"use client"

import { useGameStore } from "@/hooks/useGameStore"
import type { Color, PieceSymbol, Square } from "chess.js"
import Image from "next/image"
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChessBoardProps {
  onMove: (from: string, to: string) => void
}

function ChessBoard({ onMove }: ChessBoardProps) {
  const { board, playerColor, currentTurn } = useGameStore()

  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [hoveredSquare, setHoveredSquare] = useState<Square | null>(null)

  const handleSquareClick = (
    square: Square,
    piece: { type: PieceSymbol; color: Color } | null
  ) => {
    if (selectedSquare) {
      if (square !== selectedSquare) {
        onMove(selectedSquare, square)
      }
      setSelectedSquare(null)
    } else if (piece && piece.color === playerColor && currentTurn === playerColor) {
      setSelectedSquare(square)
    }
  }

  const renderedBoard =
    playerColor === "b"
      ? board.map((row) => [...row].reverse()).reverse()
      : board

  return (
    <div className="w-full max-w-md md:max-w-lg mx-auto">
      <div className="grid grid-cols-8 gap-0.5 p-2 bg-zinc-700 rounded-lg shadow-lg">
        {renderedBoard.map((row, i) =>
          row.map((square, j) => {
            const squareName =
              playerColor === "w"
                ? String.fromCharCode(97 + j) + (8 - i)
                : String.fromCharCode(97 + (7 - j)) + (i + 1)

            const piece = square
              ? { type: square.type, color: square.color }
              : null

            const isSelected = selectedSquare === squareName
            const isHovered = hoveredSquare === squareName

            return (
              <TooltipProvider key={`${i}-${j}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => handleSquareClick(squareName as Square, piece)}
                      onMouseEnter={() => setHoveredSquare(squareName as Square)}
                      onMouseLeave={() => setHoveredSquare(null)}
                      className={cn(
                        "aspect-square w-full cursor-pointer transition-all duration-200",
                        (i + j) % 2 === 0 ? "bg-zinc-200" : "bg-zinc-400",
                        isSelected && "ring-4 ring-yellow-400 z-10",
                        isHovered && !isSelected && square?.type && "ring-2 ring-blue-400 z-5",
                      )}
                    >
                      {square && (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image
                            alt={`${square.color === "b" ? "Black" : "White"} ${square.type}`}
                            width={40}
                            height={40}
                            className="w-[80%] h-[80%] drop-shadow-md transition-transform duration-200 hover:scale-110"
                            src={`/${square.color === "b" ? `b${square.type}` : `w${square.type}`}.png`}
                          />
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{squareName.toUpperCase()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ChessBoard