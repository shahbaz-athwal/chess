import { Socket } from "socket.io";
import { Game } from "./Game";
import { GameMove, Player } from "./types";
import { GAME_ALERT, INIT_GAME, MOVE } from "./messages";
import { GameEvents } from "./GameEvents";

export class GameManager {
  private static instance: GameManager | null = null;
  private games: Map<string, Game>;
  private pendingPlayer: Player | null = null;

  private constructor() {
    this.games = new Map();
  }

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  public addUser(socket: Socket): void {
    socket.on(INIT_GAME, (data: { name: string }) => {
      const player: Player = { socket, name: data.name };
      this.handleNewPlayer(player);
      this.setupDisconnectHandler(player);
    });
  }

  public removeUser(socket: Socket): void {
    this.pendingPlayer = null;
    this.removePlayerGames(socket);
  }

  private handleNewPlayer(player: Player): void {
    if (this.pendingPlayer) {
      this.startGame(this.pendingPlayer, player);
    } else {
      this.pendingPlayer = player;
      // GameEvents.emit(player.socket, GAME_ALERT, {
      //   message: "Waiting for opponent...",
      // });
    }
  }

  private startGame(player1: Player, player2: Player): void {
    try {
      const gameId = this.generateGameId(player1, player2);
      
      // Check if game already exists
      if (this.games.has(gameId)) {
        throw new Error('Game already exists');
      }

      const game = new Game(player1, player2, {
        timeLimit: 10 * 60 * 1000, // 10 minutes
        // incrementSeconds: 10,
      });

      this.games.set(gameId, game);
      this.pendingPlayer = null;
      
      this.setupMoveHandler(game);
      
      console.log(`New game started: ${gameId}`);
      console.log('Active games:', this.games.size);
    } catch (error) {
      console.error('Error starting game:', error);
      // GameEvents.emit(player1.socket, GAME_ALERT, {
      //   message: "Error starting game",
      // });
      // GameEvents.emit(player2.socket, GAME_ALERT, {
      //   message: "Error starting game",
      // });
    }
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
      this.pendingPlayer = null;
      this.removePlayerGames(player.socket);
      console.log(`Player ${player.name} disconnected`);
      console.log('Active games:', this.games.size);
    });
  }

  private removePlayerGames(socket: Socket): void {
    for (const [gameId, game] of this.games.entries()) {
      if (game.player1.socket === socket || game.player2.socket === socket) {
        this.games.delete(gameId);
      }
    }
  }

  private generateGameId(player1: Player, player2: Player): string {
    // Sort names to ensure consistent ID regardless of player order
    const names = [player1.name, player2.name].sort();
    return `${names[0]}<->${names[1]}`;
  }

  public getGames() {
    return this.games;
  }
}