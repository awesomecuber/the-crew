import { Card } from "./card";

export class Task {
    card: Card; // the card that you must win to complete the task
    isComplete: boolean; // whether the task is completed

    constructor(card: Card) {
        this.card = card;
        this.isComplete = false;
    }

    equals(other: Task): boolean {
        return this.card.equals(other.card);
    }
}
