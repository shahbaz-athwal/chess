import { useEffect } from "react";
import type { Socket } from "socket.io-client";
import { useGameStore } from "./useGameStore";
import type { ChessBoard } from "@/lib/types";

export const useGameSocket = (socket: Socket | null) => {
  const {
    setBoard,
    setCurrentTurn,
    setPlayerColor,
    setMatchFound,
    setErrorMessage,
    setIsFindingMatch,
    setOppName,
    playerColor,
  } = useGameStore();

  useEffect(() => {
    if (!socket) return;

    socket.on(
      "start_game",
      (data: {
        color: "w" | "b";
        board: ChessBoard;
        turn: "w" | "b";
        opp: string;
      }) => {
        setMatchFound(true);
        setPlayerColor(data.color);
        setBoard(data.board);
        setCurrentTurn(data.turn);
        setErrorMessage(null);
        setOppName(data.opp);
        setIsFindingMatch(false);
      }
    );

    socket.on(
      "move",
      (data: {
        move: { from: string; to: string };
        board: ChessBoard;
        turn: "w" | "b";
      }) => {
        setBoard(data.board);
        setCurrentTurn(data.turn);
        setErrorMessage(null);
      }
    );

    socket.on("invalid_move", (data: { message: string }) => {
      setErrorMessage(data.message);
    });

    return () => {
      socket.off("move");
      socket.off("start_game");
      socket.off("invalid_move");
    };
  }, [socket]);

  const makeMove = (from: string, to: string) => {
    const currentTurn = useGameStore.getState().currentTurn;

    if (currentTurn !== playerColor) {
      setErrorMessage("It's not your turn!");
      return;
    }

    setErrorMessage(null);
    socket?.emit("move", { from, to });
  };

  const initGame = (name: string) => {
    setIsFindingMatch(true);
    socket?.emit("init_game", { name });
  };

  return { makeMove, initGame };
};
