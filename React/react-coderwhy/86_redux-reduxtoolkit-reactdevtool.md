## react-redux

npm install react-redux

使用

1. 使用 Provider 包裹 App 组件

   ```js
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';
   import { Provider } from "react-redux"
   import store from "./store"
   
   const root = ReactDOM.createRoot(document.getElementById('root'));
   root.render(
     // <React.StrictMode>
       <Provider store={store}>
         <App />
       </Provider>
     // </React.StrictMode>
   );
   ```

2. 使用 connect 高阶函数映射 state 和 dispath，然后返回新的组件

   ```jsx
   import React, { PureComponent } from 'react'
   import { connect } from "react-redux"
   import { addNumberAction, subNumberAction } from '../store/counter'
   
   export class About extends PureComponent {
   
     calcNumber(num, isAdd) {
       if (isAdd) {
         console.log("加", num)
         this.props.addNumber(num)
       } else {
         console.log("减", num)
         this.props.subNumber(num)
       }
     }
   
     render() {
       const { counter } = this.props
   
       return (
         <div>
           <h2>About Page: {counter}</h2>
           <div>
             <button onClick={e => this.calcNumber(6, true)}>+6</button>
             <button onClick={e => this.calcNumber(6, false)}>-6</button>
           </div>
         </div>
       )
     }
   }
   
   // connect()返回值是一个高阶组件
   // function mapStateToProps(state) {
   //   return {
   //     counter: state.counter
   //   }
   // }
   
   // function fn2(dispatch) {
   //   return {
   //     addNumber(num) {
   //       dispatch(addNumberAction(num))
   //     },
   //     subNumber(num) { 
   //       dispatch(subNumberAction(num))
   //     }
   //   }
   // }
   
   const mapStateToProps = (state) => ({
     counter: state.counter.counter,
   })
   
   const mapDispatchToProps = (dispatch) => ({
     addNumber(num) {
       dispatch(addNumberAction(num))
     },
     subNumber(num) {
       dispatch(subNumberAction(num))
     }
   })
   
   export default connect(mapStateToProps, mapDispatchToProps)(About)
   ```


### redux-thunk

redux dispath 不可以用于派发函数，如果想派发函数用于**异步请求**，则需要使用到 redux-thunk 库。

`npm install redux-thunk`

使用过程：

1. 通过redux的 applyMiddle，使用 redux-thunk 增强 store

   ```js
   import { createStore, applyMiddleware, compose } from "redux"
   import thunk from "redux-thunk"
   import reducer from "./reducer"
   
   const store = createStore(reducer, applyMiddleware(thunk))
   ```

2. 可以使用 dispatch 派发函数用于异步请求

   ```js
   export const fetchHomeMultidataAction = () => {
     // 如果是一个普通的action, 那么我们这里需要返回action对象
     // 问题: 对象中是不能直接拿到从服务器请求的异步数据的
     // return {}
   
     return function(dispatch, getState) {
       // 异步操作: 网络请求
       // console.log("foo function execution-----", getState().counter)
       axios.get("http://123.207.32.32:8000/home/multidata").then(res => {
         const banners = res.data.data.banner.list
         const recommends = res.data.data.recommend.list
   
         // dispatch({ type: actionTypes.CHANGE_BANNERS, banners })
         // dispatch({ type: actionTypes.CHANGE_RECOMMENDS, recommends })
         dispatch(changeBannersAction(banners))
         dispatch(changeRecommendsAction(recommends))
       })
     }
   
     // 如果返回的是一个函数, 那么redux是不支持的
     // return foo
   }
   ```

3. 在组件中使用

   ```jsx
   import React, { PureComponent } from 'react'
   import { connect } from "react-redux"
   import { fetchHomeMultidataAction } from "../store/home"
   
   export class Category extends PureComponent {
   
     componentDidMount() {
       this.props.fetchHomeMultidata()
     }
   
     render() {
       return (
         <div>
           <h2>Category Page: {this.props.counter}</h2>
         </div>
       )
     }
   }
   
   const mapStateToProps = (state) => ({
     counter: state.counter.counter
   })
   
   const mapDispatchToProps = (dispatch) => ({
     fetchHomeMultidata() {
       dispatch(fetchHomeMultidataAction())
     }
   })
   
   export default connect(mapStateToProps, mapDispatchToProps)(Category)
   ```

### react-devtool&redux-devtool

开启redux-devtool

```js
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))

export default store
```

关闭redux-devtool

```js
const composeEnhancers = compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))

export default store
```

开启 redux-devtool 的 trace 选项

```js
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({trace: true}) || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))
```

### store拆分

为了便于管理状态，不会使得store变得繁重

要点：

