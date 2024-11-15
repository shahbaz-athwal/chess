"use client";

import { useSocket } from "@/hooks/useSocket";
import { ChessBoard } from "@/lib/types";
import React, { useEffect } from "react";

type GameStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ABANDONED"
  | "TIME_UP"
  | "PLAYER_EXIT";

type GameResult = "WHITE_WINS" | "BLACK_WINS" | "DRAW";

function Spectate({ params }: { params: { gameId: string } }) {
  const gameId = params.gameId.replaceAll("%24", "$");
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.emit("spectate_game", gameId);

    socket.on(
      "spectate_initial_state",
      (data: {
        startTime: number;
        player1: string;
        player2: string;
        status: GameStatus;
        result: GameResult | undefined;
        board: ChessBoard;
        turn: "w" | "b";
      }) => {
        console.log("spectate_initial_state", data);
      }
    );

    socket.on(
      "spectate_state_update",
      (data: { board: ChessBoard; turn: "w" | "b"; status: GameStatus }) => {
        console.log("spectate_state_update", data);
      }
    );
  }, [socket]);

  return <div>gameId: {gameId}</div>;
}

export default Spectate;
