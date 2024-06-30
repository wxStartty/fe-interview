async function foo() {
  console.log("foo");
  return 121212;
}
const promise = foo();
promise.then((res) => {
  console.log("then", res); // 1212121
});

// async执行流程
// async function bar() {
//   console.log("bar start");
//   console.log("bar ~~~~~~~");
//   console.log("bar end");
// }
// // 执行顺序同下
// function bar() {
//   console.log("bar start");
//   console.log("bar ~~~~~~~");
//   console.log("bar end");
// }
