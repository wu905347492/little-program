import request from '../utils/request.js'

// 创建订单
const addOrder = async (params = {}) => request.post({
  data: params,
  url: '/estore/order/add'
});

// 获取订单列表
const getOrderList = async (params = {}) => request.get({
  data: params,
  url: '/estore/order/get'
});

// 获取订单详情
const getOrderDetail = async (params = {}) => request.get({
  data: params,
  url: '/estore/order/get'
});

// 支付
const payment = async (params = {}) => request.post({
  data: params,
  url: '/estore/order/pay'
});

export default {
  addOrder,
  getOrderList,
  getOrderDetail,
  payment
}
