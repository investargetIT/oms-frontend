import request from '../request';
// 查询jv公司信息
export async function queryMasterJV(params: any) {
  return request<any>('/omsapi/masterjv/queryMasterJV', {
    method: 'POST',
    data: params,
  });
}
//修改jv公司信息
export async function updateMasterJV(params: any) {
  return request<any>('/omsapi/masterjv/updateMasterJV', {
    method: 'POST',
    data: params,
  });
}
//保存jv公司信息
export async function saveMasterJV(params: any) {
  return request<any>('/omsapi/masterjv/saveMasterJV', {
    method: 'POST',
    data: params,
  });
}
