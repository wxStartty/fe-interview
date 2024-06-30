class Depend {
  constructor() {
    this.reactiveFns = []
  }

  addDepend(reactiveFn) {
    this.reactiveFns.push(reactiveFn)
  }

  notify() {
    this.reactiveFns.forEach((fn) => {
      fn()
    })
  }
}

const depend = new Depend()
// 封装一个响应式函数
let activeReactiveFn = null
function watchFn(fn) {
  activeReactiveFn = fn
  // depend.addDepend(fn);
  fn()
  activeReactiveFn = null
}

// 封装一个获取depend函数
let targetMap = new WeakMap()
function getDepend(target, key) {
  // 根据target对象获取map的过程
  let map = targetMap.get(target)
  if (!map) {
    map = new Map()
    targetMap.set(target, map)
  }

  // 根据key获取depend对象
  let depend = map.get(key)
  if (!depend) {
    depend = new Depend()
    map.set(key, depend)
  }
  return depend
}

const obj = {
  name: "wx",
  age: 20,
}

// 监听对象属性变化：Proxy(vue3)/Object.defineProperty
const objProxy = new Proxy(obj, {
  get(target, key, receiver) {
    console.log("get")
    // 根据target[key]获取对应的depend
    const depend = getDepend(target, key)
    // 给depend对象添加响应函数
    depend.addDepend(activeReactiveFn)
    return Reflect.get(target, key, receiver)
  },
  set(target, key, newValue, receiver) {
    console.log("set")
    Reflect.set(target, key, newValue, receiver)
    // depend.notify();
    const depend = getDepend(target, key)
    depend.notify()
  },
})

// watchFn(function () {
//   console.log(objProxy.name, "name第一次改变"); // www
// });
// watchFn(function () {
//   console.log(objProxy.name, "name第二次改变"); // www
// });
watchFn(function () {
  console.log(objProxy.age, "age第一次改变")
})

console.log("初始化执行分界线——————————————————————————")

objProxy.name = "www"
// objProxy.name = "xxxx";  不可再次对objProxy.name 赋值，不然报错 fn is not a function，既不可多次赋值
objProxy.age = 100
