import request from '../utils/request';

// 商品详情
const getProductDetail = async (params = {}) => request.get({
  url: `/estore/product/get/${params.id}`
});
const getProductList = async (params = {}) => request.post({
  data: params,
  url: '/estore/product/search'
});

export default {
  getProductDetail,
  getProductList
};
