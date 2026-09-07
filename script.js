// ==========================================
// SUPABASE & APP CONFIGURATION
// ==========================================
const SUPABASE_URL = "TERA_SUPABASE_URL_YAHAN"; // Yahan apna URL daal
const SUPABASE_KEY = "TERA_SUPABASE_ANON_KEY_YAHAN"; // Yahan apni Key daal
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper function to get current user from local storage
function getCurrentUser() {
    const user = localStorage.getItem("learnLoopUser");
    return user ? JSON.parse(user) : null;
}

// ==========================================
// INDEX PAGE (Login / Signup)
// ==========================================
function openLogin() { document.getElementById("loginOverlay").style.display = "flex"; }
function closeLogin() { document.getElementById("loginOverlay").style.display = "none"; }

async function login(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) return;

    try {
        // Step 1: Fetch user from DB by email
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email);

        if (error) throw error;

        if (users.length === 0) {
            alert("User not found. Please sign up first.");
            return;
        }

        const user = users[0];

        // Step 2: Compare hashed password
        const isMatch = bcrypt.compareSync(password, user.password_hash);

        if (!isMatch) {
            alert("Incorrect password. Please try again.");
            return;
        }

        // Step 3: Set session in localStorage
        localStorage.setItem("learnLoopUser", JSON.stringify({ id: user.id, email: user.email }));
        
        // Step 4: Check if onboarding is done
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (!profile) {
            window.location.href = "onboarding.html";
        } else {
            window.location.href = "dashboard.html";
        }

    } catch (err) {
        alert("Login Error: " + err.message);
    }
}

// ==========================================
// ONBOARDING PAGE
// ==========================================
function selectSubject(button) { button.classList.toggle("selected"); }
function selectTime(button) {
    document.querySelectorAll(".time-btn").forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");
}

async function saveOnboarding() {
    const year = document.getElementById("year").value;
    const branch = document.getElementById("branch").value;
    const goal = document.getElementById("goal").value;
    const selectedSubjects = document.querySelectorAll(".selection-btn.selected");
    const selectedTime = document.querySelector(".time-btn.selected");

    if (year === "" || branch === "" || goal === "" || selectedSubjects.length === 0 || !selectedTime) {
        alert("Please complete all sections before continuing.");
        return;
    }

    let subjects = [];
    selectedSubjects.forEach(function(button) {
        // Clean emoji and extra spaces from subject
        let text = button.innerText.trim();
        subjects.push(text);
    });

    const user = getCurrentUser();
    if (!user) {
        alert("Session expired. Please login again.");
        window.location.href = "index.html";
        return;
    }

    try {
        // Save profile to Supabase
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                year: year,
                branch: branch,
                subjects: subjects,
                study_time: selectedTime.innerText,
                goal: goal
            });

        if (error) throw error;

        // Log activity
        await supabase.from('activity_logs').insert({
            user_id: user.id,
            activity_text: "Completed Onboarding"
        });

        alert("Great! Your learning journey is personalized 🎯");
        window.location.href = "dashboard.html";

    } catch (err) {
        alert("Error saving data: " + err.message);
    }
}

// ==========================================
// DASHBOARD PAGE (Fetch Real Data)
// ==========================================
async function loadDashboard() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = "index.html";
        return;
    }

    try {
        // Fetch user profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profile) {
            // Update Welcome Name
            const nameElement = document.getElementById("studentName");
            if(nameElement) nameElement.innerText = profile.full_name || "Student";
            
            // Update Streak
            const streakElement = document.getElementById("streakCount");
            if(streakElement) streakElement.innerText = profile.streak || 0;
        }

        // Fetch Quiz Stats
        const { data: quizzes } = await supabase
            .from('quiz_results')
            .select('*')
            .eq('user_id', user.id);

        if (quizzes && quizzes.length > 0) {
            // Calculate total accuracy
            let totalAccuracy = quizzes.reduce((sum, q) => sum + q.accuracy, 0) / quizzes.length;
            const accuracyElement = document.querySelectorAll('.stat-card h3')[1];
            if(accuracyElement) accuracyElement.innerText = Math.round(totalAccuracy) + "%";
        }

    } catch (err) {
        console.error("Error loading dashboard:", err);
    }
}

// ==========================================
// LEARN PAGE
// ==========================================
function showTopics(subject) {
    const topicTitle = document.getElementById("topicTitle");
    if (!topicTitle) return;

    if (subject === "mathematics") topicTitle.innerText = "Engineering Mathematics";
    else if (subject === "physics") topicTitle.innerText = "Engineering Physics";
    else if (subject === "programming") topicTitle.innerText = "Programming";

    document.getElementById("topicsSection").scrollIntoView({ behavior: "smooth" });
}

