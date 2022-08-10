"use strict";
exports.__esModule = true;
var readline = require("readline");
var process = require("process");
var Color;
(function (Color) {
    Color[Color["NULL"] = -1] = "NULL";
    Color[Color["Black"] = 0] = "Black";
    Color[Color["Pink"] = 1] = "Pink";
    Color[Color["Yellow"] = 2] = "Yellow";
    Color[Color["Blue"] = 3] = "Blue";
    Color[Color["Green"] = 4] = "Green";
})(Color || (Color = {}));
var CommunicationToken;
(function (CommunicationToken) {
    CommunicationToken[CommunicationToken["Low"] = -1] = "Low";
    CommunicationToken[CommunicationToken["Only"] = 0] = "Only";
    CommunicationToken[CommunicationToken["Hi"] = 1] = "Hi";
})(CommunicationToken || (CommunicationToken = {}));
var Direction;
(function (Direction) {
    Direction[Direction["NULL"] = -1] = "NULL";
    Direction[Direction["North"] = 0] = "North";
    Direction[Direction["East"] = 1] = "East";
    Direction[Direction["South"] = 2] = "South";
    Direction[Direction["West"] = 3] = "West";
})(Direction || (Direction = {}));
var GameError;
(function (GameError) {
    GameError[GameError["SUCCESS"] = 0] = "SUCCESS";
    GameError[GameError["NOT_IMPLEMENTED"] = 1] = "NOT_IMPLEMENTED";
    GameError[GameError["WRONG_PHASE"] = 2] = "WRONG_PHASE";
    GameError[GameError["NOT_PLAYER_TURN"] = 3] = "NOT_PLAYER_TURN";
    GameError[GameError["TASK_NOT_AVAILABLE"] = 4] = "TASK_NOT_AVAILABLE";
    GameError[GameError["CARD_NOT_HELD"] = 5] = "CARD_NOT_HELD";
    GameError[GameError["CARD_ALREADY_PLAYED"] = 6] = "CARD_ALREADY_PLAYED";
    GameError[GameError["REVOKE"] = 7] = "REVOKE";
})(GameError || (GameError = {}));
//one card in the game, consisting of a color (suit) and a number (rank)
var Card = /** @class */ (function () {
    function Card(color, number) {
        this.color = color;
        this.number = number;
    }
    //returns true if the two cards are exactly the same
    Card.prototype.equals = function (other) {
        return this.color == other.color && this.number == other.number;
    };
    //returns true if this card ranks higher than the other card
    //assumes that this card beats all cards of other suits
    //and loses to trump cards, or higher ranked cards of the same suit
    Card.prototype.winsAgainst = function (other) {
        if (this.color == other.color) {
            return this.number >= other.number;
        }
        return !(other.color == Color.Black);
    };
    Card.prototype.cardToString = function () {
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
    };
    return Card;
}());
//a single task card
var Task = /** @class */ (function () {
    function Task(card) {
        this.card = card;
        this.isComplete = false;
    }
    Task.prototype.equals = function (other) {
        return this.card.equals(other.card);
    };
    return Task;
}());
//represents a communication from a player
var Communication = /** @class */ (function () {
    function Communication(card, token) {
        this.card = card;
        this.token = token;
    }
    return Communication;
}());
//all information relevant to a single player
var Player = /** @class */ (function () {
    // all players start with no tasks and the ability to communicate
    function Player() {
        this.hand = [];
        this.tasks = [];
        this.communication = null;
    }
    Player.prototype.addTask = function (task) {
        this.tasks.push(task);
    };
    Player.prototype.addCard = function (card) {
        this.hand.push(card);
    };
    Player.prototype.removeCard = function (cardIndex) {
        var temp = this.hand.splice(cardIndex);
        temp.shift();
        this.hand = this.hand.concat(temp);
    };
    Player.prototype.handToString = function () {
        var str = "";
        for (var _i = 0, _a = this.hand; _i < _a.length; _i++) {
            var card = _a[_i];
            str += card.cardToString() + " ";
        }
        return str;
    };
    Player.prototype.isVoid = function (color) {
        for (var _i = 0, _a = this.hand; _i < _a.length; _i++) {
            var card = _a[_i];
            if (card.color == color) {
                return false;
            }
        }
        return true;
    };
    Player.prototype.sortHand = function () {
        this.hand = this.hand.sort(function (a, b) {
            if (a.color == b.color) {
                return b.number - a.number;
            }
            else
                return a.color - b.color;
        });
    };
    return Player;
}());
//this represents a single trick, consisting of 4 cards
var Trick = /** @class */ (function () {
    function Trick(lead) {
        this.cards = [BLANK_CARD, BLANK_CARD, BLANK_CARD, BLANK_CARD];
        this.lead = lead;
        this.color = Color.NULL;
        this.winner = Direction.NULL;
    }
    Trick.prototype.trickToString = function () {
        var str = "";
        for (var _i = 0, _a = this.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            str += card.cardToString() + " ";
        }
        return this.lead + " lead: " + str;
    };
    //adds a card to the trick
    Trick.prototype.addCard = function (dir, playedCard) {
        if (this.cards[dir] != BLANK_CARD) {
            return GameError.CARD_ALREADY_PLAYED;
        }
        this.cards[dir] = playedCard;
        //if this is the first card, then we have to set the suit of the trick!
        if (this.color == Color.NULL) {
            this.color = playedCard.color;
        }
        //now that we have added a card, we have to check if the trick is over:
        for (var _i = 0, _a = this.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            if (card.equals(BLANK_CARD)) {
                return GameError.SUCCESS;
            }
        }
        //all cards have been played!  we have to see who won the trick now
        this.findWinner();
        return GameError.SUCCESS;
    };
    //figures out the winner of the trick
    Trick.prototype.findWinner = function () {
        var currWinner = this.lead;
        for (var i = 0; i < 4; i++) {
            if (this.cards[i].winsAgainst(this.cards[currWinner])) {
                currWinner = i;
            }
        }
        this.winner = currWinner;
    };
    return Trick;
}());
//this card is used for cards that have not yet been played on tricks
var BLANK_CARD = new Card(Color.NULL, -1);
//players recieve this communication on missions where communication is blocked
var BLOCKED_COMMUNICATION = new Communication(BLANK_CARD, CommunicationToken.Only);
//this is the black 4, for use in deciding who is the commander
var BLACK_FOUR = new Card(Color.Black, 4);
//this records all information needed about the gamestate FOR A SINGLE MISSION
var GameState = /** @class */ (function () {
    // this constructor creates a gamestate for a new hand
    // tasks are currently fed into the constructor, so that they can be configured depending on the mission
    function GameState(tasks) {
        //first, we initialize all the variables
        this.players = [];
        this.availableTasks = tasks;
        this.isTaskSelection = true;
        this.commander = Direction.NULL;
        this.nextPlay = Direction.NULL;
        //now, we add four players
        for (var i = 0; i < 4; i++) {
            var temp = new Player();
            this.players.push(temp);
        }
        //now we deal hands to the players
        this.dealHands();
        //we have to check who has the black 4
        for (var i = 0; i < this.players.length; i++) {
            for (var _i = 0, _a = this.players[i].hand; _i < _a.length; _i++) {
                var card = _a[_i];
                if (card.equals(BLACK_FOUR)) {
                    this.commander = i;
                    this.nextPlay = i;
                    break;
                }
            }
            if (this.commander != Direction.NULL) {
                break;
            }
        }
        //the commander leads the first trick
        this.trick = new Trick(this.commander);
        //finally, if there are no tasks, immediately begin the play phase
        if (this.availableTasks.length <= 0) {
            this.startPlay();
        }
    }
    GameState.prototype.removeTask = function (taskIndex) {
        var temp = this.availableTasks.splice(taskIndex);
        temp.shift();
        this.availableTasks = this.availableTasks.concat(temp);
    };
    //this method gives 10 card hands to each player
    GameState.prototype.dealHands = function () {
        //first we must make and shuffle the deck
        var deck = makeDeck();
        deck = deck.sort(function () { return Math.random() - 0.5; });
        //now, add 10 cards to each players hand
        for (var i = 0; i < this.players.length; i++) {
            for (var j = 0; j < 10; j++) {
                this.players[i].addCard(deck.pop());
            }
            this.players[i].sortHand();
        }
    };
    //
    GameState.prototype.update_playCard = function (dir, playedCard) {
        //make sure it is the playing phase
        if (this.isTaskSelection) {
            console.log("it is not the playing phase");
            return GameError.WRONG_PHASE;
        }
        //now make sure that it is actually this player's turn
        if (this.nextPlay != dir) {
            console.log("it is not your turn to play");
            return GameError.NOT_PLAYER_TURN;
        }
        //let's make sure the player is following suit
        if (this.trick.color != Color.NULL &&
            this.trick.color != playedCard.color &&
            !this.players[dir].isVoid(this.trick.color)) {
            console.log("you didn't follow suit");
            return GameError.REVOKE;
        }
        //lets make sure the player actually has the card in their hand
        var cardIndex = -1;
        for (var i = 0; i < 10; i++) {
            if (playedCard.equals(this.players[dir].hand[i])) {
                cardIndex = i;
                break;
            }
        }
        if (cardIndex == -1) {
            console.log("you don't have that card");
            return GameError.CARD_NOT_HELD;
        }
        // now we need to add a card to the trick
        var returnValue = this.trick.addCard(dir, playedCard);
        if (returnValue != GameError.SUCCESS) {
            return returnValue;
        }
        // we need to remove the card from the players hand
        this.players[dir].removeCard(cardIndex);
        //figure out who is next to play
        this.nextPlay = (this.nextPlay + 1) % 4;
        // if the trick is complete, we have to make a new trick
        if (this.trick.winner != Direction.NULL) {
            // check if any tasks were completed
            for (var _i = 0, _a = this.players[this.trick.winner].tasks; _i < _a.length; _i++) {
                var task = _a[_i];
                for (var _b = 0, _c = this.trick.cards; _b < _c.length; _b++) {
                    var card = _c[_b];
                    if (task.card.equals(card)) {
                        task.isComplete = true;
                    }
                }
            }
            this.nextPlay = this.trick.winner;
            this.tricknum += 1;
            this.trick = new Trick(this.nextPlay);
            if (this.tricknum == 10) {
                this.terminate();
            }
        }
        return GameError.SUCCESS;
    };
    GameState.prototype.update_pickTask = function (dir, selectedTask) {
        //make sure that it is the picking phase
        if (!this.isTaskSelection) {
            console.log("it is not the task selection phase");
            return GameError.WRONG_PHASE;
        }
        //make sure that it is the right players turn
        if (this.nextPlay != dir) {
            console.log("it is not your turn");
            return GameError.NOT_PLAYER_TURN;
        }
        //make sure the task is actually available
        var taskIndex = -1;
        for (var i = 0; i < this.availableTasks.length; i++) {
            if (selectedTask.equals(this.availableTasks[i])) {
                taskIndex = i;
                break;
            }
        }
        if (taskIndex == -1) {
            console.log("that is not one of the tasks");
            return GameError.TASK_NOT_AVAILABLE;
        }
        //the right player picked the right task in the picking phase.  now we must give them the task, and make it the next player's turn
        this.removeTask(taskIndex);
        this.players[this.nextPlay].addTask(selectedTask);
        this.nextPlay = (this.nextPlay + 1) % 4;
        //if that was the last task, the playing phase begins!
        if (this.availableTasks.length <= 0) {
            this.startPlay();
        }
        return GameError.SUCCESS;
    };
    GameState.prototype.communicate = function (dir, communication) {
        return GameError.NOT_IMPLEMENTED;
    };
    GameState.prototype.terminate = function () {
        //lets see if we won!
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var player = _a[_i];
            for (var _b = 0, _c = player.tasks; _b < _c.length; _b++) {
                var task = _c[_b];
                if (!task.isComplete) {
                    console.log("YOU LOSE!!!");
                    return false;
                }
            }
        }
        console.log("YOU WIN!!!");
        return true;
    };
    GameState.prototype.startPlay = function () {
        this.nextPlay = this.commander;
        this.isTaskSelection = false;
    };
    return GameState;
}());
//creates the 40 card deck
function makeDeck() {
    var deck = [];
    for (var i = 1; i < 10; i++) {
        var pink = new Card(Color.Pink, i);
        var yellow = new Card(Color.Yellow, i);
        var blue = new Card(Color.Blue, i);
        var green = new Card(Color.Green, i);
        deck.push(pink);
        deck.push(yellow);
        deck.push(blue);
        deck.push(green);
    }
    for (var i = 1; i < 5; i++) {
        var black = new Card(Color.Black, i);
        deck.push(black);
    }
    return deck;
}
//finally, we make a gamestate
//most of the other setup work done in the gamestate constructor
var startingTasks = [new Task(new Card(Color.Blue, 3))];
startingTasks = [];
var game = new GameState(startingTasks);
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
//command line interface for the crew
//usage:
// q        quits
// c        tries to play a card
// t        tries to select a task
function beginInputPrompt() {
    rl.question("Input h for help", function (answer) {
        switch (answer.toLowerCase()) {
            case "d":
                console.log("It is " +
                    game.isTaskSelection +
                    " hthat we are selecting tasks");
                console.log("The next player to play is " + game.nextPlay);
                console.log("The commander is " + game.commander);
                console.log("The current trick is: " + game.trick.trickToString());
                for (var i = 0; i < 4; i++) {
                    var str = game.players[i].handToString();
                    console.log("Player " + i + " hand is " + str);
                }
                beginInputPrompt();
                break;
            case "c":
                var playId_1 = Direction.NULL;
                var cardId_1 = -1;
                rl.question("Which player should play a card? (0, 1, 2, or 3)", function (answer) {
                    switch (answer) {
                        case "0":
                            playId_1 = Direction.North;
                            break;
                        case "1":
                            playId_1 = Direction.East;
                            break;
                        case "2":
                            playId_1 = Direction.South;
                            break;
                        case "3":
                            playId_1 = Direction.West;
                            break;
                        default:
                            playId_1 = Direction.NULL;
                    }
                    var str = "";
                    if (playId_1 != -1) {
                        str = game.players[playId_1].handToString();
                    }
                    rl.question("Which card (0-9) from their hand should they play?  " +
                        str, function (answer) {
                        switch (answer) {
                            case "0":
                                cardId_1 = 0;
                                break;
                            case "1":
                                cardId_1 = 1;
                                break;
                            case "2":
                                cardId_1 = 2;
                                break;
                            case "3":
                                cardId_1 = 3;
                                break;
                            case "4":
                                cardId_1 = 4;
                                break;
                            case "5":
                                cardId_1 = 5;
                                break;
                            case "6":
                                cardId_1 = 6;
                                break;
                            case "7":
                                cardId_1 = 7;
                                break;
                            case "8":
                                cardId_1 = 8;
                                break;
                            case "9":
                                cardId_1 = 9;
                                break;
                            default:
                                cardId_1 = -1;
                                break;
                        }
                        if (playId_1 != -1 && cardId_1 != -1) {
                            game.update_playCard(playId_1, game.players[playId_1].hand[cardId_1]);
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
