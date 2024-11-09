"use client";

import Chat from "@/components/Chat";
import ChessBoard from "@/components/ChessBoard";
import { GameStatus } from "@/components/GameStatus";
import { MatchFinder } from "@/components/MatchFinder";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGameSocket } from "@/hooks/useGameSocket";
import { useGameStore } from "@/hooks/useGameStore";
import { useSocket } from "@/hooks/useSocket";

export default function Game() {
  const socket = useSocket();
  const { makeMove, initGame } = useGameSocket(socket);
  const { board, playerColor, matchFound } = useGameStore();

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 p-6 bg-background text-foreground">
        <Card className="w-full md:w-2/3">
          <CardHeader>
            <GameStatus />
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <ChessBoard
                board={board}
                onMove={makeMove}
                playerColor={playerColor!}
              />
            </div>

            <MatchFinder initGame={initGame} />
          </CardContent>
        </Card>

        {matchFound && (
          <Card className="w-full md:w-1/3">
            <CardContent>
              <Chat socket={socket!} />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
