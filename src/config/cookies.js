import Cookies from 'cookies-js';

// console-shop.showjoy.com
// tms.showjoy.com
// 共享cookie信息

let dom = document.domain; // 默认值
if (dom.indexOf('showjoy') > -1) {
  // 代表除本地开发以外的环境
  const domainArr = dom.split('.');
  const len = domainArr.length;
  if (domainArr[len - 1] === 'cn') {
    dom = `.showjoy.${domainArr[len - 2]}.${domainArr[len - 1]}`;
  } else {
    dom = `.showjoy.${domainArr[len - 1]}`;
  }
} else {
  dom = dom.split(':')[0];
}

console.log(dom, 'cookie设置的域名');

Cookies.defaults = {
  path: '/',
  domain: dom,
  httpOnly: true
};


const getUserInfo = () => {
  const userinfoStr = Cookies.get('tmsUserInfo');
  let userInfo = {}; // eslint-disable-line
  try {
    userInfo = JSON.parse(userinfoStr);
  } catch (error) {
    userInfo = {};
  }
  return userInfo;
};


export default Cookies;

export {
  getUserInfo
};
