babel 转换默认启用严格模式

类 默认启用严格模式

this.setState做的两件事情

1. 将state值更改
2. 自动调用render方法

### JSX

书写规范

1. jsx结构中只能有一个根元素。
2. jsx结构通常会包裹一个()，将整个jsx当作一个整体，实现换行。
3. jsx中的标签也可以是单标签必须以  /> 结尾。

注释

```react
{/*...*/}
```

jsx插入的内容

1. 当变量是Number、String、Array类型时，可以直接显式
2. 当变量时null、undefined、Boolean类型时，内容为空
3. Object对象类型不能作为子元素
4. 表达式
5. 三元运算符
6. 可以调用方法

jsx绑定属性

```rea
<h2 :title={title}></h2>
```

- 绑定class

  1. 字符串拼接
  2. 将所有的class放到数组中
  3. classnames 第三方库

  ```react
  // 1.class绑定的写法一: 字符串的拼接
  const className = `abc cba ${isActive ? 'active': ''}`
  // 2.class绑定的写法二: 将所有的class放到数组中
  const classList = ["abc", "cba"]
  if (isActive) classList.push("active")
  // 3.class绑定的写法三: 第三方库classnames -> npm install classnames
  ```

- 绑定style：绑定对象类型

  ```rea
  <h2 style={{color: "red", fontSize: "30px"}}>呵呵呵呵</h2>
  ```

  

  