// 基本实现
class EventBus {
  constructor() {
    this.eventBus = []
  }

  off(eventName, eventCallBack) {
    const handlers = this.eventBus[eventName]
    if (!handlers) return
    const newHandlers = [...handlers]
    for (let i = 0; i < newHandlers.length; i++) {
      const handler = newHandlers[i]
      if (handler.eventCallBack === eventCallBack) {
        const index = handlers.indexOf(handler)
        handlers.splice(index, 1)
      }
    }
  }

  on(eventName, eventCallBack, thisArg) {
    let handlers = this.eventBus[eventName]
    if (!handlers) {
      handlers = []
      this.eventBus[eventName] = handlers
    }
    handlers.push({
      eventCallBack,
      thisArg,
    })
  }

  emit(eventName, ...payload) {
    const handlers = this.eventBus[eventName]
    if (!handlers) return
    handlers.forEach((handler) => {
      handler.eventCallBack.apply(handler.thisArg, payload)
    })
  }
}

const eventBus = new EventBus()

const callback = function (payload) {
  console.log("监听事件aaaaaaaaaa", this, payload)
}
// 最好不要使用箭头函数(因为绑定this可能导致问题)
eventBus.on("aa", callback, { name: "www" })

eventBus.on("aa", callback, { name: "www" })
eventBus.emit("aa", 1111)
eventBus.off("aa", callback)
eventBus.emit("aa", 1111)
