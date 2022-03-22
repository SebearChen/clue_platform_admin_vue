import Layout from '@/layout'

export default {
  path: '/system',
  component: Layout,
  redirect: '/system/user/list',
  alwaysShow: true,
  name: 'system',
  meta: {
    title: 'system',
    icon: 'el-icon-s-tools',
    res: ['system/user/list','system/role/list','system/menu/list']
  },
  children: [{
    path: 'user',
    component: () => import('@/views/admin/system/user/index'),
    redirect: '/system/user/list',
    name: 'user',
    meta: { 
      title: 'systemUser' ,
      res: ['system/user/list']
    },
    children: [
      {
        path: 'list',
        hidden: true,
        component: () => import('@/views/admin/system/user/list'),
        name: 'systemUserList',
        meta: { title: '列表',res: ['system/user/list'], }
      },
      {
        path: 'create',
        hidden: true,
        component: () => import('@/views/admin/system/user/detail'),
        name: 'systemUserCreate',
        meta: { title: '创建', module: '用户', crud: 'c' }
      },
      {
        path: 'detail/:id(\\d+)',
        hidden: true,
        component: () => import('@/views/admin/system/user/detail'),
        name: 'systemUserDetail',
        meta: { title: '详情', module: '用户' }
      }
    ]
  }, {
    path: 'role',
    component: () => import('@/views/admin/system/role/index'),
    redirect: '/system/role/list',
    name: 'role',
    meta: { 
      title: 'systemRole',
      res: ['system/role/list']
    },
    children: [
      {
        path: 'list',
        hidden: true,
        component: () => import('@/views/admin/system/role/list'),
        name: 'systemRoleList',
        meta: { title: '列表' }
      },
      {
        path: 'create',
        hidden: true,
        component: () => import('@/views/admin/system/role/detail'),
        name: 'systemRoleCreate',
        meta: { title: '创建', module: '用户', crud: 'c' }
      },
      {
        path: 'detail/:id(\\d+)',
        hidden: true,
        component: () => import('@/views/admin/system/role/detail'),
        name: 'systemRoleDetail',
        meta: { title: '详情', module: '用户' }
      }
    ]
  }, {
    path: 'menu',
    component: () => import('@/views/admin/system/menu/index'),
    redirect: '/system/menu/list',
    name: 'menu',
    meta: { 
      title: 'systemMenu',
      res: ['system/menu/list'] 
    },
    children: [
      {
        path: 'list',
        hidden: true,
        component: () => import('@/views/admin/system/menu/list'),
        name: 'systemMenuList',
        meta: { title: '列表' }
      },
      {
        path: 'create',
        hidden: true,
        component: () => import('@/views/admin/system/menu/detail'),
        name: 'systemMenuCreate',
        meta: { title: '创建', module: '权限', crud: 'c' }
      },
      {
        path: 'detail/:id(\\d+)',
        hidden: true,
        component: () => import('@/views/admin/system/menu/detail'),
        name: 'systemMenuDetail',
        meta: { title: '详情', module: '权限' }
      }
    ]
  },
  /* {
    path: 'set',
    component: () => import('@/views/admin/system/set'),
    name: 'systemSet',
    meta: { title: 'systemSet' }
  }, */{
    path: 'log',
    component: () => import('@/views/admin/system/log'),
    name: 'systemLog',
    meta: { title: 'systemLog' }
  },/* {
    path: 'cache',
    component: () => import('@/views/admin/system/cache'),
    name: 'systemCache',
    meta: { title: 'systemCache' }
  }*/
  // {
  //   path: 'data',
  //   component: () => import('@/views/admin/data/dashboard'),
  //   name: 'dashboard',
  //   meta: { title: 'dashboard',res: ['data'],keepAlive: true } //, affix: false }
  // },
  {
    path: '/system/databoards',
    component: () => import('@/views/admin/system/databoards'),
    name: 'databoards',
    meta: { title: 'thematicStatistics',res: ['data'], keepAlive: true }
  },
  {
    path: '/system/recoveryClues',
    component: () => import('@/views/admin/system/recoveryClues'),
    name: 'recoveryClues',
    meta: { title: 'recoveryClues', res: ['system/recoveryClues']}
  },
  {
    path: '/system/cache',
    component: () => import('@/views/admin/system/cache'),
    name: 'systemCache',
    meta: { title: 'systemCache', res: ['system/cache']}
  },
  {
    path: 'configuration',
    component: () => import('@/views/admin/system/configuration/index'),
    redirect: '/system/configuration/list',
    name: 'configurationList',
    meta: { 
      title: 'systemConfiguration',
      res: ['system/configuration/list']
    },
    children: [
      {
        path: 'list',
        hidden: true,
        component: () => import('@/views/admin/system/configuration/list'),
        name: 'configurationList',
        meta: { title: '列表' }
      },
      {
        path: 'create',
        hidden: true,
        component: () => import('@/views/admin/system/configuration/detail'),
        name: 'configurationCreate',
        meta: { title: '创建', module: '系统配置', crud: 'c'}
      },
      {
        path: 'detail/:id(\\d+)',
        hidden: true,
        component: () => import('@/views/admin/system/configuration/detail'),
        name: 'configurationDetail',
        meta: { title: '详情', module: '权限'}
      }
    ]
  },
  {
    path: 'sensitiveWords',
    component: () => import('@/views/admin/system/sensitiveWords/index'),
    redirect: '/system/sensitiveWords/list',
    name: 'sensitiveWords',
    meta: { 
      title: 'sensitiveWordsManagement',
      res: ['system/sensitiveWords/list']
    },
    children: [
      {
        path: 'list',
        hidden: true,
        component: () => import('@/views/admin/system/sensitiveWords/list'),
        name: 'sensitiveWords',
        meta: { title: '列表' }
      },
      {
        path: 'create',
        hidden: true,
        component: () => import('@/views/admin/system/sensitiveWords/detail'),
        name: 'sensitiveWordsCreate',
        meta: { title: '创建', module: '敏感词', crud: 'c' }
      },
      {
        path: '/whiteList/list',
        component: () => import('@/views/admin/system/whiteList/list'),
        name: 'whiteList',
        meta: { title: 'whiteList', module: '白名单列表',res: ['whiteList/list']}
      },{
        path: '/system/whiteList/create',
        hidden: true,
        component: () => import('@/views/admin/system/whiteList/detail'),
        name: 'whiteListCreat',
        meta: { title: 'whiteListCreat', module: '白名单创建', crud: 'c', res: ['whiteList/create']}
      }
    ]
  }
  ]
}
