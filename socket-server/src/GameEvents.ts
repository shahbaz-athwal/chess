import type { Socket } from "socket.io";
import { GameResult, GameState, Player } from "./types";
import { GAME_OVER, INVALID_MOVE, MOVE } from "./messages";

export class GameEvents {
  static emit(socket: Socket, event: string, data: any) {
    socket.emit(event, data);
  }

  static emitToPlayers(players: Player[], event: string, data: any) {
    players.forEach((player) => this.emit(player.socket, event, data));
  }

  static emitError(socket: Socket, message: string) {
    this.emit(socket, INVALID_MOVE, { message });
  }

  static emitGameOver(players: Player[], result: GameResult) {
    this.emitToPlayers(players, GAME_OVER, { result });
  }

  static emitGameState(players: Player[], gameState: Partial<GameState>) {
    this.emitToPlayers(players, MOVE, gameState);
  }
}
