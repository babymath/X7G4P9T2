let userLanguage = null;
let questions = [];
let userAnswers = [];
let currentQuestionIndex = 0;
let viewedQuestions = new Set();
let timerInterval;
let selectedTime = null;

let questionKey, optionsKey, answerKey;

function setLanguageDependentVariables() {
    questionKey = userLanguage === 'hindi' ? 'questionHindi' : 'questionEnglish';
    optionsKey = userLanguage === 'hindi' ? 'optionsHindi' : 'optionsEnglish';
    answerKey = userLanguage === 'hindi' ? 'answerHindi' : 'answerEnglish';

    if (document.getElementById('quiz-content').style.display === 'block') updateQuizContentLanguage();
    if (document.getElementById('result-section').style.display === 'block') {
        document.getElementById('result-heading').textContent = 'Quiz Results';
    }
}

function updateQuizContentLanguage() {
    const timerElement = document.getElementById('timer');
    if (timerElement.style.display === 'block' && timerElement.textContent) {
        const timeValue = timerElement.textContent.split(':').slice(1).join(':').trim();
        if (timeValue) {
            timerElement.textContent = `Time Left: ${timeValue}`;
        }
    }

    updateNavSummary();

    if (questions.length > 0) {
        loadQuestion(currentQuestionIndex);
    }
}

const languageSelectionDiv = document.getElementById('language-selection');
const quizContentDiv = document.getElementById('quiz-content');
const resultSectionDiv = document.getElementById('result-section');
const timeInput = document.getElementById('time-input');
const errorLangP = document.getElementById('error-lang');
const errorTimeP = document.getElementById('error-time');
const startQuizButton = document.getElementById('start-quiz-button');
const timerElement = document.getElementById('timer');
const quizTitleH2 = document.getElementById('quiz-title');
const questionTextH3 = document.getElementById('question-text');
const optionsDiv = document.getElementById('options');
const nextQuestionButton = document.getElementById('next-question');
const navContainer = document.getElementById('navigation-numbers');
const navSummaryDiv = document.getElementById('nav-summary');
const previewPopupDiv = document.getElementById('preview-popup');
const previewContentDiv = document.getElementById('preview-content');
const timeUpPopupDiv = document.getElementById('time-up-popup');
const resultsDiv = document.getElementById('results');
const resultSummaryDiv = document.getElementById('result-summary');
const restartButton = document.getElementById('restart-button');
const clearResponseButton = document.getElementById('clear-response');
const previewAnswersButton = document.getElementById('preview-answers');
const submitQuizButton = document.getElementById('submit-quiz');
const previewCloseButton = document.querySelector('.preview-popup .close-button');
const timeUpOkButton = document.getElementById('time-up-ok');

function initializeLanguageSelection() {
    document.querySelectorAll('.language-button').forEach(button => {
        button.addEventListener('click', function () {
            document.querySelectorAll('.language-button').forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            userLanguage = this.getAttribute('data-lang');
            errorLangP.style.display = 'none';
            setLanguageDependentVariables();
        });
    });
}

function initializeTimeSelection() {
    document.querySelectorAll('.time-button').forEach(button => {
        button.addEventListener('click', function () {
            document.querySelectorAll('.time-button').forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            selectedTime = parseInt(this.dataset.time);
            timeInput.value = selectedTime > 0 ? selectedTime : '';
            timeInput.classList.remove('selected');
            errorTimeP.style.display = 'none';
        });
    });

    timeInput.addEventListener('input', function () {
        document.querySelectorAll('.time-button').forEach(btn => btn.classList.remove('selected'));
        const value = this.value.trim();
        if (value && parseInt(value) > 0) {
            selectedTime = parseInt(value);
            errorTimeP.style.display = 'none';
        } else if (value === '') {
            selectedTime = null;
            errorTimeP.style.display = 'none';
        } else {
            selectedTime = null;
            errorTimeP.style.display = 'block';
        }
    });
}

function initializeStartQuizButton() {
    startQuizButton.addEventListener('click', function () {
        const { timeIsValid, finalTimeInMinutes } = validateTimeSelection();
        const languageIsValid = !!userLanguage;

        errorLangP.style.display = languageIsValid ? 'none' : 'block';
        errorTimeP.style.display = timeIsValid ? 'none' : 'block';

        if (languageIsValid && timeIsValid) {
            startQuiz(finalTimeInMinutes);
        }
    });
}

