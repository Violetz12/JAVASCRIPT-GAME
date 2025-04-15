let pixel1,
  pixel2,
  cat_frame1,
  cat_frame2,
  cat_base,
  cat_eyes1,
  cat_eyes2,
  cat_eyes3,
  cat_eyes4;
let mouse_run1, mouse_run2, bird_fly1, bird_fly2, cat_chaser, mouse, bird;

let gameState = "menu";
let overButton = false;
let showModal = false;

let selectedCharacter1 = "mouse";
let selectedCharacter2 = "mouse";
let player1Confirmed = false;
let player2Confirmed = false;

let counter = 0;
let mousePlayer, birdPlayer;

let animationProgress = 0;
let frameCounter = 0;
let anim_catX = 80;
let anim_mouseX = 300;
let anim_birdX = 280;
let anim_black_h = 100;

let timerDuration = 120;
let currentTime = timerDuration;
let timerStarted = false;
let timerPaused = false;
let lastTime = 0;

let boxes = [];
let bgm;

function preload() {
  pixel1 = loadFont("../fonts/alagard.ttf");
  pixel2 = loadFont("../fonts/minecraft_font.ttf");

  cat_frame1 = loadImage("../assets/cat_walk_test1.png");
  cat_frame2 = loadImage("../assets/cat_walk_test2.png");
  cat_base = loadImage("../assets/cat_base_test.png");

  cat_eyes1 = loadImage("../assets/cat_eyes_test1.png");
  cat_eyes2 = loadImage("../assets/cat_eyes_test2.png");
  cat_eyes3 = loadImage("../assets/cat_eyes_test3.png");
  cat_eyes4 = loadImage("../assets/cat_eyes_test4.png");

  mouse_run1 = loadImage("../assets/mouse_run_anim_test1.png");
  mouse_run2 = loadImage("../assets/mouse_run_anim_test2.png");

  bird_fly1 = loadImage("../assets/bird_run_anim_test1.png");
  bird_fly2 = loadImage("../assets/bird_run_anim_test2.png");

  cat_chaser = loadImage("../assets/vio_cat_test.png");

  mouse = loadImage("../assets/mouse-vio.png");
  bird = loadImage("../assets/birdieeee.png");

  bgm = loadSound("../assets/scary_song.mp3");
  bgm.setVolume(0.4);
}

class Player {
  constructor(
    x,
    y,
    img,
    gravity,
    up,
    down,
    left,
    right,
    width = 200,
    height = 200
  ) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.gravity = gravity;

    this.width = width;
    this.height = height;

    this.up = up;
    this.down = down;
    this.left = left;
    this.right = right;

