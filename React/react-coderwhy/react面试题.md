1、JSX的本质与原理？

react.createElement()

2、虚拟DOM（JS对象）的作用

1. 更新数据时，没有必要把全部的DOM元素都进行更新

2. 跨平台

3. 从命令式编程转到了声明式编程（React官方）

   React.createElement('div', props, children) --> div

   这个过程通过React

3、为什么setState可以设计成异步？

- 可以显著提升性能
- 如果同步更新了state，但是还没有执行render函数，那么state和props不能保存同步

4、setState一定是异步的吗？（v18之前）

5、react 中有几种获取Dom的方式

- ref

- createRef

- 传入一个回调函数，在对应的元素被渲染之后，回调函数被执行，并且将元素传入

  ```jsx
  <h2 ref={el => this.titleEl = el}></h2>
  ```

6、类组件和函数式组件对比

7、类组件的缺点

