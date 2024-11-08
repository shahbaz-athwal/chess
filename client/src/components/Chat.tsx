"use client";

import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { Socket } from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea
          className="mb-4 h-64 rounded-lg border"
          ref={scrollAreaRef}
        >
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 rounded-lg p-2 ${
                  message.from === "You" ? "bg-primary/10" : "bg-muted"
                }`}
              >
                <strong className="text-primary">{message.from}: </strong>
                <span>{message.text}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground p-4">
              No messages yet. Start the conversation!
            </p>
          )}
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chat;