function openLearning(topic) {
    document.getElementById("popupIcon").innerText = "📖";
    document.getElementById("popupTitle").innerText = "Learning: " + topic;
    document.getElementById("popupMessage").innerText = "Your lesson content for " + topic + " will appear here.";
    document.getElementById("learnPopup").style.display = "flex";
}

function openNotes(topic) {
    document.getElementById("popupIcon").innerText = "📝";
    document.getElementById("popupTitle").innerText = "Handwritten Notes";
    document.getElementById("popupMessage").innerText = "Handwritten notes for " + topic + " will be available here.";
    document.getElementById("learnPopup").style.display = "flex";
}

function showResourceMessage() {
    document.getElementById("popupIcon").innerText = "🎥";
    document.getElementById("popupTitle").innerText = "Learning Resources";
    document.getElementById("popupMessage").innerText = "Useful videos and external learning resources will be added here.";
    document.getElementById("learnPopup").style.display = "flex";
}

function goToPractice() { alert("Practice section will be connected soon! 🧠"); }
function closeLearnPopup() { document.getElementById("learnPopup").style.display = "none"; }

// ==========================================
// AI ASSISTANT
// ==========================================
function quickQuestion(question) {
    document.getElementById("aiQuestion").value = question;
}

async function askLearnLoopAI() {
    const question = document.getElementById("aiQuestion").value.trim();
    const subject = document.getElementById("aiSubject").value;

    if (subject === "") { alert("Please select a subject first."); return; }
    if (question === "") { alert("Please enter your question."); return; }

    let answer = "";

    if (question.toLowerCase().includes("matrix")) {
        answer = "A matrix is a rectangular arrangement of numbers into rows and columns.";
    } else if (question.toLowerCase().includes("eigenvalue")) {
        answer = "An eigenvalue is a special value associated with a square matrix.";
    } else if (question.toLowerCase().includes("variable")) {
        answer = "A variable in C is a named memory location used to store a value.";
    } else {
        answer = "Great question! In the final version, the AI assistant will be connected to a real AI service.";
    }

    document.getElementById("responseText").innerText = answer;
    document.getElementById("aiResponse").style.display = "block";

    // Log to database
    const user = getCurrentUser();
    if (user) {
        await supabase.from('activity_logs').insert({
            user_id: user.id,
            activity_text: `Asked AI: ${question}`
        });
    }
}

function explainSimply() { document.getElementById("responseText").innerText = "In very simple words: the concept becomes easier when we break it into small parts."; }
function giveExample() { document.getElementById("responseText").innerText = "Example: Think of the concept as something you encounter in real life."; }
function givePractice() { document.getElementById("responseText").innerText = "🧠 Practice Question: Explain the concept in your own words."; }

