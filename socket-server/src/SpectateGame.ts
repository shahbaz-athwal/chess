import type { Socket } from "socket.io";
import { Game } from "./Game";
import { GameEvents } from "./GameEvents";
import { GameStatus } from "./types";

interface Spectater {
  socket: Socket;
  gameId: string;
}

class SpectateGame {
  private spectators: Spectater[] = [];
  private static instance: SpectateGame | null = null;

  public static getInstance(): SpectateGame {
    if (!SpectateGame.instance) {
      SpectateGame.instance = new SpectateGame();
    }
    return SpectateGame.instance;
  }

  public addSpectator(socket: Socket, gameId: string, game: Game): void {
    this.spectators.push({ socket, gameId });

    const initialState = game.getGameData();

    GameEvents.emit(socket, "spectate_initial_state", initialState);

    // Setup disconnect handler
    socket.on("disconnect", () => {
      this.removeSpectator(socket);
    });
  }

  public removeSpectator(spectator: Socket): void {
    this.spectators = this.spectators.filter(
      (spectate) => spectate.socket !== spectator
    );
  }

  public broadcastGameState(
    gameId: string,
    gameState: { board: any; turn: any; status: GameStatus }
  ): void {
    const gameSpectators = this.spectators.filter(
      (spectator) => spectator.gameId === gameId
    );

    gameSpectators.forEach((spectator) => {
      GameEvents.emit(spectator.socket, "spectate_state_update", gameState);
    });
  }
}

export const spectateGame = SpectateGame.getInstance();
