## 工具链

### 项目脚手架

- Vite
- Vue CLI

#### 代码规范

Vue 团队维护着 [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue) 项目，它是一个 [ESLint](https://eslint.org/) 插件，会提供 SFC 相关规则的定义。

之前使用 Vue CLI 的用户可能习惯于通过 webpack loader 来配置规范检查器。然而，若基于 Vite 构建，我们一般推荐：

1. `npm install -D eslint eslint-plugin-vue`，然后遵照 `eslint-plugin-vue` 的[指引](https://eslint.vuejs.org/user-guide/#usage)进行配置。
2. 启用 ESLint IDE 插件，比如 [ESLint for VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)，然后你就可以在开发时获得规范检查器的反馈。这同时也避免了启动开发服务器时不必要的规范检查。
3. 将 ESLint 格式检查作为一个生产构建的步骤，保证你可以在最终打包时获得完整的规范检查反馈。
4. (可选) 启用类似 [lint-staged](https://github.com/okonet/lint-staged) 一类的工具在 git commit 提交时自动执行规范检查。