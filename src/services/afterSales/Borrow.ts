import request from '../request';
// 财务放单审核-放单批量放单
export async function pages(body: any) {
  return request<any>(`/omsapi/sample/page`, {
    method: 'POST',
    data: body,
  });
}
// ?新增接口的选择客户的分页
export async function queryCustomerPage(body: any) {
  return request<any>(`/omsapi/crm/queryCustomerPage`, {
    method: 'POST',
    data: body,
  });
}
// ?根据员工号查询成本中心
export async function costCenter(body: any) {
  return request<any>(`/omsapi/crm/getCostCenter`, {
    method: 'POST',
    data: body,
  });
}
// ?根据联系人号、r3联系人号、联系人名称、客户号查询联系人信息
export async function queryContact(body: any) {
  return request<any>(`/omsapi/crm/queryContact`, {
    method: 'POST',
    data: body,
  });
}
// ?根据客户号查询收货地址
export async function queryRecAddress(body: any) {
  return request<any>(`/omsapi/crm/queryRecAddress`, {
    method: 'POST',
    data: body,
  });
}
// ?查询渠道信息
export async function queryChannel(body: any) {
  return request<any>(`/omsapi/channel/queryChannel`, {
    method: 'POST',
    data: body,
  });
}
// ?借样申请-添加sku
export async function addSku(body: any) {
  return request<any>(`/omsapi/sample/addSku`, {
    method: 'POST',
    data: body,
  });
}
// ?借样申请-提交
export async function save(body: any) {
  return request<any>(`/omsapi/sample/save`, {
    method: 'POST',
    data: body,
  });
}
//? 借样申请-详情
export async function detail(body: any) {
  return request<any>(`/omsapi/sample/detail/${body}`, {
    method: 'GET',
  });
}
// ?借样订单-分页
export async function orderpage(body: any) {
  return request<any>(`/omsapi/sample/order/page`, {
    method: 'POST',
    data: body,
  });
}
// ?oa相关流程查询
export async function processes(body: any) {
  return request<any>(`/omsapi/oa/related/processes/${body}`, {
    method: 'GET',
  });
}
//? 借样订单-详情
export async function orderdetail(body: any) {
  return request<any>(`/omsapi/sample/order/detail/${body}`, {
    method: 'GET',
  });
}
// ?oa回调更新借样申请状态
export async function updateStatus2(body: any) {
  return request<any>(`/omsapi/sample/updateStatus`, {
    method: 'POST',
    data: body,
  });
}
// ?obd信息分页
export async function sapObd(body: any) {
  return request<any>(`/omsapi/afterSales/sapObd/page`, {
    method: 'POST',
    data: body,
  });
}
// ?obd信息分页
export async function queryMyCustomer(body: any) {
  return request<any>(`/omsapi/crm/queryCustomerPage`, {
    method: 'POST',
    data: body,
  });
}
