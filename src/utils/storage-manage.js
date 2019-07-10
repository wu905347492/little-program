import storage from './storage';

const PREFIX = '_';

export default {
  // 用户token
  setAccessToken: async (value, timer) => storage.set(`${PREFIX}TOKEN`, value, timer),
  getAccessToken: async () => storage.get(`${PREFIX}TOKEN`),
  clearAccessToken: async () => storage.remove(`${PREFIX}TOKEN`),
  // 用户openId
  setOpenId: async (value) => storage.set(`${PREFIX}OPENID`, value),
  getOpenId: async () => storage.get(`${PREFIX}OPENID`),
  clearOpenId: async () => storage.remove(`${PREFIX}OPENID`),
  // 用户phone
  setPhone: async (value) => storage.set(`${PREFIX}PHONE`, value),
  getPhone: async () => storage.get(`${PREFIX}PHONE`),
  clearPhone: async () => storage.remove(`${PREFIX}PHONE`)
};
