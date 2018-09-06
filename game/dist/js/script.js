
let [targets, ship, bullet] = [init(".target"), init(".ship"), null],
		grid = 25,
		bound = 475,
		dir = "r",
		[score, offset, health] = [0, 0, 99],
		[flag, skip, exit] = [true, false, false],
		speed = [1, 1, 1],
		decoder = {
			"37": "l",
			"38": "u",
			"39": "r",
			"40": "d"
		};

[ship.x, ship.y] = [10*grid, 18*grid];
targets.map(item => [item.x, item.y] = [rand(), 0]);

function rand() {return grid*Math.round(bound*Math.random()/grid)};

lis("keydown", e => dir = decoder[e.keyCode]);

chain(
	[0, ship, fly, () => [], () => true],
	[0, ship, action, () => [], () => true]
);

function fly() {
	targets.map((item ,i) => {
		if (item.y < bound) item.y += speed[i] + offset;
		else {
			[item.x, item.y] = [rand(), 0];
			health -= 5;
		}
		if (Math.abs(item.x - ship.x) < grid && Math.abs(item.y - ship.y) < grid) {
			gameOver();
		}
	});
}

function gameOver() {
	alert("GAME OVER!");
	[score, offset, health] = [0, 0, 99];
	targets.map(item => [item.x, item.y] = [rand(), 0]);
}

function action() {
	if (dir === "r" && ship.x !== bound) ship.x += grid; 
	if (dir === "l" && ship.x !== 0) ship.x -= grid;
	if ((dir === "d" || dir === "u") && flag) {
		createBullet();
		chain(
			[0, ship, shot, () => [], () => !exit],
			[1, bullet, explosion, () => ["orange"], () => bullet.t < 10],
			[2, ship, removeBullet, () => [], () => exit]
		);
	}
	dir = "";
	offset += 0.0005;
	health -= 0.03;
	sel(".indicator").style.backgroundColor = `hsl(${Math.round(230*health/99)}, 50%, 50%)`;
	if (health <= 0) gameOver();
}

function createBullet() {
	bullet = createAnimEl("bullet", sel(".field"));
	[bullet.x, bullet.y] = [ship.x + 7.5, ship.y];
	flag = false;
	setTimeout(() => flag = true, 1000);
}

function shot() {
	bullet.y -= 10;
	targets.map((item, i) => {
		if (Math.abs(item.x - bullet.x) < grid/2 && Math.abs(item.y - bullet.y) < grid/2) {
			[skip, exit] = [false, true];
			[item.x, item.y] = [rand(), 0];
			speed[i] = 1 + Math.round(Math.random());
			[score, health] = [score + 1, health + 10];
			if (health > 99) health = 99;
		}
	});
	if (bullet.y < 5) [skip, exit] = [true, true];
}

function explosion(color = "yellow") {
	if (skip) bullet.t = 10;
	else {
		bullet.t++;
		bullet.bgc = color;
		bullet.w = bullet.h = 5 + 10*bullet.t;
		[bullet.x, bullet.y] = [bullet.x - 5, bullet.y - 5];
	}
}

function removeBullet() {
	bullet = removeAnimEl("bullet");
	exit = false;
}

setInterval(() => {
	sel(".indicator").textContent = `health: ${Math.round(health)}  \n score: ${score}  `;
}, 500);
