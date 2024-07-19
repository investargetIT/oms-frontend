// 售后api

import request from '../request';
export * from './Borrow';
export * from './InvoiceBack';
export * from './salesEo';

//  报废申请下载失败数据
export async function downAfterSalesPdf(body: any, options?: Record<string, any>) {
  return request<any>(
    `/omsapi/afterSales/exportPDF/${body?.orderNo}/${body?.afterSalesNo}?totalPrice=${body?.totalPrice}&token=${body?.token}`,
    {
      method: 'GET',
      data: body,
      responseType: 'blob',
      ...(options || {}),
    },
  );
}
//  报废申请下载失败数据
export async function exportError(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/scrapApply/export`, {
    method: 'POST',
    data: body,
    responseType: 'blob',
    ...(options || {}),
  });
}

//  报废申请oa回调修改状态接口
export async function audit(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/scrapApply/audit`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
//  追加售后附件
export async function updateFile(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/afterSales/updateFile`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 报废申请明细导入
export async function importFile(body: any) {
  return request<{ data: Blob; response: Response }>('/omsapi/scrapApply/import/detail', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: body,
    ...({ responseType: 'blob', getResponse: true } || {}),
  });
}
// 售后报废订单详情
export async function queryDetail(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/scrapOrder/queryDetail`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 售后报废订单列表分页
export async function queryAfterOrderList(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/scrapOrder/queryPageList`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 售后报废新增申请
export async function saveScrapApply(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/scrapApply/saveScrapApply`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 售后报废申请分页列表
export async function queryApplyDetail(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/scrapApply/queryDetail`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 售后报废申请分页列表
export async function queryPageList(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/scrapApply/queryPageList`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

// 售后发货单详情列表 (发货明细) 以下为守护订单和详情的接口 TODO:
export async function queryProcesses(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/oa/related/processes/${body.billNo}`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 售后申请模拟回调
export async function updateStatus(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/afterSales/updateStatus`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 售后发货单详情列表 (发货明细)
export async function queryObdItem(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/sap/queryObdItem`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 售后订单详情查询
export async function queryAfterOrderDetail(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/afterSales/order/detail/${body.afterSalesOrderNo}`, {
    method: 'GET',
    ...(options || {}),
  });
}
// 售后订单查询
export async function queryAfterOrder(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/afterSales/order/page`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 售后类型
export async function queryAfterType(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/afterSales/config/list`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 售后处理编辑
export async function editAfter(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/afterSales/order/edit`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 售后申请详情
export async function queryAfterDetail(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/afterSales/detail`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// obd信息分页
export async function querySapObd(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/afterSales/sapObd/page`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// obd信息分页  设计到订单的要改掉其余的不动
export async function relevantObd(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/afterSales/relevantObd/page`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 售后申请取消
export async function cancelAfterSales(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/afterSales/cancel`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 售后申请提交（新增）
export async function submitAfterSales(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/afterSales/submitAfterSales', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 售后申请编辑 --- 仅仅保存
export async function editAfterSales(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/afterSales/editAfterSales', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 售后查询分页
export async function afterSalesInquiry(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/afterSales/page', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 物流明细
export async function getLogistics(body?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/tms/getLogistics', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 退回仓库
export async function queryListDataMap(body?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/lists/queryListDataMap', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

// 售后订单取消
export async function cancelAfterOrder(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/afterSales/order/cancel/${body?.sid}`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 售后订单维确认
export async function confirmRepair(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/afterSales/order/confirmRepair/${body?.sid}`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 售后订单下载维修报价单
export async function downAfterOrderPdf(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/afterSales/order/exportPDF/${body?.sid}?token=${body?.token}`, {
    method: 'POST',
    data: body,
    responseType: 'blob',
    ...(options || {}),
  });
}
// 判断是否为售后专员(errcode非200，不能操作，显示提示信息)
export async function authority(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/afterSales/authority/${body?.afterSalesNo}`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
