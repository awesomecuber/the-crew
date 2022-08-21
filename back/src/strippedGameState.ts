import { Direction } from "./header";
import { Player } from "./player";
import { Task } from "./task";
import { Trick } from "./trick";
import { StrippedPlayer } from "./strippedPlayer";
import { GameState } from "./gameState";

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
    constructor(game: GameState, dir: Direction) {
        this.direction = dir;

        this.players = [];
        for (let i: number = 0; i < 4; i++) {
            if (i != this.direction) {
                this.players.push(new StrippedPlayer(game.players[i]));
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
