import request from '../request';
// 查询系统监控/流程监控，显示所有流程提交记录
export async function getProcessMonitoring(params: any) {
  return request<any>('/omsapi/processes/queryPageList', {
    method: 'POST',
    data: params,
  });
}

//订单修改监控列表分页条件查询
export async function getOrderModificationMonitoring(params: any) {
  return request<any>('/omsapi/orderupdate/monitor/search', {
    method: 'POST',
    data: params,
  });
}

// 订单修改监控失败条目重试
export async function retry(sid: any) {
  return request<any>(`/omsapi/orderupdate/monitor/retry/${sid}`, {
    method: 'POST',
  });
}
