const canvas = document.getElementById('trailCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let lastMousePos = { x: 0, y: 0 };
let lastMouseAngle = 0;
let mouseSpeed = 0;

const colors = [
  { color: "#003290", scalingFactor: 0.94, size: () => 18, attractionFactor: -0.0005, maxStretch: 3, directionRandomness: 0.3 },
  { color: "#0097b5", scalingFactor: 0.94, size: () => 12, attractionFactor: 0.0003, maxStretch: 5, directionRandomness: 0.15 },
  { color: "#ffffff", scalingFactor: 0.93, size: () => 7, attractionFactor: 0.001, maxStretch: 7, directionRandomness: 0 }
];

function calculateMouseSpeed(e) {
  const dx = e.x - lastMousePos.x;
  const dy = e.y - lastMousePos.y;
  mouseSpeed = Math.sqrt(dx * dx + dy * dy);
  lastMouseAngle = Math.atan2(e.y - lastMousePos.y, e.x - lastMousePos.x)
  lastMousePos = { x: e.x, y: e.y };
}

class Particle {
  constructor(x, y, speed, directionAngle, stretchFactor, { color, scalingFactor, size, maxStretch, directionRandomness }) {
    this.x = x;
    this.y = y;
    const isRandom = Math.random() < directionRandomness;
    this.color = color;
    this.size = size();
    this.speed = speed;
    this.directionAngle = isRandom ? (Math.random() * Math.PI * 2) : directionAngle;
    this.directionX = Math.cos(this.directionAngle) * this.speed;
    this.directionY = Math.sin(this.directionAngle) * this.speed;
    this.stretchFactor = Math.min(isRandom ? 0 : stretchFactor, maxStretch);
    this.scalingFactor = scalingFactor;
  }

  update() {
    this.x += this.directionX;
    this.y += this.directionY;
    if (this.size > 1) this.size *= this.scalingFactor;
  }

  draw() {
    ctx.beginPath();
    ctx.ellipse(
      this.x - Math.cos(this.directionAngle) * this.size,
      this.y - Math.sin(this.directionAngle) * this.size,
      this.size * this.stretchFactor,
      this.size,
      this.directionAngle,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function createParticles(e) {
  calculateMouseSpeed(e);

  const xPos = e.x;
  const yPos = e.y;
  const numberOfParticlesPerColor = 1;
  const stretchFactor = Math.max(1, mouseSpeed / 2);

  for (let palette of colors) {
    for (let i = 0; i < numberOfParticlesPerColor; i++) {
      const speed = Math.random() * 1 + 0.5;
      const directionAngle = lastMouseAngle;
      particlesArray.push(
        new Particle(xPos, yPos, speed, directionAngle, stretchFactor, palette)
      );
    }
  }
}

function handleParticles() {
  for (let palette of colors) {
    for (let i = 0; i < particlesArray.length; i++) {
      if (particlesArray[i].color === palette.color) {
        const dx = lastMousePos.x - particlesArray[i].x;
        const dy = lastMousePos.y - particlesArray[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        particlesArray[i].directionX += dx * palette.attractionFactor;
        particlesArray[i].directionY += dy * palette.attractionFactor;

        particlesArray[i].update();
        particlesArray[i].draw();

        if (particlesArray[i].size <= 2) {
          particlesArray.splice(i, 1);
          i--;
        }
      }
    }
  }
}

let i = 0
const fps = 60
let lastRender = 0
function animate() {
  if ((Date.now() - lastRender) > (1000 / fps)) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    lastRender = Date.now()
  }
  requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', createParticles);
animate();