https://juejin.cn/post/6844904034281734151#comment

1. CSS 发展
   我们在书写 css 的时候其实经历了以下几个阶段：
   手写源生 CSS
   使用预处理器 Sass/Less
   使用后处理器 PostCSS
   使用 css modules
   使用 css in js

2. 手写原生 CSS
   在我们最初学习写页面的时候，大家都学过怎么去写 css，也就以下几种情况：

   行内样式，即直接在 html 中的 style 属性里编写 css 代码。
   内嵌样式，即在 html h 中的 style 标签内编写 class，提供给当前页面使用。
   导入样式，即在内联样式中 通过 @import 方法，导入其他样式，提供给当前页面使用。
   外部样式，即使用 html 中的 link 标签，加载样式，提供给当前页面使用

   我们在不断摸索中，逐渐形成了以编写 内嵌样式 和 外部样式 为主要的编写习惯。

3. 使用预处理器 Sass/Less
4. 后处理器 PostCSS
   随着前端工程化的不断发展，越来越多的工具被前端大佬们开发出来，愿景是把所有的重复性的工作都交给机器去做，在 css 领域就产生了 postcss。

   postcss 可以称作为 css 界的 babel，它的实现原理是通过 ast 去分析我们的 css 代码，然后将分析的结果进行处理，从而衍生出了许多种处理 css 的使用场景。
   常用的 postcss 使用场景有：

   配合 stylelint 校验 css 语法
   自动增加浏览器前缀 autoprefixer
   编译 css next 的语法

5. CSS 模块化的实现方式
   BEM 命名规范
   BEM 的意思就是块（block）、元素（element）、修饰符（modifier）。是由 Yandex 团队提出的一种前端命名方法论。这种巧妙的命名方法让你的 css 类对其他开发者来说更加透明而且更有意义。

   /_ 块即是通常所说的 Web 应用开发中的组件或模块。每个块在逻辑上和功能上都是相互独立的。 _/
   .block {
   }

   /_ 元素是块中的组成部分。元素不能离开块来使用。BEM 不推荐在元素中嵌套其他元素。 _/
   .block\_\_element {
   }

   /_ 修饰符用来定义块或元素的外观和行为。同样的块在应用不同的修饰符之后，会有不同的外观 _/
   .block--modifier {
   }

   CSS Modules
   CSS Modules 指的是我们像 import js 一样去引入我们的 css 代码，代码中的每一个类名都是引入对象的一个属性，通过这种方式，即可在使用时明确指定所引用的 css 样式。
   并且 CSS Modules 在打包的时候会自动将类名转换成 hash 值，完全杜绝 css 类名冲突的问题。

   使用方式如下：

   1. 定义 css 文件。
   2. 在 js 模块中导入 css 文件。
   3. 配置 css-loader 打包。
      CSS Modules 不能直接使用，而是需要进行打包，一般通过配置 css-loader 中的 modules 属性即可完成 css modules 的配置。
      // webpack.config.js
      module.exports = {
      module: {
      rules: [
      {
      test: /\.css$/,
      use:{
      loader: 'css-loader',
      options: {
      modules: {
      // 自定义 hash 名称
      localIdentName: '[path][name]\_\_[local]--[hash:base64:5]',
      }
      }
      }
      ]
      }
      };

   4. 最终打包出来的 css 类名就是由一长串 hash 值生成。
      .\_2DHwuiHWMnKTOYG45T0x34 {
      color: red;
      }

      .\_10B-buq6_BEOTOl9urIjf8 {
      background-color: blue;
      }

6. CSS In JS
   CSS in JS 其实是一种编写思想，目前已经有超过 40 多种方案的实现，最出名的是 styled-components。
   import React from "react";
   import styled from "styled-components";

   // 创建一个带样式的 h1 标签
   const Title = styled.h1`font-size: 1.5em; text-align: center; color: palevioletred;`;

   // 创建一个带样式的 section 标签
   const Wrapper = styled.section`padding: 4em; background: papayawhip;`;

   // 通过属性动态定义样式
   const Button = styled.button`
   background: ${props => (props.primary ? "palevioletred" : "white")};
   color: ${props => (props.primary ? "white" : "palevioletred")};

   font-size: 1em;
   margin: 1em;
   padding: 0.25em 1em;
   border: 2px solid palevioletred;
   border-radius: 3px;
   `;

   // 样式复用
   const TomatoButton = styled(Button)`color: tomato; border-color: tomato;`;

    <Wrapper>
      <Title>Hello World, this is my first styled component!</Title>
      <Button primary>Primary</Button>
    </Wrapper>;
