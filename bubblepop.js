const canvas = document.getElementById('game');
const context = canvas.getContext("2d");
const bubblePoints = 50;
const startTime = Math.round((new Date()).getTime() / 1000);
const expansionContraction = .20;
var spawnRate = 1;
var score = 0;
var bubbles = [];
var spawnNumber = 1;

function doesIntersect(point, circle) {
  return Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius;
}

function clickHandler(event) {
  const position = {
    x: event.clientX,
    y: event.clientY
  };

  bubbles.forEach(function(bubble, index, bubbles) {
    if (doesIntersect(position, bubbles[index])) {
      score += 10;
      bubbles.splice(index, 1);
    }
  });
}

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

function spawnBubbles() {
  if (Math.round((new Date()).getTime() / 1000) > startTime + spawnRate) {
    spawnNumber += .35;
    spawnRate += 2;
  }

  if (bubbles.length < spawnNumber) {
    for (var i = spawnNumber; i >= 0; i--) {
      const x = Math.floor(Math.random() * (canvas.width - 10 +1 )) + 10;
      const y = Math.floor(Math.random() * (canvas.height - 30 + 1)) + 30;
      const r = Math.floor(Math.random() * (50 - 5 + 1)) + 5;
      const c = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
      bubbles.push({x: x, y: y, radius: r, ascending: true, color: c});
    }
  }

  bubbles.forEach(function(bubble, index, bubbles) {
    const negativeCheck = drawCircle(bubble.x, bubble.y, bubble.radius, bubble.color);

    if (negativeCheck === false) {
      score -= 10;
      bubbles.splice(index, 1);
    } else {
      if (bubble.radius < 50 && bubble.ascending === true) {
        bubbles[index] = {x: bubble.x, y: bubble.y, 
          radius: bubble.radius + expansionContraction, ascending: true, color: bubble.color};
      } else {
        bubbles[index] = {x: bubble.x, y: bubble.y, 
          radius: bubble.radius - expansionContraction, ascending: false, color: bubble.color}; 
      }
    }
  });
}

function draw() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  drawScore();
  spawnBubbles();

  if (score >= 0) {
    requestAnimationFrame(draw);
  } else {
    context.font = '7vw Helvetica';
    context.fillStyle = '#000000';
    context.fillText('Game Over...', canvas.width / 2 - 175, canvas.height / 2);
  }
}

window.addEventListener('click', clickHandler, false);
window.addEventListener('load', draw(), false);
window.addEventListener('resize', draw(), false);