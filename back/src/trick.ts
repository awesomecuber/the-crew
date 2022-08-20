import {
    Color,
    Direction,
    CommunicationToken,
    GameError,
    BLANK_CARD,
} from "./header";
import { Card } from "./card";

export class Trick {
    cards: Card[]; // what cards have been played on this trick
    color: Color; // what is the suit of the trick
    lead: Direction; // who initially lead the trick (NOT WHO IS NEXT TO PLAY)
    winner: Direction; // who won the trick

    constructor(lead: Direction) {
        this.cards = [BLANK_CARD, BLANK_CARD, BLANK_CARD, BLANK_CARD];
        this.lead = lead;
        this.color = Color.NULL;
        this.winner = Direction.NULL;
    }

    trickToString(): string {
        let str: string = "";

        for (let card of this.cards) {
            str += card.cardToString() + " ";
        }

        return this.lead + " lead: " + str;
    }

    //adds a card to the trick
    addCard(dir: Direction, playedCard: Card): GameError {
        if (this.cards[dir] != BLANK_CARD) {
            return GameError.CARD_ALREADY_PLAYED;
        }

        this.cards[dir] = playedCard;

        //if this is the first card, then we have to set the suit of the trick!
        if (this.color == Color.NULL) {
            this.color = playedCard.color;
        }

        //now that we have added a card, we have to check if the trick is over:
        for (let card of this.cards) {
            if (card.equals(BLANK_CARD)) {
                return GameError.SUCCESS;
            }
        }

        //all cards have been played!  we have to see who won the trick now
        this.findWinner();
        return GameError.SUCCESS;
    }

    //figures out the winner of the trick
    findWinner() {
        let currWinner: Direction = this.lead;

        for (let i: number = 0; i < 4; i++) {
            if (this.cards[i].winsAgainst(this.cards[currWinner])) {
                currWinner = i;
            }
        }
        this.winner = currWinner;
    }
}
