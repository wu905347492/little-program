const FIELD = '../field/index'
const CHECKBOXGROUP = '../checkbox-group/index'

Component({
  behaviors: ['wx://form-field'],
  relations: {
    [FIELD]: {
      type: 'parent'
    },
    [CHECKBOXGROUP]: {
      type: 'parent'
    }
  },
  properties: {
    type: {
      type: String
    },
    checked: {
      type: Boolean,
      value: false,
      observer: 'fieldChangeEventer'
    },
    value: null,
    disabled: {
      type: Boolean,
      value: false
    },
    reverse: {
      type: Boolean,
      value: false
    },
    label: String,
    showIcon: {
      type: Boolean,
      value: true
    }
  },
  data: {},
  attached() {
    const { checked, value } = this.data
    if (value == null) {
      this.setData({
        value: checked
      })
    }
  },
  methods: {
    changeEventer(checked) {
      this.setData({ checked })
    },
    checkedEventer() {
      if (this.data.disabled) return
      let { value, checked } = this.data
      const parent = this.getRelationNodes(CHECKBOXGROUP)[0]
      checked = !checked
      if (parent) {
        parent.emitEvent({ value, checked })
      }
      if (!parent) {
        this.triggerEvent('emitevent', { value, checked })
        this.setData({ value: checked })
      }
    },
    fieldChangeEventer() {
      const parent = this.getRelationNodes(FIELD)[0]
      parent && parent.hideErr()
    }
  }
})
