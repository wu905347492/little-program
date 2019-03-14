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
    type: {
      type: String,
      value: 'text'
    },
    disabled: Boolean,
    focus: Boolean,
    maxlength: {
      type: Number,
      value: 140
    },
    placeholder: String
  },
  methods: {
    chageEventer({ detail = {} } = {}) {
      const { value = '' } = detail

      this.setData({ value })

      this.triggerEvent('change', detail)
    },
    focusEventer({ detail = {} } = {}) {
      this.triggerEvent('focus', detail)
    },
    blurEventer({ detail = {} } = {}) {
      this.triggerEvent('blur', detail)
    },
    fieldChangeEventer() {
      const parent = this.getRelationNodes(FIELD)[0]
      parent && parent.hideErr()
    }
  }
})
