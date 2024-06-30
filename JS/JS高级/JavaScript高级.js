// 1.call实现
Function.prototype.myCall = function (thisArg, ...arg) {
  // 1.执行调用myCall的函数(解决的问题是：知道是哪个函数执行了myCall)
  var fn = this;
  // fn();

  // 2.对thisArg转成对象类型（防止传入的是非对象类型）
  // 对thisArg是null或者undefined情况做处理
  thisArg =
    thisArg !== null && thisArg !== undefined ? Object(thisArg) : window;
  // 2.绑定thisArg
  thisArg.fn = fn;
  // 3.把传递的参传给调用myCall的函数
  var result = thisArg.fn(...arg);
  delete thisArg.fn;

  // 4.将最终的结果返回
  return result;
};

// 2.apply实现
Function.prototype.myApply = function (thisArg, argArray = []) {
  // 1.执行调用myCall的函数(解决的问题是：知道是哪个函数执行了myCall)
  var fn = this;
  // fn();

  // 2.对thisArg转成对象类型（防止传入的是非对象类型）
  // 对thisArg是null或者undefined情况做处理
  thisArg =
    thisArg !== null && thisArg !== undefined ? Object(thisArg) : window;
  // 2.绑定thisArg
  thisArg.fn = fn;
  // 3.把传递的参传给调用myCall的函数
  var result = thisArg.fn(...argArray);
  delete thisArg.fn;

  // 4.将最终的结果返回
  return result;
};

// 3.bind实现
Function.prototype.maBind = function (thisArg, ...argArray) {
  // 1.获取到真实需要绑定的函数
  var fn = this;

  // 2.绑定this
  thisArg =
    thisArg !== null && thisArg !== undefined ? Object(thisArg) : window;

  function proxyFn(...args) {
    // 3.将函数放到thisArg中进行调用
    thisArg.fn = fn;
    // 特殊：对两个传入的参数进行合并
    var finalArgs = [...argArray, ...args];
    var result = thisArg.fn(...finalArgs);
    delete thisArg.fn;

    // 4.返回结果
    return result;
  }
  // bind会返回一个函数
  return proxyFn;
};

// Array中slice实现
Array.prototype.mySlice = function (start, end) {
  var array = this;
  start = start || 0;
  end = end || array.length;
  var newArr = [];
  for (var i = start; i < end; i++) {
    newArr.push(array[i]);
  }

  return newArr;
};

// 柯里化
function foo(a, b, c, d) {
  return a + b + c + d;
}
foo(1, 2, 3, 4);

function currying(a) {
  return function (b) {
    return function (c) {
      return function (d) {
        console.log(a + b + c + d);
      };
    };
  };
}
currying(1)(2)(3)(4);

// 柯里化函数的实现myCurring
function myCurring(fn) {
  function curried(...args) {
    // 判断当前已接收参数的个数，与函数本身需要接收参数的个数是否一致
    // 调用方式为currAdd(10, 20, 30)
    if (args.length >= fn.length) {
      console.log("this", this);
      // fn(...args)
      // 保证该fn函数的this是调用该函数(currAdd)的this一致.
      // fn.call(this, ...args)
      return fn.apply(this, args);
      // 调用方式为currAdd(10)(20)(30)
    } else {
      // 没有达到个数时，需要返回一个新的函数，继续来接受参数
      function curried2(...arg2) {
        // 接收到参数后，需要递归调用curried来检查函数的个数是否达到
        return curried.apply(this, [...args, ...arg2]);
      }

      return curried2;
    }
  }

  return curried;
}

function add1(x, y, z) {
  console.log("x + y + z", x + y + z);
  return x + y + z;
}

var currAdd = myCurring(add1);

currAdd(10, 20, 30);
currAdd(10, 20)(30);
currAdd(10)(20)(30);

// 组合函数
function double(num) {
  return num * 2;
}

function square(num) {
  return num ** 2;
}

function composeFn(m, n) {
  return function (count) {
    return n(m(count));
  };
}

var newFn = composeFn(double, square);
console.log(newFn(10)); // 400

// 通用组合函数的实现
function myCompose(...fns) {
  var length = fns.length;
  for (var i = 0; i < length; i++) {
    if (typeof fns[i] !== "function") {
      throw new TypeError("Expected arguments are functions");
    }
  }

  function compose(...args) {
    var index = 0;
    var result = length ? fns[index].apply(this, args) : args;
    while (++index < length) {
      result = fns[index].call(this, result);
    }
    return result;
  }
  return compose;
}

var newFn2 = myCompose(double, square);
console.log(newFn2(10)); // 400

// with语句
// with语句：可以形成自己的作用域
var obj = { name: "wx", age: 20 };

function foo8() {
  function bar8() {
    with (obj) {
      console.log("name", name); // obj中的name，输出wx
    }
  }
  bar8();
}

