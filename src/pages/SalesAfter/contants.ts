// 售后管理

import type { ProColumns } from '@ant-design/pro-table';

// 类型和映射 //接口已使用
export const applyType = [
  { id: 0, value: 0, label: '全部' },
  { id: 1, value: 1, label: '草稿' },
  { id: 2, value: 2, label: '审批中' },
  { id: 3, value: 3, label: '已完成' },
  { id: 4, value: 4, label: '取消' },
];
export const orderType = [
  { id: 0, value: 0, label: '全部' },
  { id: 1, value: 1, label: '补发订单' },
  { id: 2, value: 2, label: '退货订单' },
  { id: 3, value: 3, label: '换货订单' },
  { id: 4, value: 4, label: '维修订单' },
];

export const oldOrderType = [
  { id: 0, value: 0, label: '全部' },
  { id: 1, value: 1, label: '普通销售订单' },
  { id: 2, value: 2, label: '智能柜订单' },
];
export const channelType = [
  { id: 0, value: 0, label: '全部' },
  { id: 1, value: 1, label: 'OMS' },
  { id: 2, value: 2, label: 'WAP站点' },
];
export const channelApplyType = [
  { id: 0, value: 0, label: '全部' },
  { id: 1, value: 1, label: 'OMS' },
  { id: 4, value: 4, label: 'API' },
  { id: 2, value: 2, label: 'GPS' },
  { id: 3, value: 3, label: 'GPS-PunchOut' },
];
export const scrOrderStatusList = [
  // 报废订单状态
  { id: 0, label: '全部' },
  { id: 9, label: 'CSR审核主数据' },
  { id: 10, label: '待销售确认' },
  { id: 20, label: 'CSR审核订单' },
  { id: 80, label: '等待系统信用检查' },
  { id: 81, label: '财务审核' },
  { id: 91, label: '等待SKU同步' },
  { id: 90, label: '预订单待确认' },
  { id: 11, label: '等待订单同步' },
  { id: 12, label: '订单同步中' },
  { id: 13, label: '同步成功' },
  { id: 14, label: '已通知源系统' },
  { id: 15, label: '部分交货' },
  { id: 16, label: '全部交货' },
  { id: 17, label: '订单同步失败' },
  { id: 18, label: '已取消' },
  { id: 19, label: '财务放单过期' },
  { id: 21, label: '已删除' },
  { id: 22, label: '等待仓库确认' },
  { id: 23, label: '订单锁定' },
  { id: 24, label: '审批中' },
];
// table Columns
export const orderAfterColumns: ProColumns<any>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 50,
    fixed: 'left',
  },
  {
    title: 'SKU',
    dataIndex: 'sku',
    width: 100,
    fixed: 'left',
  },
  {
    title: '数量',
    dataIndex: 'qty',
    width: 100,
  },
  {
    title: '销售单位',
    dataIndex: 'salesUnit',
    width: 100,
  },
  { title: '物料码', dataIndex: 'stockSkuCode', width: 100 },
  { title: '销售包装单位数量', dataIndex: 'unitQuantity', width: 150 },
  {
    title: '面价',
    dataIndex: 'facePrice',
    className: 'brown',
    width: 100,
  },
  {
    title: '成交价-含税',
    dataIndex: 'dealTaxPrice',
    className: 'brown',
    width: 100,
  },
  {
    title: '成交价-未税',
    dataIndex: 'noDealTaxPrice',
    className: 'brown',
    width: 100,
  },
  {
    title: '小计-含税',
    dataIndex: 'taxSubtotalPrice',
    className: 'brown',
    width: 100,
  },
  {
    title: '小计-未税',
    dataIndex: 'noTaxSubtotalPrice',
    className: 'brown',
    // render: (_, record) => {
    //   if (!record.qty || !record.salesPriceNet) {
    //     return '-';
    //   } else {
    //     return (record.qty * record.salesPriceNet).toFixed(0);
    //   }
    // },
    width: 100,
  },
  {
    title: '小计-折扣',
    dataIndex: 'discountSubtotalPrice',
    className: 'brown',
    width: 100,
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    width: 400,
    render: (_, record: any) => {
      return `${record?.brand || ''} ${record?.productName} ${record?.manufacturerNo || ''}`;
    },
  },
  {
    title: '品牌',
    dataIndex: 'brand',
    width: 100,
  },
  {
    title: '制造商型号',
    dataIndex: 'manufacturerNo',
    width: 100,
  },
  {
    title: '供应商型号',
    dataIndex: 'supplierNo',
    width: 100,
  },
  {
    title: '物理单位',
    dataIndex: 'physicsUnit',
    width: 100,
  },
  {
    title: '交付周期(工作日)',
    dataIndex: 'leadTime',
    width: 100,
  },
  // {
  //   title: '是否可退换货',
  //   dataIndex: 'returnFlagName',
  //   width: 100,
  // },
  {
    title: '是否可退货',
    dataIndex: 'supplierReturn',
    render: (_, record: any) =>
      record?.supplierReturn == 0 ? '不可退货' : record?.supplierReturn == 1 ? '可退货' : '-',
    width: 100,
  },
  {
    title: '是否可换货',
    dataIndex: 'supplierExchange',
    render: (_, record: any) =>
      record.supplierExchange == 0 ? '不可换货' : record?.supplierExchange == 1 ? '可换货' : '-',
    width: 100,
  },
  {
    title: '是否直送',
    dataIndex: 'directDeliveryFlag',
    render: (_, record: any) => {
      if (record.directDeliveryFlag == 1) {
        return '是';
      } else if (record.directDeliveryFlag == 0) {
        return '否';
      } else {
        return record.directDeliveryFlag;
      }
    },
    width: 100,
  },
  {
    title: 'SKU类型',
    dataIndex: 'skuTypeName',
    width: 100,
  },
  {
    title: '产品业务状态',
    dataIndex: 'businessStatus',
    width: 100,
  },
  {
    title: '备货状态',
    dataIndex: 'stockType',
    width: 100,
  },
  {
    title: '运费',
    dataIndex: 'freightPrice',
    width: 100,
  },
  {
    title: '国际运费',
    dataIndex: 'intlFreightPrice',
    width: 100,
  },
  {
    title: '关税',
    dataIndex: 'tariffPrice',
    width: 100,
  },
  {
    title: '退回仓库',
    dataIndex: 'returnWarehouseTypeName',
    width: 100,
  },
  {
    title: '发货仓库',
    dataIndex: 'deliveryWarehouse',
    width: 100,
  },
  {
    title: '发货仓库名称',
    dataIndex: 'deliveryWarehouseName',
    width: 100,
  },
  {
    title: '货物起运点',
    dataIndex: 'startDot',
    width: 100,
  },
  {
    title: '货物起运点名称',
    dataIndex: 'startDotName',
    width: 100,
  },
  {
    title: '预计发货日期',
    dataIndex: 'expectDate',
    valueType: 'date',
    width: 100,
  },
];
export const relationFluxColumns: ProColumns<any>[] = [
  {
    title: '#',
    dataIndex: 'index',
    valueType: 'index',
    width: 50,
    fixed: 'left',
  },
  {
    title: '流程ID',
    dataIndex: 'workflowId',
    width: 100,
  },
  // {
  //   title: '单据编号',
  //   dataIndex: 'billNo',
  //   width: 100,
  // },
  // {
  //   title: '流程标题',
  //   dataIndex: 'workflowName',
  //   width: 100,
  // },
  // {
  //   title: '工作流类型',
  //   dataIndex: 'workflowType',
  //   width: 100,
  // },
  // {
  //   title: '发起时间',
  //   valueType: 'date',
  //   dataIndex: 'seedTime',
  //   width: 100,
  // },
  // {
  //   title: '候选人',
  //   dataIndex: 'salesPrice',
  //   width: 100,
  // },
  // {
  //   title: '申请人',
  //   dataIndex: 'applicant',
  //   width: 100,
  // },
];
// export const transportStatus = [
//   { id: '1', name: '已揽收' },
//   { id: '2', name: '准备出发' },
//   { id: '3', name: '已发出' },
//   { id: '4', name: '到达' },
//   { id: '5', name: '派送' },
//   { id: '6', name: '签收' },
//   { id: '7', name: '拒收' },
//   { id: '10', name: '其他' },
// ];