1. 分模块，可以根据一个特性(feature)或者模块(module)建一个文件夹，如 user

2. 每个文件夹应该有四个 js 文件

   1. index.js
   2. actionCreators.js
   3. reducer.js
   4. constants.js

3. 关键在于使用 redux 中的 combineReducer 来将拆分的 reducers 进行合并

   ```js
   import { createStore, applyMiddleware, compose, combineReducers } from "redux"
   import thunk from "redux-thunk"
   
   import counterReducer from "./counter"
   import homeReducer from "./home"
   import userReducer from "./user"
   
   const reducer = combineReducers({
     counter: counterReducer,
     home: homeReducer,
     user: userReducer
   })
   
   const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({trace: true}) || compose;
   const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)))
   
   export default store
   
   ```

   

## Redux Toolkit

官方推荐，Redux Toolkit 是对 Redux 更深层的封装，要结合 react 还需要下载 react-redux.

`npm install @reduxjs/toolkit react-redux`

核心API

- configureStore：包装createSore以提供简化的配置选项和良好的默认值。它可以自动组合你的slice reducer，添加你提供的任务 redux 中间件，redux-thunk默认包含，并启用 Redux Devtools Extension。

  - 参数
    1. reducer：将slice中的reducer可以组成一个对象传入此处
    2. middleware：可以使用参数，传入其他的中间件
    3. devTools：是配置devTools工具，默认为 true

- createSlice：接收 reducer 函数的对象、切片名称和初始状态值，并自动生成 reducer，并带有相应的actions。

  - 参数
    1. name
    2. initialState
    3. reducers：对象，每个属性都是函数
  - 返回值：返回值是一个对象，包含所有的reducers 和 actions

  ```js
  import { configureStore } from "@reduxjs/toolkit"
  
  import counterReducer from "./features/counter"
  import homeReducer from "./features/home"
  
  const store = configureStore({
    reducer: {
      counter: counterReducer,
      home: homeReducer
    }
  })
  
  export default store
  ```

  ```js
  import { createSlice } from "@reduxjs/toolkit"
  
  const counterSlice = createSlice({
    name: "counter",
    initialState: {
      counter: 888
    },
    reducers: {
      addNumber(state, { payload }) {
        state.counter = state.counter + payload
      },
      subNumber(state, { payload }) {
        state.counter = state.counter - payload
      }
    }
  })
  
  export const { addNumber, subNumber } = counterSlice.actions
  export default counterSlice.reducer
  ```

- createAsyncThunk：接收一个动作类型字符串和一个返回承诺的函数，并生成一个pending/fulfilled/reject基于该承诺分派动作类型的thunk。

  1. pending：action被发出但是还没有最终的结果
  2. fulfilled：获取到最终的结果（有返回值的结果）
  3. reject：执行过程中有错误或者抛出了异常


### Redux Toolkit 的异步操作（官方推荐写法）

Redux Toolkit 默认继承了 react-thunk 相关的功能：createAsyncThunk

1. 使用 createAsyncThunk 创建要给用于异步操作的函数（类似Promise）

   ```js
   // home.js
   import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
   import axios from 'axios'
   
   export const fetchHomeMultidataAction = createAsyncThunk(
     "fetch/homemultidata", 
     async () => {
       // 1.发送网络请求, 获取数据
       const res = await axios.get("xxx")
       return res.data
   })
   ```

2. 在 createSlice传入的对象中添加 extraReducers 属性，用于监听异步函数的状态

   ```js
   const homeSlice = createSlice({
     name: "home",
     initialState: {
       banners: [],
       recommends: []
     },
     reducers: {
       changeBanners(state, { payload }) {
         state.banners = payload
       },
       changeRecommends(state, { payload }) {
         state.recommends = payload
       }
     },
     extraReducers: { // 官方推荐写法
       [fetchHomeMultidataAction.pending](state, action) {
         console.log("fetchHomeMultidataAction pending")
       },
       [fetchHomeMultidataAction.fulfilled](state, { payload }) {
         state.banners = payload.data.banner.list
         state.recommends = payload.data.recommend.list
       },
       [fetchHomeMultidataAction.rejected](state, action) {
         console.log("fetchHomeMultidataAction rejected")
       }
     }
   })
   ```

extraReducers 属性监听异步函数状态的另一种写法，属性值为一个函数，带有参数 builder，使用builder中的 addCase 函数也可以监听异步函数状态，可链式调用。

```js
extraReducers: (builder) => {
    builder.addCase(fetchHomeMultidataAction.pending, (state, action) => {
      console.log("fetchHomeMultidataAction pending")
    }).addCase(fetchHomeMultidataAction.fulfilled, (state, { payload }) => {
      state.banners = payload.data.banner.list
      state.recommends = payload.data.recommend.list
    })
  }
```

