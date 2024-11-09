"use client";

import Chat from "@/components/Chat";
import ChessBoard from "@/components/ChessBoard";
import { GameStatus } from "@/components/GameStatus";
import { MatchFinder } from "@/components/MatchFinder";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGameSocket } from "@/hooks/useGameSocket";
import { useSocket } from "@/hooks/useSocket";

export default function Game() {
  const socket = useSocket();
  const { makeMove, initGame } = useGameSocket(socket);

  return (
    <>
      {socket ? (
        <div className="flex flex-col md:flex-row gap-6 p-6 bg-background text-foreground">
          <Card className="w-full md:w-2/3">
            <CardHeader>
              <GameStatus />
            </CardHeader>
            <CardContent>
              <ChessBoard onMove={makeMove} />

              <MatchFinder initGame={initGame} />
            </CardContent>
          </Card>

          <Chat socket={socket!} />
        </div>
      ) : null}
    </>
  );
}
