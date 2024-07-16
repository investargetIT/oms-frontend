import request from '../request';
// r3联系人 传 customerCode
export async function getR3ConList(params?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/crm/queryContact', {
    method: 'POST',
    data: {
      ...params,
      pageNumber: 10,
      pageSize: 1,
    },
    ...(options || {}),
  });
}

// 根据客户号查询收货地址 传 customerCode
export async function getReceiverAddressList(params?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/crm/queryRecAddress', {
    method: 'POST',
    data: {
      ...params,
      pageNumber: 10,
      pageSize: 1,
    },
    ...(options || {}),
  });
}

// 根据客户号查询客户开票信息 传 customerCode
export async function getInvoiceInfoList(params?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/crm/queryBillingInfo', {
    method: 'POST',
    data: {
      ...params,
      pageNumber: 10,
      pageSize: 1,
    },
    ...(options || {}),
  });
}

// 根据客户号查发票寄送信息 传 customerCode
export async function getInvoiceAddressList(params?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/crm/queryInvoiceAddress', {
    method: 'POST',
    data: {
      ...params,
      pageNumber: 10,
      pageSize: 1,
    },
    ...(options || {}),
  });
}

// 所属公司列表
export async function getCompanyList() {
  return request<any>('/omsapi/crm/queryBranchOfficeList', {
    method: 'GET',
  });
}
