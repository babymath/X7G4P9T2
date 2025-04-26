const quizDataFile = "https://raw.githubusercontent.com/babymath/imp-file/refs/heads/main/quizzes.json";

let quizDataCache = null;
let currentQuizzes = [];
let selectedSubjectGlobal = "";

// Cache DOM elements
const subjectFilter = document.getElementById("subjectFilter");
const topicFilter = document.getElementById("topicFilter");
const quizList = document.getElementById("quizList");

// Fetch quiz data once and initialize
fetch(quizDataFile)
  .then((res) => {
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    return res.json();
  })
  .then((data) => {
    quizDataCache = data;
    populateSubjects(data.Subject);
  })
  .catch((err) => {
    console.error("Error loading data:", err);
    showError("Unable to load subjects. Please check your network or the data source URL.");
  });

function populateSubjects(subjects) {
  const uniqueSubjects = new Map();
  subjects.forEach((subject) => {
    const name = subject.Name.trim();
    const key = name.toLowerCase();
    if (subject.Total > 0 && !uniqueSubjects.has(key)) {
      uniqueSubjects.set(key, `${name}${" ".repeat(20 - name.length)}(${subject.Total})`);
    }
  });

  subjectFilter.innerHTML = '<option value="">Select Subject</option>' +
    Array.from(uniqueSubjects.entries())
      .map(([key, text]) => `<option value="${key}">${text}</option>`)
      .join("");
}

subjectFilter.onchange = function () {
  const selectedSubject = this.value;
  selectedSubjectGlobal = selectedSubject;

  const matchedKey = Object.keys(quizDataCache).find(
    key => key.toLowerCase() === selectedSubject.toLowerCase()
  );

  topicFilter.innerHTML = '<option value="All">All</option>';
  quizList.innerHTML = "<p>Loading quizzes...</p>";
  currentQuizzes = [];

  if (matchedKey && quizDataCache[matchedKey]) {
    currentQuizzes = quizDataCache[matchedKey].map((quiz) => ({
      file: quiz.File,
      topic: quiz.Topic,
      id: quiz.Id
    }));
    populateTopicFilter(currentQuizzes);
    showQuizSelection();
  } else {
    quizList.innerHTML = "<p>No quizzes found for this subject.</p>";
  }
};

function populateTopicFilter(quizzes) {
  const uniqueTopics = [...new Set(quizzes.map(q => q.topic))];
  topicFilter.innerHTML = '<option value="All">All</option>' +
    uniqueTopics.map(topic => `<option value="${topic}">${topic}</option>`).join("");
}

topicFilter.onchange = showQuizSelection;

function showQuizSelection() {
  const topicFilterValue = topicFilter.value;
  const filteredQuizzes = topicFilterValue === "All"
    ? currentQuizzes
    : currentQuizzes.filter(q => q.topic === topicFilterValue);

  if (filteredQuizzes.length === 0) {
    quizList.innerHTML = "<p>No quizzes found for the selected topic.</p>";
    return;
  }

  quizList.innerHTML = filteredQuizzes.map(quiz => `
    <button aria-label="Select ${quiz.id} ${quiz.topic}" onclick="loadQuiz('${quiz.file}', '${quiz.id}, ${quiz.topic}')">
      <div style="text-align: left;">
        <strong>${quiz.id}</strong><br>
        <small>${quiz.topic}</small>
      </div>
    </button>
  `).join("");
}

function loadQuiz(fileName, quizTitle) {
  const queryParams = new URLSearchParams({
    quizFile: fileName,
    quizTitle: quizTitle
  }).toString();

  // Reset filters and message
  subjectFilter.value = "";
  topicFilter.innerHTML = '<option value="All">All</option>';
  quizList.innerHTML = "<p>Please select a subject.</p>";

  window.location.href = `quiz.html?${queryParams}`;
}

function showError(message) {
  subjectFilter.innerHTML = '<option value="">Error</option>';
  quizList.innerHTML = `<p style='color: red;'>⚠️ ${message}</p>`;
}