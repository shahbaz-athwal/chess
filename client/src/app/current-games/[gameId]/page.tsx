"use client";

import { useSocket } from "@/hooks/useSocket";
import { useSpectate } from "@/hooks/useSpectate";
import { useSpectateStore } from "@/hooks/useSpectateStore";

function Spectate({ params }: { params: { gameId: string } }) {
  const gameId = params.gameId.replaceAll("%24", "$");

  const { player1, player2, status, result, board, turn } = useSpectateStore();

  const { socket } = useSocket();

  useSpectate(socket, gameId);

  return (
    <>
      <div>{player1} </div>
      <div>{player2} </div>
      <div>{status} </div>
      <div>{result} </div>
      <div>{turn} </div>
    </>
  );
}

export default Spectate;
