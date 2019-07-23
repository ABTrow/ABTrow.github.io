/*

Write your guess-game code here! Don't forget to look at the test specs as a guide. You can run the specs
by running "testem".

In this file, you will also include the event listeners that are needed to interact with your HTML file when
a user clicks a button or adds a guess to the input field.

*/

function generateWinningNumber() {
    return Math.ceil(Math.random() * 100);
}

function shuffle(arr) {
    var last = arr.length;
    var temp;
    var rando;
    while (last) {
        rando = Math.floor(Math.random() * last--);
        temp = arr[last];
        arr[last] = arr[rando];
        arr[rando] = temp;
    }
    return arr;
}

class Game {
    constructor() {
        this.playersGuess = null;
        this.pastGuesses = [];
        this.winningNumber = generateWinningNumber();
    }
    difference() {
        return Math.abs(this.playersGuess - this.winningNumber);
    }
    isLower() {
        return this.playersGuess < this.winningNumber
    }
    playersGuessSubmission(num) {
        if (isNaN(parseInt(num, 10)) || num > 100 || num < 1) {
            throw 'That is an invalid guess.';
        }
        this.playersGuess = num;
        return this.checkGuess();
    }
    checkGuess() {
        if (this.playersGuess === this.winningNumber) {
            this.pastGuesses.push(this.playersGuess);
            return 'You Win!';
        } else if (this.pastGuesses.includes(this.playersGuess)) {
            return 'You have already guessed that number.';
        } else {
            this.pastGuesses.push(this.playersGuess);
        }
        if (this.pastGuesses.length > 4) {
            return 'You Lose.';
        } else {
            let diff = this.difference();
            if (diff < 10) {
                return 'You\'re burning up!';
            } else if (diff < 25) {
                return 'You\'re lukewarm.';
            } else if (diff < 50)  {
                return 'You\'re a bit chilly.';
            } else {
                return 'You\'re ice cold!';
            }
        }
    }
    provideHint() {
        return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
    }
}

function newGame() {
    return new Game();
}

// create Game on page load
let game = newGame();

// grab relevant DOM nodes
const submit = document.querySelector('#submit');
const input = document.querySelector('#guess');
const message = document.querySelector('#message');
const guessList = document.querySelector('#guessList');
const hint = document.querySelector('#hint');
const restart = document.querySelector('#restart');
const surrender = document.querySelector('#surrender');

function addGuess(guess) {
    // select relevant node, set variables
    let item = document.querySelector(`#guess${game.pastGuesses.length}`);
    let color;
    let nearness = game.difference();

    // determine color for hint
    if (nearness === 0) {
        color = 'green';
    } else if (nearness < 10) {
        color = 'red';
    } else if (nearness < 25) {
        color = 'orange';
    } else if (nearness < 50) {
        color = 'cyan';
    } else {
        color = 'blue';
    }
    item.style.textShadow = `0 0 5px ${color}`;
    item.innerHTML = guess;
}

function handleGuess() {

    let guess = parseInt(input.value, 10);
    let result = game.playersGuessSubmission(guess);
    let nearness = game.difference();

    // add result message
    message.innerHTML = result;

    // add past guesses
    addGuess(guess);

    // deal with extra messages for losing and wrong guesses
    if (game.pastGuesses.length < 5 && nearness !== 0) {
        message.innerHTML += game.isLower() ? ' - Guess Higher' : ' - Guess Lower'
    } else if (result === 'You Lose.') {
        message.innerHTML += `The number was ${game.winningNumber}`
    }

    // reset input box
    input.value = '';

}

// click button or enter to submit guess
submit.addEventListener('click', handleGuess);
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleGuess();
    }
})

hint.addEventListener('click', () => {
    let hints = game.provideHint();
    message.innerHTML = `The number you seek is within the following list:
        ${hints.join(', ')}`;
})

restart.addEventListener('click', () => {
    message.innerHTML = 'A new number has been selected. Amuse me with your guesses.';
    game = newGame();
    let guesses = guessList.children;
    for (let guess of guesses) {
        guess.innerHTML = '__';
        guess.style.textShadow = '1px 1px 2px black';
    }
})

// for fun
function numberfyChildren(parent) {
    let children = parent.children;
    for (let child of children) {
        if (child.children.length === 0) {
            child.innerHTML = String(Math.random());
        } else {
            Window.setInterval(numberfyChildren(child), 100);
        }
    }
}

surrender.addEventListener('click', () => {
    let body = document.querySelector('body');
    numberfyChildren(body);
})
