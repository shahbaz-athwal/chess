import { Socket } from "socket.io";
import { Game } from "./Game";
import { GameMove, Player } from "./types";
import { GAME_ALERT, INIT_GAME, MOVE } from "./messages";
import { GameEvents } from "./GameEvents";

export class GameManager {
  private games: Map<string, Game>;
  private pendingPlayers: Map<string, Player>;

  constructor() {
    this.games = new Map();
    this.pendingPlayers = new Map();
  }

  public addUser(socket: Socket): void {
    socket.on(INIT_GAME, (data: { name: string }) => {
      const player: Player = { socket, name: data.name };
      this.handleNewPlayer(player);
      this.setupDisconnectHandler(player);
    });
  }

  public removeUser(socket: Socket): void {
    this.pendingPlayers.delete(socket.id);
    this.removePlayerGames(socket);
  }

  private handleNewPlayer(player: Player): void {
    const pendingPlayer = this.findPendingPlayer();

    if (pendingPlayer) {
      this.startGame(pendingPlayer, player);
    } else {
      this.pendingPlayers.set(player.socket.id, player);
      GameEvents.emit(player.socket, GAME_ALERT, {
        message: "Waiting for opponent...",
      });
    }
  }

  private startGame(player1: Player, player2: Player): void {
    const game = new Game(player1, player2, {
      timeLimit: 10 * 60 * 1000,
      incrementSeconds: 10,
    });

    this.games.set(this.generateGameId(player1, player2), game);
    this.pendingPlayers.delete(player1.socket.id);

    this.setupMoveHandler(game);
  }

  private setupMoveHandler(game: Game): void {
    const handleMove = (socket: Socket) => {
      socket.on(MOVE, (moveData: GameMove) => {
        game.makeMove(socket, moveData);
      });
    };

    handleMove(game.player1.socket);
    handleMove(game.player2.socket);
  }

  private setupDisconnectHandler(player: Player): void {
    player.socket.on("disconnect", () => {
      this.pendingPlayers.delete(player.socket.id);
      this.removePlayerGames(player.socket);
    });
  }

  private findPendingPlayer(): Player | undefined {
    const [firstPending] = this.pendingPlayers.values();
    return firstPending;
  }

  private removePlayerGames(socket: Socket): void {
    for (const [gameId, game] of this.games.entries()) {
      if (game.player1.socket === socket || game.player2.socket === socket) {
        this.games.delete(gameId);
      }
    }
  }

  private generateGameId(player1: Player, player2: Player): string {
    return `${player1.socket.id}-${player2.socket.id}`;
  }
}
