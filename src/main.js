import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

// 引入自定义指定文件
import * as directives from '@/directives'

// 引入公共注册组件
import Component from '@/components'

// 引入全局过滤器
import * as filters from '@/filters'

// 引入mixin方法
import checkPermission from '@/mixin/checkPermission'

// 引入多语言包
import i18n from '@/lang'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// 注册全局自定义指令
// 使用Object.keys：将对象中的属性转为数组
// 在利用Object数组的forEach():遍历指令，完成注册
Object.keys(directives).forEach(key => Vue.directive(key, directives[key]))

// 注册全局过滤器
Object.keys(filters).forEach(key => { Vue.filter(key, filters[key]) })
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// 设定语言包
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key)
})
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.use(Component)

// 全局注册mixin
Vue.mixin(checkPermission)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
