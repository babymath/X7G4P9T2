
function generateQuestion() {
    console.log('generateQuestion function called');
    const selectedQuestionType = document.querySelector('.typeOption.selected');
    let num1, num2;
    if (selectedQuestionType.dataset.value === '100') {
        num1 = Math.floor(Math.random() * 90) + 10; // Random two-digit number (10-99)
        num2 = Math.floor(Math.random() * (num1 - 10)) + 10; // Smaller two-digit number
    } else if (selectedQuestionType.dataset.value === '200') {
        num1 = Math.floor(Math.random() * 900) + 100; // Random three-digit number (100-999)
        num2 = Math.floor(Math.random() * (num1 - 100)) + 100; // Smaller three-digit number
    } else {
        console.log('No question type is selected');
    }
    const questionTextElement = document.getElementById('questionText');
    questionTextElement.textContent = `${num1} - ${num2} =`;
    questionTextElement.dataset.answer = num1 - num2;
}