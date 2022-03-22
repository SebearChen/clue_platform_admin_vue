// import Layout from '@/layout'
// import systemRouter from './modules/systemRouter'

// export default [
//   {
//     path: '/',
//     component: Layout,
//     redirect: '/data',
//     name: 'datasurvey',
//     alwaysShow: true,
//     meta: {
//       title: 'datasurvey',
//       icon: 'dashboard',
//       res: ['data'],
//       keepAlive: true
//     },
//     children: [{
//       path: 'data',
//       component: () => import('@/views/admin/data/dashboard'),
//       name: 'dashboard',
//       meta: { title: 'dashboard',res: ['data'],keepAlive: true } //, affix: false }
//     }]
//   },
//   {
//     path: '/subject',
//     component: Layout,
//     redirect: '/subject/list',
//     alwaysShow: true,
//     name: 'subject',
//     meta: {
//       title: 'subject',
//       icon: 'list',
//       res: ['subject/list'],
//       keepAlive: true
//     },
//     children: [{
//       path: 'list',
//       component: () => import('@/views/admin/subject/list'),
//       name: 'subjectList',
//       meta: { title: 'subjectList',res: ['subject/list'],keepAlive: true }
//     }, {
//       path: 'create',
//       hidden: true,
//       component: () => import('@/views/admin/subject/detail'),
//       name: 'subjectCreat',
//       meta: { title: 'subjectCreat', module: '专题', crud: 'c'}
//     }, {
//       path: 'detail/:id(\\d+)',
//       hidden: true,
//       component: () => import('@/views/admin/subject/detail'),
//       name: 'subjectDetail',
//       meta: { title: 'subjectDetail', module: '专题'}
//     },{
//       path: 'clue-list/:id(\\d+)',
//       hidden: true,
//       component: () => import('@/views/admin/subject/clue-list'),
//       name: 'subjectClue',
//       meta: { title: 'subjectClue', module: '专题'}
//     },{
//       path: 'set-task/:id(\\d+)',
//       hidden: true,
//       component: () => import('@/views/admin/subject/set-task'),
//       name: 'setTask',
//       meta: { title: 'setTask', module: '专题'}
//     },{
//       path: 'export',
//       hidden: true,
//       component: () => import('@/views/admin/subject/batch-export'),
//       name: 'subjectExport',
//       meta: { title: 'subjectExport', module: '专题'}
//     },{
//       path: 'batch',
//       component: () => import('@/views/admin/subject/batch'),
//       name: 'batch',
//       meta: { title: 'batch', module: '专题'}
//     }]
//   },
//   {
//     path: '/business',
//     component: Layout,
//     redirect: '/business/list',
//     alwaysShow: true,
//     name: 'business',
//     meta: {
//       title: 'business',
//       icon: 'international',
//       res: ['business/list'],
//       keepAlive: true
//     },
//     children: [{
//       path: 'list',
//       component: () => import('@/views/admin/business/list'),
//       name: 'businessList',
//       meta: { title: 'businessList', res: ['business/list'], keepAlive: true }
//     }, {
//       path: 'create',
//       hidden: true,
//       component: () => import('@/views/admin/business/detail'),
//       name: 'businessCreat',
//       meta: { title: 'businessCreat', module: '商户', crud: 'c'}
//     }, {
//       path: ':id(\\d+)',
//       hidden: true,
//       component: () => import('@/views/admin/business/detail'),
//       name: 'businessDetail',
//       meta: { title: 'businessDetail', module: '商户'}
//     }]
//   },
//   {
//     path: '/abutment',
//     component: Layout,
//     redirect: '/abutment/list',
//     alwaysShow: true,
//     name: 'abutment',
//     meta: {
//       title: 'abutment',
//       icon: 'el-icon-connection',
//       res: ['abutment/list'],
//       keepAlive: true
//     },
//     children: [{
//       path: 'list',
//       component: () => import('@/views/admin/abutment/list'),
//       name: 'abutmentList',
//       meta: { title: 'abutmentList',res: ['abutment/list']}
//     }, {
//       path: 'create',
//       hidden: true,
//       component: () => import('@/views/admin/abutment/detail'),
//       name: 'abutmentCreat',
//       meta: { title: 'abutmentCreat', module: '对接器', crud: 'c' }
//     }, {
//       path: ':id(\\d+)',
//       hidden: true,
//       component: () => import('@/views/admin/abutment/detail'),
//       name: 'abutmentDetail',
//       meta: { title: 'abutmentDetail', module: '对接器'}
//     }]
//   },
//   {
//     path: '/clue',
//     component: Layout,
//     redirect: '/clue/list',
//     alwaysShow: true,
//     name: 'clue',
//     meta: {
//       title: 'clue',
//       icon: 'el-icon-search',
//       res: ['clue/list'],
//       keepAlive: true
//     },
//     children: [{
//       path: 'list',
//       component: () => import('@/views/admin/clue/list'),
//       name: 'clueList',
//       meta: { title: 'clueList',res: ['clue/list'], keepAlive: true}
//     },{
//       path: ':id',
//       component: () => import('@/views/admin/clue/detail'),
//       name: 'clueDetail',
//       hidden: true,
//       meta: { title: 'clueDetail', module: '线索'}
//     }]
//   },
  
