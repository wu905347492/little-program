/**
 * 配合clause使用
 * */
Component({
  timer: null,
  options: {},
  behaviors: [],
  properties: {
    title: {
      type: String,
      value: ''
    },
    fontSize: {
      type: String,
      value: '25'
    }
  },
  data: {
    display: {
      status: false,
      content: 'none'
    },
    src: '../icon-asign.png'
  },
  methods: {
    action: function (e) {
      this.setData({
        'display.status': !this.data.display.status,
        'display.content': !this.data.display.status ? 'block' : 'none',
        src: !this.data.display.status ? '../icon-msign.png' : '../icon-asign.png'
      })
    }
  }
})
