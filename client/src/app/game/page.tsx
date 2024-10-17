"use client";
import Chat from "@/components/Chat";
import ChessBoard from "@/components/ChessBoard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/hooks/useSocket";
import { Chess } from "chess.js";
import { useEffect, useState } from "react";

const Game = () => {
  const socket = useSocket();
  const [name, setName] = useState("");
  const [matchFound, setMatchFound] = useState(false);
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [playerColor, setPlayerColor] = useState<"w" | "b" | null>(null);
  const [currentTurn, setCurrentTurn] = useState<"w" | "b">("w");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isFindingMatch, setIsFindingMatch] = useState(false); // For button state

  // Function to handle socket connection and game initialization
  const handleFindMatch = () => {
    if (!name) {
      setErrorMessage("Name is required to find a match!");
      return;
    }
    setErrorMessage(null); // Clear error message if name is valid

    if (socket && !isSocketConnected) {
      setIsFindingMatch(true); // Show loading on the button
      console.log("Connecting to socket...");

      socket.emit("init_game", { name });

      setIsSocketConnected(true);
    }
  };

  // Manage socket events only once after connection
  useEffect(() => {
    if (isSocketConnected && socket) {
      // Listen for the game start event
      socket.on(
        "start_game",
        (data: { color: "w" | "b"; board: any[][]; turn: "w" | "b" }) => {
          setMatchFound(true);
          setPlayerColor(data.color);
          setChess(new Chess());
          setBoard(data.board);
          setCurrentTurn(data.turn);
          setErrorMessage(null);
          setIsFindingMatch(false);
          console.log(
            `Game initialized. You are playing as ${data.color === "w" ? "White" : "Black"}`,
          );
        },
      );

      // Listen for move events
      socket.on(
        "move",
        (data: {
          move: { from: string; to: string };
          board: any[][];
          turn: "w" | "b";
        }) => {
          setBoard(data.board);
          setCurrentTurn(data.turn);
          setErrorMessage(null);
          console.log("Move made:", data.move);
        },
      );

      // Listen for invalid move events
      socket.on("invalid_move", (data: { message: string }) => {
        setErrorMessage(data.message);
        console.log(data.message);
      });

      // Cleanup socket listeners when the component unmounts or re-renders
      return () => {
        socket.off("move");
        socket.off("start_game");
        socket.off("invalid_move");
      };
    }
  }, [isSocketConnected, socket]);

  // Function to handle a move from the client
  const handleMove = (from: string, to: string) => {
    if (currentTurn !== playerColor) {
      setErrorMessage("It's not your turn!");
      return;
    }
    setErrorMessage(null);
    socket!.emit("move", { from, to });
  };

  return (
    <div className="flex">
      <div className="w-2/3">
        <ChessBoard
          board={board}
          socket={socket!}
          onMove={handleMove}
          playerColor={playerColor!}
        />
        {matchFound && (
          <div className="mt-4 text-center">
            {currentTurn === playerColor
              ? "Your turn"
              : `Waiting for opponent (${currentTurn === "w" ? "White" : "Black"}'s turn)`}
          </div>
        )}
        {errorMessage && (
          <div className="mt-2 text-center text-red-500">{errorMessage}</div>
        )}
        {!matchFound && (
          <div className="mt-12 flex justify-center gap-4">
            <Input
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setName(event.target.value)
              }
              className="w-48"
              placeholder="Enter your name"
              value={name}
              disabled={isFindingMatch} // Disable input when searching for a match
            />
            <Button
              onClick={handleFindMatch}
              disabled={isFindingMatch || matchFound} // Disable button if searching or match found
            >
              {isFindingMatch ? "Finding Match..." : "Find a Match"}
            </Button>
          </div>
        )}
      </div>

      {/* Chat Component */}
      {matchFound && (
        <div className="w-1/3">
          <Chat socket={socket!} />
        </div>
      )}
    </div>
  );
};

export default Game;
