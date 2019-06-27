const env = `${process.env.NODE_ENV || 'dev'}`

const config = require(`./${env}.env.js`)

const wechatId = 1

const version = '2.2.5'

module.exports = {
  ...config,
  env,
  wechatId,
  version
}
