import {
    Color,
    Direction,
    CommunicationToken,
    GameError,
    BLANK_CARD,
} from "./header";
import { Card } from "./card";

export class Communication {
    card: Card; // the card communicated
    token: CommunicationToken; // whether it is your highest, lowest, or only

    constructor(card: Card, token: CommunicationToken) {
        this.card = card;
        this.token = token;
    }
}
