/* eslint-disable */
import utils from './utils'
import PageMixins from '../mixins/pages'
import ComponentMixins from '../mixins/behavior'
import preload from './preload'

const {
  normalizeUrl
} = utils


/**
 * wx对象下的所有非同步方法promise化
 * wx.request == > wx.$request
 */
for (const key in wx) {
  const _fun = wx[key]
  if (key.indexOf('Sync') < 0 && typeof _fun === 'function' && Object.prototype.toString.call(_fun) === '[object Function]') {
    wx['$' + key] = (options, ...params) => new Promise((resolve, reject) => {
      _fun(Object.assign({}, options, {
        success: resolve,
        fail: reject
      }), ...params)
    })
  }
}

/**
 * Rewrite Page
 */
const lifecycleHooks = [
  'onLoad', 'onReady', 'onShow',
  'onHide', 'onUnload', 'onPullDownRefresh',
  'onReachBottom', 'onShareAppMessage',
  'onPageScroll', 'onTabItemTap'
]
const _Page = Page
Page = function (options) {
  const opts = {mixins: [], ...options}

  // mixnis
  if (!~opts.mixins.indexOf(PageMixins)) {
    opts.mixins.unshift(PageMixins)
  }

  //
  for (const mixin of opts.mixins) {
    if (!mixin || typeof (mixin) !== 'object') continue

    // data
    if (mixin.data && typeof (mixin.data) === 'object') {
      opts.data = {
        ...mixin.data,
        ...opts.data
      }
    }

    for (const key in mixin) {
      // custom property/function
      if (!~lifecycleHooks.indexOf(key)) {
        opts[key] = opts[key] || mixin[key]
        continue
      }
      // life cycle hooks
      const originHook = opts[key] || function () {}
      opts[key] = function () {
        if (typeof mixin[key] !== 'function') {
          console.warn(`page hook '${key}' must be a function.`)
        } else {
          originHook.apply(this, arguments)
          mixin[key].apply(this, arguments)
        }
      }
    }
  }
  delete opts.mixins

  // add preload lifecycle
  opts.$route = normalizeUrl(opts.$route)
  preload.init(opts.$route, opts.onPreLoad)
  return _Page(opts)
}


/**
 * Rewrite Component
 */
const _Component = Component
Component = function (options) {
  const opts = {
    behaviors: [],
    ...options
  }
  // mixnis
  if (!~opts.behaviors.indexOf(ComponentMixins)) {
    opts.behaviors.unshift(ComponentMixins)
  }
  return _Component(opts)
}
