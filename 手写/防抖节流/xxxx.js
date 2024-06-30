// 防抖
// function debounce(fn, delay) {
//   let timer = null

//   const _debounce = function(...arg) {
//     if (timer) clearTimeout(timer)
//     timer = setTimeout(() => {
//       fn.call(this, arg)
//     }, delay)
//   }
//   return _debounce
// }

// debounce(fn, 200)

// 节流
function throttle(fn, delay) {
  let lastTime = 0;

  const _throttle = function (...arg) {
    let now = new Date().getTime();
    if (delay - (now - lastTime) <= 0) {
      fn.call(this, arg);
      lastTime = now;
    }
  };
  return _throttle;
}

const fn2 = throttle(fn, 200);
