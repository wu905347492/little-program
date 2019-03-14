
import {
  tokenManage
} from './utils/index';

App({
  onLaunch() {

  },
  onShow() {
    // session验证
    wx.checkSession({
      success: function() {
        console.log('session_key: 有效')
      },
      fail: function() {
        console.log('session_key: 失效')
        if (wx.getStorageSync('token')) {
          tokenManage.get()
        }
      }
    })
  },
  data: {
    checkoutParams: []
  }
});
