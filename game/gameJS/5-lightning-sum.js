
function generateQuestion() {
    console.log('generateQuestion function called');
    const selectedQuestionType = document.querySelector('.typeOption.selected');
    let num1, num2;
    let addends = [];
    const addendCount = Math.floor(Math.random() * 8) + 3; // Random number between 3 and 10
    if (selectedQuestionType.dataset.value === '100') {
        for (let i = 0; i < addendCount; i++) {
            addends.push(Math.floor(Math.random() * 9 + 1)); // Each addend will be between 1 and 9
        }
        num1 = addends.reduce((a, b) => a + b, 0); // Sum of all addends
        num2 = addends.join(' + '); // Join addends with ' + ' for display
    } else if (selectedQuestionType.dataset.value === '200') {
        for (let i = 0; i < addendCount; i++) {
            addends.push(Math.floor(Math.random() * 90 + 10)); // Each addend will be between 10 and 99
        }
        num1 = addends.reduce((a, b) => a + b, 0); // Sum of all addends
        num2 = addends.join(' + '); // Join addends with ' + ' for display
    } else {
        console.log('No question type is selected');
    }
    const questionTextElement = document.getElementById('questionText');
    questionTextElement.textContent = `${num2} =`;
    questionTextElement.dataset.answer = num1;
}
