#### Vuex（单一状态树，只有一个数据源一个store）

##### Vuex的基本使用

1. 安装 Vuex   npm install vuex

2. 创建store文件夹，index.js

3. 引入 createStore，创建store，导出store
   import { createStore } from 'vuex'
   const store = createStore({

   ​	state: () => ({ counter: 100 })

   })
   export default store

4. 在template中使用时

   - {{ $store.state.counter }}

5. 在optionsAPI中使用时

   - this.$store.state.counter

6. 在setup中使用时

   - import { useStore } from 'vuex'
   - const store = useStore()
   - const stateCounter = store.state.counter // 此时stateCounter不是响应式的，如果需要是响应式数据，则需要如下做
     const stateCounter = toRefs(store.state.counter)



##### 组件获取状态

之前获取store中的状态(state)表达式过长，所以使用辅助函数(mapState)来获取会更方便。

- 在OptionsAPI中使用mapState

  - export default {
        computed: {
          fullname() {
            return "xxx"
          },
          // name() {
          //   return this.$store.state.name
          // },
          ...mapState(["name", "level", "avatarURL"]),
          ...mapState({
            sName: state => state.name,
            sLevel: state => state.level
          })
        }
      }

- 在setup中使用mapState

  1. 一步一步获取

     const { name, level } = mapState(["name", "level"])
     const store = useStore()
     const cName = computed(name.bind({ $store: store }))
     const cLevel = computed(level.bind({ $store: store }))

  2. 封装 useState hook

     import { computed } from 'vue'
     import { useStore, mapState } from 'vuex'

     export default function useState(mapper) {
       const store = useStore()
       const stateFnsObj = mapState(mapper)

       const newState = {}
       Object.keys(stateFnsObj).forEach(key => {
         newState[key] = computed(stateFnsObj[key].bind({ $store: store }))
       })

       return newState
     }

  3. 直接对store.state进行解构(推荐)

     const store = useStore()
     const { name, level } = toRefs(store.state) // 使用toRefs 使解构数据变成响应式

##### getters

- 基本使用

  getters: {

  ​	doubleCounter(state) {
  ​      return state.counter * 2
  ​    },

  }

- getters第二个参数

  // 2.在该getters属性中, 获取其他的getters
  message(state, getters) {
        return `name:${state.name} level:${state.level} friendTotalAge:${getters.totalAge}`
      },

- getter的返回函数

  getFriendById(state) {
        return function(id) {
          const friend = state.friends.find(item => item.id === id)
          return friend
        }
      }

  模板中使用时：{{ $store.getters.getFriendById(111) }}

- 在OptionsAPI中使用mapGetters

  computed: {

  ​	...mapGetters(['totalPrice']),

  ​	...mapGetters({

  ​		price: 'totalPrice',

  ​		name: 'myName'

  ​	})

  }

- 在setup中使用mapGetters

  同state封装类似

  注意点：

  const { message } = toRefs(store.getters) // store.getters不是响应式，使用toRefs会报警告，换成以下写法：

  const message = computed(() => store.getters.message)

##### Mutation

###### Mutation基本使用

mutations: {

	increment(state) {
	  state.counter++
	},
	changeName(state, payload) { // payload 是触发mutation时携带的参数
	  state.name = payload
	},

}

###### 触发mutation

- 在OptionsAPI

  - this.$store.commit('changeName', 'wx')
  - this.$store.commit({ type: 'changeName', name: 'wx' })

- 在OptionsAPI使用mapMutations

  methods: {
        btnClick() {
          console.log("btnClick")
        },
        ...mapMutations(["changeName", "incrementLevel", CHANGE_INFO])
      } 

- 在setup中使用mapMutations

  const store = useStore()

    // 1.手动的映射和绑定
    const mutations = mapMutations(["changeName", "incrementLevel", CHANGE_INFO])
    const newMutations = {}
    Object.keys(mutations).forEach(key => {
      newMutations[key] = mutations[key].bind({ $store: store })
    })
    const { changeName, incrementLevel, changeInfo } = newMutations

###### mutation重要原则

mutation必须是同步函数

重要的原则: 不要在mutation方法中执行异步操作

原因：

- 这是因为devtool工具会记录mutation的日志； 
- 每一条mutation被记录，devtools都需要捕捉到前一状态和后一状态的快照； 
- 但是在mutation中执行异步操作，就无法追踪到数据的变化；

##### actions

###### 基本使用

非常重要的参数context

-  context是一个和store实例均有相同方法和属性的context对象；
-  所以我们可以从其中获取到commit方法来提交一个mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters；

actions: {

  incrementAction(context) {

   *// console.log(context.commit) // 用于提交mutation*

   *// console.log(context.getters) // getters*

   *// console.log(context.state) // state*

   context.commit("increment")

  },

  changeNameAction(context, payload) {

   context.commit("changeName", payload)

  },

 },

###### actions的分发操作

- OptionsAPI

  - this.$store.dispatch('increment')
  - this.$store.dispatch('increment', {count: 100})
  - this.$store.dispatch({ type: "increment", count: 100 })

- OptionsAPI使用mapActions

  methods: {

     	...mapActions(["incrementAction", "changeNameAction"])

    }

- 在setup中使用mapActions

  1. 在setup中使用mapActions辅助函数

     const actions = mapActions(["incrementAction", "changeNameAction"])

      const newActions = {}

      *Object.keys(actions).forEach(key => {*

      newActions[key] = actions[key].bind({ $store: store })

      })

      const { incrementAction, changeNameAction } = newActions

  2. 使用默认的做法

     function increment() {

       store.dispatch("incrementAction")

      }

###### actions的异步操作

Action 通常是异步的，那么如何知道 action 什么时候结束呢？

我们可以通过让action返回Promise，在Promise的then中来处理完成后的操作；

##### modules

import homeModule from './modules/home'

import counterModule from './modules/counter'

...

modules: {

  home: homeModule,

  counter: counterModule

 }

- 在模板中使用

  1. 使用state时, 是需要state.moduleName.xxx
     $store.state.home.banners
  2. 使用getters时, 是直接getters.xxx
     $store.getters.doubleCount

- 在setup中使用

   import { useStore } from 'vuex'

   *// 告诉Vuex发起网络请求*

   const store = useStore()

   store.dispatch("fetchHomeMultidataAction").then(res => {

    console.log("home中的then被回调:", res)

  })

  *// 派发事件时, 默认也是不需要跟模块名称*

   *// 提交mutation时, 默认也是不需要跟模块名称*

  function incrementCount() {

    store.dispatch("incrementCountAction")
  
   }

