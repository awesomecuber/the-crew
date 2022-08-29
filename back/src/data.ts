import { Color, TaskToken } from "./header";
import { Card } from "./card";
import { Task } from "./task";

export class CardData {
    color: Color;
    number: number;

    constructor(card: Card) {
        this.color = card.color;
        this.number = card.number;
    }
}

export class TaskData {
    card: CardData;
    isComplete: boolean;
    token: TaskToken;

    constructor(task: Task) {
        this.card = task.card;
        this.isComplete = task.isComplete;
        this.token = task.token;
    }
}

export function dataToCard(data: CardData): Card {
    return new Card(data.color, data.number);
}

export function dataToTask(data: TaskData): Task {
    return new Task(dataToCard(data.card), data.isComplete, data.token);
}
