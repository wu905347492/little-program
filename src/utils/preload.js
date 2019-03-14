import utils from './utils';
import logger from './logger';

const { parseUrl, isFunction } = utils;

const _fns = {};
const _obj = {};

const preload = {
  init(key, fn) {
    if (key) _fns[key] = fn;
  },
  set(key) {
    const { route, query } = parseUrl(key);
    const fn = _fns[route];
    if (isFunction(fn)) {
      logger.debug(`Preload route: ${key}`);
      const val = fn.call(null, query);
      const promise = Promise.resolve(val);
      _obj[key] = promise.then(value => value);
    }
  },
  get(key, fn) {
    if (!(key in _obj)) {
      if (isFunction(fn)) {
        return Promise.resolve(fn());
      }
      return null;
    }
    const result = _obj[key];
    delete _obj[key];
    return result;
  }
};

export default preload;
