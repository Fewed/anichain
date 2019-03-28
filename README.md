# anichain

Библиотека **anichain.js** предназначена для управления последовательностью вызова пользовательских анимаций.

[Демо 1](http://msementsov.ru/anichain/demo/)

[Демо 2](http://msementsov.ru/anichain/game/)

## Содержание

- [Установка](#installation)
- [Использование](#Использование)
- [Поддержка](#support)
- [Развитие](#contributing)

## Установка

```sh
npm i anichain
```

## Использование

```sh

import { init, chain } from "anichain";

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

```

### Описание

Библиотека содержит следующие вспомогательные функции:

1. **sel(target)** – аналогично document.querySelectorAll(target),
   однако возвращает массив DOM элементов или одиночный элемент (если он один).
2. **crAr(size, ?val)** - создает массив длиной size, заполненный элементами со значением val (по умолчанию ноль).
3. **lis(eventType, process)** – укороченная форма записи window.addEventListener(eventType, process).
4. **l(info)** – укороченная форма записи console.log(info).
5. **raf(cb)** – укороченная форма записи requestAnimationFrame(cb).
6. **gs(element)** – укороченная форма записи getComputedStyle(element).

## Пользовательский интерфейс

1. **init(selector)** – функция, принимающая CSS селектор и возвращающая массив элементов или единичный элемент (аналогично **sel(target)**) с набором свойств, через которые реализуется чтение/запись соответствующих свойств исходных DOM элементов.
   На данный момент поддерживаются следующие свойства:

_src_ – ссылка на исходный DOM элемент;

_t_ – искусственно добавленное свойство, не связанное с каким-либо свойством исходного DOM элемента. Может использоваться как счетчик в условии con циклического вызова анимации через функцию **chain([pos, obj, fun, arg, con], ...)**;

_x, y_ – координаты элемента в пикселях при абсолютном позиционировании;

_angle_ – угол поворота элемента в градусах;

_w, h_ – ширина и высота элемента в пикселях;

_bgc_ – цвет фона элемента;

_display_ – отображение элемента.

```
<div class="elem"></div>
<div class="elem"></div>
```

```
let elems = init(".elem");
[elems[0].x, elems[1].x] = [200, 400];
elems.map(item => item.y = item.w = item.h = 100);
```

2. **chain([pos, obj, fun, arg, con], ...)** – функция для вызова последовательности анимаций. Каждая анимация описывается массивом параметров:

_pos_ – номер анимации. Если требуется запустить анимации одновременно, они должны иметь одинаковые номера. Если последовательно – разные. Сами значения ни на что не влияют, однако для наглядности следует нумеровать анимации в формате "0, 1, 2...".
Важен порядок следования массивов – если две анимации имеют номер "0", а затем идет анимация с номером "1", то "1" будет вызвана за второй анимацией "0".
Функция **chain([pos, obj, fun, arg, con], ...)** предоставляет возможность вызова callback функции, переданной последней строчкой.

```
let ch = () => chain(
	[0, block1, move, () => [], function() {return this.t < 20}],
	[0, block2, move, () => [], function() {return this.t < 10}],
	[1, block3, move, () => [], function() {return this.t < 10}],
	[1, block4, move, () => [], function() {return this.t < 10}],
	() => ch()
);

ch();
```

В этом примере сначала одновременно запускаются анимации элементов block1 и block2, по окончании анимации на block2 одновременно стартуют анимации элементов block3 и block4. После их выполнения цепочка анимаций запускается снова.

_obj_ – объект, который может быть использован для привязки контекста вызова.

```
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
```

Обе анимации будут вызывать перемещение block1.

_fun_ – пользовательская функция. Предполагается, что она будет являться методом объекта _obj_ или содержать this для привязки контекста, однако может использоваться произвольная функция или метод объекта, созданного без конструктора **init(selector)**.

```
chain(
	[0, block1, () => {img.scroll(500); flag = false}, () => [], () => flag],
	[0, block1, move, () => [], function() {return this.x < 200}]
);
```

Здесь одновременно запускаются img.scroll(500) и block1.move().

_arg_ – функция, возвращающая массив входных параметров для функции _fun_.

```
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
```

Первая анимация – перемещение элемента по диагонали со скоростью 10√2 единиц, вторая – по диагонали с 5√2 ед., третья – по вертикали с 7 ед.

_con_ – функция, возвращающая условие вызова пользовательской функции _fun_ в анимации. Как правило, в условии используется счетчик this.t или флаг, модифицируемый в теле функции _fun_. Важно отметить, что по завершении анимации this.t обнуляется, что позволяет использовать счетчик одного и того же объекта для управления условиями вызова функции _fun_ в различных анимациях.

```
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
```

Первая анимация – бесконечное вращение block1. Одновременно с ней стартует анимация движения block2. Если по ее окончании block2.x > 100, запустится анимация на block3. В противном случае она будет пропущена. Далее последовательно выполнятся анимации на block4 и block5.

## Поддержка

Please [open an issue](https://github.com/Fewed/coursehunters-downloader/issues/new) for support.

## Развитие

Please contribute using [Github Flow](https://guides.github.com/introduction/flow/). Create a branch, add commits, and [open a pull request](https://github.com/Fewed/coursehunters-downloader/compare).
