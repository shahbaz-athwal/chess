import { Socket } from "socket.io";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

export interface Player {
  socket: Socket;
  name: string;
}

export class GameManager {
  private games: Game[];
  private pendingPlayer: Player | null;
  private users: Player[];

  constructor() {
    this.games = [];
    this.users = [];
    this.pendingPlayer = null;
  }

  addUser(socket: Socket) {
    console.log("User Joined.");

    socket.on(INIT_GAME, (data: { name: string }) => {
      console.log(`Received INIT_GAME from ${data.name}.`);
      const player: Player = { socket, name: data.name };
      this.users.push(player);
      this.addHandler(player);

      if (this.pendingPlayer) {
        const game = new Game(this.pendingPlayer, player);
        console.log(`Game started between ${this.pendingPlayer.name} and ${player.name}.`);
        this.games.push(game);
        this.pendingPlayer = null;
      } else {
        this.pendingPlayer = player;
        console.log(`${player.name} is waiting for another player.`);
      }

      socket.on("disconnect", () => {
        this.removeUser(socket);
      });
    });
  }

  removeUser(socket: Socket) {
    this.users = this.users.filter((user) => user.socket !== socket);

    if (this.pendingPlayer?.socket === socket) {
      this.pendingPlayer = null;
      console.log("Pending user disconnected.");
    }

    this.games = this.games.filter(
      (game) => game.player1.socket !== socket && game.player2.socket !== socket
    );
  }

  private addHandler(player: Player) {
    player.socket.on(MOVE, (moveData) => {
      const game = this.games.find(
        (game) => game.player1.socket === player.socket || game.player2.socket === player.socket
      );
      if (game) {
        game.makeMove(player.socket, moveData);
      }
    });
  }
}
