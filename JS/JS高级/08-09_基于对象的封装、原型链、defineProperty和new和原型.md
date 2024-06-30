### with和eval

#### with语句

- with语句：可以形成自己的作用域

```js
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

```



#### eval函数

eval是一个特殊的全局函数，它可以将传入的字符串当做Javascript代码来运行。

不建议在开发中使用eval：

- eval代码可读性非常的差（代码的可读性是高质量代码的重要原则）
- eval是一个字符串，那么有可能在执行过程中被刻意篡改，那么可能造成被攻击的风险
- eval的执行必须经过JS解释器，不能被JS引擎优化



### 认识严格模式

###![认识严格模式](D:\前端视频\js高级\截图\认识严格模式.png)

开启严格模式："use strict"



### Object.defineProperty

Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。

```js
Object.defineProperty(obj, prop, descriptor)
```

可接收三个参数：

- obj 要定义属性的对象
- prop要定义或者修改的属性的名称或 Symbol
- descriptor要定义或修改的属性描述符

返回值：被传递给函数的对象。

#### 属性描述符分类

![属性描述符分类](D:\前端视频\js高级\截图\属性描述符分类.png)

##### 数据属性描述符

![数据属性描述符](D:\前端视频\js高级\截图\数据属性描述符.png)

##### 存取属性描述符

![存取属性描述符](D:\前端视频\js高级\截图\存取属性描述符.png)



### Object.defineProperties

![objectDefineProperties写法](D:\前端视频\js高级\截图\objectDefineProperties写法.png)



### 获取属性描述符

eg：Object.getOwnPropertyDescriptor(obj, 'name')

eg：Object.getOwnPropertyDescriptors(obj)



### Object的方法对对象的限制

1.  禁止对象继续添加新的属性

   Object.preventExtensions(obj)

2. 禁止对象配置/删除里面的属性(configurable: false)

   Object.seal(obj)

3. 让属性不可以修改(writable: false)

   Object.freeze(obj)



### 认识构造函数

- 构造函数也是一个普通的函数
- 一个普通函数被使用new操作符来调用，那么这个函数称为构造函数



### new

如果一个函数被使用new操作符调用了，那么它会执行如下操作：

1. 在内存中创建一个新的对象（空对象）；
2. 这个对象内部的[[prototype]]属性会被赋值为该构造函数的prototype属性；
3. 构造函数内部的this，会指向创建出来的新对象；
4. 执行函数的内部代码（函数体代码）；
5. 如果构造函数没有返回非空对象，则返回创建出来的对象；

规范：构造函数首字母大写

class Person {} 是 function Person() {} 的语法糖

缺点：多次创建会生成多个新的对象，导致方法的重复，造成性能的浪费。

```js
function myNew(Con, ...args) {
  let obj = {}
  Object.setPrototypeOf(obj, Con.prototype)
  let result = Con.apply(obj, args)
  return result instanceof Object ? result : obj
}
```



### 对象的原型

#### 原型的作用

- 当对象中没有我们需要的属性时，会去原型对象中查找
- 为实现继承提供便利

#### 对象原型的理解

- \__proto__：浏览器提供查看原型对象的方法（隐式原型）
- Object.getPrototypeOf(obj)： 提供查看原型对象的方法（隐式原型）

#### 函数原型的理解

函数也有隐式原型：函数名.\__proto__

函数会比对象多一个显式原型：prototype

foo.prototype.constructor = foo

