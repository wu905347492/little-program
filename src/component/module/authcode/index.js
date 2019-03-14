import api from '../../../api/index.js'

let _timer
export default Component({
  properties: {
    mobile: {
      type: String
    },
    text: {
      type: String,
      value: '验证码'
    }
  },
  data: {
    disabled: false
  },
  detached() {
    clearInterval(_timer)
  },
  methods: {
    async getVerifyCode() {
      const mobile = this.data.mobile
      console.log(mobile)
      if (!mobile) {
        wx.showToast({
          title: '请先获取手机号',
          icon: 'none',
          duration: 2000
        })
        return
      }
      const result = await api.getVerifyCode({
        mobile
      })
      if (result.resultCode === '1') {
        this.$showToast('验证码已发送，注意查收')
        this.srartTimer()
      }
      if (result.resultCode === '8023') {
        this.$showToast('短信验证一分钟后重试')
      }
      if (result.resultCode === '8025') {
        this.$showToast('手机号格式错误')
      }
    },
    srartTimer() {
      let count = 60
      _timer = setInterval(() => {
        this.setData({
          text: `${count -= 1}s后获取`,
          disabled: !0
        })
        if (count < 1) {
          clearInterval(_timer);
          this.setData({
            text: '重新获取',
            disabled: !1
          })
        }
      }, 1000)
    }
  }
})
