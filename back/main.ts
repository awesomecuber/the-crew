import * as readline from 'readline';
import * as process from 'process';

enum Color {
    NULL = -1,
    Black,
    Pink,
    Yellow,
    Blue,
    Green
}

enum CommunicationToken {
    Low = -1,
    Only = 0,
    Hi = 1
}

enum Direction{
    NULL = -1,
    North,
    East,
    South,
    West
}

enum GameError{
    SUCCESS,
    NOT_IMPLEMENTED,
    WRONG_PHASE,
    NOT_PLAYER_TURN,
    TASK_NOT_AVAILABLE,
    CARD_NOT_HELD,
    CARD_ALREADY_PLAYED,
    REVOKE
}

//one card in the game, consisting of a color (suit) and a number (rank)
class Card {
    color : Color;      
    number : number;    

    constructor(color, number) {
        this.color = color;
        this.number = number;
    }

    //returns true if the two cards are exactly the same
    equals(other: Card) : boolean{
        return this.color == other.color && this.number == other.number
    }

    //returns true if this card ranks higher than the other card
    //assumes that this card beats all cards of other suits
    //and loses to trump cards, or higher ranked cards of the same suit
    winsAgainst(other: Card) {
        
        if(this.color == other.color) {
            return this.number >= other.number;
        }

        return other.color == Color.Black
    }

