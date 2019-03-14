const RADIOGROUP = '../radio-group/index'

Component({
  relations: {
    [RADIOGROUP]: {
      type: 'parent'
    }
  },
  properties: {
    type: {
      type: String
    },
    value: null,
    checked: {
      type: Boolean,
      value: false
    },
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
  methods: {
    changeEventer(checked) {
      this.setData({ checked })
    },
    checkedEventer() {
      if (this.data.disabled) return
      let { value, checked } = this.data
      const parent = this.getRelationNodes(RADIOGROUP)[0]
      checked = !checked
      parent ? parent.emitEvent({ value, checked }) : this.triggerEvent('emitevent', { value, checked })
    }
  }
})
