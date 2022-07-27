1. 对 React Hook 的理解，它的实现原理是什么 1
2. 为什么 useState 要使用数组而不是对象 1
3. React Hooks 解决了哪些问题？ 1
4. React Hook 的使用限制有哪些？ 3
5. useEffect 与 useLayoutEffect 的区别 2
   （1）共同点
   运用效果： useEffect 与 useLayoutEffect 两者都是用于处理副作用，这些副作用包括改变 DOM、设置订阅、操作定时器等。在函数组件内部操作副作用是不被允许的，所以需要使用这两个函数去处理。
   使用方式： useEffect 与 useLayoutEffect 两者底层的函数签名是完全一致的，都是调用的 mountEffectImpl 方法，在使用上也没什么差异，基本可以直接替换。

   （2）不同点
   使用场景： useEffect 在 React 的渲染过程中是被异步调用的，用于绝大多数场景；而 useLayoutEffect 会在所有的 DOM 变更之后同步调用，主要用于处理 DOM 操作、调整样式、避免页面闪烁等问题。也正因为是同步处理，所以需要避免在 useLayoutEffect 做计算量较大的耗时任务从而造成阻塞。
   使用效果： useEffect 是按照顺序执行代码的，改变屏幕像素之后执行（先渲染，后改变 DOM），当改变屏幕内容时可能会产生闪烁；useLayoutEffect 是改变屏幕像素之前就执行了（会推迟页面显示的事件，先改变 DOM 后渲染），不会产生闪烁。useLayoutEffect 总是比 useEffect 先执行。

   在未来的趋势上，两个 API 是会长期共存的，暂时没有删减合并的计划，需要开发者根据场景去自行选择。React 团队的建议非常实用，如果实在分不清，先用 useEffect，一般问题不大；如果页面有异常，再直接替换为 useLayoutEffect 即可。

6. React Hooks 在平时开发中需要注意的问题和原因 3
   （1）不要在循环，条件或嵌套函数中调用 Hook，必须始终在 React 函数的顶层使用 Hook
   这是因为 React 需要利用调用顺序来正确更新相应的状态，以及调用相应的钩子函数。一旦在循环或条件分支语句中调用 Hook，就容易导致调用顺序的不一致性，从而产生难以预料到的后果。
   （2）使用 useState 时候，使用 push，pop，splice 等直接更改数组对象的坑
   使用 push 直接更改数组无法获取到新值，应该采用解构方式，但是在 class 里面不会有这个问题。
   function Indicatorfilter() {
   let [num,setNums] = useState([0,1,2,3])
   const test = () => {
   // 这里坑是直接采用 push 去更新 num
   // setNums(num)是无法更新 num 的
   // 必须使用 num = [...num ,1]
   num.push(1)
   // num = [...num ,1]
   setNums(num)
   }
   return (
   <div className='filter'>
   <div onClick={test}>测试</div>
   <div>
   {num.map((item,index) => (
   <div key={index}>{item}</div>
   ))}
   </div>
   </div>
   )
   }

   （3）useState 设置状态的时候，只有第一次生效，后期需要更新状态，必须通过 useEffect
   const TableDeail = ({
   columns,
   }:TableData) => {
   const [tabColumn, setTabColumn] = useState(columns)
   }

   // 正确的做法是通过 useEffect 改变这个值
   const TableDeail = ({
   columns,
   }:TableData) => {
   const [tabColumn, setTabColumn] = useState(columns)
   useEffect(() =>{setTabColumn(columns)},[columns])
   }

   （4）善用 useCallback
   父组件传递给子组件事件句柄时，如果我们没有任何参数变动可能会选用 useMemo。但是每一次父组件渲染子组件即使没变化也会跟着渲染一次。

   （5）不要滥用 useContext
   可以使用基于 useContext 封装的状态管理工具。

7. React Hooks 和生命周期的关系？ 3
   函数组件 的本质是函数，没有 state 的概念的，因此不存在生命周期一说，仅仅是一个 render 函数而已。
   但是引入 Hooks 之后就变得不同了，它能让组件在不使用 class 的情况下拥有 state，所以就有了生命周期的概念，所谓的生命周期其实就是 useState、 useEffect() 和 useLayoutEffect() 。

   即：Hooks 组件（使用了 Hooks 的函数组件）有生命周期，而函数组件（未使用 Hooks 的函数组件）是没有生命周期的。

   下面是具体的 class 与 Hooks 的生命周期对应关系：
   1.constructor：函数组件不需要构造函数，可以通过调用 **useState 来初始化
   state**。如果计算的代价比较昂贵，也可以传一个函数给 useState。

   const [num, UpdateNum] = useState(0)

   2.getDerivedStateFromProps：一般情况下，我们不需要使用它，可以在渲染过程中更新 state，以达到实现 getDerivedStateFromProps 的目的。

   function ScrollView({row}) {
   let [isScrollingDown, setIsScrollingDown] = useState(false);
   let [prevRow, setPrevRow] = useState(null);
   if (row !== prevRow) {
   // Row 自上次渲染以来发生过改变。更新 isScrollingDown。
   setIsScrollingDown(prevRow !== null && row > prevRow);
   setPrevRow(row);
   }
   return `Scrolling down: ${isScrollingDown}`;
   }

   React 会立即退出第一次渲染并用更新后的 state 重新运行组件以避免耗费太多性能。

   3.shouldComponentUpdate：可以用 **React.memo** 包裹一个组件来对它的 props 进行浅比较
   const Button = React.memo((props) => { // 具体的组件});

   注意：**React.memo 等效于 **``**PureComponent**，它只浅比较 props。这里也可以使用 useMemo 优化每一个节点。

   4.render：这是函数组件体本身。
   componentDidMount, componentDidUpdate： useLayoutEffect 与它们两的调用阶段是一样的。但是，我们推荐你一开始先用  useEffect，只有当它出问题的时候再尝试使用 useLayoutEffect。useEffect 可以表达所有这些的组合。

   // componentDidMount
   useEffect(()=>{
   // 需要在 componentDidMount 执行的内容
   }, [])
   useEffect(() => {
   // 在 componentDidMount，以及 count 更改时 componentDidUpdate 执行的内容
   document.title = `You clicked ${count} times`;
   return () => {
   // 需要在 count 更改时 componentDidUpdate（先于 document.title = ... 执行，遵守先清理后更新）
   // 以及 componentWillUnmount 执行的内容  
    } // 当函数中 Cleanup 函数会按照在代码中定义的顺序先后执行，与函数本身的特性无关
   }, [count]); // 仅在 count 更改时更新

   请记得 React 会等待浏览器完成画面渲染之后才会延迟调用 ，因此会使得额外操作很方便

   5.componentWillUnmount：相当于 useEffect 里面返回的 cleanup 函数
   // componentDidMount/componentWillUnmount
   useEffect(()=>{
   // 需要在 componentDidMount 执行的内容
   return function cleanup() {
   // 需要在 componentWillUnmount 执行的内容  
    }
   }, [])

   6.componentDidCatch and getDerivedStateFromError：目前还没有这些方法的 Hook 等价写法，但很快会加上。
