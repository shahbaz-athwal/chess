import { useGameStore } from "@/hooks/useGameStore";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface MatchFinderProps {
  initGame: (name: string) => void;
}

export const MatchFinder: React.FC<MatchFinderProps> = ({ initGame }) => {
  const {
    matchFound,
    isFindingMatch,
    playerName,
    setPlayerName,
    setErrorMessage,
  } = useGameStore();

  const handleFindMatch = () => {
    if (playerName.trim().length < 3) {
      setErrorMessage("Name must be at least 3 characters long!");
      return;
    }

    setErrorMessage(null);
    try {
      initGame(playerName.trim().split(" ")[0]!);
    } catch (e) {
      setErrorMessage("Failed to start game. Please try again.");
      console.error(e);
    }
  };

  if (matchFound) return null;

  return (
    <div className="mt-12 flex items-center justify-center gap-4">
      <Input
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter your name"
        value={playerName}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleFindMatch();
          }
        }}
        disabled={isFindingMatch}
      />
      <Button onClick={handleFindMatch} disabled={isFindingMatch || matchFound}>
        {isFindingMatch ? "Finding Match..." : "Find a Match"}
      </Button>
    </div>
  );
};
