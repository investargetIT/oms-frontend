export const r3Cols: any[] = [
  {
    title: '#',
    width: 40,
    dataIndex: 'index',
    valueIndex: 'index',
    render(text: number) {
      return text + 1;
    },
    search: false,
  },
  // { title: '联系人号', width: 150, dataIndex: 'contactCodeR3', ellipsis: true, search: false },
  { title: '联系人号', width: 150, dataIndex: 'contactCode', ellipsis: true, search: false },
  {
    title: '联系人名称',
    width: 150,
    dataIndex: 'contactName',
    ellipsis: true,
    search: true,
    renderFormItem: () => {
      return text;
    },
  },
  {
    title: '是否已冻结',
    width: 150,
    dataIndex: 'effective',
    ellipsis: true,
    search: false,
    // render(text, record) {
    //   if (record.effective == 1) {
    //     return '否';
    //   } else if (record.effective == 0) {
    //     return '是';
    //   }
    // },
    render(record: any) {
      return record;
    },
  },
  { title: '联系人邮箱', width: 260, dataIndex: 'email', ellipsis: true, search: false },
  { title: '联系人手机', width: 150, dataIndex: 'mobile', ellipsis: true, search: false },
  { title: '联系人固话', width: 150, dataIndex: 'tel', ellipsis: true, search: false },
  {
    title: '关键词',
    width: 150,
    dataIndex: 'keyword',
    ellipsis: true,
    hideInTable: true,
    fieldProps: {
      placeholder: '查询邮箱、手机、固话',
    },
  },
];

export const receiverAddressCols: any[] = [
  {
    title: '#',
    width: 40,
    dataIndex: 'index',
    valueIndex: 'index',
    render(text: number) {
      return text + 1;
    },
    search: false,
  },
  {
    title: '所在地区',
    dataIndex: 'provinceName',
    width: 180,
    render(record: any) {
      return record;
    },
    ellipsis: true,
    search: false,
  },
  { title: '收件地址', width: 260, dataIndex: 'receiptAddress', ellipsis: true, search: true },
  { title: '收件人', width: 150, dataIndex: 'recipientName', ellipsis: true, search: true },
  { title: '收件邮编', width: 150, dataIndex: 'receiptZipCode', ellipsis: true, search: false },
  {
    title: '收件人手机',
    width: 150,
    dataIndex: 'receiptMobilePhone',
    ellipsis: true,
    search: true,
  },
  { title: '收件人固话', width: 150, dataIndex: 'receiptFixPhone', ellipsis: true, search: false },
  { title: '收件人邮箱', width: 180, dataIndex: 'receiptEmail', ellipsis: true, search: false },
];

export const invoiceInfoCols: any[] = [
  {
    title: '#',
    width: 40,
    dataIndex: 'index',
    valueIndex: 'index',
    render(text: number) {
      return text + 1;
    },
    search: false,
  },
  {
    title: '开票抬头',
    width: 200,
    dataIndex: 'customerName',
    ellipsis: true,
    search: false,
  },
  { title: '纳税人识别号', width: 200, dataIndex: 'taxNumber', ellipsis: true, search: false },
  { title: '开户银行', width: 200, dataIndex: 'bankName', ellipsis: true, search: false },
  { title: '开户账号', width: 200, dataIndex: 'bankAccount', ellipsis: true, search: false },
  { title: '注册地址', width: 200, dataIndex: 'registerAddress', ellipsis: true, search: false },
  { title: '注册电话', width: 150, dataIndex: 'registerTelephone', ellipsis: true, search: false },
];

export const invoiceAddressCols: any[] = [
  {
    title: '#',
    width: 40,
    dataIndex: 'index',
    valueIndex: 'index',
    render(text: number) {
      return text + 1;
    },
    search: false,
    fixed: 'left',
  },
  {
    title: '发票收件地区',
    dataIndex: 'provinceName',
    width: 180,
    render(record: any) {
      return record;
    },
    ellipsis: true,
    search: false,
  },
  { title: '发票收件地址', dataIndex: 'receiptAddress', width: 260, ellipsis: true, search: true },
  { title: '发票收件人', dataIndex: 'recipientName', width: 100, ellipsis: true },
  { title: '发票收件邮编', dataIndex: 'receiptZipCode', width: 100, ellipsis: true, search: false },
  {
    title: '发票收件手机',
    dataIndex: 'receiptMobilePhone',
    width: 100,
    ellipsis: true,
    search: true,
  },
  {
    title: '发票收件固话',
    dataIndex: 'receiptFixPhone',
    width: 100,
    ellipsis: true,
    search: false,
  },
  { title: '发票收件邮箱', dataIndex: 'receiptEmail', width: 180, ellipsis: true, search: false },
];
