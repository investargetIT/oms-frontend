import { message } from 'antd';
import request from '../request';

// 获取列表字段配置信息
export async function getFieldConfiguration(body?: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/inqLn/getFieldConfiguration`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 保存列表字段配置信息
export async function saveFieldConfiguration(body?: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/inqLn/saveFieldConfiguration`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

// 根据客户号查支付信息
export async function queryPayInfo(body?: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/crm/queryPayInfo/${body.customerCode}`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 根据客户号查收货地址 customerCode
export async function querySaler(body?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/crm/customer', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 根据客户号查收货地址 customerCode
export async function queryRecAddress(body?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/crm/queryRecAddress', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
//根据客户包编号查询客户开票信息
export async function queryBillingInfo(body?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/crm/queryBillingInfo', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
//根据客户号查发票寄送信息
export async function queryInvoiceAddress(body?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/crm/queryInvoiceAddress', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

// 需求单查看日志、需求单清单明细查看日志等公共接口 /omsapi/log/list  //接口参数后端未定还需要修改
export async function getLogList(body?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/log/list', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
///omsapi/order/checkBond/{customerCode} 是否保税区
export async function checkBond(body?: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/order/checkBond/${body.customerCode}`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 所属公司列表
export async function getCompanyList() {
  return request<any>('/omsapi/crm/queryBranchOfficeList', {
    method: 'GET',
  });
}

// 公司列表 后段已统一改为getlist下拉接口 又改为上面的了，，，
// export async function getCompanyList(body?: any, options?: Record<string, any>) {
//   return request<any>('/omsapi/inquiry/branchCompanyName', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     data: body,
//     ...(options || {}),
//   });
// }
// 列表查询接口
export async function getSelectList(body?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/lists/queryListData', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 订单相关价格计算
export async function calculationAmount(body?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/order/calculationAmount', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 自定义使用
export const toast = (content: string = '', codeStatus: any) => {
  if (codeStatus === 200) {
    message.success({ content: `${content}` });
  } else {
    message.warn({ content: `${content}` });
  }
};
