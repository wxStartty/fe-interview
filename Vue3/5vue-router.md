#### Vue-router

##### 创建router

1. 安装vue-router  npm install vue-router

2. 创建router文件夹，index.js文件

3. 在index.js文件中写入以下代码
   ```js
   import { createRouter, createWebHashHistory } from 'vue-router'
   const router = createRouter({
   
   	history: createWebHashHistory () , // 定义路由模式
   
   	routes:[
   
   		{ path: '/home', component: Home },
   
   		{ path: '/about', component: about},
   
   	]
   
   })
   export default router
   ```
   
   
   
4. 在main.js文件中引入router文件，使用app.use(router)

5. 使用router-view占位

6. 使用router-link进行路由的切换

##### redirect重定向

##### 路由的两种模式创建使用的函数

- hash：createWebHashHistory()
- history：createWebHistory()

##### router-link

- to：字符串或者对象
- replace：调用router.replace()，不会有路由跳转记录
- active-class：自定义激活a元素的class，默认是router-link-active
- exact-active-class：链接精准激活时，应用于渲染<a>的class，默认是router-link-exact-active

##### 路由懒加载

const router = createRouter({

​	history: createWebHashHistory () , // 定义路由模式

​	routes:[

​		{ path: '/home', component: () => import(/* webpackChunkName: 'home' */'./views/Home')},

​		{ path: '/about', component: () => import(/* webpackChunkName: 'about' */'./views/About')},

​	]

})

##### 路由的其它属性

- name：定义组件名称
- meta：自定义路由其它属性值

##### 获取动态路由的值(/user/:id)

- 在template中，直接通过$route.params获取
- 在optionsAPI中，通过this.$route.params获取值
- 在setup中，要使用vue-router库提供的hook useRoute，该 hook 会返回Route对象，对象中保存着当前路由相关的值。
  const route = useRoute()
- 使用 onBeforeRouterUpdate() 可监听路由的from，to

##### NotFound

{ path: "/:pathMatch(.*)", component: () => import("./views/NotFound.vue") 

##### 匹配规则加*

path: "/:pathMatch(.*)\*"

加上*与不加\* 区别在于，加上\* 会解析 /

- path: "/:pathMatch(.*)\*"    ['user', 'ww', '123']
- path: "/:pathMatch(.*)"      user/ww/123

##### 路由嵌套

{ 
      name: "home",
      path: "/home", 
      component: () => import("../Views/Home.vue"),
      meta: {
        name: "why",
        age: 18
      },
      children: [
        {
          path: "/home",
          redirect: "/home/recommend"
        },
        {
          path: "recommend", // /home/recommend
          component: () => import("../Views/HomeRecommend.vue")
        },
        {
          path: "ranking", // /home/ranking
          component: () => import("../Views/HomeRanking.vue")
        },
      ]
    }

##### 代码的页面跳转（编程式导航）

import { useRouter } from ’vue-router‘

const router = useRouter()

const goHome = () => router.push('/home')

or

const goHome = () => router.push({ path: '/home', query: { name: 'wx', age: 18 } }) // 这种方式可以传递其它参数

##### 获取query

$route.query

##### 动态添加路由

- 动态添加一个路由
  const categoryRoute = { path: '/category', component: () => import('../views/Category.vue') }
  router.addRoute(categoryRoute)
- 为 route 添加一个 children 路由
  const homeMomentRoute = { path: '/moment', component: () => import('../views/HomeMoment.vue') }
  router.addRoute('home', homeMomentRoute)

##### 动态路由的其它方法（了解）

- 删除路由
  - 添加一个name相同的路由
    router.addRoute({ path: '/about', name: 'about' component: About })
    // 这将会删除之前已经添加的路由
    router.addRoute({ path: '/other', name: 'about' component: Home})
  - removeRoute
    router.removeRoute('about')
  - 通过 addRoute 方法的返回值回调
    const removeRoute = router.addRoute(routeRecord)
    removeRoute()
- 路由的其他方法补充
  - router.hasRoute()   检查路由是否存在
  - router.getRoutes()   获取一个包含所有路由记录的数据

##### 路由导航守卫

主要用来跳转或取消的方式守卫导航

- beforeEach（全局的前置守卫）
  router.beforeEach((to, from) => {

  ​	console.log(to, from)

  ​	return false

  })

  - 它有返回值
    - false：取消当前导航
    - 不返回或者undefined：进行默认导航
    - 返回一个路由地址：可以是string类型路径，也可以是对象
  - 可选的第三个参数：next（不推荐使用）
    - 在Vue2中我们是通过next函数来决定如何进行跳转的；
    - 但是在Vue3中我们是通过返回值来控制的，不再推荐使用next函数，这是因为开发中很容易调用多次next；

##### 登录守卫功能

router.beforeEach((to, from) => {

 *// 1.进入到任何别的页面时, 都跳转到login页面*

 *// if (to.path !== "/login") {*

 *//  return "/login"*

 *// }*



 *// 2.进入到订单页面时, 判断用户是否登录*

 const token = localStorage.getItem("token")

 if (to.path === "/order" && !token) {

  return "/login"

 }

})

##### 其他导航守卫（https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%85%A8%E5%B1%80%E5%90%8E%E7%BD%AE%E9%92%A9%E5%AD%90）

- beforeResolve（全局解析守卫）

- afterEach（全局后置钩子）

- 路由独享的守卫  beforeEnter

  const routes = [
    {
      path: '/users/:id',
      component: UserDetails,
      beforeEnter: (to, from) => {
        // reject the navigation
        return false
      },
    },
  ]

- 组件内的守卫

  - beforeRouteEnter
  - beforeRouteUpdate
  - beforeRouteLeave

  ```
  beforeRouteEnter(to, from, next) {
      // 在渲染该组件的对应路由被验证前调用
      // 不能获取组件实例 `this` ！
      // 因为当守卫执行时，组件实例还没被创建！
      next(vm => {
   	  // 通过 `vm` 访问组件实例
      })
    },
    beforeRouteUpdate(to, from) {
      // 在当前路由改变，但是该组件被复用时调用
      // 举例来说，对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，
      // 由于会渲染同样的 `UserDetails` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
      // 因为在这种情况发生的时候，组件已经挂载好了，导航守卫可以访问组件实例 `this`
    },
    beforeRouteLeave(to, from) {
      // 在导航离开渲染该组件的对应路由时调用
      // 与 `beforeRouteUpdate` 一样，它可以访问组件实例 `this`
    },
  ```

  如果你正在使用[组合 API 和 `setup` 函数](https://v3.vuejs.org/guide/composition-api-setup.html#setup)来编写组件，你可以通过 `onBeforeRouteUpdate` 和 `onBeforeRouteLeave` 分别添加 update 和 leave 守卫。 请参考[组合 API 部分](https://router.vuejs.org/zh/guide/advanced/composition-api.html#导航守卫)以获得更多细节。

##### 下完整的导航解析流程

- 导航被触发。 

- 在失活的组件里调用 beforeRouteLeave 守卫。 

- 调用全局的 beforeEach 守卫。 

- 在重用的组件里调用 beforeRouteUpdate 守卫(2.2+)。 
- 在路由配置里调用 beforeEnter。 
- 解析异步路由组件。 
- 在被激活的组件里调用 beforeRouteEnter。 
- 调用全局的 beforeResolve 守卫(2.5+)。 
- 导航被确认。 
- 调用全局的 afterEach 钩子。
- 触发 DOM 更新。 
- 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。