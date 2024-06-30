function* foo() {
  console.log("1", 1);
  // generator.throw() 等价于 return
  // return 'return'
  try {
    yield;
  } catch (err) {
    console.log("err", err);
  }
  console.log("2", 2);
  yield;
  console.log("3", 3);
  yield;
  console.log("4", 4);
}

// 返回一个生成器
const generator = foo();

console.log(generator.next());
console.log(generator.throw("err message"));
