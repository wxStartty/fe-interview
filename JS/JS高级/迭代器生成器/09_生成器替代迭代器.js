// 把迭代器改成生成器
function* createArrayIterator(arr) {
  // 第一种写法
  // let index = 0;
  // yield arr[index++];
  // yield arr[index++];
  // yield arr[index++];

  // 第二种写法
  // for (const item of arr) {
  //   yield item;
  // }

  // 第三种写法
  // yield* 后面需要跟着可迭代对象
  yield* arr;
}

// const names = ["aaa", "bbb", "ccc"];
// const namesIterator = createArrayIterator(names);
// console.log(namesIterator.next());
// console.log(namesIterator.next());
// console.log(namesIterator.next());
// console.log(namesIterator.next());

// 创建一个函数，这个函数可以迭代一个范围内的数字
// function* createRangeIterator(start, end) {
//   let index = start;
//   // return {
//   //   next: function () {
//   //     if (index < end) {
//   //       return { done: false, value: index++ };
//   //     } else {
//   //       return { done: true, value: undefined };
//   //     }
//   //   },
//   // };
//   while (index < end) {
//     {
//       yield index++;
//     }
//   }
// }

// const rangeIterator = createRangeIterator(10, 20);
// console.log(rangeIterator.next());
// console.log(rangeIterator.next());
// console.log(rangeIterator.next());
// console.log(rangeIterator.next());
// console.log(rangeIterator.next());
// console.log(rangeIterator.next());

// class案例
class ClassRoom {
  constructor(address, name, students) {
    this.address = address;
    this.name = name;
    this.students = students;
  }

  entry(students) {
    this.students.push(students);
  }
  // 另一种写法
  foo = () => {};

  *[Symbol.iterator]() {
    // let index = 0;
    // return {
    //   next: () => {
    //     if (index < this.students.length) {
    //       return { done: false, value: this.students[index++] };
    //     } else {
    //       return { done: true, value: undefined };
    //     }
    //   },
    //   return: () => {
    //     console.log("迭代器提前终止了");
    //     // 需要返回一个对象，不然会报错
    //     return { done: true, value: undefined };
    //   },
    // };
    yield* this.students;
  }
}

const classroom = new ClassRoom("xxx", "3班", ["wx", "ww", "xx"]);
classroom.entry("yy");

for (const item of classroom) {
  console.log("item", item);
}

// 构造函数实现迭代器
// function Person {}
// Person.prototype[Symbol.iterator] = function() {}
