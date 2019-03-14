const FIELD = '../field/index'
const CHECKBOX = '../checkbox/index'

Component({
  behaviors: ['wx://form-field'],
  relations: {
    [CHECKBOX]: {
      type: 'child',
      linked() {
        this.changeEventer();
      },
      linkChanged() {
        this.changeEventer();
      },
      unlinked() {
        this.changeEventer();
      }
    },
    [FIELD]: {
      type: 'parent'
    }
  },
  properties: {
    value: {
      type: Array,
      value: [],
      observer: 'changeEventer'
    }
  },
  data: {},
  methods: {
    changeEventer(value = this.data.value) {
      let checkboxList = this.getRelationNodes(CHECKBOX)
      if (checkboxList.length > 0) {
        checkboxList.forEach(item => {
          item.changeEventer(value.indexOf(item.data.value) != -1)
        })
      }

      this.fieldChangeEventer()
    },
    emitEvent(option) {
      let checkboxList = this.getRelationNodes(CHECKBOX)
      let terms = []
      checkboxList.forEach(item => {
        let { value, checked, label } = item.data
        if (value == option.value) {
          checked = option.checked
        }
        if (checked) {
          terms.push({ value, label })
        }
      })

      this.triggerEvent('emitevent', terms);
    },
    fieldChangeEventer() {
      const parent = this.getRelationNodes(FIELD)[0]
      parent && parent.hideErr()
    }
  }
})