    this.isGrounded = false;
    this.jumpForce = 0;
    this.velocity = 0;
  }

  move(boxList) {
    let prevX = this.x;
    let prevY = this.y;

    if (this.gravity) {
      // Reset grounded state
      this.isGrounded = false;

      // Check if player is on ground
      for (let box of boxList) {
        if (
          this.x + this.width > box.x + 5 &&
          this.x < box.x + box.w - 5 &&
          Math.abs(this.y + this.height - box.y) < 2
        ) {
          this.isGrounded = true;
          break;
        }
      }

      // Handle jumping
      if (this.isGrounded) {
        if (keyIsDown(this.up)) {
          this.velocity = -10;
          this.isGrounded = false;
        } else {
          this.velocity = 0;
        }
      } else {
        this.velocity += 0.5; // Gravity
      }

      // Apply vertical movement
      this.y += this.velocity;
      if (this.checkCollision(boxList)) {
        this.y = prevY;
        if (this.velocity > 0) {
          this.isGrounded = true;
        }
        this.velocity = 0;
      }

      // Apply horizontal movement
      if (keyIsDown(this.left)) {
        this.x -= 5;
        if (this.checkCollision(boxList)) {
          this.x = prevX;
        }
      }
      if (keyIsDown(this.right)) {
        this.x += 5;
        if (this.checkCollision(boxList)) {
          this.x = prevX;
        }
      }
    } else {
      // Flying character (bird) movement remains the same
      if (keyIsDown(this.up)) {
        this.y -= 5;
        if (this.checkCollision(boxList)) {
          this.y = prevY;
        }
      }
      if (keyIsDown(this.down)) {
        this.y += 5;
        if (this.checkCollision(boxList)) {
          this.y = prevY;
        }
      }
      if (keyIsDown(this.left)) {
        this.x -= 5;
        if (this.checkCollision(boxList)) {
          this.x = prevX;
        }
      }
      if (keyIsDown(this.right)) {
        this.x += 5;
        if (this.checkCollision(boxList)) {
          this.x = prevX;
        }
      }
    }
  }

  checkCollision(boxList) {
    for (let box of boxList) {
      if (
        this.x < box.x + box.w &&
        this.x + this.width > box.x &&
        this.y < box.y + box.h &&
        this.y + this.height > box.y
      ) {
        if (
          this.x + this.width > box.x &&
          this.x < box.x + box.w &&
          this.y + this.height > box.y &&
          this.y < box.y + box.h
        ) {
          return true;
        }
      }
    }
    return false;
  }

  show() {
    image(this.img, this.x, this.y, this.width, this.height);
  }
}

function setup() {
  var myCanvas = createCanvas(1200, 675);
  myCanvas.parent("game-container");
  textAlign(CENTER, CENTER);
  textFont(pixel2);
  textSize(30);
  bgm.loop();

  mousePlayer = new Player(
    200,
    100,
    mouse,
    true,
    UP_ARROW,
    DOWN_ARROW,
    LEFT_ARROW,
    RIGHT_ARROW,
    80,
    80
  );
  birdPlayer = new Player(100, 100, bird, false, 87, 83, 65, 68, 150, 150);
}

function draw() {
  background(230, 238, 255);

  if (gameState === "menu") {
    drawMenu();
  } else if (gameState === "story") {
    drawStory();
  } else if (gameState === "costume") {
    drawCostume();
  } else if (gameState === "level1") {
    drawLevel1();
  } else if (gameState === "level1door") {
    drawLevel1Door();
  } else if (gameState === "correct") {
    correct();
  } else if (gameState === "level2") {
    fill(0)
    textSize(50);
    text("Level 2", width / 2, height / 2);
  } else if (gameState === "gameover") {
    background(0, 0, 0);
  }

  if (showModal) {
    drawModal();
  }

  updateCursor();
  overButton = false;
  counter++;

  // debug
  // textSize(20);
  // fill(0);
  // text("mouseX: " + Math.floor(mouseX) + " mouseY: " + Math.floor(mouseY), 200, 100);
}

function startTimer() {
  timerStarted = true;
  timerPaused = false;
  lastTime = millis();
}

function pauseTimer() {
  timerPaused = true;
}

function resumeTimer() {
  if (timerStarted) {
    timerPaused = false;
    lastTime = millis();
  }
}

function resetTimer() {
  currentTime = timerDuration;
  timerStarted = false;
  timerPaused = false;
}

function updateTimer() {
  if (timerStarted && !timerPaused) {
    let currentMillis = millis();
    let deltaTime = (currentMillis - lastTime) / 1000; // Convert to seconds
    lastTime = currentMillis;

    currentTime -= deltaTime;

    if (currentTime <= 0) {
      currentTime = 0;
      timerStarted = false;
      // Handle time's up event
      console.log("Time's up!");
      gameState = "gameover";
    }
  }
}

function drawTimer(c=0) {
  // Draw timer UI
  push();
  fill(c);
  noStroke();
  textSize(24);
  textAlign(LEFT, TOP);

  // Convert seconds to MM:SS format
  let minutes = Math.floor(currentTime / 60);
  let seconds = Math.floor(currentTime % 60);
  let timeString = nf(minutes, 2) + ":" + nf(seconds, 2);

  // Draw timer and controls
  text(timeString, 10, 10);
  pop();
}

