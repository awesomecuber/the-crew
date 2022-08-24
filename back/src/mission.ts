import { GameState } from "./gameState";
import { TaskToken } from "./header";

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
        //currently, no tasks
        this.game = new GameState([]);
        this.restriction = restriction;
        this.selection = selection;

        this.modifiers = [];
    }

    // this method validates a gamestate, checking to see if it satisfies all criteria of the mission
    validate(): boolean {
        return false;
    }
}

export const TEST_DEFAULT_MISSION = new Mission();
