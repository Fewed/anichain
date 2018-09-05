;
//---------------------------------------------------------------------------------------
// utility features

// smart selector
let sel = (target, mode = 0) => {
	let arr = document.querySelectorAll(target);
	
	return (arr.length !== 1) ? Array.from(arr) : ((mode !== 0) ? [arr[0]] : arr[0]);
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

function CreateAnimatedObject(element) {
	let that = this;

	Object.defineProperties(that, {
		x: {
			get: () => parseInt(gs(element).left),
			set: num => element.style.left = `${num}px`
		},
		y: {
			get: () => parseInt(gs(element).top),
			set: num => element.style.top = `${num}px`
		},
		angle: {
			get: () => {
				let matrix = gs(element).transform;

				if (matrix != "none") {
					matrix = matrix.split("(")[1].split(")")[0].split(", ");
					return Math.round(Math.atan2(+matrix[1], +matrix[0]) * (180/Math.PI));
				}
				else return 0;
			},
			set: num => element.style.transform = `rotate(${angle}deg)`
		},
		src: {get: () => element}
	});

	this.t = 0;

	this.asyncWrap = (action, args, condition) => {
		return new Promise(resolve => {
			(function loop() {
				if (condition()) {
					action(...args());
					raf(loop);
				}
				else {
					that.t = 0;
					resolve();
				}
			})();
		});
	};
}


let init = (selector, num = -1) => {
	let elements = (num !== -1) ? sel(selector)[num] : sel(selector);
	if (elements.length === undefined) return new CreateAnimatedObject(elements);
	else return elements.map(item => new CreateAnimatedObject(item));
};

async function chain(...arr) {
	for (let i = 0; i < arr.length-1; i++) {
		let [pos, obj, fun, arg, con] = arr[i];

		if (arr[i][0] === arr[i+1][0]) obj.asyncWrap(fun.bind(obj), arg, con.bind(obj));
		else {
			await obj.asyncWrap(fun.bind(obj), arg, con.bind(obj));
			arr[i][0] = arr[i+1][0];
		}
	}

	if (typeof(arr[arr.length-1]) === "object") {
		let [pos, obj, fun, arg, con] = arr[arr.length-1];

		obj.asyncWrap(fun.bind(obj), arg, con.bind(obj));
	}
	else (arr[arr.length-1])();
}