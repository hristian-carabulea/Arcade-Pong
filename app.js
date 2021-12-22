// v.2021.12.22a. With sound.
"use strict";

let canvas;
let canvasContext;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 12; //original value 10, made the ball faster
let ballSpeedY = 5;  //original value 4, made the ball faster
let player1Score = 0;
let player2Score = 0;
let gameBegin = true;
let showingWinScreen = false;

let hitWall = 		document.getElementById("hitWall"); // hitWall.play()
let hitPaddel = 	document.getElementById("hitPaddel"); // hitPaddel.play()

hitWall.NETWORK_LOADING;
hitPaddel.NETWORK_LOADING;

let paddle1Y = 250;
let paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_RADIUS = 10;
const WINNING_SCORE = 10;
const ANGULAR_COEFFIECIENT = 0.25; // original value 0.35, added more angle to the ball

// 

main();

//####################################################

function main() {
  window.onload = function() {
    console.log("Arcade Classic Game");
    canvas = document.getElementById('gameCanvas');
    //center the window canvas
    canvas.setAttribute('style', "position: absolute; left: 50%; margin-left:-400px; top: 50%; margin-top:-300px; border:1px solid black");
    canvasContext = canvas.getContext('2d');
    var framesPerSecond = 30;
    
    setInterval(function() { // inline functions have no name
      moveEverything();
      drawEverything();
    
    }, 1000/framesPerSecond)
  
    canvas.addEventListener ('mousedown', handleMouseClick);
  
    canvas.addEventListener('mousemove',
      function(evt) {
        var mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y-(PADDLE_HEIGHT/2); // change paddel mouse control, paddle1Y or paddle2Y
    });
  }
}
//####################################################

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
}
//####################################################

function handleMouseClick(evt) {
  if (showingWinScreen || gameBegin) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
    gameBegin = false;
    canvasContext.fillText ("Click to continue!", 350, 250); // game is stopped. Click to continue.
  }
}

//####################################################

function rightPaddelMovementsByComputer() {
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
  if (paddle2YCenter < ballY-35) {
    paddle2Y += 8; // original value  6, increased right padel speed, player two speed
  }
  else if (paddle2YCenter > (ballY + 35)){ 
    paddle2Y -= 8; // original value -6, increased right padel speed, player two speed
  }
}
//####################################################

function moveEverything() { // code for the paddles and all the ball moves

  if (showingWinScreen || gameBegin) {
    return;
  }
  rightPaddelMovementsByComputer();

  ballX += ballSpeedX; // ball motion on the X axis
  ballY += ballSpeedY; // ball motion on the Y axis

  // if ball gets out of black area's width, change direction of the ball
  if (ballX > (canvas.width - BALL_RADIUS)) {
    hitWall.play();
    ballSpeedX = -ballSpeedX;
  }
  // code for what happens when the ball hits the left paddle
  if (ballX < (0 + (PADDLE_WIDTH + BALL_RADIUS))) {
    if (ballY > paddle1Y && 
        ballY < (paddle1Y + PADDLE_HEIGHT + BALL_RADIUS)) {
          ballSpeedX = - ballSpeedX;
          // give the ball an effect when hitting it with areas closer to the paddle' edges
          var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
          ballSpeedY = deltaY * ANGULAR_COEFFIECIENT;
          hitPaddel.play();
        }
        else {
          player2Score++; // must increase score before reset
          ballReset();
        }
  }
  // code for what happens when the ball hits the right paddle
  if (ballX > (canvas.width - (PADDLE_WIDTH + BALL_RADIUS))) {
    if (ballY > paddle2Y && 
        ballY < (paddle2Y + PADDLE_HEIGHT + BALL_RADIUS)) {
          ballSpeedX = - ballSpeedX;
          // give the ball an effect when hitting it with areas closer to the paddle' edges
          var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
          ballSpeedY = deltaY * ANGULAR_COEFFIECIENT;
          hitPaddel.play();
        }
        else {
          player1Score++; // must increase score before reset
          ballReset();
        }
  }
  if (ballY > (canvas.height - BALL_RADIUS)) { // handle ball hitting the top of the screen
    hitWall.play();
    ballSpeedY = -ballSpeedY;
  }
  if (ballY < (0 + BALL_RADIUS)) { // handle ball hitting the botton of the screen
    hitWall.play();
    ballSpeedY = -ballSpeedY;
  }
}
//####################################################

function drawNet() {
  for (var i=0; i<canvas.height; i+=40) {
    colorRect(canvas.width/2-1,i,2,20,'green'); // 2 px wide, jump 40px
  }
}
//####################################################

function drawEverything() {

  // draw the black window
  colorRect(0, 0, canvas.width, canvas.height, 'black'); 
  
  if (showingWinScreen) {
    canvasContext.fillStyle = "white";

    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText ("Left Player Won: " + player1Score + " - " + player2Score, 334, 200);

    } 
    else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText ("Right Player Won: " + player1Score + " - " + player2Score, 332, 200);

    }
    canvasContext.fillText ("Click to continue!", 350, 250); // game is stopped. Click to continue.

    return;
  }

  else if (gameBegin) {
    canvasContext.fillStyle = "white";

    canvasContext.fillText ("Click to Start!", 350, 250); // game is stopped. Click to continue.

  }

  drawNet();

  // this is left paddle
  colorRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
  // the score will show in white because of the color white being set in above function call
  canvasContext.fillText (player1Score, 100, 100);
  canvasContext.fillText (player2Score, canvas.width-100, 100);
  // this is right paddle
  colorRect(canvas.width-PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white'); 
  // this is the ball
  colorBall(ballX,ballY,BALL_RADIUS,'red');
}
//####################################################

// draw the ball
function colorBall(centerX, centerY, radius, drawColor) { 
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath(); 
  canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true); 
  canvasContext.fill();
}
//####################################################

// draw rectangular shapes
function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
//####################################################

// reset the ball position at the middle of the black screen
function ballReset() {
  hitWall.play();
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    // player1Score = 0;
    // player2Score = 0;
    showingWinScreen = true;
  }
  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}