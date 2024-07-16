import request from '../request';
// 全部需求单分页列表
export async function orderList(body: any) {
  return request<any>('/omsapi/order/queryOrder', {
    method: 'POST',
    data: body,
  });
}
// 同步sap失败订单运维页面分页列表
export async function getSalesOrders(body: any) {
  return request<any>('/omsapi/sap/getSalesOrders', {
    method: 'POST',
    data: body,
  });
}
// 批量修改重推状态
export async function modifySapOrderSyncOpState(body: any) {
  return request<any>('/omsapi/sap/modifySapOrderSyncOpState', {
    method: 'POST',
    data: body,
  });
}
// 修改订单状态信息详情页
export async function quickModifyStatusData(orderNo: any) {
  return request<any>(`/omsapi/orderUpdate/quickModifyStatusData/${orderNo}`, {
    method: 'POST',
    data: {},
  });
}
// 修改订单状态信息详情页
export async function quickModifyStatus(body: any) {
  return request<any>('/omsapi/orderUpdate/quickModifyStatus', {
    method: 'POST',
    data: body,
  });
}
// 订单分享
export async function shareLink(body: any) {
  return request<any>('/oms-front/orderShare/QRCode', {
    method: 'POST',
    data: body,
  });
}
// 提交付款凭证
export async function updatePayOrderInfo(body: any) {
  return request<any>('/omsapi/order/updatePayOrderInfo', {
    method: 'POST',
    data: body,
  });
}
// 基本信息、收货、配送及支付信息、开票、发票寄送查询
export async function orderDetail(body: any) {
  return request<any>(`/omsapi/order/querySnapshot/${body}`, {
    method: 'GET',
  });
}
// 获取商品明细
export async function goodsDetails(body: any) {
  return request<any>('/omsapi/order/queryOrderDetail', {
    method: 'POST',
    data: body,
  });
}
// 相关报价查询
export async function quotation(body: any) {
  return request<any>('/omsapi/order/queryQuotation', {
    method: 'POST',
    data: body,
  });
}
// 相关流程查询
export async function process(body: any) {
  return request<any>('/omsapi/oa/related/processes', {
    method: 'POST',
    data: body,
  });
}
// a换b信息查询
export async function detail(body: any) {
  return request<any>('/omsapi/order/queryReplaceDetail', {
    method: 'POST',
    data: body,
  });
}
// 关联订单查询
export async function relation(body: any) {
  return request<any>('/omsapi/order/queryRelation', {
    method: 'POST',
    data: body,
  });
}
// 根据订单编号查询替换信息
export async function queryReplaceByOrderNo(body: any) {
  return request<any>(`/omsapi/orderReplace/queryReplaceByOrderNo/${body}`, {
    method: 'GET',
    // data: body,
  });
}
// 导出PDF
export async function PDF(body: any) {
  return request<any>(`/omsapi/order/exportSalesOrder/${body}?model=PDF`, {
    method: 'GET',
    responseType: 'blob',
  });
}
// 导出xlsx
export async function xlsx(body: any) {
  return request<any>(`/omsapi/order/exportStation/${body}?model=xls`, {
    method: 'GET',
    responseType: 'blob',
  });
}
// 获取替换物料信息
export async function getReplaceItemInfo(body: any) {
  return request<any>(`/omsapi/orderReplace/getReplaceItemInfo`, {
    method: 'POST',
    data: body,
  });
}
// a换b保存和替换的接口
export async function saveReplace(body: any) {
  return request<any>(`/omsapi/orderReplace/saveReplace`, {
    method: 'POST',
    data: body,
  });
}
// 导出PDF
export async function notReplace(body: any) {
  return request<any>(`/omsapi/orderReplace/notReplace/${body}`, {
    method: 'GET',
  });
}
// 附件列表UI查询
export async function queryRefResource(body: any) {
  return request<any>(`/omsapi/refResource/queryRefResource`, {
    method: 'POST',
    data: body,
  });
}
// 相关发货查询发货单信息
export async function queryObdInfo(body: any) {
  return request<any>(`/omsapi/sap/queryObdInfo`, {
    method: 'POST',
    data: body,
  });
}
// 相关发货查询发货单信息明细
export async function queryObdItem(body: any) {
  return request<any>(`/omsapi/sap/queryObdItem`, {
    method: 'POST',
    data: body,
  });
}
// 工作流审批完成回调接口(全部订单)
export async function approvedCallback(body: any) {
  return request<any>(`/omsapi/orderReplace/approvedCallback`, {
    method: 'POST',
    data: body,
  });
}
// 订单取消
export async function adminCancelOrder(body: any) {
  return request<any>(`/omsapi/order/adminCancelOrder`, {
    method: 'POST',
    data: body,
  });
}
// 订单取消
export async function bookingOrder(body: any) {
  return request<any>(`/omsapi/order/bookingOrder`, {
    method: 'POST',
    data: body,
  });
}
// 订单取消
export async function queryCustomerDis(body: any) {
  return request<any>(`/omsapi/price/queryCustomerDis/${body}`, {
    method: 'GET',
  });
}
// 订单备注修改
export async function updateRemark(body: any) {
  return request<any>(`/omsapi/order/updateRemark`, {
    method: 'POST',
    data: body,
  });
}
// 订单备注修改
export async function updateCustomerPo(body: any) {
  return request<any>(`/omsapi/order/updateCustomerPo`, {
    method: 'POST',
    data: body,
  });
}
// A-B换-更新JV公司
export async function updateJv(body: any) {
  return request<any>(`/omsapi/order/updateJv`, {
    method: 'POST',
    data: body,
  });
}
// update 分接口 标记切换供应商 /omsapi/channelConfig/markLocalSupplier
export async function markLocalSupplier(body: any) {
  return request<any>(`/omsapi/channelConfig/markLocalSupplier`, {
    method: 'POST',
    data: body,
  });
}
// update 分接口 标记指定供应商 111111111111
export async function appointSupplier(body: any) {
  return request<any>(`/omsapi/appointSupplier/saveInfo`, {
    method: 'POST',
    data: body,
  });
}
// update 分接口 标记指定供应商2222222222222222
export async function appointSupplierConfig(body: any) {
  return request<any>(`/omsapi/channelConfig/markAppointSupplier`, {
    method: 'POST',
    data: body,
  });
}
// 订单列表-修改特定信息-初始化页面
export async function modifySpecInfoDetail(body: any) {
  return request<any>(`/omsapi/order/modifySpecInfoDetail/${body}`, {
    method: 'POST',
    // data: body,
  });
}
// 订单列表-修改特定信息-c
export async function modifySpecInfo(body: any, orderNo: any) {
  return request<any>(`/omsapi/order/modifySpecInfo/${orderNo}`, {
    method: 'POST',
    data: body,
  });
}

