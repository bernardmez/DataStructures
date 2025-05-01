/**
 * UIController class - Handles UI interactions and event handling
 */
class UIController {
    /**
     * Create a new UIController instance
     * @param {Object} elements - UI elements to control
     * @param {function} startGameCallback - Callback function to start the game
     * @param {function} pauseGameCallback - Callback function to pause/resume the game
     * @param {function} saveScoreCallback - Callback function to save a score
     */
    constructor(elements, startGameCallback, pauseGameCallback, saveScoreCallback) {
        this.elements = elements;
        this.startGameCallback = startGameCallback;
        this.pauseGameCallback = pauseGameCallback;
        this.saveScoreCallback = saveScoreCallback;
        this.gameRunning = false;
        this.initEventListeners();
    }

    /**
     * Initialize all event listeners
     */
    initEventListeners() {
        // Button click events
        this.elements.startBtn.addEventListener('click', () => {
            this.startGameCallback();
            this.updateStartButton();
        });
        
        this.elements.pauseBtn.addEventListener('click', () => {
            this.togglePause();
        });
        
        this.elements.saveScoreBtn.addEventListener('click', () => {
            this.saveScore();
        });
        
        // Modal close event
        this.elements.closeModal.addEventListener('click', () => {
            this.hideGameOverModal();
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    /**
     * Handle keyboard input for snake direction
     * @param {KeyboardEvent} event - The key event
     */
    handleKeyPress(event) {
        // Handle arrow keys for snake control
        switch(event.code) {
            case 'ArrowUp':
            case 'KeyW':
                this.onDirectionChange('up');
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.onDirectionChange('down');
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.onDirectionChange('left');
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.onDirectionChange('right');
                break;
            case 'Space':
                this.togglePause();
                break;
            case 'Enter':
                if (this.elements.gameOverModal.style.display === 'block') {
                    this.saveScore();
                } else if (!this.gameRunning) {
                    this.startGameCallback();
                    this.updateStartButton();
                }
                break;
        }
    }

    /**
     * Set the direction change callback
     * @param {function} callback - Function to call when direction changes
     */
    setDirectionChangeCallback(callback) {
        this.onDirectionChange = callback;
    }

    /**
     * Toggle the game pause state
     */
    togglePause() {
        this.gameRunning = !this.gameRunning;
        this.pauseGameCallback(this.gameRunning);
        this.updatePauseButton();
    }

    /**
     * Update the pause button text based on game state
     */
    updatePauseButton() {
        this.elements.pauseBtn.textContent = this.gameRunning ? 'Pause' : 'Resume';
    }

    /**
     * Update the start button text based on game state
     */
    updateStartButton() {
        this.gameRunning = true;
        this.elements.startBtn.textContent = 'Restart Game';
        this.elements.pauseBtn.textContent = 'Pause';
    }

    /**
     * Show the game over modal with final score
     * @param {number} finalScore - The final score to display
     */
    showGameOverModal(finalScore) {
        this.gameRunning = false;
        this.elements.finalScoreDisplay.textContent = finalScore;
        this.elements.gameOverModal.style.display = 'block';
        this.elements.playerNameInput.focus();
    }

    /**
     * Hide the game over modal
     */
    hideGameOverModal() {
        this.elements.gameOverModal.style.display = 'none';
    }

    /**
     * Save the player's score
     */
    saveScore() {
        const playerName = this.elements.playerNameInput.value;
        this.saveScoreCallback(playerName).then(() => {
            this.hideGameOverModal();
        });
    }
}