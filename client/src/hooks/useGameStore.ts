import { create } from "zustand";
import { Chess } from "chess.js";
import type { ChessBoard, GameState } from "@/lib/types";

interface GameStore extends GameState {
  setBoard: (board: ChessBoard) => void;
  setCurrentTurn: (turn: "w" | "b") => void;
  setPlayerColor: (color: "w" | "b" | null) => void;
  setMatchFound: (found: boolean) => void;
  setErrorMessage: (message: string | null) => void;
  setPlayerName: (name: string) => void;
  setOppName: (name: string) => void;
  setIsFindingMatch: (isFinding: boolean) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  board: new Chess().board(),
  currentTurn: "w",
  playerColor: null,
  matchFound: false,
  errorMessage: null,
  opponent: "",
  playerName: "",
  isFindingMatch: false,

  setBoard: (board) => set({ board }),
  setCurrentTurn: (turn) => set({ currentTurn: turn }),
  setPlayerColor: (color) => set({ playerColor: color }),
  setMatchFound: (found) => set({ matchFound: found }),
  setErrorMessage: (message) => set({ errorMessage: message }),
  setOppName: (name) => set({ opponent: name }),
  setPlayerName: (name) => set({ playerName: name }),
  setIsFindingMatch: (isFinding) => set({ isFindingMatch: isFinding }),
  resetGame: () =>
    set({
      board: new Chess().board(),
      currentTurn: "w",
      playerColor: null,
      matchFound: false,
      errorMessage: null,
      opponent: "",
      isFindingMatch: false,
    }),
}));
