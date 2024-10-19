import { Server } from "socket.io";
import { createServer } from "http";
import { GameManager } from "./GameManager";

const port = process.env.PORT || 8000;

const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let onlineCount = 0;

const gameManager = new GameManager();

io.on("connection", (socket) => {
  gameManager.addUser(socket);
  onlineCount += 1;
  socket.on("getOnlineCount", () => {
    io.emit("onlineCount", onlineCount);
  });
  io.emit("onlineCount", onlineCount);

  socket.on("disconnect", () => {
    gameManager.removeUser(socket);
    onlineCount -= 1;
    io.emit("onlineCount", onlineCount);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
