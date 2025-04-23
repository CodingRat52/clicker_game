
document.addEventListener('DOMContentLoaded', () => {
    let score = 0;
    let pointsPerClick = 1;
    let autoClickerActive = false;
    let upgradeCost = 10;
    let autoClickerCost = 50;

    const scoreDisplay = document.getElementById('score');
    const clickBtn = document.getElementById('click-btn');
    const upgradeClickBtn = document.getElementById('upgrade-click');
    const autoClickerBtn = document.getElementById('auto-clicker');
    const saveScoreBtn = document.getElementById('save-score');
    const resetGameBtn = document.getElementById('reset-game');
    const toggleThemeBtn = document.getElementById('toggle-theme');
    const usernameInput = document.getElementById('username');

    function updateScore() {
        scoreDisplay.textContent = score;
        upgradeClickBtn.textContent = `Uzlabot klikšķi (+1) - ${upgradeCost} punkti`;
        autoClickerBtn.textContent = `Pirkt Auto Klikšķinātāju - ${autoClickerCost} punkti`;
    }

    clickBtn.addEventListener('click', () => {
        score += pointsPerClick;
        updateScore();
    });

    upgradeClickBtn.addEventListener('click', () => {
        if (score >= upgradeCost) {
            score -= upgradeCost;
            pointsPerClick += 1;
            upgradeCost = Math.floor(upgradeCost * 1.5);
            updateScore();
        } else {
            alert('Nepietiek punktu uzlabojumam!');
        }
    });

    autoClickerBtn.addEventListener('click', () => {
        if (score >= autoClickerCost) {
            score -= autoClickerCost;
            autoClickerCost = Math.floor(autoClickerCost * 2);
            
            // Start a new interval for the new auto-clicker purchased
            setInterval(() => {
                score += pointsPerClick;
                updateScore();
            }, 1000);
            
            updateScore();
        } else {
            alert('Nepietiek punktu, lai pirktu Auto Klikšķinātāju!');
        }
    });

    saveScoreBtn.addEventListener('click', () => {
        const name = usernameInput.value.trim();
        if (!name) {
            alert('Lūdzu ievadi savu vārdu.');
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
                alert('Punkti saglabāti!');
                location.reload();
            }
        });
    });

    resetGameBtn.addEventListener('click', () => {
        if (confirm('Vai tiešām vēlies atiestatīt spēli?')) {
            score = 0;
            pointsPerClick = 1;
            upgradeCost = 10;
            autoClickerCost = 50;
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

    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    updateScore();
});