export const EnumKo = {
  '1': '已揽收',
  '2': '准备出发',
  '3': '已发出',
  '4': '到达',
  '5': '派送',
  '6': '签收',
  '7': '拒收',
  '10': '其他',
};

export const transportColumns: ProColumns<any>[] = [
  {
    title: '#',
    dataIndex: 'index',
    valueType: 'index',
    width: 50,
    fixed: 'left',
  },
  {
    title: '万物集物流状态',
    dataIndex: 'details',
    width: 100,
    render: (_, record) => record.code && EnumKo[record.code],
  },
  {
    title: '在途时间',
    dataIndex: 'date',
    width: 100,
  },
  {
    title: '在途详细',
    dataIndex: 'details',
    width: 100,
  },
  {
    title: '在途城市',
    dataIndex: 'place',
    width: 100,
  },
];
// 报废订单详情
export const scrapDetailBasicColumns: ProColumns<any>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 50,
    fixed: 'left',
  },
  {
    title: 'SKU',
    dataIndex: 'sku',
    width: 100,
    fixed: 'left',
  },
  { title: '物料码', dataIndex: 'stockSkuCode', width: 100 },
  { title: '销售包装单位数量', dataIndex: 'unitQuantity', width: 150 },
  {
    title: '报废数量',
    dataIndex: 'reqQty',
    width: 100,
  },
  {
    title: '销售单位',
    dataIndex: 'salesUomCode',
    width: 100,
  },
  {
    title: '面价',
    dataIndex: 'listPrice',
    width: 100,
  },
  {
    title: '成交价-含税',
    dataIndex: 'salesPrice',
    width: 100,
  },
  {
    title: '成交价-未税',
    dataIndex: 'salesPriceNet',
    width: 100,
  },
  {
    title: '小计-含税',
    dataIndex: 'totalAmount',
    width: 100,
    render: (_, record) => {
      if (!record.qty || !record.salesPrice) {
        return '-';
      } else {
        return (record.qty * record.salesPrice).toFixed(0);
      }
    },
  },
  {
    title: '小计-未税',
    dataIndex: 'totalAmountNet',
    render: (_, record) => {
      if (!record.qty || !record.salesPriceNet) {
        return '-';
      } else {
        return (record.qty * record.salesPriceNet).toFixed(0);
      }
    },
    width: 100,
  },
  {
    title: '运费',
    dataIndex: 'freight',
    width: 100,
  },
  {
    title: '国际运费',
    dataIndex: 'interFreight',
    width: 100,
  },
  {
    title: '关税',
    dataIndex: 'tariff',
    width: 100,
  },
];
// 状态颜色
export const colorEnum = {
  草稿: '#fadb14',
  取消: '#eb2f96',
  审批中: '#1890ff',
  进行中: '#1890ff',
  已完成: '#52c41a',
  紧急: '#ED5126',
  未开始: '#FAAD14',
  高: '#FAAD14',
  中: '#D4B108',
  低: '#98AFD0',
};

