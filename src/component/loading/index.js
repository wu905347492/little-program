import behavior from '../behavior.js'

export default Component({
  behaviors: [behavior],
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer(value) {
        value ? this.show() : this.hide()
      }
    },
    text: {
      type: String,
      value: '',
      observer(value) {
        this.setMessage(value)
      }
    },
    isShowNavLoading: {
      type: Boolean,
      value: false
    },
    type: {
      type: String,
      value: 'spinner'
    },
    color: {
      type: String,
      value: 'black'
    },
    styleType: {
      type: String,
      value: 'block'
    },
    zIndex: {
      type: Number,
      value: 1001
    }
  },
  data: {
    message: '正在加载...'
  },
  methods: {
    setMessage (value) {
      this.setData({
        message: value
      })
    },
    show() {
      if (this.data.isShowNavLoading) wx.showNavigationBarLoading()
      this.setVisible()
    },
    hide() {
      if (this.data.isShowNavLoading) wx.hideNavigationBarLoading()
      this.setHidden()
    }
  }
})
