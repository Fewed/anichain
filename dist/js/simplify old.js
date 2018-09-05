// smart selector
let sel = target => {
	let arr = document.querySelectorAll(target);
	
	return (arr.length === 1) ? arr[0] : Array.from(arr);
};

// global event listener
let lis = (eventType, process) => window.addEventListener(eventType, process);

// shorted console.log()
let log = console.log.bind(console);

// math ceil, floor, round methods with parameters
function Clarifier(math) {
	return (num, precise) => math(10 ** precise * num) / 10 ** precise;
}

let floor = new Clarifier(Math.floor),
		ceil = new Clarifier(Math.ceil),
		round = new Clarifier(Math.round);

// REPLACE THAT WITH METHOD CONSTRUCTOR!!!

// function execution time measurement function
function clock() {
	let func = Array.from(arguments).shift(),
			arg = (arguments.length > 1) ? Array.from(arguments).slice(1) : [],
			funcName = `${func}`.split(" ")[1],
			date = new Date();

	func(...arg);
	log(`${funcName}'s duration is ${new Date() - date} ms`);
}

// shorted or statement
Number.prototype.or = function() {
    let flag = false;

    for (let i in arguments) {
    	if (typeof(arguments[i]) === "number" && this.valueOf() === arguments[i]) {
    		flag = true;
    		break;
    	}
    	else if (typeof(arguments[i]) === "object") {
    		for (let j = arguments[i][0]; j <= arguments[i][1]; j++) if (this.valueOf() === j) {
    			flag = true;
    			break;
    		}
    	}
    }

    return flag;
};

// shorted RAF
let raf = cb => requestAnimationFrame(cb);

// shorted getComputedStyle
let gs = element => getComputedStyle(element);

// shorted unicode get function
String.prototype.cd = function cd() {return this.charCodeAt()};

// shorted unicode set function
Number.prototype.dc = function dc() {return String.fromCharCode(this)};
