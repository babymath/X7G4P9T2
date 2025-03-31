
function generateQuestion() {
    console.log('generateQuestion function called');
    const selectedQuestionType = document.querySelector('.typeOption.selected');
    let num1, num2;

    function numberToWords(num) {
        const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
        const teens = ["", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
        const tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
        const placeValues = ["", "thousand", "lakh", "crore"];

        function convertLessThanThousand(n) {
            let word = "";
            if (n >= 100) {
                word += ones[Math.floor(n / 100)] + " hundred ";
                n %= 100;
            }
            if (n >= 11 && n <= 19) {
                word += teens[n - 10] + " ";
            } else if (n > 0) {
                word += tens[Math.floor(n / 10)] + " " + ones[n % 10] + " ";
            }
            return word.trim();
        }

        if (num < 10) return ones[num];
        if (num >= 11 && num <= 19) return teens[num - 10];
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? "-" + ones[num % 10] : "");

        let numParts = [];
        let place = 0;

        while (num > 0) {
            let chunk = num % 100;
            if (place === 0) chunk = num % 1000;

            if (chunk > 0) {
                numParts.unshift(convertLessThanThousand(chunk) + (placeValues[place] ? " " + placeValues[place] : ""));
            }

            num = Math.floor(num / (place === 0 ? 1000 : 100));
            place++;
        }

        return numParts.join(" ").trim();
    }

    if (selectedQuestionType.dataset.value === '100') {
        num1 = Math.floor(Math.random() * 99) + 1;
        num2 = numberToWords(num1);
    } else if (selectedQuestionType.dataset.value === '200') {
        num1 = Math.floor(Math.random() * (100000000 - 100 + 1)) + 100;
        num2 = numberToWords(num1);
    } else {
        console.log('No question type is selected');
        return;
    }

    const questionTextElement = document.getElementById('questionText');
    questionTextElement.textContent = `${num2}`;
    questionTextElement.dataset.answer = num1;
}
