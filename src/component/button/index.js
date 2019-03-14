import config from '../../config'
import api from '../../api/index'
import storageManage from '../../utils/storage-manage'

export default Component({
  behaviors: [],
  properties: {
    disabled: {
      type: Boolean,
      value: false
    },
    openType: {
      type: String,
      value: 'normal'
    },
    contact: {
      type: Object,
      value: {}
    }
  },
  data: {},
  attached() {},
  methods: {
    async submitEventer(event) {

      // 函数回调
      this.triggerEvent('emiteventer', {})

      const openId = await storageManage.getOpenId()
      const wechatId = config.wechatId
      const { formId } = event.detail
      const result = await api.addFromId({
        openId,
        wechatId,
        formId,
        source: 'normal'
      })
      if (result.resultCode == 1) {
        console.info(`FormId Report Successful: ${formId}`)
      }
    },
    // - contact
    contactEventer({ detail = {} } = {}) {
      this.triggerEvent('contact', detail)
    },

    // getPhoneNumber
    getPhoneNumberEventer({ detail = {} } = {}) {
      this.triggerEvent('getphonenumber', detail)
    },

    openSettingEventer({ detail = {} } = {}) {
      this.triggerEvent('opensetting', detail)
    }
  }
});
