// 组合函数
function double(num) {
  return num * 2;
}

function square(num) {
  return num ** 2;
}

function composeFn(m, n) {
  return function (count) {
    return n(m(count));
  };
}

var newFn = composeFn(double, square);
console.log(newFn(10)); // 400

// 通用组合函数的实现
function myCompose(...fns) {
  var length = fns.length;
  for (var i = 0; i < length; i++) {
    if (typeof fns[i] !== "function") {
      throw new TypeError("Expected arguments are functions");
    }
  }

  function compose(...args) {
    var index = 0;
    var result = length ? fns[index].apply(this, args) : args;
    while (++index < length) {
      result = fns[index].call(this, result);
    }
    return result;
  }
  return compose;
}

var newFn2 = myCompose(double, square);
console.log(newFn2(10)); // 400
