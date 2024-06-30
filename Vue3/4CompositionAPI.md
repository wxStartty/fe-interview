#### CompositionAPI

##### reactive

- 定义复杂类型的数据（如果是基本数据类型，vue会包警告），可使数据变成响应式的。
- eg: const account = reactive({ username: 'xxx', pwd: 123456 })
- 修改的操作：account.username = 'wx'，页面重新渲染
- 如果对 reactive 返回值进行解构，会失去响应式

##### ref

- ref 会返回一个可变的响应式对象，内部的值是在 ref value 属性中维护的。
- 模板中引用ref的值，vue会自动解包（浅层解包），所以不需要在ref.value的方式来使用。
- 在模板中深层对象在使用时不需要加.value，更改的时候需要加，如：info.counter.value ++

##### readonly

在使用 readonly 有如下规则：

- readonly 返回的对象是不允许修改的
- 但是经过 readonly 处理的原来的对象是允许被修改的
  - 如 const info = readonly(obj)，info对象是不允许被修改的
  - 当obj被修改时，readonly 返回的info对象也会被修改
  - 但是我们不能去修改readonly返回的对象info
- readonly 本质就是 readonly 返回的对象的setter方法被劫持了

##### Reactive判断的API

- isProxy：检测对象是否是由reactive或者readonly创建的proxy
- isReactive：检测对象是否由 reactive 创建的响应式代理
- isReadonly：检查对象是否是 readonly 创建的只读代理
- toRaw：返回 reactive 或 readonly 代理的原始对象
- shallowReactive：创建一个响应式代理（proxy），他跟踪自身 property 的响应性，但不执行嵌套对象的深层响应式转换（深层不是响应式对象）。
- shallowReadonly：创建一个 proxy，使其自身的 property 为只读，但不执行嵌套对象的深度只读转换（深层还是可读可写的）。

##### toRefs

定义：可以将reactive返回的对象中的属性都转成ref

eg：const state = reactive({ name: 'wx', age: 18 })

​		const { name, age } = toRefs(state)

这种做法相当于在state.name和ref.value之间建立链接，任何一个修改都会引起另外一个变化

##### toRef

如果只希望转换一个reactive对象中的属性为ref，那么可以使用toRef

eg：const name = toRef(state, 'name')

​		const { age } = state

​		const changeName = () => state.name = 'wxx'

#### ref其他的API

##### unref

如果想要获取一个ref引用中的value，可以使用unref

- 如果参数是一个ref，则返回内布置，否则返回参数本身
  是 val = isRef(val) ? val.value : val 的语法糖

##### isRef

判断是否是一个ref对象

##### shallowRef

创建要给浅层的ref对象

##### triggerRef

手动触发和 shallowRef 相关联的副作用

eg：const info = shallowRef({ name: 'wx' })

​		const changeInfo = () => {

​			info.value.name = 'wxxx' // 不是响应式的

​			triggerRef(info) // 手动触发

​		}

#### computed

eg：

const age = computed(() => age * 2)

const age = computed({

​	set: function(newVal) {}

​	get: function() {}

})

#### setup中使用ref

1.  <h2 ref="titleRef">标题</h2>

2. const titleRef = ref(null)
3. 在setup中返回  return { titleRef }

#### setup中的生命周期

- onBeforeMount
- onMounted
- onBeforeUpdate
- onUpdated
- onBeforeUnmount
- onUnmounted
- onActivated
- onDeactivated

在 beforeCreate 和 created 生命周期编写的任何代码都可在setup中完成

#### setup中Provide、inject

- 父组件
  - 导入provide
  - 写入共享数据  provide('name', name) // name 可以是ref或者reactive类型的数据
- 子组件
  - 导入inject
  - 获取共享的数据  inject('name', 默认值)

#### setup中的数据侦听watch

    import { reactive, ref, watch } from 'vue'
    
    export default {
     setup() {
      // 1.定义数据
      const message = ref("Hello World")
      const info = reactive({
       name: "why",
       age: 18,
       friend: {
        name: "kobe"
       }
      })
    
      // 2.侦听数据的变化
      watch(message, (newValue, oldValue) => {
        console.log(newValue, oldValue)
      })
      watch(info, (newValue, oldValue) => {
        console.log(newValue, oldValue)
        console.log(newValue === oldValue)
      }, {
        immediate: true
      })
    
      // 3.监听reactive数据变化后, 获取普通对象
      watch(() => ({ ...info }), (newValue, oldValue) => {
        console.log(newValue, oldValue)
      }, {
        immediate: true,
        deep: true
      })
    
      return {
        message,
        info
      }
     }
    }
 ##### 侦听多个数据源

watch([name, age], (newValues, oldValues) => {})

##### watchEffect

1. watchEffect 传入的函数默认会直接被执行
   watchEffect(() => {})

2. 在执行过程中会自动收集依赖（依赖哪些响应式的数据）

   stopWatch()  停止侦听

    const stopWatch = watchEffect(() => {
      console.log("-------", counter.value, name.value)
      // 判断counter.value > 10
      if (counter.value >= 10) {
        stopWatch()
      }
    })

#### script setup语法

##### defineProps和defineEmits

- 子组件中
  - 使用defineProps()和defineEmits()来分别定义父组件传过来的props和触发父组件中的函数并給父组件传值。
    eg：
    const props = definePorps({ name: { type: String, default: '', ... } })
    const emit = defineEmits(['changeAge'])
    function changeAge() { emit('changeAge', 20) }
- 父组件中
  - 在子组件的标签上写入@change-age="changeAge"
  - 在父组件中编写changeAge函数  function changeAge(payload) {...}

##### defineExpose

如果想在父组件中通过ref的方式获取子组件的实例方法和属性值，需要通过defneExpose暴露出去。

eg：defineExpose({ foo, ... })