const canvas = document.getElementById("panel");
const ctx = canvas.getContext("2d");
const lose_audio = new Audio("assets/sounds/ERROR.WAV");
const win_audio = new Audio("assets/sounds/SUCCESS.WAV");

let x = canvas.width / 2;
let y = canvas.height - 30;
let ballRadius = 10;
let dx = 2;
let dy = -2;
let interval = 0;
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

function drawBall()
{
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
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
        drawBall();
        drawPaddle();
        drawBricks();
        collisionDetection();
        //determino si toca los bordes del canvas
        let ballRadiusAjust = ballRadius - 2;    
        if (x + dx > canvas.width - ballRadiusAjust || x + dx < ballRadiusAjust) {
            dx = -dx;
        }

        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadiusAjust) {
            if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            } else {
                lives--;
                if (!lives) {
                    lose_audio.play();
                    alert("GAME OVER");
                    playing = false;
                } else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
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
        x += dx;
        y += dy;
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
            x > b.x &&
            x < b.x + brickWidth &&
            y > b.y &&
            y < b.y + brickHeight
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
}

window.onLoad = onLoad();
  
