https://juejin.cn/post/6940942549305524238

1.  对 Redux 的理解，主要解决什么问题 1
2.  Redux 原理及工作流程 1
    1）原理
    Redux 源码主要分为以下几个模块文件
    compose.js 提供从右到左进行函数式编程
    createStore.js 提供作为生成唯一 store 的函数
    combineReducers.js 提供合并多个 reducer 的函数，保证 store 的唯一性
    bindActionCreators.js 可以让开发者在不直接接触 dispacth 的前提下进行更改 state 的操作
    applyMiddleware.js 这个方法通过中间件来增强 dispatch 的功能

    const actionTypes = {
    ADD: 'ADD',
    CHANGEINFO: 'CHANGEINFO',
    }

    const initState = {
    info: '初始化',
    }

    export default function initReducer(state=initState, action) {
    switch(action.type) {
    case actionTypes.CHANGEINFO:
    return {
    ...state,
    info: action.preload.info || '',
    }
    default:
    return { ...state };
    }
    }

    export default function createStore(reducer, initialState, middleFunc) {

         if (initialState && typeof initialState === 'function') {
             middleFunc = initialState;
             initialState = undefined;
         }

         let currentState = initialState;

         const listeners = [];

         if (middleFunc && typeof middleFunc === 'function') {
             // 封装dispatch
             return middleFunc(createStore)(reducer, initialState);
         }

         const getState = () => {
             return currentState;
         }

         const dispatch = (action) => {
             currentState = reducer(currentState, action);

             listeners.forEach(listener => {
                 listener();
             })
         }

         const subscribe = (listener) => {
             listeners.push(listener);
         }

         return {
             getState,
             dispatch,
             subscribe
         }

    }
    （2）工作流程
    const store= createStore（fn）生成数据;
    action: {type: Symble('action01), payload:'payload' }定义行为;
    dispatch 发起 action：store.dispatch(doSomething('action001'));
    reducer：处理 action，返回新的 state;

    通俗点解释：

    首先，用户（通过 View）发出 Action，发出方式就用到了 dispatch 方法
    然后，Store 自动调用 Reducer，并且传入两个参数：当前 State 和收到的 Action，Reducer 会返回新的 State
    State—旦有变化，Store 就会调用监听函数，来更新 View

    以 store 为核心，可以把它看成数据存储中心，但是他要更改数据的时候不能直接修改，数据修改更新的角色由 Reducers 来担任，store 只做存储，中间人，当 Reducers 的更新完成以后会通过 store 的订阅来通知 react component，组件把新的状态重新获取渲染，组件中也能主动发送 action，创建 action 后这个动作是不会执行的，所以要 dispatch 这个 action，让 store 通过 reducers 去做更新 React Component 就是 react 的每个组件。

3.  Redux 中异步的请求怎么处理 2
    （1）使用 react-thunk 中间件
    （2）使用 redux-saga 中间件
4.  Redux 怎么实现属性传递，介绍下原理 2
    react-redux 数据传输 ∶ view-->action-->reducer-->store-->view。看下点击事件的数据是如何通过 redux 传到 view 上：
    view 上的 AddClick 事件通过 mapDispatchToProps 把数据传到 action ---> click:()=>dispatch(ADD)
    action 的 ADD 传到 reducer 上
    reducer 传到 store 上 const store = createStore(reducer);
    store 再通过 mapStateToProps 映射穿到 view 上 text:State.text

    代码示例 ∶
    import React from 'react';
    import ReactDOM from 'react-dom';
    import { createStore } from 'redux';
    import { Provider, connect } from 'react-redux';
    class App extends React.Component{
    render(){
    let { text, click, clickR } = this.props;
    return(
    <div>
    <div>数据:已有人{text}</div>
    <div onClick={click}>加人</div>
    <div onClick={clickR}>减人</div>
    </div>
    )
    }
    }
    const initialState = {
    text:5
    }
    const reducer = function(state,action){
    switch(action.type){
    case 'ADD':
    return {text:state.text+1}
    case 'REMOVE':
    return {text:state.text-1}
    default:
    return initialState;
    }
    }

    let ADD = {
    type:'ADD'
    }
    let Remove = {
    type:'REMOVE'
    }

    const store = createStore(reducer);

    let mapStateToProps = function (state){
    return{
    text:state.text
    }
    }

    let mapDispatchToProps = function(dispatch){
    return{
    click:()=>dispatch(ADD),
    clickR:()=>dispatch(Remove)
    }
    }

    const App1 = connect(mapStateToProps,mapDispatchToProps)(App);

    ReactDOM.render(
    <Provider store = {store}>
    <App1></App1>
    </Provider>,document.getElementById('root')
    )

5.  Redux 中间件是什么？接受几个参数？柯里化函数两端的参数具体是什么？ 3
    Redux 的中间件提供的是位于 action 被发起之后，到达 reducer 之前的扩展点，换而言之，原本 view -→> action -> reducer -> store 的数据流加上中间件后变成了 view -> action -> middleware -> reducer -> store ，在这一环节可以做一些"副作用"的操作，如异步请求、打印日志等。

    applyMiddleware 源码：
    export default function applyMiddleware(...middlewares) {
    return createStore => (...args) => {
    // 利用传入的 createStore 和 reducer 和创建一个 store
    const store = createStore(...args)
    let dispatch = () => {
    throw new Error()
    }
    const middlewareAPI = {
    getState: store.getState,
    dispatch: (...args) => dispatch(...args)
    }
    // 让每个 middleware 带着 middlewareAPI 这个参数分别执行一遍
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    // 接着 compose 将 chain 中的所有匿名函数，组装成一个新的函数，即新的 dispatch
    dispatch = compose(...chain)(store.dispatch)
    return {
    ...store,
    dispatch
    }
    }
    }

    从 applyMiddleware 中可以看出 ∶
    redux 中间件接受一个对象作为参数，对象的参数上有两个字段 dispatch 和 getState，分别代表着 Redux Store 上的两个同名函数。
    柯里化函数两端一个是 middewares，一个是 store.dispatch

6.  Redux 请求中间件如何处理并发 4
7.  Redux 状态管理器和变量挂载到 window 中有什么区别 3
8.  mobox 和 redux 有什么区别？ 3
9.  Redux 和 Vuex 有什么区别，它们的共同思想 1
    （1）Redux 和 Vuex 区别
    Vuex 改进了 Redux 中的 Action 和 Reducer 函数，以 mutations 变化函数取代 Reducer，无需 switch，只需在对应的 mutation 函数里改变 state 值即可
    Vuex 由于 Vue 自动重新渲染的特性，无需订阅重新渲染函数，只要生成新的 State 即可
    Vuex 数据流的顺序是 ∶View 调用 store.commit 提交对应的请求到 Store 中对应的 mutation 函数->store 改变（vue 检测到数据变化自动渲染）

    通俗点理解就是，vuex 弱化 dispatch，通过 commit 进行 store 状态的一次更变；取消了 action 概念，不必传入特定的 action 形式进行指定变更；弱化 reducer，基于 commit 参数直接对数据进行转变，使得框架更加简易;

    （2）共同思想
    单—的数据源
    变化可以预测
    本质上 ∶ redux 与 vuex 都是对 mvvm 思想的服务，将数据从视图中抽离的一种方案。

10. Redux 中间件是怎么拿到 store 和 action? 然后怎么处理? 4
11. Redux 中的 connect 有什么作用 3
    connect 负责连接 React 和 Redux
    （1）获取 state
    connect 通过 context 获取 Provider 中的 store，通过 store.getState() 获取整个 store tree 上所有 state
    （2）包装原组件
    将 state 和 action 通过 props 的方式传入到原组件内部 wrapWithConnect 返回—个 ReactComponent 对 象 Connect，Connect 重 新 render 外部传入的原组件 WrappedComponent ，并把 connect 中传入的 mapStateToProps，mapDispatchToProps 与组件上原有的 props 合并后，通过属性的方式传给 WrappedComponent
    （3）监听 store tree 变化
    connect 缓存了 store tree 中 state 的状态，通过当前 state 状态 和变更前 state 状态进行比较，从而确定是否调用 this.setState()方法触发 Connect 及其子组件的重新渲染
