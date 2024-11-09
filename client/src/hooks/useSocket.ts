"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

interface SocketState {
  socket: Socket | null;
  error: Error | null;
}

export const useSocket = () => {
  const [state, setState] = useState<SocketState>({
    socket: null,
    error: null,
  });

  useEffect(() => {
    try {
      const socket = io(WS_URL, {
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
      });

      socket.on("connect", () => {
        setState({ socket, error: null });
      });

      socket.on("disconnect", () => {
        setState((prev) => ({ ...prev, socket: null }));
      });

      socket.on("connect_error", (error) => {
        setState({
          socket: null,
          error: new Error("Failed to connect to server"),
        });
      });

      socket.on("connect_timeout", () => {
        setState({
          socket: null,
          error: new Error("Connection timed out - server might be down"),
        });
      });

      socket.on("reconnect_failed", () => {
        setState({
          socket: null,
          error: new Error("Failed to reconnect after multiple attempts"),
        });
      });

      return () => {
        socket.disconnect();
      };
    } catch (error) {
      setState({ socket: null, error: error as Error });
    }
  }, []);

  return state;
};
