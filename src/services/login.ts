import request from './request';
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/authapi/login/signIn', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
export async function currentUser() {
  return request<{ data?: any }>('/authapi/login/getEmpLoginInfo', {
    method: 'POST',
  });
}
export async function logout() {
  return request<any>('/authapi/login/signOut', {
    method: 'GET',
  });
}
export async function loadAuthMenus() {
  return request<any>('/authapi/permission/loadSsoAuthMenus', {
    method: 'POST',
  });
}

// 模拟登录 切换员工当前登录的工号,需要管理员权限
export async function toggleLogin(body: any, options?: Record<string, any>) {
  return request<any>('/authapi/login/toggleLogin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: body,
    ...(options || {}),
  });
}
