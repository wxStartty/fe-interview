// v1 基本实现
function throttle(fn, interval) {
  let lastTime = 0;

  const _throttle = function () {
    console.log("lastTime", lastTime);
    const nowTime = new Date().getTime();
    const remainTime = interval - (nowTime - lastTime);
    if (remainTime <= 0) {
      fn();
      lastTime = nowTime;
    }
  };

  return _throttle;
}

// v2 leading的实现
// leading 为true时，第一次会触发，为false则不会触发
// function throttle(fn, interval, options = { leading: false, trailing: false }) {
//   const { leading, trailing } = options;
//   // 记录上次的开始时间
//   let lastTime = 0;
//   const _throttle = function () {
//     const nowTime = new Date().getTime();
//     if (!lastTime && !leading) lastTime = nowTime;
//     const remainTime = interval - (nowTime - lastTime);
//     if (remainTime <= 0) {
//       fn();
//       lastTime = nowTime;
//     }
//   };

//   return _throttle;
// }

// v3 trailing(最难)
// trailing 为true时，时间间隔达到interval会触发(尾部触发)，为false则不会触发
// function throttle(fn, interval, options = { leading: false, trailing: false }) {
//   const { leading, trailing } = options;
//   // 记录上次的开始时间
//   let lastTime = 0;
//   let timer = null;

//   const _throttle = function () {
//     const nowTime = new Date().getTime();
//     if (!lastTime && !leading) lastTime = nowTime;

//     const remainTime = interval - (nowTime - lastTime);
//     if (remainTime <= 0) {
//       if (timer) {
//         clearTimeout(timer);
//         timer = null;
//       }

//       fn();
//       lastTime = nowTime;
//       return;
//     }

//     if (trailing && !timer) {
//       timer = setTimeout(() => {
//         fn();
//         timer = null;
//         lastTime = !leading ? 0 : new Date().getTime();
//       }, remainTime);
//     }
//   };

//   return _throttle;
// }

// v4 this和参数
// function throttle(fn, interval, options = { leading: false, trailing: false }) {
//   const { leading, trailing } = options;
//   // 记录上次的开始时间
//   let lastTime = 0;
//   let timer = null;

//   const _throttle = function (...args) {
//     const nowTime = new Date().getTime();
//     if (!lastTime && !leading) lastTime = nowTime;

//     const remainTime = interval - (nowTime - lastTime);
//     if (remainTime <= 0) {
//       if (timer) {
//         clearTimeout(timer);
//         timer = null;
//       }

//       fn.apply(this, args);
//       lastTime = nowTime;
//       return;
//     }

//     if (trailing && !timer) {
//       timer = setTimeout(() => {
//         fn.apply(this, args);
//         timer = null;
//         lastTime = !leading ? 0 : new Date().getTime();
//       }, remainTime);
//     }
//   };

//   return _throttle;
// }

// v5 取消功能
// function throttle(fn, interval, options = { leading: false, trailing: false }) {
//   const { leading, trailing } = options;
//   // 记录上次的开始时间
//   let lastTime = 0;
//   let timer = null;

//   const _throttle = function (...args) {
//     const nowTime = new Date().getTime();
//     if (!lastTime && !leading) lastTime = nowTime;

//     const remainTime = interval - (nowTime - lastTime);
//     if (remainTime <= 0) {
//       if (timer) {
//         clearTimeout(timer);
//         timer = null;
//       }

//       fn.apply(this, args);
//       lastTime = nowTime;
//       return;
//     }

//     if (trailing && !timer) {
//       timer = setTimeout(() => {
//         fn.apply(this, args);
//         timer = null;
//         lastTime = !leading ? 0 : new Date().getTime();
//       }, remainTime);
//     }
//   };

//   _throttle.cancel = function () {
//     if (timer) clearTimeout(timer);
//     timer = null;
//     lastTime = 0;
//   };

//   return _throttle;
// }

// v6 函数返回值
// 1.resultCallBack
// 2.在_throttle中的代码写在返回一个Promise中
// function throttle(fn, interval, options = { leading: false, trailing: false }) {
//   const { leading, trailing, resultCallBack } = options;
//   // 记录上次的开始时间
//   let lastTime = 0;
//   let timer = null;

//   const _throttle = function (...args) {
//     const nowTime = new Date().getTime();
//     if (!lastTime && !leading) lastTime = nowTime;

//     const remainTime = interval - (nowTime - lastTime);
//     if (remainTime <= 0) {
//       if (timer) {
//         clearTimeout(timer);
//         timer = null;
//       }

//       const result = fn.apply(this, args);
//       if (resultCallBack) resultCallBack(result);
//       lastTime = nowTime;
//       return;
//     }

//     if (trailing && !timer) {
//       timer = setTimeout(() => {
//         const result = fn.apply(this, args);
//         if (resultCallBack) resultCallBack(result);
//         timer = null;
//         lastTime = !leading ? 0 : new Date().getTime();
//       }, remainTime);
//     }
//   };

//   _throttle.cancel = function () {
//     if (timer) clearTimeout(timer);
//     timer = null;
//     lastTime = 0;
//   };

//   return _throttle;
// }
