const env = `${process.env.NODE_ENV || 'dev'}`

const config = require(`./${env}.env.js`)

config.env = env

config.wechatId = 1

module.exports = config
