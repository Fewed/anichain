let [block1, block2] = init(".block");

function move(stepX = 1, stepY = 0) {
	this.x += stepX;
	this.y += stepY;
}

let ch = () => chain(
	[0, block1, move, () => [], function() {return this.x < 200}],

	[1, block2, move, () => [4], function() {return this.x < 400}],
	[1, block1, move, () => [2], function() {return this.x < 400}],

	[2, block1, move, () => [0, 1], function() {return this.y < 300}],
	[2, block2, move, () => [0, 1], function() {return this.y < 500}],

	[3, block1, move, () => [2, 1], function() {return this.x < 800}],
	[3, block2, move, () => [2, -1], function() {return this.x < 800}],

	[4, block1, move, () => [0, -1], function() {return this.y > 300}],

	[5, block1, move, () => [0, -3], function() {return this.y > -200}],
	[5, block2, move, () => [0, -3], function() {return this.y > -200}],
	() => {
		[block1.x, block1.y, block2.x, block2.y] = [100,200,100,400];
		ch();
	}
);

ch();