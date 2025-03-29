        const keys = [
            "addition-100", "addition-200", "subtraction-100", "subtraction-200",
            "multiplication-100", "multiplication-200", "lightning-100", "lightning-200",
            "table-100", "table-200", "roman-100", "roman-200", "word-100", "word-200"
        ];

        keys.forEach(key => {
            const highScore = localStorage.getItem(key) || 0;
            document.getElementById(key).textContent = highScore;
        });