function drawMenu() {
  // Title
  fill(0);
  textFont(pixel1);
  textSize(80);
  textStyle(BOLD);
  text("Cat Escape", width / 2, 300);
  textStyle(NORMAL);

  let startColor = color(21, 62, 100);
  let rulesColor = color(21, 62, 100);
  overButton = false;

  // Start Button
  if (mouseX > 330 && mouseX < 580 && mouseY > 400 && mouseY < 500) {
    startColor = color(25, 99, 168);
    overButton = true;
    if (mouseIsPressed) {
      console.log("Start button clicked");
      gameState = "story"; // Change game state to story
    }
  }

  // Rules Button
  if (mouseX > 630 && mouseX < 880 && mouseY > 400 && mouseY < 500) {
    rulesColor = color(25, 99, 168);
    overButton = true;
    if (mouseIsPressed) {
      console.log("Rules button clicked");
      showModal = true; // Show modal
    }
  }

  // Draw buttons
  noStroke();
  fill(startColor);
  rect(330, 400, 250, 100, 40);
  fill(rulesColor);
  rect(630, 400, 250, 100, 40);

  // Button text
  fill(255);
  textSize(26);
  textFont(pixel2);
  text("Start", 330 + 125, 450);
  text("Game Rules", 630 + 125, 450);
}

function drawStory() {
  background(100, 0, 0);
  if (animationProgress < 100) {
    frameCounter = (frameCount / 10) % 2;

    if (frameCounter < 1) {
      image(cat_frame1, 300, 0);
    } else {
      image(cat_frame2, 300, 0);
    }
    animationProgress++;
  } else if (animationProgress < 150) {
    image(cat_base, 300, 50);
    animationProgress++;
  } else if (animationProgress < 240) {
    frameCounter = Math.min((animationProgress - 150) / 2, 3);

    background(220, 30, 30);
    image(cat_base, 300, 50);

    if (frameCounter < 1) {
      image(cat_eyes1, 330, 250);
    } else if (frameCounter < 2) {
      image(cat_eyes2, 330, 250);
    } else if (frameCounter < 3) {
      image(cat_eyes3, 330, 250);
    } else {
      image(cat_eyes4, 330, 250);
    }
    animationProgress++;
  } else if (animationProgress < 550) {
    frameCounter = (frameCount / 10) % 2;

    background(255);

    image(cat_chaser, anim_catX, 300, 220, 220);

    if (frameCounter < 1) {
      image(mouse_run1, anim_mouseX, 400, 96, 72);
      image(bird_fly1, anim_birdX, 200, 120, 120);
    } else {
      image(mouse_run2, anim_mouseX, 400, 96, 72);
      image(bird_fly2, anim_birdX, 200, 120, 120);
    }

    fill(0);
    rect(0, 0, 1200, anim_black_h);
    rect(0, 675 - anim_black_h, 1200, anim_black_h);

    anim_catX += 4;
    anim_mouseX += 5;
    anim_birdX += 4;

    if (anim_black_h < 140) {
      anim_black_h += 1;
    }

    if (animationProgress > 480) {
      anim_black_h -= (animationProgress - 480) / 10;
      animationProgress++;
    }
    animationProgress++;
  } else {
    gameState = "costume";
    animationProgress = 0;
  }
}

