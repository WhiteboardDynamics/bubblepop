const canvas = document.getElementById('game');
const context = canvas.getContext("2d");
const bubblePoints = 50;
const startTime = Math.round((new Date()).getTime() / 1000);
const expansionContraction = .20;
const bubbleVelocity = .25;
const scoreKey = 'highScores';
const backButton = {
  x: 0,
  y: canvas.height + 150,
  width: 200,
  height: 50,
  text: 'Back to Menu'
};
const restartButton = {
  x: 0,
  y: canvas.height + 50,
  width: 200,
  height: 50,
  text: 'Play Again?'
};
let spawnRate = 1;
let score = 0;
let time = 10;
let bubbles = [];
let spawnNumber = 1;
let gameOver = false;
let overCount = 0;

window.onload = function() {
  if (localStorage.getItem(scoreKey) === null) {
    localStorage.setItem(scoreKey, JSON.stringify([]));
  }

  setInterval(function() {
    time--;
  }, 1000);
}

// Is the point within the circle?
function intersectCircle(point, circle) {
  // Check whether the distance from the center of the circle to the
  // point is less than the circle's radius.
  return Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius;
}

// Is the point within the rectangle?
function intersectRectangle(point, rectangle){
  const rectangleX = (canvas.width / 2) - (rectangle.width / 2);
  return rectangleX <= point.x && point.x <= rectangleX + rectangle.width &&
    rectangle.y <= point.y && point.y <= rectangle.y + rectangle.height;
}

// Event listener for click events
function clickHandler(event) {
  // Get the position of the click event
  const position = {
    x: event.clientX,
    y: event.clientY
  };

  // Check if the click event is over any of the bubbles
  bubbles.forEach(function(bubble, index, bubbles) {
    if (intersectCircle(position, bubbles[index])) {
      score += 10;
      bubbles.splice(index, 1);
    }
  });

  // Check if the click event is over the back button
  if (gameOver === true) {
    if (intersectRectangle(position, backButton)) {
      window.location.href = 'index.html';
    } else if (intersectRectangle(position, restartButton)) {
      window.location.reload(false); 
    }
  }
}

// Draws the current score
function drawScore() {
  context.font = '3vw Helvetica';
  context.fillStyle = '#000000';
  context.fillText(`Score: ${score}`, 10, 30);
}

// Draws the remaining time
function drawTime() {
  context.font = '3vw Helvetica';
  context.fillStyle = '#000000';
  const timeLeft = `Seconds left: ${time}`;
  const timeLeftWidth = context.measureText(timeLeft).width;
  context.fillText(timeLeft, (canvas.width - 10) - timeLeftWidth, 30);
}

// Draws a circle with the given parameters
function drawCircle(x, y, radius, color) {
  if (radius <= 0) {
    return false;
  }
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
  context.closePath();
}

function drawRectangle(x, y, width, height, text) {
  context.beginPath();
  context.rect((canvas.width / 2) - (width / 2), y, width, height);
  context.stroke();
  context.font = '3vw Helvetica';
  context.fillStyle = '#000000';
  const textWidth = context.measureText(text).width;
  context.fillText(text, (canvas.width / 2) - (textWidth / 2), y + 35);
}

// Returns an integer between min (inclusive) and max (inclusive)
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Returns a random color
function randomColor() {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}

// Returns a random angle between -Pi and Pi
function randomAngle() {
  return Math.random() * 2 * Math.PI - Math.PI;
}

// Creates more bubbles if necessary
function spawnBubbles() {
  if (Math.round((new Date()).getTime() / 1000) > startTime + spawnRate) {
    spawnNumber += .35;
    spawnRate += 2;
  }

  for (let i = spawnNumber - bubbles.length; i > 0; i--) {
    const radius = randomInteger(5, 50);
    const x = randomInteger(50, canvas.width - 50);
    const y = randomInteger(50, canvas.height - 50);
    const color = randomColor();
    const angle = randomAngle();
    bubbles.push({x: x,
                  y: y,
                  radius: radius,
                  ascending: true,
                  color: color,
                  angle: angle});
  }
}

// Check if bubble collides with either vertical edge of playfield
function collideVerticalWall(bubble) {
  const bubbleLeftEdge = bubble.x - bubble.radius;
  const bubbleRightEdge = bubble.x + bubble.radius;
  return (bubbleLeftEdge < 0) || (bubbleRightEdge > canvas.width);
}

