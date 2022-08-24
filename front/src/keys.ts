import type { Socket } from "socket.io-client";
import type { InjectionKey } from "vue";
import type { ServerToClientEvents, ClientToServerEvents } from "back/types";

export const socketKey = Symbol() as InjectionKey<
  Socket<ServerToClientEvents, ClientToServerEvents>
>;