// 根据订单查询相关发票信息
export async function invoiceQuery(body: any) {
  return request<any>(`/omsapi/invoice/query`, {
    method: 'POST',
    data: body,
  });
}
// 通过物流单号查询发票物流信息
export async function getInvoiceLogistics(body: any) {
  return request<any>(`/omsapi/tms/invoiceLogistics/getLogistics`, {
    method: 'POST',
    data: body,
  });
}

// 订单详情可查看行项目的执行情况
export async function querySapOpenSoInfo(orderNo: any) {
  return request<any>(`/omsapi/order/querySapOpenSoInfo/${orderNo}`, {
    method: 'GET',
  });
}

// 销售处理标记渲染
export async function queryOderChannelConfig(orderNo: any) {
  return request<any>(`/omsapi/channelConfig/queryOderChannelConfig/${orderNo}`, {
    method: 'POST',
  });
}
// 销售处理 标记log打标机
export async function saveReplaceLog(body: any) {
  return request<any>(`/omsapi/orderReplace/saveReplaceLog`, {
    method: 'POST',
    data: body,
  });
}
// 销售处理 获取选择报备记录详情数据接口
export async function getReportLogDetail(body: any) {
  return request<any>(`/omsapi/orderReplace/queryReportInfo`, {
    method: 'POST',
    data: body,
  });
}
// 销售处理 获取选择报备记录详情数据接口
export async function getSupplierSearchByCode(body: any) {
  return request<any>(`/omsapi/pms/supplier/searchByCode`, {
    method: 'POST',
    data: body,
  });
}
