
import React from 'react';
import { Modal, Icon } from 'antd';
import env from '$config/env';
/**
 * 二次确认弹窗
 */
export const secondConfirm = (title = '', content = '', cb) => {
  const modal = Modal.confirm({
    title: (
      <div className="common-modal-confirm-title">
        <Icon type="exclamation-circle" theme="filled" />
        <span className="common-modal-confirm-title-text">{title}</span>
      </div>),
    content,
    width: 500,
    centered: true,
    icon: null,
    onCancel() {
      modal.destroy();
    },
    onOk() {
      cb();
    }
  });
};
// 无权限弹窗
export const noAccessInfo = (text = '') => {
  const txt = text || '您的权限不足,如有需要请联系部门管理员或者通过钉钉进行权限申请。';
  Modal.info({
    title: (
      <div className="common-modal-confirm-title">
        <Icon type="exclamation-circle" theme="filled" className="nopass-icon" />
        <span className="common-modal-confirm-title-text">系统错误</span>
      </div>),
    content: (
      <div className="confirm-content-wrap">
        <p className="confirm-content-tit">哎呀，您现在无权进行这项操作</p>
        <p className="confirm-content-txt">
          { txt }
        </p>
      </div>
    ),
    width: 500,
    centered: true,
    icon: null,
    okText: '我知道了',
  });
};

/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
  let target;
  // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
  if (attr === 'scrollTop') {
    target = element.scrollTop;
    return NumberMode === 'float' ? parseFloat(target) : parseInt(target, 10);
  }
  if (window.getComputedStyle) {
    // 大部分高版本的浏览器支持的方法
    try {
      target = window.getComputedStyle(element, null)[attr];
    } catch (err) {
      console.log(err);
    }
  } else {
    // IE支持的方法
    target = element.currentStyle[attr];
  }
  // 在获取 opactiy 时需要获取小数 parseFloat
  return NumberMode === 'float' ? parseFloat(target) : parseInt(target, 10);
};

/**
 * 格式化金额数值（12345678 => 123,456,78）
 * @param {数字或者小数} num
 * @param {分割符号} spt
 */
export const formatPrice = (num, spt) => {
    let n = `${num}`;
    const fensplit = spt || '.';
    let last = '';
    let res = '';
    if (n.indexOf('.') > -1) {
      // 为小数
      const arr = n.split('.');
      last = arr[1];
      n = arr[0];
    }
    while (n.length > 3) {
      res = `,${n.slice(-3)}${res}`;
      n = n.slice(0, n.length - 3);
    }
    if (n) {
      res = n + res;
    }
    if (last) {
      res += `${fensplit}${last}`;
    }
    return res;
};

/**
 * !!! 一般情况使用不到这个函数，通过router对象获取
 * @param {*}
 */
export const getUrlParam = (name) => {
  const reg = new RegExp(`(^|[&,?])${name}=([^&]*)(&|$)`);
  const r = window.location.href.substr(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
};

/**
 * 统计字数
 * @param {*}data
 */
export const wordCount = (data) => {
	const pattern = /[\，\。\？\?\!\@\,\.a-zA-Z0-9_\u0392-\u03c9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
	const m = data.match(pattern);
	let count = 0;
	if (m == null) {
    return count;
  }
	for (let i = 0; i < m.length; i++) {
		if (m[i].charCodeAt(0) >= 0x4E00) {
			count += m[i].length;
		} else {
			count += 1;
		}
	}
  return count;
};

/**
 * 防抖函数
 */
export function throttle(fn, delay) {
  // last为上一次触发回调的时间, timer是定时器
  let last = 0;
  let timer = null;
  console.log(fn, 'fn');
  // 将throttle处理结果当作函数返回
  return function () {
    console.log(2222);
    // 保留调用时的this上下文
    const context = this;
    // 保留调用时传入的参数
    const args = arguments; // eslint-disable-line
    // 记录本次触发回调的时间
    const now = +new Date();
    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last < delay) {
      const cb = function cb() {
        last = now;
        fn.apply(context, args);
      };
    // 如果时间间隔小于我们设定的时间间隔阈值，则为本次触发操作设立一个新的定时器
      clearTimeout(timer);
      timer = setTimeout(cb, delay);
    } else {
      // 如果时间间隔超出了我们设定的时间间隔阈值，那就不等了，无论如何要反馈给用户一次响应
      last = now;
      fn.apply(context, args);
    }
  };
}

/**
 * 创建自定义事件
 */
export const createEvent = (eventName, params) => {
  return new CustomEvent(eventName, { detail: params });
};

// 保留两个小数
export const twoPoint = (num) => {
  const a = num * 1;
  const b = a.toFixed(2);
  return b;
};

// 保留两个小数，并获取到小数点前面的
export const twoPointPre = (num) => {
  const a = num * 1;
  const b = a.toFixed(2).toString();
  return b.split('.')[0];
};

// 保留两个小数，并获取到小数点后面的
export const twoPointNext = (num) => {
  const a = num * 1;
  const b = a.toFixed(2).toString();
  return b.split('.')[1];
};

// 超出99 显示99+
export const hundred = (num) => {
  if (num > 99) {
    return '99+';
  }
  return num;
};

// 去掉空格
export const trim = (val = '') => {
  return val ? val.replace(/^\s*|\s*$/, '') : '';
};

// 时间格式化 2018-09-12 ===> 2018.09.12
export const timeFormat = (time = '') => {
  return time ? time.replace(/-/gi, '.') : '';
};

/**
 * 获取console-shop.showjoy.com的环境的host
 */
export const getConsoleEnvHost = () => {
  let hostpath = '';
  switch (env) {
    case 'develop':
      hostpath = 'https://console-shop.showjoy.net/index#/';
    break;
    case 'test':
      hostpath = 'https://console-shop.showjoy.com.cn/index#/';
    break;
    case 'preview':
      hostpath = 'https://console-shop.showjoy.com/index#/';
    break;
    case 'production':
      hostpath = 'https://console-shop.showjoy.com/index#/';
    break;
    default:
      hostpath = 'https://console-shop.showjoy.com/index#/';
    break;
  }
  return hostpath;
};
