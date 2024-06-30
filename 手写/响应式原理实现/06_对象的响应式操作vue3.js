let activeReactiveFn = null;

class Depend {
  constructor() {
    this.reactiveFns = new Set();
  }

  depend() {
    if (activeReactiveFn) {
      this.reactiveFns.add(activeReactiveFn);
    }
  }

  notify() {
    this.reactiveFns.forEach((fn) => {
      fn();
    });
  }
}

const depend = new Depend();
// 封装一个响应式函数
function watchFn(fn) {
  console.log("fn", fn);
  activeReactiveFn = fn;
  fn();
  activeReactiveFn = null;
}

// 封装一个获取depend函数
let targetMap = new WeakMap();
function getDepend(target, key) {
  // 根据target对象获取map的过程
  let map = targetMap.get(target);
  if (!map) {
    map = new Map();
    targetMap.set(target, map);
  }

  // 根据key获取depend对象
  let depend = map.get(key);
  if (!depend) {
    depend = new Depend();
    console.log("depend", depend);
    map.set(key, depend);
  }
  return depend;
}

// 监听对象属性变化：Proxy(vue3)/Object.defineProperty
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      // 根据target[key]获取对应的depend
      const depend = getDepend(target, key);
      // 给depend对象添加响应函数
      // depend.addDepend(activeReactiveFn);
      depend.depend();
      return Reflect.get(target, key, receiver);
    },
    set(target, key, newValue, receiver) {
      Reflect.set(target, key, newValue, receiver);
      const depend = getDepend(target, key);
      depend.notify();
    },
  });
}

const obj = {
  name: "wx",
  age: 20,
};

const objProxy = reactive(obj);

watchFn(() => {
  console.log("objProxy.age", objProxy.age);
});

const info = reactive({
  address: "深圳市",
});

watchFn(() => {
  console.log("info.address", info.address);
});

console.log("初始化执行分界线——————————————————————————");

// objProxy.age = 100;
// objProxy.age = 200;
// info.address = "南昌市";
