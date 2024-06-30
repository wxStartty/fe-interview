// Object.defineProperty()
// let obj = {
//   name: "wx",
//   age: 20,
// };

// Object.keys(obj).forEach((key) => {
//   let val = obj[key];
//   Object.defineProperty(obj, key, {
//     get() {
//       console.log(`监听到${key}值的获取`);
//       return val;
//     },
//     set(newVal) {
//       console.log(`监听到${key}值的设置`);
//       val = newVal;
//     },
//   });
// });

// obj.name = "kobe";
// obj.age = 30;
// console.log(obj.name, obj.age);

// // Proxy
// let obj2 = {
//   name: "wx",
//   age: 20,
// };

// // 1.创建代理对象
// const proxyObj = new Proxy(obj2, {
//   // 获取值时的捕获器
//   get: function (target, key) {
//     console.log(`监听到对象的${key}属性被访问了`, target);
//     return target[key];
//   },
//   // 设置值时的捕获器
//   set: function (target, key, newVal) {
//     console.log(`监听到${key}属性被设置了`, target);
//     target[key] = newVal;
//   },
//   // 监听in的捕获器
//   has: function (target, key) {
//     console.log(`监听到对象的${key}属性in操作`, target);
//     return key in target;
//   },
//   // 监听delete的捕获器
//   deleteProperty: function (target, key) {
//     console.log(`监听到对象的${key}属性delete操作`, target);
//     delete target[key];
//   },
// });

// console.log(proxyObj.name);
// console.log(proxyObj.age);

// proxyObj.name = "www";
// proxyObj.age = 30;

// // in操作符
// console.log("name" in proxyObj);

// // delete操作
// delete proxyObj.age;

// // receiver参数的作用
// const obj3 = {
//   _name: "wx",
//   get name() {
//     return this._name;
//   },
//   set name(newValue) {
//     this._name = newValue;
//   },
// };

// const objProxy = new Proxy(obj3, {
//   get: function (target, key, receiver) {
//     // receiver 是创建出来的代理对象
//     console.log("get被访问了~~~~~~", key, receiver);
//     console.log(receiver === objProxy);
//     // 使得obj2中的get name()中的this是代理对象objProxy
//     return Reflect.get(target, key, receiver);
//   },
//   set: function (target, key, newValue, receiver) {
//     console.log("set被访问了~~~~~~~~~~~", key);
//     Reflect.set(target, key, newValue, receiver);
//   },
// });

// console.log(objProxy.name); // 执行两次
// objProxy.name = "xxx"; // 执行两次

// Reflect中construct作用
function Student(name, age) {
  this.name = name;
  this.age = age;
}

function Teacher() {}

const stu = new Student("wx", 18);
console.log(stu);
console.log(stu.__proto__ === Student.prototype);

// 执行Student函数中的内容，但是创建出来的对是Teacher类型
const teacher = Reflect.construct(Student, ["wx", 18], Teacher);
console.log(teacher);
console.log(teacher.__proto__ === Teacher.prototype);
