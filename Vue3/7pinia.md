### Pinia（状态管理的库，用于跨组件、页面进行状态共享）

#### 安装

yarn add pinia

npm install pinia

#### 创建一个pinia并且将其传递给应用程序

import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia

##### main.js

import pinia from './store'

createApp(App).use(pinia).mount('#app')

#### Pinia Store

- 什么是Store？
  - 一个 Store （如 Pinia）是一个实体，它会持有为绑定到你组件树的状态和业务逻辑，也就是保存了全局的状态；
  - 它有点像始终存在，并且每个人都可以读取和写入的组件；
  - 你可以在你的应用程序中定义任意数量的Store来管理你的状态；
- Store有三个核心概念：
  -  state、getters、actions；
  - 等同于组件的data、computed、methods；
  - 一旦 store 被实例化，你就可以直接在 store 上访问 state、getters 和 actions 中定义的任何属性

#### 定义一个Store

Store 是使用 defineStore() 定义的，并且它需要一个唯一名称，作为第一个参数传递；

export const useCounter = defineStore('counter', {

​	state() {

​		return { counter: 0 }

​	}

})

这个 name，也称为 id，是必要的，Pinia 使用它来将 store 连接到 devtools。

返回的函数统一使用useX作为命名方案，这是约定的规范。

#### 使用Store

import { storeToRefs } from 'pinia'

import useCounter from '@/stores/counter';

const counterStore = useCounter()

const { count } = storeToRefs(counterStore)// 使解构的count是响应式的数据

function incrementCount() {

  counterStore.count++

 }

为了从 Store 中提取属性同时保持其响应式，您需要使用storeToRefs()

#### 认识和定义State

state 是 store 的核心部分，因为store是用来帮助我们管理状态的。

在 Pinia 中，状态被定义为返回初始状态的函数；

export const useCounter = defineStore('counter', {

​	state: () => ({

​		counter: 0,

​		name: 'wx'

​	})

})

- 读取和写入 state

  - 默认情况下，您可以通过 store 实例访问状态来直接读取和写入状态

    const counterStore = useCounter()

    counterStore.counter++

    counterStore.name = 'wxxx'

  - 重置State

    你可以通过调用 store 上的 $reset() 方法将状态 重置 到其初始值；

    const counterStore = useCounter()

    counterStore.$reset()

  - 改变State

    除了直接用 store.counter++ 修改 store，你还可以调用 $patch 方法；

    它允许你使用部分“state”对象同时应用多个更改；

    const counterStore = useCounter()

    counterStore.$patch({

    ​	counter: 100,

    ​	name: 'www'

    })

  - 替换State

    使用$state属性设置为新对象来替换 Store 的整个状态

    counterStore.$state = {

    ​	counter: 1,

    ​	name: 'cccc'

    }

#### 认识和定义Getters

- Getters相当于Store的计算属性
  - 它们可以用 defineStore() 中的 getters 属性定义
  - getters中可以定义接受一个state作为参数的函数

getters: {

  *// 1.基本使用*

  doubleCount(state) {

   return state.count * 2

  },

  *// 2.一个getter引入另外一个getter*

  doubleCountAddOne() {

   *// this是store实例*

   return this.doubleCount + 1

  },

  *// 3.getters也支持返回一个函数*

  getFriendById(state) {

   return function(id) {

​    for (let i = 0; i < state.friends.length; i++) {

​     const friend = state.friends[i]

​     if (friend.id === id) {

​      return friend

​     }

​    }

   }

  },

  *// 4.getters中用到别的store中的数据*

  showMessage(state) {

   *// 1.获取user信息*

   const userStore = useUser()

   *// 2.获取自己的信息*

   *// 3.拼接信息*

   return `name:${userStore.name}-count:${state.count}`

  }

 }

#### 认识和定义Actions

Actions 相当于组件中的 methods。

可以使用 defineStore() 中的 actions 属性定义，并且它们非常适合定义业务逻辑

定义：

actions: {

  increment() {

   this.count++

  },

  incrementNum(num) {

   this.count += num

  }

 }

使用:

import useCounter from '@/stores/counter';

 import useHome from '@/stores/home';

 const counterStore = useCounter()

 function changeState() {

  *// counterStore.increment()*

  counterStore.incrementNum(10)

 }

和getters一样，在action中可以通过this访问整个store实例的所有操作；

#### Actions执行异步操作

并且Actions中是支持异步操作的，并且我们可以编写异步函数，在函数中使用await

定义：

actions: {

  async fetchHomeMultidata() {

   const res = await fetch("xxx")

   const data = await res.json()

  }

 }

使用：

const homeStore = useHome()

homeStore.fetchHomeMultidata().then(res => {

  console.log("fetchHomeMultidata的action已经完成了:", res)

 })