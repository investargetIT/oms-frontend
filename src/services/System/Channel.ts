import request from '../request';
// 查询渠道信息 是否启用 true:只查询启用状态 false：只查询未启用状态 不传：查询全部
export async function getAllChannelList(params: any) {
  return request<any>('/omsapi/channel/queryChannel', {
    method: 'POST',
    data: params,
  });
}

// 修改渠道配置信息
export async function updateChannel(params: any) {
  return request<any>('/omsapi/channel/updateChannel', {
    method: 'POST',
    data: params,
  });
}

// 新增渠道配置信息
export async function createChannel(params: any) {
  return request<any>('/omsapi/channel/saveChannel', {
    method: 'POST',
    data: params,
  });
}
