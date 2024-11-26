"use client";

import { useSocket } from "@/hooks/useSocket";
import { useSpectate } from "@/hooks/useSpectate";
import { useSpectateStore } from "@/hooks/useSpectateStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChessPiece } from "@/components/ChessBoard";

function Spectate({ params }: { params: { gameId: string } }) {
  const gameId = params.gameId.replaceAll("%24", "$");

  const {
    player1,
    player2,
    player1Color,
    board,
  } = useSpectateStore();

  const { socket } = useSocket();

  useSpectate(socket, gameId);

  return (
    <div className="container mx-auto px-4 py-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Spectator Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 text-center text-2xl font-extrabold">
            <p>{player1Color === "b" ? `${player1}` : `${player2}`}</p>
          </div>

          <div className="space-y-2">
            <div className="w-full max-w-md md:max-w-lg mx-auto">
              <div className="grid grid-cols-8 gap-0.5 p-1.5 bg-zinc-700 rounded-lg shadow-lg">
                {board.map((row, i) =>
                  row.map((square, j) => {
                    const piece = square
                      ? { type: square.type, color: square.color }
                      : null;

                    return (
                      <div
                        key={`${i}${j}`}
                        className={cn(
                          "aspect-square w-full cursor-pointer transition-all duration-200",
                          (i + j) % 2 === 0 ? "bg-zinc-200" : "bg-zinc-400"
                        )}
                      >
                        {piece && (
                          <ChessPiece color={piece.color} type={piece.type} />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
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
