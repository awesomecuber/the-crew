import { Color, Direction, CommunicationToken, TaskToken, GameError, makeDeck, BLACK_FOUR } from "./header";

import { Player } from "./player";
import { Task } from "./task";
import { Card } from "./card";
import { Trick } from "./trick";
import { Communication } from "./communication";

export class GameState {
    players: Player[]; // the 4 players

    availableTasks: Task[]; // which tasks have not yet been selected
    completedTasks: Task[]; // the tasks completed so far IN ORDER

    trick: Trick; // the current trick
    tricknum: number; // how many tricks have been played
    history: Trick[];

    commander: Direction; // who the commander is
    nextPlay: Direction; // who can next take an action

    isTaskSelection: boolean; // whether or not the game is in the task selection phase, or the playing phase

    validateFunction: (() => boolean) | null = null;

    // this constructor creates a gamestate for a new hand
    // tasks are currently fed into the constructor, so that they can be configured depending on the mission
    constructor(tasks: Task[] = [], validateFunction: (() => boolean) | null = null) {
        //first, we initialize all the variables

        this.players = [];
        this.availableTasks = tasks;
        this.completedTasks = [];

        this.isTaskSelection = true;
        this.commander = Direction.NULL;
        this.nextPlay = Direction.NULL;

        this.validateFunction = validateFunction;

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
        this.history = [];

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

        //now, add 10 cards to each players hand
        for (let i: number = 0; i < this.players.length; i++) {
            for (let j: number = 0; j < 10; j++) {
                this.players[i].addCard(deck.pop()!);
            }
            this.players[i].sortHand();
        }
    }

    tasksToString() {
        let str: string = "";
        let tempTasks: Task[] = this.completedTasks;
        if (this.isTaskSelection) {
            tempTasks = this.availableTasks;
        }
        for (let task of tempTasks) {
            str += task.card.cardToString() + " ";
        }

        return str;
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
                        this.completedTasks.push(task);
                    }
                }
            }

            for (let i = 0; i < 4; i++) {
                for (let task of this.players[i].tasks) {
                    for (let card of this.trick.cards) {
                        if (task.card.equals(card)) {
                            if (this.trick.winner == i) {
                                task.isComplete = true;
                                this.completedTasks.push(task);
                            } else {
                                this.lose();
                            }
                        }
                    }
                }
            }

            this.nextPlay = this.trick.winner;
            this.tricknum += 1;
            this.history.push(this.trick);
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

        //the right player picked the right task in the picking phase
        //now we must give them the task, and make it the next player's turn
        this.removeTask(taskIndex);

        this.players[this.nextPlay].addTask(selectedTask);
        this.nextPlay = (this.nextPlay + 1) % 4;

        //if that was the last task, the playing phase begins!
        if (this.availableTasks.length <= 0) {
            this.startPlay();
        }

        return GameError.SUCCESS;
    }

    update_communicate(dir: Direction, communication: Communication): GameError {
        //make sure it is the playing phase
        if (this.isTaskSelection) {
            console.log("it is not the playing phase");
            return GameError.WRONG_PHASE;
        }

        //make sure it is the beginning of a trick
        if (this.trick.color != Color.NULL) {
            console.log("you can only communicate before the start of a trick");
            return GameError.TRICK_ALREADY_STARTED;
        }

        //make sure the player has not already communicated
        if (this.players[dir].communication != null) {
            console.log("you cannot communicate right now");
            return GameError.ALREADY_COMMUNICATED;
        }

        //make sure the player has the card they are trying to communicate
        //also, make sure that the token they have chosen to communicate is legitimate
        let cardIndex: number = -1;
        for (let i: number = 0; i < 10; i++) {
            //if this runs, they have the right card
            if (communication.card.equals(this.players[dir].hand[i])) {
                cardIndex = i;
                break;
            }
            //if it isn't equal, make sure it isn't violating the token
            else if (communication.card.color == this.players[dir].hand[i].color) {
                switch (communication.token) {
                    case CommunicationToken.Hi:
                        if (communication.card.compare(this.players[dir].hand[i]) >= 0) {
                            console.log("that is not your highest card");
                            return GameError.BAD_TOKEN;
                        }
                        break;
                    case CommunicationToken.Low:
                        if (communication.card.compare(this.players[dir].hand[i]) <= 0) {
                            console.log("that is not your lowest card");
                            return GameError.BAD_TOKEN;
                        }
                        break;
                    case CommunicationToken.Only:
                        console.log("that is not your only card");
                        return GameError.BAD_TOKEN;
                }
            }
        }

        if (cardIndex == -1) {
            console.log("you don't have that card");
            return GameError.CARD_NOT_HELD;
        }

        //if we made it this far, it is a legal communication
        this.players[dir].communication = communication;
        return GameError.SUCCESS;
    }

    //this method is called when the game ends, to check to see if the mission succeeded or failed
    terminate() {
        //first, we have each player validate whether they completed all of their tasks
        for (let player of this.players) {
            for (let task of player.tasks) {
                if (!task.isComplete) {
                    this.lose();
                    return;
                }
            }
        }

        //next, we ourselves check to make sure the tasks were completed in the proper order
        if (!this.validateTasks()) {
            this.lose();
            return;
        }

        //if we are in a mission, we have to call the mission's validate function!
        if (this.validateFunction != null && !this.validateFunction()) {
            this.lose();
            return;
        }

        this.win();
    }

    //runs whatever necessary when the team wins a mission
    win(): void {
        console.log("YOU WIN!!");
    }

    //runs whatever necessary when the team loses a mission
    lose(): void {
        console.log("YOU LOSE!!!");

        //currently, we remove all players hands so players cannot continue playing
        for (let player of this.players) {
            player.hand = [];
        }
    }

    //this method ensures that the tasks were completed in the proper order
    validateTasks(): boolean {
        let prevToken: TaskToken = TaskToken.NULL; // the task token of the previous task completed
        let prevArrow: TaskToken = TaskToken.NULL; // the previous arrow task completed

        for (let task of this.completedTasks) {
            //if this is the first task completed, we must initialize the prevToken
            if (prevToken == TaskToken.NULL) {
                prevToken = task.token;
                continue;
            }

            //if this code runs, it means OMEGA was not the last task completed!
            if (prevToken == TaskToken.OMEGA) {
                return false;
            }

            switch (task.token) {
                //this switch only runs after the first task, so if we see a ONE we failed
                case TaskToken.ONE:
                    return false;

                //make sure that the previous task was the previous number
                case TaskToken.TWO:
                case TaskToken.THREE:
                case TaskToken.FOUR:
                case TaskToken.FIVE:
                    if (prevToken != task.token - 1) {
                        return false;
                    }
                    break;

                //if we see a one arrow, we must update the prevArrow
                case TaskToken.ONE_ARROW:
                    prevArrow = TaskToken.ONE_ARROW;
                    break;

                //make sure that the previous arrow task completed was actually the previous arrow
                case TaskToken.TWO_ARROW:
                case TaskToken.THREE_ARROW:
                case TaskToken.FOUR_ARROW:
                case TaskToken.FIVE_ARROW:
                    if (prevArrow != task.token - 1) {
                        return false;
                    }
                    prevArrow = task.token;
                    break;
            }

            //if the task had no token, we don't need any logic from the above switch
            //if the task had the omega token, then we will set the prevToken as omega
            //    and fail if another iteration of the loop begins

            prevToken = task.token;
        }

        //we did it!  all conditions satisfied
        return true;
    }

    startPlay() {
        this.nextPlay = this.commander;
        this.isTaskSelection = false;

        for (let player of this.players) {
            player.sortTasks();
        }
    }
}
