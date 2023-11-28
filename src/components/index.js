// 该文件负责所有公共组件的全局注册
import PageTools from './PageTools'
export default {
  // Vue.use()--本质为执行其中的install方法，Vue为全局对象
  install(Vue) {
    Vue.component('PageTools', PageTools)
  }
}