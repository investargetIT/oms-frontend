import request from '../request';
// 销售订单主界面查询
export async function getAllOrderList(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/order/queryOrderTotal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: body,
    ...(options || {}),
  });
}
// 销售订单主界面查询
export async function getOrderList(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/order/queryOrder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: body,
    ...(options || {}),
  });
}
// 销售订单主界面查询 上面的接口 下面的接口三合一
export async function queryOrderInfoPageList(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/orderUpdate/queryOrderInfoPageList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: body,
    ...(options || {}),
  });
}

// 销售订单-基本信息、收货、配送及支付信息、开票、发票寄送查询
export async function getOrderDetail(orderId: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/order/querySnapshot/${orderId}`, {
    method: 'GET',
    ...(options || {}),
  });
}
// 销售订单-基本信息、详情---
export async function querySnapshotDetail(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/orderUpdate/querySnapshot`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

//csr主数据审核信息保存
export async function saveCsrMasterData(params: any) {
  return request<any>('/omsapi/csr/editMasterData', {
    method: 'POST',
    data: params,
  });
}

//csr主数据审核通过
export async function approveCsrMasterData(params: any) {
  return request<any>('/omsapi/csr/approveMasterData', {
    method: 'POST',
    data: params,
  });
}

//列表下拉查询 type:ship(交货方式),paymentTerm(支付条件和支付方式),invoice(发票类型),region（区域）,special(特殊需求), orderType(订单类型),orderStatus（订单状态），orderChannel(订单渠道),orderCompany(订单所属公司)
export async function getOrderDateList(params: any) {
  return request<any>('/omsapi/lists/queryListData', {
    method: 'POST',
    data: params,
  });
}

//特殊需求申请
export async function createSpecialRequest(params: any) {
  return request<any>('/omsapi/csr/createSpecialRequest', {
    method: 'POST',
    data: params,
  });
}

//csr订单订单取消
export async function cancelOrder(params: any) {
  return request<any>('/omsapi/csr/cancelOrder', {
    method: 'POST',
    data: params,
  });
}

// csr订单保存
export async function saveCsrOrder(params: any) {
  return request<any>('/omsapi/csr/saveCsrOrder', {
    method: 'POST',
    data: params,
  });
}

// csr订单审核通过
export async function approveCsrOrder(params: any) {
  return request<any>('/omsapi/csr/approveOrder', {
    method: 'POST',
    data: params,
  });
}
// 查询客户信息
export async function getCustomer(params: any) {
  return request<any>('/omsapi/crm/queryCustomer', {
    method: 'POST',
    data: params,
  });
}

// 附件保存
export async function saveRefResource(params: any) {
  return request<any>('/omsapi/refResource/saveRefResource', {
    method: 'POST',
    data: params,
  });
}
// 查询渠道配置信息
export async function getChannelConfigList(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/channelConfig/queryChannelConfig', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: body,
    ...(options || {}),
  });
}

// 修改渠道配置信息
export async function updateChannelConfig(params: any) {
  return request<any>('/omsapi/channelConfig/updateChannelConfig', {
    method: 'POST',
    data: params,
  });
}

// 新增渠道配置信息
export async function createChannelConfig(params: any) {
  return request<any>('/omsapi/channelConfig/saveChannelConfig', {
    method: 'POST',
    data: params,
  });
}

// 查询渠道信息 是否启用 true:只查询启用状态 false：只查询未启用状态 不传：查询全部
export async function getAllChannelList(params: any) {
  return request<any>('/omsapi/channel/queryChannel', {
    method: 'POST',
    data: params,
  });
}

// 附件列表查询
export async function getFilesList(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/refResource/queryRefResource', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: body,
    ...(options || {}),
  });
}

// 查询客户配置信息
export async function getCustomerConfigList(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/customerConfig/queryConfig', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: body,
    ...(options || {}),
  });
}

// 修改渠道配置信息
export async function updateCustomerConfig(params: any) {
  return request<any>('/omsapi/customerConfig/updateConfig', {
    method: 'POST',
    data: params,
  });
}

// 查询客户信息分页
export async function getAllCustomerList(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/crm/queryCustomerPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: body,
    ...(options || {}),
  });
}

// 查询客户信息 不分页的新街口适用于csr添加客户信息查询，有残
export async function queryBatchCustomerList(params: any) {
  return request<any>('/omsapi/crm/queryBatchCustomerList', {
    method: 'POST',
    data: params,
  });
}

// 新增客户审核配置信息
export async function createCustomerConfig(params: any) {
  return request<any>('/omsapi/customerConfig/saveConfig', {
    method: 'POST',
    data: params,
  });
}

//校验是否保税区
export async function getToBondStatus(customerCode: any) {
  return request<any>(`/omsapi/order/checkBond/${customerCode}`, {
    method: 'GET',
  });
}

// 获取一个月内订单重复id
export async function isThirtyRepeat(params: any) {
  return request<any>('/omsapi/csr/queryRepeatOrder', {
    method: 'POST',
    data: params,
  });
}

// 销售订单-a换b信息查询
export async function getAChangeToBList(body: any) {
  return request<any>('/omsapi/order/queryReplaceDetail', {
    method: 'POST',
    data: body,
  });
}

// 库存查询
export async function getStock(body: any) {
  return request<any>('/omsapi/csr/queryInventoryAmount', {
    method: 'POST',
    data: body,
  });
}

// 销售订单-csr主数据审核基本信息、收货、配送及支付信息、开票、发票寄送查询含高亮
export async function getCsrOrderDetail(body?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/order/querySnapshotCsr', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: body,
    ...(options || {}),
  });
}
// 渠道批量处理
export async function setChannelConfig(body: any) {
  return request<any>('/omsapi/channelConfig/batchProcess', {
    method: 'POST',
    data: body,
  });
}
// 客户批量处理
export async function setCustomerConfig(body: any) {
  return request<any>('/omsapi/customerConfig/batchProcess', {
    method: 'POST',
    data: body,
  });
}

//?查询Mi备货信息
export async function queryMiDetail(params: any) {
  return request<any>(`/omsapi/order/queryMiDetail`, {
    method: 'GET',
    // data: params,
    params,
  });
}
// csr审核订单-修改计价方式
export async function updatePricingMethod(body: any) {
  return request<any>('/omsapi/csr/updatePricingMethod', {
    method: 'POST',
    data: body,
  });
}
