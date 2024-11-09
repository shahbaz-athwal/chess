import type { Color } from "chess.js";
import type { Socket } from "socket.io";

export type GameStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ABANDONED"
  | "TIME_UP"
  | "PLAYER_EXIT";
export type GameResult = "WHITE_WINS" | "BLACK_WINS" | "DRAW";

export interface Player {
  socket: Socket;
  name: string;
  color?: Color;
}

export interface GameState {
  board: any;
  status: GameStatus;
  result?: GameResult;
  lastMoveTime: number;
  timeRemaining: {
    white: number;
    black: number;
  };
}

export interface GameMove {
  from: string;
  to: string;
  promotion?: string;
}

export interface GameConfig {
  timeLimit: number;
  incrementSeconds: number;
}
