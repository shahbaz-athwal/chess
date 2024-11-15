import { Server } from "socket.io";
import { createServer } from "http";
import { spectateGame } from "./SpectateGame";
import { gameManager } from "./GameManager";

class ChessServer {
  private io: Server;
  private onlineCount: number = 0;

  constructor() {
    const server = createServer();
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    this.setupSocketHandlers();

    const port = process.env.PORT || 8000;
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }

  private setupSocketHandlers(): void {
    this.io.on("connection", (socket) => {
      // Handle online count
      this.onlineCount++;
      this.broadcastOnlineCount();

      socket.on("init_game", (data: { name: string }) => {
        gameManager.addUser(socket, data);
      });

      socket.on("get_all_games", () => {
        const data = Array.from(gameManager.getGames().keys());
        socket.emit("all_games", data);
      });

      socket.on("get_online_count", () => {
        this.broadcastOnlineCount();
      });

      socket.on("spectate_game", (gameId: string) => {
        const game = gameManager.getGamebyId(gameId);
        if (game) {
          spectateGame.addSpectator(socket, gameId, game);
        }
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        gameManager.removeUser(socket);
        this.onlineCount--;
        this.broadcastOnlineCount();
      });
    });
  }

  private broadcastOnlineCount(): void {
    this.io.emit("online_count", this.onlineCount);
  }
}

// Start the server
new ChessServer();
