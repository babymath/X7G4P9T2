const quizDataFile = "quizzes.json"; // Single JSON file containing all quiz data

let currentQuizzes = [];
let selectedSubjectGlobal = "";

document.getElementById("subjectFilter").onchange = function () {
  const selectedSubject = this.value;
  selectedSubjectGlobal = selectedSubject;

  // Convert selectedSubject to title case to match JSON keys
  const normalizedSubject = selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1).toLowerCase();

  const topicFilter = document.getElementById("topicFilter");
  topicFilter.innerHTML = '<option value="All">All</option>';
  document.getElementById("quizList").innerHTML = "<p>Loading quizzes...</p>";
  currentQuizzes = [];

  if (selectedSubject) {
    fetch(quizDataFile)
      .then((response) => response.json())
      .then((data) => {
        const subjectQuizzes = data[normalizedSubject] || [];
        currentQuizzes = subjectQuizzes.map((quiz) => ({
          file: quiz.File,
          topic: quiz.Topic,
        }));
        populateTopicFilter(currentQuizzes);
        showQuizSelection();
      })
      .catch((error) => {
        console.error(`Error loading quizzes:`, error);
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
    const topicCountMap = {};

    filteredQuizzes.forEach((quiz) => {
      const topic = quiz.topic;
      topicCountMap[topic] = (topicCountMap[topic] || 0) + 1;
      const suffix = topicCountMap[topic];

      const quizTitle = `${topic} ${suffix}`; // Button name with topic and suffix
      const btn = document.createElement("button");
      btn.innerHTML = `<i class="fas fa-clipboard-question"></i> ${quizTitle}`;
      btn.onclick = () => loadQuiz(quiz.file, quizTitle); // Pass quizTitle instead of subject
      btn.setAttribute("aria-label", `Select ${quizTitle}`);
      quizList.appendChild(btn);
    });
  }
}

function loadQuiz(fileName, quizTitle) {
  const queryParams = new URLSearchParams({
    quizFile: fileName,
    quizTitle: quizTitle, // Send quizTitle instead of subject
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