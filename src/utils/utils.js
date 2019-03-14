import lodash from './lodash';
import accounting from '../vendor/accounting'
/**
 * 格式化时间
 * @param time
 */
const formatTime = (time) => {
  if (typeof time !== 'number' || time < 0) {
    return time;
  }
  const hour = parseInt(time / 3600, 10);
  time %= 3600;
  const minute = parseInt(time / 60, 10);
  time = parseInt(time % 60, 10);
  const second = time;

  return ([hour, minute, second]).map((n) => {
    n = n.toString();
    return n[1] ? n : `0${n}`;
  }).join(':');
};


/**
 * 格式化日期
 * @param time
 */
const formatNum = (value) => {
  const str = value.toString();
  return str[1] ? str : `0${str}`;
};
const formatDate = (time) => {
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();

  const hour = time.getHours();
  const minute = time.getMinutes();
  const second = time.getSeconds();
  const millisecond = time.getMilliseconds();

  const date = [year, month, day].map(formatNum).join('/');
  time = [hour, minute, second].map(formatNum).join(':');

  return `${date} ${time}.${millisecond}`;
};


/**
 * 格式链接
 * @param url
 * index/index => /pages/index/index
 * pages/index/index => /pages/index/index
 */
const normalizeUrl = (url) => {
  if (!url) {
    return url;
  }
  if (url[0] === '/') {
    url = url.substr(1);
  }
  if (!/^pages/.test(url)) {
    url = `pages/${url}`;
  }
  return `/${url}`;
};

/**
 * 解析链接
 * @param url
 * pages/index/index?id=1
 * =>
 * route: pages/index/index
 * query: {id: 1}
 */
const parseUrl = (url) => {
  const [route, search] = url.split('?');
  let query = {};
  if (search) {
    query = search.split('&').reduce((obj, pair) => {
      const [key, val] = pair.split('=');
      obj[key] = val;
      return obj;
    }, {});
  }
  return {
    route,
    query
  };
};

/**
 * 去除首字符
 * @param str
 * @param char
 * /index/index => index/index
 */
const trimStart = (str, char) => {
  if (str[0] === char) {
    return trimStart(str.substr(1));
  }
  return str;
};

/**
 * 去除尾字符
 * @param str
 * @param char
 * /index/index/ => /index/index
 */
const trimEnd = (str, char) => {
  const length = str.length;
  if (str[length - 1] === char) {
    return trimEnd(str.substr(0, length - 1));
  }
  return str;
};

/**
 * 合并url
 * @param baseUrl
 * @param pathUrl
 * http://test.com/ /index/index
 * =>
 * http: //test.com/index/index
 */
const combinUrl = (baseUrl, pathUrl) => {
  if (~pathUrl.indexOf('://')) {
    return pathUrl;
  }
  return `${trimEnd(baseUrl, '/')}/${trimStart(pathUrl, '/')}`;
};


/**
 * 清除抖动
 * @param {*} func
 * @param {*} wait
 * @param {*} immediate
 */
const debounce = (func, wait, immediate) => {
  /** 调用debounce声明一下变量 * */
  let timeout; let args; let context; let timestamp; let
    resullt;
  /** 初次由return函数调用, 后面自己递归调用 * */
  const later = function () {
    const now = new Date().getTime();
    // 记录在wait时间内上一次执行return函数的时间间隔
    const last = now - timestamp;
    // 时间间隔小于wait,继续递归调用
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 用于immediate==false在结束边界调用
      if (!immediate) {
        resullt = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };
  return function () {
    context = this;
    args = arguments;
    timestamp = new Date().getTime();
    const exec = immediate && !timeout;
    // 初次timeout不存在,设置延时调用later
    if (!timeout) timeout = setTimeout(later, wait);
    // 用于immediate==true在开始边界调用
    if (exec) {
      resullt = func.apply(context, args);
      context = args = null;
    }
    return resullt;
  };
};
/**
 *判断是否是Ipx
 */

const isIpx = () => {
  const model = wx.getSystemInfoSync().model;
  const ipx = 'iPhone X';
  const ipxs = 'iPhone 11';
  return model.indexOf(ipx) > -1 || model.indexOf(ipxs) > -1;
};
/**
 * 生成随机ID
 */
const randomId = () => Math.random().toString(36).substr(2)

const currency = (value) => {
  if (typeof value === 'string') value = parseFloat(value)
  if (isNaN(value)) return value
  return `￥${value.toFixed(2).toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')}`
}
/**
 * 判断手机系统
 */
const getPlatform = () => {
  return wx.getSystemInfoSync().platform
}


export default {
  ...lodash,
  ...accounting,
  formatTime,
  normalizeUrl,
  parseUrl,
  debounce,
  formatDate,
  combinUrl,
  isIpx,
  randomId,
  currency,
  getPlatform
};
