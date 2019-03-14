import logger from './logger.js';

const storage = {
  // 默认缓存24小时
  set(key, value, timer = 24) {
    const data = {
      value,
      timer: timer * 60 * 1000,
      createAt: new Date().getTime()
    };
    wx.setStorageSync(key, data);
  },
  get(key) {
    try {
      const data = wx.getStorageSync(key);
      if (data !== null) {
        if (data.createAt != null && data.createAt + data.timer <= new Date().getTime()) {
          wx.removeStorageSync(key);
        } else {
          return data.value;
        }
      }
      return null;
    } catch (err) {
      logger.warn('storage: get failed: ', err);
      return null;
    }
  },
  remove(key) {
    try {
      wx.removeStorageSync(key);
    } catch (err) {
      logger.warn('storage: remove failed: ', err);
    }
  },
  clear() {
    try {
      wx.clearStorageSync();
    } catch (err) {
      logger.warn('storage: clear failed: ', err);
    }
  }
};

export default storage;
