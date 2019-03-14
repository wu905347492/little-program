import util from '../../utils/utils.js'

export const rules = {
  mobile: { type: 'string', require: true, message: '请输入订购人手机号', validator: util.isPhone, typeMessage: '请输入正确的手机号' },
  code: { type: 'string', require: true, message: '请输入验证码' },
  sex: { type: 'string', require: true, message: '请选择称谓' },
  deliveryName: { type: 'string', require: true, message: '请输入收件人姓名' },
  deliveryPhone: { type: 'string', require: true, message: '请输入收件人手机号', validator: util.isPhone, typeMessage: '请输入正确的手机号' },
  deliveryRegion: { type: 'array', require: true, message: '请选择所在地区' },
  deliveryAddress: { type: 'string', require: true, message: '请输入收件人详细地址' },
  giftContent: { type: 'string', require: true, message: '请输入礼品卡内容' },
  interest: { type: 'array', require: true, message: '至少选择一个兴趣' },
  invoicePerTitle: { type: 'string', require: true, message: '请输入个人抬头' },
  invoiceComTitle: { type: 'string', require: true, message: '请输入公司抬头' },
  invoiceTaxNo: { type: 'string', require: true, message: '请输入公司税号' },
  invoiceName: { type: 'string', require: true, message: '请输入收票人姓名' },
  invoicePhone: { type: 'string', require: true, message: '请输入收票人手机号', validator: util.isPhone, typeMessage: '请输入正确的手机号' },
  invoiceRegion: { type: 'array', require: true, message: '请选择所在地区' },
  invoiceAddress: { type: 'string', require: true, message: '请输入收票人详细地址' },
  status: { type: 'boolean', require: true, message: '请勾选相关隐私条款' }
}

export const interests = [{
  label: '半身裙',
  value: '1'
}, {
  label: '牛仔裤',
  value: '2'
}, {
  label: '衬衫',
  value: '3'
}, {
  label: 'T恤',
  value: '4'
}]


export const sexs = [
  {
    id: 0,
    name: '男士'
  }, {
    id: 1,
    name: '夫人'
  }, {
    id: 2,
    name: '女士'
  }
]