###Redux Toolkit 的异步操作另一种写法

直接在函数中来获取数据并通过 dispatch 存储到 store 中

```js
// home.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchHomeMultidataAction = createAsyncThunk(
  "fetch/homemultidata", 
  async (extraInfo, { dispatch, getState }) => { // 第二个参数是store
    // console.log(extraInfo, dispatch, getState)
    // 1.发送网络请求, 获取数据
    const res = await axios.get("xxxx")

    // 2.取出数据, 并且在此处直接dispatch操作(可以不做)
    const banners = res.data.data.banner.list
    const recommends = res.data.data.recommend.list
    dispatch(changeBanners(banners))
    dispatch(changeRecommends(recommends))

    // 3.返回结果, 那么action状态会变成fulfilled状态
    return res.data
})

const homeSlice = createSlice({
  name: "home",
  initialState: {
    banners: [],
    recommends: []
  },
  reducers: {
    changeBanners(state, { payload }) {
      state.banners = payload
    },
    changeRecommends(state, { payload }) {
      state.recommends = payload
    }
  },
  // extraReducers: {
  //   [fetchHomeMultidataAction.pending](state, action) {
  //     console.log("fetchHomeMultidataAction pending")
  //   },
  //   [fetchHomeMultidataAction.fulfilled](state, { payload }) {
  //     state.banners = payload.data.banner.list
  //     state.recommends = payload.data.recommend.list
  //   },
  //   [fetchHomeMultidataAction.rejected](state, action) {
  //     console.log("fetchHomeMultidataAction rejected")
  //   }
  // }
  extraReducers: (builder) => {
    // builder.addCase(fetchHomeMultidataAction.pending, (state, action) => {
    //   console.log("fetchHomeMultidataAction pending")
    // }).addCase(fetchHomeMultidataAction.fulfilled, (state, { payload }) => {
    //   state.banners = payload.data.banner.list
    //   state.recommends = payload.data.recommend.list
    // })
  }
})

export const { changeBanners, changeRecommends } = homeSlice.actions
export default homeSlice.reducer

```

```jsx
// home.jsx

// ...
const mapDispatchToProps = (dispatch) => ({
  addNumber(num) {
    dispatch(addNumber(num))
  },
  fetchHomeMultidata() {
    dispatch(fetchHomeMultidataAction({name: "why", age: 18})) // {name: "why", age: 18} 是 home.js 中异步函数createAsyncThunk第二个参数函数中的第一个参数extraInfo
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
```

###Redux Toolkit的数据不可变性

Redux Toolkit 底层使用了 immerjs的一个库来保证数据的不可变性，因此可以以下形式更改store

```js
state.couter = state.couter + paload
```

### connect 的实现

1. connect函数的实现

   ```js
   // connect.js
   import { PureComponent } from "react";
   import { StoreContext } from "./StoreContext";
   // import store from "../store"
   
   export function connect(mapStateToProps, mapDispatchToProps, store) {
     // 高阶组件: 函数
     return function(WrapperComponent) {
       class NewComponent extends PureComponent {
         constructor(props, context) {
           super(props)
           
           this.state = mapStateToProps(context.getState())
         }
   
         componentDidMount() {
           this.unsubscribe = this.context.subscribe(() => {
             // this.forceUpdate()
             this.setState(mapStateToProps(this.context.getState()))
           })
         }
   
         componentWillUnmount() {
           this.unsubscribe()
         }
   
         render() {
           const stateObj = mapStateToProps(this.context.getState())
           const dispatchObj = mapDispatchToProps(this.context.dispatch)
           return <WrapperComponent {...this.props} {...stateObj} {...dispatchObj}/>
         }
       }
   
       NewComponent.contextType = StoreContext
   
       return NewComponent
     }
   }
   ```

2. StoreContext.js 用于解耦 store

   ```js
   import { createContext } from "react";
   
   export const StoreContext = createContext()
   ```

3. index.js 用于导出 StoreContext 和 connect

   ```js
   export { StoreContext } from "./StoreContext"
   export { connect } from "./connect"
   ```

#### 使用自己封装connect

1. 引入 StoreContext，并使用

   ```jsx
   // index.js
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import { Provider } from "react-redux"
   import { StoreContext } from "./hoc"
   import App from './App';
   import store from './store';
   
   const root = ReactDOM.createRoot(document.getElementById('root'));
   root.render(
     // <React.StrictMode>
       <Provider store={store}>
         <StoreContext.Provider value={store}>
           <App />
         </StoreContext.Provider>
       </Provider>
     // </React.StrictMode>
   );
   ```

2. connect.js 中的 store 都改成 context，context在 constructor的第二个参数，如上。

   

   
