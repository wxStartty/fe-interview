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
    map.set(key, depend);
  }
  return depend;
}

// 监听对象属性变化：Proxy(vue3)/Object.defineProperty
function reactive(obj) {
  Object.keys(obj).forEach((key) => {
    let value = obj[key];
    Object.defineProperty(obj, key, {
      get() {
        const depend = getDepend(obj, key);
        depend.depend();
        return value;
      },
      set(newValue) {
        value = newValue;
        const depend = getDepend(obj, key);
        depend.notify();
      },
    });
  });
  return obj;
}

const obj = {
  name: "wx",
  age: 20,
};

const obj2 = reactive(obj);

watchFn(() => {
  console.log("obj2.age", obj2.age);
});

const info = reactive({
  address: "深圳市",
});

watchFn(() => {
  console.log("info.address", info.address);
});

console.log("初始化执行分界线——————————————————————————");

obj2.age = 100;
info.address = "南昌市";
