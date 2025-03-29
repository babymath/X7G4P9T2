document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    const startGameButton = document.getElementById('startGame');

    function checkEnableStartButton() {
        console.log('checkEnableStartButton function called');
        const selectedMode = document.querySelector('.mode1.selected-mode');
        const selectedType = document.querySelector('.typeOption.selected');
        if (selectedMode && selectedType) {
            startGameButton.disabled = false;
        } else {
            startGameButton.disabled = true;
        }
    }

    function askAutoSubmitPreference() {
        const autoSubmitCheckbox = document.getElementById('autoSubmit');
        const userPreference = confirm('Do you want to play with Auto Submit Answer or Manually?');
        autoSubmitCheckbox.checked = userPreference;
        console.log(`Auto Submit preference set to: ${userPreference}`);
    }

    document.getElementById('modeCheckbox').addEventListener('change', function() {
        console.log('Checkbox state changed');
        if (this.checked) {
            console.log('Question Mode Enabled');
            document.querySelectorAll('.timeMode').forEach(button => {
                button.style.display = 'none';
                button.classList.remove('selected-mode');
                button.style.background = '';
                button.style.color = '';
            });
            document.querySelectorAll('.questionMode').forEach(button => {
                button.style.display = 'block';
            });
        } else {
            console.log('Time Mode Enabled');
            document.querySelectorAll('.timeMode').forEach(button => {
                button.style.display = 'block';
            });
            document.querySelectorAll('.questionMode').forEach(button => {
                button.style.display = 'none';
                button.classList.remove('selected-mode');
                button.style.background = '';
                button.style.color = '';
            });
        }
    });

    document.querySelectorAll('.mode1').forEach(button => {
        button.addEventListener('click', function() {
            console.log('Mode button clicked');
            document.querySelectorAll('.mode1').forEach(btn => {
                btn.classList.remove('selected-mode');
                btn.style.background = '';
                btn.style.color = '';
            });
            this.classList.add('selected-mode');
            this.style.background = 'black';
            this.style.color = 'white';
            checkEnableStartButton();
        });
    });

    document.querySelectorAll('.typeOption').forEach(button => {
        button.addEventListener('click', function() {
            console.log('Type option button clicked');
            document.querySelectorAll('.typeOption').forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            checkEnableStartButton();
        });
    });

    document.getElementById('startGame').addEventListener('click', function() {
        console.log('Start Game button clicked');
        askAutoSubmitPreference(); // Ask user for Auto Submit preference
        startGame();
        document.getElementById('answer1').focus();
    });

    document.getElementById('submit1').addEventListener('click', function() {
        console.log('Submit button clicked');
        checkAnswer();
    });

    document.getElementById('answer1').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            console.log('Enter key pressed');
            checkAnswer();
        }
    });

    document.getElementById('playAgain').addEventListener('click', function() {
        console.log('Play Again button clicked');
        playAgain();
    });

    document.getElementById('backToSetup').addEventListener('click', function() {
        console.log('Back to Setup button clicked');
        backToSetup();
    });
});
