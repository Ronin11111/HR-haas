// 图片错误自定义指令
export const imagerror = {
  inserted(dom, options) {
    // 注册图片error事件
    dom.onerror = function() {
      dom.src = options.value
    }
  }
}
