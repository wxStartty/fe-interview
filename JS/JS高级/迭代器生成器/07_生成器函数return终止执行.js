function* foo() {
  console.log("1", 1);
  const num = yield "aaa";
  console.log("2", 2);
  console.log("num", num); // 10

  // generator.return() 等价于 return
  // return 'return'
  const n = yield;
  console.log("3", 3);
  console.log("n", n);
  const m = yield;
  console.log("4", 4);
  console.log("m", m);
}

// 返回一个生成器
const generator = foo();

console.log(generator.next());
console.log(generator.next(10));
console.log(generator.return("return")); // { value: 'return', done: true }
// generator.return("return")之后的代码都不会执行
console.log(generator.next());
console.log(generator.next());
console.log(generator.next());
console.log(generator.next());
