function openLogin() {
    document.getElementById("loginOverlay").style.display = "flex";
}


function closeLogin() {
    document.getElementById("loginOverlay").style.display = "none";
}


function login(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email && password) {

        alert("Login successful! Welcome to LearnLoop 🚀");

        // Later we will connect this to the backend.
        window.location.href = "onboarding.html";
    }
}
/* =====================================
   ONBOARDING
===================================== */


// Select / deselect subjects

function selectSubject(button) {

    button.classList.toggle("selected");

}


// Select study time

function selectTime(button) {

    const allTimeButtons =
        document.querySelectorAll(".time-btn");

    allTimeButtons.forEach(function(btn) {

        btn.classList.remove("selected");

    });

    button.classList.add("selected");

}


// Save onboarding information

function saveOnboarding() {

    const year =
        document.getElementById("year").value;

    const branch =
        document.getElementById("branch").value;

    const goal =
        document.getElementById("goal").value;


    const selectedSubjects =
        document.querySelectorAll(
            ".selection-btn.selected"
        );


    const selectedTime =
        document.querySelector(".time-btn.selected");


    // Basic validation

    if (
        year === "" ||
        branch === "" ||
        goal === "" ||
        selectedSubjects.length === 0 ||
        !selectedTime
    ) {

        alert(
            "Please complete all sections before continuing."
        );

        return;

    }


    // Collect subjects

    let subjects = [];

    selectedSubjects.forEach(function(button) {

        subjects.push(button.innerText);

    });


    // Store temporarily in browser

    const onboardingData = {

        year: year,

        branch: branch,

        subjects: subjects,

        studyTime: selectedTime.innerText,

        goal: goal

    };


    localStorage.setItem(
        "learnLoopOnboarding",
        JSON.stringify(onboardingData)
    );


    alert(
        "Great! Your learning journey is personalized 🎯"
    );


    // Go to dashboard

    window.location.href = "dashboard.html";

}
/* =====================================
   DASHBOARD
===================================== */


function goToLearn() {

    window.location.href = "learn.html";

}


function startChallenge() {

    window.location.href = "challenge.html";

}


function askAI() {

    window.location.href = "ai.html";

}


function examMode() {

    window.location.href = "exam.html";

}
/* =====================================================
   BLOCK 4 — LEARN PAGE
===================================================== */


/* Show topics for selected subject */

function showTopics(subject) {

    const topicTitle = document.getElementById("topicTitle");

    if (!topicTitle) {
        return;
    }

    if (subject === "mathematics") {

        topicTitle.innerText = "Engineering Mathematics";

    } else if (subject === "physics") {

        topicTitle.innerText = "Engineering Physics";

    } else if (subject === "programming") {

        topicTitle.innerText = "Programming";

    }

    document.getElementById("topicsSection").scrollIntoView({
        behavior: "smooth"
    });
}


/* Open learning popup */

function openLearning(topic) {

    document.getElementById("popupIcon").innerText = "📖";

    document.getElementById("popupTitle").innerText =
        "Learning: " + topic;

    document.getElementById("popupMessage").innerText =
        "Your lesson content for " + topic +
        " will appear here. In the final version, this section will contain explanations, examples and learning resources.";

    document.getElementById("learnPopup").style.display = "flex";
}


/* Open notes */

function openNotes(topic) {

    document.getElementById("popupIcon").innerText = "📝";

    document.getElementById("popupTitle").innerText =
        "Handwritten Notes";

    document.getElementById("popupMessage").innerText =
        "Handwritten notes for " + topic +
        " will be available here after our research team adds the verified SKIT study material.";

    document.getElementById("learnPopup").style.display = "flex";
}


/* Resource message */

function showResourceMessage() {

    document.getElementById("popupIcon").innerText = "🎥";

    document.getElementById("popupTitle").innerText =
        "Learning Resources";

    document.getElementById("popupMessage").innerText =
        "Useful videos and external learning resources will be added here.";

    document.getElementById("learnPopup").style.display = "flex";
}


/* Practice */

function goToPractice() {

    alert("Practice section will be connected to the Question Bank soon! 🧠");

}


/* Close popup */

function closeLearnPopup() {

    document.getElementById("learnPopup").style.display = "none";

}
/* =====================================================
   BLOCK 5 — AI STUDY ASSISTANT
===================================================== */


/* Quick question */

function quickQuestion(question) {

    document.getElementById("aiQuestion").value = question;

}


/* Ask LearnLoop AI */

