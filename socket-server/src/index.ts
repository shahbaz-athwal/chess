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

const gameManager = new GameManager();

io.on("connection", (socket) => {
  gameManager.addUser(socket);

  socket.on("disconnect", () => {
    gameManager.removeUser(socket);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
