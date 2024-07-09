const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext('2d');
const box = 20;
const canvasSize = canvas.width;
let snake = [{ x: 8 * box, y: 8 * box }];
let direction = null;
let food = {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box
};
let score = 0;
let highScore = 0;
let game;
let isPaused = false;
let speed = 100;
let skinColor = 'green';

const eatSound = new Audio('eat.mp3');
const gameOverSound = new Audio('gameover.mp3');

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const key = event.keyCode;
    if (key === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (key === 38 && direction !== 'DOWN') {
        direction = 'UP';
    } else if (key === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (key === 40 && direction !== 'UP') {
        direction = 'DOWN';
    }
}

function draw() {
    if (isPaused) return;

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? skinColor : 'white';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'red';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        eatSound.play();
        speed = Math.max(50, speed - 5); // Increase speed as the score increases
        clearInterval(game);
        game = setInterval(draw, speed);
        food = {
            x: Math.floor(Math.random() * (canvasSize / box)) * box,
            y: Math.floor(Math.random() * (canvasSize / box)) * box
        };
    } else {
        snake.pop();
    }

    const newHead = {
        x: snakeX,
        y: snakeY
    };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvasSize || snakeY >= canvasSize || collision(newHead, snake)) {
        gameOverSound.play();
        clearInterval(game);
        alert('Game Over');
        if (score > highScore) {
            highScore = score;
            document.getElementById('high-score').innerHTML = 'High Score: ' + highScore;
        }
    }

    snake.unshift(newHead);
    document.getElementById('score').innerHTML = 'Score: ' + score;
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    clearInterval(game);
    snake = [{ x: 8 * box, y: 8 * box }];
    direction = null;
    food = {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box
    };
    score = 0;
    speed = 100;
    document.getElementById('score').innerHTML = 'Score: ' + score;
    game = setInterval(draw, speed);
}

function pauseGame() {
    isPaused = !isPaused;
    document.getElementById('pause-button').textContent = isPaused ? 'Resume' : 'Pause';
    if (!isPaused) {
        game = setInterval(draw, speed);
    } else {
        clearInterval(game);
    }
}

function changeSkin() {
    skinColor = document.getElementById('snake-skin').value;
}

game = setInterval(draw, speed);
