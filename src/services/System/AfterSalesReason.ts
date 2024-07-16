import request from '../request';
// 企业站售后类型映射功能
export async function entEdit(params: any) {
  return request<any>('/omsapi/afterSales/config/entEdit', {
    method: 'POST',
    data: params,
  });
}
export async function getAfterSalesReason() {
  return request<any>('/omsapi/afterSales/config/getAfterSalesReason', {
    method: 'Get',
  });
}

// 售后类型列表 enabled：1 启用（查询全部，该字段传null）
export async function getAllAfterSalesReasonList(params: any) {
  return request<any>('/omsapi/afterSales/config/list', {
    method: 'POST',
    data: params,
  });
}

// 更新售后类型状态 状态：是否启用 1 启用，0 禁用
export async function updateAfterSalesReason(params: any) {
  return request<any>('/omsapi/afterSales/config/enabled/update', {
    method: 'POST',
    data: params,
  });
}

// 售后类型保存
export async function saveAfterSalesReason(params: any) {
  return request<any>('/omsapi/afterSales/config/save', {
    method: 'POST',
    data: params,
  });
}
