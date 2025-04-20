const subjectFolder = "subject/";
const subjectQuizMap = {
  computer: "computer.json",
  math: "math.json",
  english: "english.json",
  hindi: "hindi.json",
  science: "science.json",
  reasoning: "reasoning.json",
  history: "history.json"
};

let currentQuizzes = [];
let selectedSubjectGlobal = "";

document.getElementById("subjectFilter").onchange = function () {
  const selectedSubject = this.value;
  selectedSubjectGlobal = selectedSubject;
  const topicFilter = document.getElementById("topicFilter");
  topicFilter.innerHTML = '<option value="All">All</option>';
  document.getElementById("quizList").innerHTML = "<p>Loading quizzes...</p>";
  currentQuizzes = [];

  if (selectedSubject) {
    const jsonFilePath = subjectFolder + subjectQuizMap[selectedSubject];
    fetch(jsonFilePath)
      .then((response) => response.json())
      .then((data) => {
        currentQuizzes = data;
        populateTopicFilter(data);
        showQuizSelection();
      })
      .catch((error) => {
        console.error(`Error loading ${selectedSubject} quizzes:`, error);
        document.getElementById("quizList").innerHTML = `<p style='color: red;'>⚠️ Unable to load quizzes.</p>`;
      });
  } else {
    document.getElementById("quizList").innerHTML = "<p>Please select a subject.</p>";
  }
};

function populateTopicFilter(quizzes) {
  const topicFilter = document.getElementById("topicFilter");
  topicFilter.innerHTML = '<option value="All">All</option>';
  const topics = [...new Set(quizzes.map((quiz) => quiz.topic))];
  topics.forEach((topic) => {
    const option = document.createElement("option");
    option.value = topic;
    option.textContent = topic;
    topicFilter.appendChild(option);
  });
}

document.getElementById("topicFilter").onchange = showQuizSelection;

function showQuizSelection() {
  const quizList = document.getElementById("quizList");
  quizList.innerHTML = "";

  const topicFilterValue = document.getElementById("topicFilter").value;

  let filteredQuizzes =
    topicFilterValue === "All"
      ? currentQuizzes
      : currentQuizzes.filter((quiz) => quiz.topic === topicFilterValue);

  if (filteredQuizzes.length === 0) {
    quizList.innerHTML = "<p>No quizzes found for the selected topic.</p>";
  } else {
    filteredQuizzes.forEach((quiz) => {
      const quizTitle = quiz.file.replace(/\.json$/, ''); // Derive quiz title from file name
      const btn = document.createElement("button");
      btn.innerHTML = `<i class="fas fa-clipboard-question"></i> ${quizTitle}`;
      btn.onclick = () => loadQuiz(quiz.file);
      btn.setAttribute("aria-label", `Select ${quizTitle}`);
      quizList.appendChild(btn);
    });
  }
}

function loadQuiz(fileName) {
  const queryParams = new URLSearchParams({
    quizFile: fileName,
  }).toString();

  // Reset filter selections
  document.getElementById("subjectFilter").value = "";
  document.getElementById("topicFilter").innerHTML = '<option value="All">All</option>';
  document.getElementById("quizList").innerHTML = "<p>Please select a subject.</p>";

  window.location.href = `quiz.html?${queryParams}`;
}

document.getElementById("themeToggle").onclick = () => {
  const root = document.documentElement;
  const currentTheme = root.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  root.setAttribute("data-theme", newTheme);

  const icon = document.querySelector("#themeToggle i");
  icon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
};