export default Component({
  properties: {
    stepper: {
      type: Number
    },
    min: {
      type: Number,
      value: 1
    },
    max: {
      type: Number
    },
    type: {
      type: String,
      value: 'small'
    }
  },
  data: {},
  methods: {
    changeEventer(event, type) {
      const { dataset = {} } = event.currentTarget
      const { disabled } = dataset
      const { min, max } = this.data
      let { stepper } = this.data

      if (disabled) return

      if (type === 'minus') {
        stepper -= 1
      }
      if (type === 'plus') {
        stepper += 1
      }

      if (stepper < min || stepper > max) return null

      this.triggerEvent('emitevent', stepper)
    },

    minusEventer(event) {
      this.changeEventer(event, 'minus')
    },

    plusEventer(event) {
      this.changeEventer(event, 'plus')
    },

    blurEventer(event) {
      let { value } = event.detail
      const { min, max } = this.data

      if (!value) {
        setTimeout(() => {
          this.triggerEvent('emitevent', min)
        }, 50)
        return
      }

      value = +value
      if (value > max) {
        value = max
      } else if (value < min) {
        value = min
      }

      this.triggerEvent('emitevent', value)
    }
  }
})
