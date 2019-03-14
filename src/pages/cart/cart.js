import api from '../../api/index.js'

const fetch = async () => {
  try {
    return await api.getCartList()
  } catch (err) {
    return [];
  }
};

Page({
  $route: 'cart/cart',
  /**
   * 页面的初始数据
   */
  data: {
    list: [],

    checkedAll: true,

    totalAmount: 0,

    totalCount: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onPreLoad: fetch,
  async fetchData() {
    this.$showLoading()
    const result = await this.$getPreload(fetch, {});
    if (result.resultCode == 1) {
      let list = result.data
      list.forEach((item) => {
        item.disabled = item.stock <= 0
        item.status = true
      })
      // 判断是否全选
      this.checkCheckedListEventer(list)
      this.setData({
        list
      })
      wx.stopPullDownRefresh()
      this.$hideLoading()
    }
  },
  async onLoad() {
    wx.hideTabBar && wx.hideTabBar()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.fetchData()
  },
  // 单选
  checkedEmitEventer(event) {
    const index = event.currentTarget.dataset.index
    const checked = event.detail.checked
    const list = this.data.list

    // 更新选中状态
    list[index].status = checked

    // 判断是否全选
    this.checkCheckedListEventer(list)

    this.setData({
      list
    })
  },

  // 全选
  checkedEmitAllEventer(event) {
    let checkedAll = event.detail.checked
    let list = this.data.list
    list = list.map(item => Object.assign(item, {
      status: event.detail.checked
    }))

    // 计算总价总数
    this.calculateEventer(list)

    this.setData({
      checkedAll,
      list
    })
  },

  // 判断是否全选
  checkCheckedListEventer(list) {
    this.setData({
      checkedAll: list.every(item => item.status)
    })
    // 计算总价
    this.calculateEventer(list)
  },

  // 计算总价总数
  calculateEventer(list) {
    let totalAmount = 0
    let totalCount = 0
    list.forEach(item => {
      if (item.status && !item.disabled) {
        totalAmount += item.salesPrice * item.quantity
        totalCount += item.quantity
      }
    })

    let oldval = this.data.totalAmount
    let newval = totalAmount
    if (this._timer) clearInterval(this._timer)
    this._timer = setInterval(() => {
      oldval += (newval - oldval) / 2
      this.setData({
        totalAmount: parseInt(oldval)
      })
      if (Math.abs(newval - oldval) < 1) {
        this.setData({
          totalAmount
        })
        clearInterval(this._timer)
      }
    }, 50)
    this.setData({
      totalCount
    })
  },
  // 更新购物车
  async updateEmitEventer(event) {
    const quantity = event.detail
    const {
      id,
      index
    } = event.currentTarget.dataset
    const list = this.data.list
    const result = await api.updateCart({
      id,
      quantity
    })
    if (result.resultCode == 1) {
      // 更新购物车列表
      list[index].quantity = quantity
      // 计算总价总数
      this.calculateEventer(list)
      this.setData({
        list
      })
    } else if (result.resultCode == 8001) {
      this.$showToast('商品库存不足')
    } else {
      this.$showToast('修改失败')
    }
  },

  // 删除购物车
  async deleteEventer(event) {
    const {
      id
    } = event.currentTarget.dataset
    let list = this.data.list
    const result = await api.delCart({
      id
    })
    if (result.resultCode == 1) {
      list = list.filter(item => item.id != id)
      // 判断是否全选
      this.checkCheckedListEventer(list)
      // 更新购物车列表
      this.setData({
        list
      })
    }
    if (result.resultCode != 1) {
      this.$showToast('删除失败')
    }
  },

  // 结算
  checkoutEmitEventer() {
    let list = this.data.list
    // 过滤勾选
    list = list.filter(item => item.status && !item.disabled)

    list = list.map(item => {
      const productName = item.productName // product name
      const mainImageUrl = item.mainImageUrl // product image
      const marketPrice = item.marketPrice // product price
      const sku = item.sku // product sku
      const productSpecId = item.specId // product specId
      const id = item.id // cart id
      const quantity = item.quantity // product quantity
      const productId = item.productId // product productId

      let specValue = {}

      try {
        specValue = JSON.parse(item.specValue)
      } catch (err) {
        throw new Error('Json Parse Error')
      }

      const color = specValue['颜色']
      const size = specValue['尺码']

      return {
        productName,
        mainImageUrl,
        marketPrice,
        sku,
        productSpecId,
        id,
        quantity,
        productId,
        color,
        size
      }
    })
    getApp().data.checkoutParams = list
    this.$navigateTo('checkout/checkout?type=1')
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
  // 下拉刷新数据
  onPullDownRefresh() {
    this.fetchData()
  }
})
