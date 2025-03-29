let userLanguage = localStorage.getItem("userLanguage") || "english"; // Default to English

function setLang(language) {
    userLanguage = language;
    localStorage.setItem("userLanguage", language);
    document.getElementById("langSelection").style.display = "none";
    document.getElementById("quizSelection").style.display = "flex";
    console.log("Selected Language:", userLanguage); // Log after selection
}

// Log userLanguage outside the function
console.log("Global userLanguage:", userLanguage);

function showQuizSelection() {
    const quizList = document.getElementById("quizList");
    quizList.innerHTML = "";

    const subjectFilter = document.getElementById("subjectFilter").value;

    const filteredQuizzes = quizzes.filter(quiz => {
        return (subjectFilter === "All" || quiz.subject === subjectFilter);
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

// Call the function to show quiz selection and populate subject filter on page load
window.addEventListener("load", function() {
    populateSubjectFilter();
    showQuizSelection();
    document.getElementById("subjectFilter").onchange = showQuizSelection;
    document.getElementById("languageFilter") && (document.getElementById("languageFilter").onchange = showQuizSelection);
    
    // Existing langPopup logic if applicable
    if (!localStorage.getItem("userLanguage")) {
        document.getElementById("langPopup") && (document.getElementById("langPopup").style.display = "flex");
    } else {
        document.getElementById("langPopup") && (document.getElementById("langPopup").style.display = "none");
    }
});

let currentQuestionIndex = 0;
let userAnswers = [];
let resultContent = "";

function loadQuiz(index) {
    const selectedQuiz = quizzes[index];
    const scriptElement = document.createElement("script");
    scriptElement.src = `add-questions/${selectedQuiz.file}`;
    scriptElement.onload = () => {
        document.getElementById("quizTitle").textContent = selectedQuiz.title;
        document.getElementById("quizSelection").style.display = "none";
        document.getElementById("test").style.display = "block";
        // Ensure arrow button is shown when test is active
        document.getElementById("arrowButton").style.display = "block";
        userAnswers = new Array(questions.length).fill(null);
        generateNavigation();
        loadQuestion(0);
    };
    document.body.appendChild(scriptElement);
}

function loadQuestion(index) {
    currentQuestionIndex = index;
    const questionData = questions[index];
    if(userLanguage === "english") {
    document.getElementById("question-text").textContent = questionData.questionEnglish;
    }else{
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
        resultContent += `<p>
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
        // Remove the line that shows the submitPopup
        // document.getElementById("submitPopup").style.display = "block";
    } else {
        console.error("submit-content or quiz-summary element not found");
    }

    // Hide the test section and show the result section
    document.getElementById("test").style.display = "none";
    document.getElementById("result").style.display = "flex";

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
            resultContent += `<p>
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
            // Remove the line that shows the submitPopup
            // document.getElementById("submitPopup").style.display = "block";
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

function openSlider() {
    const slider = document.getElementById("sliderWindow");
    // Ensure any "close" class is removed
    slider.classList.remove("close");
    slider.style.display = "block";
    // Trigger animation by adding "open" class after a short delay
    setTimeout(() => {
        slider.classList.add("open");
    }, 10);
    document.getElementById("arrowButton").style.display = "none";
}

function closeSlider() {
    const slider = document.getElementById("sliderWindow");
    // Remove the "open" class and add a "close" class for reverse animation
    slider.classList.remove("open");
    slider.classList.add("close");
    // Wait for the animation duration before hiding the slider
    setTimeout(() => {
        slider.style.display = "none";
        // Remove the "close" class so the slider resets for next open
        slider.classList.remove("close");
        document.getElementById("arrowButton").style.display = "block";
    }, 300);
}

function generateNavigation() {
    const navContainer = document.getElementById("navButtonsSlider");
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
    document.querySelectorAll("#navButtonsSlider button").forEach((btn, i) => {
        btn.style.background = userAnswers[i] ? "lightgreen" : "";
    });
    document.getElementById("nav-" + index).style.background = "lightblue";
}
