const passwordInput =  document.getElementById("password"); // creates variable that calls to password id in html

passwordInput.addEventListener("keydown", function (event) { // listens for user input
    if (event.key === "Enter") { // After user presses enter password is logged
    const password = passwordInput.value; // new variable that gets the current text inside input
    analyzePassword(password); // calls function and passes passwrod as input
    }
    });

function analyzePassword(password) { // simple if function to give score based on length of pass
    let score = 0; // changeable variable set at 0
    if (password.length >=8) { // if the user's password length is greater than or = to 8, + 1 to the score
        score += 1; // adds 1 to current score
    }

    if (password.length >=12 ) { 
        score += 1;
    }

    updateUI(score); // calls function and sends score to it
}

function updateUI(score) {
    const scoreDisplay = document.getElementById("score"); // creates variable that calls to score
    const strengthText = document.getElementById("strength-text"); // creates variable that calls to s-text

    scoreDisplay.textContent = score; // sets the text inside the element

    if (score === 0) {
    strengthText.textContent = "Very weak"; // changes text inside span element
    } else if (score === 1) {
        strengthText.textContent = "Weak";
    } else if (score === 2) {
        strengthText.textContent = "Medium"
    }
    }