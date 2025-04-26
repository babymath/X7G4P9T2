// --- Window onload related code ---
let gameID = new URLSearchParams(window.location.search).get("gameKey");

const games = [
    {
        gamekey: "111",
        title: "➕ Addition Practice ➕",
        script: "1-addition.js",
        type1: "2 digit + 2 digit",
        type2: "3 digit + 3 digit"
    },
    {
        gamekey: "222",
        title: "➖ Subtraction Practice ➖",
        script: "2-subtraction.js",
        type1: "2 digit - 2 digit",
        type2: "3 digit - 3 digit"
    },
    {
        gamekey: "333",
        title: "✖️ Multiplication Practice ✖️",
        script: "3-multiplication.js",
        type1: "3 digit × 1 digit",
        type2: "2 digit × 2 digit"
    },
    {
        gamekey: "444",
        title: "Lightning Sum",
        script: "4-lightning-sum.js",
        type1: "1 to 9",
        type2: "10 to 20"
    },
    {
        gamekey: "555",
        title: "Table Practice",
        script: "5-table-practice.js",
        type1: "1 digit",
        type2: "2 digit"
    },
    {
        gamekey: "666",
        title: "Roman to Number",
        script: "6-number←roman.js",
        type1: "1 to 99",
        type2: "More than 99"
    },
    {
        gamekey: "777",
        title: "Word to Number",
        script: "7-number←word.js",
        type1: "1 to 99",
        type2: "more than 99"
    }
];

games.forEach((game) => {
    if (gameID === game.gamekey) {
        document.getElementById("game").style.display = "flex";
        document.getElementById("title").innerHTML = game.title;
        document.getElementById("type11").innerHTML = game.type1;
        document.getElementById("type12").innerHTML = game.type2;
        const script = document.createElement("script");
        script.src = `gameJS/${game.script}`;
        document.body.appendChild(script);
    }
});

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    const startGameButton = document.getElementById('startGame');

    function checkEnableStartButton() {
        const selectedMode = document.querySelector('.mode1.selected-mode');
        const selectedType = document.querySelector('.typeOption.selected');
        startGameButton.disabled = !(selectedMode && selectedType);
    }

    function askAutoSubmitPreference() {
        const popup = document.getElementById('autoSubmitPopup');
        popup.style.display = 'block';

        document.getElementById('autoSubmitYes').addEventListener('click', () => {
            document.getElementById('autoSubmit').checked = true;
            popup.style.display = 'none';
            startGame();
        });

        document.getElementById('autoSubmitNo').addEventListener('click', () => {
            document.getElementById('autoSubmit').checked = false;
            popup.style.display = 'none';
            startGame();
        });
    }

    document.getElementById('modeCheckbox').addEventListener('change', function() {
        if (this.checked) {
            document.querySelectorAll('.timeMode').forEach(button => {
                button.style.display = 'none';
                button.classList.remove('selected-mode');
            });
            document.querySelectorAll('.questionMode').forEach(button => {
                button.style.display = 'block';
            });
        } else {
            document.querySelectorAll('.timeMode').forEach(button => {
                button.style.display = 'block';
            });
            document.querySelectorAll('.questionMode').forEach(button => {
                button.style.display = 'none';
                button.classList.remove('selected-mode');
            });
        }
        checkEnableStartButton(); // Disable the "Start" button
    });

    document.querySelectorAll('.mode1').forEach(button => {
        button.addEventListener('click', function() {
            if (this.classList.contains('selected-mode')) {
                this.classList.remove('selected-mode');
            } else {
                document.querySelectorAll('.mode1').forEach(btn => btn.classList.remove('selected-mode'));
                this.classList.add('selected-mode');
            }
            checkEnableStartButton();
        });
    });

    document.querySelectorAll('.typeOption').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.typeOption').forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            checkEnableStartButton();
        });
    });

    document.getElementById('startGame').addEventListener('click', function() {
        askAutoSubmitPreference();
        document.getElementById('answer1').focus();
    });

    document.getElementById('submit1').addEventListener('click', function() {
        checkAnswer();
    });

    document.getElementById('answer1').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            checkAnswer();
        }
    });

    document.getElementById('answer1').addEventListener('input', function () {
        const autoSubmit = document.getElementById('autoSubmit').checked;
        const userAnswer = parseInt(this.value);
        const correctAnswer = parseInt(document.getElementById('questionText').dataset.answer);

        if (autoSubmit && userAnswer === correctAnswer) {
            checkAnswer();
        }
    });

    document.getElementById('playAgain').addEventListener('click', function() {
        playAgain();
    });
});

