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
  // {
  //   path: '/welcome',
  //   name: 'welcome',
  //   icon: 'smile',
  //   component: './Welcome',
  // },
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
    name: 'system',
    path: '/system',
    access: 'normalRouteFilter',
    routes: [
      {
        name: 'basic',
        path: '/system/basic',
        routes: [
          {
            name: 'channel',
            path: '/system/basic/channel',
            component: './System/ChannelConfig/index',
          },
          {
            name: 'SAC',
            path: '/system/basic/SAC',
            component: './System/SAC/index',
          },
          {
            name: 'JV',
            path: '/system/basic/JV',
            component: './System/Jvconfig/index',
          },
          {
            name: 'inventoryMaintenance',
            path: '/system/basic/inventoryMaintenance',
            component: './System/InventoryMaintenance/index',
          },
        ],
      },
      {
        name: 'offer-config',
        path: '/system/offer-config',
        routes: [
          {
            name: 'basic-config',
            path: '/system/offer-config/basic-config',
            component: './System/OfferConfig/BasicConfig',
          },
        ],
      },
    ],
  },
  {
    name: 'approval',
    path: '/approval',
    access: 'normalRouteFilter',
    routes: [
      {
        name: 'doself',
        path: '/approval/doself',
        component: './ApprovalFlow/TaskList',
      },
      {
        name: 'submitself',
        path: '/approval/submitself',
        component: './ApprovalFlow/TaskList',
      },
      {
        name: 'processrecycle',
        path: '/approval/processrecycle',
        component: './ApprovalFlow/Processrecycle',
      },
    ],
  },
  {
    name: 'task-center',
    path: '/task-center',
    access: 'normalRouteFilter',
    // icon: 'smile',
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
    name: 'scrap',
    path: '/scrap',
    access: 'normalRouteFilter',
    routes: [
      {
        name: 'sales',
        path: '/scrap/sales',
        routes: [
          {
            name: 'apply',
            path: '/scrap/sales/apply',
            component: './scrap/sales/apply',
          },
          {
            name: 'add',
            path: '/scrap/sales/apply/add/:id?',
            hideInMenu: true,
            component: './scrap/sales/apply/add',
          },
          {
            name: 'detail',
            path: '/scrap/sales/apply/detail/:id?',
            hideInMenu: true,
            component: './scrap/sales/apply/ScrapDetail',
          },
          {
            name: 'order',
            path: '/scrap/sales/order',
            component: './scrap/sales/order',
          },
        ],
      },
    ],
  },
  {
    name: 'to-loan',
    path: '/to-loan',
    access: 'normalRouteFilter',
    routes: [
      {
        name: 'apply',
        path: '/to-loan/apply/index',
        component: './to-loan/apply/index',
      },
      {
        name: 'add',
        path: '/to-loan/apply/add',
        hideInMenu: true,
        component: './to-loan/apply/add',
      },
      {
        name: 'edit',
        path: '/to-loan/apply/edit',
        hideInMenu: true,
        component: './to-loan/apply/edit',
      },
      {
        name: 'detail',
        path: '/to-loan/apply/detail',
        hideInMenu: true,
        component: './to-loan/apply/Drawer/Drawer.tsx',
      },
      {
        name: 'order',
        path: '/to-loan/order/index',
        component: './to-loan/order/index',
      },
    ],
  },
  {
    name: 'stock',
    path: '/stock',
    access: 'normalRouteFilter',
    routes: [
      {
        name: 'available',
        path: '/stock/available',
        component: './Stock/Available',
      },
      {
        name: 'using',
        path: '/stock/using',
        component: './Stock/Using',
      },
    ],
  },
  {
    name: 'inquiry',
    path: '/inquiry',
    access: 'normalRouteFilter',
    routes: [
      {
        name: 'lectotype',
        path: '/inquiry/lectotype',
        component: './InquirySheet/Lectotype/index',
      },
      {
        name: 'add',
        path: '/inquiry/add',
        hideInMenu: true,
        component: './InquirySheet/Add/Index',
      },
      {
        name: 'edit',
        path: '/inquiry/edit/:id',
        hideInMenu: true,
        component: './InquirySheet/Add/Index',
      },
      {
        name: 'info',
        path: '/inquiry/info',
        hideInMenu: true,
        component: './InquirySheet/Info/index',
      },
      {
        name: 'allmatch',
        path: '/inquiry/allmatch',
        component: './InquirySheet/LectotypeOperate/index',
      },
      {
        name: 'ae',
        path: '/inquiry/ae',
        component: './InquirySheet/LectotypeOperate/index',
      },
      {
        name: 'te',
        path: '/inquiry/te',
        component: './InquirySheet/LectotypeOperate/index',
      },
      {
        name: 'aepcm',
        path: '/inquiry/aepcm',
        component: './InquirySheet/LectotypeOperate/index',
      },
      {
        name: 'tepcm',
        path: '/inquiry/tepcm',
        component: './InquirySheet/LectotypeOperate/index',
      },
      {
        name: 'createsku',
        path: '/inquiry/createsku',
        component: './InquirySheet/LectotypeOperate/index',
      },
      {
        name: 'sourcing',
        path: '/inquiry/sourcing',
        routes: [
          {
            name: 'all',
            path: '/inquiry/sourcing/all',
            component: './InquirySheet/LectotypeOperate/index',
          },
          {
            name: 'quote',
            path: '/inquiry/sourcing/quote',
            component: './InquirySheet/LectotypeOperate/index',
          },
          {
            name: 'otherchannel',
            path: '/inquiry/sourcing/otherchannel',
            component: './InquirySheet/LectotypeOperate/index',
          },
          {
            name: 'sourcing-pcm',
            path: '/inquiry/sourcing/sourcing-pcm',
            component: './InquirySheet/LectotypeOperate/index',
          },
          {
            name: 'sourcing-pcd',
            path: '/inquiry/sourcing/sourcing-pcd',
            component: './InquirySheet/LectotypeOperate/index',
          },
        ],
      },
      {
        name: 'actualTime',
        path: '/inquiry/actualTime',
        routes: [
          {
            name: 'allRFQ',
            path: '/inquiry/actualTime/allRFQ',
            component: './InquirySheet/LectotypeOperate/index',
          },
          {
            name: 'RFQquote',
            path: '/inquiry/actualTime/RFQquote',
            component: './InquirySheet/LectotypeOperate/index',
          },
        ],
      },
      {
        name: 'offer',
        path: '/inquiry/offer',
        component: './InquirySheet/Offer/index',
      },
      {
        name: 'order',
        path: '/inquiry/offer/order/:id?',
        component: './InquirySheet/Offer/Order',
        hideInMenu: true,
      },
      {
        name: 'offerOrder',
        path: '/inquiry/offer/offerOrder/:id?',
        component: './InquirySheet/Offer/OfferOrder',
        hideInMenu: true,
      },
      {
        name: 'edit',
        path: '/inquiry/offer/edit/:id?',
        component: './InquirySheet/Offer/Edit',
        hideInMenu: true,
      },
      {
        name: 'detail',
        path: '/inquiry/offer/detail/:id?',
        component: './InquirySheet/Offer/Detail',
        hideInMenu: true,
      },
      {
        name: 'csp-offer',
        path: '/inquiry/csp-offer',
        component: './InquirySheet/Offer/CSPOffer/index',
      },
      {
        name: 'csp-apply',
        path: '/inquiry/csp-offer/csp-apply/:id?',
        component: './InquirySheet/Offer/CSPOffer/CSPApply',
        hideInMenu: true,
      },
      {
        name: 'setting',
        path: '/inquiry/setting',
        component: './InquirySheet/Setting/Index',
      },
    ],
  },
  {
    name: 'sales',
    path: '/sales',
    access: 'normalRouteFilter',
    routes: [
      {
        name: 'list',
        path: '/sales/list',
        exact: true,
        component: './SalesOrder/Order/index',
      },
      {
        name: 'service',
        path: '/sales/service',
        exact: true,
        component: './SalesOrder/Service/index',
      },
      // {
      //   path: '/sales/SAP',
      //   name: 'SAP订单列表',
      //   exact: true,
      //   component: './SalesOrder/SAP',
      // },
      // {
      //   path: '/sales/stock',
      //   name: '库存查询',
      //   exact: true,
      //   component: './SalesOrder/Stock',
      // },
      {
        name: 'CSRMaster',
        path: '/sales/CSRMaster',
        exact: true,
        component: './SalesOrder/CSRApproveMasterData/index',
      },
      {
        name: 'CSROrder',
        path: '/sales/CSROrder',
        exact: true,
        component: './SalesOrder/CSRApproveOrder/index',
      },
      // {
      //   path: '/sales/OAM',
      //   name: '订单运维',
      //   exact: true,
      //   component: './SalesOrder/OAM',
      // },
      {
        name: 'delivery',
        path: '/sales/delivery',
        exact: true,
        component: './SalesOrder/Delivery/index',
      },
      {
        name: 'FRA',
        path: '/sales/FRA',
        exact: true,
        component: './SalesOrder/FRAudit/index',
      },
      {
        name: 'ODM',
        path: '/sales/ODM',
        exact: true,
        component: './SalesOrder/ODModification/index',
      },
      {
        name: 'OMARecord',
        path: '/sales/OMARecord',
        exact: true,
        component: './SalesOrder/OMARecord/index',
      },
      {
        name: 'WarehouseConfig',
        path: '/sales/WarehouseConfig',
        exact: true,
        component: './SalesOrder/WarehouseConfig/index',
      },
      {
        name: 'CSRSettings',
        path: '/sales/CSRSettings',
        exact: true,
        component: './SalesOrder/CSRSettings/index',
      },
    ],
  },
  // {
  //   name: 'sales-after',
  //   path: '/sales-after',
  //   access: 'normalRouteFilter',
  //   routes: [
  //     {
  //       name: 'OMA',
  //       path: '/sales-after/OMA',
  //       component: './SalesOrder/OrderModificationApplication/index',
  //     },
  //     // {
  //     //   path: '/sales-after/OMA/add',
  //     //   name: '新增订单修改申请',
  //     // 	hideInMenu: true,
  //     //   component: './SalesAfter/OrderModificationApplication/Add',
  //     // },
  //     {
  //       name: 'apply',
  //       path: '/sales-after/apply',
  //       component: './SalesAfter/Apply/index',
  //     },
  //     {
  //       name: 'apply-handle',
  //       path: '/sales-after/apply/handle/:id?',
  //       hideInMenu: true,
  //       component: './SalesAfter/Apply/Handle',
  //     },
  //     // {
  //     //   path: '/sales-after/apply/detail/:id?',
  //     //   name: '售后申请详情',
  //     //   hideInMenu: true,
  //     //   component: './SalesAfter/Apply/Detail',
  //     // },
  //     {
  //       name: 'apply-add',
  //       path: '/sales-after/apply/add',
  //       hideInMenu: true,
  //       component: './SalesAfter/Apply/add',
  //     },
  //     {
  //       name: 'borrow-add',
  //       path: '/sales-after/borrow/add',
  //       hideInMenu: true,
  //       component: './SalesAfter/Borrow/Apply/components/Add',
  //     },
  //     {
  //       name: 'apply-edit',
  //       path: '/sales-after/apply/edit',
  //       hideInMenu: true,
  //       component: './SalesAfter/Apply/edit',
  //     },
  //     {
  //       name: 'order',
  //       path: '/sales-after/order',
  //       component: './SalesAfter/Order',
  //     },
  //     {
  //       name: 'invoice',
  //       path: '/sales-after/invoice',
  //       component: './SalesAfter/InvoiceBack',
  //     },
  //     {
  //       name: 'invoiceinfo',
  //       path: '/sales-after/invoiceinfo/:id?',
  //       hideInMenu: true,
  //       component: './SalesAfter/InvoiceBack/Info',
  //     },
  //     {
  //       path: '/sales-after/order/detail/:id?',
  //       name: 'order-detail',
  //       hideInMenu: true,
  //       component: './SalesAfter/Order/Detail',
  //     },
  //     {
  //       name: 'scrap-management',
  //       path: '/sales-after/scrap-management',
  //       routes: [
  //         {
  //           name: 'scrap-apply',
  //           path: '/sales-after/scrap-management/scrap-apply',
  //           component: './SalesAfter/ScrapManagement/ScrapApply',
  //         },
  //         {
  //           name: 'add',
  //           path: '/sales-after/scrap-management/scrap-apply/add/:id?',
  //           hideInMenu: true,
  //           component: './SalesAfter/ScrapManagement/ScrapApply/add',
  //         },
  //         {
  //           name: 'scrap-order',
  //           path: '/sales-after/scrap-management/scrap-order',
  //           component: './SalesAfter/ScrapManagement/ScrapOrder',
  //         },
  //         {
  //           name: 'detail',
  //           path: '/sales-after/scrap-management/scrap-order/detail/:id?',
  //           hideInMenu: true,
  //           component: './SalesAfter/ScrapManagement/ScrapOrder/detail',
  //         },
  //       ],
  //     },
  //     {
  //       name: 'Borrow',
  //       path: '/sales-after/Borrow',
  //       routes: [
  //         {
  //           name: 'Apply',
  //           path: '/sales-after/Borrow/Apply',
  //           component: './SalesAfter/Borrow/Apply',
  //         },
  //         {
  //           name: 'Order',
  //           path: '/sales-after/Borrow/Order',
  //           component: './SalesAfter/Borrow/Order',
  //         },
  //         {
  //           name: 'detail',
  //           path: '/sales-after/Borrow/Apply/detail',
  //           hideInMenu: true,
  //           component: './SalesAfter/Borrow/Apply/components/Drawer/Drawer.tsx',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   component: './Admin',
  //   routes: [
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //     {
  //       component: './404',
  //     },
  //   ],
  // },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
