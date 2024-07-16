import request from '../request';
// 订单修改申请列表主界面查询
export async function getOMAList(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/orderUpdate/queryOrderUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: body,
    ...(options || {}),
  });
}
// 查询订单修改详情
export async function getRequesOrderDetail(requestNo: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/orderUpdate/getOrderUpdate/${requestNo}`, {
    method: 'GET',
    ...(options || {}),
  });
}
// oa相关流程查询
export async function getRelatedProcessesList(billNo: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/oa/related/processes/${billNo}`, {
    method: 'POST',
    ...(options || {}),
  });
}
// oa相关流程查询[订单详情]
export async function getRelatedProcessesListOrder(billNo: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/oa/so/related/processes/${billNo}`, {
    method: 'POST',
    ...(options || {}),
  });
}
//保存（保存并提交）订单修改申请
export async function saveOMAData(params: any) {
  return request<any>('/omsapi/orderUpdate/saveOrderUpdate', {
    method: 'POST',
    data: params,
  });
}
//请求商品明细预校验 老的去了换下面的了 （有些地方可能会使用 误删）
export async function preCheck(params: any) {
  return request<any>(`/omsapi/order/sapOrderSync/${params}`, {
    method: 'GET',
    data: params,
  });
}
//请求商品明细预校验 新的
export async function preCheckNew(params: any) {
  return request<any>(`/omsapi/orderUpdate/sapOrderSync`, {
    method: 'POST',
    data: params,
  });
}

// 查询接待单详情
export async function getReceptionDetail(receptionCode: any) {
  return request<any>(`/omsapi/crm/get/reception/${receptionCode}`, {
    method: 'POST',
  });
}
