import behavior from '../behavior.js'

export default Component({
  behaviors: [behavior],
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer(value) {
        value ? this.show() : this.hide()
      }
    },
    backdrop: {
      type: Boolean,
      value: true
    },
    closeOnClickBackdrop: {
      type: Boolean,
      value: true
    },
    type: {
      type: String,
      // left right top bottom center
      value: 'bottom'
    },
    animation: {
      type: String,
      // fade slideDown slideUp slideLeft slideRight
      value: 'slideDown'
    },
    zIndex: {
      type: Number,
      value: 1001
    },
    distance: {
      type: Number,
      value: 0
    }
  },
  data: {},
  methods: {
    show() {
      this.setVisible([`animate__${this.data.animation}_in`, 'animate__fade_in'])
    },
    hide() {
      this.setHidden([`animate__${this.data.animation}_out`, 'animate__fade_out'])
    },
    clickCloseBackdrop() {
      const { closeOnClickBackdrop } = this.data
      if (!closeOnClickBackdrop) return
      this.setData({ show: false })
    }
  }
});
