# anichain

Библиотека **anichain.js** предназначена для управления последовательностью вызова пользовательских анимаций.

[Демо 1](https://fewed.github.io/anichain/demo/)

[Демо 2](https://fewed.github.io/anichain/game/)

## Содержание

- [Установка](#установка)

- [Использование](#использование)

- [Пользовательский интерфейс](#пользовательский-интерфейс)

- [Поддержка](#поддержка)

- [Развитие](#развитие)

## Установка

```javascript
npm i anichain
```

## Использование

```javascript
import { init, chain } from "anichain";

const coords = [0, 220];

const el = init("div.el", coords);

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
      }
    ],
    [
      1,
      el,
      move,
      () => ["y"],
      function() {
        return this.t < 100;
      }
    ],
    () => {
      [el.x, el.y] = coords;
      ch();
    }
  );

ch();
```

## Пользовательский интерфейс

1. **init(target, ...coords)** – функция, принимающая CSS селектор **target** и массив **coords** пар координат **[x, y]**, возвращающая массив элементов или единичный элемент с набором свойств, через которые реализуется чтение/запись соответствующих свойств исходных DOM элементов.

На данный момент поддерживаются следующие свойства:

_src_ – ссылка на исходный DOM элемент;

_t_ – искусственно добавленное свойство, не связанное с каким-либо свойством исходного DOM элемента. Может использоваться как счетчик в условии con циклического вызова анимации через функцию **chain(...arr)**;

_x, y_ – координаты элемента в пикселях при абсолютном позиционировании;

_angle_ – угол поворота элемента в градусах;

_w, h_ – ширина и высота элемента в пикселях;

_display_ – отображение элемента.

```html
<div class="elem"></div>

<div class="elem"></div>
```

```javascript
const elems = init(".elem", [200, 0], [400, 0]);

elems.map(item => (item.y = item.w = item.h = 100));
```

2. **chain(...arr)** – функция для вызова последовательности анимаций **arr[i]**. Каждая анимация описывается массивом параметров **[pos, obj, fun, arg, con]**:

_pos_ – номер анимации. Если требуется запустить анимации одновременно, они должны иметь одинаковые номера. Если последовательно – разные. Сами значения ни на что не влияют, однако для наглядности следует нумеровать анимации в формате "0, 1, 2...".

Важен порядок следования массивов – если две анимации имеют номер "0", а затем идет анимация с номером "1", то "1" будет вызвана за второй анимацией "0".

Функция **chain(...arr)** предоставляет возможность вызова callback функции, переданной последней строчкой.

```javascript
const ch = () =>
  chain(
    [
      0,
      block1,
      move,
      () => [],
      function() {
        return this.t < 20;
      }
    ],
    [
      0,
      block2,
      move,
      () => [],
      function() {
        return this.t < 10;
      }
    ],
    [
      1,
      block3,
      move,
      () => [],
      function() {
        return this.t < 10;
      }
    ],
    [
      1,
      block4,
      move,
      () => [],
      function() {
        return this.t < 10;
      }
    ],
    () => ch()
  );

ch();
```

В этом примере сначала одновременно запускаются анимации элементов block1 и block2, по окончании анимации на block2 одновременно стартуют анимации элементов block3 и block4. После их выполнения цепочка анимаций запускается снова.

_obj_ – объект, который может быть использован для привязки контекста вызова.

```javascript
chain(
  [
    0,
    block1,
    move,
    () => [],
    function() {
      return this.t < 20;
    }
  ],
  [
    0,
    block2,
    move2,
    () => [],
    function() {
      return this.t < 20;
    }
  ]
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

_fun_ – пользовательская функция. Предполагается, что она будет являться методом объекта _obj_ или содержать this для привязки контекста, однако может использоваться произвольная функция или метод объекта.

```javascript
chain(
  [
    0,
    block1,
    () => {
      img.scroll(500);
      flag = false;
    },
    () => [],
    () => flag
  ],
  [
    0,
    block1,
    move,
    () => [],
    function() {
      return this.x < 200;
    }
  ]
);
```

Здесь одновременно запускаются img.scroll(500) и block1.move().

_arg_ – функция, возвращающая массив входных параметров для функции _fun_.

```javascript
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

```javascript
chain(
  [0, block1, rotate, () => [], () => true],
  [
    0,
    block2,
    move,
    () => [],
    function() {
      return this.t < 10;
    }
  ],
  [1, block3, move2, () => [], () => flag && block3.y < 50],
  [2, block4, move, () => [], () => block2.t < 10],
  [3, block5, move, () => [], () => block2.t < 10]
);

function rotate() {
  this.angle++;
}

function move() {
  this.t++;
  this.x += 10;
  flag = block2.x > 100;
}

function move2() {
  this.y += 5;
}
```

Первая анимация – бесконечное вращение block1. Одновременно с ней стартует анимация движения block2. Если по ее окончании block2.x > 100, запустится анимация на block3. В противном случае она будет пропущена. Далее последовательно выполнятся анимации на block4 и block5.

## Поддержка

[Сообщите о проблеме.](https://github.com/Fewed/anichain/issues/new)

## Развитие

Сделайте вклад в развитие проекта с [Github Flow](https://guides.github.com/introduction/flow/). Создайте ветку, добавьте коммиты и [сделайте пулл-реквест](https://github.com/Fewed/anichain/compare).
