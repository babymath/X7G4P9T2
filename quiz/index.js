const quizDataFile = "https://raw.githubusercontent.com/babymath/imp-file/refs/heads/main/quizzes.json";
const DEFAULT_TOPIC = "All";
const ERROR_OPTION = "Error";

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
    populateSubjects(data);
  })
  .catch((err) => {
    console.error("Error loading data:", err);
    showError("Unable to load subjects. Please check your network or the data source URL.");
  });

function populateSubjects(data) {
  const uniqueSubjects = [...new Set(data.map((quiz) => quiz.subject))];
  const options = uniqueSubjects.map(subject => `<option value="${subject}">${subject}</option>`).join("");
  subjectFilter.innerHTML = `<option value="">Select Subject</option>${options}`;
}

subjectFilter.onchange = debounce(function () {
  const selectedSubject = this.value;
  selectedSubjectGlobal = selectedSubject;

  const filteredQuizzes = quizDataCache.filter(quiz => quiz.subject === selectedSubject);

  if (filteredQuizzes.length > 0) {
    currentQuizzes = filteredQuizzes.map((quiz) => ({
      file: quiz.file,
      topic: quiz.topic,
      id: quiz.id
    }));
    populateTopicFilter(currentQuizzes);
    showQuizSelection();
  } else {
    topicFilter.innerHTML = `<option value="${DEFAULT_TOPIC}">${DEFAULT_TOPIC}</option>`;
    quizList.innerHTML = "<p>No quizzes found for this subject.</p>";
    currentQuizzes = [];
  }
}, 300);

function populateTopicFilter(quizzes) {
  const uniqueTopics = [...new Set(quizzes.map(q => q.topic))];
  const options = uniqueTopics.map(topic => `<option value="${topic}">${topic}</option>`).join("");
  topicFilter.innerHTML = `<option value="${DEFAULT_TOPIC}">${DEFAULT_TOPIC}</option>${options}`;
}

topicFilter.onchange = debounce(showQuizSelection, 300);

function showQuizSelection() {
  const topicFilterValue = topicFilter.value;
  const filteredQuizzes = topicFilterValue === DEFAULT_TOPIC
    ? currentQuizzes
    : currentQuizzes.filter(q => q.topic === topicFilterValue);

  if (filteredQuizzes.length === 0) {
    quizList.innerHTML = "<p>No quizzes found for the selected topic.</p>";
    return;
  }

  const quizButtons = filteredQuizzes.map(quiz => `
    <button aria-label="Select ${quiz.id} ${quiz.topic}" onclick="loadQuiz('${quiz.id}')">
      <div style="text-align: left;">
        <strong>${quiz.id}</strong><br>
        <small>${quiz.topic}</small>
      </div>
    </button>
  `).join("");

  quizList.innerHTML = quizButtons;
}

function loadQuiz(quizId) {
  const queryParams = new URLSearchParams({ id: quizId }).toString();

  // Reset filters and message
  subjectFilter.value = "";
  topicFilter.innerHTML = `<option value="${DEFAULT_TOPIC}">${DEFAULT_TOPIC}</option>`;
  quizList.innerHTML = "<p>Please select a subject.</p>";

  window.location.href = `quiz.html?${queryParams}`;
}

function showError(message) {
  subjectFilter.innerHTML = `<option value="">${ERROR_OPTION}</option>`;
  quizList.innerHTML = `<p style='color: red;'>⚠️ ${message}</p>`;
}

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

document.getElementById("quizList").setAttribute("aria-live", "polite");