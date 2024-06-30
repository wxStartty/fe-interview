window下配置chrome启动调试模式端口：右击chrome快捷方式点击属性，定位到目标输入框，在最末尾加上--remote-debugging-port=9222。加上之后用这个快捷方式启动的窗口都会是调试模式



### Source map

https://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html

Source map文件，它大概是这个样子：

```js
{
　　　　version : 3,
　　　　file: "out.js",
　　　　sourceRoot : "",
　　　　sources: ["foo.js", "bar.js"],
　　　　names: ["src", "maps", "are", "fun"],
　　　　mappings: "AAgBC,SAAQ,CAAEA"
　　}
```

整个文件就是一个JavaScript对象，可以被解释器读取。它主要有以下几个属性：

- version：Source map的版本，目前为3。

- file：转换后的文件名。

- sourceRoot：转换前的文件所在的目录。如果与转换前的文件在同一目录，该项为空。
- sources：转换前的文件。该项是一个数组，表示可能存在多个文件合并。

- names：转换前的所有变量名和属性名。
- mappings：记录位置信息的字符串，下文详细介绍。

#### mappings属性

关键就是map文件的mappings属性。这是一个很长的字符串，它分成三层。

- 第一层是**行对应**，以分号（;）表示，每个分号对应转换后源码的一行。所以，第一个分号前的内容，就对应源码的第一行，以此类推。
- 第二层是**位置对应**，以逗号（,）表示，每个逗号对应转换后源码的一个位置。所以，第一个逗号前的内容，就对应该行源码的第一个位置，以此类推。
- 第三层是**位置转换**，以[VLQ编码](https://en.wikipedia.org/wiki/Variable-length_quantity)表示，代表该位置对应的转换前的源码位置。

#### 位置对应的原理

每个位置使用五位，表示五个字段。

从左边算起，

- 第一位，表示这个位置在（转换后的代码的）的第几列。
- 第二位，表示这个位置属于sources属性中的哪一个文件。
- 第三位，表示这个位置属于转换前代码的第几行。
- 第四位，表示这个位置属于转换前代码的第几列。
- 第五位，表示这个位置属于names属性中的哪一个变量。



### Webpack 的 sourcemap 配置

想要彻底搞懂 sourcemap，还需要掌握 webpack 的 sourcemap 配置。

webpack 的 sourcemap 配置比较麻烦，但也是有规律的。

它是对一些基础配置按照一定顺序的组合，理解了每个基础配置，知道了怎么组合就理解了各种 devtool 配置。

- **eval**：浏览器 devtool 支持通过 sourceUrl 来把 eval 的内容单独生成文件，还可以进一步通过 sourceMappingUrl 来映射回源码，webpack 利用这个特性来简化了 sourcemap 的处理，可以直接从模块开始映射，不用从 bundle 级别。
- **cheap**：只映射到源代码的某一行，不精确到列，可以提升 sourcemap 生成速度
- **source-map**：生成 sourcemap 文件，可以配置 inline，会以 dataURL 的方式内联，可以配置 hidden，只生成 sourcemap，不和生成的文件关联
- **nosources**：不生成 sourceContent 内容，可以减小 sourcemap 文件的大小
- **module**： sourcemap 生成时会关联每一步 loader 生成的 sourcemap，可以映射回最初的源码

理解了这些基础配置项，根据 ^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$ 的规律来进行组合，就可以实现各种需求下的 sourcemap 配置。

当然，这种 sourcemap 配置还不够细致，比如 sourcemap 的 url 怎么生成，文件名是什么。如果想对这些做配置，可以关掉 devtool，启用 SourceMapDevToolPlugin 来配置。

虽然 webapck 的 sourcemap 配置方式比较多，但最底层也就是浏览器支持的文件级别的 sourcemap 还有 eval 代码的 source 映射和 sourcemap 这两种机制。其余的方式都是基于这两种机制的封装。

理解了 webpack 封装出的基础配置，知道了组合规则，就可以应对各种需求的 sourcemap 配置。

## 调式Vue项目

vue 项目有两种创建方式，@vue/cli 和 create vue，分别是创建 webpack 和 vite 作为构建工具的项目。

vue cli 创建的项目，默认情况下打断点不生效，这是因为文件路径后带了 ?hash，这是默认的 eval-cheap-module-source-map 的 devtool 配置导致的，去掉 eval，改为 source-map 即可。

create vue 创建的 vite 做为构建工具的项目 sourcemap 到的路径直接就是本地的路径了，更简单一些。但是会有一些文件被错误映射到源码的问题，需要设置下 webRoot。

学会了 vue 项目的调试，接下来就可以愉快的边调试边写代码了。