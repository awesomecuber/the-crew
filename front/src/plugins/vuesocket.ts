import { io } from "socket.io-client";

export default {
  install: (app, { connection, options }) => {
    const socket = io(connection, options);
  },
};
