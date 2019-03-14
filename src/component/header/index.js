export default Component({
  properties: {
    test: {
      value: 0,
      type: Number
    }
  },
  data: {
    a: 1
  },
  computed: {
    b() {
      return this.data.a + 100;
    }
  },
  attached() {
    console.log(this);
  },
  methods: {
    tap() {
      this.$navigateTo('index/index');
    }
  }
});
