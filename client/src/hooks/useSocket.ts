"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io(WS_URL);

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
      setSocket(socket);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
      setSocket(null);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return socket;
};
