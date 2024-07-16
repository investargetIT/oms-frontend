import request from '../request';
// 只显示启用的操作权限
export async function queryPermission(params: any) {
  return request<any>('/omsapi/operationPermission/queryPermission', {
    method: 'POST',
    data: params,
  });
}
// 新增操作权限配置信息
export async function savePermission(params: any) {
  return request<any>('/omsapi/operationPermission/savePermission', {
    method: 'POST',
    data: params,
  });
}
// 修改操作权限配置信息
export async function updatePermission(params: any) {
  return request<any>('/omsapi/operationPermission/updatePermission', {
    method: 'POST',
    data: params,
  });
}
