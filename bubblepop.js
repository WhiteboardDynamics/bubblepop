const canvas = document.getElementById('game');
const context = canvas.getContext("2d");
const bubblePoints = 50;
var score = 0;

function isIntersect(point, circle) {
  return Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius;
}

function clickHandler(event) {
  const position = {
    x: event.clientX,
    y: event.clientY
  };
  if (isIntersect(position, {x: 100, y: 100, radius: 15})) {
    score += 10;
  }
}

function drawScore() {
  context.font = '25px Helvetica'; //scaling?
  context.fillText(`Score: ${score}`, 10, 30);
}

function drawCircle(x, y) {
  context.beginPath();
  context.arc(x, y, 15, 0, Math.PI * 2);
  context.fillStyle = '#0000ff';
  context.fill();
  context.closePath();
}

function draw() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  drawScore();
  drawCircle(100, 100);

  requestAnimationFrame(draw);
}

window.addEventListener('click', clickHandler, false);
window.addEventListener('load', draw(), false);
window.addEventListener('resize', draw(), false);