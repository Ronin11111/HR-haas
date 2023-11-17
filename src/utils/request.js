// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import { config } from '@vue/test-utils'
import axios from 'axios'
import { Message } from 'element-ui'
import { error } from 'jquery'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'

// 设置超时间隔时间
const TimeOut = 3600

const service = axios.create(
  {
    // 设置基地址
    baseURL: process.env.VUE_APP_BASE_API,
    // 设置超时时间
    timeout: 5000
  }
) // 创建一个axios的实例

// 拦截器中有两个拦截函数，即成功拦截response和失败拦截error
// 请求拦截器
service.interceptors.request.use(config => {
  // 1.判断是否有token
  if (store.getters.token) {
    // 3.判断token是否超时
    if (isTimeOut()) {
      store.dispatch('user/logout')
      router.push('/login')
      // 跳出执行链，并提示错误消息
      return Promise.reject(new Error('Token超时！'))
    }

    // 2.将header中的token注入
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  // 注意：返回config
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  // 1.将获取的数据进行解构
  const { data, message, success } = response.data
  // 2.对失败/成功信息进行判断
  if (success) {
    // 3.成功，则返回data数据
    return data
  } else {
    // 失败，提示错误信息
    Message.error(message)
    // reject()，生成错误对象，退出.then()
    return Promise.reject(new Error(message))
  }
}, error => {
  if (error.response && error.response.data && error.response.data.code === 1002) {
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error)
}
) // 响应拦截器
export default service // 导出axios实例

// 判断token是否超时
function isTimeOut() {
  const current = Date.now()
  const timeKey = getTimeStamp()
  return (current - timeKey) / 1000 > TimeOut
}

