import api from '../../../api/index.js'

export default Component({
  properties: {
    productId: {
      type: String
    },
    isFav: {
      type: Boolean
    }
  },
  data: {},
  methods: {
    addFavEventer() {
      api.addFav({
        type: 'POST',
        options: {
          productId: this.data.productId
        }
      }).then(res => {
        if (res.resultCode == 1) {
          wx.showToast({
            title: '收藏成功',
            icon: 'none',
            duration: 1000
          })
          this.setData({
            isFav: true
          })
        }
      })
    },
    delFavEventer() {
      api.delFav({
        query: this.data.productId
      }).then(res => {
        if (res.resultCode == 1) {
          wx.showToast({
            title: '取消成功',
            icon: 'none',
            duration: 1000
          })
          this.setData({
            isFav: false
          })
        }
      })
    }
  }
});
