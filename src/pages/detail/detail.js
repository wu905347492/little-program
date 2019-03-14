import api from '../../api/index.js'

const fetch = async (options) => {
  try {
    return await api.getProductDetail({
      id: options.id
    });
  } catch (err) {
    return [];
  }
};
let specId
let productId
let color
let size

Page({
  $route: 'detail/detail',
  /**
   * 页面的初始数据
   */
  data: {

    current: 0,

    images: [],

    // 选中的尺码颜色
    size: '',
    color: '',

    // 客服相关
    contact: {
      showCard: true
    },

    variationProducts: [],
    relatedProducts: [],

    detail: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onPreLoad: fetch,
  async onLoad(options) {
    const res = await this.$getPreload(fetch, options);
    if (res.resultCode == 1) {
      const detail = res.data[0]
      const variationProducts = detail.variationProducts
      const relatedProducts = detail.relatedProducts

      productId = detail.productId

      this.setData({
        variationProducts,
        relatedProducts,
        detail
      })
    }
  },
  onReady() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  // 切换轮播
  changeEventer(event) {
    if (event.detail.source == 'touch') {
      this.setData({
        current: event.detail.current
      })
    }
  },

  // 选择SKU
  skuEmitEventer(event) {
    color = event.detail.color
    size = event.detail.size
    specId = event.detail.specId
    if (color.images) {
      this.setData({
        images: color.images
      })
    }
  },

  // 预览图片
  previewEmitEventer() {
    let images = this.data.images
    images = images.map(item => item.sourceUrl)
    wx.previewImage({
      current: images[this.data.current],
      urls: images
    })
  },

  // 跳转首页&购物车
  navigateEmitEventer(event) {
    this.$switchTab(event.currentTarget.dataset.path)
  },

  // 加入购物车
  async cartEmitEventer() {
    if (!specId) {
      this.$showToast('请选择 颜色 尺码')
      return
    }

    const result = await api.addCart({
      productSpecId: specId,
      productId,
      quantity: 1
    })
    if (result.resultCode == 1) {
      this.$showToast('添加成功')
    }
    if (result.resultCode == 8001) {
      this.$showToast('商品已售罄')
    }
  },

  // 立即购买
  buyEmitEventer() {
    if (!specId) {
      this.$showToast('请选择 颜色 尺码')
      return
    }

    // 缓存结算参数
    const detail = this.data.detail
    const productName = detail.productName // product name
    const mainImageUrl = this.data.images[0].url // product image
    const marketPrice = detail.marketPrice // product price
    const sku = detail.sku // product sku
    const quantity = 1 // product quantity

    productId = detail.productId // product productId

    getApp().data.checkoutParams = [{
      productName,
      mainImageUrl,
      marketPrice,
      sku,
      quantity,
      productId,
      productSpecId: specId,
      color: color.name,
      size: size.name
    }]

    this.$routeTo('checkout/checkout?type=0')
  },

  onShareAppMessage() {

  }
})
