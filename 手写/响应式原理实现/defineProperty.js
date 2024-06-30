let obj = {
  name: "wx",

  age: 20,
};
Object.keys(obj).forEach((key) => {
  let val = obj[key];

  Object.defineProperty(obj, key, {
    get() {
      console.log(`监听到${key}值的获取`);

      return val;
    },

    set(newVal) {
      console.log(`监听到${key}值的设置`);

      val = newVal;
    },
  });
});

obj.name = "kobe";

obj.age = 30;
obj.address = "南昌市"; // 监听不到
delete obj.age; // 监听不到
console.log(obj.name, obj.age);
