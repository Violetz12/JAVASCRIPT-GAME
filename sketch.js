// Game state variable
let gameState = 'menu';
// Track if mouse is over a button
let overButton = false;
let showModal = false; // Track if modal should be displayed

let selectedCharacter1 = 'mouse';
let selectedCharacter2 = 'mouse';
let player1Confirmed = false;
let player2Confirmed = false;

let pixel1, pixel2;
function preload() {
    pixel1 = loadFont('fonts/alagard.ttf');
    pixel2 = loadFont('fonts/minecraft_font.ttf');

    cat_frame1 = loadImage('assets/cat_walk_test1.png');
    cat_frame2 = loadImage('assets/cat_walk_test2.png');

    cat_base = loadImage('assets/cat_base_test.png');

    cat_eyes1 = loadImage('assets/cat_eyes_test1.png');
    cat_eyes2 = loadImage('assets/cat_eyes_test2.png');
    cat_eyes3 = loadImage('assets/cat_eyes_test3.png');
    cat_eyes4 = loadImage('assets/cat_eyes_test4.png');

    mouse = loadImage('assets/mouse-test.png');
    bird = loadImage('assets/bird-test.png');
    arrow = loadImage('assets/arrow.png')
}

function setup() {
    var myCanvas = createCanvas(1200, 675);
    myCanvas.parent('game-container');
    textAlign(CENTER, CENTER);
    textFont(pixel2);
    textSize(30);
}

let animationStarted = false;
let animationProgress = 0;
let frameCounter = 0;

function draw() {
    background(230, 238, 255); // Clears previous frames

    if (gameState === 'menu') {
        drawMenu();
    } else if (gameState === 'story') {
        drawStory();
    } else if (gameState === 'costume') {
        drawCostume();
    } else if (gameState === 'level1') {
        // Draw level 1
        fill(0);
        text("Level 1", width / 2, height / 2);
    }

    if (showModal) {
        drawModal();
    }

    updateCursor();
    //text("mouseX: " + mouseX + " mouseY: " + mouseY, 100, 100);
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
            animationStarted = true;
            gameState = 'story'; // Change game state to story
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

// story animation
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
    } else if (animationProgress < 500) {
        background(255);
        fill(0);
        textSize(40);
        text("[cat chasing down mouse and bird]", 600, 100);

        animationProgress++;
    } else {
        gameState = 'costume';
        animationStarted = false;
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
    text("Player 1", 300, 200);

    // Left arrow button
    triangle(150, 300, 180, 270, 180, 330);

    // Display current character
    if (selectedCharacter1 === 'mouse') {
        image(mouse, 140, 170, 340, 340);
    } else {
        image(bird, 140, 170, 340, 340);
    }

    // Right arrow button
    triangle(440, 300, 410, 270, 410, 330);

    // Player 2 selection
    text("Player 2", 900, 200);

    // Left arrow button
    triangle(760, 300, 790, 270, 790, 330);

    // Display current character
    if (selectedCharacter2 === 'mouse') {
        image(mouse, 750, 170, 340, 340);
    } else {
        image(bird, 750, 170, 340, 340);
    }

    // Right arrow button
    triangle(1060, 300, 1030, 270, 1030, 330);

    // Confirm buttons
    if (!player1Confirmed) {
        fill(0, 255, 0);
        rect(225, 450, 150, 50);
        fill(255);
        text("Confirm", 302, 475);
    }

    if (!player2Confirmed) {
        fill(0, 255, 0);
        rect(830, 450, 150, 50);
        fill(255);
        text("Confirm", 907, 475);
    }

    if (player1Confirmed && player2Confirmed) {
        gameState = 'level1';
    }
}

// Check for close button click
function mousePressed() {
    // If close button (X) is clicked
    if (showModal && dist(mouseX, mouseY, 770, 220) < 15) {
        showModal = false;
    }

    // Player 1 controls
    if (!player1Confirmed) {
        // Left arrow
        if (mouseX > 150 && mouseX < 180 && mouseY > 270 && mouseY < 330) {
            selectedCharacter1 = 'mouse';
        }
        // Right arrow
        if (mouseX > 410 && mouseX < 440 && mouseY > 270 && mouseY < 330) {
            selectedCharacter1 = 'bird';
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
            selectedCharacter2 = 'mouse';
        }
        // Right arrow
        if (mouseX > 1030 && mouseX < 1060 && mouseY > 270 && mouseY < 330) {
            selectedCharacter2 = 'bird';
        }
        // Confirm button
        if (mouseX > 830 && mouseX < 980 && mouseY > 450 && mouseY < 500) {
            if (!(player1Confirmed && selectedCharacter1 === selectedCharacter2)) {
                player2Confirmed = true;
            }
        }
    }
}

function updateCursor() {
    if (overButton || (showModal && dist(mouseX, mouseY, 770, 220) < 15)) {
        cursor(HAND);
    } else {
        cursor(ARROW);
    }
}