import { ChessBoard, GameResult, GameStatus, SpectateData } from "@/lib/types";
import { Chess } from "chess.js";
import { create } from "zustand";

interface SpectateStore extends SpectateData {
  setBoard: (board: ChessBoard) => void;
  setTurn: (turn: "w" | "b") => void;
  setStatus: (status: GameStatus) => void;
  setResult: (result: GameResult) => void;
  setPlayer1: (player1: string) => void;
  setPlayer2: (player2: string) => void;
}

export const useGameStore = create<SpectateStore>((set) => ({
  startTime: 0,
  status: "IN_PROGRESS",
  result: undefined,
  turn: undefined,
  board: new Chess().board(),
  player1: "",
  player2: "",

  setBoard: (board) => set({ board }),
  setTurn: (turn) => set({ turn }),
  setStatus: (status) => set({ status }),
  setResult: (result) => set({ result }),
  setPlayer1: (player1) => set({ player1 }),
  setPlayer2: (player2) => set({ player2 }),
}));
