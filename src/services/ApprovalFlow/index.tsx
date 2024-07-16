import request from '../request';
// 待办事项oa版-我发起的(未完成&已完成)
export async function getMyWorkflowRequestList(params: any) {
  return request<any>('/omsapi/oa/getMyWorkflowRequestList', {
    method: 'POST',
    data: params,
  });
}
// 待办事项oa版-我的代办-已办任务
export async function getHandledWorkflowRequestList4Ofs(params: any) {
  return request<any>('/omsapi/oa/getHandledWorkflowRequestList4Ofs', {
    method: 'POST',
    data: params,
  });
}
// 待办事项oa版-我的代办-待办任务
export async function getToDoWorkflowRequestList(params: any) {
  return request<any>('/omsapi/oa/getToDoWorkflowRequestList', {
    method: 'POST',
    data: params,
  });
}
// 根据员工姓名模糊匹配员工信息
export async function queryBySaffName(params: any) {
  return request<any>('/omsapi/crm/queryBySaffName', {
    method: 'POST',
    data: params,
  });
}
// 我的代办取消
export async function cancelOa(params: any) {
  return request<any>('/omsapi/oa/cancel', {
    method: 'POST',
    data: params,
  });
}
// 流程回收站主查询
export async function queryProcessRecyclePageList(params: any) {
  return request<any>('/omsapi/processes/queryProcessRecyclePageList', {
    method: 'POST',
    data: params,
  });
}
