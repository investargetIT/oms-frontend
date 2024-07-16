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
    name: 'system-monitoring',
    path: '/system-monitoring',
    access: 'normalRouteFilter',
    routes: [
      {
        name: 'flux',
        path: '/system-monitoring/flux/index',
        component: './system-monitoring/flux/index',
      },
      {
        name: 'OMA',
        exact: true,
        path: '/system-monitoring/OMA',
        component: './system-monitoring/OMA/index',
      },
    ],
  },
  {
    path: '/reportforms',
    name: 'reportforms',
    access: 'normalRouteFilter',
    routes: [
      {
        path: '/reportforms/auditform',
        name: 'auditForm',
        exact: true,
        component: './DataReport/auditForm',
      },
      {
        path: '/reportforms/so',
        name: 'OpenSo',
        component: './OpenSo/index',
      },
    ],
  },
  {
    name: '系统设置',
    path: '/system',
    access: 'normalRouteFilter',
    routes: [
      {
        name: '基础设置',
        path: '/system/basic',
        routes: [
          {
            name: '渠道配置',
            path: '/system/basic/channel',
            component: './System/ChannelConfig/index',
          },
          {
            name: '售后原因配置',
            path: '/system/basic/SAC',
            component: './System/SAC/index',
          },
          {
            name: 'JV配置',
            path: '/system/basic/JV',
            component: './System/Jvconfig/index',
          },
          {
            name: '负毛利+报备清单维护',
            path: '/system/basic/inventoryMaintenance',
            component: './System/InventoryMaintenance/index',
          },
        ],
      },
      {
        name: '报价单操作配置',
        path: '/system/offer-config',
        routes: [
          {
            name: '基础数据配置',
            path: '/system/offer-config/basic-config',
            component: './System/OfferConfig/BasicConfig',
          },
        ],
      },
    ],
  },
  {
    name: 'task-center',
    path: '/task-center',
    access: 'normalRouteFilter',
    icon: 'smile',
    routes: [
      {
        name: 'task-me',
        path: '/task-center/task-me/index',
        component: './task-center/task-all/index',
      },
      {
        name: 'task-all',
        path: '/task-center/task-all/index',
        component: './task-center/task-all/index',
      },
      {
        name: 'task-sale',
        path: '/task-center/task-sale/index',
        component: './task-center/task-all/index',
      },
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
