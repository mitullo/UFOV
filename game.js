// Setting up the canvas and game variables
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const trialElement = document.getElementById('trial');
const timeElement = document.getElementById('time');
const feedbackElement = document.getElementById('feedback');

let score = 0;
let trial = 1;
let timeRemaining = 30;
let gameInterval;
let target = {};
let targets = ['center', 'periphery'];  // 'center' or 'periphery' targets

// Target size and position range
const targetRadius = 30;
const screenWidth = canvas.width;
const screenHeight = canvas.height;

// Start game
function startGame() {
    feedbackElement.textContent = '';
    score = 0;
    trial = 1;
    timeRemaining = 30;
    scoreElement.textContent = score;
    trialElement.textContent = trial;

    // Start timer and game loop
    gameInterval = setInterval(gameLoop, 1000); // every second
    startTimer();
    spawnTarget();
}

// Timer function
function startTimer() {
    const timerInterval = setInterval(() => {
        timeRemaining--;
        timeElement.textContent = timeRemaining;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            clearInterval(gameInterval);
            feedbackElement.textContent = 'Game Over! Final Score: ' + score;
        }
    }, 1000);
}

// Game loop - update and render game
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // clear canvas

    // Draw the current target
    drawTarget(target);

    // Check if the user clicked the target
    canvas.addEventListener('click', handleClick);
}

// Function to spawn a target randomly
function spawnTarget() {
    const randomTarget = targets[Math.floor(Math.random() * targets.length)];
    const x = Math.random() * (screenWidth - targetRadius * 2) + targetRadius;
    const y = Math.random() * (screenHeight - targetRadius * 2) + targetRadius;

    target = { type: randomTarget, x: x, y: y };
}

// Draw the target on canvas
function drawTarget(target) {
    if (target.type === 'center') {
        ctx.fillStyle = 'green';
    } else {
        ctx.fillStyle = 'red';
    }
    ctx.beginPath();
    ctx.arc(target.x, target.y, targetRadius, 0, Math.PI * 2);
    ctx.fill();
}

// Handle user click event
function handleClick(event) {
    const clickX = event.clientX - canvas.offsetLeft;
    const clickY = event.clientY - canvas.offsetTop;
    const distance = Math.sqrt(Math.pow(clickX - target.x, 2) + Math.pow(clickY - target.y, 2));

    if (distance <= targetRadius) {
        // Correct answer (clicked on target)
        feedbackElement.textContent = 'Correct!';
        feedbackElement.classList.add('correct');
        feedbackElement.classList.remove('incorrect');
        score++;
    } else {
        // Incorrect answer (missed target)
        feedbackElement.textContent = 'Incorrect!';
        feedbackElement.classList.add('incorrect');
        feedbackElement.classList.remove('correct');
    }

    // Update score and trial
    scoreElement.textContent = score;
    trialElement.textContent = ++trial;

    // Spawn new target after each trial
    spawnTarget();
}

// Start the game when the page loads
window.onload = startGame;
