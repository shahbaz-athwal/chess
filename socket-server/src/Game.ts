import { BLACK, Chess, WHITE } from "chess.js";
import { Socket } from "socket.io";
import { GAME_OVER, INIT_GAME, MOVE, START_GAME } from "./messages";

export class Game {
  public player1: Socket;
  public player2: Socket;
  private board: Chess;
  private moves: string[];
  private startTime: Date;
  private moveCount = 0

  constructor(player1: Socket, player2: Socket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.moves = [];
    this.startTime = new Date();

    // Send init_game to both players
    this.player1.emit(START_GAME, { color: "white", startTime: this.startTime });
    this.player2.emit(START_GAME, { color: "black", startTime: this.startTime });
  }

  makeMove(
    socket: Socket,
    move: {
      from: string;
      to: string;
    }
  ) {
    if (this.board.turn() === "w" && socket !== this.player1) {
      return;
    }

    if (this.board.turn() === "b" && socket !== this.player2) {
      return;
    }

    try {
      this.board.move(move);
      this.moveCount++
      //   this.moves.push(move.from + move.to);

      // Broadcast the move to both players
      this.player1.emit(MOVE, move);
      this.player2.emit(MOVE, move);
    } catch (error) {
      return;
    }

    // Check if the game is over
    if (this.board.isGameOver()) {
      const winner = this.board.turn() === WHITE ? BLACK : WHITE;

      // Inform both players of game over
      this.player1.emit(GAME_OVER, {
        winner,
      });

      this.player2.emit(GAME_OVER, {
        winner,
      });

      return;
    }
  }
}
