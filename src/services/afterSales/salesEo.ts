import request from '../request';
// ?eando销售申请明细导出
export async function eandoApplyExport(body: any) {
  return request<any>(`/omsapi/eandoApply/export/${body}`, {
    responseType: 'blob',
    method: 'POST',
    // data: body,
  });
}
// ?eando销售申请保存
export async function saveEandoApply(body: any) {
  return request<any>(`/omsapi/eandoApply/saveEandoApply`, {
    method: 'POST',
    data: body,
  });
}
// ?eando销售申请保存
export async function queryeandoApplyPageList(body: any) {
  return request<any>(`/omsapi/eandoApply/queryPageList`, {
    method: 'POST',
    data: body,
  });
}
// ?销售申请详情
export async function queryeandoApplyDetail(body: any) {
  return request<any>(`/omsapi/eandoApply/queryDetail`, {
    method: 'POST',
    data: body,
  });
}
// ?销售申请取消进度
export async function cancelorder(body: any) {
  return request<any>(`/omsapi/eandoApply/cancel`, {
    method: 'POST',
    data: body,
  });
}
// ?销售订单分页列表
export async function queryEandoOrderPageList(body: any) {
  return request<any>(`/omsapi/eandoOrder/queryPageList`, {
    method: 'POST',
    data: body,
  });
}
// ?销售订单分页列表
export async function queryEandoOrderDetail(body: any) {
  return request<any>(`/omsapi/eandoOrder/queryDetail`, {
    method: 'POST',
    data: body,
  });
}
// ?销售订枚举
export async function queryListDetail(body: any) {
  return request<any>(`/omsapi/lists/queryListData`, {
    method: 'POST',
    data: body,
  });
}
