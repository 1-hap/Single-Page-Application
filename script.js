const passwordInput =  document.getElementById("password"); // creates variable that calls to password id in html

passwordInput.addEventListener("keydown", function (event) { // listens for user input
    if (event.key === "Enter") { // After user presses enter password is logged
    const password = passwordInput.value; // new variable that gets the current text inside input
    analyzePassword(password); // calls function and passes passwrod as input
    }
    });

function analyzePassword(password) { // simple if function to give score based on length of pass
    let score = 0; // changeable variable set at 0
    let feedback = []

    // Password length check
    if (password.length >=8) { // if the user's password length is greater than or = to 8, + 1 to the score
        score += 1; // adds 1 to current score
    } else {
        feedback.push("Your password should be atleast 8 characters.");
    }

    if (password.length >=12 ) { 
        score += 1;
    }

    // Case checker
    if (/A-Z/.test(password)) { // If the password doesnt include uppercase letters the feedback prints include uppercase
        score += 1;
    } else {
        feedback.push("Add uppercase letters.");
    }

    if (/a-z/.test(password)) { // Same concept as uppercase checker
        score += 1;
    } else {
        feedback.push("Add lowercase letters.")
    }

    // Number checker
    if (/0-9/.test(password)) { // Same concept
        score += 1;
    } else {
        feedback.push("Include numbers.")
    }

    // Special character checker
    if (/[^A-Za-z0-9]/.test(password)) {
        score += 1;
    } else {
        feedback.push("Include special characters.")
    }

    // Common passwords
    const commonPasswords = ["password", "12345678", "qwerty", "password123"]; // If the user inputs these set phrases it prints feedback
    if (commonPasswords.includes(password.toLowerCase())) { 
        score = 0; // Resets score to 0 because its very weak
        feedback.push("This is a very common password");
    }

    // Simple patterns
    if (/123|abc|qwerty/i.test(password)) {
        score -= 1;
        feedback.push("Avoid common patterns like 123 or abc.")
    }

    if (score < 0) score = 0; // Safety to make sure score cant go below 0

    const crackTime = estimateCrackTime(password);

    updateUI(score, feedback, crackTime); // calls function and sends score to it
}

function estimateCrackTime(password) { // Gives estimated crack time based on password length 
    const length = password.length;

    if (length < 6) return "Instantly";
    if (length < 8) return "Seconds";
    if (length < 10) return "Minutes";
    if (length < 12) return "Hours";
    if (length < 14) return "A day";
    return "Days";

}

function updateUI(score) {
    const scoreDisplay = document.getElementById("score"); // creates variable that calls to score
    const strengthText = document.getElementById("strength-text"); // creates variable that calls to s-text
    const feedbackList = document.getElementById("feedback-list");
    const crackTimeDisplay = document.getElementById("crack-time");

    scoreDisplay.textContent = score; // sets the text inside the element

    // Password strength score
    if (score <= 1) {
        strengthText.textContent = "Very Weak";
    } else if (score <= 3) {
        strengthText.textContent = "Weak";
    } else if (score <= 5) {
        strengthText.textContent = "Medium";
    } else {
        strengthText.textContent = "Strong";
    }

    //Crack time
    crackTimeDisplay.textContent = crackTime;

    // Feedback
    feedbackList.innerHTML = "";

    if (feedback.length === 0) {
        feedbackList.innerHTML = "<li>Good password</li>";
    } else {
        feedback.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            feedbackList.appendChild(li);
        });
    }
}