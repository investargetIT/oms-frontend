import request from '../request';
// 全部需求单分页列表
export async function allInquiry(body: any, options?: Record<string, any>) {
  return request<any>('/omsapi/inquiry/page', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
// 全部需求单导出
export async function exportInquiry(body: any) {
  return request<any>('/omsapi/inquiry/export', {
    method: 'POST',
    data: body,
    ...({ responseType: 'blob', getResponse: true } || {}),
  });
}
// 全部需求单导出
export async function inqExportLn(body: any) {
  return request<any>('/omsapi/inqLnExcel/inqExportLn', {
    method: 'POST',
    data: body,
    ...({ responseType: 'blob', getResponse: true } || {}),
  });
}

// 取消需求单
export async function cancelInquiry(ids: any) {
  return request<any>(`/omsapi/inquiry/cancel/${ids}`, {
    method: 'POST',
  });
}
//需求单状态下拉框
export async function statusInquiry() {
  return request<any>('/omsapi/inquiry/status', {
    method: 'GET',
  });
}
//选择客户分页列表
export async function crmCustomer(params: any) {
  return request<any>('/omsapi/crm/customer/page', {
    method: 'POST',
    data: params,
  });
}
//沟通内容创建
export async function createContent(params: any) {
  return request<any>('/omsapi/chatlog/create', {
    method: 'POST',
    data: params,
  });
}
//沟通内容查询
export async function searchContent(params: any) {
  return request<any>('/omsapi/chatlog/search', {
    method: 'POST',
    data: params,
  });
}
//分页条件查询需求单行明细列表
export async function getInfoList(params: any) {
  const url = params.pathOp  === 'ae' ? '/omsapi/inqLn/searchByAe' : `/omsapi/inqLn/search/${params.pathOp}`
  return request<any>(url, {
    method: 'POST',
    data: params,
  });
}
//需求单-提交需求单
export async function submitInquiry(params: any) {
  return request<any>('/omsapi/inquiry/add', {
    method: 'POST',
    data: params,
  });
}
//需求单-保存需求单
export async function draftInquiry(params: any) {
  return request<any>('/omsapi/inquiry/draft', {
    method: 'POST',
    data: params,
  });
}
//需求单编辑-提交需求单
export async function editSubmitInquiry(params: any) {
  return request<any>('/omsapi/inquiry/edit', {
    method: 'POST',
    data: params,
  });
}
//需求单编辑-保存需求单
export async function editDraftInquiry(params: any) {
  return request<any>('/omsapi/inquiry/edit/draft', {
    method: 'POST',
    data: params,
  });
}
//配型-查询需求单详情页面行信息
export async function inqLnList(params: any) {
  return request<any>(`/omsapi/inqLn/list/${params.pathOp}`, {
    method: 'POST',
    data: params,
  });
}
//根据行明细sid(inqlnid)查询行明细
export async function inqLnInfo(inqLnId: any) {
  return request<any>(`/omsapi/inqLn/get/${inqLnId}`, {
    method: 'GET',
  });
}
//获取需求单基本信息
export async function inqLnDetail(inquiryId: any) {
  return request<any>(`/omsapi/inquiry/detail/${inquiryId}`, {
    method: 'GET',
  });
}
//编辑需求单页面初始化信息
export async function editDetail(inquiryId: any) {
  return request<any>(`/omsapi/inquiry/editDetail/${inquiryId}`, {
    method: 'GET',
  });
}
//校验查询sku相关信息
export async function validSku(
  sku: string,
  reqQty: number,
  customerCode: string,
  custPurpose: string,
) {
  return request<any>(`/omsapi/inqLn/match/validSku/${sku}`, {
    method: 'POST',
    data: {
      sku,
      reqQty,
      customerCode,
      custPurpose,
    },
  });
}
//选配型提交
export async function inqMatch(pathOp: string, data: any) {
  return request<any>(`/omsapi/inqLn/match/${pathOp}/update`, {
    method: 'POST',
    data: data,
  });
}
//选配型提交
export async function inqBack(pathOp: string, backOp: string, data: any) {
  return request<any>(`/omsapi/inqLn/back/${pathOp}/${backOp}`, {
    method: 'POST',
    data: data,
  });
}
//选配完成接口
export async function completeLetcy(pathOp: string, data: any) {
  return request<any>(`/omsapi/inqLn/match/${pathOp}/complete`, {
    method: 'POST',
    data,
  });
}
//清单明细编辑操作展示信息
export async function editInqLine(inqLineId: string) {
  return request<any>(`/omsapi/inquiry/edit/detail/${inqLineId}`, {
    method: 'GET',
  });
}
//转te处理
export async function aeTote(data: any) {
  return request<any>('/omsapi/inqLn/match/toTe', {
    method: 'POST',
    data,
  });
}
//转sourcing
export async function toSourcing(data: any, pathOp: string) {
  return request<any>(`/omsapi/inqLn/match/${pathOp}/toSourcing`, {
    method: 'POST',
    data,
  });
}
//转sourcing且产品线
export async function changeSegment2Src(data: any, pathOp: string) {
  return request<any>(`/omsapi/inqLn/match/${pathOp}/changeSegment2Src`, {
    method: 'POST',
    data,
  });
}
//转产品线
export async function changeSegment(data: any, pathOp: string) {
  return request<any>(`/omsapi/inqLn/match/changeSegment/${pathOp}`, {
    method: 'POST',
    data,
  });
}
// 客户物料号列表
export async function customerMatchSku(data: any) {
  return request<any>(`/omsapi/inquiry/customerMatchSku`, {
    method: 'POST',
    data,
  });
}
// 根据sku获取产品线segment
export async function lineAndSegment(sku: string) {
  return request<any>(`/omsapi/pms/lineAndSegment/${sku}`, {
    method: 'GET',
    
  });
}
// 根据sku获取产品线segment
export async function getCustomerltemCodeBySku(body:any) {
  return request<any>(`/omsapi/pms/getCustomerItemCodeBySku`, {
    method: 'GET',
    params: body
  });
}
//pcm审核通过
export async function pcmApprove(pathOp: string, data: any) {
  return request<any>(`/omsapi/inqLn/match/${pathOp}/approve`, {
    method: 'POST',
    data,
  });
}
//sourcing pcm审核通过
export async function sourcingPcmApprove(data: any) {
  return request<any>('/omsapi/inqLnSourcing/pcmApprove', {
    method: 'POST',
    data,
  });
}
//sourcing pcd审核通过
export async function pcdApprove(data: any) {
  return request<any>('/omsapi/inqLnSourcing/pcdApprove', {
    method: 'POST',
    data,
  });
}
// 单个sourcing
export async function inqLnSourcingUpdate(pathOp: string, data: any) {
  return request<any>(`/omsapi/inqLnSourcing/update/${pathOp}`, {
    method: 'POST',
    data,
  });
}
// 整单退回
export async function backByInq(inquiryId: string, data: any) {
  return request<any>(`/omsapi/inqLn/backByInq/${inquiryId}`, {
    method: 'POST',
    data,
  });
}
// ae或te整单提交审核
export async function submitCheck(pathOp: string, data: any) {
  return request<any>(`/omsapi/inqLn/match/${pathOp}/submitCheck`, {
    method: 'POST',
    data,
  });
}
//ae整单需要澄清不需要澄清
export async function clarify(data: any) {
  return request<any>('/omsapi/inqLn/match/ae/clarify', {
    method: 'POST',
    data,
  });
}
//ae整单开始选配
export async function startMatch(inquiryId: any) {
  return request<any>(`/omsapi/inqLn/match/ae/startMatch/${inquiryId}`, {
    method: 'POST',
  });
}
//查询部门树
export async function deptList() {
  return request<any>('/omsapi/bizConfig/list/dept', {
    method: 'POST',
  });
}
//删除部门
export async function deleteDept(deptId: any) {
  return request<any>(`/omsapi/bizConfig/delete/dept/${deptId}`, {
    method: 'POST',
  });
}
//增加部门
export async function createDept(data: any) {
  return request<any>('/omsapi/bizConfig/create/dept', {
    method: 'POST',
    data,
  });
}
//查询部门下成员
export async function memberDept(bizDeptId: any) {
  return request<any>(`/omsapi/bizConfig/list/member/${bizDeptId}`, {
    method: 'POST',
  });
}
// 获取可选角色
export async function roleDeptName(rootDeptName: any) {
  return request<any>(`/omsapi/bizConfig/list/role/${rootDeptName}`, {
    method: 'POST',
  });
}
// 增加部门人员
export async function createMember(data: any) {
  return request<any>('/omsapi/bizConfig/create/member', {
    method: 'POST',
    data,
  });
}
//删除部门人员
export async function delMember(memberId: any) {
  return request<any>(`/omsapi/bizConfig/delete/member/${memberId}`, {
    method: 'POST',
  });
}
//编辑部门人员
export async function updateMember(data: any) {
  return request<any>('/omsapi/bizConfig/update/member', {
    method: 'POST',
    data,
  });
}
//全部需求单-转报价单-选择询价任务明细
export async function getToQuoteList(data: any) {
  return request<any>('/omsapi/inquiry/toQuote/getList', {
    method: 'POST',
    data,
  });
}
//重新填写fa成交价后,联动出面价,gp等其他价格信息
export async function getLinePrice(data: any) {
  return request<any>('/omsapi/inqLnSourcing/getLinePrice/fa', {
    method: 'POST',
    data,
  });
}
//完成报价
export async function complete(pathOp: any, data: any) {
  return request<any>(`/omsapi/inqLnSourcing/complete/${pathOp}`, {
    method: 'POST',
    data,
  });
}
//根据当前登录人,点击展示【选择te】浮层，选择在业务配置中已配置的te人员
export async function getTe() {
  return request<any>('/omsapi/inqLn/match/getTe', {
    method: 'GET',
  });
}
//待创建目录品-清单明细-更新sku
export async function updateSku(data: any) {
  return request<any>('/omsapi/toAssortment/updateSku', {
    method: 'POST',
    data,
  });
}
//退回至销售的行清单明细编辑提交操作
export async function itemEdit(data: any) {
  return request<any>('/omsapi/inquiry/itemEdit', {
    method: 'POST',
    data,
  });
}
// 需求单详情-取消选配型操作
export async function cancelOption(data: any) {
  return request<any>('/omsapi/inquiry/cancelOption', {
    method: 'POST',
    data,
  });
}
// 根据客户代号查询对应产线需要联动的层级 临时物料，转产线，选配型和sourcing报价等地方，有产线联动需要动态判断
export async function getCustomerCascadeLevel(data: any) {
  return request<any>('/omsapi/pms/getCustomerCascadeLevel', {
    method: 'POST',
    data,
  });
}
//待创建目录品导出 待创建目录品列表和待创建目录品建品处理页面详情列表公用。其中建品处理页面需要传当前对应需求单号
export async function exportToAssortment(data: any) {
  return request<any>('/omsapi/toAssortment/export', {
    method: 'POST',
    data,
    ...({ responseType: 'blob', getResponse: true } || {}),
  });
}
// 根据部门类型,查询所有三级部门信息列表
export async function queryDeptListByType(data: any) {
  return request<any>('/omsapi/bizConfig/queryDeptListByType', {
    method: 'POST',
    data,
  });
}
export async function queryAllDeptListByType() {
  return request<any>('/omsapi/bizConfig/queryAllDeptListByType', {
    method: 'POST',
  });
}
// 特殊客户产线信息完善提交
export async function cascadeSave(data: any) {
  return request<any>('/omsapi/toAssortment/cascadeSave', {
    method: 'POST',
    data,
  });
}
// 需求行明细导出
export async function exportInqLnExcel(path: string, data: any) {
  return request<any>(`/omsapi/inqLnExcel/export/${path}`, {
    method: 'POST',
    data,
    ...({ responseType: 'blob' } || {}),
    getResponse: true,
  });
}
// sourcing提交andcomplete
export async function updateAndComplete(path: string, data: any) {
  return request<any>(`/omsapi/inqLnSourcing/updateAndComplete/${path}`, {
    method: 'POST',
    data,
  });
}
// 查询客户是否免运费信息
export async function getFreeShipping(customerCode: any) {
  return request<any>(`/omsapi/crm/customer/getFreeShipping/${customerCode}`, {
    method: 'POST',
  });
}
// sourcing更新图片商品描述
export async function updateSkuImg(data: any) {
  return request<any>('/omsapi/inqLnSourcing/update/skuImg', {
    method: 'POST',
    data,
  });
}
// 删除需求单清单明细
export async function deleteItemDetail(data: any) {
  return request<any>('/omsapi/inquiry/deleteItemDetail', {
    method: 'POST',
    data,
  });
}
// 清空需求单清单明细
export async function clearItemDetail(data: any) {
  return request<any>(`/omsapi/inquiry/clearItemDetail`, {
    method: 'POST',
    data,
  });
}
// 编辑需求单清单明细
export async function editItemDetail(data: any) {
  return request<any>('/omsapi/inquiry/editItemDetail', {
    method: 'POST',
    data,
  });
}
// 新增需求单清单明细
export async function addItemDetail(data: any) {
  return request<any>(`/omsapi/inquiry/addItemDetail`, {
    method: 'POST',
    data,
  });
}
// 需求单详情-提交sourcing
export async function submitSourcing(data: any) {
  return request<any>(`/omsapi/inquiry/submitSourcing`, {
    method: 'POST',
    data,
  });
}
// 选配型-提交审核
export async function updateAndSubmitCheck(data: any, pathOp: string) {
  return request<any>(`/omsapi/inqLn/match/${pathOp}/updateAndSubmitCheck`, {
    method: 'POST',
    data,
  });
}
// 查询某需求单中需要更新报价的需求行
export async function searchToUpdatePrice(data: any) {
  return request<any>(`/omsapi/inqLn/searchToUpdatePrice`, {
    method: 'POST',
    data,
  });
}
// 更新报价
export async function updatePrice(inquiryId: any, data: any) {
  return request<any>(`/omsapi/inqLn/updatePrice/${inquiryId}`, {
    method: 'POST',
    data,
  });
}
// 编辑选配备注选型备注
export async function editMatchRemark(pathOp: any, data: any) {
  return request<any>(`/omsapi/inqLn/match/editMatchRemark/${pathOp}`, {
    method: 'POST',
    data,
  });
}

// 需求修改新增
// fa已转目录品列表
export async function searchFaTransAstSku(pathOp: any, data: any) {
  return request<any>(`/omsapi/inqLn/searchFaTransAstSku/${pathOp}`, {
    method: 'POST',
    data,
  });
}
//ae或te整单(1.6.0改为可跨单)提交审核
export async function searchFaTransAstAT(pathOp: any, data: any) {
  return request<any>(`/omsapi/inqLn/match/${pathOp}/submitCheck`, {
    method: 'POST',
    data,
  });
}
//行明细状态逆向退回操作(支持跨单)(aepcmtepcm支持,其余暂不支持"不勾选默认整单")
export async function backConfirm(pathOp: any, data: any) {
  return request<any>(`/omsapi/inqLn/backList/${pathOp}`, {
    method: 'POST',
    data,
  });
}
//需求单copy
export async function copyInquiryInfo(pathOp: any) {
  return request<any>(`/omsapi/inquiry/copyInquiryInfo/${pathOp}`, {
    method: 'POST',
  });
}