//   systemRouter
// ]
import Layout from '@/layout'
import systemRouter from './modules/systemRouter'

export default [
  {
    path: '/',
    component: Layout,
    redirect: '/data',
    name: 'datasurvey',
    alwaysShow: true,
    meta: {
      title: 'businessOperation',
      icon: 'dashboard',
      keepAlive: true      
    },
    children: [{
      path: 'data',
      component: () => import('@/views/admin/data/dashboard'),
      name: 'dashboard',
      meta: { title: 'dashboard',res: ['data'] } //, affix: false }
    },
    {
        path: '/subject/list',
        component: () => import('@/views/admin/subject/list'),
        name: 'subjectList',
        meta: { title: 'subjectList', module: '专题列表', res: ['subject/list'], keepAlive: true}
      }, {
        path: '/subject/create',
        hidden: true,
        component: () => import('@/views/admin/subject/detail'),
        name: 'subjectCreat',
        meta: { title: 'subjectCreat', module: '专题创建', crud: 'c',res: ['subject/create']}
      }, {
        path: '/subject/detail/:id(\\d+)',
        hidden: true,
        component: () => import('@/views/admin/subject/detail'),
        name: 'subjectDetail',
        meta: { title: 'subjectDetail', module: '专题详情',res: ['subject/detail']}
      },{
        path: '/subject/clue-list/:id(\\d+)',
        hidden: true,
        component: () => import('@/views/admin/subject/clue-list'),
        name: 'subjectClue',
        meta: { title: 'subjectClue', module: '专题线索',res: ['subject/clue-list']}
      },{
        path: '/subject/set-task/:id(\\d+)',
        hidden: true,
        component: () => import('@/views/admin/subject/set-task'),
        name: 'setTask',
        meta: { title: 'setTask', module: '专题对接任务',res: ['subject/set-task']}
      },
      // {
      //   path: '/subject/export',
      //   hidden: true,
      //   component: () => import('@/views/admin/subject/batch-export'),
      //   name: 'subjectExport',
      //   meta: { title: 'subjectExport', module: '',res: ['subject/export']}
      // },
      {
        path: '/subject/batch',
        component: () => import('@/views/admin/subject/batch'),
        name: 'batch',
        meta: { title: 'batch', module: '多专题操作',res: ['subject/batch']}
      },{
        path: '/business/list',
        component: () => import('@/views/admin/business/list'),
        name: 'businessList',
        meta: { title: 'businessList', module: '商户列表',res: ['business/list']}
      }, {
        path: '/business/create',
        hidden: true,
        component: () => import('@/views/admin/business/detail'),
        name: 'businessCreat',
        meta: { title: 'businessCreat', module: '商户创建', crud: 'c', res: ['business/create']}
      }, {
        path: '/business/:id(\\d+)',
        hidden: true,
        component: () => import('@/views/admin/business/detail'),
        name: 'businessDetail',
        meta: { title: 'businessDetail', module: '商户详情', res: ['business/detail']}
      },{
        path: '/abutment/List',
        component: () => import('@/views/admin/abutment/list'),
        name: 'abutmentList',
        meta: { title: 'abutmentList', module: '对接器列表',res: ['abutment/list']}
      }, {
        path: '/abutment/create',
        hidden: true,
        component: () => import('@/views/admin/abutment/detail'),
        name: 'abutmentCreat',
        meta: { title: 'abutmentCreat', module: '对接器创建', crud: 'c',res: ['abutment/create'] }
      }, {
        path: '/abutment/:id(\\d+)',
        hidden: true,
        component: () => import('@/views/admin/abutment/detail'),
        name: 'abutmentDetail',
        meta: { title: 'abutmentDetail', module: '对接器详情',res: ['abutment/detail']}
      },{
        path: '/clue/list',
        component: () => import('@/views/admin/clue/list'),
        name: 'clueList',
        meta: { title: 'clueList', module: '线索列表',res: ['clue/list']}
      },{
        path: '/blackList/list',
        component: () => import('@/views/admin/blackList/list'),
        name: 'blackList',
        meta: { title: 'blackList', module: '黑名单列表',res: ['blackList/list']}
      },{
        path: '/blackList/create',
        hidden: true,
        component: () => import('@/views/admin/blackList/detail'),
        name: 'blackListCreat',
        meta: { title: 'blackListCreat', module: '黑名单创建', crud: 'c', res: ['blackList/create']}
      }
    ]
    },
  
  systemRouter
]
