### 实现apply、call、bind

#### call实现

```js
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

```



#### apply实现

```js
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

```



#### bind实现

```js
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
```



### 认识arguments

arguments 是一个对应于传递给函数的参数的类数组(array-like)对象。

arguments 存在AO中

array-like 意味着它不是一个数组类型，而是一个对象类型

- 它有数组一些特征，如length，可以通过索引来访问
- 但是没有数组的一些方法，如forEach、map等

#### 常见的对arguments的操作

1. 获取参数长度：arguments.length
2. 根据索引值获取某一个参数：arguments[2]
3. callee获取当前arguments所在的函数  arguments.callee

#### arguments 转数组

1. 对arguments遍历，然后push到新的数组中

2. var newArr = Array.prototype.slice.call(arguments)

3. var newArr = [].slice.call(arguments)

4. 使用ES6语法：

   var newArr = Array.from(arguments)

   var newArr = [...arguments]

额外补充：

```js
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
```



注意：箭头函数没有 arguments，箭头函数中 arguments 指向与this一致。