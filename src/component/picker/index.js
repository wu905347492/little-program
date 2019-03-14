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
      type: null,
      value: '',
      observer: 'fieldChangeEventer'
    },
    mode: {
      type: String,
      value: 'region'
    },
    disabled: {
      type: Boolean,
      value: false
    },
    key: String,
    range: Array,
    placeholder: String
  },
  attached() {
    const { mode } = this.data
    if (mode == 'region') {
      this.setData({
        value: []
      })
    }
  },
  methods: {
    bindchange({ detail = {} } = {}) {
      const { value = '' } = detail

      console.log(value)

      this.setData({ value })
      this.triggerEvent('change', detail)
    },
    bindcancel({ detail = {} } = {}) {
      this.triggerEvent('cancel', detail)
    },
    fieldChangeEventer() {
      const parent = this.getRelationNodes(FIELD)[0]
      parent && parent.hideErr()
    }
  }
})
