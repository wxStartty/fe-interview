// Array中slice实现
Array.prototype.mySlice = function (start, end) {
  var array = this;
  start = start || 0;
  end = end || array.length;
  var newArr = [];
  for (var i = start; i < end; i++) {
    newArr.push(array[i]);
  }

  return newArr;
};
