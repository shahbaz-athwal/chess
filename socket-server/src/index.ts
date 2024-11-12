import { Server } from "socket.io";
import { createServer } from "http";
import { GameManager } from "./GameManager";
import { SpectateGame } from "./SpectateGame";

class ChessServer {
  private io: Server;
  private gameManager: GameManager;
  private onlineCount: number = 0;

  constructor() {
    const server = createServer();
    this.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    this.gameManager = GameManager.getInstance();
    this.setupSocketHandlers();

    const port = process.env.PORT || 8000;
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }

  private setupSocketHandlers(): void {
    this.io.on("connection", (socket) => {
      // Add user to game manager
      this.gameManager.addUser(socket);

      // Handle online count
      this.onlineCount++;
      this.broadcastOnlineCount();

      // Handle disconnect
      socket.on("disconnect", () => {
        this.gameManager.removeUser(socket);
        this.onlineCount--;
        this.broadcastOnlineCount();
      });

      socket.on("get_all_games", () => {
        const data = Array.from(this.gameManager.getGames().keys());
        socket.emit("allGames", data);
      });

      socket.on("get_online_count", () => {
        this.broadcastOnlineCount();
      });

      socket.on("spectate_game", (gameId: string) => {
        const game = this.gameManager.getGames().get(gameId);
        if (game) {
          SpectateGame.getInstance().addSpectator(socket, gameId, game);
        }
      });
    });
  }

  private broadcastOnlineCount(): void {
    this.io.emit("online_count", this.onlineCount);
  }
}

// Start the server
new ChessServer();
