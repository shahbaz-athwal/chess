"use client";
import ChessBoard from "@/components/ChessBoard";
import { useSocket } from "@/hooks/useSocket";
import { Chess } from "chess.js";
import { useEffect, useState } from "react";

const Game = () => {
  const socket = useSocket();

  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());

  useEffect(() => {
    if (!socket) {
      console.log("not connected");
    }
    if (socket) {
      console.log("connected");

      socket.emit("init_game", {});

      socket.on("start_game", () => {
        setChess(new Chess());
        setBoard(chess.board());
        console.log("Game Initialised.");
      });

      socket.on("move", (data) => {
        chess.move(data);
        console.log("Move made:", data);
      });

      // Clean up the event listener when the component unmounts
      return () => {
        socket.off("move");
        socket.off("init_game");
      };
    }
  }, [socket]);

  return (
    <div>
      <ChessBoard board={board} />
    </div>
  );
};

export default Game;