export const scrapDetailColumns: ProColumns<any>[] = [
  {
    title: '#',
    dataIndex: 'index',
    valueType: 'index',
    width: 50,
    fixed: 'left',
  },
  {
    title: 'SKU',
    dataIndex: 'sku',
    width: 100,
    fixed: 'left',
  },
  { title: '物料码', dataIndex: 'stockSkuCode', width: 100 },
  { title: '销售包装单位数量', dataIndex: 'unitQuantity', width: 150 },
  {
    title: '报废数量',
    dataIndex: 'qty',
    width: 100,
  },
  {
    title: '销售单位',
    dataIndex: 'unit',
    width: 100,
  },
  {
    title: '面价',
    dataIndex: 'facePrice',
    width: 100,
  },
  {
    title: '成交价含税',
    dataIndex: 'taxPrice',
    width: 100,
  },
  {
    title: '成交价未税',
    dataIndex: 'noTaxPrice',
    width: 100,
  },
  {
    title: '小计含税',
    dataIndex: 'taxSubtotalPrice',
    width: 100,
  },
  {
    title: '小计未税',
    dataIndex: 'noTaxSubtotalPrice',
    width: 100,
  },
  {
    title: '运费',
    dataIndex: 'freightPrice',
    width: 100,
  },
  {
    title: '国际运费',
    dataIndex: 'intlFreightPrice',
    width: 100,
  },
  {
    title: '关税',
    dataIndex: 'tariffPrice',
    width: 100,
  },
  {
    title: '仓库',
    dataIndex: 'wareCode',
    width: 100,
  },
];
