import { extend } from 'umi-request';
import Cookies from 'js-cookie';
import { history } from 'umi';
import { getPrefix, getAppId, Logout, trimData } from './utils';
import { message } from 'antd';
import { isApiWhite } from './constant';
const request = extend({
  timeout: 130000,
  referrerPolicy: 'no-referrer',
  // credentials: 'include',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});
let requestNum = 0;
let hide: any = null;
let setHide: any = null;
const loadingOption = {
  content: '接口疯狂加载中...',
  className: 'loadingMessage',
  duration: 0,
};
request.interceptors.request.use((url, config): any => {
  if (
    !Cookies.get('ssoToken') &&
    url !== '/oauth/login' &&
    history.location.pathname.indexOf('/login') === -1
  ) {
    // window.location.href = '/login';
    Logout();
    return false;
  }
  const headers: any = config.headers;
  headers.token = Cookies.get('ssoToken');
  // headers.token = 'dc474e5cfa1c4fb8a404c2c03feb437c';

  //'GCL-Ei13VNKz'
  headers.appId = getAppId();
  config.headers = headers;
  if (config.data) config.data = trimData(config.data);
  if (config.params) config.params = trimData(config.params);
  if (isApiWhite(url)) requestNum += 1;
  if (!setHide) {
    setHide = setTimeout(() => {
      if (requestNum) {
        hide = message.loading(loadingOption);
      }
    }, 500);
  }
  const newUrl = getPrefix(url) + url;
  return {
    url: newUrl,
    options: { ...config, interceptors: true },
  };
});
request.interceptors.response.use((response: any, options: any): Response => {
  if (requestNum > 0 && isApiWhite(options.url)) requestNum -= 1;
  if (requestNum === 0 && hide && setHide) {
    setTimeout(hide, 100);
    clearTimeout(setHide);
    setHide = null;
  }
  if (response.status === 401 && history.location.pathname.indexOf('/login') === -1) {
    Logout();
  }
  return response;
});
export default request;
