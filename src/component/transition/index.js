export default Component({
  properties: {
    index: {
      type: Number,
      value: 0
    },
    delay: {
      type: Number,
      value: 0.2
    },
    duration: {
      type: Number,
      value: 0.4
    }
  },
  data: {
    style: ''
  },
  attached() {
    const { index, delay, duration } = this.data
    this.setData({
      style: `
        animation-delay: ${index * delay}s;
        animation-duration: ${duration}s;
        `
    })
  }
})
