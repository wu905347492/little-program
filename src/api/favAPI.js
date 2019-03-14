import request from '../utils/request';

// 添加心愿单
const addFav = async (params = {}) => request.post({
  data: params,
  url: '/estore/gift/add'
});

// 删除心愿单
const delFav = async (params = {}) => request.get({
  data: params,
  url: '/estore/gift/delete'
});
// 检查心愿单
const checkFav = async (params = {}) => request.get({
  data: params,
  url: '/estore/gift/get/simple'
});

// 查看心愿单
const getFavList = async (params = {}) => request.get({
  data: params,
  url: '/estore/gift/get'
});

export default {
  addFav,
  delFav,
  checkFav,
  getFavList
}
