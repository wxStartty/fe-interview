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
        console.log("resolve");
        queueMicrotask(() => {
          console.log("queueMicrotask => resolve");
          this.value = value;
          this.onFulfilled && this.onFulfilled(this.value);
        });
      }
    };

    const reject = (reason) => {
      if (this.status === PROMISE_PENDING) {
        this.status = PROMISE_REJECT;
        console.log("reject");
        queueMicrotask(() => {
          console.log("queueMicrotask => reject");
          this.reason = reason;
          console.log("this.reason", this.reason);
          this.onRejected && this.onRejected(this.reason);
        });
      }
    };

    executor(resolve, reject);
  }

  then(onFulfilled, onRejected) {
    this.onFulfilled = onFulfilled;
    this.onRejected = onRejected;
  }
}

const p = new MyPromise((resolve, reject) => {
  reject("reject");
  resolve("1111resolve");
});

p.then((res, reject) => {
  console.log("res", res);
  console.log("reject", reject);
});
