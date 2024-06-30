## redux

### 日志打印中间件处理

```js
// store/index.js
// ...

// 对每次派发的action进行拦截，进行日志打印
function log(store) {
  const next = store.dispatch

  function logAndDispatch() {
    console.log("当前派发的action", action)
    // 真正派发的代码，使用之前的dispatch进行派发
    next(action)
    console.log("派发之后的结果", store.getState())
  }

  // monkey patching 猴补丁 => 篡改现有的代码，对整体执行逻辑进行修改
  store.dispatch = logAndDispatch
}
log(store)
```

### redux-thunk 基本实现

```js
function thunk(store) {
  const next = store.dispatch

  function dispatchThunk(action) {
    if (typeof action === 'function') {
      action(store.dispatch, store.getState)
    } else {
      next(action)
    }
  }

  store.dispatch = dispatchThunk
}
```

### applyMiddleware 基本实现

```js
function applyMiddleware(store, ...fns) {
  fns.forEach(fn => {
    fn(store)
  })
}

applyMiddleware(store, log, thunk)
```

### React 中的 state 如何管理

## React-Router

核心：映射关系，改变URL，页面不进行整体的刷新。

react-router 最新版本6.x（2022/9/8）

react-router 会包含一些 react-native 的内容，web开发并不需要，所以需要安装 react-router-dom

`npm install react-router-dom`

### 基本使用

- HashRouter
- BrowserRouter

```js
// import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { HashRouter } from "react-router-dom"

const root = ReactDOM.createRoot(document.querySelector("#root"))
root.render(
  // <StrictMode>
    <HashRouter>
        <App/>
    </HashRouter>
  // </StrictMode>
)
```

### 路由映射配置

- Routes：包裹所有的Route，在其中匹配一个路由
  - Router5.x使用的是 Switch 组件
- Route
  - 属性
    - path
    - element(react组件)
      - Router5.x使用的是component属性
      - exact 精确匹配 Router5.x支持

### 路由配置和跳转

- Link和NavLink
  - 通常路径的跳转是使用Link组件，最终会被渲染成a元素
  - NavLink是在Link基础上增加了一些样式属性
  - to：Link 中最重要的属性，用于设置跳转到的路径

link属性：

- to
- replace
- state
- reloadDocument

NavLink属性：

- to
- style(可以是函数)
- className(可以是函数)

### 路由的基本使用示例

```jsx
// App.jsx
import React from 'react'
import { Link, Route, Routes } from 'react-router-dom'

export function App(props) {
  const navigate = useNavigate()
  
  function navigateTo(path) {
    navigate(path)
  }

  return (
    <div className='app'>
      <div className='header'>
        <span>header</span>
        <div className='nav'>
          <Link to="/home">首页</Link>
          <Link to="/about">关于</Link>
        </div>
        <hr />
      </div>
      <div className='content'>
        {/* 映射关系: path => Component */}
        <Routes>
          <Route path='/' element={<Navigate to="/home"/>}/>
          <Route path='/home' element={<Home/>}/>
		  {/* 其它路由匹配规则 */}
          <Route path='/detail/:id' element={<Detail/>}/>
          <Route path='/user' element={<User/>}/>
          <Route path='*' element={<NotFound/>}/>
        </Routes>
      </div>
      <div className='footer'>
        <hr />
        Footer
      </div>
    </div>
  )
}

export default App
```

### Navigate导航

用于路由的重定向，当这个组件出现时，就会执行跳转到对应的to路径中，见以上代码。

### 路由嵌套

```jsx
import React from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import routes from './router'
import "./style.css"

export function App(props) {
  const navigate = useNavigate()
  
  function navigateTo(path) {
    navigate(path)
  }

  return (
    <div className='app'>
      <div className='header'>
        <span>header</span>
        <div className='nav'>
          <Link to="/home">首页</Link>
          <Link to="/about">关于</Link>
          <Link to="/login">登录</Link>
          <button onClick={e => navigateTo("/category")}>分类</button>
          <span onClick={e => navigateTo("/order")}>订单</span>

          <Link to="/user?name=why&age=18">用户</Link>
        </div>
        <hr />
      </div>
      <div className='content'>
        {/* 映射关系: path => Component */}
        <Routes>
          <Route path='/' element={<Navigate to="/home"/>}/>
          <Route path='/home' element={<Home/>}>
            <Route path='/home' element={<Navigate to="/home/recommend"/>}/>
            <Route path='/home/recommend' element={<HomeRecommend/>}/>
            <Route path='/home/ranking' element={<HomeRanking/>}/>
            <Route path='/home/songmenu' element={<HomeSongMenu/>}/>
          </Route>
        </Routes>
      </div>
      <div className='footer'>
        <hr />
        Footer
      </div>
    </div>
  )
}

export default App
```

