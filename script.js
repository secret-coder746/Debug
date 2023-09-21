// Зона для рисования
var canvas = document.getElementById("gameZone");
// Полотно для рисования
var ctx = canvas.getContext("2d");
// Радиус шарика
var ballRadius = 10;
// Изначальное положение шарика по координате Х (по горизонтали) - по центру
var x = canvas.width / 2;
// Изначальное положение шарика по координате У (по вертикали) - по центру
var y = canvas.height - 30;
// Шаг изменения координаты Х по горизонтали
var dx = 2;
// Шаг изменения координаты У по вертикали
var dy = -2;
// Высота платформы для шарика
var paddleHeight = 10;
// Ширина платформы для шарика
var paddleWidth = 75;
// Изначальное положение платформы для шарика по горизонтали
var paddleX = (canvas.width - paddleWidth) / 2;
// Нажата стрелочка вправа
var rightPressed = false;
// Нажата стрелочка влево
var leftPressed = false;
// Количество строк блоков-кирпичиков по горизонтали
var brickRowCount = 5;
// Количество столбцов блоков-кирпичиков по вертикали
var brickColumnCount = 3;
// Ширина блока-кирпичика
var brickWidth = 75;
// Высота блока-кирпичика
var brickHeight = 20;
// Отступ блоков-кирпиччиков
var brickPadding = 10;
// Расстояние между блоками-кирпичиками сверху
var brickOffsetTop = 30;
// Расстояние между блоками-кирпичиками слева
var brickOffsetLeft = 30;
// Счет
var score = 0;
// Количество жизней
var lives = 3;

// Создаем массив состояний блоков-кирпичиков (1 - блок на месте, 0 - блока нет, так как он уже уничтожен)
var bricks = [];
// Проходимся по колонкам блоков-кирпичиков
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  // Проходимся по строкам блоков-кирпичиков
  for (var r = 0; r < brickRowCount; r++) {
    // Первоначальный статус блока-кирпичика - 1 (блок на месте)
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Добавляем обработчик события "Нажата кнопка"
document.addEventListener("keydown", keyDownHandler, false);
// Добавляем обработчик события "Поднята кнопка"
document.addEventListener("keyup", keyUpHandler, false);

// Функция для обработчик события "Нажата кнопка" - определяет вид кнопки и устанавливает соответсвующий флаг в true
function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

// Функция для обработчик события "Поднята кнопка" - определяет вид кнопки и устанавливает соответсвующий флаг в false
function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

// Определение события "пересечение шарика и блока-кирпичика"
function collisionDetection() {
  // Проходимся по очереди по всем блокам-кирпичикам
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      // Если кирпичик на месте
      if (b.status == 1) {
        // Проверяем, пересекаюся ли границы мячика и блока-кирпичика
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          // Удаляем блок-кирпичик
          b.status = 0;
          // Увеличиваем счет
          score++;
          // Если сбиты все кирпичики (счет = изначалное количество кирпичиков), то игра окончена: выводим сообщение и перезагружаем страницу
          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

// Рисование мячика
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Рисование платформы для мячика
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Рисование блоков-кирпичиков исходя из их статуса
function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Рисуем счет игры
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

// Рисуем оставшееся количество жизней
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

// Начинаем игру и рисуем все элементы
const btn = document.body.querySelector("#btn");
btn.addEventListener("click", startGame());
function startGame() {
  var spanResult = document.getElementById("result");
  spanResult.style.color = "black";
  spanResult.innerHtml = "";
  draw();
}

// Рисуем все элементы и запускаем игру
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      // Если шарик на уровне платформы, но не пересекается с ней, то уменьшаем количество жизней
      lives--;
      // Если количество жизней = 0 - игра окончена
      if (!lives) {
        alert("YOU LOSE!");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}
