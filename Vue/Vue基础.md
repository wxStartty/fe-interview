https://juejin.cn/post/6919373017218809864

一、Vue 基础

1. Vue 的基本原理
   当一个 Vue 实例创建时，Vue 会遍历 data 中的属性，用 Object.defineProperty（vue3.0 使用 proxy ）将它们转为 getter/setter，并且在内部追踪相关依赖，在属性被访问和修改时通知变化。 每个组件实例都有相应的 watcher 程序实例，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 setter 被调用时，会通知 watcher 重新计算，从而致使它关联的组件得以更新。

2.Computed 和 Watch 的区别
Computed：
（1）它支持缓存，只有依赖的数据发生了变化，才会重新计算
（2）支持异步，当 Computed 中有异步操作时，无法监听数据的变化
（3）computed 的值会默认走缓存，计算属性是基于它们的响应式依赖进行缓存的，也就是基于 data 声明过，或者父组件传递过来的 props 中的数据进行计算的。
（4）如果一个属性是由其他属性计算而来的，这个属性依赖其他的属性，一般会使用 computed
（5）如果 computed 属性的属性值是函数，那么默认使用 get 方法，函数的返回值就是属性的属性值；在 computed 中，属性有一个 get 方法和一个 set 方法，当数据发生变化时，会调用 set 方法。

Watch：
（1）它不支持缓存，数据变化时，它就会触发相应的操作
（2）支持异步监听
（3）监听的函数接收两个参数，第一个参数是最新的值，第二个是变化之前的值
（4）当一个属性发生变化时，就需要执行相应的操作
（5）监听数据必须是 data 中声明的或者父组件传递过来的 props 中的数据，当发生变化时，会触发其他操作，函数有两个的参数：
immediate：组件加载立即触发回调函数
deep：深度监听，发现数据内部的变化，在复杂数据类型中使用，例如数组中的对象发生变化。需要注意的是，deep 无法监听到数组和对象内部的变化。
当想要执行异步或者昂贵的操作以响应不断的变化时，就需要使用 watch。

3. Computed 和 Methods 的区别
   可以将同一函数定义为一个 method 或者一个计算属性。对于最终的结果，两种方式是相同的
   不同点：
   computed: 计算属性是基于它们的依赖进行缓存的，只有在它的相关依赖发生改变时才会重新求值；
   method 调用总会执行该函数。

4. slot 是什么？有什么作用？原理是什么？
   slot 又名插槽，是 Vue 的内容分发机制，组件内部的模板引擎使用 slot 元素作为承载分发内容的出口。插槽 slot 是子组件的一个模板标签元素，而这一个标签元素是否显示，以及怎么显示是由父组件决定的。slot 又分三类，默认插槽，具名插槽和作用域插槽。
   （1）默认插槽：又名匿名插槽，当 slot 没有指定 name 属性值的时候一个默认显示插槽，一个组件内只有有一个匿名插槽。
   （2）具名插槽：带有具体名字的插槽，也就是带有 name 属性的 slot，一个组件可以出现多个具名插槽。
   子组件：
   <slot name="footer"></slot>
   父组件：
   <wx-form>
   
   <template #footer>（v-slot 只能添加在 template 上）
   <div>Footer</div>
   </template>
   </wx-form>
   （3）作用域插槽：默认插槽、具名插槽的一个变体，可以是匿名插槽，也可以是具名插槽，该插槽的不同点是在子组件渲染作用域插槽时，可以将子组件内部的数据传递给父组件，让父组件根据子组件的传递过来的数据决定如何渲染该插槽。
   子组件：
   <slot :nickName="wx"></slot>
   父组件：
   <slot-child>
   <template v-slot:default="scope">
   <div>{{scope.nickName}}</div>
   </template>
   </slot-child>
   
   实现原理：当子组件 vm 实例化时，获取到父组件传入的 slot 标签的内容，存放在 vm.$slot中，默认插槽为vm.$slot.default，具名插槽为 vm.$slot.xxx，xxx 为插槽名，当组件执行渲染函数时候，遇到slot标签，使用$slot 中的内容进行替换，此时可以为插槽传递数据，若存在数据，则可称该插槽为作用域插槽。

5.如何保存页面的当前的状态
组件会被卸载：
（1）LocalStorage / SessionStorage
（2）路由传值
组件不会被卸载
（3）keep-alive meta:{ keepAlive: true } 执行的生命周期 activated、deactivated

