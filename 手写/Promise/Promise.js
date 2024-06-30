// Promise
// 传入的函数称之为executor
// const promise = new Promise((resolve, reject) => {
//   console.log("promise传入的函数被执行了");
//   resolve();
// });

// 一、resolve的参数

// - 普通值或者对象
// - 可以传Promise
//   resolve(new Promise(resolve, reject) => {})
//   那么当前的Promise的状态会由传入的Promise决定。
// - 传入一个对象，并且这个对象有实现then()方法，那么会执行该then()方法，并且由该then方法决定后续状态

// 二、Promise方法
// 1.then
// 1> 同一个Promise可以被多次调用then方法，当resolve方法被调用时，所有的then方法传入的回调函数都会被调用
// 2> then方法传入的回调函数可以有返回值，返回值是Promise
//    1> 如果返回的是普通值(数字、字符串、普通对象、undefined)，那么这个值作为新Promise的resolve值
// promise
//   .then((res) => {
//     return "aaaa";
//   })
//   .then((res) => {
//     console.log("res", res); // aaaa
//   });

//    2> 如果返回的是Promise
// promise
//   .then((res) => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         resolve(111111);
//       }, 3000);
//     });
//   })
//   .then((res) => {
//     console.log("res =>", res); // 111111
//   });

//    3> 如果返回的是一个对象，并且该对象实现了thenable
// promise
//   .then((res) => {
//     return {
//       then: function (resolve, reject) {
//         resolve(222222);
//       },
//     };
//   })
//   .then((res) => {
//     console.log("res22 =>", res); // 222222
//   });

// 2.catch
//   1> 不只是reject会调用错误捕获的回调，当executor抛出错误时，也会调用错误捕获(catch)的回调的
// const promise2 = new Promise((resolve, reject) => {
//   // throw new Error("reject message");
//   reject("reject message");
// });

// 方式1
// promise2.then(
//   (res) => {
//     console.log(res);
//   },
//   (err) => {
//     console.log("err", err); // 抛出错误
//   }
// );

// 方式2 一般不这样使用
// promise2.catch((err) => {
//   console.log("err", err);
// });

// 2.catch方法返回值(与then相同)
// promise2
//   .then((res) => {
//     console.log("then", res);
//   })
//   .catch((err) => {
//     console.log("err =>", err);
//     return "reject";
//   })
//   .then((res) => {
//     console.log("catch => res", res); // reject
//   });

// finally

// 三、Promise类方法
// 1.Promise.resolve()  把对象转成Promise
// const objPromise = Promise.resolve({ name: "wx" });
// console.log("objPromise", objPromise); // Promise { { name: 'wx' } }

// objPromise.then((res) => {
//   console.log("objPromise", res); // { name: 'wx' }
// });

// const promise3 = Promise.resolve("resolve message");
// // 相当于
// const promise33 = new Promise((resolve, reject) => {
//   resolve("resolve message");
// });

// 2.Promise.reject()
// const promise4 = Promise.reject("reject message");
// // 相当于
// const promise44 = new Promise((resolve, reject) => {
//   reject("reject message");
// });

// promise4.catch((err) => console.log("promise4 => err", err));
// promise44.catch((err) => console.log("promise44 => err", err));

// 3.Promise.all(): 所有的Promise都变成了fulfilled时在拿到结果

// 4.Promise.allSettled()
const p1 = new Promise((resolve, reject) => resolve(11));
const p2 = new Promise((resolve, reject) => reject(22));
const p3 = new Promise((resolve, reject) => reject(33));
Promise.allSettled([p1, p2, p3, "aaa"]).then((res) => {
  console.log("allSettled => res", res);
  // allSettled => res [
  //   { status: 'fulfilled', value: 11 },
  //   { status: 'rejected', reason: 22 },
  //   { status: 'rejected', reason: 33 },
  //   { status: 'fulfilled', value: 'aaa' }
  // ]
});

// 5.Promise.race()
// 只要有一个Promise变成fulfilled的，则结束执行

// 6.Promise.any()
// 只有当某个Promise变成fulfilled时才会resolve(), 否则都是reject()
