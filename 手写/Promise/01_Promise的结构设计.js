const PROMISE_PENDING = "pending";
const PROMISE_FULFILLED = "fulfilled";
const PROMISE_REJECT = "reject";

class MyPromise {
  constructor(executor) {
    this.status = PROMISE_PENDING;
    this.value = undefined;
    this.reason = undefined;

    const resolve = (value) => {
      if (this.status === PROMISE_PENDING) {
        this.status = PROMISE_FULFILLED;
        this.value = value;
        console.log("resolve");
      }
    };

    const reject = (reason) => {
      if (this.status === PROMISE_PENDING) {
        this.status = PROMISE_REJECT;
        this.reason = reason;
        console.log("reject");
      }
    };

    executor(resolve, reject);
  }
}

const p = new MyPromise((resolve, reject) => {
  reject();
  resolve();
});
