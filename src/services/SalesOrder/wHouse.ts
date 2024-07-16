import request from '../request';
// 查询仓库信息
export async function queryWareHouse() {
  return request<any>(`/omsapi/warehouse/queryWareHouse`, {
    method: 'GET',
  });
}
// 查询仓库客户配置信息
export async function queryWareHouseCustomer(body: any) {
  return request<any>(`/omsapi/warehouse/queryWareHouseCustomer`, {
    method: 'POST',
    data: body,
  });
}
// 查询平行仓配置信息
export async function queryWareHouseMapping(body: any) {
  return request<any>(`/omsapi/warehouse/queryWareHouseMapping`, {
    method: 'POST',
    data: body,
  });
}
// 根据仓库编号查询仓库区域配置信息(分页)
export async function queryWareHouseRegion(body: any) {
  return request<any>(`/omsapi/warehouse/queryWareHouseRegion`, {
    method: 'POST',
    data: body,
  });
}
// 据仓库区域id删除仓库区域配置信息
export async function deleteWareHouseRegion(body: any) {
  return request<any>(`/omsapi/warehouse/deleteWareHouseRegion/${body}`, {
    method: 'GET',
  });
}
// 根据仓库编号查询仓库属性配置信息
export async function queryWareHouseConfig(body: any) {
  return request<any>(`/omsapi/warehouse/queryWareHouseConfig/${body}`, {
    method: 'GET',
  });
}
// 新增仓库区域配置信息
export async function saveWareHouseRegion(body: any) {
  return request<any>(`/omsapi/warehouse/saveWareHouseRegion`, {
    method: 'POST',
    data: body,
  });
}
// 根据仓库编号修改仓库属性配置信息
export async function updateWareHouseConfig(body: any) {
  return request<any>(`/omsapi/warehouse/updateWareHouseConfig`, {
    method: 'POST',
    data: body,
  });
}
// 新增仓库客户配置信息
export async function saveWareHouseCustomer(body: any) {
  return request<any>(`/omsapi/warehouse/saveWareHouseCustomer`, {
    method: 'POST',
    data: body,
  });
}
// 新增仓库客户配置信息
export async function deleteWareHouseCustomer(body: any) {
  return request<any>(`/omsapi/warehouse/deleteWareHouseCustomer/${body}`, {
    method: 'GET',
  });
}
// 修改仓库客户配置装运点信息
export async function updateWareHouseCustomer(body: any) {
  return request<any>(`/omsapi/warehouse/updateWareHouseCustomer`, {
    method: 'POST',
    data: body,
  });
}
// 新增仓库平行仓配置信息
export async function saveWareHouseMapping(body: any) {
  return request<any>(`/omsapi/warehouse/saveWareHouseMapping`, {
    method: 'POST',
    data: body,
  });
}
// 新增仓库平行仓配置信息
export async function deleteWareHouseMapping(body: any) {
  return request<any>(`/omsapi/warehouse/deleteWareHouseMapping/${body}`, {
    method: 'GET',
  });
}
// 获取省市区列表 parentId :上级ID,获取省份列表的时候传0 ，不传参数默认返回省份列表
export async function getRegionList(body: any) {
  return request<any>('/omsapi/Zoning/queryZList', {
    method: 'POST',
    data: body,
  });
}
// 获取省市区列表 parentId :上级ID,获取省份列表的时候传0 ，不传参数默认返回省份列表
export async function updateStorageLocation(body: any) {
  return request<any>('/omsapi/warehouse/updateStorageLocation', {
    method: 'POST',
    data: body,
  });
}
