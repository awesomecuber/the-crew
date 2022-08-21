import * as readline from "readline";
import * as process from "process";

import { GameState } from "./gameState";
import { Task } from "./task";
import { Card } from "./card";
import { Color, Direction } from "./header";

//finally, we make a gamestate
//most of the other setup work done in the gamestate constructor
let startingTasks: Task[] = [new Task(new Card(Color.Blue, 3))];

let game = new GameState(startingTasks);

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

//command line interface for the crew
//usage:
// q        quits
// c        tries to play a card
// t        tries to select a task

function beginInputPrompt() {
    rl.question("Input h for help", (answer) => {
        let playId: Direction = Direction.NULL;
        let cardId: number = -1;

        switch (answer.toLowerCase()) {
            case "d":
                console.log("It is " + game.isTaskSelection + " that we are selecting tasks");
                console.log("The next player to play is " + game.nextPlay);
                console.log("The commander is " + game.commander);
                console.log("The current tasks are:" + game.tasksToString());
                console.log("The current trick is: " + game.trick.trickToString());
                for (let i: number = 0; i < 4; i++) {
                    let str: string = game.players[i].handToString();
                    console.log("Player " + i + " hand is " + str);
                }
                beginInputPrompt();
                break;
            case "c":
                playId = Direction.NULL;
                cardId = -1;
                rl.question("Which player should play a card? (0, 1, 2, or 3)", (answer) => {
                    switch (answer) {
                        case "0":
                            playId = Direction.North;
                            break;
                        case "1":
                            playId = Direction.East;
                            break;
                        case "2":
                            playId = Direction.South;
                            break;
                        case "3":
                            playId = Direction.West;
                            break;
                        default:
                            playId = Direction.NULL;
                    }

                    let str: string = "";
                    if (playId != -1) {
                        str = game.players[playId].handToString();
                    }

                    rl.question("Which card (0-9) from their hand should they play?  " + str, (answer) => {
                        switch (answer) {
                            case "0":
                                cardId = 0;
                                break;
                            case "1":
                                cardId = 1;
                                break;
                            case "2":
                                cardId = 2;
                                break;
                            case "3":
                                cardId = 3;
                                break;
                            case "4":
                                cardId = 4;
                                break;
                            case "5":
                                cardId = 5;
                                break;
                            case "6":
                                cardId = 6;
                                break;
                            case "7":
                                cardId = 7;
                                break;
                            case "8":
                                cardId = 8;
                                break;
                            case "9":
                                cardId = 9;
                                break;
                            default:
                                cardId = -1;
                                break;
                        }
                        if (playId != -1 && cardId != -1) {
                            game.update_playCard(playId, game.players[playId].hand[cardId]);
                        }
                        beginInputPrompt();
                    });
                });
                break;
            case "t":
                playId = Direction.NULL;
                cardId = -1;
                rl.question("Which player should pick a task? (0, 1, 2, or 3)", (answer) => {
                    switch (answer) {
                        case "0":
                            playId = Direction.North;
                            break;
                        case "1":
                            playId = Direction.East;
                            break;
                        case "2":
                            playId = Direction.South;
                            break;
                        case "3":
                            playId = Direction.West;
                            break;
                        default:
                            playId = Direction.NULL;
                    }

                    let str: string = "";
                    if (playId != -1) {
                        str = game.tasksToString();
                    }

                    rl.question("Which task (0-9) should they pick?  " + str, (answer) => {
                        switch (answer) {
                            case "0":
                                cardId = 0;
                                break;
                            case "1":
                                cardId = 1;
                                break;
                            case "2":
                                cardId = 2;
                                break;
                            case "3":
                                cardId = 3;
                                break;
                            case "4":
                                cardId = 4;
                                break;
                            case "5":
                                cardId = 5;
                                break;
                            case "6":
                                cardId = 6;
                                break;
                            case "7":
                                cardId = 7;
                                break;
                            case "8":
                                cardId = 8;
                                break;
                            case "9":
                                cardId = 9;
                                break;
                            default:
                                cardId = -1;
                                break;
                        }
                        if (playId != -1 && cardId != -1) {
                            game.update_pickTask(playId, game.availableTasks[cardId]);
                        }
                        beginInputPrompt();
                    });
                });
                break;
            default:
            case "h":
                console.log("c - tries to play a card");
                console.log("t - tries to select a task");
                console.log("d - displays information about the gamestate");
                console.log("h - displays this menu");
                beginInputPrompt();
                break;
        }
    });
}

beginInputPrompt();
