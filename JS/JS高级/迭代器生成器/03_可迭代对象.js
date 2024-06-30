// 创建一个可迭代对象
const iteratorObj = {
  names: ["aaa", "bbb", "ccc"],
  [Symbol.iterator]: function () {
    let index = 0;
    return {
      next: () => {
        if (index < this.names.length) {
          return { done: false, value: this.names[index++] };
        } else {
          return { done: true, value: undefined };
        }
      },
    };
  },
};

const iterator = iteratorObj[Symbol.iterator]();
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());

// 另一个可迭代对象
const iterator2 = iteratorObj[Symbol.iterator]();
console.log(iterator2.next());
console.log(iterator2.next());
console.log(iterator2.next());
console.log(iterator2.next());

// for...of只可以遍历可迭代对象，是上面iterator.next()调用方式的语法糖
// 普通对象是不可以使用for...of进行遍历的，可可迭代对象可以
for (const item of iteratorObj) {
  console.log("item", item);
}
