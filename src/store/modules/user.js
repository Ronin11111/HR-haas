// 引入login接口请求方法
import { login, getInfo, getUserDetail } from '@/api/user'
// 引入获取，修改，删除token的方法
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { resetRouter } from '@/router'

// 存储用户信息
export default {
  // 设定该模块的封闭性
  namespaced: true,
  state: {
    token: getToken(), // 存储Token
    userInfo: {} // 用户信息对象
  },
  actions: {
    // 封装登录的action，获取登录成功之后的token
    async login(context, data) {
      // 在响应拦截器中已对相应结果进行了处理
      const result = await login(data)
      // 获取时间戳
      setTimeStamp()
      // 将获取的token数据，覆盖修改原token
      context.commit('setToken', result)
    },

    // 获取用户信息
    async getUserInfo(context) {
      const result = await getInfo()
      const detail = await getUserDetail(result.userId)
      context.commit('setUserInfo', { ...result, ...detail })
      return result
    },

    // 退出登录
    logout(context) {
      context.commit('removeToken')
      context.commit('removeUserInfo')
      // 重置路由
      resetRouter()
      // 重置权限路由存储
      // 注意：加锁的子路由访问另一个子路由空间的mutations
      context.commit('permission/addRouter', [], { root: true })
    }
  },
  mutations: {
    // 1.修改token
    setToken(state, token) {
      state.token = token // 修改state中值
      setToken(token) // 修改缓存中token
    },
    // 2.删除token
    removeToken(state) {
      state.token = null
      removeToken()
    },

    // 1.修改userInfo
    setUserInfo(state, userInfo) {
      state.userInfo = { ...userInfo } // 浅拷贝更新为响应式数据
    },
    // 2.删除
    removeUserInfo(state) {
      // 重置信息
      state.userInfo = {}
    }
  }
}