function validateTimeSelection() {
    let timeIsValid = false;
    let finalTimeInMinutes = null;

    const customTimeValue = timeInput.value.trim();
    const parsedCustomTime = parseInt(customTimeValue);

    if (selectedTime !== null && selectedTime >= 0) {
        timeIsValid = true;
        finalTimeInMinutes = selectedTime;
    } else if (customTimeValue !== '' && !isNaN(parsedCustomTime) && parsedCustomTime > 0) {
        timeIsValid = true;
        finalTimeInMinutes = parsedCustomTime;
        selectedTime = finalTimeInMinutes;
    }

    return { timeIsValid, finalTimeInMinutes };
}

function startQuiz(finalTimeInMinutes) {
    languageSelectionDiv.style.display = 'none';
    quizContentDiv.style.display = 'block';

    updateQuizContentLanguage();

    if (finalTimeInMinutes !== null && finalTimeInMinutes > 0) {
        startTimer(finalTimeInMinutes * 60);
    } else {
        timerElement.style.display = 'none';
    }

    const urlParams = new URLSearchParams(window.location.search);
    const quizFile = urlParams.get('quizFile');
    const quizTitle = urlParams.get('quizTitle');
    loadQuizData(quizFile, quizTitle);
}

function initializeNavigationButtons() {
    nextQuestionButton.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            loadQuestion(currentQuestionIndex + 1);
            scrollToLastOption();
        }
    });

    previewAnswersButton.addEventListener('click', showPreview);
    submitQuizButton.addEventListener('click', showResults);
    restartButton.addEventListener('click', () => window.location.href = "index.html");
    clearResponseButton.addEventListener('click', clearCurrentResponse);
    previewCloseButton.addEventListener('click', () => previewPopupDiv.style.display = 'none');
    timeUpOkButton.addEventListener('click', () => {
        timeUpPopupDiv.style.display = 'none';
        showResults();
    });
}

function scrollToLastOption() {
    const options = optionsDiv.querySelectorAll('label');
    if (options.length > 0) {
        options[options.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function initializePageLoad() {
    window.addEventListener('load', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const quizFile = urlParams.get('quizFile');
        const quizTitle = urlParams.get('quizTitle');

        if (!quizFile || !quizTitle) {
            window.location.href = 'index.html';
        } else {
            loadQuizData(quizFile, quizTitle);
        }
    });
}

function initializeApp() {
    initializeLanguageSelection();
    initializeTimeSelection();
    initializeStartQuizButton();
    initializeNavigationButtons();
    initializePageLoad();
}

initializeApp();

function startTimer(durationInSeconds) {
    timerElement.style.display = 'block';
    let timeRemaining = durationInSeconds;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeRemaining < 0) {
            clearInterval(timerInterval);
            timerElement.textContent = `Time Left: 0:00`;
            timeUpPopupDiv.style.display = 'block';
            return;
        }
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerElement.textContent = `Time Left: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        timeRemaining--;
    }, 1000);
}

function loadQuizData(quizFile, quizTitle) {
    const [quizId, topic] = quizTitle.split(',').map(part => part.trim());

    quizTitleH2.textContent = `${quizId} (${topic})`;

    const fileId = quizFile;
    const callbackName = 'quizDataCallback';

    window[callbackName] = function (data) {
        if (!Array.isArray(data) || data.length === 0) {
            alert("Quiz data is empty or not in the expected array format.");
            quizContentDiv.innerHTML = `<p style="color: red; text-align: center;">Failed to load quiz questions. Please ensure the file exists and is valid JSON. <a href="index.html">Go back to selection</a></p>`;
            quizContentDiv.style.display = 'block';
            languageSelectionDiv.style.display = 'none';
            return;
        }
        questions = data;
        userAnswers = new Array(questions.length).fill(null);
        viewedQuestions.clear();
        currentQuestionIndex = 0;
        generateNavigation();
        loadQuestion(0);
        updateNavSummary();
    };

    const script = document.createElement('script');
    script.src = `https://script.google.com/macros/s/AKfycbxYhXVQ9pcqQrhraqUGJtq_o-qFNT2WcInOwMHlqTip8wSGtkq_284lqHdSmU-Te9YA/exec?id=${fileId}&callback=${callbackName}`;
    script.onerror = function () {
        alert("Error loading quiz data. Please check the file ID and try again.");
        quizContentDiv.innerHTML = `<p style="color: red; text-align: center;">Failed to load quiz questions. Please ensure the file ID is correct. <a href="index.html">Go back to selection</a></p>`;
        quizContentDiv.style.display = 'block';
        languageSelectionDiv.style.display = 'none';
    };
    document.body.appendChild(script);
}

function loadQuestion(index) {
    if (index < 0 || index >= questions.length) return;

    currentQuestionIndex = index;
    const current = questions[index];
    const questionText = current?.[questionKey] || `Error: Question data not found for the selected language.`;
    const options = (current?.[optionsKey] || '').split(',').map(opt => opt.trim()).filter(Boolean);

    questionTextH3.textContent = `${index + 1}. ${questionText}`;
    optionsDiv.innerHTML = options.length
        ? options.map((option, i) => `
            <label for="q${index}_option${i}">
                <input type="radio" name="answer_${index}" value="${option}" id="q${index}_option${i}" ${userAnswers[index] === option ? 'checked' : ''}>
                ${option}
            </label>
        `).join('')
        : `<p>No options available</p>`;

    optionsDiv.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', () => saveAnswer(index, input.value));
    });

    highlightNavButton(index);
    markViewed(index);
    updateNavSummary();
    nextQuestionButton.disabled = index === questions.length - 1;
}

