### async/await

#### 异步代码的处理方案

```js
function requestData(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(url);
    }, 1000);
  });
}

// 需求把url进行拼接
// 如：requestData('aaa') => 'aaa'
//    requestData('aaa' + 'bbb') => 'aaabbb'
//    requestData('aaabbb' + 'ccc') => 'aaabbbccc'
// requestData("aaa").then((res) => console.log("res", res)); // aaa

// 第一种方案: 多次回调(回调地狱)
// requestData("aaa").then((res1) => {
//   requestData(res1 + "bbb").then((res2) => {
//     requestData(res2 + "ccc").then((res3) => {
//       console.log("res3", res3);
//     });
//   });
// });

// 第二种方案：Promise的then方法的返回值
// requestData("aaa")
//   .then((res) => {
//     return requestData(res + "bbb");
//   })
//   .then((res) => {
//     return requestData(res + "ccc");
//   })
//   .then((res) => {
//     console.log("res", res);
//   });

// 第三种方案：Promise + generator
// function* getData() {
//   const res1 = yield requestData("aaa");
//   console.log("res1", res1);
//   const res2 = yield requestData(res1 + "bbb");
//   console.log("res2", res2);
//   const res3 = yield requestData(res2 + "ccc");
//   console.log("res3", res3);
// }

// const generator = getData();
// generator.next().value.then((res) => {
//   generator.next(res).value.then((res) => {
//     generator.next(res).value.then((res) => {
//       console.log(generator.next(res));
//     });
//   });
// });
// function execGenerator(getData) {
//   const generator = getData();
//   function execFn(res) {
//     const result = generator.next(res);
//     if (result.done) return result.value;
//     result.value.then((res) => {
//       execFn(res);
//     });
//   }
//   execFn();
// }

// execGenerator(getData);

// 第四种方案：第三方库co
// const co = require("co");
// co(getData);

// 第五种方案：async/await
async function getData() {
  const res1 = await requestData("aaa");
  console.log("res1", res1);
  const res2 = await requestData(res1 + "bbb");
  console.log("res2", res2);
  const res3 = await requestData(res2 + "ccc");
  console.log("res3", res3);
}
getData();
```

#### 异步函数 async function

- 返回值是一个Promise

  ```js
  async function foo() {
      console.log('foo')
      return 121212
  }
  const promise = foo()
  promise.then(res => {
      console.log('then', res) // 1212121
  })
  ```

- 异常

  ```js
  async function foo() {
    console.log("foo");
    throw new Error("err message");
    console.log("foo end");
  }
  const promise = foo();
  promise
    .then((res) => {
      console.log("then", res); // 不执行
    })
    .catch((err) => {
      console.log("err =>", err); // 执行
    });
  ```



### 进程和线程

操作系统中的两个概念：

- 进程(process)：计算机已经运行的程序，是操作系统管理程序的一种方式
- 线程(thread)：操作系统能够运行运算调度的最小单位，通常情况下它被包含在进程中

更具体的解释：

- 进程：启动一个应用程序，就会默认启动一个进程（也可能是多个进程）
- 线程：每一个进程中，都会启动至少一个线程用来执行程序中的代码，这个线程称为主线程

更形象的解释：

- 操作系统类似工厂
- 工厂中有很多车间，车间就是进程
- 每个车间有一个以上的工人在工作，工人就是线程