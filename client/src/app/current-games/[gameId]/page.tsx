"use client";

import { useSocket } from "@/hooks/useSocket";
import { ChessBoard, GameStatus, SpectateData } from "@/lib/types";
import React, { useEffect } from "react";

function Spectate({ params }: { params: { gameId: string } }) {
  const gameId = params.gameId.replaceAll("%24", "$");
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.emit("spectate_game", gameId);

    socket.on("spectate_initial_state", (data: SpectateData) => {
      console.log("spectate_initial_state", data);
    });

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
