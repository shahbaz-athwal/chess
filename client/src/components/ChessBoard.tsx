"use client"

import { useGameStore } from "@/hooks/useGameStore"
import type { Color, PieceSymbol, Square } from "chess.js"
import Image from "next/image"
import React, { useState, useCallback, useMemo, memo } from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChessBoardProps {
  onMove: (from: string, to: string) => void
}

// Memoized chess piece component
export const ChessPiece = memo(function ChessPiece({ 
  color, 
  type 
}: { 
  color: Color; 
  type: PieceSymbol 
}) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Image
        alt={`${color === "b" ? "Black" : "White"} ${type}`}
        width={40}
        height={40}
        className="w-[80%] h-[80%] drop-shadow-md transition-transform duration-200 hover:scale-110"
        src={`/${color === "b" ? `b${type}` : `w${type}`}.png`}
        priority
      />
    </div>
  )
})

// Memoized chess square component
const ChessSquare = memo(function ChessSquare({ 
  squareName,
  isLight,
  piece,
  isSelected,
  isHovered,
  onClick,
  onHover,
  onLeave
}: {
  squareName: string
  isLight: boolean
  piece: { type: PieceSymbol; color: Color } | null
  isSelected: boolean
  isHovered: boolean
  onClick: () => void
  onHover: () => void
  onLeave: () => void
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            onClick={onClick}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            className={cn(
              "aspect-square w-full cursor-pointer transition-all duration-200",
              isLight ? "bg-zinc-200" : "bg-zinc-400",
              isSelected && "ring-4 ring-yellow-400 z-10",
              isHovered && !isSelected && piece?.type && "ring-2 ring-blue-400 z-5",
            )}
          >
            {piece && <ChessPiece color={piece.color} type={piece.type} />}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{squareName.toUpperCase()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})

function ChessBoard({ onMove }: ChessBoardProps) {
  const { board, playerColor, currentTurn } = useGameStore()
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null)
  const [hoveredSquare, setHoveredSquare] = useState<Square | null>(null)

  // Memoize the board transformation
  const renderedBoard = useMemo(() => 
    playerColor === "b"
      ? board.map((row) => [...row].reverse()).reverse()
      : board,
    [board, playerColor]
  )

  // Memoize the square click handler
  const handleSquareClick = useCallback((
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
  }, [selectedSquare, playerColor, currentTurn, onMove])

  return (
    <div className="w-full max-w-md md:max-w-lg mx-auto">
      <div className="grid grid-cols-8 gap-0.5 p-1.5 bg-zinc-700 rounded-lg shadow-lg">
        {renderedBoard.map((row, i) =>
          row.map((square, j) => {
            const squareName =
              playerColor === "w"
                ? String.fromCharCode(97 + j) + (8 - i)
                : String.fromCharCode(97 + (7 - j)) + (i + 1)

            const piece = square
              ? { type: square.type, color: square.color }
              : null

            return (
              <ChessSquare
                key={`${i}-${j}`}
                squareName={squareName}
                isLight={(i + j) % 2 === 0}
                piece={piece}
                isSelected={selectedSquare === squareName}
                isHovered={hoveredSquare === squareName}
                onClick={() => handleSquareClick(squareName as Square, piece)}
                onHover={() => setHoveredSquare(squareName as Square)}
                onLeave={() => setHoveredSquare(null)}
              />
            )
          })
        )}
      </div>
    </div>
  )
}

export default memo(ChessBoard)