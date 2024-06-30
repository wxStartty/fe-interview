const names = ["aaa", "bbb", "ccc"];
const nums = [111, 222, 333];

function createArrayIterator(arr) {
  let index = 0;
  return {
    next: function () {
      if (index < arr.length) {
        return { done: false, value: arr[index++] };
      } else {
        return { done: true, value: undefined };
      }
    },
  };
}

const namesIterator = createArrayIterator(names);
console.log(namesIterator.next());
console.log(namesIterator.next());
console.log(namesIterator.next());
console.log(namesIterator.next());

const numsIterator = createArrayIterator(nums);
console.log(numsIterator.next());
console.log(numsIterator.next());
console.log(numsIterator.next());
console.log(numsIterator.next());
