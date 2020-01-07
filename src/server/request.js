import axios from 'axios';
import { message, notification } from 'antd';
import { noAccessInfo } from '$utils/func';
// post内容类型设置
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

function switchCode(result, config) {
  if (!result.isSuccess) {
    const errorCode = result.errorCode;
    switch (errorCode) {
      case 10000:
        notification.open({
          message: result.msg,
          description: result.data ? result.data : '请联系工程师们为您解决问题。',
        });
      break;
      case 10001:
        notification.open({
          message: result.msg,
          description: result.data ? result.data : '请联系工程师们为您解决问题。',
        });
      break;
      case 10002:
        notification.open({
          message: result.msg,
          description: result.data ? result.data : '接口参数值有误',
        });
      break;
      case 20001:
        notification.open({
          message: result.msg,
          description: result.data ? result.data : '请联系工程师们为您解决问题。',
        });
      break;
      case 20002:
        notification.open({
          message: result.msg,
          description: result.data ? result.data : '请联系工程师们为您解决问题。',
        });
      break;
      case 20004:
        // 未登录
        // 需要重定向到login页面 hash模式可使用location跳转
        const redirectUrl = window.location.hash.slice(1); // eslint-disable-line
        if (redirectUrl.indexOf('redirectUrl') === -1) {
          window.location.replace(`#/login?redirectUrl=${redirectUrl}`);
        }
      break;
      case 20005:
        // 无权限
        noAccessInfo();
      break;
      case 21000:
        notification.open({
          message: result.msg,
          description: result.data ? result.data : '请联系工程师们为您解决问题。',
        });
      break;
      default:
        console.log(config, 'config');
        if (config.method === 'post' && !(config.data && config.data.notips)) {
          message.error(result.msg, 3);
        }
        if (config.method === 'get' && !(config.params && config.params.notips)) {
          message.error(result.msg, 3);
        }
      break;
    }
  }
}

// 添加请求拦截器
axios.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  return config;
}, error => {
  // 对请求错误做些什么
  message.error(error.toString(), 3);
  console.log(error.toString(), 'error');
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(res => {
  // 对响应数据做点什么
  console.log(res, '响应的参数');
  const result = res.data;
  switchCode(result, res.config);
  return result;
}, error => {
  // 对响应错误做点什么
  if (error.response) {
    if (error.response.status === 401) {
      switchCode(error.response.data);
    } else {
      message.error(error.toString(), 3);
    }
  }
  return Promise.reject(error);
});

// 默认请求
export default (config) => {
  return new Promise((resolve, reject) => {
    axios({
      url: config.url || '',
      method: config.method || 'get',
      headers: {
        Accept: '*/*',
        'X-Requested-With': 'XMLHttpRequest'
      },
      maxContentLength: config.maxContentLength || Infinity,
      timeout: config.timeout || 10000,
      data: config.data || {}, // post put delete 请求参数
      params: config.params || {}, // get请求参数
      onUploadProgress: config.onUploadProgress || (() => {}),
      onDownloadProgress: config.onDownloadProgress || (() => {}),
      responseType: config.responseType || 'json', // 默认的
    }).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    });
  });
};

const FetchGet = (config) => {
  return new Promise((resolve, reject) => {
    axios({
      url: config.url || '',
      method: 'get',
      headers: {
        Accept: '*/*',
        'X-Requested-With': 'XMLHttpRequest',
      },
      maxContentLength: config.maxContentLength || Infinity,
      timeout: config.timeout || 10000,
      params: config.params || {}, // get请求参数
      responseType: config.responseType || 'json', // 默认的
    }).then(res => {
      console.log(res, 'get返回的数据');
      resolve(res);
    }).catch(err => {
      reject(err);
    });
  });
};

const FetchPost = (config) => {
  return new Promise((resolve, reject) => {
    axios({
      url: config.url || '',
      method: 'post',
      headers: {
        Accept: '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': config.contentType || 'application/json',
      },
      maxContentLength: config.maxContentLength || Infinity,
      timeout: config.timeout || 10000,
      data: config.data || {},
      params: config.params || {},
      responseType: config.responseType || 'json', // 默认的
    }).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    });
  });
};

const FetchPut = (config) => {
  return new Promise((resolve, reject) => {
    axios({
      url: config.url || '',
      method: 'put',
      headers: {
        Accept: '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': config.contentType || 'application/json;charset=UTF-8',
      },
      maxContentLength: config.maxContentLength || Infinity,
      timeout: config.timeout || 10000,
      data: config.data || {},
      responseType: config.responseType || 'json', // 默认的
    }).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    });
  });
};

const FetchDelete = config => {
  return new Promise((resolve, reject) => {
    axios({
      url: config.url || '',
      method: 'delete',
      headers: {
        Accept: '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': config.contentType || 'application/json;charset=UTF-8',
      },
      maxContentLength: config.maxContentLength || Infinity,
      timeout: config.timeout || 10000,
      data: config.data || {},
      responseType: config.responseType || 'json', // 默认的
    }).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    });
  });
};

export {
  FetchGet,
  FetchPost,
  FetchDelete,
  FetchPut
};
