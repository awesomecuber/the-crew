import { GameState } from "./gameState";
import { TaskToken, makeDeck, Color } from "./header";
import { Card } from "./card";
import { Task } from "./task";

enum CommunicationRestriction {
    NO_TOKEN = -1,
    NO_RESTRICTION = 0,
    AFTER_ONE,
    AFTER_TWO,
    AFTER_THREE,
}

enum TaskSelectionStyle {
    NORMAL,
    COMMANDER_CHOICE,
    COMMANDER_CHOOSE_ONE,
}

enum GameModifiers {
    MUST_WIN_NONE,
    MUST_WIN_ONLY_ONE,
    MUST_WIN_LAST,
    MUST_WIN_FIRST,
    MUST_WIN_FIRST_AND_LAST,
    MUST_WIN_FIRST_FOUR,
    ONE_CARD_MUST_WIN,
    NO_NINE_MAY_WIN,
    EACH_ROCKET_WIN_TRICK,
    ROCKETS_IN_ORDER,
    RANDOM_DRAW,
    SWAP_TOKEN,
    MOVE_TOKEN,
    TRICKS_MUST_BE_SHARED,
    ALL_PINK_CARDS,
}

class Mission {
    //all relevant information about current state and game logic handled here
    game: GameState;

    //common mission modifiers, restricted communication and commander's choice task selection
    restriction: CommunicationRestriction;
    selection: TaskSelectionStyle;

    //contains random modifiers
    modifiers: GameModifiers[];

    constructor(
        taskCount: number = 0,
        tokens: TaskToken[] = [],
        restriction: CommunicationRestriction = CommunicationRestriction.NO_RESTRICTION,
        selection: TaskSelectionStyle = TaskSelectionStyle.NORMAL
    ) {
        //validate that there are enough tasks for the given tokens
        if (taskCount < tokens.length) {
            tokens = [];
        }

        //validate that we are not requesting more tasks than there are cards in the deck
        if (taskCount > 36) {
            taskCount = 36;
        }

        //first, we set up the tasks
        let deck = makeDeck();
        let tasks: Task[] = [];

        for (let i: number = 0; i < taskCount; i++) {
            //deterime what task token to give this next task
            let token: TaskToken | undefined = tokens.pop();
            if (token == undefined) {
                token = TaskToken.NO_TOKEN;
            }

            let card: Card = deck.pop()!;

            //if we picked a black card, redraw
            while (card.color == Color.Black) {
                card = deck.pop()!;
            }

            tasks.push(new Task(card, !token));
        }

        this.game = new GameState(tasks, this.validate);
        this.restriction = restriction;
        this.selection = selection;

        this.modifiers = [];
    }

    // this method validates a gamestate, checking to see if it satisfies all criteria of the mission
    validate(): boolean {
        return true;
    }
}

export const TEST_DEFAULT_MISSION = new Mission();
export const TEST_MISSION_TASKS = new Mission(4);
