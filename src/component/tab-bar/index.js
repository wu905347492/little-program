import tabs from './config.js';

export default Component({
  behaviors: [],
  properties: {
    show: {
      type: Boolean,
      value: !0
    },
    showIcon: {
      type: Boolean,
      value: !0
    },
    showText: {
      type: Boolean,
      value: !0
    }
  },
  data: {
    list: []
  },
  lifetimes: {
    attached() {},
    moved() {},
    detached() {}
  },
  pageLifetimes: {
    show() {
      const routes = getCurrentPages()
      const path = routes[routes.length - 1].route
      const list = tabs.map(item => Object.assign(item, {
        active: path == item.pagePath
      }))
      this.setData({
        list
      })
    },
    hide() {},
    resize() {}
  },
  methods: {
    handleClickItem(e) {
      let index = e.detail.index
      if (index == 0) {
        wx.makePhoneCall({
          phoneNumber: '400-6588-555'
        })
      }
    },
    handleCancel(e) {
      console.log(e);
      this.setData({
        visible: false
      })
    },
    switchTab: function (event) {
      let url = event.currentTarget.dataset.url
      if (url) {
        let name = url.split('/')[2]
        if (name == 'home') {
          wx.setStorageSync('swiper_current', '0')
        }
        let routes = getCurrentPages()
        let _url = routes[routes.length - 1].route
        if (url != _url) {
          wx.switchTab({
            url: `/${url}`
          })
        }
      } else {
        const slef = this
        // const userInfo = wx.getStorageSync('userInfo')
        const actions = [{
          name: '400-6588-555（每天：10:00-20:00）'
        }, {
          name: '在线客服（每天：10:00-19:00）',
          openType: 'contact'
        }]

        slef.setData({
          actions,
          // userInfo,
          visible: true
        })
      }
    }
  }
})
