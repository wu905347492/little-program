import utils from '../../../utils/utils'

const { formatMoney } = utils
export default Component({
  properties: {
    value: {
      type: String,
      value: 0,
      observer(value) {
        this.setData({
          text: formatMoney(value, '$', 2, ',', '.')
        })
      }
    }
  },
  data: {
    text: 0
  }
})