foo8();

// 继承
// 1.原型链继承
function Parent() {
  this.name = "wx";
}

Parent.prototype.getName = function () {
  console.log(this.name);
};

function Child() {}

Child.prototype = new Parent();

const child = new Child();

console.log(child.getName()); // wx

// 2.借用构造函数继承
function Person(name, age, friends) {
  this.name = name;
  this.age = age;
  this.friends = friends;
}

function Student(name, age, friends) {
  Person.call(this, name, age, friends);
  this.sno = 111;
}

Student.prototype = new Person();

Student.prototype.studying = function () {
  console.log(this.name + "studying");
};

var stu = new Student();

// 3.原型式继承
// 原型式继承函数：目的是为了将 obj对象作为info对象的原型对象
var obj = {
  name: "wx",
};
function createObject1(o) {
  var newObj = {};
  Object.setPrototypeOf(newObj, o);
  return newObj;
}
// 等价于下面的函数
function createObject2(o) {
  function Fn() {}
  Fn.prototype = o;
  var newObj = new Fn();
  return newObj;
}
// 等价于下面的方法
Object.create(obj);

var info = createObject2(obj);

// 4.寄生式继承
var personObj = {
  running: function () {
    console.log("running");
  },
};

function createStudent(name) {
  var stu = Object.create(personObj); // 原型式继承
  stu.name = name;
  stu.studying = function () {
    console.log("studying");
  };
  return stu;
}

var stuObj = createStudent("wx");
var stuObj2 = createStudent("wxx");

// 5.寄生组合继承
function createObject(o) {
  function Fn() {}
  Fn.prototype = o;
  return new Fn();
}

function inheritPrototype(SubType, SuperType) {
  // SubType.prototype = Object.create(SuperType.prototype)
  SubType.prototype = createObject(SuperType.prototype);
  Object.defineProperty(SubType.prototype, "constructor", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: SubType,
  });
}

function Person(name, age, friends) {
  this.name = name;
  this.age = age;
  this.friends = friends;
}

Person.prototype.eating = function () {
  console.log("eating");
};

Person.prototype.running = function () {
  console.log("running");
};

function Student(name, age, friends, sno, score) {
  Person.call(this, name, age, friends);
  this.sno = sno;
  this.score = score;
}

inheritPrototype(Student, Person);

Student.prototype.studying = function () {
  console.log("studying");
};

var stu = new Student("wx", 20, ["kobe"], 111, 110);
console.log(stu);
stu.eating();
stu.running();
stu.studying();

// 类
// 类的定义
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
    this._address = "深圳市";
  }

  eating() {
    console.log(this.name + "eating");
  }

  running() {
    console.log(this.name + "running");
  }

  // 类的访问器方法
  get address() {
    return this._address;
  }

  set address(value) {
    this._address = value;
  }

  // 类的静态方法(类方法)
  // Person.createPerson()
  static createPerson() {}

  parentMethod() {
    console.log("父类处理逻辑1");
    console.log("父类处理逻辑2");
  }

  static staticMethod() {
    console.log("staticMethod");
  }
}

// 类的继承
class Student extends Person {
  constructor(name, age, sno) {
    // super的第一个用法
    super(name, age);
    this.sno = sno;
  }

  studying() {
    console.log(this.name + "studying");
  }

  // 类对父类方法的重写
  running() {
    console.log(this.name + "running");
  }

  parentMethod() {
    // super的第二个用法
    super.parentMethod();

    console.log("子类处理逻辑3");
    console.log("子类处理逻辑4");
  }

  // 重写静态方法
  static staticMethod() {
    console.log("Student => staticMethod");
  }
}

// JS实现类混入
function mixinRunner(BaseClass) {
  class NewClass extends BaseClass {
    running() {
      console.log("running");
    }
  }
  return NewClass;
}

class Student extends Person {}

var NewStudent = mixinRunner(Student);
var ns = new NewStudent();
ns.running();

// Symbol
const s1 = Symbol();
const s2 = Symbol();
console.log(s1 === s2); // false

// ES2019(ES10) Symbol 还有一个描述(description)
const s3 = Symbol("aaa");
console.log(s3.description); // aaa

// 3.Symbol值作为key
const obj = {
  [s1]: "aaa",
  [s2]: "bbb",
};

// 3.2 新增属性
obj[s3] = "ccc";

// 3.3 Object.defineProperty
const s4 = Symbol();
Object.defineProperty(obj, s4, {
  enumerable: true,
  writable: true,
  configurable: true,
  value: "ddd",
});

console.log(obj[s1], obj[s2], obj[s3], obj[s4]); // 不能 obj.s1获取

