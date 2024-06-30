## iterator-Generator

### iterator

#### 迭代器

- 迭代器（iterator）：使用户可在容器对象（container，例如链表或数组）上遍访的对象，使用该接口无需关心对象的内部实现细节。
- 从迭代器的定义看，迭代器是帮助我们对某个数据结构进行遍历的对象。
- 在JavaScript中，迭代器也是一个具体的对象，这个对象需要符合迭代器协议（iterator protocol）。
  - 迭代器协议定义了产生一系列值（无论是有限还是无限个）的标准方式；
  - 那么在JavaScript中这个标准就是一个特定的next方法；
- next方法有如下要求：
  - 无参或者一个参数的函数，返回一个应当拥有以下两个属性的对象
    - done（boolean）
      - 入轨迭代器可以产生序列中的下一个值，则为false（这等价于没有指定done这个属性）
      - 如果迭代器已将序列迭代完毕，则为true。这种情况下，value是可选的，如果它依然存在，即为迭代结束之后的默认返回值。
    - value
      - 迭代器返回的任何JavaScript值。done为true时可省略。

```js
const names = ["aaa", "bbb", "ccc"];
const nums = [111, 222, 333];

function createArrayIterator(arr) {
  let index = 0;
  return {
    next: function () {
      if (index < arr.length) {
        return { done: false, value: arr[index++] };
      } else {
        return { done: true, value: undefined };
      }
    },
  };
}

const namesIterator = createArrayIterator(names);
console.log(namesIterator.next());
console.log(namesIterator.next());
console.log(namesIterator.next());
console.log(namesIterator.next());

const numsIterator = createArrayIterator(nums);
console.log(numsIterator.next());
console.log(numsIterator.next());
console.log(numsIterator.next());
console.log(numsIterator.next());
```



#### 可迭代对象

- 它和迭代器是不同的概念；
- 当一个对象实现了iterator protocol 协议时，它就是一个可迭代对象；
- 这个对象的要求必须实现@@iterator 方法，在代码中使用Symbol.iterator访问该属性；

```js
// 创建一个可迭代对象
const iteratorObj = {
  names: ["aaa", "bbb", "ccc"],
  [Symbol.iterator]: function () {
    let index = 0;
    return {
      next: () => {
        if (index < this.names.length) {
          return { done: false, value: this.names[index++] };
        } else {
          return { done: true, value: undefined };
        }
      },
    };
  },
};

const iterator = iteratorObj[Symbol.iterator]();
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());

// 另一个可迭代对象
const iterator2 = iteratorObj[Symbol.iterator]();
console.log(iterator2.next());
console.log(iterator2.next());
console.log(iterator2.next());
console.log(iterator2.next());

// for...of只可以遍历可迭代对象，是上面iterator.next()调用方式的语法糖
// 普通对象是不可以使用for...of进行遍历的，可可迭代对象可以
for (const item of iteratorObj) {
  console.log("item", item);
}
```



#### 原生迭代器对象

- String、Array、Map、Set、argument、NodeList集合

  ```js
  const names = ["aaa", "bbb", "ccc"];
  const iterator = names[Symbol.iterator]();
  console.log(iterator.next());
  console.log(iterator.next());
  console.log(iterator.next());
  console.log(iterator.next());
  ```



#### 可迭代对象的应用场景

1. for...of
2. 展开语法(spread syntax)：[...arr, ...iteratorObj]
3. 解构赋值
4. 创建一些其他对象时(Set  Array.from)
5. Promise.all(iteratorObj)



#### 自定义类的可迭代实现

```js
class ClassRoom {
  constructor(address, name, students) {
    this.address = address;
    this.name = name;
    this.students = students;
  }

  entry(students) {
    this.students.push(students);
  }

  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.students.length) {
          return { done: false, value: this.students[index++] };
        } else {
          return { done: true, value: undefined };
        }
      },
      return: () => {
        console.log("迭代器提前终止了");
        // 需要返回一个对象，不然会报错
        return { done: true, value: undefined };
      },
    };
  }
}

const classroom = new ClassRoom("xxx", "3班", ["wx", "ww", "xx"]);
classroom.entry("yy");

for (const item of classroom) {
  console.log("item", item);
  if (item === "ww") break;
}

// 构造函数实现迭代器
// function Person {}
// Person.prototype[Symbol.iterator] = function() {}
```



### 生成器

生成器是ES6中新增的一种函数控制、使用的方案，它可以让我们更加灵活的控制函数什么时候执行、暂停执行等。

