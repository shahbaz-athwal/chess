"use client";

import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

const WS_URL = 'http://localhost:8000'; 

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io(WS_URL);

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
      setSocket(socket);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
      setSocket(null);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return socket;
};
