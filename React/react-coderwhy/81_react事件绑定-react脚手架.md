### JSX

#### React事件绑定

#### this绑定的问题

this的绑定四种规则

1. 默认绑定  独立执行 foo()
2. 隐式绑定 被一个对象执行obj.foo() ->obj
3. 显式绑定：call/apply/bind  foo.call('aaa') -> String('aaa')
4. new绑定：new foo() -> 创建一个新对象，并且赋值给this

#### 条件渲染

- if
- 三目
- &&逻辑与

#### 列表渲染

#### JSX本质和原理

- JSX本质
  - 实际上，JSX仅仅只是 React.createElement(component, prop, ...children) 函数的语法糖



###React 脚手架

- vue：@vue/cli
- angular：@angular/cli
- react：create-react-app

react脚手架依赖node，需要下载配置好node环境

#### PWA（了解）

Progressive Web App，渐进式WEB应用

- 一个PWA应用首先是一个网页，可以通过 Web 技术编写出一个网页应用
- 随后添加上 App Manifest 和 Service Worker 来实现PWA的安装和离线等功能
- 这种Web存在的形式，称之为 Web App

PWA解决哪些问题？

- 可以添加至主屏幕（手机桌面），点击主屏幕图标可以实现启动动画以及隐藏地址栏
- 实现离线缓存功能，即使用户手机没有网络，依然可以使用一些离线功能
- 实现消息推送

#### 知识点

- npm run eject（该操作不可逆）  弹出 react 脚手架中 webpack 的配置