6. 常见的事件修饰符及其作用
   .stop：等同于 JavaScript 中的 event.stopPropagation() ，防止事件冒泡；
   .prevent ：等同于 JavaScript 中的 event.preventDefault() ，防止执行预设的行为（如果事件可取消，则取消该事件，而不停止事件的进一步传播）；
   .capture ：与事件冒泡的方向相反，事件捕获由外到内；
   .self ：只会触发自己范围内的事件，不包含子元素；
   .once ：只会触发一次。

7. v-if、v-show、v-html 的原理（多）
   v-if 会调用 addIfCondition 方法，生成 vnode 的时候会忽略对应节点，render 的时候就不会渲染；
   v-show 会生成 vnode，render 的时候也会渲染成真实节点，只是在 render 过程中会在节点的属性中修改 show 属性值，也就是常说的 display；
   v-html 会先移除节点下的所有节点，调用 html 方法，通过 addProp 添加 innerHTML 属性，归根结底还是设置 innerHTML 为 v-html 的值。

8. v-if 和 v-show 的区别
   手段：v-if 是动态的向 DOM 树内添加或者删除 DOM 元素；v-show 是通过设置 DOM 元素的 display 样式属性控制显隐；
   编译过程：v-if 切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件；v-show 只是简单的基于 css 切换；
   编译条件：v-if 是惰性的，如果初始条件为假，则什么也不做；只有在条件第一次变为真时才开始局部编译; v-show 是在任何条件下，无论首次条件是否为真，都被编译，然后被缓存，而且 DOM 元素保留；
   性能消耗：v-if 有更高的切换消耗；v-show 有更高的初始渲染消耗；
   使用场景：v-if 适合条件不大可能改变；v-show 适合频繁切换。

9. v-model 是如何实现的，语法糖实际是什么？
   （1）作用在表单元素上 动态绑定了 input 的 value 指向了 messgae 变量，并且在触发 input 事件的时候去动态把 message 设置为目标值：
   <input v-model="sth" />
   // 等同于
   <input
   v-bind:value="message"
   v-on:input="message=$event.target.value"
   </input>
   //$event 指代当前触发的事件对象;
   //$event.target 指代当前触发的事件对象的 dom;
   //$event.target.value 就是当前 dom 的 value 值;
   //在@input 方法中，value => sth;
   //在:value 中,sth => value;

   （2）作用在组件上 在自定义组件中，v-model 默认会利用名为 value 的 prop 和名为 input 的事件
   <child :value="message" @input="function(e){message = e.target.value}"></child>

   在组件的实现中，可以通过 v-model 属性来配置子组件接收的 prop 名称，以及派发的事件名称。 例子：
   // 父组件
   <aa-input v-model="aa"></aa-input>
   // 等价于
   <aa-input v-bind:value="aa" v-on:input="aa=$event.target.value"></aa-input>

   // 子组件：
   <input v-bind:value="aa" v-on:input="onmessage"></aa-input>
   props:{value:aa,}
   methods:{
   onmessage(e){
   $emit('input',e.target.value)
   }
   }

10. v-model 可以被用在自定义组件上吗？如果可以，如何使用？
    可以。v-model 实际上是一个语法糖，如：
    <input v-model="searchText">
    实际上相当于：
    <input
    v-bind:value="searchText"
    v-on:input="searchText = $event.target.value"

    > </input>

    用在自定义组件上也是同理：
    <custom-input v-model="searchText">

    相当于：
    <custom-input
    v-bind:value="searchText"
    v-on:input="searchText = $event"

    > </custom-input>

显然，custom-input 与父组件的交互如下：
父组件将 searchText 变量传入 custom-input 组件，使用的 prop 名为 value；
custom-input 组件向父组件传出名为 input 的事件，父组件将接收到的值赋值给 searchText；

所以，custom-input 组件的实现应该类似于这样：
Vue.component('custom-input', { props: ['value'], template: `<input v-bind:value="value" v-on:input="$emit('input', $event.target.value)" >` })

16. data 为什么是一个函数而不是对象
    JavaScript 中的对象是引用类型的数据，当多个实例引用同一个对象时，只要一个实例对这个对象进行操作，其他实例中的数据也会发生变化。
    而在 Vue 中，更多的是想要复用组件，那就需要每个组件都有自己的数据，这样组件之间才不会相互干扰。
    所以组件的数据不能写成对象的形式，而是要写成函数的形式。数据以函数返回值的形式定义，这样当每次复用组件的时候，就会返回一个新的 data，也就是说每个组件都有自己的私有数据空间，它们各自维护自己的数据，不会干扰其他组件的正常运行。

17. 对 keep-alive 的理解，它是如何实现的，具体缓存的是什么？

