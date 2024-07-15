export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    name: 'task-center',
    path: '/task-center',
    access: 'normalRouteFilter',
    icon: 'smile',
    routes: [
      // {
      //   name: 'task-me',
      //   path: '/task-center/task-me/index',
      //   component: './task-center/task-all/index',
      // },
      // {
      //   name: 'task-all',
      //   path: '/task-center/task-all/index',
      //   component: './task-center/task-all/index',
      // },
      // {
      //   name: 'task-sale',
      //   path: '/task-center/task-sale/index',
      //   component: './task-center/task-all/index',
      // },
      {
        name: 'item-task',
        path: '/task-center/item-task/index',
        component: './task-center/item-task/index',
      },
      {
        name: 'task-setting',
        path: '/task-center/task-setting/index',
        component: './task-center/task-setting/index',
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
