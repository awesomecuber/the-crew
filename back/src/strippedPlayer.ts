import { Player } from "./player";

import { Task } from "./task";
import { Communication } from "./communication";

export class StrippedPlayer {
    hand: number; // how many cards the player has in their hand
    tasks: Task[]; // which tasks a player must complete
    communication: Communication | null; // what the player has communicated, NULL if haven't communicated yet

    constructor(player: Player) {
        this.hand = player.hand.length;
        this.tasks = player.tasks;
        this.communication = player.communication;
    }
}
