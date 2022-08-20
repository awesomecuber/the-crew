import { Card } from "./card";
import { Task } from "./task";
import { Direction } from "./header";

export interface ClientToServerEvents {
    ping: () => void;
    playCard: (dir: Direction, card: Card) => void;
    pickTask: (dir: Direction, task: Task) => void;
}

export interface ServerToClientEvents {
    pong: () => void;
}
