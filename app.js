// State Management
let examsData = {};
let metadata = {};
let currentExam = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let wrongQuestions = [];
let isMarathon = false;

// Timer State
let timerInterval = null;
let timeLeft = 0; // seconds
let startTime = 0;
const EXAM_TIME_LIMIT = 45 * 60; // 45 minutes in seconds

// DOM Elements
const homeView = document.getElementById('home-view');
const quizView = document.getElementById('quiz-view');
const resultView = document.getElementById('result-view');
const examList = document.getElementById('exam-list');
const homeBtn = document.getElementById('home-btn');
const stopBtn = document.getElementById('stop-btn');
const subtitle = document.getElementById('subtitle');
const timerDisplay = document.getElementById('timer');
const progress = document.getElementById('progress');
const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const feedbackContainer = document.getElementById('feedback-container');
const resultStatus = document.getElementById('result-status');
const explanationText = document.getElementById('explanation-text');
const checkBtn = document.getElementById('check-btn');
const nextBtn = document.getElementById('next-btn');
const lastUpdatedSpan = document.getElementById('last-updated');

// Result View Elements
const scoreText = document.getElementById('score-text');
const scorePercentage = document.getElementById('score-percentage');
const timeTakenText = document.getElementById('time-taken-text');
const timeUpMsg = document.getElementById('time-up-msg');
const wrongAnswersContainer = document.getElementById('wrong-answers-container');
const wrongAnswersList = document.getElementById('wrong-answers-list');
const restartBtn = document.getElementById('restart-btn');
const resultHomeBtn = document.getElementById('result-home-btn');

// Home Mode Buttons
const randomExamBtn = document.getElementById('random-exam-btn');
const marathonBtn = document.getElementById('marathon-btn');

// Initialization
async function init() {
    try {
        const response = await fetch('exams.json');
        const data = await response.json();
        examsData = data.exams || data;
        metadata = data.metadata || {};
        
        if (metadata.lastUpdated && lastUpdatedSpan) {
            lastUpdatedSpan.textContent = metadata.lastUpdated;
        }
        
        renderExamList();
    } catch (error) {
        console.error('Failed to load exams data:', error);
        examList.innerHTML = '<p>Error loading exams. Please ensure exams.json exists.</p>';
    }
}

function renderExamList() {
    examList.innerHTML = '';
    Object.keys(examsData).forEach(examNum => {
        const btn = document.createElement('button');
        btn.textContent = `Exam ${examNum}`;
        btn.onclick = () => startExam(examNum);
        examList.appendChild(btn);
    });
}

// Fisher-Yates Shuffle
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function getAllQuestions() {
    let all = [];
    Object.values(examsData).forEach(examQuestions => {
        all = all.concat(examQuestions);
    });
    return all;
}

function startExam(examNum) {
    currentExam = examNum;
    isMarathon = false;
    setupQuiz(shuffle(examsData[examNum]), `Exam ${examNum}`);
}

function startRandomExam() {
    currentExam = 'Random';
    isMarathon = false;
    const all = getAllQuestions();
    const randomSelection = shuffle(all).slice(0, 24);
    setupQuiz(randomSelection, 'Random Exam');
}

function startMarathon() {
    currentExam = 'Marathon';
    isMarathon = true;
    const all = getAllQuestions();
    setupQuiz(shuffle(all), 'Marathon Exam');
}

function setupQuiz(questions, subtitleText) {
    clearInterval(timerInterval);
    currentQuestions = questions;
    currentQuestionIndex = 0;
    score = 0;
    wrongQuestions = [];
    
    homeView.classList.add('hidden');
    resultView.classList.add('hidden');
    quizView.classList.remove('hidden');
    homeBtn.classList.remove('hidden');
    
    if (isMarathon) {
        stopBtn.classList.remove('hidden');
        timerDisplay.classList.add('hidden');
    } else {
        stopBtn.classList.add('hidden');
        startTimer();
    }
    
    subtitle.textContent = subtitleText;
    subtitle.classList.remove('hidden');
    renderQuestion();
}

function startTimer() {
    timeLeft = EXAM_TIME_LIMIT;
    startTime = Date.now();
    timerDisplay.classList.remove('hidden');
    timerDisplay.classList.remove('warning');
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 60) {
            timerDisplay.classList.add('warning');
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showResults(true);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function renderQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    const shuffledAnswers = shuffle(question.answers);
    
    progress.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
    questionText.textContent = question.question;
    answersContainer.innerHTML = '';
    
    feedbackContainer.classList.add('hidden');
    checkBtn.classList.remove('hidden');
    checkBtn.disabled = true;
    nextBtn.classList.add('hidden');

    const correctCount = question.answers.filter(a => a.isCorrect).length;
    const inputType = correctCount > 1 ? 'checkbox' : 'radio';

    shuffledAnswers.forEach((ans, idx) => {
        const label = document.createElement('label');
        label.className = 'answer-option';
        
        const input = document.createElement('input');
        input.type = inputType;
        input.name = 'answer';
        input.value = idx;
        input.dataset.isCorrect = ans.isCorrect;
        
        input.onchange = () => {
            const checked = answersContainer.querySelectorAll('input:checked');
            checkBtn.disabled = checked.length === 0;
            
            answersContainer.querySelectorAll('.answer-option').forEach(l => l.classList.remove('selected'));
            checked.forEach(c => c.parentElement.classList.add('selected'));
        };

        label.appendChild(input);
        label.appendChild(document.createTextNode(ans.text));
        answersContainer.appendChild(label);
    });
}

