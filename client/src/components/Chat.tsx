"use client";

import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useGameStore } from "@/hooks/useGameStore";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface ChatProps {
  sendMessage: (messageInput: string) => void;
}

const Chat: React.FC<ChatProps> = ({ sendMessage }) => {
  const { matchFound, playerName, messages } = useGameStore();
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    // Add a small delay to ensure content is rendered
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages]);

  return (
    matchFound && (
      <Card className="w-full lg:max-w-xs">
        <CardHeader>
          <CardTitle className="text-center">Chat</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="mb-4 h-[30vh] md:h-[60vh] rounded-lg border p-4">
            <div className="flex flex-col">
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
                        <AvatarFallback>
                          {message.from[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg max-w-[15rem] w-fit p-[10px] ${
                        message.from === "You"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    {message.from === "You" && (
                      <Avatar className="ml-2">
                        <AvatarFallback>
                          {playerName[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground p-4">
                  No messages yet. Start the conversation!
                </p>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && messageInput.trim()) {
                  sendMessage(messageInput);
                  setMessageInput("");
                }
              }}
            />
            <Button
              onClick={() => {
                if (messageInput.trim()) {
                  sendMessage(messageInput);
                  setMessageInput("");
                }
              }}
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  );
};

export default Chat;
