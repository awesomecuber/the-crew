import { CardData, TaskData } from "./data";
import { Communication } from "./communication";
import { StrippedGameState } from "./strippedData";

export interface ClientToServerEvents {
    ping: () => void;
    joinGame: (uuid: string) => void;
    playCard: (uuid: string, data: CardData) => void;
    pickTask: (uuid: string, data: TaskData) => void;
    //currently, communication has no methods.  so no data object rn.  add later if needed.
    communicate: (uuid: string, data: Communication) => void;

    requestGameState: (uuid: string) => void;
}

export interface ServerToClientEvents {
    pong: () => void;
    update: (game: StrippedGameState) => void;

    error: (msg: string) => void;
}