// ==========================================
// DAILY CHALLENGE (Quiz)
// ==========================================
const challengeQuestions = [
    { subject: "Mathematics", question: "What is the order of a matrix having 3 rows and 2 columns?", options: ["2 × 3", "3 × 2", "3 × 3", "2 × 2"], answer: 1 },
    { subject: "Programming", question: "Which symbol is used to end a statement in C?", options: [":", ".", ";", ","], answer: 2 },
    { subject: "Physics", question: "What is the SI unit of force?", options: ["Joule", "Newton", "Watt", "Pascal"], answer: 1 },
    { subject: "Mathematics", question: "Which of the following is a scalar quantity?", options: ["Velocity", "Force", "Acceleration", "Temperature"], answer: 3 },
    { subject: "Programming", question: "Which data type is commonly used to store an integer in C?", options: ["float", "char", "int", "double"], answer: 2 }
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let quizFinished = false;
let timeLeft = 300;
let timerInterval;

function startQuiz() {
    currentQuestion = 0; score = 0; selectedAnswer = null; quizFinished = false; timeLeft = 300;
    document.getElementById("quizCard").style.display = "block";
    document.getElementById("resultCard").style.display = "none";
    loadQuestion(); startTimer();
}

function loadQuestion() {
    const question = challengeQuestions[currentQuestion];
    document.getElementById("questionNumber").innerText = "Question " + (currentQuestion + 1) + " of " + challengeQuestions.length;
    document.getElementById("questionSubject").innerText = question.subject;
    document.getElementById("questionText").innerText = question.question;

    const optionsContainer = document.getElementById("optionsContainer");
    optionsContainer.innerHTML = "";

    question.options.forEach(function(option, index) {
        const button = document.createElement("button");
        button.className = "option-btn";
        button.innerText = String.fromCharCode(65 + index) + ". " + option;
        button.onclick = function() { selectAnswer(index, button); };
        optionsContainer.appendChild(button);
    });

    document.getElementById("answerFeedback").innerText = "";
    selectedAnswer = null;
    const progress = ((currentQuestion + 1) / challengeQuestions.length) * 100;
    document.getElementById("quizProgress").style.width = progress + "%";
}

function selectAnswer(index, button) {
    if (selectedAnswer !== null) return;
    selectedAnswer = index;
    const question = challengeQuestions[currentQuestion];
    const allOptions = document.querySelectorAll(".option-btn");
    allOptions.forEach(function(optionButton) { optionButton.disabled = true; });

    if (index === question.answer) {
        button.classList.add("correct"); score++;
        document.getElementById("answerFeedback").innerText = "✅ Correct! Great job!";
        document.getElementById("answerFeedback").style.color = "#16a34a";
    } else {
        button.classList.add("wrong");
        allOptions[question.answer].classList.add("correct");
        document.getElementById("answerFeedback").innerText = "❌ Not quite. The correct answer is " + question.options[question.answer] + ".";
        document.getElementById("answerFeedback").style.color = "#dc2626";
    }
}

function nextQuestion() {
    if (selectedAnswer === null) { alert("Please select an answer first."); return; }
    if (currentQuestion < challengeQuestions.length - 1) { currentQuestion++; loadQuestion(); } 
    else { finishQuiz(); }
}

async function finishQuiz() {
    clearInterval(timerInterval);
    quizFinished = true;
    document.getElementById("quizCard").style.display = "none";
    document.getElementById("resultCard").style.display = "block";

    const total = challengeQuestions.length;
    const wrong = total - score;
    const accuracy = Math.round((score / total) * 100);

    document.getElementById("finalScore").innerText = score + "/" + total;
    document.getElementById("correctAnswers").innerText = score;
    document.getElementById("wrongAnswers").innerText = wrong;
    document.getElementById("accuracy").innerText = accuracy + "%";

    // SAVE TO DATABASE
    const user = getCurrentUser();
    if (user) {
        try {
            // Save Quiz Result
            await supabase.from('quiz_results').insert({
                user_id: user.id, score: score, total_questions: total, accuracy: accuracy
            });

            // Log Activity
            await supabase.from('activity_logs').insert({
                user_id: user.id,
                activity_text: `Completed Daily Challenge (Score: ${score}/${total})`
            });

            // Update Streak
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (profile) {
                await supabase.from('profiles').update({ streak: (profile.streak || 0) + 1 }).eq('id', user.id);
            }

        } catch (err) {
            console.error("Error saving quiz:", err);
        }
    }

    if (accuracy === 100) document.getElementById("resultMessage").innerText = "Perfect score! You're on fire! 🔥";
    else if (accuracy >= 60) document.getElementById("resultMessage").innerText = "Great work! Keep practicing. 💪";
    else document.getElementById("resultMessage").innerText = "Good attempt! Review the topics. 📚";
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(function() {
        if (timeLeft <= 0) { clearInterval(timerInterval); finishQuiz(); return; }
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById("timer").innerText = "⏱️ " + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
    }, 1000);
}

function restartQuiz() { startQuiz(); }
if (document.getElementById("quizCard")) { startQuiz(); }

// ==========================================
// EXAM MODE & PROFILE & MISC
// ==========================================
function selectExamSubject(button, subject) {
    document.querySelectorAll(".exam-subject").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
}

function showRevision(type) {
    const overlay = document.getElementById("revisionOverlay");
    const title = document.getElementById("revisionTitle");
    const text = document.getElementById("revisionText");

    if (type === "formulas") { title.innerText = "📐 Important Formulas"; text.innerText = "Formula revision content will appear here."; }
    else if (type === "concepts") { title.innerText = "💡 Key Concepts"; text.innerText = "Important concepts for quick revision."; }
    else if (type === "mistakes") { title.innerText = "⚠️ Common Mistakes"; text.innerText = "Common mistakes made by students."; }

    overlay.style.display = "flex";
}

function closeRevision() { document.getElementById("revisionOverlay").style.display = "none"; }
function startExamPractice() { window.location.href = "challenge.html"; }
function showProfileMessage() { document.getElementById("profileOverlay").style.display = "flex"; }
function closeProfileMessage() { document.getElementById("profileOverlay").style.display = "none"; }
function goToLearn() { window.location.href = "learn.html"; }
function startChallenge() { window.location.href = "challenge.html"; }
function askAI() { window.location.href = "ai.html"; }
function examMode() { window.location.href = "exam.html"; }

// ==========================================
// AUTO-RUN ON PAGE LOAD
// ==========================================
window.onload = function() {
    const user = getCurrentUser();
    const currentPage = window.location.pathname.split("/").pop();

    // If user is not logged in, and tries to access protected pages
    if (!user && !["index.html", ""].includes(currentPage)) {
        window.location.href = "index.html";
        return;
    }

    // If on Dashboard, load data
    if (currentPage === "dashboard.html") {
        loadDashboard();
    }
};
