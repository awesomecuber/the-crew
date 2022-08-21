import { Color } from "./header";

export class Card {
    color: Color;
    number: number;

    constructor(color: Color, number: number) {
        this.color = color;
        this.number = number;
    }

    //returns true if the two cards are exactly the same
    equals(other: Card): boolean {
        return this.color == other.color && this.number == other.number;
    }

    //returns true if this card ranks higher than the other card
    //assumes that this card beats all cards of other suits
    //and loses to trump cards, or higher ranked cards of the same suit
    winsAgainst(other: Card) {
        if (this.color == other.color) {
            return this.number >= other.number;
        }

        return !(other.color == Color.Black);
    }

    cardToString(): string {
        switch (this.color) {
            case Color.Black:
                return "Blac " + this.number;
            case Color.Pink:
                return "Pink " + this.number;
            case Color.Green:
                return "Gree " + this.number;
            case Color.Blue:
                return "Blue " + this.number;
            case Color.Yellow:
                return "Yell " + this.number;
            case Color.NULL:
            default:
                return "NULL " + this.number;
        }
    }
}
