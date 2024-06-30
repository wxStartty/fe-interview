const names = ["aaa", "bbb", "ccc"];

// 编写迭代器对象访问数组
let index = 0;
const namesIterator = {
  next: function () {
    if (index < names.length) {
      return { done: false, value: names[index++] };
    } else {
      return { done: true, value: undefined };
    }
  },
};

console.log(namesIterator.next());
console.log(namesIterator.next());
console.log(namesIterator.next());
console.log(namesIterator.next());
console.log(namesIterator.next());
