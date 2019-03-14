let varPros

export default Component({
  properties: {
    value: {
      type: Array,
      value: []
    }
  },
  data: {
    //  颜色尺码选中
    size: {},
    color: {},

    // 颜色尺码列表
    sizes: [],
    colors: []
  },
  attached() {
    this.initData()
  },
  methods: {

    // 初始化数据
    initData() {
      varPros = this.data.value
      if (varPros.length > 0) {
        varPros = varPros.map((item) => Object.assign(item, {
          specValue: {
            color: item.specValue['颜色'],
            size: item.specValue['尺码']
          }
        }))

        const _colors = varPros.map(item => item.specValue.color).filter(item => !!item)
        const _sizes = varPros.map(item => item.specValue.size).filter(item => !!item)
        let colors = Array.from(new Set(_colors))
        let sizes = Array.from(new Set(_sizes))

        const varPro = varPros[0]

        // 尺码颜色列表
        sizes = sizes.sort().map(item => {
          let images = []
          let list = []
          varPros.forEach((subItem) => {
            if (subItem.specValue.size == item) {
              list.push(subItem.specValue.color)
              if (images.length == 0) {
                images = subItem.images
              }
            }
          })
          return { name: item, images, list }
        })
        colors = colors.map(item => {
          let images = []
          let list = []
          varPros.forEach((subItem) => {
            if (subItem.specValue.color == item) {
              list.push(subItem.specValue.size)
              if (images.length == 0) {
                images = subItem.images
              }
            }
          })
          return { name: item, images, list }
        })

        // 默认选中尺码颜色
        const color = colors.find(item => item.name == varPro.specValue.color)
        const size = sizes.find(item => item.name == varPro.specValue.size)


        // 对尺码颜色列表进行可选判断
        this.processEventer(color, size, colors, sizes)
      }
    },
    processEventer(color = {}, size = {}, colors, sizes) {
      colors = colors.map(item => {
        return Object.assign(item, {
          disabled: size.list ? size.list.indexOf(item.name) < 0 : false
        })
      })
      sizes = sizes.map(item => {
        return Object.assign(item, {
          disabled: color.list ? color.list.indexOf(item.name) < 0 : false
        })
      })

      this.setData({ color, size, colors, sizes })

      let specId

      if (color && size) {
        varPros.forEach((item) => {
          if (item.specValue.color == color.name && item.specValue.size == size.name
          ) {
            specId = item.specId
          }
        })
      }
      // sku only size
      if (colors.length == 0) {
        varPros.forEach((item) => {
          if (item.specValue.size == size.name) {
            specId = item.specId
          }
        })
      }

      // sku only color
      if (sizes.length == 0) {
        varPros.forEach((item) => {
          if (item.specValue.color == color.name) {
            specId = item.specId
          }
        })
      }


      this.triggerEvent('emiteventer', { color, size, specId })
    },
    selectEventer(event) {
      const { value, type } = event.currentTarget.dataset
      // disabled
      if (value.disabled) return
      const params = this.data
      params[type] = params[type].name == value.name ? {} : value
      const { color, size, colors, sizes } = params
      this.processEventer(color, size, colors, sizes)
    }
  }
});
