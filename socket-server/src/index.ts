import { Server } from "socket.io";
import { GameManager } from "./GameManager";

const io = new Server();

const gameManager = new GameManager();

io.on("connection", (socket) => {
  gameManager.addUser(socket);

  socket.on("disconnect", () => {
    gameManager.removeUser(socket);
  });
});

io.listen(3000);