function drawCostume() {
  // Title
  fill(0);
  textFont(pixel1);
  textSize(80);
  textStyle(BOLD);
  text("Select your character", width / 2, 100);
  textStyle(NORMAL);

  // Player 1 selection
  textSize(30);
  text("Player 1 (wasd)", 300, 200);

  // Left arrow button
  if (mouseX > 150 && mouseX < 180 && mouseY > 270 && mouseY < 330) {
    overButton = true;
  }
  triangle(150, 300, 180, 270, 180, 330);

  // Display current character
  if (selectedCharacter1 === "mouse") {
    image(mouse, 185, 240, 220, 190);
  } else {
    image(bird, 200, 240, 200, 200);
  }

  // Right arrow button
  if (mouseX > 410 && mouseX < 440 && mouseY > 270 && mouseY < 330) {
    overButton = true;
  }
  triangle(440, 300, 410, 270, 410, 330);

  // Player 2 selection
  text("Player 2 (arrow keys)", 900, 200);

  // Left arrow button
  if (mouseX > 760 && mouseX < 790 && mouseY > 270 && mouseY < 330) {
    overButton = true;
  }
  triangle(760, 300, 790, 270, 790, 330);

  // Display current character
  if (selectedCharacter2 === "mouse") {
    image(mouse, 800, 240, 220, 190);
  } else {
    image(bird, 800, 240, 200, 200);
  }

  // Right arrow button
  if (mouseX > 1030 && mouseX < 1060 && mouseY > 270 && mouseY < 330) {
    overButton = true;
  }
  triangle(1060, 300, 1030, 270, 1030, 330);

  // Confirm buttons
  if (!player1Confirmed) {
    fill(0, 255, 0);
    if (mouseX > 225 && mouseX < 375 && mouseY > 450 && mouseY < 500) {
      overButton = true;
      fill(0, 200, 0);
    }
    rect(225, 450, 150, 50);
    fill(255);
    text("Confirm", 302, 475);
  }

  if (!player2Confirmed) {
    fill(0, 255, 0);
    if (mouseX > 830 && mouseX < 980 && mouseY > 450 && mouseY < 500) {
      overButton = true;
      fill(0, 200, 0);
    }
    rect(830, 450, 150, 50);
    fill(255);
    text("Confirm", 907, 475);
  }

  if (player1Confirmed && player2Confirmed) {
    updatePlayerControls();
    gameState = "level1";
    counter = 0;
  }
}

function updatePlayerControls() {
  // Player 1 (WASD)
  if (selectedCharacter1 === "mouse") {
    mousePlayer = new Player(200, 100, mouse, true, 87, 83, 65, 68, 80, 80); // W,S,A,D
  } else {
    birdPlayer = new Player(100, 100, bird, false, 87, 83, 65, 68, 150, 150); // W,S,A,D
  }

  // Player 2 (Arrow Keys)
  if (selectedCharacter2 === "mouse") {
    mousePlayer = new Player(
      200,
      100,
      mouse,
      true,
      UP_ARROW,
      DOWN_ARROW,
      LEFT_ARROW,
      RIGHT_ARROW,
      80,
      80
    );
  } else {
    birdPlayer = new Player(
      100,
      100,
      bird,
      false,
      UP_ARROW,
      DOWN_ARROW,
      LEFT_ARROW,
      RIGHT_ARROW,
      150,
      150
    );
  }
}

function drawModal() {
  // Modal background
  fill(255);
  stroke(0);
  rect(400, 200, 400, 250, 20);

  // Modal text
  fill(0);
  textSize(30);
  text("Game Rules", 600, 230);
  textSize(20);
  text("1. Use arrow keys to move.", 600, 280);
  text("2. Avoid obstacles.", 600, 320);
  text("3. Reach the goal to win!", 600, 360);

  // Close button (X)
  fill(255, 0, 0);
  ellipse(770, 220, 30, 30);
  fill(255);
  textSize(20);
  text("X", 771, 218);
}

let buttonX, buttonY, buttonW, buttonH;
let buttonActivated = false;
let buttonHovered = false;
let newButtonX, newButtonY, newButtonW, newButtonH;
let newButtonActivated = false;
let newButtonHovered = false;
let doorUnlocked = false;
let doorMessageTimeout = 0;
let mouseBlock = null;
let mouseBlockIndex = -1;

