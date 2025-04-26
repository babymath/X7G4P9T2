let userLanguage = null;
        let questions = [];
        let userAnswers = [];
        let currentQuestionIndex = 0;
        let viewedQuestions = new Set();
        let timerInterval;
        let selectedTime = null;

        let questionKey, optionsKey, answerKey, notAnsweredText, correctText, incorrectText, noOptionsText, timeUpText, timeUpInfoText, quizResultsHeading;

        function setLanguageDependentVariables() {
            const isEnglish = userLanguage === 'english';

            questionKey = isEnglish ? 'questionEnglish' : 'questionHindi';
            optionsKey = isEnglish ? 'optionsEnglish' : 'optionsHindi';
            answerKey = isEnglish ? 'answerEnglish' : 'answerHindi';

            notAnsweredText = isEnglish ? 'Not Answered' : 'उत्तर नहीं दिया';
            correctText = isEnglish ? 'Correct' : 'सही';
            incorrectText = isEnglish ? 'Incorrect' : 'गलत';
            noOptionsText = isEnglish ? 'No options available' : 'कोई विकल्प उपलब्ध नहीं है';
            timeUpText = isEnglish ? 'Time is up!' : 'समय समाप्त!';
            timeUpInfoText = isEnglish ? 'Your answers will be submitted automatically.' : 'आपके उत्तर स्वतः जमा हो जाएंगे।';
            quizResultsHeading = isEnglish ? 'Quiz Results' : 'प्रश्नोत्तरी परिणाम';

            document.getElementById('setup-heading').textContent = isEnglish ? 'Quiz Setup' : 'प्रश्नोत्तरी सेटअप';
            document.querySelector('label[for="lang-group"]').textContent = isEnglish ? '1. Select Language' : '१. भाषा चुनें';
            document.querySelector('label[for="time-input"]').textContent = isEnglish ? '2. Set Time Limit (minutes)' : '२. समय सीमा निर्धारित करें (मिनट)';
            document.getElementById('time-input').placeholder = isEnglish ? 'Enter custom time or select below' : 'कस्टम समय दर्ज करें या नीचे चुनें';
            document.getElementById('error-lang').textContent = isEnglish ? 'Please select a language.' : 'कृपया एक भाषा चुनें।';
            document.getElementById('error-time').textContent = isEnglish ? 'Please enter a valid time or select an option.' : 'कृपया मान्य समय दर्ज करें या कोई विकल्प चुनें।';

            if (document.getElementById('quiz-content').style.display === 'block') {
                 updateQuizContentLanguage();
            }
            if (document.getElementById('result-section').style.display === 'block') {
                document.getElementById('result-heading').textContent = quizResultsHeading;
            }

            document.getElementById('time-up-heading').textContent = timeUpText;
            document.getElementById('time-up-info').textContent = timeUpInfoText;
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


        document.querySelectorAll('.language-button').forEach(button => {
            button.addEventListener('click', function () {
                document.querySelectorAll('.language-button').forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
                userLanguage = this.getAttribute('data-lang');
                errorLangP.style.display = 'none';
                setLanguageDependentVariables();
            });
        });

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

        timeInput.addEventListener('input', function() {
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


        startQuizButton.addEventListener('click', function () {
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
            } else if (customTimeValue === '' && selectedTime === null) {
                timeIsValid = false;
            } else {
                timeIsValid = false;
            }


            const languageIsValid = !!userLanguage;

            errorLangP.style.display = languageIsValid ? 'none' : 'block';
            errorTimeP.style.display = timeIsValid ? 'none' : 'block';


            if (languageIsValid && timeIsValid) {
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
                const quizTitle = urlParams.get('quizTitle'); // Get quizTitle from URL parameters
                loadQuizData(quizFile, quizTitle); // Pass quizTitle instead of quizSubject
            }
        });

        nextQuestionButton.addEventListener('click', () => {
            if (currentQuestionIndex < questions.length - 1) {
                loadQuestion(currentQuestionIndex + 1);

                // Scroll to the last option of the next question
                const options = optionsDiv.querySelectorAll('label');
                if (options.length > 0) {
                    options[options.length - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });

        previewAnswersButton.addEventListener('click', () => {
            const previewContent = questions.map((q, i) => {
                 const questionText = q[questionKey] || `Question ${i+1} text missing`;
                 const userAnswerText = userAnswers[i] || notAnsweredText;
                 const statusClass = userAnswers[i] ? 'answered' : 'not-answered';

                 return `
                    <p class="${statusClass}">
                        <strong>${i + 1}. ${questionText}</strong><br>
                        <span style="color: #555;">Attempted: ${userAnswerText}</span>
                    </p>`;
            }).join('');
            previewContentDiv.innerHTML = previewContent || `<p>No questions to preview.</p>`;
            previewPopupDiv.style.display = 'block';
        });

        submitQuizButton.addEventListener('click', showResults);

        restartButton.addEventListener('click', () => {
            window.location.href = "index.html"; // Redirect to index.html
        });

        clearResponseButton.addEventListener('click', () => {
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
        });

        previewCloseButton.addEventListener('click', () => {
            previewPopupDiv.style.display = 'none';
        });

        timeUpOkButton.addEventListener('click', () => {
            timeUpPopupDiv.style.display = 'none';
            showResults();
        });

        window.addEventListener('load', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const quizFile = urlParams.get('quizFile');
            const quizTitle = urlParams.get('quizTitle'); // Get quizTitle from URL parameters

            if (!quizFile || !quizTitle) {
                window.location.href = 'index.html'; // Redirect to index.html if parameters are missing
            } else {
                loadQuizData(quizFile, quizTitle); // Pass quizTitle instead of quizSubject
            }
        });


        function startTimer(durationInSeconds) {
            timerElement.style.display = 'block';
            let timeRemaining = durationInSeconds;

            function updateDisplay() {
                if (timeRemaining < 0) return;
                const minutes = Math.floor(timeRemaining / 60);
                const seconds = timeRemaining % 60;
                timerElement.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }

            updateDisplay();

            clearInterval(timerInterval);

            timerInterval = setInterval(() => {
                timeRemaining--;
                updateDisplay();

                if (timeRemaining < 0) {
                    clearInterval(timerInterval);
                    timerElement.textContent = `Time Left: 0:00`;
                    timeUpPopupDiv.style.display = 'block';
                }
            }, 1000);
        }

        function loadQuizData(quizFile, quizTitle) {
            const [quizId, topic] = quizTitle.split(',').map(part => part.trim()); // Split quizTitle into id and topic

            quizTitleH2.textContent = `${quizId} (${topic})`; // Display quiz ID and topic

            const fileId = quizFile;
            const callbackName = 'quizDataCallback';

            // Define the callback function
            window[callbackName] = function(data) {
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

            // Create and append the script element
            const script = document.createElement('script');
            script.src = `https://script.google.com/macros/s/AKfycbxYhXVQ9pcqQrhraqUGJtq_o-qFNT2WcInOwMHlqTip8wSGtkq_284lqHdSmU-Te9YA/exec?id=${fileId}&callback=${callbackName}`;
            script.onerror = function() {
                alert("Error loading quiz data. Please check the file ID and try again.");
                quizContentDiv.innerHTML = `<p style="color: red; text-align: center;">Failed to load quiz questions. Please ensure the file ID is correct. <a href="index.html">Go back to selection</a></p>`;
                quizContentDiv.style.display = 'block';
                languageSelectionDiv.style.display = 'none';
            };
            document.body.appendChild(script);
        }

        function loadQuestion(index) {
            if (index < 0 || index >= questions.length) {
                return;
            }
            currentQuestionIndex = index;
            const current = questions[index];

            if (!current || typeof current[questionKey] === 'undefined' || typeof current[optionsKey] === 'undefined') {
                 questionTextH3.textContent = `${index + 1}. Error: Question data not found or incomplete for the selected language.`;
                 optionsDiv.innerHTML = `<p>${noOptionsText}</p>`;
                 nextQuestionButton.disabled = index === questions.length - 1;
                 highlightNavButton(index);
                 markViewed(index);
                 updateNavSummary();
                 return;
            }

            questionTextH3.textContent = `${index + 1}. ${current[questionKey]}`;

            optionsDiv.innerHTML = '';

            const currentOptionsString = current[optionsKey] || '';
            const currentOptions = currentOptionsString.split(',')
                                      .map(opt => opt.trim())
                                      .filter(opt => opt !== '');

            if (currentOptions.length === 0) {
                optionsDiv.innerHTML = `<p>${noOptionsText}</p>`;
            } else {
                currentOptions.forEach((option, i) => {
                    const optionId = `q${index}_option${i}`;

                    const label = document.createElement('label');
                    label.setAttribute('for', optionId);

                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = `answer_${index}`;
                    input.value = option;
                    input.id = optionId;

                    if (userAnswers[index] === option) {
                        input.checked = true;
                    }

                    input.addEventListener('change', () => saveAnswer(index, option));

                    label.appendChild(input);
                    label.appendChild(document.createTextNode(` ${option}`));
                    optionsDiv.appendChild(label);
                });
            }

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
            const quizTitle = urlParams.get('quizTitle'); // Get quizTitle from URL parameters

            const resultsHTML = questions.map((q, i) => {
                const userAnswer = userAnswers[i];
                const correctAnswer = q[answerKey];
                let isCorrect = false;
                let resultStatusHTML = '';

                const questionText = q[questionKey] || `Question ${i+1} text missing`;
                const correctAnswerText = correctAnswer || 'Correct answer data missing';
                const userAnswerText = userAnswer || notAnsweredText;

                if (userAnswer !== null) {
                    attemptedCount++;
                    isCorrect = userAnswer === correctAnswer;
                    if (isCorrect) {
                        correctCount++;
                        resultStatusHTML = `<span class="checkmark">✔️</span> <span style="color: green; font-weight: bold;">${correctText}</span>`;
                    } else {
                        resultStatusHTML = `<span class="cross">❌</span> <span style="color: red; font-weight: bold;">${incorrectText}</span>`;
                    }
                } else {
                    resultStatusHTML = `<span style="color: grey;">${notAnsweredText}</span>`;
                }

                const encodedQuestion = encodeURIComponent(questionText);
                const encodedAnswer = encodeURIComponent(correctAnswerText);
                const searchButtonHTML = `<button onclick="searchGoogle('${encodedQuestion}', '${encodedAnswer}')" style="margin-top: 10px; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Search on Google</button>`;


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
                <strong>${quizResultsHeading} Summary</strong><br>
                Score: ${correctCount} / ${totalQuestions}<br>
                (${correctText}: ${correctCount}, ${incorrectText}: ${incorrectCount}, ${notAnsweredText}: ${notAttemptedCount})
            `;

            // Display quiz title below the results heading
            const resultHeading = document.getElementById('result-heading');
            const quizTitleElement = document.createElement('p');
            quizTitleElement.style.fontSize = '0.9em';
            quizTitleElement.style.color = '#555';
            quizTitleElement.textContent = `Quiz Title: ${quizTitle || 'N/A'}`;
            resultHeading.insertAdjacentElement('afterend', quizTitleElement);

            window.scrollTo(0, 0);
        }

        function searchGoogle(question, answer) {
            const url = `https://www.google.com/search?q=${question}+${answer}`;
            window.open(url, '_blank');
        }