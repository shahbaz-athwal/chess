import { Socket } from "socket.io";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

export class GameManager {
  private games: Game[];
  private pendingUser: Socket | null;
  private users: Socket[];

  constructor() {
    this.games = [];
    this.users = [];
    this.pendingUser = null;
  }

  addUser(socket: Socket) {
    console.log("User Joined.");
    this.users.push(socket);
    this.addHandler(socket);

    socket.on("disconnect", () => {
      this.removeUser(socket);
    });
  }

  removeUser(socket: Socket) {
    // Remove the user from the list
    this.users = this.users.filter(user => user !== socket);

    // If the user was waiting to start a game, clear pendingUser
    if (this.pendingUser === socket) {
      this.pendingUser = null;
      console.log("Pending user disconnected.");
    }

    // Optionally, handle removing the user from any active games
    this.games = this.games.filter(game => game.player1 !== socket && game.player2 !== socket);
  }

  private addHandler(socket: Socket) {
    socket.on(INIT_GAME, () => {
      console.log("Received INIT_GAME from a user.");
      if (this.pendingUser) {
        const game = new Game(this.pendingUser, socket);
        console.log("Game Started.");
        this.games.push(game);
        this.pendingUser = null;
      } else {
        this.pendingUser = socket;
        console.log("User is waiting for another player.");
      }
    });

    socket.on(MOVE, (moveData) => {
        const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
        if (game) {
            game.makeMove(socket, moveData);
            console.log("MOVE:", moveData);
      } else {
        console.log("No active game found for the user.");
      }
    });
  }
}
