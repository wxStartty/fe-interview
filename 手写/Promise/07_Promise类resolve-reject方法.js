/**
 * 编写类resolve-reject方法
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
}

MyPromise.resolve("resolve").then((res) => {
  console.log("res", res);
});
MyPromise.reject("reject").catch((err) => {
  console.log("err", err);
});
