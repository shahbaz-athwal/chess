"use client";

import { useSocket } from "@/hooks/useSocket";
import { useSpectate } from "@/hooks/useSpectate";

function Spectate({ params }: { params: { gameId: string } }) {
  const gameId = params.gameId.replaceAll("%24", "$");

  const { socket } = useSocket();

  useSpectate(socket, gameId);

  return <div>gameId: {gameId}</div>;
}

export default Spectate;