18. $nextTick 原理及作用
    nextTick 的核心是利用了如 Promise 、MutationObserver、setImmediate、setTimeout 的原生 JavaScript 方法来模拟对应的微/宏任务的实现，本质是为了利用 JavaScript 的这些异步回调任务队列来实现 Vue 框架中自己的异步回调队列。

    以下情况下，会用到 nextTick：
    在数据变化后执行的某个操作，而这个操作需要使用随数据变化而变化的 DOM 结构的时候，这个操作就需要方法在 nextTick()的回调函数中。
    在 vue 生命周期中，如果在 created()钩子进行 DOM 操作，也一定要放在 nextTick()的回调函数中。

19. Vue 中给 data 中的对象属性添加一个新的属性时会发生什么？如何解决？
    新属性添加成功，但视图没有更新，这时就需要使用 Vue 的全局 api $set()：
    $set()方法相当于手动的去把 obj.b 处理成一个响应式的属性，此时视图也会跟着改变了。

20. Vue 中封装的数组方法有哪些，其如何实现页面更新
    在 Vue 中，对响应式处理利用的是 Object.defineProperty 对数据进行拦截，而这个方法并不能监听到数组内部变化，数组长度变化，数组的截取变化等，所以需要对这些操作进行 hack，让 Vue 能监听到其中的变化。
    Vue 将被侦听的数组的变更方法进行了包裹，所以它们也将会出发视图的更新。这些包裹的方法有：push pop shift unshift splice sort reverse

21. Vue 单页应用与多页应用的区别
    概念：
    SPA 单页面应用（SinglePage Web Application），指只有一个主页面的应用，一开始只需要加载一次 js、css 等相关资源。所有内容都包含在主页面，对每一个功能模块组件化。单页应用跳转，就是切换相关组件，仅仅刷新局部资源。
    MPA 多页面应用 （MultiPage Application），指有多个独立页面的应用，每个页面必须重复加载 js、css 等相关资源。多页应用跳转，需要整页资源刷新。

22. Vue template 到 render 的过程 2

23. Vue data 中某一个属性的值发生改变后，视图会立即同步执行重新渲染吗？
    不会立即同步执行重新渲染。Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新。Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化， Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。
    如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环 tick 中，Vue 刷新队列并执行实际（已去重的）工作。

24. 简述 mixin、extends 的覆盖逻辑

25. 描述下 Vue 自定义指令
    全局定义：Vue.directive("focus",{})
    局部定义：directives:{focus:{}}
    钩子函数：指令定义对象提供钩子函数
    bind
    inSerted
    update
    ComponentUpdate
    unbind

26. 子组件可以直接改变父组件的数据吗？
    只能通过 $emit 派发一个自定义事件，父组件接收到后，由父组件修改。

27. Vue 是如何收集依赖的？4

28. 对 React 和 Vue 的理解，它们的异同 1
    相似之处：
    都将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库；
    都有自己的构建工具，能让你得到一个根据最佳实践设置的项目模板；
    都使用了 Virtual DOM（虚拟 DOM）提高重绘性能；
    都有 props 的概念，允许组件间的数据传递；
    都鼓励组件化应用，将应用分拆成一个个功能明确的模块，提高复用性。

    不同之处 ：
    1）数据流
    Vue 默认支持数据双向绑定，而 React 一直提倡单向数据流
    2）虚拟 DOM
    Vue 宣称可以更快地计算出 Virtual DOM 的差异，这是由于它在渲染过程中，会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树。
    对于 React 而言，每当应用的状态被改变时，全部子组件都会重新渲染。当然，这可以通过 PureComponent/shouldComponentUpdate 这个生命周期方法来进行控制，但 Vue 将此视为默认的优化。
    3）组件化
    React 与 Vue 最大的不同是模板的编写。
    Vue 鼓励写近似常规 HTML 的模板。写起来很接近标准 HTML 元素，只是多了一些属性。
    React 推荐你所有的模板通用 JavaScript 的语法扩展——JSX 书写。
    具体来讲：React 中 render 函数是支持闭包特性的，所以 import 的组件在 render 中可以直接调用。但是在 Vue 中，由于模板中使用的数据都必须挂在 this 上进行一次中转，所以 import 一个组件完了之后，还需要在 components 中再声明下。
    4）监听数据变化的实现原理不同
    Vue 通过 getter/setter 以及一些函数的劫持，能精确知道数据变化，不需要特别的优化就能达到很好的性能
    React 默认是通过比较引用的方式进行的，如果不优化（PureComponent/shouldComponentUpdate）可能导致大量不必要的 vDOM 的重新渲染。这是因为 Vue 使用的是可变数据，而 React 更强调数据的不可变。
    5）高阶组件
    React ==> HOC
    6）构建工具
    React ==> Create React APP
    Vue ==> vue-cli
    7）跨平台
    React ==> React Native
    Vue ==> Weex

