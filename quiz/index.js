const quizDataFile = "https://raw.githubusercontent.com/babymath/imp-file/refs/heads/main/quizzes.json";

let quizDataCache = null;
let currentQuizzes = [];
let selectedSubjectGlobal = "";

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
    showError("subjectFilter", "quizList", "Unable to load subjects. Please check your network or the data source URL.");
  });

function populateSubjects(subjects) {
  const subjectFilter = document.getElementById("subjectFilter");
  subjectFilter.innerHTML = '<option value="">Select Subject</option>';

  const uniqueSubjects = new Set();
  subjects.forEach((subject) => {
    const name = subject.Name.trim();
    const key = name.toLowerCase();
    if (subject.Total > 0 && !uniqueSubjects.has(key)) {
      uniqueSubjects.add(key);
      const option = document.createElement("option");
      option.value = key;
      option.textContent = `${name}${" ".repeat(20 - name.length)}(${subject.Total})`;
      subjectFilter.appendChild(option);
    }
  });
}

document.getElementById("subjectFilter").onchange = function () {
  const selectedSubject = this.value;
  selectedSubjectGlobal = selectedSubject;

  const matchedKey = Object.keys(quizDataCache).find(
    key => key.toLowerCase() === selectedSubject.toLowerCase()
  );

  const topicFilter = document.getElementById("topicFilter");
  topicFilter.innerHTML = '<option value="All">All</option>';
  document.getElementById("quizList").innerHTML = "<p>Loading quizzes...</p>";
  currentQuizzes = [];

  if (matchedKey && quizDataCache[matchedKey]) {
    const subjectQuizzes = quizDataCache[matchedKey];
    currentQuizzes = subjectQuizzes.map((quiz) => ({
      file: quiz.File,
      topic: quiz.Topic,
      id: quiz.Id
    }));
    populateTopicFilter(currentQuizzes);
    showQuizSelection();
  } else {
    document.getElementById("quizList").innerHTML = "<p>No quizzes found for this subject.</p>";
  }
};

function populateTopicFilter(quizzes) {
  const topicFilter = document.getElementById("topicFilter");
  topicFilter.innerHTML = '<option value="All">All</option>';
  const uniqueTopics = [...new Set(quizzes.map(q => q.topic))];
  uniqueTopics.forEach((topic) => {
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
  const filteredQuizzes = topicFilterValue === "All"
    ? currentQuizzes
    : currentQuizzes.filter(q => q.topic === topicFilterValue);

  if (filteredQuizzes.length === 0) {
    quizList.innerHTML = "<p>No quizzes found for the selected topic.</p>";
    return;
  }

  filteredQuizzes.forEach((quiz) => {
    const btn = document.createElement("button");
    btn.innerHTML = `
  <div style="text-align: left;">
    <strong>${quiz.id}</strong><br>
    <small>${quiz.topic}</small>
  </div>
`;
    btn.onclick = () => loadQuiz(quiz.file, `${quiz.id}, ${quiz.topic}`);
    btn.setAttribute("aria-label", `Select ${quiz.id} ${quiz.topic}`);
    quizList.appendChild(btn);
  });
}

function loadQuiz(fileName, quizTitle) {
  const queryParams = new URLSearchParams({
    quizFile: fileName,
    quizTitle: quizTitle
  }).toString();

  // Reset filters and message
  document.getElementById("subjectFilter").value = "";
  document.getElementById("topicFilter").innerHTML = '<option value="All">All</option>';
  document.getElementById("quizList").innerHTML = "<p>Please select a subject.</p>";

  window.location.href = `quiz.html?${queryParams}`;
}

function showError(subjectElementId, quizElementId, message) {
  document.getElementById(subjectElementId).innerHTML = '<option value="">Error</option>';
  document.getElementById(quizElementId).innerHTML = `<p style='color: red;'>⚠️ ${message}</p>`;
}