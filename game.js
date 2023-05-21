// Constants
const SIZE = 20;
const SPEED = 5;

// Game variables
let snake = [{ x: 0, y: 0 }];
let food = { x: 0, y: 0 };
let direction = 'right';
let score = 0;
let lastRenderTime = 0;
let gameOver = false;

// Game board element
const gameBoard = document.getElementById('game-board');

// Initialize game
function init() {
  createSnake();
  createFood();
  document.addEventListener('keydown', changeDirection);
  requestAnimationFrame(gameLoop);
}

// Create initial snake
function createSnake() {
  snake.forEach((segment) => {
    const snakeElement = document.createElement('div');
    snakeElement.style.left = segment.x + 'px';
    snakeElement.style.top = segment.y + 'px';
    snakeElement.classList.add('snake');
    gameBoard.appendChild(snakeElement);
  });
}

// Create food at random position
function createFood() {
  const maxX = gameBoard.clientWidth / SIZE;
  const maxY = gameBoard.clientHeight / SIZE;

  // Remove previous food element
  const previousFoodElement = document.querySelector('.food');
  if (previousFoodElement) {
    previousFoodElement.parentNode.removeChild(previousFoodElement);
  }

  food = {
    x: Math.floor(Math.random() * maxX) * SIZE,
    y: Math.floor(Math.random() * maxY) * SIZE,
  };
  const foodElement = document.createElement('div');
  foodElement.style.left = food.x + 'px';
  foodElement.style.top = food.y + 'px';
  foodElement.classList.add('food');
  gameBoard.appendChild(foodElement);
}

// Game loop
function gameLoop(currentTime) {
  if (gameOver) {
    return;
  }

  const deltaTime = currentTime - lastRenderTime;
  if (deltaTime < 1000 / SPEED) {
    requestAnimationFrame(gameLoop);
    return;
  }

  lastRenderTime = currentTime;

  clearSnake();
  moveSnake();
  if (checkCollision()) {
    gameOver = true;
    showGameOver();
    return;
  }
  drawSnake();
  if (checkFoodCollision()) {
    eatFood();
    createFood();
  }
  requestAnimationFrame(gameLoop);
}

// Clear snake elements
function clearSnake() {
  const snakeElements = document.querySelectorAll('.snake');
  snakeElements.forEach((element) => {
    element.parentNode.removeChild(element);
  });
}

// Move snake in the current direction
function moveSnake() {
  const head = { x: snake[0].x, y: snake[0].y };
  switch (direction) {
    case 'right':
      head.x += SIZE;
      break;
    case 'left':
      head.x -= SIZE;
      break;
    case 'up':
      head.y -= SIZE;
      break;
    case 'down':
      head.y += SIZE;
      break;
  }
  snake.unshift(head);
  snake.pop();
}

// Draw snake on the game board
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = document.createElement('div');
    snakeElement.style.left = segment.x + 'px';
    snakeElement.style.top = segment.y + 'px';
    snakeElement.classList.add('snake');
    gameBoard.appendChild(snakeElement);
  });
}

// Check collision with walls or snake's body
function checkCollision() {
  const head = snake[0];
  if (
    head.x < 0 ||
    head.x >= gameBoard.clientWidth ||
    head.y < 0 ||
    head.y >= gameBoard.clientHeight
  ) {
    return true;
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

// Check collision with food
function checkFoodCollision() {
  const head = snake[0];
  return head.x === food.x && head.y === food.y;
}

// Handle direction change
function changeDirection(event) {
  const key = event.keyCode;
  switch (key) {
    case 37:
      if (direction !== 'right') {
        direction = 'left';
      }
      break;
    case 38:
      if (direction !== 'down') {
        direction = 'up';
      }
      break;
    case 39:
      if (direction !== 'left') {
        direction = 'right';
      }
      break;
    case 40:
      if (direction !== 'up') {
        direction = 'down';
      }
      break;
  }
}

// Eat food and grow the snake
function eatFood() {
  const tail = {
    x: snake[snake.length - 1].x,
    y: snake[snake.length - 1].y,
  };
  snake.push(tail);
  score++;
}

// Show game over message
function showGameOver() {
  alert('Game over! Your score is: ' + score);
  snake = [{ x: 0, y: 0 }];
  direction = 'right';
  score = 0;
  gameOver = false;
  init();
}

// Initialize the game
init();
