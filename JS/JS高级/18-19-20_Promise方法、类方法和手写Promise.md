## Promise

###resolve的参数

- 普通值或者对象

- 可以传Promise

  resolve(new Promise(resolve, reject) => {})

- 那么当前的Promise的状态会由传入的Promise决定。

- 传入一个对象，并且这个对象有实现then()方法，那么会执行该then()方法，并且由该then方法决定后续状态



### Prmise对象方法

- then

  1. 同一个Promise可以被多次调用then方法，当resolve方法被调用时，所有的then方法传入的回调函数都会被调用

  2. then方法传入的回调函数可以有返回值，返回值是Promise

     ```js
     promise
     
      .then((res) => {
     
       return new Promise((resolve, reject) => {
     
        setTimeout(() => {
     
         resolve(111111);
     
        }, 3000);
     
       });
     
      })
     
      .then((res) => {
     
       console.log("res =>", res); // 111111
     
      });
     
     ```

     

  3. 如果返回的是一个对象，并且该对象实现了thenable

     ```js
     promise
     
      .then((res) => {
     
       return {
     
        then: function (resolve, reject) {
     
         resolve(222222);
     
        },
     
       };
     
      })
     
      .then((res) => {
     
       console.log("res22 =>", res); // 222222
     
      });
     
     ```
     
     

- catch

  1. 不只是reject会调用错误捕获的回调，当executor抛出错误时，也会调用错误捕获(catch)的回调的

     ```js
     const promise2 = new Promise((resolve, reject) => {
     
      throw new Error("reject message");
     
     });
     
     promise2.then(
     
      (res) => {
     
       console.log(res);
     
      },
     
      (err) => {
     
       console.log("err", err); // 抛出错误
     
      }
     
     );
     
     ```

     

  2. catch方法返回值(与then相同)

     ```js
     promise2
     
      .then((res) => {
     
       console.log("then", res);
     
      })
     
      .catch((err) => {
     
       console.log("err =>", err);
     
       return "reject";
     
      })
     
      .then((res) => {
     
       console.log("catch => res", res); // reject
     
      });
     
     ```
     
     

- finally

  - 表示无论Promise对象变成fulfilled还是reject状态，最终都会被执行的代码。
  - 没有参数



### Promise类方法

1. Promise.resolve()

   - 把对象转成Promise

     ```js
     const objPromise = Promise.resolve({ name: "wx" });
     
     console.log("objPromise", objPromise);  // Promise { { name: 'wx' } }
     
     const promise3 = Promise.resolve("resolve message");
     
     // 相当于
     
     const promise33 = new Promise((resolve, reject) => {
     
      resolve("resolve message");
     
     });
     
     ```
     
     

2. Promise.reject()

   ```js
   const promise4 = Promise.reject("reject message");
   
   // 相当于
   
   const promise44 = new Promise((resolve, reject) => {
   
    reject("reject message");
   
   });
   
   promise4.catch((err) => console.log("promise4 => err", err));
   
   promise44.catch((err) => console.log("promise44 => err", err));
   
   ```

   

3. Promise.all(): 所有的Promise都变成了fulfilled时再拿到结果

4. Promise.allSettled()

   ```js
   const p1 = new Promise((resolve, reject) => resolve(11));
   
   const p2 = new Promise((resolve, reject) => reject(22));
   
   const p3 = new Promise((resolve, reject) => reject(33));
   
   Promise.allSettled([p1, p2, p3, "aaa"]).then((res) => {
   
    console.log("allSettled => res", res);
   
    // allSettled => res [
   
    //  { status: 'fulfilled', value: 11 },
   
    //  { status: 'rejected', reason: 22 },
   
    //  { status: 'rejected', reason: 33 },
   
    //  { status: 'fulfilled', value: 'aaa' }
   
    // ]
   
   });
   
   ```

   

5. Promise.race(): 只要有一个Promise变成fulfilled的，则结束执行

6. Promise.any(): 只有当某个Promise变成fulfilled时才会resolve(), 否则都是reject()



### 手写Promise

```js
const PROMISE_PENDING = "pending";
const PROMISE_FULFILLED = "fulfilled";
const PROMISE_REJECT = "reject";

function exeFnCatchErrorFn(exeFn, val, resolve, reject) {
  try {
    const value = exeFn(val);
    resolve(value);
  } catch (err) {
    reject(err);
  }
}

class MyPromise {
  constructor(executor) {
    this.status = PROMISE_PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledFns = [];
    this.onRejectedFns = [];

    const resolve = (value) => {
      if (this.status === PROMISE_PENDING) {
        queueMicrotask(() => {
          if (this.status !== PROMISE_PENDING) return;
          this.status = PROMISE_FULFILLED;
          this.value = value;
          this.onFulfilledFns &&
            this.onFulfilledFns.forEach((fn) => fn(this.value));
        });
      }
    };

    const reject = (reason) => {
      if (this.status === PROMISE_PENDING) {
        queueMicrotask(() => {
          if (this.status !== PROMISE_PENDING) return;
          this.status = PROMISE_REJECT;
          this.reason = reason;
          this.onRejectedFns &&
            this.onRejectedFns.forEach((fn) => fn(this.reason));
        });
      }
    };
    // 处理executor抛出错误的情况
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    const defaultOnRejected = (err) => {
      throw err;
    };
    onRejected = onRejected || defaultOnRejected;
    // 处理执行catch方法第一个参数为undefined时，执行finally方法没有返回值的问题
    const defaultOnFulfilled = (value) => value;
    onFulfilled = onFulfilled || defaultOnFulfilled;

    return new MyPromise((resolve, reject) => {
      if (this.status === PROMISE_FULFILLED && onFulfilled) {
        exeFnCatchErrorFn(onFulfilled, this.value, resolve, reject);
      }
      if (this.status === PROMISE_REJECT && onRejected) {
        exeFnCatchErrorFn(onRejected, this.reason, resolve, reject);
      }
      if (this.status === PROMISE_PENDING) {
        if (onFulfilled)
          this.onFulfilledFns.push(() => {
            exeFnCatchErrorFn(onFulfilled, this.value, resolve, reject);
          });
        if (onRejected)
          this.onRejectedFns.push(() => {
            exeFnCatchErrorFn(onRejected, this.reason, resolve, reject);
          });
      }
    });
  }

  catch(onRejected) {
    // 需要添加return
    return this.then(undefined, onRejected);
  }

  finally(onFinally) {
    this.then(
      () => onFinally(),
      () => onFinally()
    );
  }

  static resolve(value) {
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason));
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const value = [];
      promises.forEach((promise) => {
        promise.then(
          (res) => {
            value.push(res);
            if (value.length === promises.length) resolve(value);
          },
          (err) => reject(err)
        );
      });
    });
  }

  static allSettled(promises) {
    return new MyPromise((resolve) => {
      const value = [];
      promises.forEach((promise) => {
        promise.then(
          (res) => {
            value.push({ status: PROMISE_FULFILLED, value: res });
            if (value.length === promises.length) resolve(value);
          },
          (err) => {
            value.push({ status: PROMISE_REJECT, value: err });
            if (value.length === promises.length) resolve(value);
          }
        );
      });
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach((promise) => {
        promise.then(resolve, reject);
      });
    });
  }

  static any(promises) {
    return new MyPromise((resolve, reject) => {
      const reason = [];
      promises.forEach((promise) => {
        promise.then(
          (res) => resolve(res),
          (err) => {
            reason.push(err);
            if (reason.length === promises.length)
              reject(new AggregateError(reason)); // AggregateError node暂不支持
          }
        );
      });
    });
  }
}
```



