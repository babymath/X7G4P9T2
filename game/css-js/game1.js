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
        const popup = document.createElement('div');
        popup.id = 'autoSubmitPopup';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.background = 'linear-gradient(135deg, #4e54c8, #8f94fb)';
        popup.style.color = 'white';
        popup.style.padding = '30px';
        popup.style.borderRadius = '15px';
        popup.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
        popup.style.textAlign = 'center';
        popup.style.zIndex = '1000';
        popup.innerHTML = `
            <h2 style="margin-bottom: 20px; font-family: Arial, sans-serif;">Choose Your Play Mode</h2>
            <p style="margin-bottom: 30px; font-size: 16px; font-family: Arial, sans-serif;">Do you want to play with Auto Submit Answer or Manually?</p>
            <button id="autoSubmitYes" style="margin-right: 10px; padding: 10px 20px; font-size: 16px; border: none; border-radius: 5px; background: #28a745; color: white; cursor: pointer; font-family: Arial, sans-serif;">Auto Submit</button>
            <button id="autoSubmitNo" style="padding: 10px 20px; font-size: 16px; border: none; border-radius: 5px; background: #dc3545; color: white; cursor: pointer; font-family: Arial, sans-serif;">Manual Submit</button>
        `;

        document.body.appendChild(popup);

        document.getElementById('autoSubmitYes').addEventListener('click', () => {
            document.getElementById('autoSubmit').checked = true;
            document.body.removeChild(popup);
            startGame(); // Start the game after selection
        });

        document.getElementById('autoSubmitNo').addEventListener('click', () => {
            document.getElementById('autoSubmit').checked = false;
            document.body.removeChild(popup);
            startGame(); // Start the game after selection
        });
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
        askAutoSubmitPreference(); // Show popup for Auto Submit preference
        document.getElementById('answer1').focus();
    });

    // Event Listener for the answer  checking

    document.getElementById('submit1').addEventListener('click', function() {
        console.log('Submit button clicked');
        checkAnswer(); // Ensure this function is called
    });

    document.getElementById('answer1').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            console.log('Enter key pressed');
            event.preventDefault(); // Prevent default form submission behavior
            checkAnswer(); // Ensure this function is called
        }
    });

    document.getElementById('answer1').addEventListener('input', function () {
        const autoSubmit = document.getElementById('autoSubmit').checked;
        const userAnswer = parseInt(this.value);
        const correctAnswer = parseInt(document.getElementById('questionText').dataset.answer);
    
        if (autoSubmit && userAnswer === correctAnswer) {
            checkAnswer(); // Automatically check the answer
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

    // Add event listener for "Back to Menu" button
    document.getElementById('backToMenu').addEventListener('click', function() {
        console.log('Back to Menu button clicked');
        location.reload(); // Reload the index.html
    });
});
