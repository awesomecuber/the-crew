import { Direction, CommunicationToken } from "./header";
import { Player } from "./player";
import { Task } from "./task";
import { Trick } from "./trick";
import { GameState } from "./gameState";
import { Communication } from "./communication";
import { Card } from "card";

export class StrippedGameState {
    direction: Direction; // which player direction you are

    players: Array<StrippedPlayer | Player>; // array of all 4 players, but the 3 players that are not you have their hands stripped
    availableTasks: Task[]; // which tasks have not yet been selected
    trick: Trick; // the current trick

    commander: Direction; // who the commander is
    nextPlay: Direction; // who can next take an action

    isTaskSelection: boolean; // whether or not the game is in the task selection phase, or the playing phase

    // this constructor creates a gamestate for a new hand
    // tasks are currently fed into the constructor, so that they can be configured depending on the mission
    constructor(game: GameState, dir: Direction, hideCommunicationToken: boolean = false) {
        this.direction = dir;

        this.players = [];
        for (let i: number = 0; i < 4; i++) {
            if (i != this.direction) {
                this.players.push(new StrippedPlayer(game.players[i], hideCommunicationToken));
            } else {
                this.players.push(game.players[i]);
            }
        }

        this.availableTasks = game.availableTasks;
        this.trick = game.trick;

        this.commander = game.commander;
        this.nextPlay = game.nextPlay;
        this.isTaskSelection = game.isTaskSelection;
    }
}

export class StrippedPlayer {
    hand: number; // how many cards the player has in their hand
    tasks: Task[]; // which tasks a player must complete
    communication: StrippedCommunication | null; // what the player has communicated, NULL if haven't communicated yet

    constructor(player: Player, hideCommunicationToken: boolean = false) {
        this.hand = player.hand.length;
        this.tasks = player.tasks;

        if (player.communication == null) {
            this.communication = null;
        } else {
            this.communication = new StrippedCommunication(player.communication, hideCommunicationToken);
        }
    }
}

//this class allows for hiding tokens in certain missions
export class StrippedCommunication {
    card: Card;
    token: CommunicationToken | null;

    constructor(communication: Communication, hideCommunicationToken: boolean = false) {
        this.card = communication.card;

        if (hideCommunicationToken) {
            this.token = null;
        } else {
            this.token = communication.token;
        }
    }
}
