let userLanguage = null; let quizzes = []; let selectedQuizIndex = null; let currentQuestionIndex = 0; let userAnswers = []; let resultContent = "";

// Load quizzes on page load 
window.onload = function () { fetch("assets/quizzes.json") .then(response => response.json()) .then(data => { quizzes = data; populateSubjectFilter(); populateTopicFilter(); showQuizSelection(); }) .catch(error => console.error("Error loading quizzes:", error));

document.getElementById("subjectFilter").onchange = () => {
    populateTopicFilter();
    showQuizSelection();
};
document.getElementById("topicFilter").onchange = showQuizSelection;

};

function setLang(language) { userLanguage = language; document.getElementById("langPopup").style.display = "none";

if (selectedQuizIndex !== null) {
    const selectedQuiz = quizzes[selectedQuizIndex];
    fetch(`questions/${selectedQuiz.file}`)
        .then(response => response.json())
        .then(data => {
            questions = data;
            document.getElementById("quizTitle").textContent = selectedQuiz.title;
            document.getElementById("quizSelection").style.display = "none";
            document.getElementById("test").style.display = "block";
            userAnswers = new Array(questions.length).fill(null);
            generateNavigation();
            loadQuestion(0);
        })
        .catch(error => console.error("Error loading quiz:", error));
}

}

function showQuizSelection() { const quizList = document.getElementById("quizList"); quizList.innerHTML = "";

const subjectFilter = document.getElementById("subjectFilter").value;
const topicFilter = document.getElementById("topicFilter").value;

const filteredQuizzes = quizzes.filter(quiz => 
    (subjectFilter === "All" || quiz.subject === subjectFilter) &&
    (topicFilter === "All" || quiz.topic === topicFilter)
);

filteredQuizzes.forEach((quiz, index) => {
    const btn = document.createElement("button");
    btn.textContent = quiz.title;
    btn.onclick = () => loadQuiz(index);
    btn.setAttribute("aria-label", `Select ${quiz.title}`);
    quizList.appendChild(btn);
});

}

function populateSubjectFilter() { const subjectFilter = document.getElementById("subjectFilter"); const subjects = [...new Set(quizzes.map(quiz => quiz.subject))]; subjects.forEach(subject => { const option = document.createElement("option"); option.value = subject; option.textContent = subject; subjectFilter.appendChild(option); }); }

function populateTopicFilter() { const topicFilter = document.getElementById("topicFilter"); const subjectFilter = document.getElementById("subjectFilter").value; topicFilter.innerHTML = '<option value="All">All</option>';

const uniqueTopics = [...new Set(quizzes
    .filter(quiz => subjectFilter === "All" || quiz.subject === subjectFilter)
    .map(quiz => quiz.topic))];

uniqueTopics.forEach(topic => {
    const option = document.createElement("option");
    option.value = topic;
    option.textContent = topic;
    topicFilter.appendChild(option);
});

}

function loadQuiz(index) { selectedQuizIndex = index; document.getElementById("langPopup").style.display = "flex"; }

function loadQuestion(index) { currentQuestionIndex = index; const questionData = questions[index]; document.getElementById("question-text").textContent = userLanguage === "english" ? questionData.questionEnglish : questionData.questionHindi;

const optionsContainer = document.getElementById("options-container");
optionsContainer.innerHTML = "";

questionData.options.forEach(option => {
    const optionElement = document.createElement("div");
    optionElement.innerHTML = `
        <label>
            <input type="radio" name="answer" value="${option}" ${userAnswers[index] === option ? "checked" : ""} onclick="saveAnswer(${index}, '${option}')">
            ${option}
        </label>`;
    optionsContainer.appendChild(optionElement);
});
highlightNavButton(index);

}

function saveAnswer(index, answer) { userAnswers[index] = answer; document.getElementById("nav-" + index).style.background = "lightgreen"; }

function prevQuestion() { loadQuestion(currentQuestionIndex > 0 ? currentQuestionIndex - 1 : questions.length - 1); }

function nextQuestion() { loadQuestion(currentQuestionIndex < questions.length - 1 ? currentQuestionIndex + 1 : 0); }

function generateNavigation() { const navContainer = document.getElementById("navButtons"); navContainer.innerHTML = ""; questions.forEach((_, i) => { const btn = document.createElement("button"); btn.textContent = i + 1; btn.onclick = () => loadQuestion(i); btn.id = "nav-" + i; btn.setAttribute("aria-label", Question ${i + 1}); navContainer.appendChild(btn); }); }

function highlightNavButton(index) { document.querySelectorAll(".navigation button").forEach((btn, i) => { btn.style.background = userAnswers[i] ? "lightgreen" : ""; }); document.getElementById("nav-" + index).style.background = "lightblue"; }

