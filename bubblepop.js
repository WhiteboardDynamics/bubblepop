const canvas = document.getElementById('game');
const context = canvas.getContext("2d");
const bubblePoints = 50;
const startTime = Math.round((new Date()).getTime() / 1000);
const expansionContraction = .20;
const bubbleVelocity = .25;
let spawnRate = 1;
let score = 0;
let bubbles = [];
let spawnNumber = 1;

// Is the point within the circle?
function doesIntersect(point, circle) {
  // Check whether the distance from the center of the circle to the
  // point is less than the circle's radius.
  return Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius;
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
    if (doesIntersect(position, bubbles[index])) {
      score += 10;
      bubbles.splice(index, 1);
    }
  });
}

// Draws the current score
function drawScore() {
  context.font = '3vw Helvetica';
  context.fillStyle = '#000000';
  context.fillText(`Score: ${score}`, 10, 30);
}

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

// Returns an integer between min (inclusive) and max (inclusive)
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Returns a random color
function randomColor() {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}

// Returns a random direction
function randomDirection() {
  const seed = randomInteger(0, 7);
  switch (seed) {
    case 0:
      return 'n';
    case 1:
      return 's';
    case 2:
      return 'e';
    case 3:
      return 'w';
    case 4:
      return 'ne';
    case 5:
      return 'nw';
    case 6:
      return 'se';
    case 7:
      return 'sw';
    default:
      return 'n';
  }
}

// Returns the opposite of the given direction
function reverseDirection(direction) {
  switch (direction) {
    case 'n':
      return 's';
    case 's':
      return 'n';
    case 'e':
      return 'w';
    case 'w':
      return 'e';
    case 'ne':
      return 'se';
    case 'nw':
      return 'sw';
    case 'se':
      return 'ne';
    case 'sw':
      return 'nw';
    default:
      return direction
  }
}

// Checks if a bubble is at the edge and reverses its direction if it is
function edgeCheck(x, y, radius, direction) {
  if (x + bubbleVelocity >= canvas.width - radius 
    || x + bubbleVelocity <= radius 
    || y + bubbleVelocity >= canvas.height - radius
    || y + bubbleVelocity <= radius) {
    return reverseDirection(direction);
  } else {
    return direction;
  }
}

// Creates more bubbles if necessary and modifies their position
function spawnBubbles() {
  if (Math.round((new Date()).getTime() / 1000) > startTime + spawnRate) {
    spawnNumber += .35;
    spawnRate += 2;
  }

  if (bubbles.length < spawnNumber) {
    for (let i = spawnNumber; i >= 0; i--) {
      const radius = randomInteger(5, 50);
      const x = randomInteger(10, canvas.width);
      const y = randomInteger(30, canvas.height);
      const c = randomColor();
      const d = randomDirection();
      bubbles.push({x: x,
                    y: y,
                    radius: radius,
                    ascending: true,
                    color: c,
                    direction: d});
    }
  }

  bubbles.forEach(function(bubble, index, bubbles) {
    const negativeCheck = drawCircle(bubble.x, bubble.y, bubble.radius, bubble.color);

    if (negativeCheck === false) {
      score -= 10;
      bubbles.splice(index, 1);
    } else {
      let bubbleX = bubble.x;
      let bubbleY = bubble.y;

      const direction = edgeCheck(bubble.x, bubble.y, bubble.radius, bubble.direction);

      switch (direction) {
        case 'n':
          bubbleY += bubbleVelocity;
          break;
        case 's':
          bubbleY -= bubbleVelocity;
          break;
        case 'e':
          bubbleX += bubbleVelocity;
          break;
        case 'w':
          bubbleX -= bubbleVelocity;
          break;
        case 'ne':
          bubbleX += bubbleVelocity;
          bubbleY += bubbleVelocity;
          break;
        case 'nw':
          bubbleX -= bubbleVelocity;
          bubbleY += bubbleVelocity;
          break;
        case 'se':
          bubbleX += bubbleVelocity;
          bubbleY -= bubbleVelocity;
          break;
        case 'sw':
          bubbleX -= bubbleVelocity;
          bubbleY -= bubbleVelocity;
          break;
      }

      if (bubble.radius < 50 && bubble.ascending === true) {
        bubbles[index] = {x: bubbleX,
                          y: bubbleY,
                          radius: bubble.radius + expansionContraction,
                          ascending: true,
                          color: bubble.color,
                          direction: direction};
      } else {
        bubbles[index] = {x: bubbleX,
                          y: bubbleY,
                          radius: bubble.radius - expansionContraction,
                          ascending: false,
                          color: bubble.color,
                          direction: direction};
      }
    }
  });
}

// Redraws the screen each tick
function draw() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  drawScore();
  spawnBubbles();

  if (score >= 0) {
    requestAnimationFrame(draw);
  } else {
    score = 0;
    context.font = '7vw Helvetica';
    context.fillStyle = '#000000';
    context.fillText('Game Over...', canvas.width / 2 - 175, canvas.height / 2);
  }
}

// Add event listeners to the window
window.addEventListener('click', clickHandler, false);
window.addEventListener('load', draw(), false);
window.addEventListener('resize', draw(), false);
