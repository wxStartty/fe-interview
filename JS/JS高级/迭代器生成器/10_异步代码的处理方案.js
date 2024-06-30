function requestData(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(url);
    }, 1000);
  });
}

// 需求把url进行拼接
// 如：requestData('aaa') => 'aaa'
//    requestData('aaa' + 'bbb') => 'aaabbb'
//    requestData('aaabbb' + 'ccc') => 'aaabbbccc'
// requestData("aaa").then((res) => console.log("res", res)); // aaa

// 第一种方案: 多次回调(回调地狱)
// requestData("aaa").then((res1) => {
//   requestData(res1 + "bbb").then((res2) => {
//     requestData(res2 + "ccc").then((res3) => {
//       console.log("res3", res3);
//     });
//   });
// });

// 第二种方案：Promise的then方法的返回值
// requestData("aaa")
//   .then((res) => {
//     return requestData(res + "bbb");
//   })
//   .then((res) => {
//     return requestData(res + "ccc");
//   })
//   .then((res) => {
//     console.log("res", res);
//   });

// 第三种方案：Promise + generator
// function* getData() {
//   const res1 = yield requestData("aaa");
//   console.log("res1", res1);
//   const res2 = yield requestData(res1 + "bbb");
//   console.log("res2", res2);
//   const res3 = yield requestData(res2 + "ccc");
//   console.log("res3", res3);
// }

// const generator = getData();
// generator.next().value.then((res) => {
//   generator.next(res).value.then((res) => {
//     generator.next(res).value.then((res) => {
//       console.log(generator.next(res));
//     });
//   });
// });
// function execGenerator(getData) {
//   const generator = getData();
//   function execFn(res) {
//     const result = generator.next(res);
//     if (result.done) return result.value;
//     result.value.then((res) => {
//       execFn(res);
//     });
//   }
//   execFn();
// }

// execGenerator(getData);

// 第四种方案：第三方库co
// const co = require("co");
// co(getData);

// 第五种方案：async/await
async function getData() {
  const res1 = await requestData("aaa");
  console.log("res1", res1);
  const res2 = await requestData(res1 + "bbb");
  console.log("res2", res2);
  const res3 = await requestData(res2 + "ccc");
  console.log("res3", res3);
}
getData();
