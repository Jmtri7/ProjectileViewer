var c = document.getElementById("gameWindow");
var ctx = c.getContext("2d");

//canvas dimensions
var cw = 600;
var ch = 600;
c.width = cw;
c.height = ch;
//canvas center
var ccx = cw / 2;
var ccy = ch / 2;

//map dimensions
var mapw = 500;
var maph = 500;

//camera dimensions
var camw = 100;
var camh = 100;
//camera 
var camx = ccx - camw / 2;
var camy = ccy - camh / 2

//creates player 1
var player1 = new player(250, 250);

//test location
var loc1 = new loc(mapw * Math.random(), maph * Math.random());

//test projectiles
var proj = [];
var numproj = 10;
for(i = 0; i < numproj; i++) {
	proj[i] = new projectile(mapw * Math.random(), maph * Math.random(), 1.5 * Math.random(), 2 * Math.PI * Math.random());
}

var key;
var keystate = [];

var cursorX;
var cursorY;

//runs game
setInterval(function(){
	player1.move();
	for(i = 0; i < numproj; i++) {
		proj[i].move();
	}
	draw();
}, 0.06);

//draws everything
function draw() {
	ctx.clearRect(0, 0, cw, ch);

	//draw map
	ctx.fillStyle="#00c10c";
	ctx.fillRect(ccx - player1.x, ccy + player1.y - maph, mapw, maph);
	ctx.rect(ccx - player1.x, ccy + player1.y - maph, mapw, maph);
	ctx.stroke();

	//draw camera
	ctx.rect(camx, camy, camw, camh);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(ccx - 5, ccy - 5);
	ctx.lineTo(ccx + 5, ccy + 5);
	ctx.stroke();
	ctx.moveTo(ccx - 5, ccy + 5);
	ctx.lineTo(ccx + 5, ccy - 5);
	ctx.stroke();

	//draw player
	player1.draw();

	//draw test location
	loc1.draw();

	//draw test projectile
	for(i = 0; i < numproj; i++) {
		proj[i].draw();
	}
}

//detects user key presses
window.onkeydown = function(e) {
	key = e.keyCode ? e.keyCode : e.which;
	keystate[key] = true;
}

//detects user key releases
window.onkeyup = function(e) {
	key = e.keyCode ? e.keyCode : e.which;
	keystate[key] = false;
}

document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}

function player(x, y) {
	this.x = x;
	this.y = y;
	this.dir = 0;

	//moves player
	this.move = function() {
		if(keystate[37] === true) {
			//left key
			this.x--;
		} else if(keystate[39] === true) {
			//right key
			this.x++;
		} else if(keystate[38] === true) {
			//up key
			this.y++;
		} else if(keystate[40] === true) {
			//down key
			this.y--;
		}
	}

	//draws player
	this.draw = function() {
		ctx.beginPath();
		ctx.arc(ccx, ccy, 4, 0, 2 * Math.PI);
		ctx.stroke();
	}
}

//constructs locations
function loc(x, y) {
	this.x = x;
	this.y = y;

	//draws location marker
	this.draw = function() {
		ctx.beginPath();
		ctx.arc(ccx - player1.x + this.x, ccy + player1.y - this.y, 2, 0, 2 * Math.PI);
		ctx.stroke();
	}
}

//constructs a projectile
function projectile(x, y, speed, dir) {
	//inheritance from location
	loc.call(this, x, y);
	projectile.prototype = Object.create(loc.prototype);
	projectile.prototype.constructor = projectile;
	this.speed = speed;
	this.dir = dir;

	//moves projectile
	this.move = function() {
		this.x += this.speed * Math.cos(this.dir);
		this.y += this.speed * Math.sin(this.dir);
	}

	//draws projectile
	this.draw = function() {
		arrow(ccx - player1.x + this.x, ccy + player1.y - this.y, this.dir, 10);
	}
}

//constructs a hitbox
function hitbox(x, y, l, w) {
	
	loc.call(this, x, y);
	obstacle.prototype = Object.create(loc.prototype);
	obstacle.prototype.constructor = obstacle;
	
}

//draws an arrow
function arrow(x, y, dir, size) {
	ctx.beginPath();
	ctx.moveTo(x + size / 2 * Math.cos(dir - Math.PI), y - size / 2 * Math.sin(dir - Math.PI));
	ctx.lineTo(x + size / 2 * Math.cos(dir), y - size / 2 * Math.sin(dir));
	ctx.lineTo(x + size / 2 * Math.cos(dir) + size / 10 * 3 * Math.cos(dir + 3 * Math.PI / 4), y - size / 2 * Math.sin(dir) - size / 10 * 3 * Math.sin(dir + 3 * Math.PI / 4));
	ctx.moveTo(x + size / 2 * Math.cos(dir), y - size / 2 * Math.sin(dir));
	ctx.lineTo(x + size / 2 * Math.cos(dir) + size / 10 * 3 * Math.cos(dir - 3 * Math.PI / 4), y - size / 2 * Math.sin(dir) - size / 10 * 3 * Math.sin(dir - 3 * Math.PI / 4));
	ctx.stroke();
}