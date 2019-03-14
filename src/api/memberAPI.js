import request from '../utils/request';

// 获取用户手机号
const getPhoneNumber = async (params = {}) => request.post({
  data: params,
  url: '/estore/member/decodePhone'
});

// 获取验证码
const getVerifyCode = async (params = {}) => request.get({
  url: `/estore/member/sendMessage/${params.mobile}`
});

const checkVerifyCode = async (params = {}) => request.get({
  data: params,
  url: '/estore/member/checkVerifyCode'
});

const updateUserInfo = async (params = {}) => request.get({
  data: params,
  url: '/estore/member/update'
});


export default {
  getPhoneNumber,
  getVerifyCode,
  checkVerifyCode,
  updateUserInfo
}
