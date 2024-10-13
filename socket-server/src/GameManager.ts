import { Socket } from "socket.io"
import { INIT_GAME, MOVE } from "./messages"
import { Game } from "./Game"

export class GameManager {
    private games: Game[]
    private pendingUser: Socket | null
    private users: Socket[]

     
    constructor() {
        this.games = []
        this.users = []
        this.pendingUser = null
    }

    addUser(socket: Socket) {
        this.users.push(socket)
        this.addHandler(socket)
    }

    removeUser(socket: Socket) {
        this.users = this.users.filter(user => user !== socket)
    }

    private addHandler(socket: Socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString())

            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    const game = new Game(this.pendingUser, socket)
                    this.games.push(game)
                    this.pendingUser = null
                } else {
                    this.pendingUser = socket
                }
            }

            if (message.type === MOVE) {
                
            }
        })
    }
}