29. Vue 的优点 1

30. assets 和 static 的区别 3

31. delete 和 Vue.delete 删除数组的区别 3
    delete 只是被删除的元素变成了 empty/undefined 其他的元素的键值还是不变。
    Vue.delete 直接删除了数组 改变了数组的键值。
    Vue.delete()
    删除对象的 property。如果对象是响应式的，确保删除能触发更新视图。这个方法主要用于避开 Vue 不能检测到 property 被删除的限制，但是你应该很少会使用它。

32. vue 如何监听对象或者数组某个属性的变化 2
    当在项目中直接设置数组的某一项的值，或者直接设置对象的某个属性值，这个时候，你会发现页面并没有更新。这是因为 Object.defineProperty()限制，监听不到变化。

    解决方式：
    this.$set(你要改变的数组/对象，你要改变的位置/key，你要改成什么 value)。

    调用以下几个数组的方法
    splice()、 push()、pop()、shift()、unshift()、sort()、reverse()
    vue 源码里缓存了 array 的原型链，然后重写了这几个方法，触发这几个方法的时候会 observer 数据，意思是使用这些方法不用再进行额外的操作，视图自动进行更新。

    vm.$set 的实现原理是：
    如果目标是数组，直接使用数组的 splice 方法触发相应式；
    如果目标是对象，会先判读属性是否存在、对象是否是响应式，最终如果要对属性进行响应式处理，则是通过调用 defineReactive 方法进行响应式处理（ defineReactive 方法就是 Vue 在初始化对象时，给对象属性采用 Object.defineProperty 动态添加 getter 和 setter 的功能所调用的方法）

33. 什么是 mixin ？ 3
    Mixin 使我们能够为 Vue 组件编写可插拔和可重用的功能。
    如果希望在多个组件之间重用一组组件选项，例如生命周期 hook、 方法等，则可以将其编写为 mixin，并在组件中简单的引用它。
    然后将 mixin 的内容合并到组件中。如果你要在 mixin 中定义生命周期 hook，那么它在执行时将优先于组件自已的 hook。

34. Vue 模版编译原理 2
    vue 中的模板 template 无法被浏览器解析并渲染，因为这不属于浏览器的标准，不是正确的 HTML 语法，所有需要将 template 转化成一个 JavaScript 函数，这样浏览器就可以执行这一个函数并渲染出对应的 HTML 元素，就可以让视图跑起来了，这一个转化的过程，就成为模板编译。模板编译又分三个阶段，解析 parse，优化 optimize，生成 generate，最终生成可执行函数 render。

    解析阶段：使用大量的正则表达式对 template 字符串进行解析，将标签、指令、属性等转化为抽象语法树 AST。
    优化阶段：遍历 AST，找到其中的一些静态节点并进行标记，方便在页面重渲染的时候进行 diff 比较时，直接跳过这一些静态节点，优化 runtime 的性能。
    生成阶段：将最终的 AST 转化为 render 函数字符串。

35. 对 SSR 的理解
    SSR 也就是服务端渲染，也就是将 Vue 在客户端把标签渲染成 HTML 的工作放在服务端完成，然后再把 html 直接返回给客户端。

    SSR 的优势：
    更好的 SEO
    首屏加载速度更快

    SSR 的缺点：
    开发条件会受到限制，服务器端渲染只支持 beforeCreate 和 created 两个钩子；
    当需要一些外部扩展库时需要特殊处理，服务端渲染应用程序也需要处于 Node.js 的运行环境；
    更多的服务端负载。

36. Vue 的性能优化有哪些 2
    （1）编码阶段
    尽量减少 data 中的数据，data 中的数据都会增加 getter 和 setter，会收集对应的 watcher
    v-if 和 v-for 不能连用
    如果需要使用 v-for 给每项元素绑定事件时使用事件代理
    SPA 页面采用 keep-alive 缓存组件
    在更多的情况下，使用 v-show 替代 v-if
    key 保证唯一
    使用路由懒加载、异步组件
    防抖、节流
    第三方模块按需导入
    长列表滚动到可视区域动态加载
    图片懒加载
    （2）SEO 优化
    预渲染
    服务端渲染 SSR
    （3）打包优化
    压缩代码
    Tree Shaking/Scope Hoisting
    使用 cdn 加载第三方模块
    多线程打包 happypack
    splitChunks 抽离公共文件
    sourceMap 优化
    （4）用户体验
    骨架屏
    PWA
    还可以使用缓存(客户端缓存、服务端缓存)优化、服务端开启 gzip 压缩等。

