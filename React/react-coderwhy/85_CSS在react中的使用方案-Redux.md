## CSS modules

css modules并不是React特有的解决方案，而是所有使用了类似于webpack配置的环境下都可以使用的。如果需要使用，则需要进行配置 webpack.config.js 中的modules: true。

react脚手架默认启用了 module

使用方式：

1. 首选需要把css文件命名为xxx.module.css(如果是less文件则是xxx.module.less)
2. 引入...module.css 如：import homeStyle from './home.module.css'
3. 在react组件render函数的DOM中使用 className={{homeStyle.title}}

优点：

- 解决了局部作用域的问题

缺点：

- 引用的类名，不能使用连接符（.home-title），在JavaScript中是不识别的
- 所有的className都必须使用 xxx.类名(homeStyle.title)的形式来编写
- 不方便动态来修改某些样式，依然需要使用内联样式的方式

### 高级配置（less的配置）

如果需要项目中支持less、sass来进行编写样式，则需要下载craco库对默认脚手架进行配置。

使用craco(create-react-app-config)对 react默认脚手架进行额外配置，需要先下载craco库支持create-react-app 的版本是 v4.x

- yarn add @craco/craco
- npm install @craco/craco

如果create-react-app 版本过高v5.x，则需要下载alpha版本

- npm install @craco/craco@alpha 

配置：

1. 项目根目录新建craco.config.js

2. 更改package.json文件的script脚本改成 craco xxx

   ```js
   "scripts": {
       "start": "craco start"
   }
   ```

3. 下载 craco-less 库，用于配置less

   如果create-react-app 版本过高v5.x，则需要下载alpha版本

   - npm install craco-less@alpha 

4. 在craco.config.js中写webpack的配置

   ```js
   const CracoLessPlugin = require('craco-less');
   
   module.exports = {
     plugins: [
       {
         plugin: CracoLessPlugin,
         options: {
           lessLoaderOptions: {
             lessOptions: {
               modifyVars: { '@primary-color': '#1DA57A' },
               javascriptEnabled: true,
             },
           },
         },
       },
     ],
   };
   ```

### React UI库

- Ant Design 国内 使用less编写样式
- material UI 国外  使用 css in js 编写样式

## CSS In JS

styled-components

emotion

glamorous

### styled-components

npm i styled-components

```js
// style.js
import styled from 'styled-components'

export const AppWrapper = styled.div`
	.title {
		color: red;
	}
	.footer {
		border: 1px solid green;
	}
`
```

```react
// App.js
import React, { PureCompoent } from 'react'
import { AppWrapper } from './style'

export class App extends PureComponent {
	render() {
		return (
			<AppWrapper>
				<h2 className='title'></h2>
				<div className='footer'></div>
			</AppWrapper>
		)
	}
}
export default App
```

- 可传入props

  ```react
  <AppWrapper size={size} color={color}>
  	<h2 className='title'></h2>
  	<div className='footer'></div>
  </AppWrapper>
  ```

- 可抽取样式为样式组件

  ```js
  export const SectionWrapper = styled.div`
    border: 1px solid red;
  
    .title {
      font-size: ${props => props.size}px;
      color: ${props => props.tColor};
  
      &:hover {
        background-color: purple;
      }
    }
  `
  ```

  ```react
  <AppWrapper>
          <SectionWrapper size={size}>
            <h2 className='title'>我是标题</h2>
            <p className='content'>我是内容, 哈哈哈</p>
            <button onClick={e => this.setState({color: "skyblue"})}>修改颜色</button>
          </SectionWrapper>
        </AppWrapper>
  ```

- 通过attrs传默认值

  ```js
  export const SectionWrapper = styled.div.attrs(props => ({
    tColor: props.color || "blue"
  }))`
    border: 1px solid red;
  
    .title {
      font-size: ${props => props.size}px;
      color: ${props => props.tColor};
  
      &:hover {
        background-color: purple;
      }
    }
  `
  ```

- 继承

## classnames

npm i classnames

```js
import classNames from 'classnames'
```

```react
<h2 className={classNames("aaa", { bbb:isbbb, ccc:isccc })}>嘿嘿嘿</h2>
<h2 className={classNames(["aaa", { bbb: isbbb, ccc: isccc }])}>嘻嘻嘻</h2>
```

## Redux

###三大原则

1. 单一数据源
2. state 是只读的
3. 使用纯函数来执行修改

### 安装

`npm install redux --save`

`yarn add redux`

- action
  - 所有数据的变化，必须通过派发（dispatch）action来更新
  - action是一个普通的JavaScript对象，用来描述这次更新的type和content
- reducer
  - 是一个纯函数
  - 将传入的state和action结合起来生成一个新的state
- dispatch
  - 派发action，改变state
  - 会重新执行reducer

###四个优化点

1. 将 action 的生成改为一个函数actionCreators来进行
2. 将定义的所有actionCreators的函数, 放到一个独立的文件中: actionCreators.js
3. actionCreators和reducer函数中使用字符串常量是一致的，所以将常量抽取到一个独立constants的文件中
4. 将reducer和默认值(initialState)放到一个独立的reducer.js文件中, 而不是在index.js

### node中对ES6模块化的支持

- node v13.2.0之前
  1. 在package.json中添加属性："type": "module"
  2. 在执行命令中添加如下选项：node --experimental-modules src/index.js
- node v13.2.0之后
  1. 在package.json中添加属性："type": "module"

注意：导入文件时，需要跟上 .js 后缀名。
