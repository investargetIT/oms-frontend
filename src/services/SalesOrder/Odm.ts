import request from '../request';
// 订单产品修改分页列表
export async function queryProduct(body: any) {
  return request<any>('/omsapi/productUpdate/queryProduct', {
    method: 'POST',
    data: body,
  });
}
// 标记客户系统收货分页列表
export async function getObdItemSignature(body: any) {
  return request<any>('/omsapi/sap/getObdItemSignature', {
    method: 'POST',
    data: body,
  });
}
// 标记客户系统收货确认提交
export async function saveOrUpdateObd(body: any) {
  return request<any>('/omsapi/sap/saveOrUpdateObdItemSignature', {
    method: 'POST',
    data: body,
  });
}
// 订单产品修改取消修改
export async function cancelProduct(body: any) {
  return request<any>(`/omsapi/productUpdate/cancelProduct/${body}`, {
    method: 'GET',
  });
}
// 查询订单产品修改行明细
export async function queryProductLine(body: any) {
  return request<any>(`/omsapi/productUpdate/queryProductLine/${body}`, {
    method: 'GET',
  });
}
// oa相关流程查询
export async function oaprocesses(body: any) {
  return request<any>(`/omsapi/oa/related/processes/${body}`, {
    method: 'GET',
  });
}
// 根据替换行id和替换物料，数量查询替换行信息
export async function getProductLineInfo(body: any) {
  return request<any>(`/omsapi/productUpdate/getProductLineInfo`, {
    method: 'POST',
    data: body,
  });
}
// 修改平行仓优先级
export async function updateWareHouseMapping(body: any) {
  return request<any>(`/omsapi/warehouse/updateWareHouseMapping`, {
    method: 'POST',
    data: body,
  });
}
// 保存订单产品修改申请
export async function createProductUpdate(body: any) {
  return request<any>(`/omsapi/productUpdate/createProductUpdate`, {
    method: 'POST',
    data: body,
  });
}
// 工作流审批结束回调接口
export async function approvedCall(body: any) {
  return request<any>(`/omsapi/productUpdate/approvedCallback`, {
    method: 'POST',
    data: body,
  });
}
