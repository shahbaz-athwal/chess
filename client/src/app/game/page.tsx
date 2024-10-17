"use client";
import Chat from "@/components/Chat";
import ChessBoard from "@/components/ChessBoard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/hooks/useSocket";
import { Chess } from "chess.js";
import { Divide } from "lucide-react";
import { useEffect, useState } from "react";

const Game = () => {
  const socket = useSocket();
  const [name, setName] = useState("");
  const [oppName, setOppName] = useState("");
  const [matchFound, setMatchFound] = useState(false);
  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [playerColor, setPlayerColor] = useState<"w" | "b" | null>(null);
  const [currentTurn, setCurrentTurn] = useState<"w" | "b">("w");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isFindingMatch, setIsFindingMatch] = useState(false); // For button state

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
        (data: {
          color: "w" | "b";
          board: any[][];
          turn: "w" | "b";
          opp: string;
        }) => {
          setMatchFound(true);
          setPlayerColor(data.color);
          setChess(new Chess());
          setBoard(data.board);
          setCurrentTurn(data.turn);
          setErrorMessage(null);
          setIsFindingMatch(false);
          setOppName(data.opp);
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
    <div className="flex gap-6 p-6">
      <div className="w-2/3 rounded-lg bg-white p-6 shadow-md">
        {/* Match Information */}
        {matchFound && (
          <div className="mb-4 text-center text-2xl font-semibold text-gray-700">
            {name} <span className="text-gray-500">vs</span> {oppName}
          </div>
        )}

        {/* Chess Board */}
        <div className="mb-4">
          <ChessBoard
            board={board}
            socket={socket!}
            onMove={handleMove}
            playerColor={playerColor!}
          />
        </div>

        {/* Turn Indicator */}
        {matchFound && (
          <div className="mt-4 text-center text-xl font-medium text-gray-600">
            {currentTurn === playerColor
              ? "Your turn"
              : `Waiting for opponent (${currentTurn === "w" ? "White" : "Black"}'s turn)`}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-2 text-center font-medium text-red-500">
            {errorMessage}
          </div>
        )}

        {/* Match Finding Input */}
        {!matchFound && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <Input
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setName(event.target.value)
              }
              placeholder="Enter your name"
              value={name}
              disabled={isFindingMatch}
            />
            <Button
              onClick={handleFindMatch}
              disabled={isFindingMatch || matchFound}
            >
              {isFindingMatch ? "Finding Match..." : "Find a Match"}
            </Button>
          </div>
        )}
      </div>

      {/* Chat Box */}
      {matchFound && (
        <div className="w-1/3 rounded-lg bg-gray-50 p-6 shadow-lg">
          <Chat socket={socket!} />
        </div>
      )}
    </div>
  );
};

export default Game;
