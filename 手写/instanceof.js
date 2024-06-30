function new_instance_of(left, right) {
  let rightProto = right.prototype; // 取右表达式的 prototype 值
  left = left.__proto__; // 取左表达式的__proto__值
  while (true) {
    if (left === null) {
      return false;
    }
    if (left === rightProto) {
      return true;
    }
    left = left.__proto__;
  }
}
