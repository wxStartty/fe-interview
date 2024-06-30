### setState的同步和异步

v18 setState 都是异步的

setState可以传入一个回调函数，好处

1. 可以在回调函数中编写新的state的逻辑

2. 当前的回调函数会将之前的state和props传递进来

   ```react
   this.setState((state, props) => {
       // 编写新的state逻辑
       ...
   })
   ```

3. setState在React的事件处理中是一个异步调用，如果希望在数据更新后，获取到对应的结果执行一些逻辑代码，那么可以在setState中传入第二个参数：callback

   ```react
   this.setState({xxx: 'xxx'}, () => {
       console.log('xxx', this.state.xxx) // 更新后的
   })
   ```

为什么setState可以设计成异步？

- 可以显著提升性能
- 如果同步更新了state，但是还没有执行render函数，那么state和props不能保存同步

在v18之前

- 在组件生命周期或者React合成事件中，setState是异步的
- setTimeout或者原生dom事件 中 setState是同步的

如果需要在v18中使得setState为同步的需要使用flushSync

```react
import { flushSync } from 'react-dom'
...
flushSync(() => {
	this.setState({ ... })
})
```

### React更新流程

如果一棵树参考另一颗树进行完全比较更新，即使是最先进的算法，该算法的复杂程度为O(n^3)，其中n是树中元素的个数。这样的话，更新性能变得非常低效。所有，React对这个算法进行了优化，将其优化成O(n)

- 同层节点之间进行比较，不会跨层进行比较
- 不同类型的节点，产生不同的树结构（比如同层中一个是div，变成了一个是p，则div以及div中的元素全部更新以为p元素为父级，原先子元素为子元素的元素节点）
- 开发中，可以通过key来指定哪些节点在不同的渲染下保持稳定。

### React 的性能优化

类组件

- shouldComponentUpdate(nextProps, nextState)

  底层是使用 shallowEqual() 实现

- PureComponent

函数组件

- memo(function() {...})

不可变的力量：在使用PureComponent时不要直接修改react中的变量（比如：this.state.books.push({...})），这会使得界面不会刷新。而应该全部更改books对象（如const books = [...this.state.books]; this.setState({ books })）

### ref 获取DOM和组件

1. 在React元素上绑定一个ref字符串

2. 提前创建好ref对象，通过createRef()创建，将创建出来的对象绑定到元素上

   ```react
   constructor() {
       super()
       this.state = {}
       this.titleRef = createRef()
   }
   getNativeDom() {
       console.log(this.titleRef.current)
   }
   ```

3. 传入一个回调函数，在对应的元素被渲染之后，回调函数被执行，并且将元素传入

   ```react
   constructor() {
       super()
       this.state = {}
       this.titleEl = null
   }
   getNativeDom() {
       console.log(this.titleEl)
   }
   render() {
       return (
       	<div>
           	<h2 ref={el => this.titleEl = el}></h2>
           </div>
       )
   }
   ```



### ref 获取函数式组件中的DOM

注意：ref不能应用于函数式组件，因为函数式组件没有实例，所以不能获取到对应的组件对象

但是在开发中可能想要获取函数式组件中某个元素的DOM，这是可以 forwardRef高阶函数

```react
const Home = forwardRef(function(props, ref) {
    return (
    	<div>
        	<h2 ref={ref}>Home</h2>
        </div>
    )
})
```

### 受控和非受控组件