// Check if bubble collides with either horizontal edge of playfield
function collideHorizontalWall(bubble) {
  const bubbleTopEdge = bubble.y - bubble.radius;
  const bubbleBottomEdge = bubble.y + bubble.radius;
  return (bubbleTopEdge < 0) || (bubbleBottomEdge > canvas.height);
}

// Flip angle on collison with vertical wall
function flipAngleVertical(bubble) {
  if (bubble.angle < 0)
    return -Math.PI - bubble.angle;
  else
    return Math.PI - bubble.angle;
}

// Flip angle on collison with horizontal wall
function flipAngleHorizontal(bubble) {
  return -bubble.angle;
}

// Update bubbles positions and angles
function updateBubbles() {
  bubbles.forEach(function(bubble, index, bubbles) {
    const negativeCheck = drawCircle(bubble.x, bubble.y, bubble.radius, bubble.color);

    if (negativeCheck === false) {
      time -= 10;
      bubbles.splice(index, 1);
    } else {
      if (bubble.radius < 50 && bubble.ascending === true) {
        bubble.radius += expansionContraction;
      }
      else {
        bubble.radius -= expansionContraction;
        bubble.ascending = false;
      }

      const bubbleAngle = bubble.angle;
      const movementX = Math.cos(bubbleAngle) * bubbleVelocity;
      const movementY = -Math.sin(bubbleAngle) * bubbleVelocity;

      bubble.x += movementX;
      bubble.y += movementY;

      if (collideVerticalWall(bubble)) {
        bubble.angle = flipAngleVertical(bubble);
      } else if (collideHorizontalWall(bubble)) {
        bubble.angle = flipAngleHorizontal(bubble);
      }

      bubbles[index] = bubble;
    }
  });
}

// Checks if the current score is large enough to be a high score
function checkForHighScore(highScores, localScore) {
  let check = false;
  highScores.forEach(function(hs) {
    if (localScore > hs) {
      check = true;
    }
  });
  return check;
}

// Draws the high score array
function drawHighScores(scores) {
  let yGap = 50;
  const yOffset = 25;
  context.font = '4vw Helvetica';
  context.fillStyle = '#000000';
  const highScoreString = 'High Scores:';
  const highScoreStringWidth = context.measureText(highScoreString).width;
  context.fillText(highScoreString, (canvas.width / 2) - (highScoreStringWidth / 2), canvas.height / 2 + yGap);
  yGap += yOffset;
  scores.forEach(function(highScore) {
    context.font = '3vw Helvetica';
    context.fillStyle = '#000000';
    const scoreStringWidth = context.measureText(highScore).width;
    context.fillText(highScore, (canvas.width / 2) - (scoreStringWidth / 2), canvas.height / 2 + yGap);
    yGap += yOffset;
  });
}

// Redraws the screen each tick
function draw() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  drawTime();
  drawScore();
  spawnBubbles();
  updateBubbles();

  if (time > 0 && gameOver === false) {
    requestAnimationFrame(draw);
  } else {
    gameOver = true;
    overCount++;
    time = 0;
    context.font = '7vw Helvetica';
    context.fillStyle = '#000000';
    const gameOverString = 'Game Over...';
    const gameOverStringWidth = context.measureText(gameOverString).width;
    context.fillText(gameOverString, (canvas.width / 2) - (gameOverStringWidth / 2), 
      canvas.height / 2 - 200);
    drawRectangle(backButton.x, backButton.y, backButton.width, 
      backButton.height, backButton.text);
    drawRectangle(restartButton.x, restartButton.y, restartButton.width,
      restartButton.height, restartButton.text);

    let localHighScores = JSON.parse(localStorage.getItem(scoreKey));
    if (localHighScores.length < 5 && overCount < 2) {
      localHighScores.push(score);
      localHighScores = localHighScores.sort((a, b) => a - b);
      drawHighScores(localHighScores.slice().reverse());
    } else if (checkForHighScore(localHighScores, score) && overCount < 2) {
      localHighScores.push(score);
      localHighScores = localHighScores.sort((a, b) => a - b);
      if(localHighScores[localHighScores.length - 1] < localHighScores[0]) {
        localHighScores.reverse();
      }
      localHighScores.length = 5;
      drawHighScores(localHighScores);
    } else {
      drawHighScores(localHighScores.slice().reverse());
    }
    localStorage.setItem(scoreKey, JSON.stringify(localHighScores));
  }
}

// Add event listeners to the window
canvas.addEventListener('click', clickHandler, false);
window.addEventListener('load', draw(), false);
canvas.addEventListener('resize', draw(), false);
