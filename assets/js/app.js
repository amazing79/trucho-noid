import {Ball} from './objects/ball.js';
import {Point} from './objects/point.js';
import {PaddleBall} from './objects/paddle.js';
import {Text} from './objects/text.js';
import {Brick} from './objects/brick.js';
import {World} from './objects/world.js';
import {Actions} from './common/actions.js';
const lose_audio = new Audio("assets/sounds/ERROR.WAV");
const win_audio = new Audio("assets/sounds/SUCCESS.WAV");

//game objects
let world;
let ctx;
let ball;
let paddle;
let bricks = [];
let scoreText, livesText, gameOverText, winGameText;
let raf;
let status = Actions.PAUSED;

let rightPressed = false;
let leftPressed = false;
// bricks configuration
const brickRowCount = 3;
const brickColumnCount = 5;
//score configuration y lives configuration
let score = 0;
let lives = 3;

function cleanScreen()
{
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(30 30 30 / 25%)";
    ctx.fillRect(0, 0, world.getCanvas().width, world.getCanvas().height);
}

function createGameObjects(x, y)
{
  ball = createBallObject(x,y);
  paddle = createPaddleObject(x,y);
  scoreText = createScoreText(8,20);
  livesText = createLivesText(world.getCanvas().width - 65,20);
  gameOverText = createGameOverText(world.getCanvas().width / 8,world.getCanvas().height / 2);
  winGameText = createWinGameText(world.getCanvas().width / 4,world.getCanvas().height / 2);
  bricks = createBricks();
  paddle.x = (world.getCanvas().width - paddle.width) / 2 ;
  paddle.y =  world.getCanvas().height - (paddle.height + 2)
}

function createBallObject(x, y)
{
  let point = new Point(x,y);
  let ball = new Ball(point, 10,"#0095DD" );
  ball.addEventListener("hitWall", logEvent);
  return ball;
}

function logEvent(e) {
    console.log("hit with: ", e.detail);
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

function createBricks()
{
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;
    let bricksArray = new Map();
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            let point = new Point(brickX,brickY);
            let brick = new Brick(point, brickWidth, brickHeight, "#04529a");
            bricksArray.set(brick.id, brick);
        }
    }
    return bricksArray;
}

function checkWinGame()
{
    if (score === brickRowCount * brickColumnCount) {
        status = Actions.GAME_OVER;
        win_audio.play().then(r => { console.log('Player win the game!!')});
        winGameText.drawStrokeText(ctx, "You win, Bro!")
    }
}

function createGradient(ctx) {
    let gradient = ctx.createLinearGradient(world.getCanvas().width / 2, 0, world.getCanvas().width / 2, world.getCanvas().height / 4);
    gradient.addColorStop(0, "#bdd4c3");
    gradient.addColorStop(.25, "#233d4a");
    gradient.addColorStop(.5, "#3bffec");
    gradient.addColorStop(.75, "#1e3946");
    gradient.addColorStop(1, "#a8e2ff");
    return gradient;
}

function drawBricksObject(ctx)
{
    let gradient = createGradient(ctx);
    bricks.forEach( (brick) => {
        brick.color = gradient;
        brick.draw(ctx)
    })
}

function showGameOver() {
    lose_audio.play().then(r => console.log('player lose the game!'));
    gameOverText.drawStrokeText(ctx, "GAME OVER, BRO!");
    status = Actions.GAME_OVER;
}

function resetBall() {
    ball = createBallObject(world.getCanvas().width / 2, world.getCanvas().height - 30)
    paddle.x = (world.getCanvas().width - paddle.width) / 2;
}

function draw()
{
    if (status === Actions.PLAYING) {
        cleanScreen();
        ball.draw(ctx)
        paddle.draw(ctx)
        drawBricksObject(ctx);
        checkBricksCollisionDetection(ball)
        //detecto si la pelota rebota con las paredes izq, der o top.
        if(!ball.checkWallsCollision(world.getCanvas())) {
            //no toco ninguna de las paredes anteriores, detecto si toca la paleta o el fondo
            if (ball.collisionBottom(world.getCanvas())){
                //llego al fondo, pero reviso si rebota en la paleta
                if (!ball.collisionPaddle(paddle)) {
                    lives--;
                    if (!lives) {
                        showGameOver();
                    } else {
                        resetBall();
                    }
                }
            }
        }

        if (rightPressed) {
            paddle.x = Math.min(paddle.x + 7, world.getCanvas().width - paddle.width);
        } else if (leftPressed) {
            paddle.x = Math.max(paddle.x - 7, 0);
        }
        scoreText.drawText(ctx, `Score: ${score}`);
        livesText.drawText(ctx, `Lives: ${lives}`);
        ball.updatePosition();
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
    const relativeX = e.clientX - world.getCanvas().offsetLeft;
    if (relativeX > 0 && relativeX < world.getCanvas().width) {
      paddle.x = relativeX - paddle.width / 2;
    }
}

function startGame(evt)
{
   if(status === Actions.PAUSED) {
        status = Actions.PLAYING;
        draw();
        evt.target.innerText = "Restart";
   } else if  (status === Actions.GAME_OVER) {
       status = Actions.PAUSED;
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
    ball.changeDy();
    score++;
    if(score % 5 === 0) {
        ball.updateSpeed();
    }
    checkWinGame();
}

function init()
{
   world = new World('panel');
   ctx = world.getContext2D();
   world.createEventListener("collisionDetected", updateGameStatus);
   let btn = document.getElementById("runButton");

   btn.addEventListener("click", startGame);
   document.addEventListener("keydown", keyDownHandler, false);
   document.addEventListener("keyup", keyUpHandler, false);
   //soporte para mouse
   document.addEventListener("mousemove", mouseMoveHandler, false);
   createGameObjects(world.getCanvas().width / 2, world.getCanvas().height - 30);
}

window.addEventListener("load", init);