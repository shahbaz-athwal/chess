import type { Square, PieceSymbol, Color } from "chess.js";

export interface GameState {
  board: ChessBoard;
  currentTurn: "w" | "b";
  playerColor: "w" | "b" | null;
  matchFound: boolean;
  errorMessage: string | null;
  playerName: string;
  opponent: string;
  isFindingMatch: boolean;
}

export interface ChatMessage {
  from: string;
  text: string;
}

export type ChessBoard = ({
  square: Square;
  type: PieceSymbol;
  color: Color;
} | null)[][];
