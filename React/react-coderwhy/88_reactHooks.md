### useState

### useEffect

1. 基本使用
2. 清除执行，返回回调函数
3. 多次使用
4. 受依赖项执行，传[]则只执行一次

### useContext

### useReducer

### useCallback、useMemo

#### useCallback

用于性能优化，有返回值，返回值是一个函数，并且是有记忆的函数，在依赖不变的情况下，多次定义的时候，返回的值是相同的。

- useCallback闭包陷阱

- 当子组件需要传入函数时，可以使用useCallback把该函数作为参数后返回的函数作为参数传给子组件。

- 此时，当useCallback的第二个参数中的state依赖项改变时才会重新渲染子组件，不然子组件不会渲染，即达到性能优化的目的。
- 使用 useRef 进一步性能优化

#### useMemo

用于性能优化，有返回值，返回的是有记忆的值。

在依赖不变的情况下，对此定义的时候，返回的值是相同的。

```js
const a = useCallback(fn, [])
// 等同于
const a = useMemo(() => fn, [])
```

优化案例

- 进行大量的计算操作，是否有必要每次渲染时都重新计算

  ```js
  // 1.不依赖任何的值, 进行计算
    const result = useMemo(() => {
      return calcNumTotal(50)
    }, [])
  ```

- 对子组件传递相同内容的对象时，使用useMemo进行性能的优化

  ```jsx
  const info = useMemo(() => ({name: "why", age: 18}), [])
  
  return (
      <div>
        <h2>计算结果: {result}</h2>
        <h2>计数器: {count}</h2>
        <button onClick={e => setCount(count+1)}>+1</button>
  
        <HelloWorld info={info} />
      </div>
    )
  ```

### useRef

useRef 返回一个ref对象，返回的ref对象在组件的整个生命周期保存不变。

用法

- 引用DOM（组件）元素。
- 解决闭包陷阱

### useImperativeHandle（了解）

通过 useImperativeHandle 将传入的 ref 和 useImperativeHandle 第二个参数返回的对象绑定到一起

所以父组件中使用 inputRef.current时，实际上使用的是返回的对象

比如调用 focus函数

```jsx
const HelloWorld = memo(forwardRef((props, ref) => {

  const inputRef = useRef()

  // 子组件对父组件传入的ref进行处理，其它组件在使用 HelloWorld 组件时
  // 只可以调用useImperativeHandle第二个参数返回的对象中的方法
  useImperativeHandle(ref, () => {
    return {
      focus() {
        console.log("focus")
        inputRef.current.focus()
      },
      setValue(value) {
        inputRef.current.value = value
      }
    }
  })

  return <input type="text" ref={inputRef}/>
}))
```



### useLayoutEffect（了解）

useEffect 会在渲染的内容更新到DOM上后执行，不会阻塞DOM的更新；

useLayoutEffect 会在渲染的内容更新到DOM上之前执行，会阻塞DOM的更新

