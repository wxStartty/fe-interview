function myNew(Con, ...args) {
  let obj = {};
  // 等价于 obj.__proto__ = Con.prototype
  Object.setPrototypeOf(obj, Con.prototype);
  let result = Con.apply(obj, args);
  return result instanceof Object ? result : obj;
}
