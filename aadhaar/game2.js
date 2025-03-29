// High score keys:
// addition-100
// addition-200
// subtraction-100
// subtraction-200
// multiplication-100
// multiplication-200
// lightning-100
// lightning-200
// table-100
// table-200
// roman-100
// roman-200
// word-100
// word-200

let question = 1;
let timer;
let checkQuestionCount;
let time; // Define the time variable

const questionElement = document.getElementById('question1');
const timeElement = document.getElementById('time1');

function startGame() {
    console.log('startGame function called');
    time = 1;
    question = 1;
    document.getElementById("game-setup").style.display = "none";
    document.getElementById("game-result").style.display = "none";
    document.getElementById("game-play").style.display = "flex";

    const selectedTimeMode = document.querySelector('.timeMode.selected-mode');
    const selectedQuestionMode = document.querySelector('.questionMode.selected-mode');
    const selectedGameType = document.querySelector('.typeOption.selected').dataset.value;
    const gameName = document.getElementById('title').textContent.split(' ')[0].toLowerCase();
    const highScoreKey = `${gameName}-${selectedGameType}`;
    const highScore = localStorage.getItem(highScoreKey) || 0;

    document.getElementById("highScore1").textContent = `High Score: ${highScore}`;

    if (selectedTimeMode) {
        initializeTimeMode(selectedTimeMode);
    } else if (selectedQuestionMode) {
        initializeQuestionMode(selectedQuestionMode);
    } else {
        console.log('No mode is selected');
    }

    generateQuestion();
}

function initializeTimeMode(selectedTimeMode) {
    console.log('initializeTimeMode function called');
    console.log('Time Mode is selected');
    time = parseInt(selectedTimeMode.getAttribute('data-value'));
    questionElement.textContent = `Question No: ${question}`;
    timeElement.textContent = `Time Left: ${time}`;
    timer = setInterval(() => {
        time--;
        timeElement.textContent = `Time Left: ${time}`;
        if (time <= 0) {
            clearInterval(timer);
            endGame(parseInt(selectedTimeMode.getAttribute('data-value')), question-1);
        }
    }, 1000);
}

function initializeQuestionMode(selectedQuestionMode) {
    console.log('initializeQuestionMode function called');
    console.log('Question Mode is selected');
    question = parseInt(selectedQuestionMode.getAttribute('data-value'));
    questionElement.textContent = `Question left: ${question}`;
    timeElement.textContent = `Time: ${time}`;
    time = 0;
    timer = setInterval(() => {
        time++;
        timeElement.textContent = `Time: ${time}`;
    }, 1000);
    checkQuestionCount = setInterval(() => {
        if (question <= 0) {
            clearInterval(timer);
            clearInterval(checkQuestionCount);
            endGame(time, parseInt(selectedQuestionMode.getAttribute('data-value')));
        }
    }, 1000);
}

function checkAnswer() {
    console.log('checkAnswer function called');
    const userAnswer = parseInt(document.getElementById('answer1').value);
    const correctAnswer = parseInt(document.getElementById('questionText').dataset.answer);
    const answerInput = document.getElementById('answer1');
    const autoSubmit = document.getElementById('autoSubmit').checked;

    if (userAnswer === correctAnswer) {
        console.log('Correct');
        if (document.querySelector('.timeMode.selected-mode')) {
            question++;
            questionElement.textContent = `Question No: ${question}`;
        } else if (document.querySelector('.questionMode.selected-mode')) {
            question--;
            questionElement.textContent = `Question Remaining: ${question}`;
            if (question == 0) {
                clearInterval(timer);
                clearInterval(checkQuestionCount);
                endGame(time, parseInt(document.querySelector('.questionMode.selected-mode').getAttribute('data-value')));
                return; // Exit if the game ends
            }
        }
        if (autoSubmit) {
            answerInput.value = ''; // Clear the input
            generateQuestion(); // Automatically generate the next question
            return; // Exit the function early
        }
    } else {
        console.log('Incorrect');
        answerInput.classList.add('incorrect');
        setTimeout(() => {
            answerInput.classList.remove('incorrect');
        }, 500);
    }
    answerInput.value = '';
    answerInput.focus(); // Ensure the input box retains autofocus
}

document.getElementById('answer1').addEventListener('input', function () {
    const autoSubmit = document.getElementById('autoSubmit').checked;
    const userAnswer = parseInt(this.value);
    const correctAnswer = parseInt(document.getElementById('questionText').dataset.answer);

    if (autoSubmit && userAnswer === correctAnswer) {
        checkAnswer(); // Automatically check the answer
    }
});

function endGame(totalTime, totalQuestions) {
    console.log('endGame function called');
    document.getElementById("game-setup").style.display = "none";
    document.getElementById("game-play").style.display = "none";
    document.getElementById("game-result").style.display = "flex";
    document.getElementById("totalTime").textContent = `Total Time: ${totalTime}`;
    document.getElementById("totalQuestion").textContent = `Total Questions: ${totalQuestions}`;

    const correctAnswers = totalQuestions;
    const score = calculateScore(correctAnswers, totalTime); // Remove incorrectAnswers from score calculation
    document.getElementById("score1").textContent = `Score: ${score}`;

    const gameType = document.querySelector('.typeOption.selected').dataset.value;
    const gameName = document.getElementById('title').textContent.split(' ')[0].toLowerCase();
    const highScoreKey = `${gameName}-${gameType}`;
    const highScore = localStorage.getItem(highScoreKey) || 0;

    if (score > highScore) {
        localStorage.setItem(highScoreKey, score);
        document.getElementById("highScore1").textContent = `New High Score: ${score}`;
    } else {
        document.getElementById("highScore1").textContent = `High Score: ${highScore}`;
    }
}

function playAgain() {
    console.log('playAgain function called');
    document.getElementById("game-result").style.display = "none";
    document.getElementById("game-play").style.display = "flex";
    startGame();
}

function backToSetup() {
    console.log('backToSetup function called');
    document.getElementById("game-result").style.display = "none";
    document.getElementById("game-play").style.display = "none";
    document.getElementById("game-setup").style.display = "flex";
    const selectedTimeMode = document.querySelector('.timeMode.selected-mode');
    if (selectedTimeMode) {
        selectedTimeMode.classList.remove('selected-mode');
    }

    const selectedQuestionMode = document.querySelector('.questionMode.selected-mode');
    if (selectedQuestionMode) {
        selectedQuestionMode.classList.remove('selected-mode');
    }

    const selectedQuestionType = document.querySelector('.typeOption.selected');
    if (selectedQuestionType) {
        selectedQuestionType.classList.remove('selected');
    }
}

function calculateScore(correctAnswers, totalTime) { // Remove incorrectAnswers parameter
    console.log('calculateScore function called');
    const score = (correctAnswers * 100) / totalTime; // Adjust score calculation
    return Math.round(score);
}
