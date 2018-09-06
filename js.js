<body>
	<div class="elem"></div>
	<div class="elem"></div>
</body>

let elems = init(".elem");

[elems[0].x, elems[1].x] = [200, 400];
elems.map(item => item.y = item.w = item.h = 100);

//-------------------------------------------------------------------------- // pos

chain(
	[0, block1, move, () => [], function() {return this.t < 20}],
	[0, block2, move, () => [], function() {return this.t < 10}],
	[1, block3, move, () => [], function() {return this.t < 10}],
	[1, block4, move, () => [], function() {return this.t < 10}],
	() => log("done")
);

//--------------------------------------------------------------------------- obj

chain(
	[0, block1, move, () => [], function() {return this.t < 20}],
	[0, block2, move2, () => [], function() {return this.t < 20}]
);

function move() {
	this.t++;
	this.x += 10;
}

function move2() {
	this.t++;
	block1.x += 10;
}

//--------------------------------------------------------------------------- fun

chain(
	[0, block1, () => {img.scroll(500); flag = false}, () => [], () => flag],
	[0, block1, move, () => [], function() {return this.x < 200}]
);

//--------------------------------------------------------------------------- arg

chain(
	[0, block1, move, () => [], () => block1.t < 10],
	[1, block1, move, () => [5], () => block1.t < 10],
	[2, block1, move, () => [0, 7], () => block1.t < 10]
);

function move(stepX = 10, stepY) {
	this.t++;
	this.x += stepX;
	this.y += stepY || stepX;
}

//--------------------------------------------------------------------------- con

chain(
	[0, block1, rotate, () => [], () => true],
	[0, block2, move, () => [], function() {return this.t < 10}],
	[1, block3, move2, () => [], () => flag && block3.y < 50],
	[2, block4, move, () => [], () => block2.t < 10],
	[3, block5, move, () => [], () => block2.t < 10],
);

function rotate() {this.angle++}

function move() {
	this.t++;
	this.x += 10;
	flag = (block2.x > 100) ? true : false;
}

function move2() {this.y += 5}

//---------------------------------------------------------------------------
