import { init, chain } from "./anichain";

const coords = [0, 220];

const [el, el2] = init("div", coords);

function move(dir = "x") {
	dir === "x" ? ++this.x : ++this.y;
}

function cond(val) {
	return el.t < val;
}

const ch = () =>
	chain(
		[0, el, move, () => [], () => cond(50)],
		[1, el, move, () => ["y"], () => cond(100)],
		() => {
			[el.x, el.y] = coords;
			ch();
		},
	);

ch();
