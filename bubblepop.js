const canvas = document.getElementById('game');
const context = canvas.getContext("2d");
const bubblePoints = 50;
const startTime = Math.round((new Date()).getTime() / 1000);
var spawnRate = 1; //increase or decrease as time goes on?
var score = 0;
var bubbles = [];
var spawnNumber = 1;

function isIntersect(point, circle) {
  return Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.r;
}

function clickHandler(event) {
  const position = {
    x: event.clientX,
    y: event.clientY
  };
  for (var i = bubbles.length - 1; i >= 0; i--) {
    if (isIntersect(position, bubbles[i])) {
      score += 10;
      bubbles.splice(i, 1);
    }
  }
}

function drawScore() {
  context.font = '25px Helvetica'; //scaling?
  context.fillText(`Score: ${score}`, 10, 30);
}

function drawCircle(x, y, r) {
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2);
  context.fillStyle = '#0000ff'; //random color?
  context.fill();
  context.closePath();
}

function spawnBubbles() {
  if (Math.round((new Date()).getTime() / 1000) > startTime + spawnRate) {
    spawnNumber++;
    spawnRate++;
  }

  if (bubbles.length < spawnNumber) {
    for (var i = spawnNumber; i >= 0; i--) {
      const x = Math.random() * (canvas.width - 10) + 10;
      const y = Math.random() * (canvas.height - 30) + 30;
      const r = Math.random() * (50 - 5) + 5;
      bubbles.push({x: x, y: y, r: r});
    }
  }

  bubbles.forEach(function(bubble) {
    drawCircle(bubble.x, bubble.y, bubble.r);
  });
}

function draw() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  drawScore();
  spawnBubbles();

  requestAnimationFrame(draw);
}

window.addEventListener('click', clickHandler, false);
window.addEventListener('load', draw(), false);
window.addEventListener('resize', draw(), false);