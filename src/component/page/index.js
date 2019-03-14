export default Component({
  options: {
    multipleSlots: true
  },
  properties: {
    isTabbar: {
      type: Boolean,
      value: false
    },
    show: {
      type: Boolean,
      value: false,
      observer(value) {
        value ? this.show() : this.hide()
      }
    }
  },
  data: {
    // 页面底部间距
    pageBottom: 0,
    // 固定底部间距
    fixedBottom: 0,

    show: false
  },
  attached() {
    const { isTabbar, $isIpx } = this.data
    let pageBottom = 0;
    let fixedBottom = 0
    if ($isIpx) {
      pageBottom = fixedBottom += 20
    }
    if (isTabbar) {
      pageBottom += 100
    }
    this.setData({ fixedBottom, pageBottom })
  },
  methods: {
    show () {
      this.setData({
        show: true
      })
    },
    hide () {
      this.setData({
        show: false
      })
    }
  }
});
