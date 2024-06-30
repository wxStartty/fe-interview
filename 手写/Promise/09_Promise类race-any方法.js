/**
 * 编写类all-allSettled方法
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

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => reject(111), 3000);
});
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => reject(222), 2000);
});
const p3 = new Promise((resolve, reject) => {
  setTimeout(() => reject(333), 3000);
});
// 暂不考虑非Promise情况
// MyPromise.all([p1, p2, p3])
//   .then((res) => console.log("res", res))
//   .catch((err) => console.log("err", err));

// MyPromise.allSettled([p1, p2, p3]).then((res) => console.log("res", res));

// MyPromise.race([p1, p2, p3]).then(
//   (res) => console.log("res", res),
//   (err) => console.log("err", err)
// );

MyPromise.any([p1, p2, p3])
  .then(
    (res) => console.log("res", res)
    // (err) => console.log("err1", err)
  )
  .catch((err) => console.log("err2", err, err.errors));
