/* eslint-disable */
import analyticConfig from './analytic-config.js'
import config from '../config.js'

const { baseUrl, wechatId } = config

let slice = Array.prototype.slice
let toString = Object.prototype.toString
let hasOwnProperty = Object.prototype.hasOwnProperty


let _ = {}

let app_show_time = null
let page_show_time = null

let referrerUrl = '直接打开'
let currentUrl = null

_.isObject = function(value) {
  return (toString.call(value) == '[object Object]') && (value != null)
}

_.isEmptyObject = function (value) {
  if (_.isObject(value)) {
    for (let key in value) {
      if (hasOwnProperty.call(value, key)) {
        return false
      }
    }
    return true
  }
  return false
}

_.extend = function(value) {
  let list = slice.call(arguments, 1)
  list.forEach((source) => {
    for (let key in source) {
      if (source[key] !== undefined) {
        value[key] = source[key];
      }
    }
  })
  return value
}

const T = {}
let logger = function() {
  if (analyticConfig.show_log) {
    if (typeof console === 'object' && console.log) {
      try {
        return console.log.apply(console, arguments)
      } catch (e) {
        console.log(arguments[0])
      }
    }
  }
}


T.autoSendQueue = function () {
  let queue = {
    items: [],
    running: false,
    enqueue: function (val) {
      this.items.push(val)
      this.start()
    },
    dequeue: function () {
      return this.items.shift()
    },
    getCurrentItem: function () {
      return this.items[0]
    },
    start: function() {
      if (this.items.length > 0 && !this.running) {
        this.running = true
        this.getCurrentItem().start()
      }
    },
    close: function () {
      this.dequeue()
      this.running = false
      this.start()
    }
  }
  return queue
}

T.requestQueue = function(url, options) {
  this.url = url
  this.options = options
}

T.requestQueue.prototype.end = function() {
  if (!this.received) {
    this.received = true
    this.close()
  }
}
T.requestQueue.prototype.start = function() {
  setTimeout(() => {
    this.end()
  }, 300)
  wx.request({
    url: this.url,
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    data: this.options,
    success: () => {
      logger('数据追踪: success', this.options)
    },
    fail: () => {
      logger('数据追踪: fail', this.options)
    },
    complete: () => {
      this.end()
    }
  })
}

T.store = {
  state: {
    version: analyticConfig.version,
    wechatId: wechatId,
    appLaunchCount: 0,
    campaign: analyticConfig.campaign
  },
  get: function (name) {
    return this.state[name]
  },
  set: function (name, value) {
    let object = {}
    if (typeof name === 'string') {
      object[name] = value
    }
    if (typeof name === 'object') {
      object = name
    }
    for (let key in object) {
      this.state[key] = object[key]
    }
    this.save()
  },
  save: function () {
    wx.setStorageSync('wx_analytic_store', this.state)
  },
  init: function () {
    this.state = wx.getStorageSync('wx_analytic_store') || this.state
  }
}

T.stage = {
  state: [],
  push: function (value) {
    this.state.push(value)
    if (this.state.length >= 5) {
      // 发起请求
      this.send()
    } else {
      this.save()
    }
    logger('缓存待发送队列:', this.state)
  },
  send: function () {
    if (this.state.length > 0) {
      T.send(this.state, '/track/event/add/batch')
      this.clear()
    }
  },
  save: function () {
    wx.setStorageSync('wx_analytic_stage', this.state)
  },
  clear: function () {
    this.state = []
    this.save()
  },
  init: function () {
    this.state = wx.getStorageSync('wx_analytic_stage') || this.state
  }

}


T.setSystem = function () {
  let getNetwork = function () {
    wx.getNetworkType({
      success: function (res) {
        T.store.set('networkType', res['networkType'])
      },
      complete: function () {
        getSystemInfo()
      }
    })
  }

  let getSystemInfo = function() {
    wx.getSystemInfo({
      success: function(res) {
        let value = {
          model: res['model'],
          screenWidth: Number(res['screenWidth']),
          screenHeight: Number(res['screenHeight']),
          os: res['system'].split(' ')[0],
          osVersion: res['system'].split(' ')[1]
        }
        T.store.set(value)
      },
      complete: function() {
        T.initial.system_status = true
        T.initial.checkStatus()
      }
    })
  }
  getNetwork()
}

T.setOpenid = function(openId) {
  T.store.set('openId', openId)
}

T.track = function(options) {
  _.extend(options, T.store.state)
  T.send(options, '/track/event/add')
}

T.trackStage = function(options) {
  _.extend(options, T.store.state)
  T.stage.push(options)
}

T.init = function() {
  T.initial.store_status = true
  T.initial.checkStatus()
}

T.dataQueue = T.autoSendQueue()

T.send = function(options, api) {
  let url = `${baseUrl}estore-tracking${api}`
  let instance = new T.requestQueue(url, options)
  instance.close = function() {
    T.dataQueue.close()
  }
  T.dataQueue.enqueue(instance)
}


T.initial = {
  queue: [],
  status: false,
  system_status: false,
  store_status: false,
  checkStatus: function() {
    if (this.system_status && this.store_status) {
      this.status = true;
      if (this.queue.length > 0) {
        this.queue.forEach((content) => {
          T[content[0]].apply(T, slice.call(content[1]));
        })
        this.queue = []
      }
    }
  }
}

