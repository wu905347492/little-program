const FIELD = '../field/index'
const RADIO = '../radio/index'

Component({
  behaviors: ['wx://form-field'],
  relations: {
    [RADIO]: {
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
      type: String,
      value: '',
      observer: 'changeEventer'
    }
  },
  data: {},
  methods: {
    changeEventer(value = this.data.value) {
      let list = this.getRelationNodes(RADIO)
      if (list.length > 0) {
        list.forEach(item => {
          item.changeEventer(value == item.data.value)
        })
      }

      this.fieldChangeEventer()
    },
    emitEvent(option) {
      this.triggerEvent('emitevent', option);
    },
    fieldChangeEventer() {
      const parent = this.getRelationNodes(FIELD)[0]
      parent && parent.hideErr()
    }
  }
})
