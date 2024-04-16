import {Ball} from './objects/ball.js';
import {Point} from './objects/point.js';

const canvas = document.getElementById("panel");
const ctx = canvas.getContext("2d");
const lose_audio = new Audio("assets/sounds/ERROR.WAV");
const win_audio = new Audio("assets/sounds/SUCCESS.WAV");
let ball;


let x = canvas.width / 2;
let y = canvas.height - 30;
//let ballRadius = 10;
let dx = 2;
let dy = -2;
let playing = false;
// paddle configuration
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
// bricks configuration
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
//array of brick objects
const bricks = [];
//score configuration
let score = 0;
// lives configuration
let lives = 3;

function cleanScreen()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function createGameObjects(x, y) {
  ball = createBallObject(x,y);
}

function createBallObject(x, y){
  let point = new Point(x,y);
  return new Ball(point, 10,"#0095DD" );
}

function drawScore() 
{
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() 
{
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function checkWinGame()
{
    if (score === brickRowCount * brickColumnCount) {
        win_audio.play();
        alert("YOU WIN, CONGRATULATIONS!");
    }
}

function drawPaddle() 
{
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - (paddleHeight + 2), paddleWidth, paddleHeight);
    ctx.fillStyle = "#45Fd4E";
    ctx.fill();
    ctx.closePath();
}


function drawBall(ball)
{
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height / 2);
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
           

            // Add two color stops
            gradient.addColorStop(0, "#04529a");
            gradient.addColorStop(.5, "#2bd6fa");
            gradient.addColorStop(1, "#04529a");
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;

            ctx.beginPath();
            //ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = gradient;
            ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
            ctx.closePath();
        }
      }
    }
  }

function draw() 
{
    if (playing) {
        cleanScreen();
        drawScore();
        drawLives();
        //drawBall(ball);
        ball.draw(ctx)
        drawPaddle();
        drawBricks();
        collisionDetection();
        //determino si toca los bordes del canvas
        let ballRadiusAjust = ball.radius - 2;    
        if (ball.x + dx > canvas.width - ballRadiusAjust || ball.x + dx < ballRadiusAjust) {
            dx = -dx;
        }

        if (ball.y + dy < ball.radius) {
            dy = -dy;
        } else if (ball.y + dy > canvas.height - ballRadiusAjust) {
            if (ball.x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            } else {
                lives--;
                if (!lives) {
                    lose_audio.play();
                    alert("GAME OVER");
                    playing = false;
                } else {
                    ball.x = canvas.width / 2;
                    ball.y = canvas.height - 30;
                    dx = 2;
                    dy = -2;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        if (rightPressed) {
            paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
        } else if (leftPressed) {
            paddleX = Math.max(paddleX - 7, 0);
        }
       //x += dx;
        //y += dy;
        ball.x += dx;
        ball.y += dy;
        
        if(playing) {
            window.requestAnimationFrame(draw);
        }
    }
}

function keyDownHandler(e) 
{
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
    }
}
  
function keyUpHandler(e) 
{
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = false;
    }
}

function mouseMoveHandler(e) 
{
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth / 2;
    }
}

function startGame(evt)
{
   playing = !playing
   if(playing) {
        draw();
        evt.target.innerText = "Restart";
   } else {
        cleanScreen();
        console.log("debe reiniciar")
        window.document.location.reload();
   }
}

function initializeBricks()
{
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
      }
}

function collisionDetection() 
{
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 1) {
          if (
            ball.x > b.x &&
            ball.x < b.x + brickWidth &&
            ball.y > b.y &&
            ball.y < b.y + brickHeight
          ) {
            dy = -dy;
            b.status = 0;
            score++;
            if(score % 5 == 0) {
                draw();
            }
            checkWinGame();
          }
        }
      }
    }
}

function onLoad() 
{
   let btn = document.getElementById("runButton");
   btn.addEventListener("click", startGame);
   document.addEventListener("keydown", keyDownHandler, false);
   document.addEventListener("keyup", keyUpHandler, false);
   //soporte para mouse
   document.addEventListener("mousemove", mouseMoveHandler, false);
   initializeBricks();
   createGameObjects(x, y);   
}

window.onLoad = onLoad();
  
