import { Server } from "socket.io";
import { createServer } from "http";
import { GameManager } from "./GameManager";

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

    this.gameManager = new GameManager();
    this.setupSocketHandlers();

    const port = process.env.PORT || 8800;
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

      // Handle online count requests
      socket.on("getOnlineCount", () => {
        this.broadcastOnlineCount();
      });
    });
  }

  private broadcastOnlineCount(): void {
    this.io.emit("onlineCount", this.onlineCount);
  }
}

// Start the server
new ChessServer();
