/**
 * Snake class - Represents the snake in the game
 */
class Snake {
    /**
     * Create a new Snake instance
     * @param {number} gridWidth - Width of the game grid
     * @param {number} gridHeight - Height of the game grid
     * @param {number} gridSize - Size of each grid cell
     */
    constructor(gridWidth, gridHeight, gridSize) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.gridSize = gridSize;
        this.direction = 'right';
        this.nextDirection = 'right';
        this.segments = [];
        this.initialize();
    }

    /**
     * Initialize the snake with default segments
     */
    initialize() {
        this.segments = [
            {x: 10, y: 10}, // Head
            {x: 9, y: 10},  // Body
            {x: 8, y: 10}   // Tail
        ];
        this.direction = 'right';
        this.nextDirection = 'right';
    }

    /**
     * Get the head segment of the snake
     * @returns {Object} The head segment with x and y coordinates
     */
    getHead() {
        return this.segments[0];
    }

    /**
     * Handle direction change ensuring the snake cannot reverse directly
     * @param {string} newDirection - The new direction to change to
     */
    changeDirection(newDirection) {
        // Prevent reversing direction directly
        if (
            (newDirection === 'up' && this.direction !== 'down') ||
            (newDirection === 'down' && this.direction !== 'up') ||
            (newDirection === 'left' && this.direction !== 'right') ||
            (newDirection === 'right' && this.direction !== 'left')
        ) {
            this.nextDirection = newDirection;
        }
    }

    /**
     * Move the snake in the current direction
     * @param {boolean} ateFood - Whether the snake ate food in this move
     * @returns {boolean} Whether the snake collided with wall or itself
     */
    move(ateFood) {
        this.direction = this.nextDirection;
        
        // Calculate new head position
        const head = {x: this.segments[0].x, y: this.segments[0].y};
        
        switch(this.direction) {
            case 'up':
                head.y--;
                break;
            case 'down':
                head.y++;
                break;
            case 'left':
                head.x--;
                break;
            case 'right':
                head.x++;
                break;
        }
        
        // Check for collision with walls
        if (head.x < 0 || head.x >= this.gridWidth || head.y < 0 || head.y >= this.gridHeight) {
            return true; // Collision detected
        }
        
        // Check for collision with self
        for (let segment of this.segments) {
            if (head.x === segment.x && head.y === segment.y) {
                return true; // Collision detected
            }
        }
        
        // Add new head
        this.segments.unshift({x: head.x, y: head.y});
        
        // Remove tail if food wasn't eaten
        if (!ateFood) {
            this.segments.pop();
        }
        
        return false; // No collision
    }

    /**
     * Check if the snake has collided with the given food
     * @param {Object} food - The food object with x and y coordinates
     * @returns {boolean} Whether the snake head is at the food position
     */
    checkFoodCollision(food) {
        const head = this.getHead();
        return head.x === food.x && head.y === food.y;
    }

    /**
     * Draw the snake on the canvas
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw on
     */
    draw(ctx) {
        this.segments.forEach((segment, index) => {
            // Snake head is a different color
            if (index === 0) {
                ctx.fillStyle = '#4CAF50';
            } else {
                // Create gradient effect for snake body
                const greenValue = Math.floor(150 - (index * 3));
                ctx.fillStyle = `rgb(0, ${Math.max(greenValue, 100)}, 0)`;
            }
            
            ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize, this.gridSize);
            
            // Add eye details to head
            if (index === 0) {
                ctx.fillStyle = '#000';
                
                // Different eye positions based on direction
                if (this.direction === 'right' || this.direction === 'left') {
                    const eyeX = this.direction === 'right' ? 
                        (segment.x * this.gridSize) + this.gridSize - 5 : 
                        (segment.x * this.gridSize) + 5;
                    ctx.fillRect(eyeX, (segment.y * this.gridSize) + 5, 3, 3);
                    ctx.fillRect(eyeX, (segment.y * this.gridSize) + this.gridSize - 8, 3, 3);
                } else {
                    const eyeY = this.direction === 'down' ? 
                        (segment.y * this.gridSize) + this.gridSize - 5 : 
                        (segment.y * this.gridSize) + 5;
                    ctx.fillRect((segment.x * this.gridSize) + 5, eyeY, 3, 3);
                    ctx.fillRect((segment.x * this.gridSize) + this.gridSize - 8, eyeY, 3, 3);
                }
            }
            
            // Add subtle border to segments
            ctx.strokeStyle = '#0c0';
            ctx.strokeRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize, this.gridSize);
        });
    }

    /**
     * Get the length of the snake
     * @returns {number} The number of segments in the snake
     */
    getLength() {
        return this.segments.length;
    }
}