import Layout from '@/layout'
export default {
  path: '/permission',
  name: 'permission',
  component: Layout,
  children: [{
    // 当二级路由路径为空时，则为默认路由
    path: '',
    component: () => import ('@/views/departments'),
    // meta即路由元信息，可存储数据，在组件中可使用该数据
    meta: {
    // 在左侧导航栏中使用
      title: '权限管理'
    }
  }]
}
