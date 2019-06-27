/**
 * 对存在fixed在底部页面IPX适配
 * @isTabBar 底部是否有tabbar
 */

import util from '../../utils/utils.js'

export default Component({
  properties: {
    isTabBar: {
      type: Boolean,
      value: false
    }
  },
  data: {
    $isIpx: util.isIpx()
  }
})
