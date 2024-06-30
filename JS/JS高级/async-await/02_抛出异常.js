async function foo() {
  console.log("foo");
  throw new Error("err message");
  console.log("foo end");
}
// 抛出异常 则会走返回Promise的catch方法
const promise = foo();
promise
  .then((res) => {
    console.log("then", res); // 不执行
  })
  .catch((err) => {
    console.log("err =>", err); // 执行
  });
