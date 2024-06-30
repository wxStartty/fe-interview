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

// 监听对象属性变化：Proxy(vue3)/Object.defineProperty
const objProxy = new Proxy(obj, {
  get(target, key, receiver) {
    return Reflect.get(target, key, receiver);
  },
  set(target, key, newValue, receiver) {
    Reflect.set(target, key, newValue, receiver);
    depend.notify();
  },
});

watchFn(function () {
  console.log(objProxy.name); // www
});
watchFn(function () {
  console.log(objProxy.age); // www
});

objProxy.name = "www";
objProxy.name = "xxx";
objProxy.name = "yyy";
objProxy.age = "2222";

// 问题：收集依赖不正确
