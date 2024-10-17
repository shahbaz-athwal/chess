"use client";

import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { Socket } from "socket.io-client";

interface ChatProps {
  socket: Socket;
}

const Chat: React.FC<ChatProps> = ({ socket }) => {
  const [messages, setMessages] = useState<{ from: string; text: string }[]>(
    [],
  );
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
    <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-center text-2xl font-semibold text-gray-700">
        Chat
      </h2>

      {/* Scrollable Chat Area */}
      <ScrollArea
        className="mb-4 h-64 overflow-y-auto rounded-lg border border-gray-200 bg-gray-100 p-4"
        ref={scrollAreaRef}
      >
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 rounded-lg p-2 ${
                message.from === "You" ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <strong className="text-blue-700">{message.from}: </strong>
              <span className="text-gray-700">{message.text}</span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No messages yet. Start the conversation!
          </p>
        )}
      </ScrollArea>

      {/* Message Input and Send Button */}
      <div className="flex gap-2">
        <Input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    </div>
  );
};

export default Chat;
