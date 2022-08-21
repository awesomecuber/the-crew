import { Card } from "./card";
import { TaskToken } from "./header";

export class Task {
    card: Card; // the card that you must win to complete the task
    isComplete: boolean; // whether the task is completed

    token: TaskToken; // the task token applied to the card

    constructor(card: Card, token: TaskToken = TaskToken.NO_TOKEN) {
        this.card = card;
        this.isComplete = false;
        this.token = token;
    }

    equals(other: Task): boolean {
        return this.card.equals(other.card);
    }
}
