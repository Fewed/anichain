;
//---------------------------------------------------------------------------------------
// utility features

// smart selector
let sel = target => {
	let arr = document.querySelectorAll(target);
	
	return (arr.length === 1) ? arr[0] : Array.from(arr);
};

// global event listener
let lis = (eventType, process) => window.addEventListener(eventType, process);

// shorted console.log()
let log = console.log.bind(console);

// shorted requestAnimationFrame
let raf = cb => requestAnimationFrame(cb);

// shorted cancelAnimationFrame
let caf = cb => cancelAnimationFrame(cb);

// shorted getComputedStyle
let gs = element => getComputedStyle(element);

//-------------------------------------------------------------------------------------
// main features

function CreateAnim(element) {
	let that = this,
			flags = (new Array(5)).fill(true),
			IDs = (new Array(5)).fill(null);


	Object.defineProperties(that, {
		x: {get: () => parseInt(gs(element).left)},
		y: {get: () => parseInt(gs(element).top)},
		angle: {get: () => {
			let matrix = gs(element).transform;

			if (matrix != "none") {
				matrix = matrix.split("(")[1].split(")")[0].split(", ");
				return Math.round(Math.atan2(+matrix[1], +matrix[0]) * (180/Math.PI));
			}
			else return 0;
		}}
	});

	that.wayPoints = [];

	that.setPos = (posX = that.x, posY = that.y) => {
		let s = element.style;
		caf(IDs[0]);
		[s.left, s.top] = [`${posX}px`, `${posY}px`];
	};

	that.setAngle = (angle = that.angle) => {
		caf(IDs[1]);
		element.style.transform = `rotate(${angle}deg)`;
	};

	that.pause = (delay = 0, duration = 0) => {
		return new Promise(resolve => {
			let cntDel = cntDur = 0,
					[del, dur] = [delay, duration].map(item => Math.round(60 * item / 1000));
			let date = new Date();

			caf(IDs[2]);
			
			(function run() {
				if (cntDel++ !== del) IDs[2] = raf(run);
				else {
					flags = flags.map(item => item = false);
					(function run2() {
						if (cntDur++ !== dur) IDs[2] = raf(run2);
						else {
							flags = flags.map(item => item = true);
							log(new Date() - date);
							resolve();
						}
					})();
				}
			})();
		});
	};

	that.rotate = (endAngle = that.angle, step = 1) => {
		return new Promise(resolve => {
			let angle = that.angle;

			caf(IDs[1]);
				
			(function run() {
				if (flags[0]) {
					if (Math.abs(angle - endAngle) < step) angle = endAngle;
					else angle = (angle < endAngle) ? angle + step : angle - step;

					that.setAngle(angle);
				}
				
				if (angle !== endAngle) IDs[1] = raf(run);
				else resolve();
			})();
		});
	};

	that.move = (endX = that.x, endY = that.y, step = 4) => {
		return new Promise(resolve => {
			let [x, y] = [that.x, that.y];
					c = Math.abs(y - endY) / Math.abs(x - endX);
					[stepX, stepY] = (c < 1) ? [step, step * c] : [step / c, step];
					[stepX, stepY] = [stepX || 1, stepY || 1];

			caf(IDs[0]);

			(function run() {
				if (flags[1]) {
					if (Math.abs(x - endX) < stepX) x = endX;
					else x = (x < endX) ? x + stepX : x - stepX;

					if (Math.abs(y - endY) < stepY) y = endY;
					else y = (y < endY) ? y + stepY : y - stepY;

					that.setPos(x, y);
				}

				if (x !== endX || y !== endY) IDs[0] = raf(run);
				else resolve();
			})();
		});
	};

//	that.calcCoords =

	that.spread = arr => {
		let temp = [];

		for (let i in arr) {
			let [pos, fun, path] = arr[i];

			if (typeof path[0] !== "object") temp.push([pos, fun, path]);
			else for (let j in path) temp.push([pos, fun, path[j]]);
		}

		return temp;
	};

	that.pack = arr => {
		let temp = [],
				j = null;

		for (let i in arr) {
			if (arr[i][0] !== j) {
				j = arr[i][0];
				temp.push([]);
			}

			temp[j].push(arr[i]);
		}

		return temp;
	};

	that.orderify = arr => {
		let temp = [];

		for (let i in arr) temp.push(sort(arr[i]));

		return temp;

		function sort(array) {
			let [temp, temp2] = [[], []],
					cnt = j = 0;

			for (let i in array) temp.push([]);

			let cur = array[0][1];

			while (cnt < array.length) {
				for (let i = cnt; i < array.length; i++) {
					let item = array[i];

					cnt = i + 1;

					if (item[1] === cur) temp[j++].push(item);
					else {
						cur = item[1];
						j = 0;
						temp[j++].push(item);
						break;
					}
				}
			}

			for (let i in temp) temp2 = temp2.concat(temp[i]);

			return temp2;
		}
	};


	


	// ciclyc mode
	// margin mode

}


