let userLanguage = null;
let quizzes = [];
let selectedQuizIndex = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let resultContent = "";

window.onload = function() {
    fetch("assets/quizzes.json")
        .then(response => response.json())
        .then(data => {
            quizzes = data;
            populateSubjectFilter();
            populateTopicFilter();
            showQuizSelection();
        })
        .catch(error => console.error("Error loading quizzes:", error));

    document.getElementById("subjectFilter").onchange = () => {
        populateTopicFilter(); 
        showQuizSelection(); 
    };
    document.getElementById("topicFilter").onchange = showQuizSelection;
};

function setLang(language) {
    userLanguage = language;
    document.getElementById("langPopup").style.display = "none";
    console.log("Selected Language:", userLanguage);

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

function showQuizSelection() {
    const quizList = document.getElementById("quizList");
    quizList.innerHTML = "";

    const subjectFilter = document.getElementById("subjectFilter").value;
    const topicFilter = document.getElementById("topicFilter").value;

    const filteredQuizzes = quizzes.filter(quiz => {
        const subjectMatch = subjectFilter === "All" || quiz.subject === subjectFilter;
        const topicMatch = topicFilter === "All" || quiz.topic === topicFilter;
        return subjectMatch && topicMatch;
    });

    filteredQuizzes.forEach((quiz, index) => {
        const btn = document.createElement("button");
        btn.textContent = quiz.title;
        btn.onclick = () => loadQuiz(index);
        btn.setAttribute("aria-label", `Select ${quiz.title}`);
        quizList.appendChild(btn);
    });
}

function populateSubjectFilter() {
    const subjectFilter = document.getElementById("subjectFilter");
    const subjects = [...new Set(quizzes.map(quiz => quiz.subject))];
    subjects.forEach(subject => {
        const option = document.createElement("option");
        option.value = subject;
        option.textContent = subject;
        subjectFilter.appendChild(option);
    });
}

function populateTopicFilter() {
    const topicFilter = document.getElementById("topicFilter");
    const subjectFilter = document.getElementById("subjectFilter").value;

    topicFilter.innerHTML = '<option value="All">All</option>';

    // Filter topics based on the selected subject
    const filteredTopics = quizzes
        .filter(quiz => subjectFilter === "All" || quiz.subject === subjectFilter)
        .map(quiz => quiz.topic);

    // Get unique topics
    const uniqueTopics = [...new Set(filteredTopics)];

    uniqueTopics.forEach(topic => {
        const option = document.createElement("option");
        option.value = topic;
        option.textContent = topic;
        topicFilter.appendChild(option);
    });
}

function loadQuiz(index) {
    selectedQuizIndex = index;
    document.getElementById("langPopup").style.display = "flex";
}

function loadQuestion(index) {
    currentQuestionIndex = index;
    const questionData = questions[index];
    if (!questionData) {
        console.error("Question data not found for index:", index);
        return;
    }

    const questionTextElement = document.getElementById("question-text");
    if (userLanguage === "english") {
        questionTextElement.textContent = questionData.questionEnglish || "Question not available in English.";
    } else {
        questionTextElement.textContent = questionData.questionHindi || "Question not available in Hindi.";
    }

    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";

    // Shuffle options
    const shuffledOptions = [...(questionData.options || [])].sort(() => Math.random() - 0.5);

    shuffledOptions.forEach(option => {
        const optionElement = document.createElement("div");
        optionElement.innerHTML = `
            <label>
                <input type="radio" name="answer" value="${option}" ${userAnswers[index] === option ? "checked" : ""} onclick="saveAnswer(${index}, '${option}')">
                <span>${option}</span>
            </label>`;
        optionsContainer.appendChild(optionElement);
    });

    highlightNavButton(index);
}

function saveAnswer(index, answer) {
    userAnswers[index] = answer;
    document.getElementById("nav-" + index).style.background = "lightgreen";
}

function prevQuestion() {
    currentQuestionIndex = (currentQuestionIndex > 0) ? currentQuestionIndex - 1 : questions.length - 1;
    loadQuestion(currentQuestionIndex);
}

function nextQuestion() {
    currentQuestionIndex = (currentQuestionIndex < questions.length - 1) ? currentQuestionIndex + 1 : 0;
    loadQuestion(currentQuestionIndex);
}

function showPreview() {
    let previewContent = "";
    if (userLanguage === "english") {
        questions.forEach((q, i) => {
            const answerStyle = userAnswers[i] ? "color: white;" : "color: #ff7f7f;"; // Light red text for "Not Answered"
            previewContent += `<p style="${answerStyle}">
                <strong>${i + 1}. ${q.questionEnglish}</strong><br> 
                Attempted Answer: ${userAnswers[i] || "Not Answered"}
            </p>`;
        });
    } else {
        questions.forEach((q, i) => {
            const answerStyle = userAnswers[i] ? "color: white;" : "color: #ff7f7f;"; // Light red text for "Not Answered"
            previewContent += `<p style="${answerStyle}">
                <strong>${i + 1}. ${q.questionHindi}</strong><br> 
                Attempted Answer: ${userAnswers[i] || "Not Answered"}
            </p>`;
        });
    }
    document.getElementById("preview-content").innerHTML = previewContent;
    document.getElementById("previewPopup").style.display = "block";
}

function submitQuiz() {
    resultContent = ""; // Reset resultContent before generating new results
    let attempted = 0;
    let correct = 0;
    let wrong = 0;
    let notAnswered = 0;

    questions.forEach((q, i) => {
        const correctAnswer = q.correctAnswer || "N/A"; // Fallback for missing correctAnswer
        if (userAnswers[i]) {
            attempted++;
            if (userAnswers[i] === correctAnswer) {
                correct++;
            } else {
                wrong++;
            }
        } else {
            notAnswered++;
        }
        resultContent += `<p style="border: 2px solid #0056b3; padding: 10px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            <strong>${i + 1}. ${userLanguage === "english" ? q.questionEnglish : q.questionHindi}</strong><br> 
            Your Answer: ${userAnswers[i] || "Not Answered"}<br> 
            Correct Answer: ${correctAnswer}
            <br>
            <button onclick="showGoogleSearch('${encodeURIComponent((userLanguage === "english" ? q.questionEnglish : q.questionHindi) + ' ' + correctAnswer)}')">Search</button>
        </p>`;
    });

    // Hide the test section and show the result section
    document.getElementById("test").style.display = "none";
    document.getElementById("result").style.display = "block";

    const resultsContainer = document.getElementById("results-container");
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <p>Total Attempted: ${attempted}</p>
            <p>Correct Answers: ${correct}</p>
            <p>Incorrect Answers: ${wrong}</p>
            <p>Not Attempted: ${notAnswered}</p>
        `;
    } else {
        console.error("results-container element not found");
    }

    const summaryElement = document.getElementById("summary");
    summaryElement.innerHTML = resultContent;
}

function showGoogleSearch(query) {
    const searchUrl = `https://www.google.com/search?q=${query}`;
    window.open(searchUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
}

function closePopup(popupId, reload = false) {
    document.getElementById(popupId).style.display = 'none';
    if (reload) {
        location.reload();
    }
}

function generateNavigation() {
    const navContainer = document.getElementById("navButtons");
    navContainer.innerHTML = "";
    questions.forEach((_, i) => {
        const btn = document.createElement("button");
        btn.textContent = i + 1;
        btn.onclick = () => loadQuestion(i);
        btn.id = "nav-" + i;
        btn.setAttribute("aria-label", `Question ${i + 1}`);
        navContainer.appendChild(btn);
    });
}

function highlightNavButton(index) {
    const navButtons = document.querySelectorAll(".navigation button");
    navButtons.forEach((btn, i) => {
        btn.style.background = userAnswers[i] ? "lightgreen" : "";
        btn.style.border = "1px solid #ccc"; // Ensure consistent styling
    });
    const currentButton = document.getElementById("nav-" + index);
    if (currentButton) {
        currentButton.style.background = "lightblue";
    }
}
