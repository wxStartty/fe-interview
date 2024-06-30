class Depend {
  constructor() {
    this.reactiveFns = [];
  }

  addDepend(reactiveFn) {
    this.reactiveFns.push(reactiveFn);
  }

  notify() {
    this.reactiveFns.forEach((fn) => {
      fn();
    });
  }
}

// 封装一个响应式函数
const depend = new Depend();
function watchFn(fn) {
  depend.addDepend(fn);
}

const obj = {
  name: "wx",
  age: 20,
};

watchFn(function () {
  console.log(obj.name); // www
});

obj.name = "www";
depend.notify();