let mouseHole = [30, 555, 100, 300];
// doors data
let doorsRiddle = [
  { x: 200, y: 200, w: 150, h: 200, c: [204, 51, 0] },
  { x: 525, y: 200, w: 150, h: 200, c: [0, 204, 180] }, 
  { x: 850, y: 200, w: 150, h: 200, c: [102, 0, 255] },
]
let riddles = [
  "The second letter of the alphabet,\nand a very long stick.\nIts rather twisted;\nthough it closes up.",
  "Maybe the sky,\nor maybe the sea.\nWhat I see?\nthe sacred color of mice.",
  "Heartbroken,\nflooded in tears of blood.\nRoses aren't red;\nso aren't violets..."
]
let randomR = Math.floor(Math.random() * 3);
let hinttxt = "are mice colorblind??";

function setupLevel1() {
  boxes = [];

  // Platforms and walls
  boxes.push(new boxItem(300, height - 200, 200, 30, color(100, 70, 50))); // Main platform
  boxes.push(new boxItem(600, height - 300, 200, 30, color(100, 70, 50))); // Higher platform

  if (!doorUnlocked) {
    boxes.push(new boxItem(width - 50, height - 200, 50, 200, color(160, 82, 45)));
  }

  // Ground
  boxes.push(new boxItem(0, height - 20, width, 30, color(100, 50, 50)));
  // pressure plate activated blocker
  mouseBlockIndex = boxes.length;
  mouseBlock = new boxItem(0, 520, 150, 100, color(0, 180, 0));
  boxes.push(mouseBlock);

  // Button positions (relative to your level design)
  buttonW = 80;
  buttonH = 30;
  buttonX = 350; // On the main platform
  buttonY = height - 200 - buttonH - 10;

  newButtonW = 80;
  newButtonH = 30;
  newButtonX = width - 100; // Near the door
  newButtonY = height - 200 - newButtonH - 60;

  console.log(boxes);
}

function drawLevel1() {
  if (counter === 100) {
    setupLevel1();
    resetTimer();
    startTimer();
  }

  if (counter > 100) {
    if (doorUnlocked) {
      fill(0, 255, 0);
      textSize(30);
      text("Level 2 ->", width - 100, 300);
      if (mousePlayer.x > width && birdPlayer.x > width) {
        gameState = "level2";
        doorUnlocked = false;
      }
    }

    // hint, top right corner
    fill(0, 0, 0);
    textSize(20);
    push();
    translate(width - 100, 70);
    rotate(-75);
    text(hinttxt, 0, 0);
    pop();

    updateTimer();
    drawTimer();
    drawMouseHole();
    // Draw boxes
    for (let box of boxes) {
      box.show();
    }

    drawFirstButton();
    if (newButtonActivated) {
      drawSecondButton();
    }
    checkButtonInteractions();

    mousePlayer.show();
    mousePlayer.move(boxes);

    birdPlayer.show();
    birdPlayer.move(boxes);

  } else {
    fill(0);
    textSize(50);
    text("Level 1", width / 2, height / 2);
  }
}

