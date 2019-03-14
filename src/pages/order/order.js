import api from '../../api/index.js'

const fetch = async () => {
  try {
    return await api.getOrderList()
  } catch (err) {
    return [];
  }
};

// 订单状态
const statusList = [{
  title: '待付款',
  status: 0
}, {
  title: '已确认',
  status: 1
}, {
  title: '已取消',
  status: 4
}]


Page({
  $route: 'pages/home/home',

  /**
   * 页面的初始数据
   */
  data: {
    statusList,

    list: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onPreLoad: fetch,
  async fetchData() {
    this.$showLoading()
    const res = await this.$getPreload(fetch, {});
    if (res.resultCode === '1') {
      let list = res.data

      list.forEach((item) => {
        // 展开状态
        item.active = false
        // 下单时间处理
        item.createAt = item.createAt.split('.')[0]
        // 商品主图
        item.listOrderProduct.forEach(item => {
          const { listProductImage } = item.productResult
          console.log('listProductImage===', listProductImage)
          if (listProductImage) {
            let imageData = listProductImage.find(item => item.type === 0)
            if (imageData) {
              item.image = imageData.sourceUrl
            }
          }
        })
        console.log('item===', item)
      })

      this.setData({ list })
      this.$hideLoading()
    }
  },
  onLoad: function() {
    this.fetchData()
  },
  async payEventer(event) {
    this.$showLoading({
      text: '正在支付...'
    })
    console.log(event)

    const { orderNo, image } = event.currentTarget.dataset

    const res = await api.payment({orderNo, payCode: 'WECHAT_PAY'})

    if (res.resultCode == 1) {
      const options = res.data.wechatPay
      this.wechatPayment(options)
    } else if (res.resultCode == 8001) {
      console.log('已售罄')
    } else if (res.resultCode == 8005) {
      console.log('支付超时')
    } else {
      console.log('支付失败')
    }

    this.$hideLoading()
  },

  wechatPayment(options) {
    wx.requestPayment({
      ...options,
      success: (res) => {
        if (res.errMsg == 'requestPayment:ok') {
          console.log('支付成功')
        }
        if (res.errMsg != 'requestPayment:ok') {
          console.log('支付失败')
        }
      },
      fail: (err) => {
        console.log('支付失败')
      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  }
})