    cardToString() : string {
        switch(this.color) {
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


//a single task card
class Task {
    card : Card;                            // the card that you must win to complete the task
    isComplete : boolean;                   // whether the task is completed

    constructor(card) {
        this.card = card;
        this.isComplete = false;
    }

    equals(other: Task) : boolean {
        return this.card.equals(other.card);
    }
}

//represents a communication from a player
class Communication {
    card : Card;                            // the card communicated
    token : CommunicationToken              // whether it is your highest, lowest, or only

    constructor(card, token) {
        this.card = card;
        this.token = token;
    }
}

//all information relevant to a single player
class Player {
    hand : Card[];                          // the cards a player (still has) in their hand
    tasks : Task[];                         // which tasks a player must complete
    communication : Communication | null;   // what the player has communicated, NULL if haven't communicated yet

    // all players start with no tasks and the ability to communicate
    constructor() {
        this.hand = [];
        this.tasks = [];
        this.communication = null;
    }

    addTask(task : Task) : void {
        this.tasks.push(task);
    }

    addCard(card: Card) :void {
        this.hand.push(card);
    }

    removeCard(cardIndex: number) : void {
        let temp = this.hand.splice(cardIndex);
        temp.shift();
        this.hand = this.hand.concat(temp);
    }

    handToString() {
        let str : string = "";

        for(let card of this.hand) {
            str += card.cardToString() + " ";
        }

        return str;
    }
}

//this represents a single trick, consisting of 4 cards
class Trick {
    cards : Card[];                         // what cards have been played on this trick
    color : Color;                          // what is the suit of the trick
    lead : Direction;                       // who initially lead the trick (NOT WHO IS NEXT TO PLAY)
    winner : Direction;                     // who won the trick

    constructor(lead: Direction) {
        this.cards = [BLANK_CARD, BLANK_CARD, BLANK_CARD, BLANK_CARD];
        this.lead = lead;
        this.color = Color.NULL;
        this.winner = Direction.NULL;
    }

    trickToString() : string {
        let str : string = "";

        for(let card of this.cards) {
            str += card.cardToString() + " ";
        }

        return this.lead + " lead: " + str;
    }

    //adds a card to the trick
    addCard(dir: Direction, playedCard: Card) : GameError {
        if(this.cards[dir] != BLANK_CARD) {
            return GameError.CARD_ALREADY_PLAYED
        }

        this.cards[dir] = playedCard;

        //if this is the first card, then we have to set the suit of the trick!
        if(this.color == Color.NULL) {
            this.color = playedCard.color;
        }

        //now that we have added a card, we have to check if the trick is over:
        for(let card of this.cards) {
            if(card.equals(BLANK_CARD) ){
                return GameError.SUCCESS;
            }
        }

        //all cards have been played!  we have to see who won the trick now
        this.findWinner();
        return GameError.SUCCESS;
    }

    //figures out the winner of the trick
    findWinner() {
        let currWinner : Direction = this.lead;

        for(let i: number = 0; i < 4; i ++) {
            if(this.cards[i].winsAgainst(this.cards[currWinner])) {
                currWinner = i;
            }
        }
        this.winner = currWinner;
    }
}

//this card is used for cards that have not yet been played on tricks
const BLANK_CARD = new Card(Color.NULL, -1);

//players recieve this communication on missions where communication is blocked
const BLOCKED_COMMUNICATION = new Communication(BLANK_CARD, CommunicationToken.Only);

//this is the black 4, for use in deciding who is the commander
const BLACK_FOUR = new Card(Color.Black, 4);


//this records all information needed about the gamestate FOR A SINGLE MISSION
class GameState {
    
    players : Player[];                     // the 4 players
    availableTasks : Task[];                // which tasks have not yet been selected
    trick : Trick;                          // the current trick
    tricknum : number;                      // how many tricks have been played
    //history : Trick[];

    commander : Direction;                  // who the commander is
    nextPlay : Direction;                   // who can next take an action

    isTaskSelection : boolean;              // whether or not the game is in the task selection phase, or the playing phase


    // this constructor creates a gamestate for a new hand
    // tasks are currently fed into the constructor, so that they can be configured depending on the mission
    constructor(tasks : Task[]) {

        //first, we initialize all the variables
        
        this.players = [];
        this.availableTasks = tasks;

        this.isTaskSelection = true;
        this.commander = Direction.NULL;
        this.nextPlay = Direction.NULL;
        
        //now, we add four players
        for(let i : number = 0; i < 4; i ++) {
            let temp = new Player();
            this.players.push(temp);
        }

        //now we deal hands to the players
        this.dealHands();

        //we have to check who has the black 4
        for(let i = 0; i < 4; i ++){
            for(const card of this.players[i].hand) {
                if(card.equals(BLACK_FOUR)) {
                    this.commander = i;
                    this.nextPlay = i;
                    break;
                }
            }
            if(this.commander != Direction.NULL){
                break;
            }
        }

        //the commander leads the first trick
        this.trick = new Trick(this.commander);

        //finally, if there are no tasks, immediately begin the play phase
        if(this.availableTasks.length <= 0) {
            this.startPlay();
        }
    }

    removeTask(taskIndex : number) {
        let temp = this.availableTasks.splice(taskIndex);
        temp.shift();
        this.availableTasks = this.availableTasks.concat(temp);
    }

    //this method gives 10 card hands to each player
    dealHands() : void {
        
        //first we must make and shuffle the deck
        let deck = makeDeck()
        deck = deck.sort( () => Math.random() - 0.5)

        for(let i : number = 0; i < 40; i++){
            console.log(deck[i].color + " " + deck[i].number)
        }

        //now, add 10 cards to each players hand
        for( let i : number = 0; i < 4; i++) {
            for(let j :number = 0; j < 10; j++) {
                this.players[i].addCard((deck.pop()!));
            }
        }
    }

    //
    update_playCard(dir: Direction, playedCard: Card) : GameError {

        //make sure it is the playing phase
        if (this.isTaskSelection ) {
            console.log("it is not the playing phase")
            return GameError.WRONG_PHASE;
        }

        //now make sure that it is actually this player's turn
        if (this.nextPlay != dir) {
            console.log("it is not your turn to play")
            return GameError.NOT_PLAYER_TURN;
        }

        //let's make sure the player is following suit
        if(this.trick.color != Color.NULL && this.trick.color != playedCard.color) {
            console.log("you didn't follow suit")
            return GameError.REVOKE;
        }

        //lets make sure the player actually has the card in their hand
        let cardIndex :number = -1;
        for(let i: number = 0; i < 10; i ++) {
            if(playedCard.equals(this.players[dir].hand[i])) {
                cardIndex = i;
                break;
            }
        }

        if(cardIndex == -1) {
            console.log("you don't have that card");
            return GameError.CARD_NOT_HELD;
        }


        // now we need to add a card to the trick
        let returnValue : GameError = this.trick.addCard(dir, playedCard)

        if(returnValue != GameError.SUCCESS) {
            return returnValue;
        }

        // we need to remove the card from the players hand
        this.players[dir].removeCard(cardIndex);

        //figure out who is next to play
        this.nextPlay = (this.nextPlay + 1) % 4;

        // if the trick is complete, we have to make a new trick
        if(this.trick.winner != Direction.NULL) {
            // check if any tasks were completed
            for(let task of this.players[this.trick.winner].tasks) {
                for(let card of this.trick.cards) {
                    if(task.card.equals(card)) {
                        task.isComplete = true;
                    }
                }
            }

            this.nextPlay = this.trick.winner;
            this.tricknum += 1;
            this.trick = new Trick(this.nextPlay);

            if(this.tricknum == 10) {
                this.terminate();
            }
        }

        return GameError.SUCCESS;
    }

    

    update_pickTask(dir: Direction, selectedTask: Task) : GameError {
        
        //make sure that it is the picking phase
        if(!this.isTaskSelection) {
            console.log("it is not the task selection phase");
            return GameError.WRONG_PHASE;
        }

        //make sure that it is the right players turn
        if(this.nextPlay != dir) {
            console.log("it is not your turn")
            return GameError.NOT_PLAYER_TURN
        }

        //make sure the task is actually available
        let taskIndex : number = -1;
        for(let i: number = 0; i < this.availableTasks.length; i ++) {
            if(selectedTask.equals(this.availableTasks[i])) {
                taskIndex = i;
                break;
            }
        }

        if(taskIndex == -1) {
            console.log("that is not one of the tasks");
            return GameError.TASK_NOT_AVAILABLE;
        }

        //the right player picked the right task in the picking phase.  now we must give them the task, and make it the next player's turn
        this.removeTask(taskIndex);

        this.players[this.nextPlay].addTask(selectedTask);
        this.nextPlay = (this.nextPlay + 1) % 4;
        
        //if that was the last task, the playing phase begins!
        if(this.availableTasks.length <= 0) {
            this.startPlay()
        }

        return GameError.SUCCESS;
    }

    communicate(dir: Direction, communication: Communication) : GameError {
        return GameError.NOT_IMPLEMENTED;
    }

    terminate() : boolean{
        //lets see if we won!

        for(let player of this.players) {
            for(let task of player.tasks) {
                if(!task.isComplete) {
                    console.log("YOU LOSE!!!");
                    return false;
                }
            }
        }

        console.log("YOU WIN!!!");
        return true;
    }

    startPlay() {
        this.nextPlay = this.commander;
        this.isTaskSelection = false;
    }
}


//creates the 40 card deck
function makeDeck() : Card[] {
    let deck: Card[] = [];

    for(let i : number = 1; i < 10; i++) {
        let pink = new Card(Color.Pink, i);
        let yellow = new Card(Color.Yellow, i);
        let blue = new Card(Color.Blue, i);
        let green = new Card(Color.Green, i);

        deck.push(pink);
        deck.push(yellow);
        deck.push(blue);
        deck.push(green);
    }

    for(let i : number = 1; i < 5; i++) {
        let black = new Card(Color.Black, i);
        deck.push(black);
    }

    return deck;
}

//finally, we make a gamestate
//most of the other setup work done in the gamestate constructor
let startingTasks : Task[] = [new Task ( new Card(Color.Blue, 3))];
startingTasks = []
let game = new GameState(startingTasks);


let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

//command line interface for the crew
//usage:
// q        quits
// c        tries to play a card
// t        tries to select a task

function beginInputPrompt() {
    rl.question('Input h for help', (answer) => {
        switch(answer.toLowerCase()) {
            case 'd':
                console.log('It is ' + game.isTaskSelection + ' hthat we are selecting tasks');
                console.log("The next player to play is " + game.nextPlay);
                console.log("The commander is " + game.commander);
                console.log("The current trick is: " + game.trick.trickToString())
                for(let i : number = 0; i < 4; i ++) {
                    let str : string = game.players[i].handToString();
                    console.log("Player " + i + " hand is " + str)
                }
                beginInputPrompt();
                break;
            case 'c':
                let playId : Direction = Direction.NULL;
                let cardId : number = -1;
                rl.question('Which player should play a card? (0, 1, 2, or 3)', (answer) => {
                    switch(answer) {
                        case '0':
                            playId = Direction.North;
                            break;
                        case '1':
                            playId = Direction.East;
                            break;
                        case '2':
                            playId = Direction.South;
                            break;
                        case '3':
                            playId = Direction.West;
                            break;
                        default:
                            playId = Direction.NULL;
                    }


                    let str : string = "";
                    if(playId != -1) {
                        str = game.players[playId].handToString();
                    }

                    rl.question('Which card (0-9) from their hand should they play?  ' + str, (answer) => {
                        switch(answer) {
                            case '0':
                                cardId = 0;
                                break;
                            case '1':
                                cardId = 1;
                                break;
                            case '2':
                                cardId = 2;
                                break;
                            case '3':
                                cardId = 3;
                                break;
                            case '4':
                                cardId = 4;
                                break;
                            case '5':
                                cardId = 5;
                                break;
                            case '6':
                                cardId = 6;
                                break;
                            case '7':
                                cardId = 7;
                                break;
                            case '8':
                                cardId = 8;
                                break;
                            case '9':
                                cardId = 9;
                                break;
                            default:
                                cardId = -1;
                                break
                        }
                        if (playId != -1 && cardId != -1){
                            game.update_playCard(playId, game.players[playId].hand[cardId]);
                        }
                        beginInputPrompt();
                    })
                });
                break;
                default:
            case 'h':
                console.log('c - tries to play a card');
                console.log('t - tries to select a task');
                console.log('d - displays information about the gamestate');
                console.log('h - displays this menu');
                beginInputPrompt();
                break;

        }
        
    });

}

beginInputPrompt();

