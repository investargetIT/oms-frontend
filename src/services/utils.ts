import request from './request';
import { trim } from 'lodash';
import Cookies from 'js-cookie';
import { message } from 'antd';
// 固定列不能超过8行
export function colLimit(val: any, calBack: any): any {
  let num = 0;
  if (val) {
    Object.keys(val)?.forEach((item: any) => {
      if (val[item]?.show && val[item]?.fixed) ++num;
      if (num > 8) {
        val[item].fixed = false;
      }
    });
  }
  // calBack(val);
  if (num > 8) {
    message.warning('最多只能固定8行!');
    calBack(val);
  }
  // return val;
}
// 参数去空格
export function trimData(params: any) {
  try {
    if (params && typeof params === 'object') {
      Object.keys(params).forEach((item: any) => {
        if (typeof params[item] === 'string') {
          params[item] = trim(params[item]);
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
  return params;
}
// 获取对应环境的基路径
export function getPrefix(url: any) {
  if (url.indexOf('html') > -1) {
    let prefix = 'https://gps.mymro.cn';
    if (['test', 'dev'].includes(REACT_APP_ENV.toString())) prefix = 'https://gps2.mymro.cn';
    return prefix;
  } else if (url.indexOf('reportdata') > -1) {
    console.log(REACT_APP_ENV, 'REACT_APP_ENV');
    let prefix = 'https://omsreportapi.mymro.cn';
    if (['test'].includes(REACT_APP_ENV.toString())) {
      prefix = 'https://test-omsreportapi.mymro.cn';
    } else if (['dev'].includes(REACT_APP_ENV.toString())) {
      prefix = 'https://dev-omsreportapi.mymro.cn';
    } else if (['uat'].includes(REACT_APP_ENV.toString())) {
      prefix = 'https://uat-omsreportapi.mymro.cn';
    }
    return prefix;
  } else if (
    url.indexOf('enterprise-service') > -1 ||
    url.indexOf('trading-center') > -1 ||
    url.indexOf('member-center') > -1 ||
    url.indexOf('oms-front') > -1
  ) {
    let prefix = 'https://gateway.mymro.cn';
    if (['test', 'dev'].includes(REACT_APP_ENV.toString())) {
      prefix = 'https://test-gateway.mymro.cn';
    } else if (['uat'].includes(REACT_APP_ENV.toString())) {
      prefix = 'https://uat-gateway.mymro.cn';
    }
    return prefix;
  } else {
    let prefix = `https://${url.indexOf('reportapi') > -1 ? 'bireportapi' : 'omsapi'}.mymro.cn`;
    if (['test'].includes(REACT_APP_ENV.toString())) {
      prefix = `${
        url.indexOf('reportapi') > -1
          ? 'https://bireportapi.mymro.cn'
          : 'https://test-omsapi.mymro.cn'
      }`;
    } else if (['dev'].includes(REACT_APP_ENV.toString())) {
      prefix = `${
        url.indexOf('reportapi') > -1
          ? 'https://bireportapi.mymro.cn'
          : 'https://dev-omsapi.mymro.cn'
      }`;
    } else if (['uat'].includes(REACT_APP_ENV.toString())) {
      prefix = `${
        url.indexOf('reportapi') > -1
          ? 'https://bireportapi.mymro.cn'
          : 'https://uat-omsapi.mymro.cn'
      }`;
    }
    return prefix;
  }
}
// 获取对应环境的路径
export function getEnv() {
  let prefix = `https://omsapi.mymro.cn`;
  if (['test'].includes(REACT_APP_ENV.toString())) {
    prefix = 'https://test-omsapi.mymro.cn';
  }
  if (['dev'].includes(REACT_APP_ENV.toString())) {
    prefix = 'https://dev-omsapi.mymro.cn';
  }
  if (['uat'].includes(REACT_APP_ENV.toString())) {
    prefix = 'https://uat-omsapi.mymro.cn';
  }
  return prefix;
}
// 获取OA对应环境的路径
export function getOAEnv() {
  let prefix = 'https://fanweioa.mymro.cn';
  if (['test', 'dev'].includes(REACT_APP_ENV.toString())) prefix = 'http://124.71.177.204';
  if (['uat'].includes(REACT_APP_ENV.toString())) {
    prefix = 'https://uat-fanweioa.mymro.cn';
  }
  return prefix;
}
// 转订单gps域名路径
export function getEnvGps() {
  let prefix = `https://gps.mymro.cn`;
  if (['test', 'dev'].includes(REACT_APP_ENV.toString())) prefix = 'https://gps2.mymro.cn';
  return prefix;
}

// 转订单企业站enterprise域名路径
export function getEnvEnterprise() {
  let prefix = `https://ent.mymro.cn`;
  if (['test', 'dev'].includes(REACT_APP_ENV.toString())) {
    prefix = 'https://test-enterprise.mymro.cn';
  } else if (['uat'].includes(REACT_APP_ENV.toString())) {
    prefix = 'https://uat-enterprise.mymro.cn';
  }
  return prefix;
}
export function getEnvMymro() {
  let prefix = `https://www.mymro.cn`;
  if (['test', 'dev'].includes(REACT_APP_ENV.toString())) {
    prefix = 'https://test-www.mymro.cn';
  } else if (['uat'].includes(REACT_APP_ENV.toString())) {
    prefix = 'https://uat-www.mymro.cn';
  }
  return prefix;
}

// 获取对应环境的appId
export function getAppId() {
  let prefix = 'GCL-q5S04yCY';
  if (['test', 'dev'].includes(REACT_APP_ENV.toString())) prefix = 'GCL-Ei13VNKz';
  return prefix;
}

// dashboard数据统计域名路径
export function getEnvDashboardReport() {
  let prefix = `https://omsreportapi.mymro.cn`;
  if (['dev'].includes(REACT_APP_ENV.toString())) {
    prefix = 'https://dev-omsreportapi.mymro.cn';
  }
  if (['test'].includes(REACT_APP_ENV.toString())) {
    prefix = 'https://test-omsreportapi.mymro.cn';
  }
  if (['uat'].includes(REACT_APP_ENV.toString())) {
    prefix = 'https://uat-omsreportapi.mymro.cn';
  }
  return prefix;
}

// 通用退出接口
export function Logout() {
  // 是否是微前端环境
  const globalData = window.microApp?.getGlobalData(); // 返回全局数据
  if (window.__MICRO_APP_ENVIRONMENT__ && globalData?.logout) {
    Cookies.remove('ssoToken', '');
    globalData.logout();
  } else {
    if (Cookies.get('ssoToken')) {
      Cookies.remove('ssoToken', '');
      // logout().then(() => {
      //   Cookies.remove('ssoToken', '');
      //   window.location.href = '/login';
      // });
      if (
        ['/inquiry/offer/offerOrder', '/inquiry/info', '/inquiry/offer/order'].includes(
          window.location.pathname,
        )
      ) {
        console.log(1);
        window.location.href = '/login';
      } else {
        console.log(2);
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.href);
      }
    } else {
      if (
        ['/inquiry/offer/offerOrder', '/inquiry/info', '/inquiry/offer/order'].includes(
          window.location.pathname,
        )
      ) {
        console.log(3);
        window.location.href = '/login';
      } else {
        console.log(4);
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.href);
      }
    }
  }
  if (localStorage.getItem('default_user')) {
    localStorage.removeItem('default_user');
  }
  if (localStorage.getItem('default_token')) {
    localStorage.removeItem('default_token');
  }
}
// 获取产品品牌信息下拉框
export async function productBrand(brandName: string) {
  return request<any>('/omsapi/pms/productBrand', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      brandName,
    },
  });
}
// 获取获取采购单位
export async function purchaseUom() {
  return request<any>('/omsapi/pms/uom/getAll', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
// 获取通用下拉框
export async function queryListDataMap(typeList: any) {
  return request<any>('/omsapi/lists/queryListDataMap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      typeList,
    },
  });
}
// 根据输入的供应商名模糊查询匹配的供应商列表
export async function supplierSearch(supplierName: string) {
  return request<any>('/omsapi/sap/supplier/search', {
    method: 'POST',
    data: {
      supplierName,
    },
  });
}
// 需求单查看日志、需求单清单明细查看日志等公共接口
export async function logList(data: any) {
  return request<any>('/omsapi/log/list', {
    method: 'POST',
    data,
  });
}
//根据key获取指定枚举内容
export async function getByKeys(data: any) {
  return request<any>('/omsapi/common/enum/getByKeys', {
    method: 'POST',
    data,
  });
}
//创建sourcing类型的品牌
export async function createBrand(data: any) {
  return request<any>('/omsapi/pms/createBrand', {
    method: 'POST',
    data,
  });
}
