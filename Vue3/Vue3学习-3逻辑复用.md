## 组合式函数

在 Vue 应用的概念中，“组合式函数”(Composables) 是一个利用 Vue 的组合式 API 来封装和复用**有状态逻辑**的函数。

### 鼠标跟踪器示例

`useMouse()`

```js
// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// 按照惯例，组合式函数名以“use”开头
export function useMouse() {
  // 被组合式函数封装和管理的状态
  const x = ref(0)
  const y = ref(0)

  // 组合式函数可以随时更改其状态。
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // 一个组合式函数也可以挂靠在所属组件的生命周期上
  // 来启动和卸载副作用
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // 通过返回值暴露所管理的状态
  return { x, y }
}
```

下面是它在组件中使用的方式：

```vue
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```

我们可以将添加和清除 DOM 事件监听器的逻辑也封装进一个组合式函数中：

```js
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // 如果你想的话，
  // 也可以用字符串形式的 CSS 选择器来寻找目标 DOM 元素
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

有了它，之前的 `useMouse()` 组合式函数可以被简化为：

```js
// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```

### 异步状态示例

```js
// fetch.js
import { ref } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  fetch(url)
    .then((res) => res.json())
    .then((json) => (data.value = json))
    .catch((err) => (error.value = err))

  return { data, error }
}
```

现在我们在组件里只需要：

```vue
<script setup>
import { useFetch } from './fetch.js'

const { data, error } = useFetch('...')
</script>
```

`useFetch()` 接收一个静态的 URL 字符串作为输入，所以它只执行一次请求，然后就完成了。但如果我们想让它在每次 URL 变化时都重新请求呢？那我们可以让它同时允许接收 ref 作为参数：

```js
// fetch.js
import { ref, isRef, unref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  function doFetch() {
    // 在请求之前重设状态...
    data.value = null
    error.value = null
    // unref() 解包可能为 ref 的值
    fetch(unref(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  if (isRef(url)) {
    // 若输入的 URL 是一个 ref，那么启动一个响应式的请求
    watchEffect(doFetch)
  } else {
    // 否则只请求一次
    // 避免监听器的额外开销
    doFetch()
  }

  return { data, error }
}
```

