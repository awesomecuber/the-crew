import { io, Socket } from "socket.io-client";
import type { Plugin } from "vue";
import { socketKey } from "../keys";
import type { ServerToClientEvents, ClientToServerEvents } from "../types";

const socketPlugin: Plugin = {
  install(app, { connection, options }) {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      connection,
      options
    );
    app.config.globalProperties.$socket = socket;

    app.provide(socketKey, socket);
  },
};

export default socketPlugin;
