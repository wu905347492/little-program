export default Component({
  properties: {
    series: Array,
    fields: Array,
    curser: Object,
    /*
     * popup distance
     */
    distance: {
      type: Number,
      value: 80
    }
  },
  data: {
    /*
     * 1 默认排序
     *·2 新品排序
     *·3 价格排序
     *·4 打开筛选
     */
    mode: 1,
    /*
     * true 升序
     *·false 降序
     */
    direction: true,
    /*
     * 筛选词
     */
    terms: [],
    /*
     * 0 关闭弹窗
     *·1 打开筛选弹唱
     *·2 打开系列弹唱
     */
    status: 0


  },
  attached() {
    // &存在渲染延迟
  },
  methods: {
    fieldsEventer() {
      let { direction, terms } = this.data
      const { mode } = event.currentTarget.dataset

      if (mode == 4) {
        this.setData({
          status: 2
        })
      }

      if (mode == 3) {
        direction = !direction
        this.setData({
          direction
        })
      }

      if (mode == 1 || mode == 2 || mode == 3) {
        this.setData({
          mode
        })

        this.triggerEvent('changeFields', { direction, mode, terms })
      }
    },
    checkedEventer(event) {
      let { value } = event.currentTarget.dataset
      let { direction, mode, fields } = this.data
      let terms = []
      fields.forEach(item => {
        item.list.forEach(subItem => {
          if (subItem.text == value.text) {
            subItem.active = !subItem.active
          }
          if (subItem.active) {
            terms.push(subItem.text)
          }
        })
      })

      this.setData({ fields, terms })

      this.triggerEvent('changeFields', { direction, mode, terms })
    },
    resetEventer() {
      let { direction, mode, fields } = this.data
      let terms = []
      fields.forEach(item => {
        item.list.forEach(subItem => {
          subItem.active = false
        })
      })
      this.setData({ fields, terms })

      this.triggerEvent('changeFields', { direction, mode, terms })
    },
    confirmEventer() {
      this.setData({ status: 0 })
    },

    seriesEventer() {
      this.setData({
        status: 1
      })
    },
    selectEventer(event) {
      const { curser } = event.currentTarget.dataset
      this.setData({
        status: 0
      })
      this.triggerEvent('changeSeries', { curser })
    }
  }
});
