export const inqueryStatus = [
  { id: '', label: '全部' },
  { id: '待提交', label: '待提交' },
  { id: '待AE选配型', label: '待AE选配型' },
  { id: '待TE选配型', label: '待TE选配型' },
  { id: '处理中', label: '处理中' },
  { id: '已取消', label: '已取消' },
  { id: '驳回', label: '驳回' },
  { id: '部分可转', label: '部分可转' },
  { id: '全部可转', label: '全部可转' },
];
export const inqueryType = [
  { id: '', label: '全部' },
  { id: '目录品', label: '目录品' },
  { id: '目录品/推荐', label: '目录品/推荐' },
  { id: '目录品/推荐/询价', label: '目录品/推荐/询价' },
  { id: '询价', label: '询价' },
  { id: '不限', label: '不限' },
];
export const levelList = [
  { id: '', label: '全部' },
  { id: '高', label: '高' },
  { id: '中', label: '中' },
  { id: '低', label: '低' },
];
export const numType = [
  { id: 0, label: '全部' },
  { id: 1, label: '目录品报价单' },
  { id: 2, label: 'Sourcing报价单' },
];
export const numStatusList = [
  { id: 0, label: '全部' },
  { id: 9, label: '待助力' },
  { id: 10, label: '可转订单' },
  { id: 93, label: '二次询价中' },
  { id: 20, label: '审批中' },
  { id: 80, label: '部分已清' },
  { id: 81, label: '全部已清' },
  { id: 91, label: '已过期' },
  { id: 90, label: '已取消' },
  { id: 99, label: '已删除' },
];
export const channelList = [
  { id: 0, label: '全部', value: 0 },
  { id: 10, label: 'OMS', value: 10 },
  { id: 4, label: 'Ezquote', value: 4 },
  { id: 5, label: 'Ezquote-PunchOut', value: 5 },
  { id: 2, label: 'GPS', value: 2 },
  { id: 3, label: 'GPS-PunchOut', value: 3 },
];
export const offerBtnList = [
  { id: '1', name: '转订单', type: 'primary', ghost: false },
  { id: '2', name: '合并报价单', type: 'default', ghost: false },
  { id: '3', name: '助力审批', type: 'primary', ghost: true },
  { id: '4', name: '延长有效期', type: 'primary', ghost: true },
  { id: '5', name: '运费调整', type: 'primary', ghost: true },
  { id: '6', name: '推送价格', type: 'primary', ghost: false },
  { id: '7', name: '取消报价', type: 'danger', ghost: false },
  { id: '8', name: '导出', type: 'default', ghost: false },
  // { id: '9', name: '获取分享链接', type: 'default', ghost: false },
];

export const EnumSkuType = {
  10: '目录品',
  20: 'FA物料',
  50: '美国馆物料',
};

export const NumStatus = {
  0: '全部',
  // 9: '待助力',
  10: '可转订单',
  20: '审批中',
  80: '部分已清',
  81: '全部已清',
  90: '已取消',
  91: '已过期',
  93: '二次询价',
  99: '已删除',
  100: '全部未清',
};
export const ChanelEnum = {
  '0': '全部',
  '10': 'OMS',
  '2': 'GPS',
  '3': 'GPS-PunchOut',
  '4': 'Ezquote',
  '5': 'Ezquote-PunchOut',
};
export const OfferEnum = {
  '0': '全部',
  '1': '目录品报价单',
  '2': 'Sourcing报价单',
};

export const NumCustomerProcessStatus = {
  0: '非内部审批中',
  1: '内部审批中',
  2: '待审批',
};
