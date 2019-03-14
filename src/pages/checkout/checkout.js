import api from '../../api/index.js'
import getSetting from '../../utils/getSetting.js'
import { rules, interests, sexs } from './config.js'

let createOrderType

Page({
  $route: 'checkout/checkout',
  /**
   * 页面的初始数据
   */
  data: {
    // 结算所需参数
    options: {
      isInvoice: false,
      invoiceType: 1,
      isEqual: true
    },

    // 是否是授权手机号码
    authMobileStatus: false,
    // 是否授权过地址信息
    authAddressStatus: false,
    // 是否授权过发票信息
    authInvoiceStatus: false,

    // 结算商品数据
    checkoutParams: {},

    // 兴趣列表
    interests,

    sexs
  },

  onLoad(options) {
    // 检查手机授权
    wx.getStorage({
      key: 'phone',
      success: (res) => {
        if (res.data) {
          this.setData({
            ['authMobileStatus']: true,
            ['options.mobile']: res.data
          })
        }
      }
    })

    // 检查授权
    getSetting().then((res) => {
      this.setData({
        authAddressStatus: res['scope.address'],
        authInvoiceStatus: res['scope.invoiceTitle']
      })
    })
    // 获取结算商品信息
    let checkoutParams = getApp().data.checkoutParams
    if (checkoutParams) {
      let totalPrice = 0

      checkoutParams.forEach(item => {
        totalPrice += item.marketPrice * item.quantity
      })

      this.setData({
        checkoutParams,
        totalPrice
      })
    }

    // 创建订单方式 =>  来源立即购买&购物车
    createOrderType = options.type
  },

  onReady() {

  },

  onShow() {

  },

  /*
   ***********订购人信息***********
   */

  // 微信授权手机号码
  async getPhoneNumberEventer(event) {
    const { errMsg, encryptedData, iv } = event.detail
    if (errMsg != 'getPhoneNumber:ok') {
      this.$showToast('手机授权失败')
    }
    if (errMsg == 'getPhoneNumber:ok') {
      const res = await api.getPhoneNumber({encryptedData, iv})
      if (res.resultCode == 1) {
        this.setData({
          authMobileStatus: true,
          ['options.mobile']: res.data
        })
      }
      if (res.resultCode != 1) {
        this.$showToast('手机号解析失败')
      }
    }
  },

  // 监听手机号输入
  mobileChangeEventer(event) {
    this.setData({
      ['options.mobile']: event.detail.value
    })
  },

  // 监听验证码输入
  codeChangeEventer(event) {
    const code = event.detail.value
    const mobile = this.data.options.mobile

    if (mobile && code.length == 6) {
      api.checkVerifyCode({
        query: code,
        data: {
          phone: mobile
        }
      }).then(res => {
        if (res.resultCode == 1) {
          wx.showToast({
            title: '验证成功',
            icon: 'none'
          })
        }
        if (res.resultCode == 8021) {
          wx.showToast({
            title: '请填写正确验证码',
            icon: 'none'
          })
        }
        if (res.resultCode == 8028) {
          wx.showToast({
            title: '手机验证码已过期，请您重新获取!',
            icon: 'none'
          })
        }
      })
    }
  },


  /*
   ***********收件人信息***********
   */

  openAddressSettingEventer(event) {
    const { authSetting } = event.detail
    const authAddressStatus = authSetting['scope.address']
    this.setData({
      authAddressStatus
    })
    if (authAddressStatus) {
      this.chooseAddressEventer(event)
    }
  },
  chooseAddressEventer(event) {
    const { dataset } = event.currentTarget
    const { type } = dataset

    // delivery invoice
    // 收件人地址授权  收票人地址授权

    wx.chooseAddress({
      success: (res) => {
        if (res.errMsg === 'chooseAddress:ok') {
          // 更新数据更新视图
          this.setData({
            [`options.${type}Name`]: res.userName,
            [`options.${type}Phone`]: res.telNumber,
            [`options.${type}Region`]: [res.provinceName, res.cityName, res.countyName],
            [`options.${type}Address`]: res.detailInfo
          })
        }

        wx.track({
          eventName: 'CLICK_AUTH_ADDRESS',
          userEvent: 'CLICK',
          eventValue: 'SUCCESS'
        })
      },
      fail: (err) => {
        if (err.errMsg == 'chooseAddress:fail auth deny') {
          this.setData({
            authAddressStatus: false
          })
        }
        wx.track({
          eventName: 'CLICK_AUTH_ADDRESS',
          userEvent: 'CLICK',
          eventValue: 'FAIL'
        })
      }
    })
  },


  /*
   ***********发票信息***********
   */

  // 是否需要发票
  checkedInvoiceEventer(event) {
    this.setData({
      ['options.isInvoice']: event.detail.checked
    })
  },

  // 选择发票类型
  switchInvoiceEventer(event) {
    this.setData({
      ['options.invoiceType']: event.detail.value
    })
  },

  // 打开授权发票设置
  openInvoiceSettingEventer(event) {
    const { authSetting } = event.detail
    const authInvoiceStatus = authSetting['scope.invoiceTitle']
    this.setData({
      authInvoiceStatus
    })
    if (authInvoiceStatus) {
      this.chooseInvoiceEventer()
    }
  },
  // 授权发票
  chooseInvoiceEventer() {
    wx.chooseInvoiceTitle({
      success: (res) => {
        if (res.errMsg == 'chooseInvoiceTitle:ok') {
          if (res.type == 0) {
            this.setData({
              ['options.invoiceType']: 2,
              ['options.invoiceComTitle']: res.title,
              ['options.invoiceTaxNo']: res.taxNumber
            })
          }
          if (res.type == 1) {
            this.setData({
              ['options.invoiceType']: 1,
              ['options.invoicePerTitle']: res.title
            })
          }
          wx.track({
            eventName: 'CLICK_AUTH_INVOICE',
            userEvent: 'CLICK',
            eventValue: 'SUCCESS'
          })
        }
      },
      fail: (err) => {
        if (err.errMsg == 'chooseAddress:fail auth deny') {
          this.setData({
            authInvoiceStatus: false
          })
          wx.track({
            eventName: 'CLICK_AUTH_INVOICE',
            userEvent: 'CLICK',
            eventValue: 'FAIL'
          })
        }
      }
    })
  },

  // 收票地址与收件地址是否一致
  checkedEqualEventer(event) {
    this.setData({
      ['options.isEqual']: event.detail.checked
    })
  },


  /*
   ***********结算相关息***********
   */

  // 判断规则是否对某些表单进行未填验证
  handleRulesEventer() {
    const { isInvoice, invoiceType, isEqual } = this.data.options
    const { authMobileStatus } = this.data

    // 验证码
    rules.code.require = !authMobileStatus

    // 发票地址
    rules.invoiceName.require = isInvoice && !isEqual
    rules.invoicePhone.require = isInvoice && !isEqual
    rules.invoiceRegion.require = isInvoice && !isEqual
    rules.invoiceAddress.require = isInvoice && !isEqual

    // 个人发票
    rules.invoicePerTitle.require = isInvoice && invoiceType == 1

    // 公司发票
    rules.invoiceComTitle.require = isInvoice && invoiceType == 2
    rules.invoiceTaxNo.require = isInvoice && invoiceType == 2

    return rules
  },

  // 是否勾选隐私条款
  checkedStatusEventer(event) {
    console.log(event)
    this.setData({
      ['options.status']: event.detail.checked
    })
  },

  // 提交表单
  submitEventer(event) {
    const component = this.selectComponent('#field-group')
    const options = event.detail.value
    const rules = this.handleRulesEventer()

    console.log(options)

    // 验证表单
    component.validateEventer(rules, options, (valid) => {
      console.log(valid)
      console.log(options)

      // 验证通过
      if (valid) {
        let params = {}
        const { checkoutParams } = this.data
        const { isInvoice, invoiceType, isEqual } = options
        const { deliveryName, deliveryPhone, deliveryRegion, deliveryAddress } = options
        const [province, city, district] = deliveryRegion

        /* 基本参数 */
        params = {
          createOrderType,
          isInvoice: isInvoice ? 1 : 0,
          deliveryInfo: {
            deliveryName,
            deliveryPhone,
            province,
            city,
            district,
            deliveryAddress
          }
        }

        /* 商品参数 */
        // 购物车下单
        if (createOrderType == 1) {
          const ids = checkoutParams.map(item => item.id)
          params = {
            ids,
            ...params
          }
        }
        // 立即下单
        if (createOrderType == 0) {
          const { productId, productSpecId, quantity } = checkoutParams[0]
          params = {
            productId,
            productSpecId,
            quantity,
            ...params
          }
        }

        /* 发票参数 */
        if (isInvoice) {
          const { invoicePerTitle, invoiceComTitle, invoiceTaxNo } = options
          if (invoiceType == 1) {
            params = {
              invoiceInfo: {
                invoiceTitle: invoicePerTitle,
                invoiceType
              },
              ...params
            }
          }
          if (invoiceType == 2) {
            params = {
              invoiceInfo: {
                invoiceTitle: invoiceComTitle,
                invoiceTaxNo,
                invoiceType
              },
              ...params
            }
          }
        }


        /* 发票地址 */
        if (isInvoice && !isEqual) {
          const { invoiceName, invoicePhone, invoiceRegion, invoiceAddress } = options
          const [invoiceProvince, invoiceCity, invoiceDistrict] = invoiceRegion

          params.invoiceInfo = {
            invoiceName,
            invoicePhone,
            invoiceProvince,
            invoiceCity,
            invoiceDistrict,
            invoiceAddress,
            ...params.invoiceInfo
          }
        }
        if (isInvoice && isEqual) {
          params.invoiceInfo = {
            invoiceName: deliveryName,
            invoicePhone: deliveryPhone,
            invoiceProvince: province,
            invoiceCity: city,
            invoiceDistrict: district,
            invoiceAddress: deliveryAddress,
            ...params.invoiceInfo
          }
        }

        // 调用创建订单
        this.createOrderEventer(params)
      }
    })
  },
  // 创建订单
  async createOrderEventer(options) {
    this.$showLoading({
      text: '正在支付...'
    })

    const res = await api.addOrder(options)
    if (res.resultCode == 1) {
      console.log('创建成功')
      this.wechatPaymentEventer({
        orderNo: res.data.orderNo,
        payCode: 'WECHAT_PAY'
      })
      wx.track({
        eventName: 'CLICK_CREATE_ORDER',
        userEvent: 'CLICK',
        eventValue: res.data.orderNo
      })
    } else {
      wx.track({
        eventName: 'CLICK_CREATE_ORDER',
        userEvent: 'CLICK',
        eventValue: 'FAIL'
      })
      if (res.resultCode == 8001) {
        console.log('库存不足')
      } else if (res.resultCode == 8029) {
        console.log('库存不足')
      } else {
        console.log('创建失败')
      }
    }
  },
  // 调用支付
  async wechatPaymentEventer(options) {
    const res = await api.payment(options)
    if (res.resultCode == 1) {
      wx.requestPayment({
        ...res.data.wechatPay,
        success: (result) => {
          if (result.errMsg == 'requestPayment:ok') {
            wx.track({
              eventName: 'CLICK_PAY_SUCCESS',
              userEvent: 'CLICK',
              eventValue: options.orderNo
            })
          }
          if (result.errMsg != 'requestPayment:ok') {
            console.log('支付失败')
            wx.track({
              eventName: 'CLICK_PAY_FAIL',
              userEvent: 'CLICK',
              eventValue: options.orderNo
            })
          }
        },
        fail: () => {
          console.log('支付失败')
          wx.track({
            eventName: 'CLICK_PAY_FAIL',
            userEvent: 'CLICK',
            eventValue: options.orderNo
          })
        }
      })
      this.$hideLoading()
    }
  },
  interestEventer(event) {
    console.log(JSON.stringify(event.detail))
    this.setData({
      ['options.interest']: event.detail.map(item => item.value)
    })
  }
})