// --- Functions ---
let question = 1;
let timer;
let checkQuestionCount;
let time;

const questionElement = document.getElementById('question1');
const timeElement = document.getElementById('time1');

function startGame() {
    time = 1;
    question = 1;
    document.getElementById("game-setup").style.display = "none";
    document.getElementById("game-result").style.display = "none";
    document.getElementById("game-play").style.display = "flex";

    const selectedTimeMode = document.querySelector('.timeMode.selected-mode');
    const selectedQuestionMode = document.querySelector('.questionMode.selected-mode');
    const selectedGameType = document.querySelector('.typeOption.selected').dataset.value;
    const highScoreKey = `${gameID}-${selectedGameType}`;
    const params = new URLSearchParams(window.location.search);
    const highScore = params.get(highScoreKey) || 0;

    document.getElementById("highScore1").textContent = `High Score: ${highScore}`;

    if (selectedTimeMode) {
        initializeTimeMode(selectedTimeMode);
    } else if (selectedQuestionMode) {
        initializeQuestionMode(selectedQuestionMode);
    }

    generateQuestion();
}

function initializeTimeMode(selectedTimeMode) {
    time = parseInt(selectedTimeMode.getAttribute('data-value'));
    questionElement.textContent = `Question No: ${question}`;
    timeElement.textContent = `Time Left: ${time}`;
    timer = setInterval(() => {
        time--;
        timeElement.textContent = `Time Left: ${time}`;
        if (time <= 0) {
            clearInterval(timer);
            endGame(parseInt(selectedTimeMode.getAttribute('data-value')), question - 1);
        }
    }, 1000);
}

function initializeQuestionMode(selectedQuestionMode) {
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
    const answerInput = document.getElementById('answer1');
    const userAnswer = parseInt(answerInput.value);
    const correctAnswer = parseInt(document.getElementById('questionText').dataset.answer);

    if (isNaN(userAnswer)) {
        answerInput.classList.add('incorrect');
        setTimeout(() => answerInput.classList.remove('incorrect'), 500);
        return;
    }

    if (userAnswer === correctAnswer) {
        if (document.querySelector('.timeMode.selected-mode')) {
            question++;
            questionElement.textContent = `Question No: ${question}`;
        } else if (document.querySelector('.questionMode.selected-mode')) {
            question--;
            questionElement.textContent = `Question Left: ${question}`;
            if (question === 0) {
                clearInterval(timer);
                clearInterval(checkQuestionCount);
                endGame(time, parseInt(document.querySelector('.questionMode.selected-mode').getAttribute('data-value')));
                return;
            }
        }
        answerInput.value = '';
        answerInput.focus();
        generateQuestion();
    } else {
        answerInput.classList.add('incorrect');
        setTimeout(() => answerInput.classList.remove('incorrect'), 500);
    }

    answerInput.value = '';
    answerInput.focus();
}

function endGame(totalTime, totalQuestions) {
    document.getElementById("game-setup").style.display = "none";
    document.getElementById("game-play").style.display = "none";
    document.getElementById("game-result").style.display = "flex";
    document.getElementById("totalTime").textContent = `Total Time: ${totalTime}`;
    document.getElementById("totalQuestion").textContent = `Total Questions: ${totalQuestions}`;

    const correctAnswers = totalQuestions;
    const score = calculateScore(correctAnswers, totalTime);
    document.getElementById("score1").textContent = `Score: ${score}`;

    const gameType = document.querySelector('.typeOption.selected').dataset.value;
    const highScoreKey = `${gameID}-${gameType}`;
    const highScore = localStorage.getItem(highScoreKey) || 0;

    if (score > highScore) {
        localStorage.setItem(highScoreKey, score);
        document.getElementById("highScore1").textContent = `New High Score: ${score}`;
    } else {
        document.getElementById("highScore1").textContent = `High Score: ${highScore}`;
    }

    if (typeof uploadToDatabase === 'function') {
        uploadToDatabase();
    }
}

function playAgain() {
    window.location.href = 'index.html';
}

function calculateScore(correctAnswers, totalTime) {
    const score = (correctAnswers * 100) / totalTime;
    return Math.round(score);
}
