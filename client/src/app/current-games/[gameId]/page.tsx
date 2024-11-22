"use client";

import { useSocket } from "@/hooks/useSocket";
import { useSpectate } from "@/hooks/useSpectate";
import { useSpectateStore } from "@/hooks/useSpectateStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Spectate({ params }: { params: { gameId: string } }) {
  const gameId = params.gameId.replaceAll("%24", "$");

  const {
    player1,
    player2,
    player1Color,
    player2Color,
    status,
    result,
    board,
    turn,
  } = useSpectateStore();

  const { socket } = useSocket();

  useSpectate(socket, gameId);

  return (
    <div className="container mx-auto px-4 py-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Spectator Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 text-center text-2xl font-extrabold">
            <p>{player1Color === "b" ? `${player1}` : `${player2}`}</p>
          </div>

          <div className="space-y-2">
            <div className="bg-gray-200 aspect-square w-full max-w-sm mx-auto flex items-center justify-center">
              <p className="text-gray-500">Chessboard Placeholder</p>
            </div>
          </div>
          <div className="space-y-2 text-center text-2xl font-extrabold">
            <p>{player1Color === "w" ? `${player1}` : `${player2}`}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Spectate;
