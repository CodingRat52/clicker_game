
let score = 0;
let pointsPerClick = 1;
let autoClickerActive = false;

const scoreDisplay = document.getElementById('score');
const clickBtn = document.getElementById('click-btn');
const upgradeClickBtn = document.getElementById('upgrade-click');
const autoClickerBtn = document.getElementById('auto-clicker');
const saveScoreBtn = document.getElementById('save-score');
const resetGameBtn = document.getElementById('reset-game');
const toggleThemeBtn = document.getElementById('toggle-theme');
const usernameInput = document.getElementById('username');

clickBtn.addEventListener('click', () => {
    score += pointsPerClick;
    updateScore();
});

upgradeClickBtn.addEventListener('click', () => {
    if (score >= 10) {
        score -= 10;
        pointsPerClick += 1;
        updateScore();
    } else {
        alert('Not enough points to upgrade!');
    }
});

autoClickerBtn.addEventListener('click', () => {
    if (score >= 50 && !autoClickerActive) {
        score -= 50;
        autoClickerActive = true;
        setInterval(() => {
            score += pointsPerClick;
            updateScore();
        }, 1000);
        updateScore();
    } else if (autoClickerActive) {
        alert('Auto Clicker already purchased!');
    } else {
        alert('Not enough points to buy Auto Clicker!');
    }
});

saveScoreBtn.addEventListener('click', () => {
    const name = usernameInput.value.trim();
    if (!name) {
        alert('Please enter your name.');
        return;
    }
    fetch('/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Score saved!');
            location.reload();
        }
    });
});

resetGameBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the game?')) {
        score = 0;
        pointsPerClick = 1;
        autoClickerActive = false;
        updateScore();
    }
});

toggleThemeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

function updateScore() {
    scoreDisplay.textContent = score;
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
});
