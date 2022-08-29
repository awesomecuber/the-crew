import { Color, CommunicationToken, TaskToken } from "./header";
import { Card } from "./card";
import { Task } from "./task";
import { Communication } from "communication";

//these classes represent data that the backend receives.
//they are only used to parse the data and convert them to the other classes
//there should never be a reason to instantiate an object of any of these classes
//this is why the constructors force useless null values

export class CardData {
    color: Color;
    number: number;

    constructor() {
        this.color = Color.NULL;
        this.number = -1;
    }
}

export class TaskData {
    card: CardData;
    isComplete: boolean;
    token: TaskToken;

    constructor() {
        this.card = new CardData();
        this.isComplete = false;
        this.token = TaskToken.NULL;
    }
}

export class CommunicationData {
    card: CardData;
    token: CommunicationToken;

    constructor() {
        this.card = new CardData();
        this.token = CommunicationToken.Only;
    }
}

export function dataToCard(data: CardData): Card {
    return new Card(data.color, data.number);
}

export function dataToTask(data: TaskData): Task {
    return new Task(dataToCard(data.card), data.isComplete, data.token);
}

export function dataToCommunication(data: CommunicationData): Communication {
    return new Communication(dataToCard(data.card), data.token);
}