function drawLevel1Door() {
  background(0);
  updateTimer();
  drawTimer(color(255, 255, 255));

  for (let door of doorsRiddle) {
    if (collideRectRect(
      mousePlayer.x,
      mousePlayer.y,
      mousePlayer.width,
      mousePlayer.height,
      door.x,
      door.y,
      door.w,
      door.h
    )) { stroke(255, 215, 0); } else { stroke(0); }
    strokeWeight(5);
    fill(door.c[0], door.c[1], door.c[2]);
    rect(door.x, door.y, door.w, door.h);

    noStroke();
    // door knob
    fill(255, 215, 0);
    circle(door.x + door.w - 120, door.y + 80, 20);
  }

  textSize(30);
  fill(255);
  textAlign(CENTER);
  text("You find yourself in front of 3 doors...\nTwo would lead to your doom. Choose wisely. (press 'e')", width / 2, 100);
  
  textAlign(LEFT);
  text(riddles[randomR], 30, 500);
  mousePlayer.show();
  mousePlayer.move(boxes);

  // door collide
  for (let i = 0; i < doorsRiddle.length; i++) {
    let door = doorsRiddle[i];
    if (collideRectRect(
      mousePlayer.x,
      mousePlayer.y,
      mousePlayer.width,
      mousePlayer.height,
      door.x,
      door.y,
      door.w,
      door.h
    )) {
      if (collideRectRect(
        mousePlayer.x,
        mousePlayer.y,
        mousePlayer.width,
        mousePlayer.height,
        doorsRiddle[2].x,
        doorsRiddle[2].y,
        doorsRiddle[2].w,
        doorsRiddle[2].h
      ) && keyIsDown(69)) {
        console.log("win")
        gameState = "correct"
      } else if (keyIsDown(69)) {
        console.log("lose")
        gameState = "gameover";
      }
    }
  }
}

let texty = 500
function correct() {
  background(0, 30, 0);
  fill(255);
  textSize(80);
  textAlign(CENTER);
  text("Correct.", width / 2, texty);

  if (texty > 350) {
    texty -= 1;
    counter = 0;
  } else if (counter > 100) {
    gameState = "level1";
    doorUnlocked = true;
    setupLevel1();
    mousePlayer.gravity = true;
    mousePlayer.x = 200;
    hinttxt = "yeah. duh.";
  } else {
    counter += 2;
  }
}

function checkButtonInteractions() {
  // Check both players for button interactions
  buttonHovered =
    collideRectRect(
      mousePlayer.x,
      mousePlayer.y,
      mousePlayer.width,
      mousePlayer.height,
      buttonX,
      buttonY,
      buttonW,
      buttonH
    ) ||
    collideRectRect(
      birdPlayer.x,
      birdPlayer.y,
      birdPlayer.width,
      birdPlayer.height,
      buttonX,
      buttonY,
      buttonW,
      buttonH
    );

  // Activate first button on hover
  if (buttonHovered) {
    console.log("Button hovered");
    if (mouseBlockIndex >= 0 && mouseBlockIndex < boxes.length) {
      boxes.splice(mouseBlockIndex, 1);
      mouseBlockIndex = -1;
      buttonActivated = true;
    }
  } else {
    if (mouseBlockIndex === -1) {
      mouseBlock = new boxItem(30, 480, 150, 100, color(0, 180, 0));
      boxes.push(mouseBlock);
      mouseBlockIndex = boxes.length - 1;
      buttonActivated = false;
    }
  }
    //newButtonActivated = true;
  
/*
  // Second button hover check (only if active)
  if (newButtonActivated) {
    newButtonHovered =
      collideRectRect(
        mousePlayer.x,
        mousePlayer.y,
        mousePlayer.width,
        mousePlayer.height,
        newButtonX,
        newButtonY,
        newButtonW,
        newButtonH
      ) ||
      collideRectRect(
        birdPlayer.x,
        birdPlayer.y,
        birdPlayer.width,
        birdPlayer.height,
        newButtonX,
        newButtonY,
        newButtonW,
        newButtonH
      );
  }*/

  mouseHoleDetect = collideRectRect(
    mousePlayer.x,
    mousePlayer.y,
    mousePlayer.width,
    mousePlayer.height,
    mouseHole[0],
    mouseHole[1],
    mouseHole[2],
    mouseHole[3]
  );
  if (mouseHoleDetect) {
    console.log("mouse hole!!");
    gameState = "level1door";
    boxes = [];
    mousePlayer.gravity = false;
  }
}

