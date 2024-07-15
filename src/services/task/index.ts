import request from '../request';
// 任务列表-全部任务-分页列表1 页面一样的页面 后端坐权限拆分为三
export async function getPageList(body: any) {
  return request<any>('/omsapi/taskInstance/getPageList', {
    method: 'POST',
    data: body,
  });
}
// 任务列表-待办-分页列表2
export async function getTodoPageList(body: any) {
  return request<any>('/omsapi/taskInstance/getTodoPageList', {
    method: 'POST',
    data: body,
  });
}
// 任务列表-销售-分页列表3
export async function getSalePageList(body: any) {
  return request<any>('/omsapi/taskInstance/getSalePageList', {
    method: 'POST',
    data: body,
  });
}
// 任务类型配置 list
export async function taskConfigList(body: any) {
  return request<any>('/omsapi/taskConfig/getPageList', {
    method: 'POST',
    data: body,
  });
}
// 任务类型配置 新增任务类型配置
export async function taskConfigAdd(body: any) {
  return request<any>('/omsapi/taskConfig/add', {
    method: 'POST',
    data: body,
  });
}
// 任务类型配置 编辑
export async function editDetail(body: any) {
  return request<any>(`/omsapi/taskConfig/editDetail/${body?.sid}`, {
    method: 'POST',
    data: body,
  });
}
// 任务类型配置 编辑保存
export async function editSave(body: any) {
  return request<any>(`/omsapi/taskConfig/editSave`, {
    method: 'POST',
    data: body,
  });
}
// 修改状态 任务类型
export async function changeState(body: any) {
  return request<any>(
    `/omsapi/taskConfig/changeState?sid=${body?.sid}&enable=${body?.enable}&type=${body?.type}`,
    {
      method: 'GET',
      data: body,
    },
  );
}
//  任务类型 展示数据初始化页面
export async function configDisplayDataDetail(body: any) {
  return request<any>(`/omsapi/taskConfig/configDisplayDataDetail/${body?.sid}`, {
    method: 'POST',
    data: body,
  });
}
//  任务类型配置-配置展示数据-保存
export async function configDisplayDataSave(body: any) {
  return request<any>(`/omsapi/taskConfig/configDisplayDataSave`, {
    method: 'POST',
    data: body,
  });
}

// 任务类型配置-配置提交字段-初始化页面
export async function configSubmitFieldDetail(body: any) {
  return request<any>(`/omsapi/taskConfig/configSubmitFieldDetail/${body?.sid}`, {
    method: 'POST',
    data: body,
  });
}
// 任务类型配置-配置提交字段-添加字段-待选信息
export async function configSubmitToSelectField(body: any) {
  return request<any>(`/omsapi/taskConfig/configSubmitToSelectField/${body?.type}`, {
    method: 'POST',
    data: body,
  });
}
// 任务类型配置-配置提交字段-添加字段-保存
export async function configSubmitFieldSave(body: any) {
  return request<any>(`/omsapi/taskConfig/configSubmitFieldSave`, {
    method: 'POST',
    data: body,
  });
}
// 任务列表-详情-编辑-保存
export async function saveEdit(body: any) {
  return request<any>(`/omsapi/taskInstance/saveEdit`, {
    method: 'POST',
    data: body,
  });
}
// 任务列表-详情-转交任务
export async function saveTransferTask(body: any) {
  return request<any>(`/omsapi/taskInstance/transferTask`, {
    method: 'POST',
    data: body,
  });
}
//任务列表-详情-基本信息&任务信息
export async function getDetail(body: any) {
  return request<any>(`/omsapi/taskInstance/getDetail/${body?.sid}`, {
    method: 'POST',
    data: body,
  });
}
//任务列表-详情-已开始
export async function starts(body: any) {
  return request<any>(`/omsapi/taskInstance/starts/${body?.sid}`, {
    method: 'POST',
    data: body,
  });
}
//任务列表-详情-已完成-需要提交字段
export async function getFinishSubmitField(body: any) {
  return request<any>(`/omsapi/taskInstance/getFinishSubmitField/${body?.sid}`, {
    method: 'POST',
    data: body,
  });
}
//任务列表-详情-已完成-确认操作
export async function saveFinish(body: any) {
  return request<any>(`/omsapi/taskInstance/finish`, {
    method: 'POST',
    data: body,
  });
}
//  任务列表-全部任务-导出
export async function pageListExport(body: any) {
  return request<any>('/omsapi/taskInstance/pageListExport', {
    method: 'POST',
    data: body,
    ...({ responseType: 'blob', getResponse: true } || {}),
  });
}
//  任务列表-待办任务-导出
export async function todoPageListExport(body: any) {
  return request<any>('/omsapi/taskInstance/todoPageListExport', {
    method: 'POST',
    data: body,
    ...({ responseType: 'blob', getResponse: true } || {}),
  });
}
// 任务列表-销售任务-导出
export async function salePageListExport(body: any) {
  return request<any>('/omsapi/taskInstance/salePageListExport', {
    method: 'POST',
    data: body,
    ...({ responseType: 'blob', getResponse: true } || {}),
  });
}

// 项目任务类型 mission-分页
export async function missionList(body: any) {
  return request<any>('/omsapi/mission/mission/page', {
    method: 'POST',
    data: body,
  });
}
// 项目任务类型 mission-详情
export async function missionDetail(body: any) {
  return request<any>(`/omsapi/mission/detail/${body?.sid}`, {
    method: 'POST',
    data: body,
  });
}
// 项目任务类型 mission-新增任务
export async function addTask(body: any) {
  return request<any>(`/omsapi/mission/addTask`, {
    method: 'POST',
    data: body,
  });
}
// 项目任务列表-详情-新增任务-任务类型选择
export async function getAddTaskList(body: any) {
  return request<any>(`/omsapi/taskConfig/getList?name=${body?.name}`, {
    method: 'GET',
    data: body,
  });
}
// mission-相关任务分页
export async function queryTask(body: any) {
  return request<any>(`/omsapi/mission/queryTask`, {
    method: 'POST',
    data: body,
  });
}
// mission导出
export async function exportReporterData(body: any) {
  return request<any>('/omsapi/mission/missionExport', {
    method: 'POST',
    data: body,
    ...({ responseType: 'blob', getResponse: true } || {}),
  });
}
// mission 报表导出 老页面是index.copy
export async function exportReporterMissionOpenData(body: any) {
  return request<any>('/omsapi/mission/openSOExport', {
    method: 'POST',
    data: body,
    ...({ responseType: 'blob', getResponse: true } || {}),
  });
}

// mission-openso报表-分页
export async function openSO(body: any) {
  return request<any>(`/omsapi/mission/openSO/page`, {
    method: 'POST',
    data: body,
  });
}
