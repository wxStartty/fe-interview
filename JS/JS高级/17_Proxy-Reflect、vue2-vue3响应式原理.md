## Proxy-Reflect vue2-vue3响应式原理

### 监听对象的操作

#### 方式一：Object.defineProperty()

通过Object.defineProperty() 属性 描述符中的存取属性描述符

```js
let obj = {

 name: "wx",

 age: 20,

};



Object.keys(obj).forEach((key) => {

 let val = obj[key];

 Object.defineProperty(obj, key, {

  get() {

   console.log(监听到${key}值的获取);

   return val;

  },

  set(newVal) {

   console.log(监听到${key}值的设置);

   val = newVal;

  },

 });

});



obj.name = "kobe";

obj.age = 30;

console.log(obj.name, obj.age);

```



##### Object.defineProperty()的缺点

- Object.defineProperty设计初衷，不是为了监听一个对象中的所有属性的
- 如果想监听更加丰富的操作，如新增、删除，那么Object.defineProperty()是做不到的。



#### 方式二：Proxy

##### Proxy基本使用

在ES6中，新增了一个Proxy类，是用于帮助我们创建一个代理的

- 如果希望监听一个对象的相关操作，那么可以先创建一个代理对象(Proxy对象)
- 之后该对象的所有操作，都通过代理对象来完成，代理对象可以监听我们想要的对原对象的操作

##### Proxy的set和get捕获器

- set函数的四个参数：
  - target：目标对象（侦听的对象）
  - property：将被设置的属性key
  - value：新属性值
  - receiver：调用的代理对象
- get函数的三个参数：
  - target：目标对象（侦听的对象）
  - property：将被设置的属性key
  - receiver：调用的代理对象

```js
let obj2 = {

 name: "wx",

 age: 20,

};



// 1.创建代理对象

const proxyObj = new Proxy(obj2, {

 // 获取值时的捕获器

 get: function (target, key) {

  console.log(监听到对象的${key}属性被访问了, target);

  return target[key];

 },

 // 设置值时的捕获器

 set: function (target, key, newVal) {

  console.log(监听到${key}属性被设置了, target);

  target[key] = newVal;

 },

 // 监听in的捕获器

 has: function (target, key) {

  console.log(监听到对象的${key}属性in操作, target);

  return key in target;

 },

 // 监听delete的捕获器

 deleteProperty: function (target, key) {

  console.log(监听到对象的${key}属性delete操作, target);

  delete target[key];

 },

});



console.log(proxyObj.name);

console.log(proxyObj.age);



proxyObj.name = "www";

proxyObj.age = 30;



// in操作符

console.log("name" in proxyObj);



// delete操作

delete proxyObj.age;

```



##### Proxy所有捕获器

1. getPrototypeOf()：Object.getPrototypeOf()的捕获器
2. setPrototypeOf()：Object.setPrototypeOf()的捕获器
3. isExtensible()：Object.isExtensible 的捕获器
4. preventExtensions：Object.preventExtensions 方法的捕获器
5. getOwnPropertyDescriptor：Object.getOwnPropertyDescriptor 方法的捕获器
6. defineProperty：Object.defineProperty 方法的捕获器
7. ownKeys：Object.getPropertyNames方法和Object.getOwnPropertySymbols方法的捕获器
8. has：in操作符的捕获器
9. get：属性读取操作的捕获器
10. set：属性设置操作的捕获器
11. deleteProperty：delete操作的捕获器
12. apply：函数调用的捕获器
13. construct：new 操作符的捕获器



#### Reflect的作用

Reflect也是ES6新增的API，它是一个对象，字面意思是反射。

- 主要提供了很多操作JavaScript对象的方法，有点像Object中操作对象的方法

![Reflect的作用](D:\前端视频\js高级\截图\Reflect的作用.png)

十三个常见方法，与Proxy捕获器中一致

Reflect常与Proxy一起使用

##### receiver参数的作用

作用：*使得obj2中的get name()中的this是代理对象objProxy*

```js
const obj3 = {

 _name: "wx",

 get name() {

  return this._name;

 },

 set name(newValue) {

  this._name = newValue;

 },

};



const objProxy = new Proxy(obj3, {

 get: function (target, key, receiver) {

  // receiver 是创建出来的代理对象

  console.log("get被访问了~~", key, receiver);

  console.log(receiver === objProxy);

  // 使得obj2中的get name()中的this是代理对象objProxy

  return Reflect.get(target, key, receiver);

 },

 set: function (target, key, newValue, receiver) {

  console.log("set被访问了~~~", key);

  Reflect.set(target, key, newValue, receiver);

 },

});



// console.log(objProxy.name); // 执行两次  (obj3中的get执行一次，objProxy中的get执行一次)

objProxy.name = "xxx"; // 执行两次  (obj3中的set执行一次，objProxy中的set执行一次)

```



##### Reflect中construct作用

```js
function Student(name, age) {

 this.name = name;

 this.age = age;

}



function Teacher() {}



const stu = new Student("wx", 18);

console.log(stu);

console.log(stu.__proto__ === Student.prototype);



// 执行Student函数中的内容，但是创建出来的却是Teacher类型

const teacher = Reflect.construct(Student, ["wx", 18], Teacher);

console.log(teacher);

console.log(teacher.__proto__ === Teacher.prototype);

```



#### 什么是响应式

- m有个初始值，有段代码使用了这个值，那么在m有一个新的值时，这段代码可以自动重新执行

```js
let activeReactiveFn = null;

class Depend {

 constructor() {

  this.reactiveFns = new Set();

 }



 depend() {

  if (activeReactiveFn) {

   this.reactiveFns.add(activeReactiveFn);

  }

 }



 notify() {

  this.reactiveFns.forEach((fn) => {

   fn();

  });

 }

}



const depend = new Depend();

// 封装一个响应式函数

function watchFn(fn) {

 activeReactiveFn = fn;

 fn();

 activeReactiveFn = null;

}



// 封装一个获取depend函数

let targetMap = new WeakMap();

function getDepend(target, key) {

 // 根据target对象获取map的过程

 let map = targetMap.get(target);

 if (!map) {

  map = new Map();

  targetMap.set(target, map);

 }



 // 根据key获取depend对象

 let depend = map.get(key);

 if (!depend) {

  depend = new Depend();

  map.set(key, depend);

 }

 return depend;

}



// 监听对象属性变化：Proxy(vue3)/Object.defineProperty

function reactive(obj) {

 return new Proxy(obj, {

  get(target, key, receiver) {

   // 根据target[key]获取对应的depend

   const depend = getDepend(target, key);

   // 给depend对象添加响应函数

   // depend.addDepend(activeReactiveFn);

   depend.depend();

   return Reflect.get(target, key, receiver);

  },

  set(target, key, newValue, receiver) {

   Reflect.set(target, key, newValue, receiver);

   const depend = getDepend(target, key);

   depend.notify();

  },

 });

}



const obj = {

 name: "wx",

 age: 20,

};



const objProxy = reactive(obj);



watchFn(() => {

 console.log("objProxy.age", objProxy.age);

});



const info = reactive({

 address: "深圳市",

});



watchFn(() => {

 console.log("info.address", info.address);

});



console.log("初始化执行分界线——————————————————————————");



objProxy.age = 100;

info.address = "南昌市";
```