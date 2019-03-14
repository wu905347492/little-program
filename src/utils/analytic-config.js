
export default {
  version: '1.0.0',
  campaign: 'D1M',
  show_log: true,
  autoTrack: {
    appLaunch: true,
    appShow: true,
    appHide: true
  },
  pageTrack: {
    'pages/home/home': 'ENTER_HOME',
    'pages/mall/mall': 'ENTER_PRODUCT_LIST',
    'pages/detail/detail': 'ENTER_PRODUCT_DETAIL',
    'pages/cart/cart': 'ENTER_CART',
    'pages/checkout/checkout': 'ENTER_CHECKOUT',
    'pages/success/success': 'ENTER_PAY_SUCCESS',
    'pages/fail/fail': 'ENTER_PAY_FAIL',
    'pages/soldout/soldout': 'ENTER_PAY_SOLDOUT',
    'pages/order/order': 'ENTER_ORDER',
    'pages/order-detail/order-detail': 'ENTER_ORDER_DETAIL',
    'pages/user/user': 'ENTER_USER',
    'pages/privacy/privacy': 'ENTER_PRIVACY',
    'pages/faq/faq': 'ENTER_FAQ'
  }
}
