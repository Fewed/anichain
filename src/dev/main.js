import { init, chain } from "anichain";

const coords = [0, 220];

const [el] = init("div", coords);

function move(dir = "x") {
	dir === "x" ? ++this.x : ++this.y;
}

const ch = () =>
	chain(
		[
			0,
			el,
			move,
			() => [],
			function() {
				return this.t < 50;
			},
		],
		[
			1,
			el,
			move,
			() => ["y"],
			function() {
				return this.t < 100;
			},
		],
		() => {
			[el.x, el.y] = coords;
			ch();
		},
	);

ch();
