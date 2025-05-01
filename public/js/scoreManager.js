/**
 * ScoreManager class - Manages score tracking and high scores
 */
class ScoreManager {
    /**
     * Create a new ScoreManager instance
     * @param {HTMLElement} scoreDisplay - Element to display current score
     * @param {HTMLElement} highScoreDisplay - Element to display high score
     * @param {HTMLElement} scoresList - Element to display high scores list
     */
    constructor(scoreDisplay, highScoreDisplay, scoresList) {
        this.scoreDisplay = scoreDisplay;
        this.highScoreDisplay = highScoreDisplay;
        this.scoresList = scoresList;
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.displayHighScore();
    }

    /**
     * Reset the current score to zero
     */
    resetScore() {
        this.score = 0;
        this.updateScoreDisplay();
    }

    /**
     * Increment the score by one
     * @returns {number} The new score value
     */
    incrementScore() {
        this.score++;
        this.updateScoreDisplay();
        
        // Update high score if needed
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
            this.displayHighScore();
        }
        
        return this.score;
    }

    /**
     * Get the current score
     * @returns {number} The current score
     */
    getScore() {
        return this.score;
    }

    /**
     * Update the score display element
     */
    updateScoreDisplay() {
        if (this.scoreDisplay) {
            this.scoreDisplay.textContent = this.score;
        }
    }

    /**
     * Update the high score display element
     */
    displayHighScore() {
        if (this.highScoreDisplay) {
            this.highScoreDisplay.textContent = this.highScore;
        }
    }

    /**
     * Load the high score from local storage
     * @returns {number} The high score from storage or 0 if not found
     */
    loadHighScore() {
        const storedHighScore = localStorage.getItem('snakeHighScore');
        return storedHighScore ? parseInt(storedHighScore) : 0;
    }

    /**
     * Save the current high score to local storage
     */
    saveHighScore() {
        localStorage.setItem('snakeHighScore', this.highScore);
    }

    /**
     * Save a player's score to the server
     * @param {string} playerName - The name of the player
     * @returns {Promise} A promise that resolves when the score is saved
     */
    saveScore(playerName) {
        return new Promise((resolve, reject) => {
            const name = playerName.trim() || 'Anonymous';
            
            fetch('/api/scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    score: this.score,
                    date: new Date().toISOString()
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Score saved:', data);
                resolve(data);
            })
            .catch(error => {
                console.error('Error saving score:', error);
                // Fallback for local testing without backend
                this.mockSaveScore(name);
                resolve({ name, score: this.score });
            });
        });
    }

    /**
     * Mock function for saving scores locally when server is unavailable
     * @param {string} name - The player's name
     */
    mockSaveScore(name) {
        const scores = JSON.parse(localStorage.getItem('snakeScores') || '[]');
        scores.push({
            name: name,
            score: this.score,
            date: new Date().toISOString()
        });
        
        // Sort and limit to top 10
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem('snakeScores', JSON.stringify(scores.slice(0, 10)));
    }

    /**
     * Load high scores from the server
     * @returns {Promise} A promise that resolves with the high scores
     */
    loadHighScores() {
        return new Promise((resolve, reject) => {
            fetch('/api/scores')
            .then(response => response.json())
            .then(data => {
                this.displayHighScores(data);
                resolve(data);
            })
            .catch(error => {
                console.error('Error loading scores:', error);
                // Fallback for local testing
                const scores = JSON.parse(localStorage.getItem('snakeScores') || '[]');
                this.displayHighScores(scores);
                resolve(scores);
            });
        });
    }

    /**
     * Display the high scores in the scores list element
     * @param {Array} scores - Array of score objects
     */
    displayHighScores(scores) {
        if (!this.scoresList) return;
        
        this.scoresList.innerHTML = '';
        scores.slice(0, 10).forEach((entry, index) => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${index + 1}. ${entry.name}</span><span>${entry.score}</span>`;
            this.scoresList.appendChild(li);
        });
    }
}