function saveAnswer(index, selectedAnswer) {
    userAnswers[index] = selectedAnswer;
    const navButton = document.getElementById(`nav-button-${index}`);
    if (navButton) {
        navButton.classList.remove('viewed');
        navButton.classList.add('answered');
    }
    viewedQuestions.delete(index);
    updateNavSummary();
}

function generateNavigation() {
    navContainer.innerHTML = '';
    if (questions.length === 0) return;

    questions.forEach((_, i) => {
        const button = document.createElement('button');
        button.id = `nav-button-${i}`;
        button.textContent = i + 1;
        button.setAttribute('aria-label', `Go to question ${i + 1}`);
        button.addEventListener('click', () => loadQuestion(i));
        navContainer.appendChild(button);
    });

    if (questions.length > 0) {
        highlightNavButton(0);
    }
}

function updateNavSummary() {
    if (!questions || questions.length === 0) {
        navSummaryDiv.innerHTML = '';
        return;
    }
    const answeredCount = userAnswers.filter(ans => ans !== null).length;
    const viewedCount = viewedQuestions.size;
    const notVisitedCount = Math.max(0, questions.length - answeredCount - viewedCount);

    navSummaryDiv.innerHTML = `
        <span><span class="dot dot-white"></span> Not Visited: ${notVisitedCount}</span>
        <span><span class="dot dot-yellow"></span> Viewed: ${viewedCount}</span>
        <span><span class="dot dot-green"></span> Answered: ${answeredCount}</span>
    `;
}

function highlightNavButton(index) {
    document.querySelectorAll('#navigation-numbers button').forEach(btn => btn.classList.remove('current'));
    const currentButton = document.getElementById(`nav-button-${index}`);
    if (currentButton) {
        currentButton.classList.add('current');
    }
}

function markViewed(index) {
    if (userAnswers[index] === null) {
        const navButton = document.getElementById(`nav-button-${index}`);
        if (navButton && !navButton.classList.contains('answered') && !navButton.classList.contains('viewed')) {
            if (!viewedQuestions.has(index)) {
                viewedQuestions.add(index);
                navButton.classList.add('viewed');
                updateNavSummary();
            }
        }
    }
}

