import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./src/types";
import { GameState } from "./src/gameState";
import { Task } from "./src/task";
import { Card } from "./src/card";
import { Communication } from "./src/communication";
import { Color, Direction, GameError } from "./src/header";
import { StrippedGameState } from "./src/strippedData";
import { CardData, TaskData, CommunicationData, dataToCard, dataToTask, dataToCommunication } from "./src/data";

const PORT = 3000;

const io = new Server<ClientToServerEvents, ServerToClientEvents>(PORT, {
    serveClient: false,
    cors: {
        origin: "http://127.0.0.1:5173",
    },
});
console.log("WELCOME TO OCARINA OF TIME");

let startingTasks: Task[] = [new Task(new Card(Color.Blue, 3))];
// startingTasks = [];
let game = new GameState(startingTasks);

let uuidToDir: Record<string, Direction> = {};
let socketToDir: Record<string, Direction> = {};

io.on("connection", (socket) => {
    socket.on("ping", () => {
        console.log(uuidToDir);
        console.log("ping");
        socket.emit("pong");
    });

    socket.on("joinGame", (uuid: string) => {
        console.log("joinGame", uuid);

        if (uuid in uuidToDir) {
            socket.emit("error", "YOU'RE ALREADY IN BUDDY");
            return;
        }

        let num_players_joined = Object.keys(uuidToDir).length;

        if (num_players_joined >= 4) {
            socket.emit("error", "We are full.");
            return;
        }

        uuidToDir[uuid] = num_players_joined;
        socketToDir[socket.id] = num_players_joined;

        emitUpdateToAll();
    });

    socket.on("playCard", (uuid: string, data: CardData) => {
        console.log("playCard", uuid, data);

        if (!(uuid in uuidToDir)) {
            socket.emit("error", "who are you?");
        }

        let dir = uuidToDir[uuid];
        let card = dataToCard(data);

        if (game.update_playCard(dir, card) == GameError.SUCCESS) {
            emitUpdateToAll();
        } else {
            socket.emit("error", "gamestate error");
        }
    });

    socket.on("pickTask", (uuid: string, data: TaskData) => {
        console.log("pickTask", uuid, data);

        if (!(uuid in uuidToDir)) {
            socket.emit("error", "who are you?");
        }

        let dir = uuidToDir[uuid];
        let task = dataToTask(data);

        if (game.update_pickTask(dir, task) == GameError.SUCCESS) {
            emitUpdateToAll();
        } else {
            socket.emit("error", "gamestate error");
        }
    });

    socket.on("communicate", (uuid: string, data: CommunicationData) => {
        console.log("pickTask", uuid, data);

        if (!(uuid in uuidToDir)) {
            socket.emit("error", "who are you?");
        }

        let dir = uuidToDir[uuid];
        let communication = dataToCommunication(data);

        if (game.update_communicate(dir, communication) == GameError.SUCCESS) {
            emitUpdateToAll();
        } else {
            socket.emit("error", "gamestate error");
        }
    });

    socket.on("requestGameState", (uuid) => {
        console.log("requestGameState", uuid);

        if (!(uuid in uuidToDir)) {
            return;
        }

        console.log(socketToDir);

        let dir = uuidToDir[uuid];
        let strippedGame = new StrippedGameState(game, dir);

        if (!(socket.id in socketToDir)) {
            socketToDir[socket.id] = dir;
        }

        socket.emit("update", strippedGame);
    });
});

async function emitUpdateToAll() {
    const sockets = await io.fetchSockets();
    const socketIDs = sockets.map((socket) => socket.id);
    for (const socketID of socketIDs) {
        let strippedGame = new StrippedGameState(game, socketToDir[socketID]);
        io.to(socketID).emit("update", strippedGame);
    }
}
