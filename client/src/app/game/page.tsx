"use client";

import Chat from "@/components/Chat";
import ChessBoard from "@/components/ChessBoard";
import { GameStatus } from "@/components/GameStatus";
import { MatchFinder } from "@/components/MatchFinder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameSocket } from "@/hooks/useGameSocket";
import { useSocket } from "@/hooks/useSocket";
import { AlertCircle, Loader2, } from "lucide-react";

export default function Game() {
  const { socket, error } = useSocket();
  const { makeMove, initGame } = useGameSocket(socket);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Connection Error</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Failed to connect to the server. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!socket) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Connecting to Server</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please wait while we establish a connection to the game server...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container w-full mx-auto my-8 sm:my-12 px-2">
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="w-full mx-auto lg:w-[70%]">
          <CardHeader>
            <GameStatus />
          </CardHeader>
          <CardContent>
            <ChessBoard onMove={makeMove} />
            <MatchFinder initGame={initGame} />
          </CardContent>
        </Card>

        <Chat socket={socket} />
      </div>
    </div>
  );
}
