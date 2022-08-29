import { Card } from "./card";

export enum Color {
    NULL = -1,
    Black,
    Pink,
    Yellow,
    Blue,
    Green,
}

export enum CommunicationToken {
    Low = -1,
    Only = 0,
    Hi = 1,
}

export enum Direction {
    NULL = -1,
    North,
    East,
    South,
    West,
}

export enum GameError {
    SUCCESS,
    NOT_IMPLEMENTED,
    WRONG_PHASE,
    NOT_PLAYER_TURN,
    TASK_NOT_AVAILABLE,
    CARD_NOT_HELD,
    CARD_ALREADY_PLAYED,
    REVOKE,
    TRICK_ALREADY_STARTED,
    ALREADY_COMMUNICATED, //this also handles cases where the player is not allowed to communicate
    BAD_TOKEN,
}

//the order of this enum is very important!
//the logic of the game forces tasks to be processed from low enum value to high enum value
export enum TaskToken {
    NULL = -1,
    NO_TOKEN = 0,
    ONE,
    TWO,
    THREE,
    FOUR,
    FIVE,
    ONE_ARROW = 101,
    TWO_ARROW,
    THREE_ARROW,
    FOUR_ARROW,
    FIVE_ARROW,
    OMEGA = 999,
}

//this card is used for cards that have not yet been played on tricks
export const BLANK_CARD = new Card(Color.NULL, -1);

//this is the black 4, for use in deciding who is the commander
export const BLACK_FOUR = new Card(Color.Black, 4);

export function makeDeck(): Card[] {
    let deck: Card[] = [];

    for (let i: number = 1; i < 10; i++) {
        let pink = new Card(Color.Pink, i);
        let yellow = new Card(Color.Yellow, i);
        let blue = new Card(Color.Blue, i);
        let green = new Card(Color.Green, i);

        deck.push(pink);
        deck.push(yellow);
        deck.push(blue);
        deck.push(green);
    }

    for (let i: number = 1; i < 5; i++) {
        let black = new Card(Color.Black, i);
        deck.push(black);
    }

    return deck;
}
