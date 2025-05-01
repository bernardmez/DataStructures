/**
 * Food class - Represents the food in the game
 */
class Food {
    /**
     * Create a new Food instance
     * @param {number} gridWidth - Width of the game grid
     * @param {number} gridHeight - Height of the game grid
     * @param {number} gridSize - Size of each grid cell
     */
    constructor(gridWidth, gridHeight, gridSize) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.gridSize = gridSize;
        this.position = { x: 0, y: 0 };
        this.generate(); // Initialize with a random position
    }

    /**
     * Generate food at a random position
     * @param {Array} snakeSegments - The snake segments to avoid
     */
    generate(snakeSegments = []) {
        // Generate random position
        this.position = {
            x: Math.floor(Math.random() * this.gridWidth),
            y: Math.floor(Math.random() * this.gridHeight)
        };
        
        // Make sure food doesn't spawn on snake
        const isOnSnake = snakeSegments.some(segment => 
            segment.x === this.position.x && segment.y === this.position.y
        );
        
        if (isOnSnake) {
            this.generate(snakeSegments); // Try again if on snake
        }
    }

    /**
     * Get the current position of the food
     * @returns {Object} The position with x and y coordinates
     */
    getPosition() {
        return this.position;
    }

    /**
     * Draw the food on the canvas
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
     */
    draw(ctx) {
        // Draw food with gradient for a glossy apple effect
        const gradient = ctx.createRadialGradient(
            (this.position.x * this.gridSize) + this.gridSize/2, 
            (this.position.y * this.gridSize) + this.gridSize/2, 
            2,
            (this.position.x * this.gridSize) + this.gridSize/2, 
            (this.position.y * this.gridSize) + this.gridSize/2, 
            this.gridSize/2
        );
        gradient.addColorStop(0, '#f00');
        gradient.addColorStop(1, '#a00');
        ctx.fillStyle = gradient;
        
        // Draw circular food
        ctx.beginPath();
        ctx.arc(
            (this.position.x * this.gridSize) + this.gridSize/2, 
            (this.position.y * this.gridSize) + this.gridSize/2, 
            this.gridSize/2 - 1, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
        
        // Add highlight to food for 3D effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(
            (this.position.x * this.gridSize) + this.gridSize/2 - 3, 
            (this.position.y * this.gridSize) + this.gridSize/2 - 3, 
            3, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
    }
}