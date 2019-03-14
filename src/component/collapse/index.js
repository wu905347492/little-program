import util from '../../utils/utils.js'

let _timer
export default Component({
  behaviors: [],
  options: {
    multipleSlots: true
  },
  properties: {
    status: {
      type: Boolean,
      value: false,
      observer(value) {
        if (value) {
          this.scrollTop()
        }
      }
    },
    scroll: {
      type: Boolean,
      value: true
    },
    top: {
      type: Number,
      value: 0
    }
  },
  data: {
    id: util.randomId()
  },
  methods: {
    toggleEventer() {
      const status = this.data.status

      this.setData({ status: !status })
    },
    scrollTop() {
      const scroll = this.data.scroll

      if (!scroll) return

      if (_timer) {
        clearTimeout(_timer)
      }
      // &存在渲染延迟
      _timer = setTimeout(() => {
        wx.createSelectorQuery().in(this)
          .select(`#collapse-title-${this.data.id}`)
          .boundingClientRect()
          .selectViewport()
          .scrollOffset()
          .exec((res) => {
            wx.pageScrollTo({
              scrollTop: res[0].top + res[1].scrollTop - this.data.top
            })
          })
      }, 50)
    }
  }
});
