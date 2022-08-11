export interface ClientToServerEvents {
  ping: () => void;
}

export interface ServerToClientEvents {
  pong: () => void;
}