let animate = arr => {
	if (arr.length === undefined) return new CreateAnim(arr);
	else return arr.map(item => new CreateAnim(item));
};

//---------------------------------------------------------------------------------------

let [block, block2] = animate(sel(".block"));

let path = {
	block: [
		[[50, 200], [50, 100], [50, 200], [50, 100]],
		[[200, 100], [400, 100]],
		[600, 100]
	],
	block2: [
		[[200, 400], [400, 400], [600, 400]],
		[[400, 400], [200, 400]]
	]
}

/*
let sequence = [
	[0, block.move, [[50, 200], [50, 100], [50, 200], [50, 100]]],
	[1, block.move, [[200, 100], [400, 100]]],
	[1, block2.move, [[200, 400], [400, 400], [600, 400]]],
	[2, block.move, [600, 100]],
	[3, block2.move, [[400, 400], [200, 400]]]
];
*/

let sequence = [
	[0,		block.move,		path.block[0]		],

	[1,		block.move, 	path.block[1] 	],
	[1, 	block2.move, 	path.block2[0] 	],

	[2, 	block.move, 	path.block[2] 	],

	[3, 	block2.move, 	path.block2[1] 	]
];

let seq2 = block.spread(sequence),
		seq3 = block.pack(seq2);
		seq4 = block.orderify(seq3);

/*
(async () => {
	await block.move(50, 200);
	await block.move(50, 100);
	await block.move(50, 200);
	await block.move(50, 100);

				block.move(200, 100);
	await block2.move(200, 400);
				block.move(400, 100);
	await block2.move(400, 400);
	await block2.move(600, 400);

	await block.move(600, 100);

	await block2.move(400, 400);
	await block2.move(200, 400);
})();
*/

/*
(async () => {
	await block.move(50, 200);
	await block.move(50, 100);
	await block.move(50, 200);
	await block.move(50, 100);

				block.move(200, 100);
	await block2.move(200, 400);
	await block.rotate(65);
				block.move(400, 100);
	await block2.move(400, 400);
	await block2.move(600, 400);

	await block.move(600, 100);

				
				block.rotate(Infinity, 10);
		await		block2.move(200, 400);
		await		block2.move(800, 400);
				block.rotate(0);
})();
*/

/*
(async () => {
				block.rotate(Infinity, 10);
	await block.delay(200);
	await block.setAngle(block.angle);
	await block.delay(200);
				block.rotate(-Infinity, 10);
	await block.delay(200);
				block.rotate(45);

				block.move(800, 100);
	await block.delay(200);
				block2.move(800, 400);

})();
*/

(async () => {
//			block.move(800, 100, 2);
			block.rotate(Infinity, 5);
			block2.rotate(Infinity, 5);
//			block.pause(2000, 2000);
await			block2.pause(2000, 2000);




				block2.rotate(-Infinity, 5);
//			block.pause(2000, 2000);
//			block2.pause(2000, 2000);
//			block.pause(2000, 2000);
	//		block.move(100, 100, 4);		
})();

// if (funCur !== funNext) funCur;
// else funNext

function chain(arr) {
	let temp = [];

	(async () => {
		for (let i in arr) {
			let item = arr[i];

					
			for (let j in item) {
				let unit = item[j];
				let [pos, fun, path] = unit;

				await fun(...path);

			}
		}
	})();
}

//chain(seq4);



