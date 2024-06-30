/**
 * 解决问题:
 * （1）then方法的链式调用
 * （2）executor抛出错误时的处理
 */
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
    return new MyPromise((resolve, reject) => {
      if (this.status === PROMISE_FULFILLED && onFulfilled) {
        // onFulfilled(this.value);
        // try {
        //   const value = onFulfilled(this.value);
        //   resolve(value);
        // } catch (err) {
        //   reject(err);
        // }
        exeFnCatchErrorFn(onFulfilled, this.value, resolve, reject);
      }
      if (this.status === PROMISE_REJECT && onRejected) {
        // onRejected(this.reason);
        // try {
        //   const value = onRejected(this.reason);
        //   resolve(value);
        // } catch (error) {
        //   reject(err);
        // }
        exeFnCatchErrorFn(onRejected, this.reason, resolve, reject);
      }
      if (this.status === PROMISE_PENDING) {
        // this.onFulfilledFns.push(onFulfilled);
        // this.onRejectedFns.push(onRejected);
        this.onFulfilledFns.push(() => {
          // try {
          //   const value = onFulfilled(this.value);
          //   resolve(value);
          // } catch (err) {
          //   reject(err);
          // }
          exeFnCatchErrorFn(onFulfilled, this.value, resolve, reject);
        });
        this.onRejectedFns.push(() => {
          // try {
          //   const value = onRejected(this.reason);
          //   resolve(value);
          // } catch (error) {
          //   reject(err);
          // }
          exeFnCatchErrorFn(onRejected, this.reason, resolve, reject);
        });
      }
    });
  }
}

const p = new MyPromise((resolve, reject) => {
  console.log("状态pending");
  // throw new Error("executor抛出错误");
  resolve("1111");
  reject("2222");
});

// then方法的链式调用
p.then(
  (res) => {
    console.log("res1", res);
    return "res返回值";
    // throw new Error("res1抛出错误");
  },
  (err) => {
    console.log("err1", err);
    return "err返回值";
  }
).then(
  (res) => {
    console.log("res2", res);
  },
  (err) => {
    console.log("err2", err);
  }
);
