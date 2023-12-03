// 路由权限存储

// 静态路由权限
import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  routes: constantRoutes
}
const mutations = {
  addRouter(state, newRouter) {
    state.routes = [...constantRoutes, ...newRouter]
  }
}
const actions = {
  // 筛选路由权限
  filterRouter(context, menus) {
    const routes = []
    menus.forEach(key => { routes.push(...asyncRoutes.filter(item => item.name === key)) }
    )
    context.commit('addRouter', [...routes, { path: '*', redirect: '/404', hidden: true }]) // 该数组是为了左侧菜单的显示
    return routes // 返回的路由是为了给路由addRoutes使用
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
