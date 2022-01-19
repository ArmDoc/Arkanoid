var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width 	= 600;
canvas.height 	= 600;
var width 	= canvas.width;
var height	= canvas.height;

var boxHeight = 30;

var min = 3;
var max = 8;

var timer 	= null;

var boxes	= [];

var paddle = {
	w: 150,
	h: 20,
	x: (width - 150) / 2,
	y: height - (20+20),
	dx: 1,

	leftPressed: false,
	rightPressed: false,
}

var ball	= {
	r : 16,
	x : width / 2,
	y : height - 16 - 40 ,
	dx : Math.random() < 0.5 ? -1 : 1,
	dy : -1,
}

createCubes();
draw();

function createCubes() {
	var row = getRandomNumber(min,max);
	for (var i = 0; i < row; ++i) {
		var column = getRandomNumber(min,max);
		for (var j = 0; j < column;++j) {
			var color = "#" + Math.floor(Math.random()*16777215).toString(16);
			var w = width / column;
			boxes.push ({
				c: color,
				x: j * w,
				y: i * boxHeight,
				w: w,
				h: boxHeight,
			});
		}
	}
}

function draw() {
	clear();
	drawBall();
	drawPaddle();
	drawBox();
}

function clear() {
	canvas.width |= 0
}

function drawBall() {
	ctx.beginPath();
	ctx.fillStyle = 'red';
	ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
	ctx.fill();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.fillStyle = 'green';
	ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
	ctx.fill();
}

function drawBox() {
	for(var i = 0; i <= boxes.length-1; ++i) {
		ctx.beginPath();
		ctx.fillStyle = boxes[i].c
		ctx.fillRect(boxes[i].x, boxes[i].y, boxes[i].w, boxes[i].h);
		ctx.fill();
	}
}

function clearTimer() {
	clearInterval(timer);
	timer = null;
}

function calculations() {
	if(paddle.leftPressed) {
		if(paddle.x - paddle.dx >= 0) {
			paddle.x -= paddle.dx;
		}
	}

	if(paddle.rightPressed) {
		if(paddle.x + paddle.dx <= width - paddle.w) {
			paddle.x += paddle.dx;
		}
	}

	if(ball.x - ball.r <= 0 || ball.x + ball.r >= width) {
		ball.dx *= -1;
	}

	if(ball.y - ball.r <= 0) {
		ball.dy *= -1;
	}

	if(ball.y + ball.r >= height) {
		clearTimer();
		alert('Game Over');
	}

	if(ball.dy == 1 &&
		ball.x + ball.dx + ball.r >= paddle.x + ball.r &&
		ball.x + ball.dx - ball.r  <= paddle.x + paddle.w - ball.r) {
		if(ball.y + ball.dy >= paddle.y - ball.r) {
			ball.dy *= -1
		}
	}

	ball.x += ball.dx;
	ball.y += ball.dy;

	boxes.forEach(function (box, i ) {
		if(ball.x +ball.r>= box.x && 
			ball.x-ball.r <= box.x + box.w &&
			ball.y+ball.r >= box.y &&
			ball.y-ball.r <= box.y + box.h) {
			boxes.splice(i, 1);
			ball.dy *= -1;
		}
	})

	if(boxes.length == 0) {
		clearInterval(timer);
		alert("Bravo you won")
	}
}

document.addEventListener('keydown', function(e) {
	if(e.keyCode === 37) {
		paddle.leftPressed = true;
	}

	if(e.keyCode === 39) {
		paddle.rightPressed = true;
	}

	if (e.keyCode === 32) {
		if(timer == null) {
			timer = setInterval(function() {
				draw ();
				calculations();
			},1);
		}
	}

	if(e.keyCode === 82) {
		if(boxes.length == 0 || ball.y + ball.r >= height){
			
			boxes	= [];

			paddle = {
				w: 150,
				h: 20,
				x: (width - 150) / 2,
				y: height - (20+20),
				dx: 1,

				leftPressed: false,
				rightPressed: false,
			}

			ball	= {
				r : 15,
				x : width / 2,
				y : height - 15 - 40 ,
				dx : Math.random() < 0.5 ? -1 : 1,
				dy : -1,
			}

			createCubes();
			draw();
			calculations();
		}
	}
})

document.addEventListener('keyup', function(e) {
	if(e.keyCode === 37) {
		paddle.rightPressed = false;
		paddle.leftPressed = false;
	}
	if(e.keyCode === 39) {
		paddle.rightPressed = false;
		paddle.leftPressed = false;
	}
})

function getRandomNumber(min, max) {
	return(Math.round(Math.random() * (max - min) + min))
}