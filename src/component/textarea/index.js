import util from '../../utils/utils.js'

const FIELD = '../field/index'

export default Component({
  behaviors: ['wx://form-field'],
  relations: {
    [FIELD]: {
      type: 'parent'
    }
  },
  properties: {
    value: {
      type: String,
      value: '',
      observer: 'fieldChangeEventer'
    },
    disabled: Boolean,
    focus: Boolean,
    maxlength: {
      type: Number,
      value: 255
    },
    placeholder: String
  },
  data: {
    // textarea placeholder 显示
    isPlaceholder: true,
    // textarea 显示
    visible: true,
    // textarea 焦点获取
    focus: false,

    // 手机系统
    platform: util.getPlatform()
  },
  methods: {
    chageEventer({ detail = {} } = {}) {
      const { value = '' } = detail
      this.setData({ value })

      this.triggerEvent('change', detail)
    },
    focusEventer({ detail = {} } = {}) {
      this.triggerEvent('focus', detail)
      this.setData({
        isPlaceholder: false
      })
    },
    blurEventer({ detail = {} } = {}) {
      const { value = '' } = detail
      const isPlaceholder = value.length == 0

      this.setData({
        visible: true,
        isPlaceholder
      })

      this.triggerEvent('blur', detail)
    },
    tapEventer() {
      this.setData({
        visible: false
      })

      setTimeout(() => {
        this.setData({
          focus: true
        })
      }, 50)
    },
    fieldChangeEventer() {
      const parent = this.getRelationNodes(FIELD)[0]
      parent && parent.hideErr()
    }
  }
})
