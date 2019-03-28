const utils = {
	sel: (target) => {
		const temp = [...document.querySelectorAll(target)];
		return temp.length !== 1 ? temp : temp[0];
	},
	crAr: (size, val = 0) => [...Array(size)].map(() => val),
	l: console.log.bind(console),
	lis: window.addEventListener,
	raf: requestAnimationFrame,
	gs: getComputedStyle,
};

const { sel, gs, crAr, raf, l } = utils;

class AnimEl {
	constructor(element) {
		this.t = 0;

		const styles = {
			left: "x",
			top: "y",
			width: "w",
			height: "h",
			transform: "angle",
			display: "display",
		};

		Object.keys(styles).map((prop) => {
			Object.defineProperty(this, styles[prop], {
				get() {
					const style = gs(element)[prop];
					let res = style;
					if (style.includes("px")) res = parseInt(style);
					else if (prop === "transform") {
						const [a, b] = (style.match(/-?\d+\.?\d*/g) || crAr(2)).map((el) => +el);
						res = Math.round((Math.atan(b, a) * 180) / Math.PI);
					}
					return res;
				},
				set(val) {
					const style = gs(element)[prop];
					let res = val;
					if (style.includes("px")) res = `${val}px`;
					else if (prop === "transform") res = `rotate(${val}deg)`;
					element.style[prop] = res;
				},
			});
		});
	}

	animWrapper = (action, args, cond) =>
		new Promise((resolve) => {
			const run = () => {
				if (cond()) {
					action(...args());
					++this.t;
					raf(run);
				} else resolve((this.t = 0));
			};
			run();
		});
}

const chain = async (...arr) => {
	for (let i in arr) {
		const [item, itemNext] = [arr[i], arr[i + 1]];

		if (item instanceof Function) {
			item();
			break;
		}

		const [, obj, fun, arg, con] = item,
			aw = obj.animWrapper.bind(obj, fun.bind(obj), arg, con.bind(obj));
		item !== itemNext ? await aw() : aw();
	}
};

const init = (arr, ...coords) => {
	arr = sel(arr);

	const create = (el, i) => {
		el.style.position = "absolute";
		el = new AnimEl(el);
		if (coords.length && coords[i]) [el.x, el.y] = coords[i];
		return el;
	};

	return arr.length ? arr.map(create) : create(arr, 0);
};

export { init, chain, utils };
