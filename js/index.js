// Globala state-variabler:

// Check if game is running
let gameRunning = false;

// See if the generated sequence is blinking
let prepareRound = false;

// Log the sequences
let currentSequence = [];
let pressedSequence = [];

// Track what round player is on
let roundNumber = 0;

// The duration of blinks
let blinkDuration = 500;

let timeOutArray = [];



const startButton = document.getElementById('start-game');
startButton.addEventListener('click', () => startGame());

const resetButton = document.getElementById('reset-game');
resetButton.addEventListener('click', () => resetGame());



const roundNumberDisplay = document.getElementById('round-number');
const sequenceLengthDisplay = document.getElementById('sequence-length-number');
const pressedSequenceDisplay = document.getElementById('pressed-sequence');

const instructionDisplay = document.querySelector('.instruction-text')

const countdownDisplay = document.querySelector('.countdown');
const gameFailedDisplay = document.querySelector('.game-failed');
const gameFailedRoundDisplay = document.querySelector('.game-failed-round');
const gameFailedSequenceDisplay = document.querySelector('.game-failed-sequence');

const failOneAudio = document.getElementById('fail1');
const failTwoAudio = document.getElementById('fail2');
const failThreeAudio = document.getElementById('fail3');
const failFourAudio = document.getElementById('fail4');
const startOneAudio = document.getElementById('start1');
const startTwoAudio = document.getElementById('start2');
const startThreeAudio = document.getElementById('start3');

const audioFiles = document.querySelectorAll('audio');
audioFiles.forEach(file => file.volume = 0.5);



// 9 buttons with id's corresponging to their number
const buttons = document.querySelectorAll('.button');
console.log(buttons);

// add a onclick for each button
buttons.forEach((button) => {
    button.addEventListener('click', () => {

        if (!prepareRound && gameRunning) {
            console.log(button);
            let number = button.id;

            pressedSequence.push(number);

            pressedSequenceDisplay.innerHTML = `${pressedSequence.join('  ')}`

            let isCorrect = listsAreEqual(currentSequence, pressedSequence);

            blinkOnClick(button, isCorrect);

            if (!isCorrect) {
                gameFailed();
            }

            if (isCorrect && pressedSequence.length == currentSequence.length) {
                roundInit();
            }

        }
    });
});





// Start a new round
function newRound() {
    // Reset the current sequence
    currentSequence = [];
    pressedSequence = [];

    roundNumber++;

    roundNumberDisplay.innerHTML = `${roundNumber}`;
    sequenceLengthDisplay.innerHTML = `${roundNumber + 2}`;

    generateSequence(roundNumber);

    blinkSequence();
}

function listsAreEqual(currentSequence, pressedSequence) {
    let currentIndex = pressedSequence.length - 1;

    if (currentSequence[currentIndex] == pressedSequence[currentIndex]) {
        return true;
    } else {
        return false;
    }
}

function startGame() {

    startButton.classList.add('hidden');
    resetButton.classList.remove('hidden');

    gameRunning = true;
    
    roundInit();
}

function resetGame() {
    startButton.classList.remove('hidden');
    resetButton.classList.add('hidden');

    gameRunning = false;

    instructionDisplay.innerHTML = "Starta spelet med knappen till vänster.";

    sequenceLengthDisplay.innerHTML = "...";
    roundNumberDisplay.innerHTML = "0";
    sequenceLengthDisplay.innerHTML = "0";

    countdownDisplay.innerHTML = "3";
    countdownDisplay.classList.add('hidden');

    gameFailedDisplay.classList.add('hidden');

    timeOutArray.forEach(timeout => clearTimeout(timeout));

    roundNumber = 0;
}



function gameFailed() {
    let n = Math.ceil(Math.random() * 4);

    switch (n) {
        case 1:
            failOneAudio.play();
            break;
        case 2:
            failTwoAudio.play();
            break;
        case 3:
            failThreeAudio.play();
            break;
        case 4:
            failFourAudio.play();
            break;
        default:
            console.log('You done goofed!');
    }

    // Show overlay "Game failed"
    instructionDisplay.innerHTML = "Spel slut! Återställ spelet."
    gameFailedRoundDisplay.innerHTML = `${roundNumber}`;
    gameFailedSequenceDisplay.innerHTML = currentSequence.join(' ');
    gameFailedDisplay.classList.remove('hidden');
    gameRunning = false;
}



function roundInit() {

    instructionDisplay.innerHTML = "Minns sekvensen!";

    timeOutArray = [];

    pressedSequenceDisplay.innerHTML = "...";

    prepareRound = true;

    countdownDisplay.classList.remove('hidden');
    countdownDisplay.innerHTML = "3"
    startOneAudio.play();
    console.log('3');
    let timeoutOne = setTimeout(() => {
        startOneAudio.play();
        countdownDisplay.innerHTML = "2";
        console.log('2');
    }, 1000)
    let timeoutTwo = setTimeout(() => {
        startOneAudio.play();
        countdownDisplay.innerHTML = "1";
        console.log('1');
    }, 2000)
    let timeoutThree = setTimeout(() => {
        let n = Math.random() > 0.95;
        console.log(n)
        n ? startThreeAudio.play() : startTwoAudio.play();
        countdownDisplay.innerHTML = "GO!"
    }, 3000)
    let timeoutFour = setTimeout(() => {
        countdownDisplay.classList.add('hidden');;
    }, 3700)
    let timeoutFive = setTimeout(() => {
        newRound();
    }, 4000)
    timeOutArray.push(timeoutOne, timeoutTwo, timeoutThree, timeoutFour, timeoutFive);
}



// Generate a sequence in an array of roundNumber + 2 numbers with numbers between 1 and 9
function generateSequence(roundNumber) {
    for (let ii = 1; ii <= roundNumber + 2 ; ii++) {
        currentSequence.push(Math.ceil(Math.random() * 9));
    }

    console.log(currentSequence);
}



// Use the array to make the buttons blink, one after another in the order of the array
function blinkSequence() {
    setTimeout(() => {
        prepareRound = false;
        instructionDisplay.innerHTML = "Tryck in sekvensen!";
    }, currentSequence.length * (blinkDuration+200));

    currentSequence.forEach((number, index) => {
            // Set a waiting time for each button to start blinking
            let timeout = setTimeout(() => {

                blinkButton(document.getElementById(number));

            }, index * (blinkDuration+200))

            timeOutArray.push(timeout);
    });
}



// Let a button blink by adding and then removing a class giving 
// it a different background color, delay of 0.3s between adding and removing
function blinkButton(button) {

        button.classList.add('button--correct');
        setTimeout(() => {
            // Removing the class that changes color
            button.classList.remove('button--correct');
        }, blinkDuration);

}



function blinkOnClick(button, isCorrect) {
    if (isCorrect) {
        button.classList.add('button--correct');
        setTimeout(() => {
        // Removing the class that changes color
        button.classList.remove('button--correct');
        }, 300);
    } else {
        button.classList.add('button--incorrect');
        setTimeout(() => {
        // Removing the class that changes color
        button.classList.remove('button--incorrect');
        }, 300);
    }
}