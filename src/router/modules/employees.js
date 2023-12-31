import Layout from '@/layout'
export default {
  path: '/employees',
  name: 'employees',
  component: Layout,
  children: [{
    // 当二级路由路径为空时，则为默认路由
    path: '',
    name: 'employees',
    component: () => import ('@/views/employees'),
    // meta即路由元信息，可存储数据，在组件中可使用该数据
    meta: {
    // 在左侧导航栏中使用
      title: '员工',
      icon: 'people'
    }
  }, {
    path: 'detail/:id?', // 路由参数部分？表示参数可传可不传
    hidden: true, // 不在左侧菜单栏显示
    component: () => import ('@/views/employees/detail'),
    meta: {
      title: '员工详情'
    }
  },
  {
    path: 'print/:id',
    hidden: true,
    component: () => import('@/views/employees/print'),
    meta: {
      title: '信息打印',
      icon: 'people'
    }
  }
  ]
}
