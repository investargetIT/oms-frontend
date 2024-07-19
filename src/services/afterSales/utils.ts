import request from '../request';

// 询报价部分选择客户分页列表
export async function querySearchCustomer(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/crm/customer/page`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 查询联系人信息列表
// 根据联系人号、r3联系人号、联系人名称、客户号查询联系人信息  好多后端都写了这个接口，名字不同
export async function queryContact(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/crm/queryContact`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 获取主销售 id和name 此接口后端依据参数有公用逻辑
export async function querySales(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/crm/customer`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 所有渠道
export async function queryChannel(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/channel/queryChannel`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 根据key获取指定枚举内容
export async function getByKeys(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/common/enum/getByKeys', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
