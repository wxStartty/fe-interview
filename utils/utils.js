/** 生成唯一的uid */
const uuid = () =>
  "uuid-" + Date.now().toString(36) + Math.random().toString(36).slice(2)
