import request from '../request';
// 发货物流 查询列表分页
export async function getDeliveryList(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/sap/queryObdInfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: body,
    ...(options || {}),
  });
}

// 查询发货单详情列表分页
export async function getDeliverySkuList(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/sap/queryObdItem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: body,
    ...(options || {}),
  });
}

// 通过obd查询物流信息
export async function getDeliveryLogistics(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/tms/getLogistics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: body,
    ...(options || {}),
  });
}
export async function downloadToStream(url: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/refResource/downloadToStream?url=${url}`, {
    responseType: 'arrayBuffer',
    ...(options || {}),
  });
}

// 发货物流-物流信息-定制单证列表展示接口
export async function queryRefResource(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/refResource/queryRefResource', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: body,
    ...(options || {}),
  });
}
// 发货物流-物流信息-定制单证上传的接口
export async function saveRefResourceNew(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/sap/saveRefResource', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: body,
    ...(options || {}),
  });
}

// 查询客户信息分页
export async function getAdminCustomerList(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/crm/queryCustomerPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: body,
    ...(options || {}),
  });
}