function checkAnswer() {
    const question = currentQuestions[currentQuestionIndex];
    const inputs = answersContainer.querySelectorAll('input');
    let allCorrect = true;
    let anyWrong = false;

    inputs.forEach(input => {
        const isCorrect = input.dataset.isCorrect === 'true';
        const isChecked = input.checked;
        const label = input.parentElement;

        if (isCorrect) {
            label.classList.add('correct');
            if (!isChecked) allCorrect = false;
        } else {
            if (isChecked) {
                label.classList.add('incorrect');
                anyWrong = true;
            }
        }
        input.disabled = true;
    });

    const success = allCorrect && !anyWrong;
    if (success) {
        score++;
    } else {
        wrongQuestions.push({
            question: question.question,
            correctAnswer: question.answers.filter(a => a.isCorrect).map(a => a.text).join(', '),
            explanation: question.reference
        });
    }

    resultStatus.textContent = success ? '✅ Correct!' : '❌ Incorrect';
    resultStatus.style.color = success ? 'var(--success-color)' : 'var(--danger-color)';
    explanationText.textContent = question.reference || 'No explanation available.';
    
    feedbackContainer.classList.remove('hidden');
    checkBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
    
    feedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        renderQuestion();
        window.scrollTo(0, 0);
    } else {
        showResults();
    }
}

function showResults(isTimeUp = false) {
    clearInterval(timerInterval);
    quizView.classList.add('hidden');
    homeBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');
    timerDisplay.classList.add('hidden');
    resultView.classList.remove('hidden');
    
    subtitle.textContent = 'Results';
    subtitle.classList.remove('hidden');

    if (isTimeUp) {
        timeUpMsg.classList.remove('hidden');
    } else {
        timeUpMsg.classList.add('hidden');
    }
    
    const finalTotal = isMarathon ? (score + wrongQuestions.length) : currentQuestions.length;
    
    const percentage = Math.round((score / finalTotal) * 100) || 0;
    
    scoreText.textContent = `Your Score: ${score}/${finalTotal}`;
    scorePercentage.textContent = `${percentage}%`;

    if (!isMarathon) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        const spentMins = Math.floor(timeSpent / 60);
        const spentSecs = timeSpent % 60;
        timeTakenText.textContent = `Time Taken: ${spentMins.toString().padStart(2, '0')}:${spentSecs.toString().padStart(2, '0')}`;
        timeTakenText.classList.remove('hidden');
    } else {
        timeTakenText.classList.add('hidden');
    }
    
    if (wrongQuestions.length > 0) {
        wrongAnswersContainer.classList.remove('hidden');
        wrongAnswersList.innerHTML = '';
        wrongQuestions.forEach(item => {
            const div = document.createElement('div');
            div.className = 'wrong-item';
            div.innerHTML = `
                <div class="wrong-question">${item.question}</div>
                <div class="correct-answer-was">Correct: ${item.correctAnswer}</div>
                <div class="wrong-explanation">${item.explanation || ''}</div>
            `;
            wrongAnswersList.appendChild(div);
        });
    } else {
        wrongAnswersContainer.classList.add('hidden');
    }
    
    window.scrollTo(0, 0);
}

function goHome() {
    clearInterval(timerInterval);
    homeView.classList.remove('hidden');
    quizView.classList.add('hidden');
    resultView.classList.add('hidden');
    homeBtn.classList.add('hidden');
    stopBtn.classList.add('hidden');
    timerDisplay.classList.add('hidden');
    
    subtitle.textContent = '';
    subtitle.classList.add('hidden');
    
    window.scrollTo(0, 0);
}

function restartExam() {
    if (currentExam === 'Random') {
        startRandomExam();
    } else if (currentExam === 'Marathon') {
        startMarathon();
    } else {
        startExam(currentExam);
    }
}

// Event Listeners
checkBtn.onclick = checkAnswer;
nextBtn.onclick = nextQuestion;
homeBtn.onclick = goHome;
stopBtn.onclick = () => showResults();
randomExamBtn.onclick = startRandomExam;
marathonBtn.onclick = startMarathon;
restartBtn.onclick = restartExam;
resultHomeBtn.onclick = goHome;

// Start the app
init();
