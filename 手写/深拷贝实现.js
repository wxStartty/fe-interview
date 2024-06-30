function isObject(value) {
  valueType = typeof value;
  return (
    valueType !== null && (valueType === "object" || valueType === "function")
  );
}

// v1 基本实现
// function deepCopy(originValue) {
//   if (!isObject(originValue)) return originValue;

//   const newObj = {};
//   for (const key in originValue) {
//     newObj[key] = deepCopy(originValue[key]);
//   }

//   return newObj;
// }

// v2 其他类型
// function deepCopy(originValue) {
//   // Set
//   if (originValue instanceof Set) {
//     // 只是浅拷贝
//     return new Set([...originValue]);
//   }
//   // Map
//   if (originValue instanceof Map) {
//     // 只是浅拷贝
//     return new Map([...originValue]);
//   }
//   // 判断如果是Symbol的value,那么创建一个新的Symbol,因为Symbol用处是标识唯一性的
//   if (typeof originValue === "symbol")
//     return Symbol(originValue.description);

//   // 判断如果是一个函数,则直接使用该函数
//   if (typeof originValue === "function") return originValue;

//   if (!isObject(originValue)) return originValue;

//   // 判断传入的对象是否是数组还是对象(处理数组类型)
//   const newObj = Array.isArray(originValue) ? [] : {};
//   for (const key in originValue) {
//     newObj[key] = deepCopy(originValue[key]);
//   }

//   // 对Symbol的key进行特殊处理，因为for...in遍历不到Symbol类型
//   const symbolKeys = Object.getOwnPropertySymbols(originValue);
//   for (const sKey of symbolKeys) {
//     newObj[sKey] = deepCopy(originValue[sKey]);
//   }

//   return newObj;
// }

// v3 循环引用
function deepCopy(originValue, map = new WeakMap()) {
  // Set
  if (originValue instanceof Set) {
    // 只是浅拷贝
    return new Set([...originValue]);
  }
  // Map
  if (originValue instanceof Map) {
    // 只是浅拷贝
    return new Map([...originValue]);
  }
  // 判断如果是Symbol的value,那么创建一个新的Symbol,因为Symbol用处是标识唯一性的
  if (typeof originValue === "symbol") return Symbol(originValue.description);

  // 判断如果是一个函数,则直接使用该函数
  if (typeof originValue === "function") return originValue;

  if (!isObject(originValue)) return originValue;

  if (map.has(originValue)) return map.get(originValue);

  // 判断传入的对象是否是数组还是对象(处理数组类型)
  const newObj = Array.isArray(originValue) ? [] : {};

  map.set(originValue, newObj);

  for (const key in originValue) {
    newObj[key] = deepCopy(originValue[key], map);
  }

  // 对Symbol的key进行特殊处理，因为for...in遍历不到Symbol类型
  const symbolKeys = Object.getOwnPropertySymbols(originValue);
  for (const sKey of symbolKeys) {
    newObj[sKey] = deepCopy(originValue[sKey], map);
  }

  // console.log("map", map);
  return newObj;
}

const s1 = Symbol("aaa");
const s2 = Symbol("bbb");

const obj = {
  name: "wx",
  age: 20,
  friends: {
    name: "www",
    address: {
      city: "南昌市",
    },
  },
  hobbies: ["aaa", "bbb", "ccc"],
  foo: function () {
    console.log("foo function");
  },
  // symbol
  [s1]: "s1",
  s2: s2,
  // set/map
  set: new Set(["aaa", "bbb", "ccc"]),
  map: new Map([
    ["aaa", "AAA"],
    ["bbb", "BBB"],
  ]),
};

obj.info = obj;

const newObj = deepCopy(obj);
console.log(newObj === obj); // false

// obj.friends.name = "xxx";
// obj.friends.address.city = "深圳";
// console.log(newObj);
// console.log(newObj.s1 === obj.s2);
console.log(obj.info.info.info);