function showResults() {
    clearInterval(timerInterval);
    timerElement.style.display = 'none';

    let correctCount = 0;
    let attemptedCount = 0;

    const urlParams = new URLSearchParams(window.location.search);
    const quizTitle = urlParams.get('quizTitle');

    const resultsHTML = questions.map((q, i) => {
        const userAnswer = userAnswers[i];
        const correctAnswer = q[answerKey];
        let isCorrect = false;
        let resultStatusHTML = '';

        const questionText = q[questionKey] || `Question ${i + 1} text missing`;
        const correctAnswerText = correctAnswer || 'Correct answer data missing';
        const userAnswerText = userAnswer || 'Not Answered';

        if (userAnswer !== null) {
            attemptedCount++;
            isCorrect = userAnswer === correctAnswer;
            if (isCorrect) {
                correctCount++;
                resultStatusHTML = `<span class="checkmark">✔️</span> <span style="color: green; font-weight: bold;">Correct</span>`;
            } else {
                resultStatusHTML = `<span class="cross">❌</span> <span style="color: red; font-weight: bold;">Incorrect</span>`;
            }
        } else {
            resultStatusHTML = `<span style="color: grey;">Not Answered</span>`;
        }

        const encodedQuestion = encodeURIComponent(questionText);
        const encodedAnswer = encodeURIComponent(correctAnswerText);
        const searchButtonHTML = `<button onclick="showExplanation('${encodedQuestion}', '${encodedAnswer}')" style="margin-top: 10px; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Explanation</button>`;

        return `
            <p>
                <strong>${i + 1}. ${questionText}</strong><br>
                <span style="color: #007bff;">Your Answer: ${userAnswerText}</span><br>
                <span style="color: #28a745;">Correct Answer: ${correctAnswerText}</span><br>
                ${resultStatusHTML}
                ${searchButtonHTML}
            </p>`;
    }).join('');

    quizContentDiv.style.display = 'none';
    resultSectionDiv.style.display = 'block';

    resultsDiv.innerHTML = resultsHTML || `<p>No results to display.</p>`;

    const totalQuestions = questions.length;
    const incorrectCount = attemptedCount - correctCount;
    const notAttemptedCount = totalQuestions - attemptedCount;

    resultSummaryDiv.innerHTML = `
        <strong>Quiz Results Summary</strong><br>
        Score: ${correctCount} / ${totalQuestions}<br>
        (Correct: ${correctCount}, Incorrect: ${incorrectCount}, Not Answered: ${notAttemptedCount})
    `;

    const resultHeading = document.getElementById('result-heading');
    const quizTitleElement = document.createElement('p');
    quizTitleElement.style.fontSize = '0.9em';
    quizTitleElement.style.color = '#555';
    quizTitleElement.textContent = `Quiz Title: ${quizTitle || 'N/A'}`;
    resultHeading.insertAdjacentElement('afterend', quizTitleElement);

    window.scrollTo(0, 0);
}

function showExplanation(question, answer) {
    const url = `https://www.google.com/search?q=${question}+${answer}`;
    window.open(url, '_blank');
}

function showPreview() {
    const previewContent = questions.map((q, i) => {
        const questionText = q[questionKey] || `Question ${i + 1} text missing`;
        const userAnswerText = userAnswers[i] || 'Not Answered';
        const statusClass = userAnswers[i] ? 'answered' : 'not-answered';

        return `
            <p class="${statusClass}">
                <strong>${i + 1}. ${questionText}</strong><br>
                <span style="color: #555;">Attempted: ${userAnswerText}</span>
            </p>`;
    }).join('');
    previewContentDiv.innerHTML = previewContent || `<p>No questions to preview.</p>`;
    previewPopupDiv.style.display = 'block';
}

function clearCurrentResponse() {
    const options = document.querySelectorAll(`#options input[name="answer_${currentQuestionIndex}"]`);
    options.forEach(option => option.checked = false);

    if (userAnswers[currentQuestionIndex] !== null) {
        userAnswers[currentQuestionIndex] = null;
        const navButton = document.getElementById(`nav-button-${currentQuestionIndex}`);
        if (navButton) {
            navButton.classList.remove('answered');
            if (!viewedQuestions.has(currentQuestionIndex)) {
                viewedQuestions.add(currentQuestionIndex);
                navButton.classList.add('viewed');
            } else {
                navButton.classList.add('viewed');
            }
        }
        updateNavSummary();
    }
}