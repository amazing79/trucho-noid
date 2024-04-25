import {Ball} from './objects/ball.js';
import {Point} from './objects/point.js';
import {PaddleBall} from './objects/paddle.js';
import {Text} from './objects/text.js';
import {Brick} from './objects/brick.js';
import {Actions as actions, Actions} from './common/actions.js';
const lose_audio = new Audio("assets/sounds/ERROR.WAV");
const win_audio = new Audio("assets/sounds/SUCCESS.WAV");
let collisionEvent = new Event('collisionDetected');
const canvas = document.getElementById("panel");

let col, row = 0;
//game objects
let ctx;
let ball;
let paddle;
let bricks = [];
let scoreText, livesText, gameOverText, winGameText;
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
  gameOverText = createGameOverText(canvas.width / 8,canvas.height / 2);
  winGameText = createWinGameText(canvas.width / 4,canvas.height / 2);
  bricks = createBricks(x,y);
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
    return new Text(point, "16px Arial", "#0095DD")
}

function createLivesText(x,y)
{
    let point = new Point(x,y);
    return new Text(point, "16px Arial", "#0095DD")
}

function createGameOverText(x,y)
{
    let point = new Point(x,y);
    return new Text(point, "40px Arial", "#FAFAFA")
}

function createWinGameText(x,y)
{
    let point = new Point(x,y);
    return new Text(point, "42px Arial", "#FAFAFA")
}

function createBricks(x,y) {
    let bricksArray = new Map();
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let point = new Point(0,0);
            let brick = new Brick(point, brickWidth, brickHeight, "#04529a", r, c);
            bricksArray.set(brick.id, brick);
        }
    }
    return bricksArray;
}

function checkWinGame()
{
    if (score === brickRowCount * brickColumnCount) {
        status = actions.GAME_OVER;
        win_audio.play().then(r => { console.log('Player win the game!!')});
        winGameText.drawStrokeText(ctx, "You win, Bro!")
    }
}

function drawBricksObject(ctx) {
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height / 2);
    gradient.addColorStop(0, "#04529a");
    gradient.addColorStop(.5, "#2bd6fa");
    gradient.addColorStop(1, "#04529a");

    bricks.forEach( (brick) => {
        const brickX = brick.col * (brick.width + brickPadding) + brickOffsetLeft;
        const brickY = brick.row * (brick.height + brickPadding) + brickOffsetTop;
        brick.x = brickX;
        brick.y = brickY;
        brick.color = gradient;
        brick.draw(ctx)
    })
}

function draw() 
{
    if (status === Actions.PLAYING) {
        cleanScreen();
        scoreText.drawText(ctx, `Score: ${score}`);
        livesText.drawText(ctx, `Lives: ${lives}`);
        ball.draw(ctx)
        paddle.draw(ctx)
        drawBricksObject(ctx);
        checkBricksCollisionDetection(ball)
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
                    gameOverText.drawStrokeText(ctx, "GAME OVER, BRO!");
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

function checkBricksCollisionDetection(ball)
{
    bricks.forEach(brick => {
        brick.collision(ball);
    })
}

function updateGameStatus(event)
{
    bricks.delete(event.detail.id);
    dy = -dy;
    score++;
    if(score % 5 === 0) {
        dy = dy * 1.5;
        dx = dx * 1.5;
    }
    checkWinGame();
}

function onLoad() 
{
   ctx = canvas.getContext("2d");
   canvas.addEventListener("collisionDetected", e => updateGameStatus(e));
   let btn = document.getElementById("runButton");

   btn.addEventListener("click", startGame);
   document.addEventListener("keydown", keyDownHandler, false);
   document.addEventListener("keyup", keyUpHandler, false);
   //soporte para mouse
   document.addEventListener("mousemove", mouseMoveHandler, false);
   //initializeBricks();
   createGameObjects(x, y);   
}

window.onLoad = onLoad();
  
