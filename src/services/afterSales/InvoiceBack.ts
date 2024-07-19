import request from '../request';
//  发票追回分页列表
export async function queryBackList(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/invoiceBack/queryPageList', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
//  发票追回分页列表
export async function queryBackDetail(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/invoiceBack/queryDetail', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 发票追回修改
export async function modifyBackDetail(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/invoiceBack/modify', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
