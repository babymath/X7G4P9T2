function generateQuestion() {
    console.log('generateQuestion function called');
    const selectedQuestionType = document.querySelector('.typeOption.selected');
    let num1, num2;
    if (selectedQuestionType.dataset.value === '100') {
        num1 = Math.floor(Math.random() * 50 + 51); // num1 will be between 51 and 100
        num2 = Math.floor(Math.random() * 90 + 10); // num2 will be between 10 and 99
    } else if (selectedQuestionType.dataset.value === '200') {
        num1 = Math.floor(Math.random() * 500 + 501); // num1 will be between 501 and 1000
        num2 = Math.floor(Math.random() * 900 + 100); // num2 will be between 100 and 999
    } else {
        console.log('No question type is selected');
    }
    const questionTextElement = document.getElementById('questionText');
    questionTextElement.textContent = `${num1} + ${num2} =`;
    questionTextElement.dataset.answer = num1 + num2;
}