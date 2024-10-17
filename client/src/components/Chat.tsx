"use client"

import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Socket } from "socket.io-client";

interface ChatProps {
  socket: Socket;
}

const Chat: React.FC<ChatProps> = ({ socket }) => {
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("chat", (data: { from: string; text: string }) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("chat");
    };
  }, [socket]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    socket.emit("chat", { from: "You", text: messageInput });

    setMessages((prevMessages) => [
      ...prevMessages,
      { from: "You", text: messageInput },
    ]);
    
    setMessageInput("");
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-lg bg-gray-100 p-4 shadow-lg">
      <h2 className="mb-4 text-center text-lg font-semibold">Chat</h2>

      <ScrollArea
        className="h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white p-4"
        ref={scrollAreaRef}
      >
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className="mb-2">
              <strong>{message.from}: </strong>
              <span>{message.text}</span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No messages yet. Start the conversation!
          </p>
        )}
      </ScrollArea>

      <div className="mt-4 flex gap-2">
        <Input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    </div>
  );
};

export default Chat;
