let obstacles;
let randint;
let score;
let lost;
let next;
let dinosaur;
let bgImage;
let bgX = 0;
let dinoImage;   // Variable para almacenar la imagen del dinosaurio
let cactusImage; // Variable para almacenar la imagen del cactus

function preload() {
  bgImage = loadImage('backgrounddino.png');  // Carga la imagen de fondo
  dinoImage = loadImage('dino.gif');      // Carga la imagen del dinosaurio
  cactusImage = loadImage('cactus.png');  // Carga la imagen del cactus
}

function setup() {
  createCanvas(800, 550);
  textSize(24);
  resetSketch();
}

function keyPressed() {
  if (key == ' ') {
    jumpDinosaur();
    if (lost) {
      resetSketch();
    }
  }
}

function resetSketch() {
  console.log("Restarting game");
  score = 0;
  lost = false;
  obstacles = [];
  next = 0;
  dinosaur = createDinosaur();
  obstacles.push(createObstacle());
  randint = int(random(50, 150));
  loop();
}

function draw() {
  // Dibuja la imagen de fondo desplazada
  image(bgImage, bgX, 0, width, height);
  image(bgImage, bgX + width, 0, width, height);

  bgX -= 2;  // Ajusta la velocidad del fondo

  if (bgX <= -width) {
    bgX = 0;
  }

  fill(255);  // Establece el color del texto a blanco
  
  // Formato de puntaje con 5 dígitos
  let scoreText = nf(score, 5);
  text(scoreText, 5, 24);
  
  // Incrementa el puntaje más rápido
  score += 1;

  next += 1;
  if (next == randint) {
    obstacles.push(createObstacle());
    next = 0;
    randint = int(random(40, width / 5));
  }
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let o = obstacles[i];
    if (o.x < 0) {
      obstacles.splice(i, 1);
    }
    moveObstacle(o);
    showObstacle(o);
    if (hitsDinosaur(dinosaur, o)) {
      console.log("Game Over!");
      lost = true;
      noLoop();
    }
  }

  showDinosaur(dinosaur);
  moveDinosaur(dinosaur);
}

function createDinosaur() {
  return {
    r: 50,
    x: 50,
    y: height,
    vy: 0,
    gravity: 0.6
  };
}

function jumpDinosaur() {
  let elev = height - dinosaur.y - dinosaur.r;
  if (elev == 0) {
    dinosaur.vy = -15;
  }
}

function hitsDinosaur(dino, obs) {
  // Check if the center of the dinosaur is close to any edge of the obstacle
  let dinoCenterX = dino.x + dino.r / 2;
  let dinoCenterY = dino.y + dino.r / 2;
  
  // Check the distance from the center of the dinosaur to the rectangle edges
  let closestX = constrain(dinoCenterX, obs.x, obs.x + obs.w);
  let closestY = constrain(dinoCenterY, obs.y, obs.y + obs.h);
  
  let distance = dist(dinoCenterX, dinoCenterY, closestX, closestY);
  
  return distance < dino.r / 2;
}

function moveDinosaur(dino) {
  dino.y += dino.vy;
  dino.vy += dino.gravity;
  dino.y = constrain(dino.y, 0, height - dino.r);
}

function showDinosaur(dino) {
  // Dibuja la imagen del dinosaurio en lugar del rectángulo
  image(dinoImage, dino.x, dino.y - 25, 80, 80);
}

function createObstacle() {
  return {
    h: 50,
    w: 20,
    x: width,
    y: height - 65
  };
}

function moveObstacle(obs) {
  obs.x -= 6;
}

function showObstacle(obs) {
  // Dibuja la imagen del cactus en lugar del rectángulo
  image(cactusImage, obs.x, obs.y - 25, obs.w * 2, obs.h * 2);
}
