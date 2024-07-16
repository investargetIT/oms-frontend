import request from '../request';
// 财务放单审核-拒绝
export async function financeRefuseOrder(orderNo: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/finance/refuse/${orderNo}`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 财务放单审核-保存备注
export async function financeSaveReleaseRemark(params: any) {
  return request<any>('/omsapi/finance/saveRemark', {
    method: 'POST',
    data: params,
  });
}
// 财务放单审核-放单批量放单
export async function financeReleaseOrders(params: any) {
  return request<any>('/omsapi/finance/releaseOrder', {
    method: 'POST',
    data: params,
  });
}
