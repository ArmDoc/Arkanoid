var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var width 	= canvas.width 	= 600;
var height	= canvas.height 	= 600;
var boxHeight	= 30;

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
	r : 15,
	x : width / 2,
	y : height - 15 - 40 ,
	dx : Math.random() < 0.5 ? -1 : 1,
	dy : -1,
}

creatCubes();
drow();

document.addEventListener('keydown', function(e) {
	if(e.keyCode === 37) {
		paddle.leftPressed = true;
	}

	if(e.keyCode === 39) {
		paddle.rightPressed = true;
	}

	if (e.keyCode === 32) {
		if(setInterval (timer) <= 1) {
			timer = setInterval(function() {
				drow ();
			},1);
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

function creatCubes() {
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

function drowBox() {
	for(var i = 0; i <= boxes.length-1; ++i) {
		ctx.beginPath();
		ctx.fillStyle = boxes[i].c
		ctx.fillRect(boxes[i].x, boxes[i].y, boxes[i].w, boxes[i].h);
		ctx.fill();
	}
}

function clear() {
	canvas.width |= 0
}

function drowBall() {
	ctx.beginPath();
	ctx.fillStyle = 'red';
	ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
	ctx.fill();
}

function drowPaddle() {
	ctx.beginPath();
	ctx.fillStyle = 'green';
	ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
	ctx.fill();
}

function getRandomNumber(min, max) {
	return(Math.round(Math.random() * (max - min) + min))
}

function calculations() {
	ball.x += ball.dx;
	ball.y += ball.dy;

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
		clearInterval(timer);
		alert('Game Over');
	}

	if(ball.x >= paddle.x + ball.r && 
		ball.x <= paddle.x + paddle.w - ball.r &&
		ball.y + ball.r >= paddle.y) {
		ball.dy *= -1;
	}

	boxes.forEach(function (box, i ) {
		if(ball.x >= box.x && 
			ball.x <= box.x + box.w &&
			ball.y >= box.y &&
			ball.y <= box.y + box.h) {
			boxes.splice(i, 1);
			ball.dy *= -1;
		}
	})

	if(boxes.length <= 0) {
		clearInterval(timer);
		alert("Congratulations You won")
	}
}

function drow() {
	clear();
	drowBall();
	drowPaddle();
	drowBox();
	calculations();
}