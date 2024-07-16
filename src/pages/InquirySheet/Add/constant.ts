export const customCols: any[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueIndex: 'index',
    width: 50,
    search: false,
    render(text: number) {
      return text + 1;
    },
  },
  { title: '客户名称', dataIndex: 'customerName', width: 250, ellipsis: true },
  { title: '客户号', dataIndex: 'customerCode', width: 180, ellipsis: true },
  { title: '城市名称', dataIndex: 'customerArea', width: 200, ellipsis: true, search: false },
  { title: '街道名称', dataIndex: 'customerAddress', width: 200, ellipsis: true, search: false },
  { title: '所属公司', dataIndex: 'branchCompanyName', width: 200, ellipsis: true, search: false },
  {
    title: '所属事业部',
    dataIndex: 'branchDivisionName',
    width: 200,
    ellipsis: true,
    search: false,
  },
  { title: '所属团队', dataIndex: 'branchTeamName', width: 200, ellipsis: true, search: false },
];
export const merchantCols: any[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueIndex: 'index',
    width: 50,
    search: false,
    render(text: number) {
      return text + 1;
    },
  },
  { title: '商机编号', dataIndex: 'oppoId', ellipsis: true, search: false },
  { title: '商机名称', dataIndex: 'oppoValue', ellipsis: true },
  { title: '商机类型', dataIndex: 'type', ellipsis: true, search: false },
  { title: '成交几率', dataIndex: 'transactionProbability', ellipsis: true, search: false },
];
export const r3Cols: any[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueIndex: 'index',
    search: false,
    width: 50,
    render(text: number) {
      return text + 1;
    },
  },
  { title: '联系人号', dataIndex: 'contactCode', ellipsis: true, search: false },
  { title: '联系人名称', dataIndex: 'contactName', ellipsis: true, search: true },
  // { title: '是否已冻结', dataIndex: 'contactFreeze', ellipsis: true, search: false },
  // { title: '邮箱', dataIndex: 'contactEmail', ellipsis: true, search: false },
  // { title: '座机', dataIndex: 'landline', ellipsis: true, search: false },
  // { title: '座机分机', dataIndex: 'landlineExtension', ellipsis: true, search: false },
  {
    title: '是否已冻结',
    width: 150,
    dataIndex: 'effective',
    ellipsis: true,
    search: false,
    render(_: any, record: any) {
      if (record.effective == 0) {
        return '否';
      } else if (record.effective == 1) {
        return '是';
      }
    },
    // render(record: any) {
    //   return record;
    // },
  },
  { title: '联系人邮箱', width: 260, dataIndex: 'email', ellipsis: true, search: false },
  { title: '联系人手机', width: 150, dataIndex: 'mobile', ellipsis: true, search: false },
  { title: '联系人固话', width: 150, dataIndex: 'tel', ellipsis: true, search: false },
];
