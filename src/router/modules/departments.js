import Layout from '@/layout'
export default {
  path: '/departments',
  name: 'departments',
  component: Layout,
  children: [{
    // 当二级路由路径为空时，则为默认路由
    path: '',
    name: 'departments',
    component: () => import ('@/views/departments'),
    // meta即路由元信息，可存储数据，在组件中可使用该数据
    meta: {
    // 在左侧导航栏中使用
      title: '组织架构',
      icon: 'tree'
    }
  }]
}
