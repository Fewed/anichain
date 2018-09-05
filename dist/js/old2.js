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

	that.setPos = (posX = that.x, posY = that.y) => {
		let s = element.style;
		caf(IDs[0]);
		[s.left, s.top] = [`${posX}px`, `${posY}px`];
	};

	that.setAngle = (angle = that.angle) => {
		caf(IDs[1]);
		element.style.transform = `rotate(${angle}deg)`;
	};

	
	that.animate = (name, condition) => {
		return new Promise(resolve => {
			(function loop() {
				let c = that[condition.split(" ")[0]];
				log(that.constructor.name);
				if (eval("block.x < 100")) {
					that[name].run();
					raf(loop);
				}
				else resolve();
			})();
		});
	};
	

	that.shift = {
		t: 0,
		run: function() {
			that.setPos(++that.x);
		}
	};


}

/*
CreateAnim.shift = {
		t: 0,
		run: function() {
			CreateAnim.setPos(++CreateAnim.x);
		}
	};
*/

let initialize = arr => {
	if (arr.length === undefined) return new CreateAnim(arr);
	else return arr.map(item => new CreateAnim(item));
};

//---------------------------------------------------------------------------------------

let [block, block2] = initialize(sel(".block"));

block.animate("shift", "x < 100");


/*
bullet.animate(ballistics, y > 0);
ObjectName.animate(functionName, functionCondition);
*/

