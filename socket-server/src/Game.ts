import { Chess, type Color } from "chess.js";
import { GameMove, GameResult, GameState, GameStatus, Player } from "./types";
import { GameEvents } from "./GameEvents";
import { START_GAME } from "./messages";
import { Socket } from "socket.io";
import { GameManager } from "./GameManager";

export class Game {
  public readonly id: string;
  private readonly state: GameState;
  public readonly startTime: number = Date.now();
  private timeLimit: number = 10 * 60 * 1000; // 10 minutes

  constructor(
    public readonly player1: Player,
    public readonly player2: Player,
    id: string
  ) {
    this.id = id;
    this.state = {
      board: new Chess(),
      status: "IN_PROGRESS",
      lastMoveTime: Date.now(),
      timeRemaining: {
        white: this.timeLimit,
        black: this.timeLimit,
      },
    };

    this.initializeGame();
  }

  private initializeGame() {
    this.player1.color = "w";
    this.player2.color = "b";

    this.setupChatHandlers();
    this.setupDisconnectHandlers();
    this.broadcastGameStart();
  }

  private setupChatHandlers() {
    const handleChat = (sender: Player, receiver: Player) => {
      sender.socket.on("chat", (message: { text: string }) => {
        GameEvents.emit(receiver.socket, "chat", {
          from: sender.name,
          text: message.text,
        });
      });
    };

    handleChat(this.player1, this.player2);
    handleChat(this.player2, this.player1);
  }

  private setupDisconnectHandlers() {
    const handleDisconnect = (player: Player) => {
      player.socket.on("disconnect", () => {
        this.handleGameEnd("PLAYER_EXIT");
      });
    };

    handleDisconnect(this.player1);
    handleDisconnect(this.player2);
  }

  // private updateGameTime() {
  //   const currentPlayer = this.state.board.turn() === "w" ? "white" : "black";
  //   this.state.timeRemaining[currentPlayer] -= 1000;

  //   if (this.state.timeRemaining[currentPlayer] <= 0) {
  //     this.handleGameEnd("TIME_UP");
  //   }

  //   GameEvents.emitToPlayers([this.player1, this.player2], GAME_TIME, {
  //     timeRemaining: this.state.timeRemaining,
  //   });
  // }

  private broadcastGameStart() {
    const initialState = {
      board: this.state.board.board(),
      turn: this.state.board.turn(),
      timeRemaining: this.state.timeRemaining,
    };

    GameEvents.emit(this.player1.socket, START_GAME, {
      color: this.player1.color,
      opponent: this.player2.name,
      ...initialState,
    });

    GameEvents.emit(this.player2.socket, START_GAME, {
      color: this.player2.color,
      opponent: this.player1.name,
      ...initialState,
    });
  }

  public makeMove(socket: Socket, move: GameMove): boolean {
    const player = [this.player1, this.player2].find(
      (player) => player.socket === socket
    );

    // Valid Turn
    if (!(this.state.board.turn() === player?.color)) {
      GameEvents.emitError(socket, "It's not your turn!!!");
      return false;
    }

    try {
      const moveResult = this.state.board.move(move);
      if (!moveResult) {
        GameEvents.emitError(socket, "Invalid move!");
        return false;
      }

      this.handleSuccessfulMove(move);
      return true;
    } catch (error) {
      console.error("Move error:", error);
      GameEvents.emitError(socket, "Invalid move!");
      return false;
    }
  }

  private handleSuccessfulMove(move: GameMove) {
    const currentTime = Date.now();
    const timeElapsed = currentTime - this.state.lastMoveTime;
    this.updateTimeAfterMove(timeElapsed);

    const gameState = {
      move,
      board: this.state.board.board(),
      turn: this.state.board.turn() as Color,
      timeRemaining: this.state.timeRemaining,
    };

    GameEvents.emitGameState([this.player1, this.player2], gameState);

    if (this.state.board.isGameOver()) {
      this.handleGameEnd("COMPLETED");
      GameManager.getInstance().removeGame(this);
    }
  }

  private updateTimeAfterMove(timeElapsed: number) {
    const previousPlayer = this.state.board.turn() === "w" ? "black" : "white";
    this.state.timeRemaining[previousPlayer] -= timeElapsed;
    this.state.timeRemaining[previousPlayer] +=
      // this.config.incrementSeconds * 1000;
      2 * 1000;
    this.state.lastMoveTime = Date.now();
  }

  private handleGameEnd(status: GameStatus) {
    this.state.status = status;
    const result = this.determineGameResult();
    if (result) {
      GameEvents.emitGameOver([this.player1, this.player2], result);
      GameManager.getInstance().removeGame(this);
    }
  }

  private determineGameResult(): GameResult | undefined {
    if (this.state.status === "TIME_UP") {
      return this.state.board.turn() === "w" ? "BLACK_WINS" : "WHITE_WINS";
    }

    if (this.state.status === "PLAYER_EXIT") {
      return undefined;
    }

    if (this.state.board.isCheckmate()) {
      return this.state.board.turn() === "w" ? "BLACK_WINS" : "WHITE_WINS";
    }

    if (this.state.board.isDraw()) {
      return "DRAW";
    }

    return undefined;
  }
}
