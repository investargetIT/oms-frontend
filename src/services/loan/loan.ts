import request from '../request';

// 获取sap系统发票数据
export async function getInvoice(systemInvoiceNo: any) {
  return request<any>(`/omsapi/loan/sap/invoice/${systemInvoiceNo}`, {
    method: 'GET',
  });
}
// 借贷申请-分页
export async function getLoanList(body: any) {
  return request<any>(`/omsapi/loan/page`, {
    method: 'POST',
    data: body,
  });
}
// 借贷申请-详情
export async function queryLoanDetails(loanApplyNo: any) {
  return request<any>(`/omsapi/loan/details/${loanApplyNo}`, {
    method: 'GET',
  });
}
//借贷申请-保存
export async function saveLoan(params: any) {
  return request<any>('/omsapi/loan/save', {
    method: 'POST',
    data: params,
  });
}
//借贷申请-提交审批
export async function submitLoan(params: any) {
  return request<any>('/omsapi/loan/submit', {
    method: 'POST',
    data: params,
  });
}
//借贷申请-取消
export async function cancelLoan(sid: any) {
  return request<any>(`/omsapi/loan/cancel/${sid}`, {
    method: 'GET',
  });
}
//借贷申请-拆票预览
export async function invoicePreviewLoan(loanApplyNo: any) {
  return request<any>(`/omsapi/loan/split/invoicePreview/${loanApplyNo}`, {
    method: 'GET',
  });
}
//借贷申请-拆分发票-详情
export async function invoiceDetailLoan(loanApplyNo: any) {
  return request<any>(`/omsapi/loan/split/invoiceDetail/${loanApplyNo}`, {
    method: 'GET',
  });
}
//借贷申请拆分发票-保存
export async function splitInvoiceLoan(params: any) {
  return request<any>('/omsapi/loan/save/splitInvoice', {
    method: 'POST',
    data: params,
  });
}
//借贷申请-删除拆票信息(借贷申请没有保存，删除拆票信息)
export async function deleteInvoiceLoan(loanApplyNo: any) {
  return request<any>(`/omsapi/loan/deleteInvoice/${loanApplyNo}`, {
    method: 'GET',
  });
}
// 借贷订单-分页
export async function getLoanOrderList(body: any) {
  return request<any>(`/omsapi/loanOrder/page`, {
    method: 'POST',
    data: body,
  });
}
// 借贷申请-详情
export async function queryLoanOrderDetails(loanOrderNo: any) {
  return request<any>(`/omsapi/loanOrder/details/${loanOrderNo}`, {
    method: 'GET',
  });
}
