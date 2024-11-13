"use client";

import { useGameStore } from "@/hooks/useGameStore";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

export const GameStatus = () => {
  const {
    matchFound,
    opponent,
    currentTurn,
    playerColor,
    errorMessage,
    playerName,
  } = useGameStore();

  if (!matchFound)
    return (
      <div className="h-6">
        {" "}
        {/* Fixed height container for error message */}
        {errorMessage && (
          <p className="text-center text-sm font-medium text-destructive animate-fade-in">
            {errorMessage}
          </p>
        )}
      </div>
    );

  const isPlayerTurn = currentTurn === playerColor;
  const turnColor = currentTurn === "w" ? "White" : "Black";

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4 space-y-2">
        <div className="px-2 flex justify-between items-center">
          <span className="text-2xl font-extrabold">{playerName}</span>
          <span className="text-2xl font-bold text-muted-foreground">VS</span>
          <span className="text-2xl font-extrabold">{opponent}</span>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <Clock
            className={`w-5 h-5 ${
              isPlayerTurn ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <span
            className={`text-lg font-medium ${
              isPlayerTurn ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {isPlayerTurn ? "Your turn" : `${turnColor}'s turn`}
          </span>
        </div>

        <div className="h-6">
          {" "}
          {/* Fixed height container for error message */}
          {errorMessage && (
            <p className="text-center text-sm font-medium text-destructive animate-fade-in">
              {errorMessage}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