function askLearnLoopAI() {

    const question =
        document.getElementById("aiQuestion").value.trim();

    const subject =
        document.getElementById("aiSubject").value;

    if (subject === "") {

        alert("Please select a subject first.");
        return;

    }

    if (question === "") {

        alert("Please enter your question.");
        return;

    }


    let answer = "";


    /* Mathematics responses */

    if (
        question.toLowerCase().includes("matrix")
    ) {

        answer =
            "A matrix is a rectangular arrangement of numbers, symbols or expressions organised into rows and columns. For example, a 2 × 2 matrix has 2 rows and 2 columns. Matrices are widely used in engineering, computer science and data processing.";

    }


    else if (
        question.toLowerCase().includes("eigenvalue")
    ) {

        answer =
            "An eigenvalue is a special value associated with a square matrix. It tells us how much a particular eigenvector is stretched or compressed when the matrix transformation is applied.";

    }


    /* Programming responses */

    else if (
        question.toLowerCase().includes("variable")
    ) {

        answer =
            "A variable in C is a named memory location used to store a value. For example, int age = 18; creates a variable called age that stores the integer value 18.";

    }


    /* Physics response */

    else if (
        question.toLowerCase().includes("newton")
    ) {

        answer =
            "Newton's Second Law states that the force acting on an object is equal to its mass multiplied by its acceleration: F = ma. In simple words, greater force produces greater acceleration when mass remains constant.";

    }


    /* Default response */

    else {

        answer =
            "Great question! For the prototype, LearnLoop AI can provide explanations for selected common topics. In the final version, the AI assistant will be connected to a real AI service and will use your learning context to provide personalised explanations.";

    }


    document.getElementById("responseText").innerText = answer;

    document.getElementById("aiResponse").style.display = "block";

}


/* Explain more simply */

function explainSimply() {

    document.getElementById("responseText").innerText =
        "In very simple words: the concept becomes easier when we break it into small parts. LearnLoop AI can explain the topic step-by-step instead of giving you a complicated textbook definition.";

}


/* Give example */

function giveExample() {

    document.getElementById("responseText").innerText =
        "Example: Think of the concept as something you encounter in real life. Connecting a difficult theory with a simple real-world example makes it easier to remember and understand.";

}


/* Give practice question */

function givePractice() {

    document.getElementById("responseText").innerText =
        "🧠 Practice Question: Explain the concept you just learned in your own words and give one example. Try solving it without looking at your notes!";

}
/* =====================================================
   BLOCK 6 — DAILY CHALLENGE
===================================================== */


/* Question Bank */

const challengeQuestions = [

    {
        subject: "Mathematics",
        question: "What is the order of a matrix having 3 rows and 2 columns?",
        options: [
            "2 × 3",
            "3 × 2",
            "3 × 3",
            "2 × 2"
        ],
        answer: 1
    },

    {
        subject: "Programming",
        question: "Which symbol is used to end a statement in C?",
        options: [
            ":",
            ".",
            ";",
            ","
        ],
        answer: 2
    },

    {
        subject: "Physics",
        question: "What is the SI unit of force?",
        options: [
            "Joule",
            "Newton",
            "Watt",
            "Pascal"
        ],
        answer: 1
    },

    {
        subject: "Mathematics",
        question: "Which of the following is a scalar quantity?",
        options: [
            "Velocity",
            "Force",
            "Acceleration",
            "Temperature"
        ],
        answer: 3
    },

    {
        subject: "Programming",
        question: "Which data type is commonly used to store an integer in C?",
        options: [
            "float",
            "char",
            "int",
            "double"
        ],
        answer: 2
    }

];


let currentQuestion = 0;

let score = 0;

let selectedAnswer = null;

let quizFinished = false;

let timeLeft = 300;

let timerInterval;


/* Start Quiz */

function startQuiz() {

    currentQuestion = 0;

    score = 0;

    selectedAnswer = null;

    quizFinished = false;

    timeLeft = 300;

    document.getElementById("quizCard").style.display = "block";

    document.getElementById("resultCard").style.display = "none";

    loadQuestion();

    startTimer();

}


/* Load Question */

function loadQuestion() {

    const question = challengeQuestions[currentQuestion];

    document.getElementById("questionNumber").innerText =
        "Question " +
        (currentQuestion + 1) +
        " of " +
        challengeQuestions.length;

    document.getElementById("questionSubject").innerText =
        question.subject;

    document.getElementById("questionText").innerText =
        question.question;


    const optionsContainer =
        document.getElementById("optionsContainer");

    optionsContainer.innerHTML = "";


    question.options.forEach(function(option, index) {

        const button =
            document.createElement("button");

        button.className = "option-btn";

        button.innerText =
            String.fromCharCode(65 + index) +
            ". " +
            option;

        button.onclick = function() {

            selectAnswer(index, button);

        };

        optionsContainer.appendChild(button);

    });


    document.getElementById("answerFeedback").innerText = "";

    selectedAnswer = null;


    const progress =
        ((currentQuestion + 1) /
        challengeQuestions.length) * 100;

    document.getElementById("quizProgress").style.width =
        progress + "%";

}


