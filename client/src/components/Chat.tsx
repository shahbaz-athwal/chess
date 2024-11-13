"use client";

import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { Socket } from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useGameStore } from "@/hooks/useGameStore";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface ChatProps {
  socket: Socket;
}

interface Message {
  from: string;
  text: string;
}

const Chat: React.FC<ChatProps> = ({ socket }) => {
  const { matchFound, playerName } = useGameStore();
  const [messages, setMessages] = useState<Message[]>([]);
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
    matchFound && (
      <Card className="w-full lg:max-w-xs">
        <CardHeader>
          <CardTitle className="text-center">Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea
            className="mb-4 h-[30vh] md:h-[60vh] rounded-lg border p-4"
            ref={scrollAreaRef}
          >
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex items-start ${
                    message.from === "You" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.from !== "You" && (
                    <Avatar className="mr-2">
                      <AvatarFallback>{message.from[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg max-w-[15rem] w-fit p-[10px]  ${
                      message.from === "You"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                  {message.from === "You" && (
                    <Avatar className="ml-2">
                      <AvatarFallback>{playerName[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    )
  );
};

export default Chat;
