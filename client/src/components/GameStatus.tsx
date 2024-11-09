import { useGameStore } from "@/hooks/useGameStore";


  
  export const GameStatus = () => {
    const { matchFound, oppName, currentTurn, playerColor, errorMessage, playerName } = useGameStore();
    
    if (!matchFound) return null;
    
    return (
      <div className="space-y-4">
        <h2 className="text-center text-xl">
          {playerName} <span className="text-muted-foreground">vs</span> {oppName}
        </h2>
        
        <div className="text-center text-xl font-medium">
          {currentTurn === playerColor
            ? "Your turn"
            : `Waiting for opponent (${currentTurn === "w" ? "White" : "Black"}'s turn)`}
        </div>
        
        {errorMessage && (
          <div className="text-center font-medium text-destructive">
            {errorMessage}
          </div>
        )}
      </div>
    );
  };