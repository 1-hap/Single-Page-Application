const passwordInput =  document.getElementById("password"); // creates variable that calls to password id in html
const toggleBtn = document.getElementById("toggle-btn");

const configUpload = document.getElementById("config-upload");
const downloadBtn = document.getElementById("download-btn");

//default config holds the hardcoded
let config = {
    minLength: 8,
    longLength: 12,
    commonPasswords: ["password", "12345678", "qwerty", "password123"],
    patterns: "123|abc|qwerty"
};

// stores the most recent analysis so the download button has something to save
let lastResult = null;


passwordInput.addEventListener("keydown", function (event) { // listens for user input
    if (event.key === "Enter") { // After user presses enter password is logged
    const password = passwordInput.value; // new variable that gets the current text inside input
    analyzePassword(password); // calls function and passes passwrod as input
    }
    });

    toggleBtn.addEventListener("click", function () {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            toggleBtn.textContent = "hide";
        } else {
            passwordInput.type = "password";
            toggleBtn.textContent = "show";
        }
    });

//handle uploaded config JSON file
configUpload.addEventListener("change", function (event) {
    const file = event.target.files[0]; // grabs the file the user selected
    if (!file) return; // safety check if nothing was selected

    const reader = new FileReader(); // built-in browser tool for reading file contents
    reader.onload = function (e) {
        try {
            const uploaded = JSON.parse(e.target.result); // converts the JSON text into a usable object
            if (uploaded.minLength) config.minLength = uploaded.minLength;
            if (uploaded.longLength) config.longLength = uploaded.longLength;
            if (uploaded.commonPasswords) config.commonPasswords = uploaded.commonPasswords;
            if (uploaded.patterns) config.patterns = uploaded.patterns;
            alert("Config loaded successfully");
        } catch (err) {
            alert("Could not read config file — make sure it's valid JSON");
        }
    };
    reader.readAsText(file); // tells the reader to read the file as plain text
});

// handle download of last analysis as JSON
downloadBtn.addEventListener("click", function () {
    if (!lastResult) { // safety check — nothing to download if no analysis has run
        alert("Analyse a password first before downloading");
        return;
    }

    const jsonString = JSON.stringify(lastResult, null, 2); // turn result into nicely formatted JSON

    const blob = new Blob([jsonString], { type: "application/json" }); // create downloadable file
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a"); // create a hidden link and click it to trigger download
    link.href = url;
    link.download = "password-analysis.json";
    link.click();
    URL.revokeObjectURL(url); // clean up after the download
});
// 


function analyzePassword(password) { // simple if function to give score based on length of pass
    let score = 0; // changeable variable set at 0
    let feedback = []

    // Password length check
    if (password.length >= config.minLength) { // CHANGED: uses config.minLength instead of 8
        score += 1; // adds 1 to current score
    } else {
        feedback.push("Your password should be atleast " + config.minLength + " characters."); // CHANGED: uses config.minLength
    }

    if (password.length >= config.longLength ) { // CHANGED: uses config.longLength instead of 12
        score += 1;
    }

    // Case checker
    if (/[A-Z]/.test(password)) { // If the password doesnt include uppercase letters the feedback prints include uppercase
        score += 1;
    } else {
        feedback.push("Add uppercase letters.");
    }

    if (/[a-z]/.test(password)) { // Same concept as uppercase checker
        score += 1;
    } else {
        feedback.push("Add lowercase letters.")
    }

    // Number checker
    if (/[0-9]/.test(password)) { // Same concept
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
    // uses config.commonPasswords instead of the hardcoded array
    if (config.commonPasswords.includes(password.toLowerCase())) { 
        score = 0; // Resets score to 0 because its very weak
        feedback.push("This is a very common password");
    }

    // Simple patterns
    // builds regex from config.patterns instead of using hardcoded /123|abc|qwerty/i
    const patternRegex = new RegExp(config.patterns, "i");
    if (patternRegex.test(password)) {
        score -= 1;
        feedback.push("Avoid common patterns like 123 or abc.")
    }

    if (score < 0) score = 0; // Safety to make sure score cant go below 0

    const crackTime = estimateCrackTime(password);

    // store the result for download — does NOT include the password itself 
    lastResult = {
        score: score,
        rating: getRating(score),
        crackTime: crackTime,
        feedback: feedback,
        timestamp: new Date().toISOString()
    };
 

    updateUI(score, feedback, crackTime); // calls function and sends score to it
}

// helper function so the rating text can be reused in the download output
function getRating(score) {
    if (score <= 1) return "Very Weak";
    if (score <= 3) return "Weak";
    if (score <= 5) return "Medium";
    return "Strong";
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

function updateUI(score, feedback, crackTime) {
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

    // Strngth bar
    const strengthFill = document.getElementById("strength-fill");
    const percentage = Math.min((score / 6) * 100, 100);
    strengthFill.style.width = percentage + "%";

    if (score <=1) {
        strengthFill.style.backgroundColor = "red";
    } else if (score <= 3) {
        strengthFill.style.backgroundColor = "orange";
    } else if (score <= 5) {
        strengthFill.style.backgroundColor = "gold";
    } else {
        strengthFill.style.backgroundColor = "green";
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