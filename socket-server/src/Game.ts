import { BLACK, Chess, WHITE } from "chess.js";
import { Socket } from "socket.io";
import { GAME_OVER, MOVE, START_GAME, INVALID_MOVE } from "./messages"; // Add INVALID_MOVE event

export class Game {
  public player1: Socket;
  public player2: Socket;
  private board: Chess;

  constructor(player1: Socket, player2: Socket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();

    // Send start_game to both players with their assigned colors and initial board
    this.player1.emit(START_GAME, { color: "w", board: this.board.board(), turn: this.board.turn() });
    this.player2.emit(START_GAME, { color: "b", board: this.board.board(), turn: this.board.turn() });

    this.handleChat(player1, player2);
    this.handleChat(player2, player1);
  }

  handleChat(sender: Socket, receiver: Socket) {
    sender.on("chat", (message: {from: string, text: string}) => {
      receiver.emit("chat", { from: "Opponent", text: message.text });
    });
  }

  makeMove(
    socket: Socket,
    move: {
      from: string;
      to: string;
    }
  ) {
    // Ensure only the correct player makes the move
    if (this.board.turn() === "w" && socket !== this.player1) {
      socket.emit(INVALID_MOVE, { message: "It's not your turn!" });
      return;
    }

    if (this.board.turn() === "b" && socket !== this.player2) {
      socket.emit(INVALID_MOVE, { message: "It's not your turn!" });
      return;
    }

    // Attempt to make the move on the board
    try {
      this.board.move(move);
      console.log("MOVE:", move);
    } catch (error) {
      console.log(this.board.ascii());
      console.log("MOVE:", move);
      socket.emit(INVALID_MOVE, { message: "Invalid move!" });
      return;
    }

    const boardState = this.board.board();
    const turn = this.board.turn();  // Get the updated turn

    // Broadcast the updated board and turn to both players
    this.player1.emit(MOVE, { move, board: boardState, turn });
    this.player2.emit(MOVE, { move, board: boardState, turn });

    // Check if the game is over
    if (this.board.isGameOver()) {
      const winner = this.board.turn() === WHITE ? BLACK : WHITE;

      // Inform both players of game over
      this.player1.emit(GAME_OVER, { winner });
      this.player2.emit(GAME_OVER, { winner });

      return;
    }
  }
}
