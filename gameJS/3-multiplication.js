
function generateQuestion() {
    console.log('generateQuestion function called');
    const selectedQuestionType = document.querySelector('.typeOption.selected');
    let num1, num2;
    if (selectedQuestionType.dataset.value === '100') {
        num1 = Math.floor(Math.random() * 900 + 100); // num1 will be between 100 and 999
        num2 = Math.floor(Math.random() * 8 + 2); // num2 will be between 2 and 9
    } else if (selectedQuestionType.dataset.value === '200') {
        num1 = Math.floor(Math.random() * 90 + 10); // num1 will be between 10 and 99
        num2 = Math.floor(Math.random() * 90 + 10); // num2 will be between 10 and 99
    } else {
        console.log('No question type is selected');
    }
    const questionTextElement = document.getElementById('questionText');
    questionTextElement.textContent = `${num1} × ${num2} =`;
    questionTextElement.dataset.answer = num1 * num2;
}
