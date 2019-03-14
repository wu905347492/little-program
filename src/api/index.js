import track from './trackAPI.js'
import product from './productAPI.js'
import fav from './favAPI.js'
import cart from './cartAPI.js'
import member from './memberAPI.js'
import order from './orderAPI.js'

export default {
  ...track,
  ...product,
  ...fav,
  ...cart,
  ...member,
  ...order
}
