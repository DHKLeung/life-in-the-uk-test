// State Management
let examsData = {};
let metadata = {};
let currentExam = null;
let currentQuestions = [];
let currentQuestionIndex = 0;

// DOM Elements
const homeView = document.getElementById('home-view');
const quizView = document.getElementById('quiz-view');
const examList = document.getElementById('exam-list');
const homeBtn = document.getElementById('home-btn');
const title = document.getElementById('title');
const progress = document.getElementById('progress');
const questionText = document.getElementById('question-text');
const answersContainer = document.getElementById('answers-container');
const feedbackContainer = document.getElementById('feedback-container');
const resultStatus = document.getElementById('result-status');
const explanationText = document.getElementById('explanation-text');
const checkBtn = document.getElementById('check-btn');
const nextBtn = document.getElementById('next-btn');
const lastUpdatedSpan = document.getElementById('last-updated');

// Initialization
async function init() {
    try {
        const response = await fetch('exams.json');
        const data = await response.json();
        examsData = data.exams || data; // Handle old and new formats
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

function startExam(examNum) {
    currentExam = examNum;
    // Clone and shuffle questions
    currentQuestions = shuffle(examsData[examNum]);
    currentQuestionIndex = 0;
    
    homeView.classList.add('hidden');
    quizView.classList.remove('hidden');
    homeBtn.classList.remove('hidden');
    title.textContent = `Exam ${examNum}`;
    
    renderQuestion();
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
            
            // Highlight selected
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
    resultStatus.textContent = success ? '✅ Correct!' : '❌ Incorrect';
    resultStatus.style.color = success ? 'var(--success-color)' : 'var(--danger-color)';
    explanationText.textContent = question.reference || 'No explanation available.';
    
    feedbackContainer.classList.remove('hidden');
    checkBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
    
    // Scroll to feedback on mobile
    feedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        renderQuestion();
        window.scrollTo(0, 0);
    } else {
        alert('Exam completed!');
        goHome();
    }
}

function goHome() {
    homeView.classList.remove('hidden');
    quizView.classList.add('hidden');
    homeBtn.classList.add('hidden');
    title.textContent = 'Life in the UK Test';
    window.scrollTo(0, 0);
}

// Event Listeners
checkBtn.onclick = checkAnswer;
nextBtn.onclick = nextQuestion;
homeBtn.onclick = goHome;

// Start the app
init();
