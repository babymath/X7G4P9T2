let userLanguage = null; // Default to null to force language selection
let quizzes = []; // Initialize quizzes array
let selectedQuizIndex = null; // Store the selected quiz index temporarily

function setLang(language) {
    userLanguage = language;
    document.getElementById("langPopup").style.display = "none"; // Hide language selection popup
    console.log("Selected Language:", userLanguage);

    if (selectedQuizIndex !== null) {
        const selectedQuiz = quizzes[selectedQuizIndex];
        fetch(`questions/${selectedQuiz.file}`)
            .then(response => response.json())
            .then(data => {
                questions = data; // Assign the fetched questions
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

window.onload = function() {
    fetch("assets/quizzes.json") // Fetch quizzes from JSON file
        .then(response => response.json())
        .then(data => {
            quizzes = data; // Assign fetched quizzes
            populateSubjectFilter();
            populateTopicFilter(); // Populate topic filter
            showQuizSelection();
        })
        .catch(error => console.error("Error loading quizzes:", error));

    document.getElementById("subjectFilter").onchange = () => {
        populateTopicFilter(); // Update topics when subject changes
        showQuizSelection();   // Update quiz list
    };
    document.getElementById("topicFilter").onchange = showQuizSelection; // Add onchange for topic filter
};

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

    // Clear existing options
    topicFilter.innerHTML = '<option value="All">All</option>';

    // Filter topics based on the selected subject
    const filteredTopics = quizzes
        .filter(quiz => subjectFilter === "All" || quiz.subject === subjectFilter)
        .map(quiz => quiz.topic);

    // Get unique topics
    const uniqueTopics = [...new Set(filteredTopics)];

    // Populate the topic filter dropdown
    uniqueTopics.forEach(topic => {
        const option = document.createElement("option");
        option.value = topic;
        option.textContent = topic;
        topicFilter.appendChild(option);
    });
}

let currentQuestionIndex = 0;
let userAnswers = [];
let resultContent = "";

function loadQuiz(index) {
    selectedQuizIndex = index; // Store the selected quiz index
    document.getElementById("langPopup").style.display = "flex"; // Show language selection popup
}

function loadQuestion(index) {
    currentQuestionIndex = index;
    const questionData = questions[index];
    if(userLanguage === "english") {
        document.getElementById("question-text").textContent = questionData.questionEnglish;
    } else {
        document.getElementById("question-text").textContent = questionData.questionHindi;
    }
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
    if(userLanguage === "english") {
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
    if(userLanguage === "english") {
        questions.forEach((q, i) => {
            if (userAnswers[i]) {
                attempted++;
                if (userAnswers[i] === q.correctAnswer) {
                    correct++;
                } else {
                    wrong++;
                }
            } else {
                notAnswered++;
            }
            resultContent += `<p style="border: 2px solid #0056b3; padding: 10px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                <strong>${i + 1}. ${q.questionEnglish}</strong><br> 
                Your Answer: ${userAnswers[i] || "Not Answered"}<br> 
                Correct Answer: ${q.correctAnswer}
                <br>
                <button onclick="window.open('https://www.google.com/search?q=${encodeURIComponent(q.questionEnglish + ' ' + q.correctAnswer)}', '_blank')">Search</button>
            </p>`;
        });

        const summaryContent = `
            <p>Attempted: ${attempted}</p>
            <p>Correct: ${correct}</p>
            <p>Wrong: ${wrong}</p>
            <p>Not Answered: ${notAnswered}</p>
        `;

        const submitContentElement = document.getElementById("submit-content");
        const quizSummaryElement = document.getElementById("quiz-summary");

        if (submitContentElement && quizSummaryElement) {
            submitContentElement.innerHTML = resultContent;
            quizSummaryElement.innerHTML = summaryContent;
        } else {
            console.error("submit-content or quiz-summary element not found");
        }

        // Hide the test section and show the result section
        document.getElementById("test").style.display = "none";
        document.getElementById("result").style.display = "block";

        // Update the results-container with summary
        const resultsContainer = document.getElementById("results-container");
        resultsContainer.innerHTML = `
            <p>Total Attempted: ${attempted}</p>
            <p>Correct Answers: ${correct}</p>
            <p>Incorrect Answers: ${wrong}</p>
            <p>Not Attempted: ${notAnswered}</p>
        `;
    } else {
        questions.forEach((q, i) => {
            if (userAnswers[i]) {
                attempted++;
                if (userAnswers[i] === q.correctAnswer) {
                    correct++;
                } else {
                    wrong++;
                }
            } else {
                notAnswered++;
            }
            resultContent += `<p style="border: 2px solid #0056b3; padding: 10px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                <strong>${i + 1}. ${q.questionHindi}</strong><br> 
                Your Answer: ${userAnswers[i] || "Not Answered"}<br> 
                Correct Answer: ${q.correctAnswer}
                <br>
                <button onclick="window.open('https://www.google.com/search?q=${encodeURIComponent(q.questionHindi + ' ' + q.correctAnswer)}', '_blank')">Search</button>
            </p>`;
        });

        const summaryContent = `
            <p>Attempted: ${attempted}</p>
            <p>Correct: ${correct}</p>
            <p>Wrong: ${wrong}</p>
            <p>Not Answered: ${notAnswered}</p>
        `;

        const submitContentElement = document.getElementById("submit-content");
        const quizSummaryElement = document.getElementById("quiz-summary");

        if (submitContentElement && quizSummaryElement) {
            submitContentElement.innerHTML = resultContent;
            quizSummaryElement.innerHTML = summaryContent;
        } else {
            console.error("submit-content or quiz-summary element not found");
        }

        // Hide the test section and show the result section
        document.getElementById("test").style.display = "none";
        document.getElementById("result").style.display = "block";

        // Update the results-container with summary
        const resultsContainer = document.getElementById("results-container");
        resultsContainer.innerHTML = `
            <p>Total Attempted: ${attempted}</p>
            <p>Correct Answers: ${correct}</p>
            <p>Incorrect Answers: ${wrong}</p>
            <p>Not Attempted: ${notAnswered}</p>
        `;
    }
    // Update the summary element with detailed question results
    const summaryElement = document.getElementById("summary");
    summaryElement.innerHTML = resultContent;
}

function closePopup(popupId, reload = false) {
    document.getElementById(popupId).style.display = 'none';
    if (reload) {
        location.reload(); // Reload the page from the start
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
    document.querySelectorAll(".navigation button").forEach((btn, i) => {
        btn.style.background = userAnswers[i] ? "lightgreen" : "";
    });
    document.getElementById("nav-" + index).style.background = "lightblue";
}
