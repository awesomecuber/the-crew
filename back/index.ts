import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./src/types";
import { GameState } from "./src/gameState";
import { Task } from "./src/task";
import { Card } from "./src/card";
import { Color, Direction } from "./src/header";

const PORT = 3000;

const io = new Server<ClientToServerEvents, ServerToClientEvents>(PORT, {
    serveClient: false,
    cors: {
        origin: "http://127.0.0.1:5173",
    },
});

let startingTasks: Task[] = [new Task(new Card(Color.Blue, 3))];
startingTasks = [];
let game = new GameState(startingTasks);

io.on("connection", (socket) => {
    socket.on("ping", () => {
        socket.emit("pong");
    });

    socket.on("playCard", (color, number) => {
        game.update_playCard(color, number);
    });
});
