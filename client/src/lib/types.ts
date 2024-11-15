import type { Square, PieceSymbol, Color } from "chess.js";

export type GameStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ABANDONED"
  | "TIME_UP"
  | "PLAYER_EXIT";

export type GameResult = "WHITE_WINS" | "BLACK_WINS" | "DRAW";

export interface GameState {
  board: ChessBoard;
  currentTurn: "w" | "b";
  playerColor: "w" | "b" | null;
  matchFound: boolean;
  errorMessage: string | null;
  playerName: string;
  opponent: string;
  isFindingMatch: boolean;
  messages: ChatMessage[];
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

export interface SpectateData {
  startTime: number;
  player1: string;
  player2: string;
  status: GameStatus;
  result?: GameResult;
  board: ChessBoard;
  turn: Color;
}
