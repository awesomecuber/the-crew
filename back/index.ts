import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./src/types";
import { GameState } from "./src/gameState";
import { Task } from "./src/task";
import { Card } from "./src/card";
import { Color, Direction, GameError } from "./src/header";
import { StrippedGameState } from "./src/strippedGameState";

const PORT = 3000;

const io = new Server<ClientToServerEvents, ServerToClientEvents>(PORT, {
    serveClient: false,
    cors: {
        origin: "http://127.0.0.1:5173",
    },
});
console.log("WELCOME TO OCARINA OF TIME");

let startingTasks: Task[] = [new Task(new Card(Color.Blue, 3))];
startingTasks = [];
let game = new GameState(startingTasks);

io.on("connection", (socket) => {
    socket.on("ping", () => {
        socket.emit("pong");
    });

    socket.on("playCard", (dir: Direction, card: Card) => {
        if (game.update_playCard(dir, card) == GameError.SUCCESS) {
            let strippedGame: StrippedGameState = new StrippedGameState(game, dir);
            socket.emit("update", strippedGame);
        }
    });

    socket.on("pickTask", (dir: Direction, task: Task) => {
        if (game.update_pickTask(dir, task) == GameError.SUCCESS) {
            let strippedGame: StrippedGameState = new StrippedGameState(game, dir);
            socket.emit("update", strippedGame);
        }
    });
});
