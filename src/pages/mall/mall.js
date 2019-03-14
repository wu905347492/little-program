import pages from '../../mixins/pages.js'
import api from '../../api/index.js'


const fetch = async () => {
  try {
    return await api.getProductList({
      data: {
        isWishFirst: 0
      }
    });
  } catch (err) {
    return [];
  }
};

Page({
  $route: 'pages/mall/mall',
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    fields: [{
      title: '颜色',
      list: [{
        text: '红色'
      }, {
        text: '白色'
      }, {
        text: '蓝色'
      }]
    }, {
      title: '尺码',
      list: [{
        text: '35'
      }, {
        text: '36'
      }, {
        text: '37'
      }, {
        text: '38'
      }, {
        text: '39'
      }]
    }],
    curser: {
      text: '第一系列'
    },
    series: [{
      text: '第一系列'
    }, {
      text: '第二系列'
    }, {
      text: '第三系列'
    }]

  },
  mixins: [pages],
  /**
   * 生命周期函数--监听页面加载
   */
  onPreLoad: fetch,
  onLoad() {

  },

  fieldsChangeEventer(event) {
    const {
      mode,
      direction,
      terms
    } = event.detail
    console.log('排序方式:', mode)
    console.log('正序逆序:', direction)
    console.log('筛选关键词:', terms)
  },

  seriesChangeEventer(event) {
    const {
      curser
    } = event.detail
    console.log('选择系列:', curser)
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

  }
})
