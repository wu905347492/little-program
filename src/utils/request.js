/* eslint-disable no-use-before-define */
import config from '../config';
import utils from './utils';
import logger from './logger';
import tokenManage from './token-manage';
import httpStatusCode from './httpStatusCode';

const {
  isObject,
  isFunction,
  combinUrl
} = utils;

// 拦截器

let status = false;

const interceptors = {
  request: {
    // 设置token
    async setToken(options) {
      const token = await tokenManage.get();
      options.header = options.header || {};
      options.header.token = token;
      return options;
    },
    // 检查网络
    async checkNetwork(options) {
      const {
        networkType
      } = await wx.$getNetworkType();
      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
      let message = '';
      if (networkType === 'none') {
        message = '网络不可用，请检查网络设置';
      } else if (networkType === '2g') {
        message = '网络较差，请检查网络设置';
      } else if (networkType === 'unknown') {
        message = '网络不稳定，请检查网络设置';
      }
      if (message && !status) {
        wx.showToast({
          title: message,
          icon: 'none'
        });

        // 避免频繁提示
        status = true;
        setTimeout(() => {
          status = false;
        }, 5 * 60 * 1000);
      }
      return options;
    },
    // 记录请求日志
    recordLog: async (options) => {
      logger.debug(`${options.method.toUpperCase()} ${options.url}`, options);
      return options;
    }
  },
  response: {
    // 处理HttpError
    async handleHttpError(options, result) {
      if (result.statusCode === 200) {
        const {
          code
        } = result.data;
        if (code === -1) {
          await tokenManage.clear();
          result = await request.send(options);
        }
      } else if (result.statusCode >= 400 && result.statusCode < 500) {
        throw new Error('Bad Request.', result.data);
      } else if (result.statusCode >= 500) {
        throw new Error('Server Error.', result.data);
      }
      return result;
    },
    // 记录返回日志
    async recordLog(options, result) {
      logger.debug(`${options.method.toUpperCase()} ${options.url} ${result.statusCode} (${httpStatusCode[result.statusCode]})`, result);
      return result;
    }
  }
};

const request = {
  beforeHooks: [],
  afterHooks: [],
  async send(options) {
    let _opts = options;
    const baseUrl = config.baseUrl;
    _opts.url = combinUrl(baseUrl, _opts.url);
    _opts = await this.execBeforeHook(_opts);
    let result = await wx.$request(_opts);
    result = await this.execAfterHook(_opts, result);
    return result;
  },
  async execBeforeHook(options) {
    options = await interceptors.request.checkNetwork(options);
    if (!options.ignore) {
      options = await interceptors.request.setToken(options);
    }
    options = await interceptors.request.recordLog(options);
    this.beforeHooks.forEach(async (fn) => {
      options = await Promise.resolve(fn.call(this, options));
    });
    return options;
  },
  async execAfterHook(options, result) {
    result = await interceptors.response.handleHttpError(options, result);
    result = await interceptors.response.recordLog(options, result);
    this.afterHooks.forEach(async (fn) => {
      result = await Promise.resolve(fn(options, result));
    });
    return result;
  },
  async registerHook(type, hook) {
    if (!isFunction(hook)) {
      logger.error('request hook must a valid function.');
      return;
    }
    if (type === 'before') {
      this.beforeHooks.push(hook);
    }
    if (type === 'after') {
      this.afterHooks.push(hook);
    }
  }
};

// 注册get,post,put,patch,delete请求方法
const methods = ['get', 'post', 'put', 'patch', 'delete'];
methods.forEach((method) => {
  request[method] = async function (options) {
    let _opts = {
      method
    };
    if (isObject(options)) {
      _opts = Object.assign({}, options, _opts);
    } else if (typeof options === 'string') {
      _opts.url = options;
      if (arguments.length === 2) {
        _opts.data = arguments[1];
      }
    }
    const result = await request.send(_opts);
    return result.data;
  };
});

export default request;
