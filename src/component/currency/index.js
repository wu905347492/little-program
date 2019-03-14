export default Component({
  properties: {
    value: {
      type: String,
      value: 0,
      observer(value) {
        this.setData({
          text: value.$currency()
        })
      }
    }
  },
  data: {
    text: 0
  }
})
