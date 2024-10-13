import { Socket } from "socket.io";

export class Game {
    private player1: Socket
    private player2: Socket
    private board: string
    private moves: string[]
    private startTime: Date


    constructor(player1: Socket, player2: Socket) {
        this.player1 = player1
        this.player2 = player2
        this.board = ""
        this.moves = []
        this.startTime = new Date()
    }
}