import { Server } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "./src/types";

const PORT = 3000;

const io = new Server<ClientToServerEvents, ServerToClientEvents>(PORT, {
    serveClient: false,
    cors: {
        origin: "http://127.0.0.1:5173",
    },
});

io.on("connection", (socket) => {
    socket.on("ping", () => {
        socket.emit("pong");
    });
});
