import { Card } from "./card";
import { Task } from "./task";
import { StrippedGameState } from "./strippedGameState";

export interface ClientToServerEvents {
    ping: () => void;
    joinGame: (uuid: string) => void;
    playCard: (uuid: string, card: Card) => void;
    pickTask: (uuid: string, task: Task) => void;

    requestGameState: (uuid: string) => void;
}

export interface ServerToClientEvents {
    pong: () => void;
    update: (game: StrippedGameState) => void;

    error: (msg: string) => void;
}
