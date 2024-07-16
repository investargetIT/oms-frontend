import request from '../request';
import Cookies from 'js-cookie';

// 全部报价单导出
export async function exportOfferData(body: any) {
  return request<any>('/omsapi/quotation/export', {
    method: 'POST',
    data: body,
    ...({ responseType: 'blob', getResponse: true } || {}),
  });
}

// 获取最新的金额信息
export async function calculationUpdate(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/order/calculationUpdate`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 根据传入的数据算出尾差选填写范围
export async function queryAmountRang(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/order/queryAmountRang`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 查询管理报价单
export async function queryQuotationRelate(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/quotation/queryQuotationRelate`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

// 导出数据助力审批
export async function exportHelpData(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/quotation/export/${body?.sid}`, {
    method: 'POST',
    data: body,
    ...(options || {}),
    ...({ responseType: 'blob', getResponse: true } || {}),
  });
}

// csp 申请重新计算 xioah
export async function calcCsp(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/csp/application/calculate`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

// csp申请list xiaohu
export async function getItelmListCsp(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/csp/application/getItem/${body.quotCode}`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// csp申请 oa退回提交
export async function approvalDiscountCspWorkFlow(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/csp/application/approvalDiscountSubmitWorkflow`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// csp申请
export async function approvalDiscountCsp(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/csp/application/approvalDiscount`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// fa 上下架
export async function faUpOrDown(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/quotation/faUpOrDown`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
//  根据quotcode同步价格到价格中心
export async function priceSync(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/quotation/batchPriceSync`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
//  根据quotcode同步价格到价格中心
// export async function priceSync(body: any, options?: Record<string, any>) {
//   return request<any>(`/omsapi/quotation/priceSync/${body?.quotCode}`, {
//     method: 'GET',
//     data: body,
//     ...(options || {}),
//   });
// }
// 接口回调(临时性接口，上线前删除)
export async function mockCallBack(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/quotation/callback/${body.sid}/${body.type}/${body.result}`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 折扣审批   需求单的审片流程
export async function approvalDiscountWorkFlow(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/quotation/approvalDiscountSubmitWorkflow`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 折扣审批
export async function approvalDiscount(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/quotation/approvalDiscount`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 全部需求单-转报价单-报价清单明细列表
export async function getItemList(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/inquiry/toQuote/getItemList`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 全部需求单-转报价单-基本信息
export async function getBasicInformation(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/inquiry/toQuote/getBasicInformation/${body.sid}`, {
    method: 'GET',
    ...(options || {}),
  });
}
// 根据报价行id计算报价小计相关信息
export async function calSubTotal(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/quotation/calSubTotal`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 根据报价行id计算报价小计相关信息(新编辑用)
export async function calSubTotalEdit(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/quotation/calSubTotalEdit`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 根据报价行id计算报价小计相关信息
export async function calSubQuotationTotal(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/quotation/calSubQuotationTotal`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 有效期延长校验
export async function extendValidate(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/quotation/extendValidate/${body.sid}`, {
    method: 'GET',
    ...(options || {}),
  });
}
// 有效期延长提交接口
export async function delayDate(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/quotation/extendValidate', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
//  pdf download
export async function downloadPdf(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/quotation/getDownFileUrl/${body.sid}`, {
    method: 'GET',
    ...(options || {}),
  });
}
//  excel download
export async function downloadExcel(body: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/quotation/exportExcel/${body.sid}`, {
    method: 'GET',
    responseType: 'blob',
    ...(options || {}),
  });
}
// 二次询价
export async function secondInquiry(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/quotation/secondInquiry', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 报价单转订单 第一步
export async function transferOrder(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/order/queryCombineQuotLine', {
    // prefix: 'http://10.152.94.85:27901',
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 报价单转订单 第二步
export async function transferSecondOrder(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/order/queryQuotationAndLine', {
    // prefix: 'http://10.152.94.85:27901',
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 报价单转订单 保存
export async function createTransferOrder(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/order/saveOrder', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 报价单转订单 保存
export async function checkDuplicatePo(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/order/checkDuplicatePo', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

// 运费均摊
export async function freightAvg(body?: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/quotation/batchFreightShare`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

// 报价单编辑
export async function editOffer(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/quotation/editquotation', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 查询报价单类型
export async function searchOfferType(body?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/quotation/queryquotationtype', {
    method: 'GET',
    data: body,
    ...(options || {}),
  });
}
// 查询报价单
export async function searchOffer(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/quotation/queryquotationlist', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 取消报价单 校验
export async function cancleOfferCheck(body?: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/quotation/cancelquotation/check`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 取消报价单
export async function cancleOffer(body?: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/quotation/cancelquotation`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 报价单详情  /omsapi/quotation/queryquotation/code/{quotCode}  需求单的
export async function offerDetailNeed(quoteId: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/quotation/queryquotation/code/${quoteId}`, {
    method: 'POST',
    data: {
      pageNumber: options?.pageNumber || 1, // old pageNum
      pageSize: options?.pageSize || 15,
    },
    ...(options || {}),
  });
}
// 报价单详情
export async function offerDetail(quoteId: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/quotation/queryquotation/${quoteId}`, {
    method: 'POST',
    data: {
      querySource: options?.querySource,
      pageNumber: options?.pageNumber || 1, // old pageNum
      pageSize: options?.pageSize || 15,
    },
    ...(options || {}),
  });
}
// 报价单详情 运费调整的详情接口 详情借口好几个
export async function offerDetailTRans(quoteId: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/quotation/queryQuotationFerightById/${quoteId}`, {
    method: 'POST',
    data: {
      pageNumber: -1, // old pageNum
      pageSize: options?.pageSize || 15,
    },
    ...(options || {}),
  });
}

// 报价单生成
export async function createOfferOrderCsp(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/csp/application/createquotation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: body,
    ...(options || {}),
  });
}
// 报价单生成
export async function createOfferOrder(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/quotation/createquotation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: body,
    ...(options || {}),
  });
}
// 校验状态 运费
export async function checkFreight(body?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/quotation/checkfreightadjuststatus', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 申请运费调整
export async function applyFreight(body?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/quotation/freightadjust', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

// 校验状态合并报价单
export async function checkOfferOrder(body?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/quotation/checkcombinequotationstatus', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// ids 行信息数组
export async function lineArryByIds(body?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/quotation/getCombineQuotationLineList', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 合并报价单
export async function combineOfferOrder(body?: any, options?: Record<string, any>) {
  return request<any>('/omsapi/quotation/combinequotation', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// r3联系人
export async function getConList(params?: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/crm/contact/page`, {
    method: 'POST',
    data: {
      ...params,
      pageNumber: 1 || params.pageNumber,
      pageSize: 10 || params.pageSize,
    },
    ...(options || {}),
  });
}
export async function getConList1(params?: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/crm/contact/page`, {
    method: 'POST',
    data: {
      ...params,
    },
    ...(options || {}),
  });
}
//客户对应 商机名称获取
export async function getCustomerList(params?: any, options?: Record<string, any>) {
  return request<any>(`/omsapi/crm/business/page`, {
    method: 'POST',
    data: {
      ...params,
      pageNumber: params.pageNumber || 1,
      pageSize: params.pageSize || 10,
      // pageNumber: 1 || params.pageNumber,
      // pageSize: 10 || params.pageSize,
    },
    ...(options || {}),
  });
}

// 查看历史成交价（get请求）
export async function getRecentlyItem(body?: any, options?: Record<string, any>) {
  return request<any>(
    `/omsapi/order/getRecentlyItem?customerCode=${body.customerCode}&sku=${body.sku}`,
    {
      method: 'POST',
      data: body,
      ...(options || {}),
    },
  );
}

// 获取报价单对外分享链接
export async function quoteLink(params: any) {
  return request<any>('/enterprise-service/share/quoteLink', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: params,
  });
}
// 报价单操作权限接口
export async function operateAuth(params: any) {
  return request<any>('/omsapi/quotation/operate/auth', {
    method: 'POST',
    data: params,
  });
}

// 获取企业站token
export async function enterpriseSSO(params: any) {
  return request<any>('/member-center/user/ssoCustomerContactLogin', {
    method: 'POST',
    headers: {
      appCode: '150',
      channel: 'enterprise',
      primarySource: '2',
      scenarioCode: 'enterprise',
      secondarySource: '4',
      userSource: '7',
      Authorization: Cookies.get('ssoToken'),
    },
    data: params,
  });
}