// 4.使用Symbol作为key的属性名，在遍历Object.key等中获取不到这些Symbol值
console.log(Object.keys(obj)); // 获取不到
console.log(Object.getOwnPropertyNames(obj)); // 获取不到
console.log(Object.getOwnPropertySymbols(obj)); // 获取得到

// 5.Symbol.for(key)/Symbol.keyFor(symbol)
const s5 = Symbol("aaa");
const s6 = Symbol("aaa");
console.log(s5 === s6); // true

const key = Symbol.keyFor(s5);
console.log(key); // aaa
const s7 = Symbol.for(key);
console.log(s5 === s7); // true

// Set
// 1.创建Set结构数据
const set = new Set();
set.add(10);
set.add(20);
set.add(30);
set.add(40);
console.log(set);

// 数组去重
const arrSet = new Set([11, 11, 3, 55, 4, 8]);
// const newArr = Array.from(arrSet)
const newArr = [...arrSet];

// Set的方法
// 1.size属性
console.log(arrSet.size); // 5

// 2.add

// 3.delete
arrSet.delete(8);

// 4.has

// 5.clear
// 6.对Set进行遍历
arrSet.forEach((item) => {
  console.log(item);
});

for (const item of arrSet) {
  console.log(item);
}

// WeakSet
// 1.创建WeakSet数据
const weakSet = new WeakSet();
weakSet.add(10); // 保错

// 2.方法 add delete has
// 3.WeakSet的应用场景
const personWeakSet = new WeakSet();
class Person {
  constructor() {
    personWeakSet.add(this);
  }

  running() {
    if (!personWeakSet.has(this)) {
      throw new Error("不能通过非构造方法创建出来的对象调用running方法");
    }
  }
}

const p = new Person();
// p.running()
p.running.call({ name: "wxx" }); // 报错

// Map
// 1.创建Map类型数据
// Map允许对象类型作为key
const obj1 = { name: "www" };
const obj2 = { name: "xxx" };
const map = new Map();
map.set(obj1, "aaa");
map.set(obj2, "bbb");
map.set(1, "ccc");
console.log(map);

const map2 = new Map([
  [obj1, "aaa"],
  [obj2, "bbb"],
  [2, "ddd"],
]);
console.log(map2);

// 2.方法
// size;
// set;
// has;
// delete
// clear;
// get;
console.log(map.get(obj1));

// 3.遍历Map
map2.forEach((item, key) => console.log(item, key));
for (const [key, value] of map2) {
  console.log(key, value);
}

// WeakMap
// 1.创建WeakMap类型数据
const obj = {
  name: "obj1",
};

const map3 = new Map();
map.set(obj, "aaa"); // 强引用

const weakMap = new WeakMap();
weakMap.add(obj, "aaa"); // 弱引用

// 2.方法
// get
// has
// delete

// 3.WeakMap不能遍历
// 4.应用场景(vue3响应式原理)
const obj11 = {
  name: "wwxx",
  age: 20,
};
function obj1NameFn1() {
  console.log("ojb1NameFn1");
}
function obj1NameFn2() {
  console.log("ojb1NameFn2");
}
function obj1AgeFn1() {
  console.log("ojb1NameFn1");
}
function obj1AgeFn2() {
  console.log("ojb1NameFn1");
}
// 4.1 创建WeakMap
const weakMap2 = new WeakMap();

// 4.2 收集依赖结构
const obj11Map = new Map();
obj11Map.set("name", [obj1NameFn1, obj1NameFn2]);
obj11Map.set("age", [obj1AgeFn1, obj1AgeFn2]);
weakMap2.set(obj11, obj11Map);

// 4.3 如果obj11.name发生了改变
// proxy/Object.defineProperty
obj1.name = "yaoMing";
const targetMap = weakMap2.get(obj11);
const fns = targetMap.get("name");
fns.forEach((fn) => fn());

// ES12
// 1.
const finalRegistry = new FinalizationRegistry((value) => {
  console.log("注册在finalRegistry的对象被销毁", value);
});
let finalObj = { name: "wx" };
let info = new WeakRef(obj); // 弱引用 便于当 finalObj = null时，内存的回收
finalRegistry.register(finalObj, "finalObj");

// 当执行finalObj = null时，不定时会输出以上的打印, 目前node环境不支持
finalObj = null;

setTimeout(() => {
  // 如果对象没有销毁，那么可以获取到元对象
  // 如果元对象销毁，那么获取到的是undefined
  console.log(info.deref()?.name);
}, 10000);

// 2.逻辑赋值运算符 ||=  &&=  ??=
// 逻辑或赋值运算符
let message;
// 等价于 message = message || 'default _value'
message ||= "default value";

// 逻辑与赋值运算符
let info = { name: "wx" };
// 等价于 info = info && info.name
info &&= info.name;

// 逻辑空赋值运算符
let msg = "";
msg ??= "default value";
console.log(msg); // ''
