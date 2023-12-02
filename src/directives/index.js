// 图片错误自定义指令
export const imagerror = {
  inserted(dom, options) {
    // 处理图片为空的情况
    dom.src = dom.src | options.value
    // 注册图片error事件
    dom.onerror = function() {
      dom.src = options.value
    }
  },
  componentUpdated(dom, options) {
    dom.src = dom.src | options.value
  }
}