37. 对 SPA 单页面的理解，它的优缺点分别是什么？ 1
    优点：
    用户体验好、快，内容的改变不需要重新加载整个页面，避免了不必要的跳转和重复渲染；
    基于上面一点，SPA 相对对服务器压力小；
    前后端职责分离，架构清晰，前端进行交互逻辑，后端负责数据处理；

    缺点：
    初次加载耗时多：为实现单页 Web 应用功能及显示效果，需要在加载页面的时候将 JavaScript、CSS 统一加载，部分页面按需加载；
    前进后退路由管理：由于单页应用在一个页面中显示所有的内容，所以不能使用浏览器的前进后退功能，所有的页面切换需要自己建立堆栈管理；
    SEO 难度较大：由于所有的内容都在一个页面中动态替换显示，所以在 SEO 上其有着天然的弱势。

38. template 和 jsx 的有什么分别？3
    对于 runtime 来说，只需要保证组件存在 render 函数即可，而有了预编译之后，只需要保证构建过程中生成 render 函数就可以。在 webpack 中，使用 vue-loader 编译.vue 文件，内部依赖的 vue-template-compiler 模块，在 webpack 构建过程中，将 template 预编译成 render 函数。与 react 类似，在添加了 jsx 的语法糖解析器 babel-plugin-transform-vue-jsx 之后，就可以直接手写 render 函数。
    所以，template 和 jsx 的都是 render 的一种表现形式，不同的是：JSX 相对于 template 而言，具有更高的灵活性，在复杂的组件中，更具有优势，而 template 虽然显得有些呆滞。但是 template 在代码结构上更符合视图与逻辑分离的习惯，更简单、更直观、更好维护。

39. vue 初始化页面闪动问题 3
    使用 vue 开发时，在 vue 初始化之前，由于 div 是不归 vue 管的，所以我们写的代码在还没有解析的情况下会容易出现花屏现象，看到类似于{{message}}的字样，虽然一般情况下这个时间很短暂，但是还是有必要让解决这个问题的。
    首先：在 css 里加上以下代码：
    [v-cloak] { display: none;}

    如果没有彻底解决问题，则在根元素加上 style="display: none;" :style="{display: 'block'}"

40. extend 有什么作用 4

41. mixin 和 mixins 区别
    mixin 用于全局混入，会影响到每个组件实例，通常插件都是这样做初始化的。
    Vue.mixin({ beforeCreate() { // ...逻辑 // 这种方式会影响到每个组件的 beforeCreate 钩子函数 }})

    mixins 应该是最常使用的扩展组件的方式了。如果多个组件中有相同的业务逻辑，就可以将这些逻辑剥离出来，通过 mixins 混入代码，比如上拉下拉加载数据这种逻辑等等。

    mixins 混入的钩子函数会先于组件内的钩子函数执行，并且在遇到同名选项的时候也会有选择性的进行合并。

42. MVVM 的优缺点? 2
    优点:
    分离视图（View）和模型（Model），降低代码耦合，提⾼视图或者逻辑的重⽤性: ⽐如视图（View）可以独⽴于 Model 变化和修改，⼀个 ViewModel 可以绑定不同的"View"上，当 View 变化的时候 Model 不可以不变，当 Model 变化的时候 View 也可以不变。你可以把⼀些视图逻辑放在⼀个 ViewModel ⾥⾯，让很多 view 重⽤这段视图逻辑
    提⾼可测试性: ViewModel 的存在可以帮助开发者更好地编写测试代码
    ⾃动更新 dom: 利⽤双向绑定,数据更新后视图⾃动更新,让开发者从繁琐的⼿动 dom 中解放

    缺点:
    Bug 很难被调试: 因为使⽤双向绑定的模式，当你看到界⾯异常了，有可能是你 View 的代码有 Bug，也可能是 Model 的代码有问题。数据绑定使得⼀个位置的 Bug 被快速传递到别的位置，要定位原始出问题的地⽅就变得不那么容易了。另外，数据绑定的声明是指令式地写在 View 的模版当中的，这些内容是没办法去打断点 debug 的
    ⼀个⼤的模块中 model 也会很⼤，虽然使⽤⽅便了也很容易保证了数据的⼀致性，当时⻓期持有，不释放内存就造成了花费更多的内存
    对于⼤型的图形应⽤程序，视图状态较多，ViewModel 的构建和维护的成本都会⽐较⾼。
