function* foo() {
  console.log("1", 1);
  const num = yield "aaa";
  console.log("2", 2);
  console.log("num", num); // 10
  const n = yield;
  console.log("3", 3);
  console.log("n", n);
  const m = yield;
  console.log("4", 4);
  console.log("m", m);
}

// 返回一个生成器
const generator = foo();

generator.next();
// 第一个yield的返回值是第二个next调用参入的参数
generator.next(10);
// 同理
generator.next(20);
generator.next(30);
