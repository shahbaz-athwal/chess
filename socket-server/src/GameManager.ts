import { Socket } from "socket.io";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

interface Player {
  socket: Socket;
  name: string;
}

export class GameManager {
  private games: Game[];
  private pendingPlayer: Player | null; // Update to store both socket and name
  private users: Player[];

  constructor() {
    this.games = [];
    this.users = [];
    this.pendingPlayer = null;
  }

  addUser(socket: Socket) {
    console.log("User Joined.");

    // Add the handler to capture the player's name when they initialize the game
    socket.on(INIT_GAME, (data: { name: string }) => {
      console.log(`Received INIT_GAME from ${data.name}.`);
      const player: Player = { socket, name: data.name };
      this.users.push(player); // Add the player to the list of users
      this.addHandler(player);

      if (this.pendingPlayer) {
        // If there is a pending player, start a game
        const game = new Game(this.pendingPlayer.socket, player.socket);
        console.log(`Game started between ${this.pendingPlayer.name} and ${player.name}.`);
        this.games.push(game);
        this.pendingPlayer = null; // Reset pending player
      } else {
        // If no pending player, make this player the pending player
        this.pendingPlayer = player;
        console.log(`${player.name} is waiting for another player.`);
      }

      socket.on("disconnect", () => {
        this.removeUser(socket);
      });
    });
  }

  removeUser(socket: Socket) {
    // Remove the user from the list
    this.users = this.users.filter((user) => user.socket !== socket);

    // If the user was waiting to start a game, clear pendingPlayer
    if (this.pendingPlayer?.socket === socket) {
      this.pendingPlayer = null;
      console.log("Pending user disconnected.");
    }

    // Optionally, handle removing the user from any active games
    this.games = this.games.filter(
      (game) => game.player1 !== socket && game.player2 !== socket
    );
  }

  private addHandler(player: Player) {
    player.socket.on(MOVE, (moveData) => {
      const game = this.games.find(
        (game) => game.player1 === player.socket || game.player2 === player.socket
      );
      if (game) {
        game.makeMove(player.socket, moveData);
      }
    });
  }
}