T.ready = function() {
  T.setSystem()
  T.store.init()
  T.stage.init()
}


// 对方法做代理暂存
let _stageMethods = ['track']
_stageMethods.forEach((method) => {
  let _temp = T[method]
  T[method] = function() {
    if (T.initial.status) {
      _temp.apply(T, arguments)
    } else {
      T.initial.queue.push([method, arguments])
    }
  }
})

function extend(opts, hook, o) {
  if (opts[hook]) {
    let n = opts[hook]
    opts[hook] = function(opts) {
      o.call(this, opts, hook)
      n.call(this, opts)
    }
  } else {
    opts[hook] = function(opts) {
      o.call(this, opts, hook)
    }
  }
}

let _App = App

function appLaunch(opts) {
  let { query, scene } = opts
  let { share, source, keyword } = query
  let { appLaunchCount } = T.store.state
  // 初始化场景
  if (scene) {
    T.store.set('scene', opts.scene)
  }

  // 初始化分享来源
  if (share) {
    T.store.set('share', share)
  }

  // 初始化渠道来源
  if (source || keyword) {
    T.store.set('source', source)
    T.store.set('keyword', keyword)

    appLaunchCount = 0
  }

  // 初始化App启动次数
  T.store.set('appLaunchCount', appLaunchCount + 1)

  if (analyticConfig.autoTrack && analyticConfig.autoTrack.appLaunch) {
    T.track({ eventName: 'APP_LAUNCH' })
  }
}

function appShow(opts) {
  // 设置场景值
  if (opts.scene) {
    T.store.set('scene', opts.scene)
  }

  if (analyticConfig.autoTrack && analyticConfig.autoTrack.appShow) {
    T.track({ eventName: 'APP_SHOW' })
  }

  app_show_time = (new Date()).getTime()
}

function appUnLaunch() {}

function appHide() {
  let app_hide_time = (new Date()).getTime()
  let appDuration

  if (app_show_time && (app_hide_time - app_show_time > 0) && ((app_hide_time - app_show_time) / 3600000 < 24)) {
    appDuration = (app_hide_time - app_show_time) / 1000;
  }

  if (analyticConfig.autoTrack && analyticConfig.autoTrack.appHide) {
    T.track({
      eventName: 'APP_HIDE',
      appDuration
    })
  }

  // 发送缓存的队列
  T.stage.send()
}

function appError() {}

App = function(opts) {
  extend(opts, 'onLaunch', appLaunch)
  extend(opts, 'onShow', appShow)
  extend(opts, 'onUnLaunch', appUnLaunch)
  extend(opts, 'onHide', appHide)
  extend(opts, 'onError', appError)
  _App(opts)
}

let _Page = Page

function onLoad(opts) {
  // 保存ID到当前page上面
  if (opts.id) {
    this.$id = opts.id
  }
}

function onShow(opts) {
  let router = '系统暂时取到值'
  if (typeof this === 'object') {
    if (typeof this.route === 'string') {
      router = this.route
    } else if (typeof this.__route__ === 'string') {
      router = this.__route__
    }
  }

  currentUrl = router

  T.store.set('referrerUrl', referrerUrl)
  T.store.set('currentUrl', currentUrl)

  page_show_time = (new Date()).getTime()
}

function onHide() {
  let page_hide_time = (new Date()).getTime()
  let pageDuration
  if (page_show_time && (page_hide_time - page_show_time > 0) && ((page_hide_time - page_show_time) / 3600000 < 24)) {
    pageDuration = (page_hide_time - page_show_time) / 1000;
  }

  let eventName = analyticConfig.pageTrack[currentUrl]
  let eventValue = this.$id || ''
  if (eventName) {
    T.track({
      eventName,
      eventValue,
      pageDuration,
      userEvent: 'VIEW'
    })
  }
  referrerUrl = currentUrl
}

function onUnload() {
  let page_hide_time = (new Date()).getTime()
  let pageDuration
  if (page_show_time && (page_hide_time - page_show_time > 0) && ((page_hide_time - page_show_time) / 3600000 < 24)) {
    pageDuration = (page_hide_time - page_show_time) / 1000;
  }

  if (currentUrl !== this.__route__) {
    let eventName = analyticConfig.pageTrack[currentUrl]
    let eventValue = this.$id || ''
    if (eventName) {
      T.track({
        eventName,
        eventValue,
        pageDuration,
        userEvent: 'VIEW'
      })
    }
  }

  referrerUrl = currentUrl
}

function onReady() {}

function onPullDownRefresh() {}

function onReachBottom() {}

function onShareAppMessage() {}

Page = function(opts) {
  extend(opts, 'onLoad', onLoad)
  extend(opts, 'onShow', onShow)
  extend(opts, 'onHide', onHide)
  extend(opts, 'onUnload', onUnload)
  extend(opts, 'onReady', onReady)
  _Page(opts)
}

T.ready()

// 把方法挂载到wx上面
let _exposeMethods = ['setOpenid', 'track', 'init']
_exposeMethods.forEach((method) => {
  wx[method] = T[method]
})

export default T
