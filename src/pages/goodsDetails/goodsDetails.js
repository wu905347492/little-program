// let originImages
Page({
  $route: 'pages/user/user',
  /**
   * 页面的初始数据
   */
  data: {
    details: {
      productId: 32,
      description: '黑色高跟鞋',
      productName: 'LUMINA(PEARLS)',
      productCode: '19R3712CH472R',
      salePrice: 6580.00,
      stock: 200,
      extAttrArr: {
        详情: {
          title: '详情',
          sort: 1,
          value: '雾霾蓝色系拼色\n100% 小牛皮革\n附品牌标志\n内附Limited Edition标识及限量编号\n内部口袋\n含维护及保养说明\n含品牌防尘袋\n含特别合作包装盒'
        },
        尺寸说明: {
          title: '尺寸说明',
          sort: 2,
          value: '高度40.9cm\n宽度31.9cm'
        }
      },
      createAt: '2019-02-19T06:56:42.000+0000',
      modifyAt: '2019-02-19T06:56:42.000+0000',
      status: 1,
      wechatId: 40,
      saleId: 32,
      onSale: 1,
      deliveryFree: 1,
      sizes: [{
        size: '30.5',
        stock: 10
      }, {
        size: '40',
        stock: 10
      }, {
        size: '50.5',
        stock: 10
      }, {
        size: '60.5',
        stock: 0
      }, {
        size: '60',
        stock: 10
      }, {
        size: '60',
        stock: 0
      }, {
        size: '60.5',
        stock: 10
      }, {
        size: '60',
        stock: 0
      }, {
        size: '60',
        stock: 0
      }, {
        size: '60',
        stock: 0
      }],
      sku: '19R3712CH472R',
      specId: '32',
      specType: 1,
      currency: 'RMB',
      specMeta: {
        宽度: '31.9cm',
        高度: '40.9cm'
      },
      images: [{
        id: 194,
        type: 3,
        seq: 0,
        productId: 32,
        materialId: 67,
        wechatId: 40,
        title: 'detailpicture1.jpg',
        url: 'https://cdn.estore.d1miao.com/mrbao/static/null//small/20190214170925detailpicture1.jpg?1550135366101',
        sourceUrl: 'https://cdn.estore.d1miao.com/mrbao/static/null//large/20190214170925detailpicture1.jpg?1550135366101',
        new: false
      }, {
        id: 195,
        type: 3,
        seq: 1,
        productId: 32,
        materialId: 68,
        wechatId: 40,
        title: 'detailpicture2.jpg',
        url: 'https://cdn.estore.d1miao.com/mrbao/static/null//small/20190214170925detailpicture2.jpg?1550135366102',
        sourceUrl: 'https://cdn.estore.d1miao.com/mrbao/static/null//large/20190214170925detailpicture2.jpg?1550135366102',
        new: false
      }],
      quantity: 1
    },
    swiperCurrent: {
      explore: 0,
      preview: 0
    },
    originImages: [],
    exploreArr: [
      {
        a: {url: 'https://cdn.estore.d1miao.com/mrbao/static/null//small/20190214170925detailpicture2.jpg?1550135366102'},
        b: {url: 'https://cdn.estore.d1miao.com/mrbao/static/null//small/20190214170925detailpicture2.jpg?1550135366102'}
      },
      {
        a: {url: 'https://cdn.estore.d1miao.com/mrbao/static/null//small/20190214170925detailpicture2.jpg?1550135366102'},
        b: {url: 'https://cdn.estore.d1miao.com/mrbao/static/null//small/20190214170925detailpicture2.jpg?1550135366102'}
      }
    ],
    sizeSelect: {
      index: 1000,
      text: '',
      product: {}
    },
    canBuy: {
      message: '请选择商品规格',
      isTrue: false
    }
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

    this.setData({
      originImages: this.data.details.images.filter(item => item.type == '3')
    })

    console.log(this.data.exploreArr);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

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
  swiperAction: function (e) {
    let current = e.detail.current
    let type = e.currentTarget.dataset.type;
    if (type === 'explore') {
      this.setData({
        'swiperCurrent.explore': current
      })
    } else {
      this.setData({
        'swiperCurrent.preview': current
      })
    }
  },
  previewAction: function (params) {
    wx.previewImage({
      current: this.data.originImages[this.data.current],
      urls: this.data.originImages
    })
  },
  selectSizeAction: function (e) {
    let index = e.currentTarget.dataset.index;
    let item = this.data.details.sizes[index];
    console.log(item);
    // console.log(index, item, this.data.sizes)
    console.log(e);
    this.setData({
      'canBuy.isTrue': true,
      'sizeSelect.index': index,
      'sizeSelect.text': item.size
      // 'sizeSelect.product': item.product,
      //   'details.productCode': item.sku
    }) // 选择处理
  }
});
