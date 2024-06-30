// 柯里化
function foo(a, b, c, d) {
  return a + b + c + d
}
foo(1, 2, 3, 4)

function currying(a) {
  return function (b) {
    return function (c) {
      return function (d) {
        console.log(a + b + c + d)
      }
    }
  }
}
currying(1)(2)(3)(4)

// 柯里化函数的实现myCurring
function myCurring(fn) {
  function curried(...args) {
    // 判断当前已接收参数的个数，与函数本身需要接收参数的个数是否一致
    // 调用方式为currAdd(10, 20, 30)
    console.log("fn.length", fn.length)
    console.log("args.length", args.length)
    if (args.length >= fn.length) {
      // console.log("this", this)
      // fn(...args)
      // 保证该fn函数的this是调用该函数(currAdd)的this一致.
      // fn.call(this, ...args)
      return fn.apply(this, args)
      // 调用方式为currAdd(10)(20)(30)
    } else {
      // 没有达到个数时，需要返回一个新的函数，继续来接受参数
      function curried2(...arg2) {
        console.log("this", this)
        console.log("arg22222.length", arg2.length)
        // 接收到参数后，需要递归调用curried来检查函数的个数是否达到
        return curried.apply(this, [...args, ...arg2])
      }

      return curried2
    }
  }

  return curried
}

function add1(x, y, z) {
  console.log("x + y + z", x + y + z)
  return x + y + z
}

var currAdd = myCurring(add1)

// currAdd(10, 20, 30)
currAdd(10, 20)(30)
// currAdd(10)(20)(30);
