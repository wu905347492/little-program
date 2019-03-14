import tabs from './config.js';

export default Component({
  behaviors: [],
  properties: {
    show: {
      type: Boolean,
      value: !0
    },
    showIcon: {
      type: Boolean,
      value: !0
    },
    showText: {
      type: Boolean,
      value: !0
    }
  },
  data: {
    list: []
  },
  lifetimes: {
    attached() {},
    moved() {},
    detached() {}
  },
  pageLifetimes: {
    show() {
      const routes = getCurrentPages()
      const path = routes[routes.length - 1].route
      const list = tabs.map(item => Object.assign(item, {
        active: path == item.pagePath
      }))
      this.setData({ list })
    },
    hide() {},
    resize() {}
  },
  methods: {}
})
