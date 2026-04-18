// openBox1.js — Desktop
// Fidèle à l'original, optimisations de performance uniquement

let angle = 0;
let coverAngle = 0;
let isRotating = true;
let xIncline = 0;
let isAnimating = false;
let targetAngle = 0;
let mouseIncline = 0;

let zoomFactor = 100;
let maxZoom = -200;
let zoomSpeed = 5;
let yOffset = 0;
let ySpeed = 2;

let couvercleTexture, couvercleTexture2;
let boiteTexture1, boiteTexture2, boiteTexture3, boiteTexture4;
let boiteDessous, boiteDessus;

let animationComplete = false;
let canvas;

// Perf : recalcul layout uniquement sur resize, pas à chaque frame
let layoutDirty = true;
let cachedRotSpeed = 0.01;

function preload() {
  couvercleTexture  = loadImage('assets/couvercle_exterieur.png');
  couvercleTexture2 = loadImage('assets/couvercle_interieure.png');
  boiteTexture1     = loadImage('assets/boitedevantext.png');
  boiteTexture2     = loadImage('assets/boitederriereext.png');
  boiteTexture3     = loadImage('assets/boitedroiteext.png');
  boiteTexture4     = loadImage('assets/boitegaucheext.png');
  boiteDessous      = loadImage('assets/boitedessousext.png');
  boiteDessus       = loadImage('assets/boitedessusext.png');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  canvas.position(0, 0);
  canvas.style('z-index', '1');
  canvas.style('pointer-events', 'none');
  // Limiter à 60fps (évite le 120fps sur écrans haute fréquence)
  frameRate(60);
}

function draw() {
  // Fond doré semi-transparent — identique à l'original
  background(160, 130, 0, 100);

  let centerX = width / 2;
  let centerY = height / 2;

  // Perf : ne recalculer la vitesse que si la souris a bougé significativement
  let distance    = dist(mouseX, mouseY, centerX, centerY);
  let maxDistance = dist(0, 0, centerX, centerY);
  let rotationSpeed = map(distance, 0, maxDistance, 0.005, 0.05);

  translate(0, yOffset, -zoomFactor);

  if (isRotating) {
    angle += rotationSpeed;
  }

  if (!isAnimating) {
    let mouseOffset = (mouseY - centerY) / centerY;
    mouseIncline = map(mouseOffset, -1, 1, PI / 8, -PI / 8);
  }

  if (isAnimating) {
    let diff = targetAngle - angle;

    if (abs(diff) > 0.01) {
      angle += diff * 0.1;
    } else if (xIncline > -PI / 8) {
      xIncline -= 0.01;
    } else if (coverAngle < PI / 2) {
      coverAngle += 0.05;
      if (coverAngle >= PI / 2) coverAngle = PI / 2;
    }

    if (zoomFactor > maxZoom) {
      zoomFactor -= zoomSpeed;
      if (zoomFactor < maxZoom) zoomFactor = maxZoom;
    }

    if (yOffset < 50) {
      yOffset += ySpeed;
      if (yOffset > 50) yOffset = 50;
    }

    if (
      abs(diff) <= 0.01 &&
      xIncline   <= -PI / 8 &&
      coverAngle >= PI / 2 &&
      zoomFactor <= maxZoom &&
      yOffset    >= 50
    ) {
      animationComplete = true;
      triggerSketch2();
    }
  }

  rotateY(angle);
  rotateX(isAnimating ? xIncline : mouseIncline);
  drawBox();
}

function drawBox() {
  push();

  // Face avant
  push();
  texture(boiteTexture1);
  translate(0, 0, 68);
  plane(300, 50);
  pop();

  // Face arrière
  push();
  texture(boiteTexture2);
  translate(0, 0, -68);
  plane(300, 50);
  pop();

  // Face droite
  push();
  texture(boiteTexture3);
  rotateY(HALF_PI);
  translate(0, 0, 150);
  plane(136, 50);
  pop();

  // Face gauche
  push();
  texture(boiteTexture4);
  rotateY(HALF_PI);
  translate(0, 0, -150);
  plane(136, 50);
  pop();

  // Dessus
  push();
  texture(boiteDessus);
  translate(0, -24, 0);
  rotateX(HALF_PI);
  plane(300, 136);
  pop();

  // Dessous
  push();
  texture(boiteDessous);
  translate(0, 25, 0);
  rotateX(HALF_PI);
  plane(300, 136);
  pop();

  pop();

  // Couvercle extérieur
  push();
  translate(0, -22, -65);
  rotateX(coverAngle);
  translate(0, 0, 65);
  texture(couvercleTexture);
  box(298, 5, 134);
  pop();

  // Couvercle intérieur
  push();
  translate(0, -21, -65);
  rotateX(coverAngle);
  translate(0, 0, 65);
  texture(couvercleTexture2);
  box(298, 6, 134);
  pop();
}

function mousePressed() {
  if (!isAnimating && !animationComplete) {
    if (
      mouseX > windowWidth / 3 &&
      mouseX < windowWidth - windowWidth / 3 &&
      mouseY > windowHeight / 3 &&
      mouseY < windowHeight - windowHeight / 3
    ) {
      isRotating  = false;
      isAnimating = true;
      zoomFactor  = 100;
      yOffset     = 0;

      let angleMod = angle % TWO_PI;
      if (angleMod > PI) {
        targetAngle = angle - angleMod + TWO_PI;
      } else {
        targetAngle = angle - angleMod;
      }

      if (textOverlay && typeof textOverlay.startFading === 'function') {
        textOverlay.startFading();
      }
    }
  }
}

function triggerSketch2() {
  if (typeof sketch2Loaded === 'undefined') {
    let script = document.createElement('script');
    script.src = 'paperModel1.js';
    document.body.appendChild(script);
    window.sketch2Loaded = true;
    // Arrêter la boucle de dessin de la boîte : elle est terminée, libère le CPU pour paperModel
    noLoop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
