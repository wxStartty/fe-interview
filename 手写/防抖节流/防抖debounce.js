// v1基本实现
// function debounce(fn, delay) {
//   // 保存上一次的定时器
//   let timer = null;
//   return function () {
//     // 清除上一次的定时器
//     if (timer) clearInterval(timer);
//     timer = setTimeout(() => {
//       fn();
//     }, delay);
//   };
// }

// v2 this 参数
// function debounce(fn, delay) {
//   // 保存上一次的定时器
//   let timer = null;
//   return function (...args) {
//     // 清除上一次的定时器
//     if (timer) clearInterval(timer);
//     timer = setTimeout(() => {
//       fn.call(this, ...args);
//     }, delay);
//   };
// }

// v3 立即执行
// function debounce(fn, delay, immediate = false) {
//   // 保存上一次的定时器
//   let timer = null;
//   let isInvoke = false;
//   const _debounce = function (...args) {
//     // 清除上一次的定时器
//     if (timer) clearInterval(timer);
//     if (immediate && !isInvoke) {
//       fn.call(this, args);
//       isInvoke = true;
//     } else {
//       timer = setTimeout(() => {
//         fn.call(this, args);
//         isInvoke = false;
//         timer = null;
//       }, delay);
//     }
//   };

//   return _debounce;
// }

// v4封装取消功能
// function debounce(fn, delay, immediate = false) {
//   // 保存上一次的定时器
//   let timer = null;
//   let isInvoke = false;
//   const _debounce = function (...args) {
//     // 清除上一次的定时器
//     if (timer) clearInterval(timer);
//     if (immediate && !isInvoke) {
//       fn.call(this, args);
//       isInvoke = true;
//     } else {
//       timer = setTimeout(() => {
//         fn.call(this, args);
//         isInvoke = false;
//         timer = null;
//       }, delay);
//     }
//   };

//   _debounce.cancel = function () {
//     if (timer) clearInterval(timer);
//     timer = null;
//     isInvoke = false;
//   };

//   return _debounce;
// }

// v5函数返回值
// 1.resultCallBack
// 2.在_debounce中的代码写在返回一个Promise中
function debounce(fn, delay, immediate = false, resultCallBack) {
  // 保存上一次的定时器
  let timer = null;
  let isInvoke = false;
  const _debounce = function (...args) {
    // 清除上一次的定时器
    if (timer) clearInterval(timer);
    if (immediate && !isInvoke) {
      const result = fn.call(this, args);
      if (resultCallBack) resultCallBack(result);
      isInvoke = true;
    } else {
      timer = setTimeout(() => {
        const result = fn.call(this, args);
        if (resultCallBack) resultCallBack(result);
        isInvoke = false;
        timer = null;
      }, delay);
    }
  };

  _debounce.cancel = function () {
    if (timer) clearInterval(timer);
    timer = null;
    isInvoke = false;
  };

  return _debounce;
}