/* Select Answer */

function selectAnswer(index, button) {

    if (selectedAnswer !== null) {
        return;
    }


    selectedAnswer = index;


    const question =
        challengeQuestions[currentQuestion];

    const allOptions =
        document.querySelectorAll(".option-btn");


    allOptions.forEach(function(optionButton) {

        optionButton.disabled = true;

    });


    if (index === question.answer) {

        button.classList.add("correct");

        score++;

        document.getElementById("answerFeedback").innerText =
            "✅ Correct! Great job!";

        document.getElementById("answerFeedback").style.color =
            "#16a34a";

    } else {

        button.classList.add("wrong");

        allOptions[question.answer].classList.add("correct");

        document.getElementById("answerFeedback").innerText =
            "❌ Not quite. The correct answer is " +
            question.options[question.answer] + ".";

        document.getElementById("answerFeedback").style.color =
            "#dc2626";

    }

}


/* Next Question */

function nextQuestion() {

    if (selectedAnswer === null) {

        alert("Please select an answer first.");

        return;

    }


    if (currentQuestion <
        challengeQuestions.length - 1) {

        currentQuestion++;

        loadQuestion();

    } else {

        finishQuiz();

    }

}


/* Finish Quiz */

function finishQuiz() {

    clearInterval(timerInterval);

    quizFinished = true;


    document.getElementById("quizCard").style.display =
        "none";

    document.getElementById("resultCard").style.display =
        "block";


    const total =
        challengeQuestions.length;

    const wrong =
        total - score;

    const accuracy =
        Math.round((score / total) * 100);


    document.getElementById("finalScore").innerText =
        score + "/" + total;

    document.getElementById("correctAnswers").innerText =
        score;

    document.getElementById("wrongAnswers").innerText =
        wrong;

    document.getElementById("accuracy").innerText =
        accuracy + "%";


    if (accuracy === 100) {

        document.getElementById("resultMessage").innerText =
            "Perfect score! You're on fire! 🔥";

    } else if (accuracy >= 60) {

        document.getElementById("resultMessage").innerText =
            "Great work! Keep practicing to improve further. 💪";

    } else {

        document.getElementById("resultMessage").innerText =
            "Good attempt! Review the topics and try again. 📚";

    }

}


/* Timer */

function startTimer() {

    clearInterval(timerInterval);


    timerInterval = setInterval(function() {

        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            finishQuiz();

            return;

        }


        timeLeft--;


        const minutes =
            Math.floor(timeLeft / 60);

        const seconds =
            timeLeft % 60;


        document.getElementById("timer").innerText =
            "⏱️ " +
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0");

    }, 1000);

}


/* Restart */

function restartQuiz() {

    startQuiz();

}


/* Automatically start when challenge page opens */

if (document.getElementById("quizCard")) {

    startQuiz();

}
/* =========================================
   BLOCK 7 — EXAM MODE
========================================= */


function selectExamSubject(button, subject) {

    const allSubjects =
        document.querySelectorAll(".exam-subject");

    allSubjects.forEach(function(btn) {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    console.log("Selected subject:", subject);
}


function showRevision(type) {

    const overlay =
        document.getElementById("revisionOverlay");

    const title =
        document.getElementById("revisionTitle");

    const text =
        document.getElementById("revisionText");


    if (type === "formulas") {

        title.innerText = "📐 Important Formulas";

        text.innerText =
            "Formula revision content will appear here. " +
            "For example: Matrix operations, determinants, " +
            "eigenvalue formulas and other important formulas.";

    }


    else if (type === "concepts") {

        title.innerText = "💡 Key Concepts";

        text.innerText =
            "Important concepts for quick revision will " +
            "appear here with short and simple explanations.";

    }


    else if (type === "mistakes") {

        title.innerText = "⚠️ Common Mistakes";

        text.innerText =
            "Common mistakes made by students will appear " +
            "here so you can avoid them during the exam.";

    }


    overlay.style.display = "flex";
}


function closeRevision() {

    document.getElementById(
        "revisionOverlay"
    ).style.display = "none";
}


function startExamPractice() {

    window.location.href = "challenge.html";

}
/* =========================================
   BLOCK 8 — PROFILE
========================================= */

function showProfileMessage() {

    document.getElementById(
        "profileOverlay"
    ).style.display = "flex";

}


function closeProfileMessage() {

    document.getElementById(
        "profileOverlay"
    ).style.display = "none";

}
