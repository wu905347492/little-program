/** currency组件，用来显示固定格式的金额
 * * 目前支持三位一个逗号
 ** @params
 * * type：类型，比如 ¥, $ 等
 * * value：金额
 * * color：文字的颜色
 * */
Component({
  timer: null,
  options: {},
  behaviors: [],
  properties: {
    value: {
      type: String,
      value: '',
      observer: function (newVal) {
        setTimeout(() => {
          let curren = this.formatNum(newVal);
          this.setData({
            text: curren
          })
        }, 100);
      }
    },
    color: {
      type: String,
      value: '#000'
    },
    fontSize: {
      type: String,
      value: '28rpx'
    },
    type: {
      type: String,
      value: ''
    }
  },
  ready() {},
  data: {
    text: '',
    visible: true
  },
  methods: {
    formatNum: function (value) {
      let newStr = '';
      let count = 0;
      if (value.indexOf('.') == -1) {
        for (let i = value.length - 1; i >= 0; i--) {
          if (count % 3 == 0 && count != 0) {
            newStr = `${value.charAt(i)},${newStr}`;
          } else {
            newStr = value.charAt(i) + newStr;
          }
          count += 1;
        }
        value = newStr;
        return value;
      }
      for (let i = value.indexOf('.') - 1; i >= 0; i--) {
        if (count % 3 == 0 && count != 0) {
          newStr = `${value.charAt(i)},${newStr}`;
        } else {
          newStr = value.charAt(i) + newStr;
        }
        count += 1;
      }
      value = newStr + (`${value}00`).substr((`${value}00`).indexOf('.'), 3);
      return value;
    }
  }
})
