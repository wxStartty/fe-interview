class ClassRoom {
  constructor(address, name, students) {
    this.address = address;
    this.name = name;
    this.students = students;
  }

  entry(students) {
    this.students.push(students);
  }

  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.students.length) {
          return { done: false, value: this.students[index++] };
        } else {
          return { done: true, value: undefined };
        }
      },
      return: () => {
        console.log("迭代器提前终止了");
        // 需要返回一个对象，不然会报错
        return { done: true, value: undefined };
      },
    };
  }
}

const classroom = new ClassRoom("xxx", "3班", ["wx", "ww", "xx"]);
classroom.entry("yy");

for (const item of classroom) {
  console.log("item", item);
  if (item === "ww") break;
}

// 构造函数实现迭代器
// function Person {}
// Person.prototype[Symbol.iterator] = function() {}
