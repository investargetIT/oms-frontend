import request from '../request';
// mdm赋码清单列表
export async function queryInventoryList(params: any) {
  return request<any>('/omsapi/orderReplace/queryInventoryList', {
    method: 'POST',
    data: params,
  });
}
// mdm赋码负毛利清单导入
export async function importGrossprofit(params: any) {
  return request<any>('/omsapi/orderReplace/import/grossprofit', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
// 通过sku获取负毛利清单
export async function queryGrossProfitBySku(params: any) {
  return request<any>(`/omsapi/orderReplace/queryGrossProfitBySku/${params.sku}`, {
    method: 'POST',
    data: params,
  });
}
