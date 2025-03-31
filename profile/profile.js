        const keys = [
            "111-100", "111-200",
            "222-100", "222-200",
            "333-100", "333-200",
            "444-100", "444-200",
            "555-100", "555-200",
            "666-100", "666-200",
            "777-100", "777-200"
        ];

        keys.forEach(key => {
            const highScore = localStorage.getItem(key) || 0;
            document.getElementById(key).textContent = highScore;
        });
