import type { Socket } from "socket.io-client";
import { useSpectateStore } from "./useSpectateStore";
import { useEffect } from "react";
import { ChessBoard, GameStatus, SpectateData } from "@/lib/types";
import { Color } from "chess.js";

export const useSpectate = (socket: Socket | null, gameId: string) => {
  const {
    setBoard,
    setTurn,
    setStatus,
    setResult,
    setPlayer1,
    setPlayer2,
    setPlayer1Color,
    setPlayer2Color,
  } = useSpectateStore();

  useEffect(() => {
    if (!socket) return;

    socket.emit("spectate_game", gameId);

    socket.on("spectate_initial_state", (data: SpectateData) => {
      setBoard(data.board);
      setTurn(data.turn);
      setStatus(data.status);
      setResult(data.result!);
      setPlayer1Color(data.player1Color);
      setPlayer2Color(data.player2Color);
      setPlayer1(data.player1);
      setPlayer2(data.player2);
    });

    socket.on(
      "spectate_state_update",
      (data: { board: ChessBoard; turn: Color; status: GameStatus }) => {
        setBoard(data.board);
        setTurn(data.turn);
        setStatus(data.status);
      }
    );
  }, [socket]);
};
