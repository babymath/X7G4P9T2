
function generateQuestion() {// Question generation logic
    console.log('generateQuestion function called');
    
    const selectedQuestionType = document.querySelector('.typeOption.selected');
    if (!selectedQuestionType) {
        console.log('No question type is selected');
        return;
    }

    let num1, num2;
    
    function numberToRoman(num) {
        if (num > 3999) {
            console.log('Roman numeral conversion only supports numbers up to 3999.');
            return "Out of range";
        }
        
        const romanNumerals = [
            { value: 1000, symbol: "M" },
            { value: 900, symbol: "CM" },
            { value: 500, symbol: "D" },
            { value: 400, symbol: "CD" },
            { value: 100, symbol: "C" },
            { value: 90, symbol: "XC" },
            { value: 50, symbol: "L" },
            { value: 40, symbol: "XL" },
            { value: 10, symbol: "X" },
            { value: 9, symbol: "IX" },
            { value: 5, symbol: "V" },
            { value: 4, symbol: "IV" },
            { value: 1, symbol: "I" }
        ];
    
        let romanStr = "";
        for (let i = 0; i < romanNumerals.length; i++) {
            while (num >= romanNumerals[i].value) {
                romanStr += romanNumerals[i].symbol;
                num -= romanNumerals[i].value;
            }
        }
        return romanStr;
    }

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    if (selectedQuestionType.dataset.value === '100') {
        num1 = getRandomNumber(1, 99);
    } else if (selectedQuestionType.dataset.value === '200') {
        num1 = getRandomNumber(100, 3999);  // Limited to 3999
    } else {
        console.log('Invalid question type');
        return;
    }

    num2 = numberToRoman(num1);
    if (num2 === "Out of range") return;

    const questionTextElement = document.getElementById('questionText');
    if (!questionTextElement) {
        console.error('Element with id "questionText" not found.');
        return;
    }

    questionTextElement.textContent = `${num2}`;
    questionTextElement.dataset.answer = num1;
}
