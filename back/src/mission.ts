import { GameState } from "./gameState";
import { TaskToken, makeDeck, Color } from "./header";
import { Card } from "./card";
import { Task } from "./task";
import { Communication } from "communication";

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
    COMMANDER_START_AND_END,
    ONE_PLAYER_NO_COMMUNICATION,
    ONE_CARD_MUST_WIN,
    NO_NINE_MAY_WIN,
    EACH_ROCKET_WIN_TRICK,
    ROCKETS_IN_ORDER,
    RANDOM_DRAW,
    SWAP_TOKEN,
    MOVE_TOKEN,
    TRICKS_MUST_BE_SHARED,
    ALL_PINK_CARDS,
    OMEGA_IN_LAST_TRICK,
}

class Mission {
    //all relevant information about current state and game logic handled here
    game: GameState;

    //common mission modifiers, restricted communication and commander's choice task selection
    restriction: CommunicationRestriction;
    selection: TaskSelectionStyle;

    //contains random modifiers
    modifiers: GameModifiers[];

    constructor(taskCount: number = 0, tokens: TaskToken[] = [], restriction: CommunicationRestriction = CommunicationRestriction.NO_RESTRICTION, selection: TaskSelectionStyle = TaskSelectionStyle.NORMAL, modifiers: GameModifiers[] = []) {
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

export const MISSION_01 = new Mission(1);
export const MISSION_02 = new Mission(2);
export const MISSION_03 = new Mission(2, [TaskToken.ONE, TaskToken.TWO]);
export const MISSION_04 = new Mission(3);
//export const MISSION_05 = new Mission(0, [], undefined, TaskSelectionStyle.COMMANDER_CHOOSE_ONE, [GameModifier.MUST_WIN_NONE]);
//export const MISSION_06 = new Mission(3, [TaskToken.ONE_ARROW, TaskToken.TWO_ARROW], CommunicationRestriction.NO_TOKEN);
export const MISSION_07 = new Mission(3, [TaskToken.OMEGA]);
export const MISSION_08 = new Mission(3, [TaskToken.ONE, TaskToken.TWO, TaskToken.THREE]);
//export const MISSION_09 = new Mission(0, [], undefined, undefined, [GameModifier.ONE_CARD_MUST_WIN]);
export const MISSION_10 = new Mission(4);
//export const MISSION_11 = new Mission(4, [TaskToken.ONE], undefined, undefined, [GameModifier.ONE_PLAYER_NO_COMMUNICATION]);
//export const MISSION_12 = new Mission(4, [TaskToken.OMEGA], undefined, undefined, [GameModifiers.RANDOM_DRAW]);
//export const MISSION_13 = new Mission(0, [], undefined, undefined, [GameModifiers.EACH_ROCKET_WIN_TRICK]);
//export const MISSION_14 = new Mission(4, [TaskToken.ONE_ARROW, TaskToken.TWO_ARROW, TaskToken.THREE_ARROW], CommunicationRestriction.NO_TOKEN);
export const MISSION_15 = new Mission(4, [TaskToken.ONE, TaskToken.TWO, TaskToken.THREE, TaskToken.FOUR]);
//export const MISSION_16 = new Mission(0, [], undefined, undefined, [GameModifiers.NO_NINE_MAY_WIN]);
//export const MISSION_17 = new Mission(2, [], undefined, undefined, [GameModifiers.NO_NINE_MAY_WIN]);
//export const MISSION_18 = new Mission(5, [], CommunicationRestriction.AFTER_ONE);
//export const MISSION_19 = new Mission(5, [TaskToken.ONE], CommunicationRestriction.AFTER_TWO);
//export const MISSION_20 = new Mission(2, [], undefined, TaskSelectionStyle.COMMANDER_CHOOSE_ONE);
//export const MISSION_21 = new Mission(5, [TaskToken.ONE], CommunicationRestriction.NO_TOKEN);
export const MISSION_22 = new Mission(5, [TaskToken.ONE_ARROW, TaskToken.TWO_ARROW, TaskToken.THREE_ARROW, TaskToken.FOUR_ARROW]);
//export const MISSION_23 = new Mission(5, [TaskToken.ONE, TaskToken.TWO, TaskToken.THREE, TaskToken.FOUR, TaskToken.FIVE], undefined, undefined, [GameModifiers.SWAP_TOKEN]);
//export const MISSION_24 = new Mission(6, [], undefined, TaskSelectionStyle.COMMANDER_CHOICE);
//export const MISSION_25 = new Mission(6, [TaskToken.ONE_ARROW, TaskToken.TWO_ARROW], CommunicationRestriction.NO_TOKEN);
//export const MISSION_26 = new Mission(0, [], undefined, undefined, [GameModifiers.ONE_CARD_MUST_WIN, GameModifiers.ONE_CARD_MUST_WIN]);
//export const MISSION_27 = new Mission(3, [], undefined, TaskSelectionStyle.COMMANDER_CHOOSE_ONE);
//export const MISSION_28 = new Mission(6, [TaskToken.ONE, TaskToken.OMEGA], CommunicationRestriction.AFTER_TWO);
//export const MISSION_29 = new Mission(0, [], CommunicationRestriction.NO_TOKEN, undefined, [GameModifiers.TRICKS_MUST_BE_SHARED]);
//export const MISSION_30 = new Mission(6, [TaskToken.ONE_ARROW, TaskToken.TWO_ARROW, TaskToken.THREE_ARROW], CommunicationRestriction.AFTER_ONE);
export const MISSION_31 = new Mission(6, [TaskToken.ONE, TaskToken.TWO, TaskToken.THREE]);
//export const MISSION_32 = new Mission(7, [], undefined, TaskSelectionStyle.COMMANDER_CHOICE);
//export const MISSION_33 = new Mission(0, [], undefined, TaskSelectionStyle.COMMANDER_CHOOSE_ONE, [GameModifiers.MUST_WIN_ONLY_ONE]);
//export const MISSION_34 = new Mission(0, [], undefined, undefined, [GameModifiers.TRICKS_MUST_BE_SHARED, COMMANDER_START_AND_END]);
export const MISSION_35 = new Mission(7, [TaskToken.ONE_ARROW, TaskToken.TWO_ARROW, TaskToken.THREE_ARROW]);
//export const MISSION_36 = new Mission(7, [TaskToken.ONE, TaskToken.TWO], undefined, TaskSelectionStyle.COMMANDER_CHOICE);
//export const MISSION_37 = new Mission(4, [], undefined, TaskSelectionStyle.COMMANDER_CHOOSE_ONE);
//export const MISSION_38 = new Mission(8, [], CommunicationRestriction.AFTER_TWO);
//export const MISSION_39 = new Mission(8, [TaskToken.ONE_ARROW, TaskToken.TWO_ARROW, TaskToken.THREE_ARROW], CommunicationRestriction.NO_TOKEN);
//export const MISSION_40 = new Mission(8, [TaskToken.ONE, TaskToken.TWO, TaskToken.THREE], undefined, undefined, [GameModifiers.MOVE_TOKEN]);
//export const MISSION_41 = new Mission(0, [], undefined, TaskSelectionStyle.COMMANDER_CHOICE, [GameModifiers.MUST_WIN_FIRST_AND_LAST]);
export const MISSION_42 = new Mission(9);
//export const MISSION_43 = new Mission(9, [], undefined, TaskSelectionStyle.COMMANDER_CHOICE);
//export const MISSION_44 = new Mission(0, [], undefined, undefined, [GameModifiers.EACH_ROCKET_WIN_TRICK, GameModifiers.ROCKETS_IN_ORDER]);
export const MISSION_45 = new Mission(9, [TaskToken.ONE_ARROW, TaskToken.TWO_ARROW, TaskToken.THREE_ARROW]);
//export const MISSION_46 = new Mission(0, [], undefined, undefined, [GameModifiers.ALL_PINK_CARDS]);
export const MISSION_47 = new Mission(10);
//export const MISSION_48 = new Mission(3, [TaskToken.OMEGA], undefined, undefined, [GameModifiers.OMEGA_IN_LAST_TRICK]);
export const MISSION_49 = new Mission(10, [TaskToken.ONE_ARROW, TaskToken.TWO_ARROW, TaskToken.THREE_ARROW]);
//export const MISSION_50 = new Mission(0, [], undefined, TaskSelectionStyle.COMMANDER_CHOOSE_ONE, [GameModifiers.MUST_WIN_FIRST_FOUR, GameModifiers.MUST_WIN_LAST]);
