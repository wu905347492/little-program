import request from '../utils/request.js'

// 收集formId
const addFromId = async (params = {}) => request.post({
  data: params,
  url: '/estore-tracking/track/formId/add'
});

export default {
  addFromId
}
