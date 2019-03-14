import request from '../utils/request';

// 添加购物
const addCart = async (params = {}) => request.post({
  data: params,
  url: '/estore/cart/add'
});
// 删除购物车
const delCart = async (params = {}) => request.get({
  url: `/estore/cart/delete/${params.id}`
});

// 更新购物车
const updateCart = async (params = {}) => request.post({
  data: params,
  url: '/estore/cart/edit'
});

// 查看购物车
const getCartList = async () => request.get({
  url: '/estore/cart/get'
});

export default {
  addCart,
  delCart,
  updateCart,
  getCartList
}
