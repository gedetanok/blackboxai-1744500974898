// Game constants
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const MOVE_SPEED = 5;
const PLAYER_WIDTH = 32;
const PLAYER_HEIGHT = 32;
const PLATFORM_HEIGHT = 32;
const COIN_SIZE = 20;

// Game state
let gameState = 'menu'; // menu, playing, gameOver
let score = 0;
let lives = 3;

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameMessage = document.getElementById('game-message');
const scoreValue = document.getElementById('scoreValue');
const livesValue = document.getElementById('livesValue');

// Asset loading
const playerImage = new Image();
playerImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGKSURBVFiF7ZY9TsNAEIXfbCANBUJCQhyAoyBxAa7AEbgBR0CiouYQHIBDUESiCY1DSJQoG8pJnJ9dr3ftDR1PZe/svPm8u2OvgX+NnpN3AUwBrABsAGwBjJkTp8wcM7/jnG0/ZbkTpwA+ABwS4xPAhKWB+0bvAHwlxB3WAEZZwQN4yxDPsQQwyArPFc8wBzDICkZwFEBfO5jBUQDvWlEBjgJ40YoKcBTAWCsqwFEAQ62oCEcBkFZUhKMAelrRAI4CuNaKhnAUQFcrGsJRAB2taAFHAVxpRQs4CuBSK1rCUQAXWtESjgJoa0UHOAqgpRUd4CiAM63oCEcBNLWiBxwFcKoVPeAogBOt6AlHARxrRQEcBXCkFQVwFMChVhTCUQAHWlEIRwHsa0UDuMhp+O0Q/N0h+KtD8BeH4M8OwR8cgj/ZB39wCP5XWzQKfldbNAp+W1s0Cn5TWzQKfl1bNAp+VVs0Cp7UFo2CJ7VFf4In/yUNg//+UG4B3AHoF+T2mXPHnHtf438DPwBGwVzGQjNXQAAAAABJRU5ErkJggg==';

const platformImage = new Image();
platformImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAEISURBVHic7ZqxDYMwEEXfESUdE2QKVsgIrMBKWYkROmYIKhpoIkVBRIptfA7u3pOuQvj0/x0+GQzDMAzDMNrjGFPkHEJYxxTKzJtz7pZS+njvl9Za6fNaa1fe+/sY4+m3cxhj3KSUzs65xzkiIuKcuyulvEII6xDCOud8f1VHRF7MvGHmTe/JvwpmXjPzuvcEqmHmFTOvek+kCmZeMvOy92T+xQcg9Z5ELXwI4dF7ErWIMU5SSk/v/by2hoj0/rBRhZTS3Hu/qK0jItJ7IrUw84KZF73nUQ0zz5l53nseTcgAGQAZIANkgAyQATJABsgAGSADZIAMkAEyQAbIABkgA2SADJABMkAGGIZhGIbRnC9qYQhU1BlUwwAAAABJRU5ErkJggg==';

// Player object
const player = {
    x: 50,
    y: canvas.height - 100,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    velocityX: 0,
    velocityY: 0,
    isJumping: false
};

// Level design
const platforms = [
    { x: 0, y: canvas.height - 32, width: canvas.width, height: PLATFORM_HEIGHT },
    { x: 200, y: canvas.height - 120, width: 100, height: PLATFORM_HEIGHT },
    { x: 400, y: canvas.height - 200, width: 100, height: PLATFORM_HEIGHT },
    { x: 600, y: canvas.height - 280, width: 100, height: PLATFORM_HEIGHT }
];

const coins = [
    { x: 230, y: canvas.height - 160, collected: false },
    { x: 430, y: canvas.height - 240, collected: false },
    { x: 630, y: canvas.height - 320, collected: false }
];

// Input handling
const keys = {
    left: false,
    right: false,
    space: false
};

document.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'ArrowLeft':
            keys.left = true;
            break;
        case 'ArrowRight':
            keys.right = true;
            break;
        case 'Space':
            keys.space = true;
            if (gameState === 'menu') {
                startGame();
            } else if (!player.isJumping) {
                player.velocityY = JUMP_FORCE;
                player.isJumping = true;
            }
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.code) {
        case 'ArrowLeft':
            keys.left = false;
            break;
        case 'ArrowRight':
            keys.right = false;
            break;
        case 'Space':
            keys.space = false;
            break;
    }
});

// Game functions
function startGame() {
    gameState = 'playing';
    score = 0;
    lives = 3;
    player.x = 50;
    player.y = canvas.height - 100;
    player.velocityX = 0;
    player.velocityY = 0;
    coins.forEach(coin => coin.collected = false);
    gameMessage.classList.add('hidden');
    updateUI();
}

function updateUI() {
    scoreValue.textContent = score;
    livesValue.textContent = lives;
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function update() {
    if (gameState !== 'playing') return;

    // Player movement
    if (keys.left) player.velocityX = -MOVE_SPEED;
    else if (keys.right) player.velocityX = MOVE_SPEED;
    else player.velocityX = 0;

    // Apply physics
    player.velocityY += GRAVITY;
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Platform collisions
    player.isJumping = true;
    for (const platform of platforms) {
        if (checkCollision(player, platform)) {
            if (player.velocityY > 0 && player.y + player.height > platform.y) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.isJumping = false;
            }
        }
    }

    // Coin collection
    coins.forEach(coin => {
        if (!coin.collected && checkCollision(player, {
            x: coin.x,
            y: coin.y,
            width: COIN_SIZE,
            height: COIN_SIZE
        })) {
            coin.collected = true;
            score += 100;
            updateUI();
        }
    });

    // Screen boundaries
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Death condition
    if (player.y > canvas.height) {
        lives--;
        updateUI();
        if (lives <= 0) {
            gameOver();
        } else {
            resetPlayer();
        }
    }
}

function resetPlayer() {
    player.x = 50;
    player.y = canvas.height - 100;
    player.velocityX = 0;
    player.velocityY = 0;
}

function gameOver() {
    gameState = 'menu';
    gameMessage.textContent = 'Game Over! Press SPACE to Restart';
    gameMessage.classList.remove('hidden');
}

function render() {
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw platforms
    ctx.fillStyle = '#4a5568';
    platforms.forEach(platform => {
        ctx.drawImage(platformImage, platform.x, platform.y, platform.width, platform.height);
    });

    // Draw coins
    // Draw coins with pixel art style
    coins.forEach(coin => {
        if (!coin.collected) {
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(coin.x, coin.y, COIN_SIZE, COIN_SIZE);
            ctx.fillStyle = '#FFA500';
            ctx.fillRect(coin.x + 4, coin.y + 4, COIN_SIZE - 8, COIN_SIZE - 8);
        }
    });

    // Draw player
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Draw menu message
    if (gameState === 'menu') {
        gameMessage.classList.remove('hidden');
    }
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// Show initial message
gameMessage.textContent = 'Press SPACE to Start';
gameMessage.classList.remove('hidden');
