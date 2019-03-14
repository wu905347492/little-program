const INPUT = '../input/index'
const PICKER = '../picker/index'
const CHECKBOX = '../checkbox/index'
const TEXTAREA = '../textarea/index'
const CHECKBOXGROUP = '../checkbox-group/index'
const RADIOGROUP = '../radio-group/index'
const FIELDGROUP = '../field-group/index'

export default Component({
  relations: {
    [FIELDGROUP]: {
      type: 'parent'
    },
    [INPUT]: {
      type: 'child'
    },
    [PICKER]: {
      type: 'child'
    },
    [CHECKBOX]: {
      type: 'child'
    },
    [TEXTAREA]: {
      type: 'child'
    },
    [CHECKBOXGROUP]: {
      type: 'child'
    },
    [RADIOGROUP]: {
      type: 'child'
    }
  },
  properties: {
    label: String,
    prop: String
  },
  data: {
    status: false,
    message: ''
  },
  methods: {
    showErr(message) {
      this.setData({
        status: true,
        message
      })
    },
    hideErr() {
      this.setData({ status: false })
    }
  }
})