生成器函数也是一个函数，但是和普通的函数有一些区别：

- 生成器函数需要在function的后面加一个符号 *
- 生成器函数可以通过yield关键字来控制函数的执行流程
- 生成器函数的返回值是一个Generator（生成器）
  - 生成器事实上是一种特殊的迭代器



#### 生成器函数

```js
function* foo() {
  console.log("1", 1);
  // 需要返回值时，需要在yield后写
  yield "aaa";
  console.log("2", 2);
  // 如果提前return，generator.next()的返回值中的done，在该位置之后都为true
  return "bbb";
  yield;
  console.log("3", 3);
  yield;
  console.log("4", 4);
}

// 返回一个生成器
const generator = foo();
// generator.next(); // 1
// generator.next(); // 2
// generator.next(); // 3
// generator.next(); // 4

// generator.next() 有返回值
console.log("返回值1", generator.next()); // { value: 'aaa', done: false }
console.log("返回值2", generator.next()); // { value: 'bbb', done: true }
console.log("返回值3", generator.next()); // { value: undefined, done: true }
console.log("返回值4", generator.next()); // { value: undefined, done: true }
```



#### 生成器的其他方法

##### 生成器函数next传参

```js
function* foo() {
  console.log("1", 1);
  const num = yield "aaa";
  console.log("2", 2);
  console.log("num", num); // 10
  const n = yield;
  console.log("3", 3);
  console.log("n", n);
  const m = yield;
  console.log("4", 4);
  console.log("m", m);
}

// 返回一个生成器
const generator = foo();

generator.next();
// 第一个yield的返回值是第二个next调用参入的参数
generator.next(10);
// 同理
generator.next(20);
generator.next(30);

```

##### ##### 生成器函数return终止执行

```js
function* foo() {
  console.log("1", 1);
  const num = yield "aaa";
  console.log("2", 2);
  console.log("num", num); // 10

  // generator.return() 等价于 return
  // return 'return'
  const n = yield;
  console.log("3", 3);
  console.log("n", n);
  const m = yield;
  console.log("4", 4);
  console.log("m", m);
}

// 返回一个生成器
const generator = foo();

console.log(generator.next());
console.log(generator.next(10));
console.log(generator.return("return")); // { value: 'return', done: true }
// generator.return("return")之后的代码都不会执行
console.log(generator.next());
console.log(generator.next());
console.log(generator.next());
console.log(generator.next());

```

##### 生成器函数throw抛出异常

```js
function* foo() {
  console.log("1", 1);
  // generator.throw() 等价于 return
  // return 'return'
  try {
    yield;
  } catch (err) {
    console.log("err", err);
  }
  console.log("2", 2);
  yield;
  console.log("3", 3);
  yield;
  console.log("4", 4);
}

// 返回一个生成器
const generator = foo();

console.log(generator.next());
console.log(generator.throw("err message"));

```

##### 生成器替代迭代器

- 把迭代器改成生成器

```js
// 把迭代器改成生成器
function* createArrayIterator(arr) {
  // 第一种写法
  // let index = 0;
  // yield arr[index++];
  // yield arr[index++];
  // yield arr[index++];

  // 第二种写法
  // for (const item of arr) {
  //   yield item;
  // }

  // 第三种写法
  // yield* 后面需要跟着可迭代对象
  yield* arr;
}

const names = ["aaa", "bbb", "ccc"];
const namesIterator = createArrayIterator(names);
console.log(namesIterator.next());
console.log(namesIterator.next());
console.log(namesIterator.next());
console.log(namesIterator.next());
```

-  class案例

  ```js
  class ClassRoom {
    constructor(address, name, students) {
      this.address = address;
      this.name = name;
      this.students = students;
    }
  
    entry(students) {
      this.students.push(students);
    }
    // 另一种写法
    foo = () => {};
  
    *[Symbol.iterator]() {
      // let index = 0;
      // return {
      //   next: () => {
      //     if (index < this.students.length) {
      //       return { done: false, value: this.students[index++] };
      //     } else {
      //       return { done: true, value: undefined };
      //     }
      //   },
      //   return: () => {
      //     console.log("迭代器提前终止了");
      //     // 需要返回一个对象，不然会报错
      //     return { done: true, value: undefined };
      //   },
      // };
      yield* this.students;
    }
  }
  
  const classroom = new ClassRoom("xxx", "3班", ["wx", "ww", "xx"]);
  classroom.entry("yy");
  
  for (const item of classroom) {
    console.log("item", item);
  }
  ```

  
