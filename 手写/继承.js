// 继承
// 1.原型链继承
function Parent() {
  this.name = "wx"
}

Parent.prototype.getName = function () {
  console.log(this.name)
}

function Child() {}

Child.prototype = new Parent()

const child = new Child()

console.log(child.getName()) // wx

// 2.借用构造函数继承
function Person(name, age, friends) {
  this.name = name
  this.age = age
  this.friends = friends
}

function Student(name, age, friends) {
  Person.call(this, name, age, friends)
  this.sno = 111
}

Student.prototype = new Person()

Student.prototype.studying = function () {
  console.log(this.name + "studying")
}

var stu = new Student()

// 3.原型式继承
// 原型式继承函数：目的是为了将 obj对象作为info对象的原型对象
var obj = {
  name: "wx",
}
function createObject1(o) {
  var newObj = {}
  Object.setPrototypeOf(newObj, o)
  return newObj
}
// 等价于下面的函数
function createObject2(o) {
  function Fn() {}
  Fn.prototype = o
  var newObj = new Fn()
  return newObj
}
// 等价于下面的方法
Object.create(obj)

var info = createObject2(obj)

// 4.寄生式继承
var personObj = {
  running: function () {
    console.log("running")
  },
}

function createStudent(name) {
  var stu = Object.create(personObj) // 原型式继承
  stu.name = name
  stu.studying = function () {
    console.log("studying")
  }
  return stu
}

var stuObj = createStudent("wx")
var stuObj2 = createStudent("wxx")

// 5.寄生组合继承
function createObject(o) {
  function Fn() {}
  Fn.prototype = o
  return new Fn()
}

function inheritPrototype(SubType, SuperType) {
  // SubType.prototype = Object.create(SuperType.prototype)
  SubType.prototype = createObject(SuperType.prototype)

  Object.defineProperty(SubType.prototype, "constructor", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: SubType,
  })
  // 等同于
  // SuperType.prototype.constructor = SubType
}

function Person(name, age, friends) {
  this.name = name
  this.age = age
  this.friends = friends
}

Person.prototype.eating = function () {
  console.log("eating")
}

Person.prototype.running = function () {
  console.log("running")
}

function Student(name, age, friends, sno, score) {
  Person.call(this, name, age, friends)
  this.sno = sno
  this.score = score
}

inheritPrototype(Student, Person)

Student.prototype.studying = function () {
  console.log("studying")
}

var stu = new Student("wx", 20, ["kobe"], 111, 110)
console.log(stu)
stu.eating()
stu.running()
stu.studying()

// 类
// 类的定义
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
    this._address = "深圳市"
  }

  eating() {
    console.log(this.name + "eating")
  }

  running() {
    console.log(this.name + "running")
  }

  // 类的访问器方法
  get address() {
    return this._address
  }

  set address(value) {
    this._address = value
  }

  // 类的静态方法(类方法)
  // Person.createPerson()
  static createPerson() {}

  parentMethod() {
    console.log("父类处理逻辑1")
    console.log("父类处理逻辑2")
  }

  static staticMethod() {
    console.log("staticMethod")
  }
}

// 6.类的继承
class Student extends Person {
  constructor(name, age, sno) {
    // super的第一个用法
    super(name, age)
    this.sno = sno
  }

  studying() {
    console.log(this.name + "studying")
  }

  // 类对父类方法的重写
  running() {
    console.log(this.name + "running")
  }

  parentMethod() {
    // super的第二个用法
    super.parentMethod()

    console.log("子类处理逻辑3")
    console.log("子类处理逻辑4")
  }

  // 重写静态方法
  static staticMethod() {
    console.log("Student => staticMethod")
  }
}
