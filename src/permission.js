import router from '@/router'
import store from '@/store'
// 引入进度条插件
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { error } from 'jquery'

// 设置白名单
const whiteList = ['/login', '/404']

// 设置路由前置守卫
router.beforeEach(async function(to, from, next) {
  // 开启进度条插件
  Nprogress.start()
  // 1.引入store,先判断token值
  if (store.getters.token) {
    // 1.2.有token,判断是否请求的为登录页
    if (to.path === '/login') {
      // 是则直接跳转至主页
      return next('/')
    }
    // 2.在有token,且放行通过时候，获取用户资料
    // 2.1.判断是否有用户资料
    if (!store.getters.userId) {
      // 没有用户资料，则获取资料
      await store.dispatch('user/getUserInfo')
    }
    next()
  } else {
    // 1.无token,判断是否为白名单
    if (whiteList.some(obj => obj === to.path)) {
      return next()
    }
    next('/login')
  }
  Nprogress.done()
}
)

// 后置守卫
router.afterEach(function() {
  Nprogress.done()
})

