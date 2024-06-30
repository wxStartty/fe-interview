/**
 * 解决两个问题
 * （1）then方法的多次调用
 * （2）在确定Promise状态后，再次调用then
 */
const PROMISE_PENDING = "pending";
const PROMISE_FULFILLED = "fulfilled";
const PROMISE_REJECT = "reject";

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
          console.log("queueMicrotask");
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

    executor(resolve, reject);
  }

  then(onFulfilled, onRejected) {
    // this.onFulfilled = onFulfilled;
    // this.onRejected = onRejected;
    // 处理确定Promise状态后，再次调用then的问题
    if (this.status === PROMISE_FULFILLED && onFulfilled) {
      onFulfilled(this.value);
    }
    if (this.status === PROMISE_REJECT && onRejected) {
      onRejected(this.reason);
    }
    if (this.status === PROMISE_PENDING) {
      this.onFulfilledFns.push(onFulfilled);
      this.onRejectedFns.push(onRejected);
    }
  }
}

const p = new MyPromise((resolve, reject) => {
  console.log("状态pending");
  resolve("1111");
  reject("err 1111");
});

// then方法多次调用
p.then(
  (res) => {
    console.log("res1", res);
  },
  (err) => {
    console.log("err1", err);
  }
);

p.then(
  (res) => {
    console.log("res2", res);
  },
  (err) => {
    console.log("err2", err);
  }
);

// 处理确定Promise状态后，再次调用then的问题
setTimeout(() => {
  p.then(
    (res) => {
      console.log("setTimeout => res", res);
    },
    (err) => {
      console.log("setTimeout => err", err);
    }
  );
}, 1000);
