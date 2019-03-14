export default Behavior({
  behaviors: [],
  properties: {},
  data: {
    visible: !1
  },
  attached() {},
  methods: {
    /**
     * 显示
     */
    setVisible(className = 'animate__fade_in') {
      if (this._timer) clearTimeout(this._timer);
      this.setData({
        animatecls: className,
        visible: !0
      });
    },
    /**
     * 隐藏
     */
    setHidden(className = 'animate__fade_out', timer = 500) {
      this.setData({
        animatecls: className
      });
      this._timer = setTimeout(() => {
        this.setData({
          visible: !1
        });
      }, timer);
    }
  }
});