这个版本的 `useFetch()` 现在同时可以接收静态的 URL 字符串和 URL 字符串的 ref。当通过 [`isRef()`](https://cn.vuejs.org/api/reactivity-utilities.html#isref) 检测到 URL 是一个动态 ref 时，它会使用 [`watchEffect()`](https://cn.vuejs.org/api/reactivity-core.html#watcheffect) 启动一个响应式的 effect。该 effect 会立刻执行一次，并在此过程中将 URL 的 ref 作为依赖进行跟踪。当 URL 的 ref 发生改变时，数据就会被重置，并重新请求。

### 约定和最佳实践

#### 命名

组合式函数约定用驼峰命名法命名，并以“use”作为开头。

#### 输入参数

尽管其响应性不依赖 ref，组合式函数仍可接收 ref 参数。如果编写的组合式函数会被其他开发者使用，你最好在处理输入参数时兼容 ref 而不只是原始的值。[`unref()`](https://cn.vuejs.org/api/reactivity-utilities.html#unref) 工具函数会对此非常有帮助：

```js
import { unref } from 'vue'

function useFeature(maybeRef) {
  // 若 maybeRef 确实是一个 ref，它的 .value 会被返回
  // 否则，maybeRef 会被原样返回
  const value = unref(maybeRef)
}
```

#### 返回值

你可能已经注意到了，我们一直在组合式函数中使用 `ref()` 而不是 `reactive()`。

```js
// x 和 y 是两个 ref
const { x, y } = useMouse()
```

从组合式函数返回一个响应式对象会导致在对象解构过程中丢失与组合式函数内状态的响应性连接。**与之相反，ref 则可以维持这一响应性连接。**

如果你更希望以对象属性的形式来使用组合式函数中返回的状态，你可以将返回的对象用 `reactive()` 包装一次，这样其中的 ref 会被自动解包，例如：

```js
const mouse = reactive(useMouse())
// mouse.x 链接到了原来的 x ref
console.log(mouse.x)
```

```tempalte
Mouse position is at: {{ mouse.x }}, {{ mouse.y }}
```

#### 副作用

在组合式函数中的确可以执行副作用 (例如：添加 DOM 事件监听器或者请求数据)，但请注意以下规则：

- 如果你的应用用到了[服务端渲染](https://cn.vuejs.org/guide/scaling-up/ssr.html) (SSR)，请确保在组件挂载后才调用的生命周期钩子中执行 DOM 相关的副作用，例如：`onMounted()`。这些钩子仅会在浏览器中被调用，因此可以确保能访问到 DOM。
- 确保在 `onUnmounted()` 时清理副作用。举例来说，如果一个组合式函数设置了一个事件监听器，它就应该在 `onUnmounted()` 中被移除 (就像我们在 `useMouse()` 示例中看到的一样)。当然也可以像之前的 `useEventListener()` 示例那样，使用一个组合式函数来自动帮你做这些事。

#### 使用限制

组合式函数在 `<script setup>` 或 `setup()` 钩子中，应始终被**同步地**调用。在某些场景下，你也可以在像 `onMounted()` 这样的生命周期钩子中使用他们。

这个限制是为了让 Vue 能够确定当前正在被执行的到底是哪个组件实例，只有能确认当前组件实例，才能够：

1. 将生命周期钩子注册到该组件实例上
2. 将计算属性和监听器注册到该组件实例上，以便在该组件被卸载时停止监听，避免内存泄漏。

### 在选项式 API 中使用组合式函数

如果你正在使用选项式 API，组合式函数必须在 `setup()` 中调用。且其返回的绑定必须在 `setup()` 中返回，以便暴露给 `this` 及其模板：

```js
import { useMouse } from './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    return { x, y, data, error }
  },
  mounted() {
    // setup() 暴露的属性可以在通过 `this` 访问到
    console.log(this.x)
  }
  // ...其他选项
}
```

## 自定义指令

```vue
<script setup>
// 在模板中启用 v-focus
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<template>
  <input v-focus />
</template>
```

在 `<script setup>` 中，任何以 `v` 开头的驼峰式命名的变量都可以被用作一个自定义指令。在上面的例子中，`vFocus` 即可以在模板中以 `v-focus` 的形式使用。

在没有使用 `<script setup>` 的情况下，自定义指令需要通过 `directives` 选项注册：

```js
export default {
  setup() {
    /*...*/
  },
  directives: {
    // 在模板中启用 v-focus
    focus: {
      /* ... */
    }
  }
}
```

将一个自定义指令全局注册到应用层级也是一种常见的做法：

```js
const app = createApp({})

// 使 v-focus 在所有组件中都可用
app.directive('focus', {
  /* ... */
})
```

### 指令钩子

一个指令的定义对象可以提供几种钩子函数 (都是可选的)：

```js
const myDirective = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(el, binding, vnode, prevVnode) {
    // 下面会介绍各个参数的细节
  },
  // 在元素被插入到 DOM 前调用
  beforeMount(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件更新前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载前调用
  beforeUnmount(el, binding, vnode, prevVnode) {},
  // 绑定元素的父组件卸载后调用
  unmounted(el, binding, vnode, prevVnode) {}
}
```

### 钩子函数

指令的钩子会传递以下几种参数：

- `el`：指令绑定到的元素。这可以用于直接操作 DOM。
- `binding`：一个对象，包含以下属性。
  - `value`：传递给指令的值。例如在 `v-my-directive="1 + 1"` 中，值是 `2`。
  - `oldValue`：之前的值，仅在 `beforeUpdate` 和 `updated` 中可用。无论值是否更改，它都可用。
  - `arg`：传递给指令的参数 (如果有的话)。例如在 `v-my-directive:foo` 中，参数是 `"foo"`。
  - `modifiers`：一个包含修饰符的对象 (如果有的话)。例如在 `v-my-directive.foo.bar` 中，修饰符对象是 `{ foo: true, bar: true }`。
  - `instance`：使用该指令的组件实例。
  - `dir`：指令的定义对象。
- `vnode`：代表绑定元素的底层 VNode。
- `prevNode`：之前的渲染中代表指令所绑定元素的 VNode。仅在 `beforeUpdate` 和 `updated` 钩子中可用。

举例来说，像下面这样使用指令：

```html
<div v-example:foo.bar="baz">
```

`binding` 参数会是一个这样的对象：

```js
{
  arg: 'foo',
  modifiers: { bar: true },
  value: /* `baz` 的值 */,
  oldValue: /* 上一次更新时 `baz` 的值 */
}
```

和内置指令类似，自定义指令的参数也可以是动态的。举例来说：

````html
<div v-example:[arg]="value"></div>
````

除了 `el` 外，其他参数都是只读的，不要更改它们。若你需要在不同的钩子间共享信息，推荐通过元素的 [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) attribute 实现。

### 简化形式

对于自定义指令来说，一个很常见的情况是仅仅需要在 `mounted` 和 `updated` 上实现相同的行为，除此之外并不需要其他钩子。这种情况下我们可以直接用一个函数来定义指令，如下所示：

```html
<div v-color="color"></div>
```

```js
app.directive('color', (el, binding) => {
  // 这会在 `mounted` 和 `updated` 时都调用
  el.style.color = binding.value
})
```

### 对象字面量

如果你的指令需要多个值，你可以向它传递一个 JavaScript 对象字面量。别忘了，指令也可以接收任何合法的 JavaScript 表达式。

```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
```

```js
app.directive('demo', (el, binding) => {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
})
```

## 插件

