/**
 * 编写catch方法
 */
const PROMISE_PENDING = "pending"
const PROMISE_FULFILLED = "fulfilled"
const PROMISE_REJECT = "reject"

function exeFnCatchErrorFn(exeFn, val, resolve, reject) {
  try {
    const value = exeFn(val)
    resolve(value)
  } catch (err) {
    reject(err)
  }
}

class MyPromise {
  constructor(executor) {
    this.status = PROMISE_PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledFns = []
    this.onRejectedFns = []

    const resolve = (value) => {
      if (this.status === PROMISE_PENDING) {
        queueMicrotask(() => {
          if (this.status !== PROMISE_PENDING) return
          this.status = PROMISE_FULFILLED
          this.value = value
          this.onFulfilledFns &&
            this.onFulfilledFns.forEach((fn) => fn(this.value))
        })
      }
    }

    const reject = (reason) => {
      if (this.status === PROMISE_PENDING) {
        queueMicrotask(() => {
          if (this.status !== PROMISE_PENDING) return
          this.status = PROMISE_REJECT
          this.reason = reason
          this.onRejectedFns &&
            this.onRejectedFns.forEach((fn) => fn(this.reason))
        })
      }
    }
    // 处理executor抛出错误的情况
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {
    // 实现catch思路: 执行then方法，当then方法没有第二个参数时，让第二个参数等于抛出错误(throw err)
    onRejected =
      onRejected ||
      ((err) => {
        throw err
      })
    return new MyPromise((resolve, reject) => {
      if (this.status === PROMISE_FULFILLED && onFulfilled) {
        exeFnCatchErrorFn(onFulfilled, this.value, resolve, reject)
      }
      if (this.status === PROMISE_REJECT && onRejected) {
        exeFnCatchErrorFn(onRejected, this.reason, resolve, reject)
      }
      if (this.status === PROMISE_PENDING) {
        if (onFulfilled)
          this.onFulfilledFns.push(() => {
            exeFnCatchErrorFn(onFulfilled, this.value, resolve, reject)
          })
        if (onRejected)
          this.onRejectedFns.push(() => {
            exeFnCatchErrorFn(onRejected, this.reason, resolve, reject)
          })
      }
    })
  }

  catch(onRejected) {
    this.then(undefined, onRejected)
  }
}

const p = new MyPromise((resolve, reject) => {
  console.log("状态pending")
  // throw new Error("executor抛出错误");
  // resolve("1111");
  reject("2222")
})

// 实现catch思路: 执行then方法，当then方法没有第二个参数时，让第二个参数等于抛出错误(throw err)
p.then((res) => {
  console.log("res", res)
}).catch((err) => {
  console.log("err", err)
})
