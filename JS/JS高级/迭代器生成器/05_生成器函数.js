function* foo() {
  console.log("1", 1);
  // generator.next()中的value需要返回值时，需要在yield后写
  yield "aaa";
  console.log("2", 2);
  // 当遇到return时，生成器就体内告知执行
  // 如果提前return，generator.next()的返回值中的done在该位置之后都为true
  return "bbb";
  yield;
  console.log("3", 3);
  yield;
  console.log("4", 4);
}

// 返回一个生成器
const generator = foo();
// generator.next(); // 1
// generator.next(); // 2
// generator.next(); // 3
// generator.next(); // 4

// generator.next() 有返回值
console.log("返回值1", generator.next()); // { value: 'aaa', done: false }
console.log("返回值2", generator.next()); // { value: 'bbb', done: true }
console.log("返回值3", generator.next()); // { value: undefined, done: true }
console.log("返回值4", generator.next()); // { value: undefined, done: true }