```jsx
// Home.jsx
import React, { PureComponent } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { withRouter } from "../hoc"

export class Home extends PureComponent {
  navigateTo(path) {
    const { navigate } = this.props.router
    navigate(path)
  }

  render() {
    return (
      <div>
        <h1>Home Page</h1>
        <div className='home-nav'>
          <Link to="/home/recommend">推荐</Link>
          <Link to="/home/ranking">排行榜</Link>
          <button onClick={e => this.navigateTo("/home/songmenu")}>歌单</button>
        </div>

        {/* 占位的组件 */}
        <Outlet/>
      </div>
    )
  }
}

export default withRouter(Home)
```

注意：不可少了占位组件`<Outlet />`

### 路由手动跳转，不使用Link

```jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import routes from './router'

export function App(props) {
  const navigate = useNavigate()
  
  function navigateTo(path) {
    navigate(path)
  }

  return (
    <div className='app'>
      <div className='header'>
        <span>header</span>
        <div className='nav'>
          <button onClick={e => navigateTo("/category")}>分类</button>
          <span onClick={e => navigateTo("/order")}>订单</span>
        </div>
        <hr />
      </div>
      <div className='footer'>
        <hr />
        Footer
      </div>
    </div>
  )
}

export default App
```

函数式组件可以使用 useNavgate hook 如上，但是 class 组件不可以使用。

如果class组件也需要使用，则可以通过高阶组件进行增强。

```js
// hoc/with_router.js
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom"
// 高阶组件: 函数
function withRouter(WrapperComponent) {
  return function(props) {
    // 1.导航
    const navigate = useNavigate()

    // 2.动态路由的参数: /detail/:id
    const params = useParams()

    // 3.查询字符串的参数: /user?name=why&age=18
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const query = Object.fromEntries(searchParams)

    const router = { navigate, params, location, query }

    return <WrapperComponent {...props} router={router}/>
  }
}

export default withRouter
```

```jsx
// Home.jsx
import React, { PureComponent } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { withRouter } from "../hoc"

export class Home extends PureComponent {
  navigateTo(path) {
    const { navigate } = this.props.router
    navigate(path)
  }

  render() {
    return (
      <div>
        <h1>Home Page</h1>
        <div className='home-nav'>
          <Link to="/home/recommend">推荐</Link>
          <Link to="/home/ranking">排行榜</Link>
          <button onClick={e => this.navigateTo("/home/songmenu")}>歌单</button>
        </div>

        {/* 占位的组件 */}
        <Outlet/>
      </div>
    )
  }
}

export default withRouter(Home)
```

### 路由参数传递

1. 动态路由

```jsx
<Route path='/detail/:id' element={<Detail/>}/>
```

获取参数通过 useParams hook，也可封装到 高阶函数 withRouter 中

```js
import { useParams } from "react-router-dom"
const params = useParams()
const id = params.id
```

2. 查询字符串：通过 useLocation hook 可以获取 queryString

   ```js
   import { useLocation } from "react-router-dom"
   const queryString = useLocation() // 一个对象，有url的一些信息
   ```

   useSearchParams hook

   ```js
   import { useSearchParams } from "react-router-dom"
   // searchParams 是一个 URLSearchParams 对象
   const [serachParams, setSearchParams] = useSearchParams()
   console.log(searchParams.get('name'))
   ```




### 通过配置文件生成路由

react-router 5.x 需要安装 react-router-config 库才可以通过配置文件生成路由

react-router 6.x 默认支持配置文件生成路由

还支持分包通过 React.lazy，import函数的 webpack 的特性，还可以懒加载第三方库

```js
import Home from '../pages/Home'
import HomeRecommend from "../pages/HomeRecommend"
import HomeRanking from "../pages/HomeRanking"
// import About from "../pages/About"
// import Login from "../pages/Login"
import NotFound from '../pages/NotFound'
import Detail from '../pages/Detail'
import { Navigate } from 'react-router-dom'
import React from 'react'

const About = React.lazy(() => import("../pages/About"))
const Login = React.lazy(() => import("../pages/Login"))

const routes = [
  {
    path: "/",
    element: <Navigate to="/home"/>
  },
  {
    path: "/home",
    element: <Home/>,
    children: [
      {
        path: "/home",
        element: <Navigate to="/home/recommend"/>
      },
      {
        path: "/home/recommend",
        element: <HomeRecommend/>
      },
    ]
  },
  {
    path: "/about",
    element: <About/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/category",
    element: <Category/>
  },
  {
    path: "/detail/:id",
    element: <Detail/>
  },
  {
    path: "*",
    element: <NotFound/>
  }
]


export default routes

```

使用 React.lazy 懒加载组件时，还需要做以下配置，添加Suspense，当异步组件在加载时，先显式 fallback 属性中的组件

```js
// import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { HashRouter } from "react-router-dom"
import { Suspense } from "react"

const root = ReactDOM.createRoot(document.querySelector("#root"))
root.render(
  // <StrictMode>
    <HashRouter>
      <Suspense fallback={<h3>Loading...</h3>}>
        <App/>
      </Suspense>
    </HashRouter>
  // </StrictMode>
)
```
