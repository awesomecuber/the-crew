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

let uuidToDir: Record<string, Direction> = {};

io.on("connection", (socket) => {
    socket.on("ping", () => {
        console.log("ping");
        socket.emit("pong");
    });

    socket.on("joinGame", (uuid: string) => {
        console.log("joinGame", uuid);

        if (uuid in uuidToDir) {
            socket.emit("error", "YOU'RE ALREADY IN BUDDY");
            return;
        }

        if (game.players.length > 4) {
            socket.emit("error", "We are full.");
            return;
        }

        uuidToDir[uuid] = game.players.length;

        let dir = uuidToDir[uuid];
        let strippedGame = new StrippedGameState(game, dir);
        socket.emit("update", strippedGame);
    });

    socket.on("playCard", (uuid: string, card: Card) => {
        console.log("playCard", uuid, card);

        if (!(uuid in uuidToDir)) {
            socket.emit("error", "who are you?");
        }

        let dir = uuidToDir[uuid];
        if (game.update_playCard(dir, card) == GameError.SUCCESS) {
            let strippedGame = new StrippedGameState(game, dir);
            socket.emit("update", strippedGame);
        } else {
            socket.emit("error", "gamestate error");
        }
    });

    socket.on("pickTask", (uuid: string, task: Task) => {
        console.log("pickTask", uuid, task);

        if (!(uuid in uuidToDir)) {
            socket.emit("error", "who are you?");
        }

        let dir = uuidToDir[uuid];
        if (game.update_pickTask(dir, task) == GameError.SUCCESS) {
            let strippedGame = new StrippedGameState(game, dir);
            socket.emit("update", strippedGame);
        } else {
            socket.emit("error", "gamestate error");
        }
    });

    socket.on("requestGameState", (uuid) => {
        console.log("requestGameState", uuid);

        if (!(uuid in uuidToDir)) {
            return;
        }

        let dir = uuidToDir[uuid];
        let strippedGame = new StrippedGameState(game, dir);
        socket.emit("update", strippedGame);
    });
});
