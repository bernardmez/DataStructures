/**
 * Main game class that controls the game loop and coordinates components
 */
class Game {
    /**
     * Create a new Game instance
     */
    constructor() {
        // Get canvas and context
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game configuration
        this.gridSize = 20;
        this.gridWidth = this.canvas.width / this.gridSize;
        this.gridHeight = this.canvas.height / this.gridSize;
        this.gameSpeed = 150; // milliseconds between updates
        this.gameInterval = null;
        this.gameRunning = false;
        
        // Initialize game objects
        this.snake = new Snake(this.gridWidth, this.gridHeight, this.gridSize);
        this.food = new Food(this.gridWidth, this.gridHeight, this.gridSize);
        
        // DOM elements for UI
        const elements = {
            scoreDisplay: document.getElementById('score'),
            highScoreDisplay: document.getElementById('high-score'),
            scoresList: document.getElementById('scores-list'),
            startBtn: document.getElementById('start-btn'),
            pauseBtn: document.getElementById('pause-btn'),
            gameOverModal: document.getElementById('game-over-modal'),
            closeModal: document.querySelector('.close'),
            finalScoreDisplay: document.getElementById('final-score'),
            playerNameInput: document.getElementById('player-name'),
            saveScoreBtn: document.getElementById('save-score')
        };
        
        // Initialize managers
        this.scoreManager = new ScoreManager(
            elements.scoreDisplay,
            elements.highScoreDisplay,
            elements.scoresList
        );
        
        // Initialize UI controller with callbacks
        this.uiController = new UIController(
            elements,
            () => this.startGame(),
            (isRunning) => this.togglePause(isRunning),
            (playerName) => this.saveScore(playerName)
        );
        
        // Set the direction change callback
        this.uiController.setDirectionChangeCallback((direction) => {
            this.snake.changeDirection(direction);
        });
        
        // Initial draw
        this.draw();
        
        // Load high scores
        this.scoreManager.loadHighScores();
    }

    /**
     * Start or restart the game
     */
    startGame() {
        // Clear any existing interval
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }
        
        // Initialize game state
        this.snake.initialize();
        this.food.generate(this.snake.segments);
        this.scoreManager.resetScore();
        this.gameSpeed = 150;
        this.gameRunning = true;
        
        // Start game loop
        this.gameInterval = setInterval(() => this.gameLoop(), this.gameSpeed);
    }

    /**
     * Toggle game pause state
     * @param {boolean} isRunning - Whether the game should be running
     */
    togglePause(isRunning) {
        if (isRunning) {
            this.gameInterval = setInterval(() => this.gameLoop(), this.gameSpeed);
            this.gameRunning = true;
        } else {
            clearInterval(this.gameInterval);
            this.gameRunning = false;
        }
    }

    /**
     * The main game loop
     */
    gameLoop() {
        // Check if snake ate food
        const didEatFood = this.snake.checkFoodCollision(this.food.getPosition());
        
        // Move snake and check for collision
        const collision = this.snake.move(didEatFood);
        
        if (collision) {
            this.gameOver();
            return;
        }
        
        // Handle food consumption
        if (didEatFood) {
            // Update score
            const newScore = this.scoreManager.incrementScore();
            
            // Increase speed every 5 points
            if (newScore % 5 === 0) {
                this.increaseSpeed();
            }
            
            // Generate new food
            this.food.generate(this.snake.segments);
        }
        
        // Draw everything
        this.draw();
    }

    /**
     * Increase the game speed
     */
    increaseSpeed() {
        // Don't let the game get too fast
        this.gameSpeed = Math.max(this.gameSpeed - 10, 60);
        
        // Reset the interval with new speed
        clearInterval(this.gameInterval);
        this.gameInterval = setInterval(() => this.gameLoop(), this.gameSpeed);
    }

    /**
     * Draw all game elements
     */
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake and food
        this.snake.draw(this.ctx);
        this.food.draw(this.ctx);
    }

    /**
     * Handle game over
     */
    gameOver() {
        // Stop the game loop
        clearInterval(this.gameInterval);
        this.gameRunning = false;
        
        // Show game over UI
        this.uiController.showGameOverModal(this.scoreManager.getScore());
    }

    /**
     * Save the player's score
     * @param {string} playerName - The name of the player
     * @returns {Promise} A promise that resolves when the score is saved
     */
    saveScore(playerName) {
        return this.scoreManager.saveScore(playerName).then(() => {
            return this.scoreManager.loadHighScores();
        });
    }
}

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});