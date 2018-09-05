/*
let blocks = init(".block");

function round(step = 0.1, dir = 1, rad = 50, phi = 0) {
	this.t += step;
	let angle = dir * this.t + phi;
	this.x = 500 + rad * Math.sin(angle);
	this.y = 300 + rad * Math.cos(angle);
}

let flag = true;

let ch = () => chain(
	[0, blocks[0], round, [0.03, 1, 200, 0], function() {return this.t < 10}],
	[1, blocks[1], round, [0.03, -1, 200, 10], function() {return this.t < 20}],
	[1, blocks[0], round, [0.03, 1, 200, 10], function() {return this.t < 10}],
	[2, blocks[0], round, [0.03, -1, 200, 20], function() {return this.t < 10}],
	() => flag = true
);

lis("click", e => {
	if (e.target === sel("button") && flag) {
		ch();
		flag = false;
	}
});

setInterval(() => {
	if (flag) {
		ch();
		flag = false;
	}
}, 20000);
*/

//-----------------------------------------------------------------------------------------------
/*
let [food, snake] = [init(".food"), init(".snake")],
		dir = "right",
		arr = [snake],
		story = [],
		bound = 475;

let createFood = () => [food.x, food.y] = [Math.round(bound*Math.random()), Math.round(bound*Math.random())];



let changeDir = e => {
	decode(e);

	story.push([snake.x, snake.y, dir]);

};

function move(dir = "right", step = 2) {

	arr.map(item => setDirection(item, dir, step));


	for (let i = 1; i < arr.length; i++) {
		story.map(item => {
			if (arr[i].x === item[0] && arr[i].y === item[1]) {
				setDirection(arr[i], item[2], step);
				log("done");
			}
		});
	}


	if ((Math.abs(snake.x - food.x) < 25) && (Math.abs(snake.y - food.y) < 25)) {
		grow();
		createFood();
	}


}

let grow = () => {
	let tail = sel(".snake").cloneNode();
	tail.classList.remove("snake");
	tail.classList.add("tail");
	tail.classList.add(`tail-${arr.length-1}`);
	sel(".field").insertBefore(tail, sel(".snake"));
	tail = init(`.tail-${arr.length-1}`);
	[tail.x, tail.y] = [snake.x, arr[arr.length-1].y + 25];
	arr.push(tail);
};

chain([0, snake, move, () => [dir], () => true]);

lis("keydown", e => changeDir(e));

function decode(e) {
	if (e.keyCode === 38 && dir !== "down") dir = "up";
	else if (e.keyCode === 39 && dir !== "left") dir = "right";
	else if (e.keyCode === 40 && dir !== "up") dir = "down";
	else if (e.keyCode === 37 && dir !== "right") dir = "left";
}

function setDirection(element, direction, step) {
	if (direction === "right") element.x = (element.x < bound) ? element.x + step : 0;
	else if (direction === "left") element.x = (element.x > 0) ? element.x - step : bound;
	else if (direction === "down") element.y = (element.y < bound) ? element.y + step : 0;
	else if (direction === "up") element.y = (element.y > 0) ? element.y - step : bound;
}
*/


//-------------------------------------------------------------------------

let [food, snake] = [init(".food"), init(".snake", 2)],
		grid = 25,
		dir = "r",
//		arr = [snake],
		arr = init(".snake"),
		periodCounter = 0,
		periodCounterMax = Math.round(1000 / 60),
		elCnt = 0,
		bound = 475,
		decoder = {
		"37": "l",
		"38": "u",
		"39": "r",
		"40": "d"
	};

function createFood() {
	let rand = () => grid*Math.round(bound*Math.random()/grid);
	[food.x, food.y] = [rand(), rand()];
}

function move(dir = "r") {
	if (periodCounter !== periodCounterMax) periodCounter++;
	else {
		periodCounter = 0;
		
		shift(dir);
	}
	if (arr.some(item => (item.x === food.x && item.y === food.y))) {
			grow();
			createFood();
		}
	
}

function grow() {
	let snakes = sel(".snake", 1),
			head = snakes[snakes.length-1],
			tail = head.cloneNode(),
			newClass = `tail-${arr.length-1}`;

	sel(".field").insertBefore(tail, sel(".snake", 1)[0]);
	tail.classList.add(newClass);
	arr.push(init(`.${newClass}`));
};

chain([0, snake, move, () => [dir], () => true]);

lis("keydown", e => decode(e));

function decode(e) {
	if (dir !== decoder[e.keyCode + 2] && dir !== decoder[e.keyCode - 2]) dir = decoder[e.keyCode];
}

function shift(direction) {
	let elem = arr[elCnt],
			head = arr[(elCnt + arr.length-1 < arr.length) ? elCnt + arr.length-1 : elCnt-1];

	if (direction === "r") [elem.x, elem.y] = [(head.x < bound) ? head.x + grid : 0, head.y];
	else if (direction === "l") [elem.x, elem.y] = [(head.x > 0) ? head.x - grid : bound, head.y];
	else if (direction === "d") [elem.x, elem.y] = [head.x, (head.y < bound) ? head.y + grid : 0];
	else if (direction === "u") [elem.x, elem.y] = [head.x, (head.y > 0) ? head.y - grid : bound];

	elCnt = (elCnt !== arr.length-1) ? elCnt + 1 : 0;

}


let step = (num = 18) => {
	while(num--) move();
	info();
};

//let info = () => log(`s ${arr[2].x}, t0 ${arr[1].x}, t1 ${arr[0].x}, cnt ${elCnt}, of ${ring(elCnt, arr.length-1, arr.length)}`);



