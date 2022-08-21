import { Color, Direction, CommunicationToken, GameError } from "./header";
import { Card } from "./card";
import { Task } from "./task";
import { Communication } from "./communication";

export class Player {
    hand: Card[]; // the cards a player (still has) in their hand
    tasks: Task[]; // which tasks a player must complete
    communication: Communication | null; // what the player has communicated, NULL if haven't communicated yet

    // all players start with no tasks and the ability to communicate
    constructor() {
        this.hand = [];
        this.tasks = [];
        this.communication = null;
    }

    addTask(task: Task): void {
        this.tasks.push(task);
    }

    addCard(card: Card): void {
        this.hand.push(card);
    }

    removeCard(cardIndex: number): void {
        let temp = this.hand.splice(cardIndex);
        temp.shift();
        this.hand = this.hand.concat(temp);
    }

    handToString() {
        let str: string = "";

        for (let card of this.hand) {
            str += card.cardToString() + " ";
        }

        return str;
    }

    isVoid(color: Color) {
        for (let card of this.hand) {
            if (card.color == color) {
                return false;
            }
        }
        return true;
    }

    sortHand() {
        this.hand = this.hand.sort((a, b) => {
            if (a.color == b.color) {
                return b.number - a.number;
            } else return a.color - b.color;
        });
    }

    // this method sorts a players tasks into the order they must be completed in
    // this ensures that, if two tasks are completed on the same trick, they are processed in the correct order
    sortTasks() {
        this.tasks = this.tasks.sort((a, b) => {
            return a.token - b.token;
        });
    }
}
