import {Ball} from './objects/ball.js';
import {Point} from './objects/point.js';
import {PaddleBall} from './objects/paddle.js';
import {Text} from './objects/text.js';
import {Actions as actions, Actions} from './common/actions.js';

const canvas = document.getElementById("panel");
const ctx = canvas.getContext("2d");
const lose_audio = new Audio("assets/sounds/ERROR.WAV");
const win_audio = new Audio("assets/sounds/SUCCESS.WAV");
//game objects
let ball;
let paddle;
let scoreText;
let livesText;
let raf;
let status = Actions.GAME_OVER;

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

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
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(30 30 30 / 25%)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function createGameObjects(x, y) {
  ball = createBallObject(x,y);
  paddle = createPaddleObject(x,y);
  scoreText = createScoreText(8,20);
  livesText = createLivesText(canvas.width - 65,20);
  paddle.x = (canvas.width - paddle.width) / 2 ;
  paddle.y =  canvas.height - (paddle.height + 2)
}

function createBallObject(x, y){
  let point = new Point(x,y);
  return new Ball(point, 10,"#0095DD" );
}

function createPaddleObject(x,y)
{
    let point = new Point(x,y);
    return new PaddleBall(point, 75, 10, "#45Fd4E");
}

function createScoreText(x,y)
{
    let point = new Point(x,y);
    return new Text(point, "Score", "16px Arial", "#0095DD")
}

function createLivesText(x,y)
{
    let point = new Point(x,y);
    return new Text(point, "lives", "16px Arial", "#0095DD")
}

function checkWinGame()
{
    if (score === brickRowCount * brickColumnCount) {
        status = actions.GAME_OVER;
        win_audio.play().then(r => { console.log('Player win the game!!')});
        alert("YOU WIN, CONGRATULATIONS!");
    }
}

function drawBricks() {
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height / 2);
    gradient.addColorStop(0, "#04529a");
    gradient.addColorStop(.5, "#2bd6fa");
    gradient.addColorStop(1, "#04529a");
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
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
    if (status === Actions.PLAYING) {
        cleanScreen();
        scoreText.draw(ctx, `Score: ${score}`);
        livesText.draw(ctx, `Lives: ${lives}`);
        ball.draw(ctx)
        paddle.draw(ctx)
        drawBricks();
        collisionDetection();
        //determino si toca los bordes del canvas
        if (ball.x + dx > canvas.width - ball.radius || ball.x + dx < ball.radius) {
            dx = -dx;
        }

        if (ball.y + dy < ball.radius) {
            dy = -dy;
        } else if (ball.y + dy > canvas.height - ball.radius) {
            if (paddle.collision(ball)) {
                dy = -dy;
            } else {
                lives--;
                if (!lives) {
                    lose_audio.play().then(r => console.log('player lose the game!'));

                    alert("GAME OVER");
                    status = Actions.GAME_OVER;
                } else {
                    ball.x = canvas.width / 2;
                    ball.y = canvas.height - 30;
                    dx = 2;
                    dy = -2;
                    paddle.x = (canvas.width - paddle.width) / 2;
                }
            }
        }

        if (rightPressed) {
            paddle.x = Math.min(paddle.x + 7, canvas.width - paddle.width);
        } else if (leftPressed) {
            paddle.x = Math.max(paddle.x - 7, 0);
        }
        ball.x += dx;
        ball.y += dy;
        raf = window.requestAnimationFrame(draw);
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
      paddle.x = relativeX - paddle.width / 2;
    }
}

function startGame(evt)
{
   if(status === Actions.GAME_OVER || status === Actions.PAUSED) {
        status = Actions.PLAYING;
        draw();
        evt.target.innerText = "Restart";
   } else if (status === Actions.PAUSED || status === Actions.PLAYING) {
       status = Actions.GAME_OVER;
       cancelAnimationFrame(raf);
       cleanScreen();
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
            if(score % 5 === 0) {
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
  
