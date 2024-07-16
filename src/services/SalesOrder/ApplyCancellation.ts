import request from '../request';
// 点击下一步初始草稿并锁单
export async function getNextStep(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/soCancel/initDraft/nextStep', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: body,
    ...(options || {}),
  });
}
// 取消'取消申请' 并释放已锁定的订单
export async function cancelAndReleaseOrder(sid: any) {
  return request<any>(`/omsapi/soCancel/cancel/${sid}`, {
    method: 'POST',
  });
}

// 详情
export async function getCancellationDetail(sid: any) {
  return request<any>(`/omsapi/soCancel/queryDetail/${sid}`, {
    method: 'POST',
  });
}

// 提交审核
export async function requestSubmit(params: any) {
  return request<any>('/omsapi/soCancel/requestSubmit', {
    method: 'POST',
    data: params,
  });
}

// 保存草稿
export async function onlySave(params: any) {
  return request<any>('/omsapi/soCancel/save', {
    method: 'POST',
    data: params,
  });
}

// 分页查询订单修改信息
export async function getApplyOrderDetail(body: any, options?: Record<string, any>) {
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

//移除附件
export async function removeFile(sid: any) {
  return request<any>(`/omsapi/refResource/remove/${sid}`, {
    method: 'POST',
  });
}

// 订单修改申请列表 获取 订单类型
export async function getCategory(orderNo: any) {
  return request<any>(`/omsapi/order/getCategory/${orderNo}`, {
    method: 'POST',
  });
}
