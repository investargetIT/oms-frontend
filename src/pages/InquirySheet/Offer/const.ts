import type { ProColumns } from '@ant-design/pro-table';

// 类型
export interface OfferProps {
  id?: number;
}
export type TableListItem = Record<any, any>;
// 定义常量（涉及到form的）
export const fieldLabels = {
  offerCode: '报价单号',
  customerName: '客户名称',
  customerCode: '客户代号',
  contactName: 'R3联系人',
  contactCodeR3: 'R3联系人代号',
  relationOrder: '关联订单号',
  salesName: '主销售',
  repeatThir: '30天内重复',
  headFreight: '头运费',
  adjust: '调整至',
  nationFreight: '国际运费',
  uploadFile: '上传附件',
  oldFreight: '原运费总计',
  newFreight: '调整后总运费',
  expectedDate: '客户期望交期',
  category: '订单类型',
  // 新增订单

  oppoValue: '商机名称',
  poNo: '客户采购单号',
  campaignCode: '网促活动代号',
  channel: '渠道',
  reqDelivDate: '要求发货日',
  branchCompanyName: '所属公司',
  deliver: '一次性发货',
  custMark: '客户备注',
  csrMark: 'CSR备注',
  remark: '备注',
  pricingMethod: '客户计价方式',

  region: '收货地区',
  shipStreet: '收货人地址',
  shipZip: '收货邮编',
  shipEmail: '收货人邮箱',
  consigneeName: '收货人名称',
  consigneeMobile: '收货人手机',
  consigneeTel: '收货人固话',
  consigneeTelExt: '分机号',
  isBonded: '是否保税区',
  qrCode: '特殊编码',

  shipType: '交货方式',
  paymentTerm: '支付条件',
  paymentMethod: '支付方式',

  invoiceType: '发票类型',
  invoiceTitle: '开票抬头',
  vatTaxNo: '纳税人识别号',
  vatAddress: '注册地址',
  vatPhone: '注册电话',
  regeditPhoneExtension: '注册电话分机',
  vatBankName: '开户银行',
  vatBankNo: '银行账号',

  invoiceReceiver: '发票收件人',
  invoiceAddress: '发票收件地址',
  invoiceZip: '发票收件邮编',
  invoiceTel: '发票收件固话',
  invoiceMobile: '发票收件手机',
  invoiceEmail: '发票收件人邮箱',
  invoiceGoods: '发票随货',

  quotValidDate: '报价单有效期',
  pname: '请购者',
  pemail: '请购者邮箱',
  pcontact: '请购者联系方式',
  createName: '创建人',
  createTime: '报价单创建时间',
};

// menuLink
export const menuLink = [
  { id: 1, link: '#basic', title: '基本信息' },
  { id: 2, link: '#receiver', title: '收货信息' },
  { id: 3, link: '#pay', title: '配送及支付' },
  { id: 4, link: '#invoice', title: '开票信息' },
  { id: 5, link: '#invoiceDeliver', title: '发票寄送' },
  { id: 6, link: '#shopDetail', title: '商品明细' },
  { id: 7, link: '#enclosure', title: '附件' },
];

//table columns
export const relationTableProcess: ProColumns<any>[] = [
  {
    title: '#',
    dataIndex: 'index',
    valueType: 'index',
    width: 50,
  },
  {
    title: '流程ID',
    dataIndex: 'createdAt',
  },
  {
    title: '流程名称',
    dataIndex: 'status',
  },
  {
    title: '任务名称',
    dataIndex: 'createdAt1',
  },
  {
    title: '任务状态',
    dataIndex: 'createdAt2',
  },
  {
    title: '发起时间',
    dataIndex: 'createdAt3',
    valueType: 'time',
  },
  {
    title: '结束时间',
    dataIndex: 'createdAt4',
    valueType: 'time',
  },
  {
    title: '候选人',
    dataIndex: 'createdAt5',
  },
  {
    title: '处理人',
    dataIndex: 'createdAt6',
  },
  {
    title: '描述',
    dataIndex: 'createdAt7',
  },
];
export const relationTableOrder: ProColumns<any>[] = [
  {
    title: '#',
    dataIndex: 'index',
    valueType: 'index',
    width: 50,
  },
  {
    title: '订单ID',
    // dataIndex: 'orderLineCode',
    dataIndex: 'orderNo',
    width: 250,
  },
  // {
  //   title: 'ERP订单号',
  //   dataIndex: 'erpCode',
  //   width: 250,
  // },
];

// log columns
export const logColumns: ProColumns<any>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 50,
  },
  {
    title: '操作时间',
    dataIndex: 'createTime',
    width: 200,
  },
  {
    title: '操作人',
    dataIndex: 'createName',
    width: 150,
  },
  {
    title: '操作内容',
    dataIndex: 'opContent',
    width: 250,
  },
];
