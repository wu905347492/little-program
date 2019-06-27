import storageManage from '../../utils/storage-manage'

Page({
  $route: 'pages/home/home',
  /**
   * 页面的初始数据
   */
  data: {
    visible: false,
    actions: [{
      name: '选项1'
    },
    {
      name: '客服',
      openType: 'contact'
    }
    ],
    swiper_current: 0,
    sub_swiper_current: 0,
    // 产品详细
    shoes_info: null,
    // 鞋子列表
    shoesList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    wx.hideTabBar && wx.hideTabBar()
    this.$showLoading()

    setTimeout(() => {
      this.$hideLoading()
    }, 1000);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      swiper_current: 0
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },
  // 轮播图切换
  swiperChangeEventer: function (event) {
    let current = event.detail.current
    console.log(current);
    this.setData({
      swiper_current: current
    })
  },
  // 轮播图动画完成方法
  swiperAnimationEventer: function (event) {
    let current = event.detail.current
    console.log(current);
  },
  sendContact: async function () {
    const openId = await storageManage.getOpenId()
    wx.getUserInfo({
      success: (data) => {
        let openIdStr = this.base64Encode(openId); // 此处填写用户的 OPEN ID
        // 调用后端 API
        console.log('-----')
        wx.request({
          url: 'https://api.guestops.com/connect-api/weChatCallback/getMPUserInfo.action',
          data: {
            appId: wx.getAccountInfoSync().miniProgram.appId,
            userInfo: data.userInfo,
            openId: openIdStr
          },
          success: function (res) {
            console.log(res);
            console.log('-----')
          }
        })
      }
    })
  },
  /* eslint-disable */
  base64Encode(str) {
    var c1, c2, c3;
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 + /";
    var i = 0,
      len = str.length,
      string = "";

    while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff;
      if (i == len) {
        string += base64EncodeChars.charAt(c1 >> 2);
        string += base64EncodeChars.charAt((c1 & 0x3) << 4);
        string += "==";
        break;
      }
      c2 = str.charCodeAt(i++);
      if (i == len) {
        string += base64EncodeChars.charAt(c1 >> 2);
        string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        string += base64EncodeChars.charAt((c2 & 0xF) << 2);
        string += "=";
        break;
      }
      c3 = str.charCodeAt(i++);
      string += base64EncodeChars.charAt(c1 >> 2);
      string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      string += base64EncodeChars.charAt(c3 & 0x3F)
    }
    return string
  },
});
