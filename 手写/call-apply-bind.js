// 1.call实现
Function.prototype.myCall = function (thisArg, ...arg) {
  // 1.执行调用myCall的函数(解决的问题是：知道是哪个函数执行了myCall)
  var fn = this;
  // fn();

  // 2.对thisArg转成对象类型（防止传入的是非对象类型）
  // 对thisArg是null或者undefined情况做处理
  thisArg =
    thisArg !== null && thisArg !== undefined ? Object(thisArg) : window;
  // 2.绑定thisArg
  thisArg.fn = fn;
  // 3.把传递的参传给调用myCall的函数
  var result = thisArg.fn(...arg);
  delete thisArg.fn;

  // 4.将最终的结果返回
  return result;
};

// 2.apply实现
Function.prototype.myApply = function (thisArg, argArray = []) {
  // 1.执行调用myCall的函数(解决的问题是：知道是哪个函数执行了myCall)
  var fn = this;
  // fn();

  // 2.对thisArg转成对象类型（防止传入的是非对象类型）
  // 对thisArg是null或者undefined情况做处理
  thisArg =
    thisArg !== null && thisArg !== undefined ? Object(thisArg) : window;
  // 2.绑定thisArg
  thisArg.fn = fn;
  // 3.把传递的参传给调用myCall的函数
  var result = thisArg.fn(...argArray);
  delete thisArg.fn;

  // 4.将最终的结果返回
  return result;
};

// 3.bind实现
Function.prototype.maBind = function (thisArg, ...argArray) {
  // 1.获取到真实需要绑定的函数
  var fn = this;

  // 2.绑定this
  thisArg =
    thisArg !== null && thisArg !== undefined ? Object(thisArg) : window;

  function proxyFn(...args) {
    // 3.将函数放到thisArg中进行调用
    thisArg.fn = fn;
    // 特殊：对两个传入的参数进行合并
    var finalArgs = [...argArray, ...args];
    var result = thisArg.fn(...finalArgs);
    delete thisArg.fn;

    // 4.返回结果
    return result;
  }
  // bind会返回一个函数
  return proxyFn;
};