function drawFirstButton() {
  if (buttonHovered && !buttonActivated)
    fill(255, 182, 193); // Light pink when hovering
  else if (buttonActivated) fill(139, 0, 0); // Dark red when activated
  else fill(255, 0, 0); // Red when idle
  noStroke();
  rect(buttonX, buttonY, buttonW, buttonH);
}
/*
function drawSecondButton() {
  if (newButtonHovered) fill(255, 255, 0); // Yellow when hovering
  else fill(0, 255, 0); // Green normally

  noStroke();
  rect(newButtonX, newButtonY, newButtonW, newButtonH);

  // Unlock door when hovered (could change to require key press)
  if (newButtonHovered) {
    doorUnlocked = true;
    doorMessage = "Door Unlocked!";
    doorMessageTimeout = frameCount;
  }
}*/

function drawMouseHole () {
  fill(0, 0, 0);
  noStroke();
  rect(mouseHole[0], mouseHole[1], mouseHole[2], mouseHole[3]);
  circle(mouseHole[0] + mouseHole[2] /2, mouseHole[1], mouseHole[2]);
}

// Helper function for rectangle collision
function collideRectRect(x1, y1, w1, h1, x2, y2, w2, h2) {
  // Make collision detection more forgiving with a small overlap threshold
  const overlap = 5;
  const collision =
    x1 < x2 + w2 + overlap &&
    x1 + w1 > x2 - overlap &&
    y1 < y2 + h2 + overlap &&
    y1 + h1 > y2 - overlap;

  return collision;
}
function updateCursor() {
  if (overButton || (showModal && dist(mouseX, mouseY, 770, 220) < 15)) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

function mousePressed() {
  // If close button (X) is clicked
  if (showModal && dist(mouseX, mouseY, 770, 220) < 15) {
    showModal = false;
  }

  const characters = ["mouse", "bird"];
  if (!player1Confirmed) {
    // Left arrow
    if (mouseX > 150 && mouseX < 180 && mouseY > 270 && mouseY < 330) {
      let currentIndex = characters.indexOf(selectedCharacter1);
      if (currentIndex === 0) {
        selectedCharacter1 = characters[characters.length - 1];
      } else {
        selectedCharacter1 = characters[currentIndex - 1];
      }
    }
    // Right arrow
    if (mouseX > 410 && mouseX < 440 && mouseY > 270 && mouseY < 330) {
      let currentIndex = characters.indexOf(selectedCharacter1);
      if (currentIndex === characters.length - 1) {
        selectedCharacter1 = characters[0];
      } else {
        selectedCharacter1 = characters[currentIndex + 1];
      }
    }
    // Confirm button
    if (mouseX > 225 && mouseX < 375 && mouseY > 450 && mouseY < 500) {
      if (!(player2Confirmed && selectedCharacter1 === selectedCharacter2)) {
        player1Confirmed = true;
      }
    }
  }

  // Player 2 controls
  if (!player2Confirmed) {
    // Left arrow
    if (mouseX > 760 && mouseX < 790 && mouseY > 270 && mouseY < 330) {
      let currentIndex = characters.indexOf(selectedCharacter2);
      if (currentIndex === 0) {
        selectedCharacter2 = characters[characters.length - 1];
      } else {
        selectedCharacter2 = characters[currentIndex - 1];
      }
    }
    // Right arrow
    if (mouseX > 1030 && mouseX < 1060 && mouseY > 270 && mouseY < 330) {
      let currentIndex = characters.indexOf(selectedCharacter2);
      if (currentIndex === characters.length - 1) {
        selectedCharacter2 = characters[0];
      } else {
        selectedCharacter2 = characters[currentIndex + 1];
      }
    }
    // Confirm button
    if (mouseX > 830 && mouseX < 980 && mouseY > 450 && mouseY < 500) {
      if (!(player1Confirmed && selectedCharacter1 === selectedCharacter2)) {
        player2Confirmed = true;
      }
    }
  }
}

class boxItem {
  constructor(x, y, w, h, color) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  show() {
    fill(this.color);
    stroke(0);
    strokeWeight(2);
    rect(this.x, this.y, this.w, this.h); // Removed rounded corners for better collision
  }
}
