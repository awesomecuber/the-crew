import { Color, Direction, CommunicationToken, GameError, makeDeck, BLACK_FOUR } from "./header";

import { Player } from "./player";
import { Task } from "./task";
import { Card } from "./card";
import { Trick } from "./trick";
import { Communication } from "./communication";

export class GameState {
    players: Player[]; // the 4 players
    availableTasks: Task[]; // which tasks have not yet been selected
    trick: Trick; // the current trick
    tricknum: number; // how many tricks have been played
    //history : Trick[];

    commander: Direction; // who the commander is
    nextPlay: Direction; // who can next take an action

    isTaskSelection: boolean; // whether or not the game is in the task selection phase, or the playing phase

    // this constructor creates a gamestate for a new hand
    // tasks are currently fed into the constructor, so that they can be configured depending on the mission
    constructor(tasks: Task[]) {
        //first, we initialize all the variables

        this.players = [];
        this.availableTasks = tasks;

        this.isTaskSelection = true;
        this.commander = Direction.NULL;
        this.nextPlay = Direction.NULL;

        //now, we add four players
        for (let i: number = 0; i < 4; i++) {
            let temp = new Player();
            this.players.push(temp);
        }

        //now we deal hands to the players
        this.dealHands();

        //we have to check who has the black 4
        for (let i = 0; i < this.players.length; i++) {
            for (const card of this.players[i].hand) {
                if (card.equals(BLACK_FOUR)) {
                    this.commander = i;
                    this.nextPlay = i;
                    break;
                }
            }
            if (this.commander != Direction.NULL) {
                break;
            }
        }

        //the commander leads the first trick
        this.trick = new Trick(this.commander);
        this.tricknum = 0;

        //finally, if there are no tasks, immediately begin the play phase
        if (this.availableTasks.length <= 0) {
            this.startPlay();
        }
    }

    removeTask(taskIndex: number) {
        let temp = this.availableTasks.splice(taskIndex);
        temp.shift();
        this.availableTasks = this.availableTasks.concat(temp);
    }

    //this method gives 10 card hands to each player
    dealHands(): void {
        //first we must make and shuffle the deck
        let deck = makeDeck();
        deck = deck.sort(() => Math.random() - 0.5);

        //now, add 10 cards to each players hand
        for (let i: number = 0; i < this.players.length; i++) {
            for (let j: number = 0; j < 10; j++) {
                this.players[i].addCard(deck.pop()!);
            }
            this.players[i].sortHand();
        }
    }

    //
    update_playCard(dir: Direction, playedCard: Card): GameError {
        //make sure it is the playing phase
        if (this.isTaskSelection) {
            console.log("it is not the playing phase");
            return GameError.WRONG_PHASE;
        }

        //now make sure that it is actually this player's turn
        if (this.nextPlay != dir) {
            console.log("it is not your turn to play");
            return GameError.NOT_PLAYER_TURN;
        }

        //let's make sure the player is following suit
        if (
            this.trick.color != Color.NULL &&
            this.trick.color != playedCard.color &&
            !this.players[dir].isVoid(this.trick.color)
        ) {
            console.log("you didn't follow suit");
            return GameError.REVOKE;
        }

        //lets make sure the player actually has the card in their hand
        let cardIndex: number = -1;
        for (let i: number = 0; i < 10; i++) {
            if (playedCard.equals(this.players[dir].hand[i])) {
                cardIndex = i;
                break;
            }
        }

        if (cardIndex == -1) {
            console.log("you don't have that card");
            return GameError.CARD_NOT_HELD;
        }

        // now we need to add a card to the trick
        let returnValue: GameError = this.trick.addCard(dir, playedCard);

        if (returnValue != GameError.SUCCESS) {
            return returnValue;
        }

        // we need to remove the card from the players hand
        this.players[dir].removeCard(cardIndex);

        //figure out who is next to play
        this.nextPlay = (this.nextPlay + 1) % 4;

        // if the trick is complete, we have to make a new trick
        if (this.trick.winner != Direction.NULL) {
            // check if any tasks were completed
            for (let task of this.players[this.trick.winner].tasks) {
                for (let card of this.trick.cards) {
                    if (task.card.equals(card)) {
                        task.isComplete = true;
                    }
                }
            }

            this.nextPlay = this.trick.winner;
            this.tricknum += 1;
            this.trick = new Trick(this.nextPlay);

            if (this.tricknum == 10) {
                this.terminate();
            }
        }

        return GameError.SUCCESS;
    }

    update_pickTask(dir: Direction, selectedTask: Task): GameError {
        //make sure that it is the picking phase
        if (!this.isTaskSelection) {
            console.log("it is not the task selection phase");
            return GameError.WRONG_PHASE;
        }

        //make sure that it is the right players turn
        if (this.nextPlay != dir) {
            console.log("it is not your turn");
            return GameError.NOT_PLAYER_TURN;
        }

        //make sure the task is actually available
        let taskIndex: number = -1;
        for (let i: number = 0; i < this.availableTasks.length; i++) {
            if (selectedTask.equals(this.availableTasks[i])) {
                taskIndex = i;
                break;
            }
        }

        if (taskIndex == -1) {
            console.log("that is not one of the tasks");
            return GameError.TASK_NOT_AVAILABLE;
        }

        //the right player picked the right task in the picking phase.  now we must give them the task, and make it the next player's turn
        this.removeTask(taskIndex);

        this.players[this.nextPlay].addTask(selectedTask);
        this.nextPlay = (this.nextPlay + 1) % 4;

        //if that was the last task, the playing phase begins!
        if (this.availableTasks.length <= 0) {
            this.startPlay();
        }

        return GameError.SUCCESS;
    }

    communicate(dir: Direction, communication: Communication): GameError {
        return GameError.NOT_IMPLEMENTED;
    }

    terminate(): boolean {
        //lets see if we won!

        for (let player of this.players) {
            for (let task of player.tasks) {
                if (!task.isComplete) {
                    console.log("YOU LOSE!!!");
                    return false;
                }
            }
        }

        console.log("YOU WIN!!!");
        return true;
    }

    startPlay() {
        this.nextPlay = this.commander;
        this.isTaskSelection = false;
    }
}