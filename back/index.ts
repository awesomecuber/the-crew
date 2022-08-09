import { Server } from "socket.io";

const io = new Server(3000, {
    serveClient: false,
});

io.on("connection", (socket) => {
    socket.on("ping", () => {
        socket.emit("pong");
    });
});
