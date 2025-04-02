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
    const gameKey = document.querySelector('.card.active').dataset.gamekey; // Use gamekey from the active card
    const highScoreKey = `${gameKey}-${selectedGameType}`;
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
    const answerInput = document.getElementById('answer1');
    const userAnswer = parseInt(answerInput.value);
    const correctAnswer = parseInt(document.getElementById('questionText').dataset.answer);
    const autoSubmit = document.getElementById('autoSubmit').checked;

    if (isNaN(userAnswer)) {
        console.log('Invalid input: Answer is not a number');
        answerInput.classList.add('incorrect');
        setTimeout(() => answerInput.classList.remove('incorrect'), 500);
        return;
    }

    if (userAnswer === correctAnswer) {
        console.log('Correct answer');
        if (document.querySelector('.timeMode.selected-mode')) {
            question++;
            questionElement.textContent = `Question No: ${question}`;
        } else if (document.querySelector('.questionMode.selected-mode')) {
            question--;
            questionElement.textContent = `Question Remaining: ${question}`;
            if (question === 0) {
                clearInterval(timer);
                clearInterval(checkQuestionCount);
                endGame(time, parseInt(document.querySelector('.questionMode.selected-mode').getAttribute('data-value')));
                return; // Exit if the game ends
            }
        }
        answerInput.value = ''; // Clear the input
        answerInput.focus(); // Ensure the input box retains autofocus
        generateQuestion(); // Always generate the next question
    } else {
        console.log('Incorrect answer');
        answerInput.classList.add('incorrect');
        setTimeout(() => answerInput.classList.remove('incorrect'), 500);
    }

    answerInput.value = ''; // Clear the input
    answerInput.focus(); // Ensure the input box retains autofocus
}

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
    const gameKey = document.querySelector('.card.active').dataset.gamekey; // Use gamekey from the active card
    const highScoreKey = `${gameKey}-${gameType}`;
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
    
    // Reset selection for all mode buttons (timeMode & questionMode)
    document.querySelectorAll('.mode1').forEach(btn => {
        btn.classList.remove('selected-mode');
        btn.style.background = "";
        btn.style.color = "";
    });
    
    // Reset selection for type option buttons
    document.querySelectorAll('.typeOption').forEach(btn => {
        btn.classList.remove('selected');
        btn.style.background = "";
        btn.style.color = "";
    });
    
    // Optionally reset autoSubmit checkbox
    const autoSubmitCheckbox = document.getElementById('autoSubmit');
    if (autoSubmitCheckbox) {
        autoSubmitCheckbox.checked = false;
    }
}

function calculateScore(correctAnswers, totalTime) { // Remove incorrectAnswers parameter
    console.log('calculateScore function called');
    const score = (correctAnswers * 100) / totalTime; // Adjust score calculation
    return Math.round(score);
}
