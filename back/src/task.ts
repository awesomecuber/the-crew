import { Card } from "./card";
import { TaskToken } from "./header";

export class Task {
    card: Card; // the card that you must win to complete the task
    isComplete: boolean; // whether the task is completed

    token: TaskToken; // the task token applied to the card

    constructor(card: Card, isComplete: boolean = false, token: TaskToken = TaskToken.NO_TOKEN) {
        this.card = card;
        this.isComplete = isComplete;
        this.token = token;
    }

    equals(other: Task): boolean {
        return this.card.equals(other.card);
    }

    compare(other: Task): number {
        if (this.token == other.token) {
            return this.card.compare(other.card);
        } else {
            return this.token - other.token;
        }
    }
}
