"use client";
import ChessBoard from "@/components/ChessBoard";
import { useSocket } from "@/hooks/useSocket";
import { Chess } from "chess.js";
import { useEffect, useState } from "react";

const Game = () => {
  const socket = useSocket();
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [playerColor, setPlayerColor] = useState<"w" | "b" | null>(null); // Player's assigned color
  const [currentTurn, setCurrentTurn] = useState<"w" | "b">("w"); // Track whose turn it is
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message for invalid moves

  useEffect(() => {
    if (!socket) {
      console.log("Socket not connected");
      return;
    }

    socket.emit("init_game"); // Initialize the game
    // Listen for the game start event
    socket.on("start_game", (data: { color: "w" | "b"; board: any[][]; turn: "w" | "b" }) => {
      setPlayerColor(data.color); // Set the player's color
      setChess(new Chess()); // Reset chess engine
      setBoard(data.board); // Set initial board from server
      setCurrentTurn(data.turn); // Set the current turn
      setErrorMessage(null); // Clear any error message
      console.log(`Game initialized. You are playing as ${data.color === "w" ? "White" : "Black"}`);
    });

    // Listen for move events
    socket.on("move", (data: { move: { from: string; to: string }; board: any[][]; turn: "w" | "b" }) => {
      setBoard(data.board); // Update board with the latest state from server
      setCurrentTurn(data.turn); // Update the current turn
      setErrorMessage(null); // Clear any error message
      console.log("Move made:", data.move);
    });

    // Listen for invalid move events
    socket.on("invalid_move", (data: { message: string }) => {
      setErrorMessage(data.message); // Set error message for invalid moves
      console.log(data.message);
    });

    return () => {
      socket.off("move");
      socket.off("start_game");
      socket.off("invalid_move");
    };
  }, [socket]);

  // Function to handle a move from the client
  const handleMove = (from: string, to: string) => {
    // Only allow the player to move their own pieces and if it's their turn
    if (currentTurn !== playerColor) {
      console.log("It's not your turn!");
      return;
    }

    // Emit the move to the server (the server will handle validation)
    socket!.emit("move", { from, to });
  };

  return (
    <div>
      <ChessBoard board={board} socket={socket!} onMove={handleMove} playerColor={playerColor!} />
      <div className="text-center mt-4">
        {currentTurn === playerColor
          ? "Your turn"
          : `Waiting for opponent (${currentTurn === "w" ? "White" : "Black"}'s turn)`}
      </div>
      {errorMessage && <div className="text-red-500 text-center mt-2">{errorMessage}</div>}
    </div>
  );
};

export default Game;
