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
function watchFn(fn) {
  depend.addDepend(fn)
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
    return Reflect.get(target, key, receiver)
  },
  set(target, key, newValue, receiver) {
    Reflect.set(target, key, newValue, receiver)
    // depend.notify();
    const depend = getDepend(target, key)
    console.log(depend.reactiveFns) // []
    depend.notify()
  },
})

watchFn(function () {
  console.log(objProxy.name) // 监听不到，因为没有在get中实现依赖的收集（见04）
})

// 思路
// obj对象
// name: depend对象
// age: depend对象
// const objMap = new Map()
// objMap.set('name', 'nameDepend')
// objMap.set('age', 'ageDepend')

// const targetMap = new WeakMap()
// targetMap.set(obj, objMap)

// // obj.name
// const dependName = targetMap.get(obj).get('name')
// dependName.notify()
console.log("初始化执行分界线——————————————————————————")

objProxy.name = "www"
objProxy.name = "xxx"
objProxy.name = "yyy"
objProxy.age = 22

// console.log("objProxy.name", objProxy.name);
