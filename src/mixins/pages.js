import utils from '../utils/utils';
import preload from '../utils/preload';

const {
  normalizeUrl,
  debounce,
  isFunction,
  isIpx
} = utils;

const routeHooks = [
  '$switchTab', '$navigateTo',
  '$reLaunch', '$redirectTo'
];

const _debounce = debounce((type, option) => {
  wx[type](option).then(() => {
    console.log(`<---------- ${type} to '${option.url}' success---------->`);
  }).catch(() => {
    console.log(`<---------- ${type} to '${option.url}' fail---------->`);
  });
}, 300, false);

export default {

  data: {

    // loading status
    $show: false,

    $text: '',

    $isIpx: isIpx()
  },
  onLoad() {
  },
  onShow() {

  },
  // 非生命周期方法
  $showLoading(value = '') {
    this.setData({
      $text: value,
      $show: true
    })
  },
  $hideLoading() {
    this.setData({
      $show: false
    })
  },
  $showToast(value, timer = 2000) {
    wx.showToast({
      title: value,
      icon: 'none',
      duration: timer
    })
  },
  // 获取预加载数据
  $getPreload(fn, ...args) {
    const arr = [this.$route];
    if (isFunction(fn)) {
      arr.push(fn.bind(null, ...args));
    }
    return preload.get(...arr);
  },
  // $switchTab
  $switchTab(path) {
    this.$routeTo(path, '$switchTab');
  },
  // $navigateTo
  $navigateTo(path) {
    this.$routeTo(path, '$navigateTo');
  },
  // $redirectTo
  $redirectTo(path) {
    this.$routeTo(path, '$redirectTo');
  },
  // $reLaunch
  $reLaunch(path) {
    this.$routeTo(path, '$reLaunch');
  },
  // $navigateBack
  $navigateBack(delta) {
    debounce('$navigateBack', {
      delta
    });
  },
  // navigateToMiniProgram
  $navigateToMiniProgram() {},
  // navigateBackMiniProgram
  $navigateBackMiniProgram() {},
  // Be used to view
  $routeLink(event) {
    const {
      type,
      path
    } = event.currentTarget.dataset;
    this.$routeTo(path, type);
  },
  // Be used to controller
  $routeTo(path, type = '$navigateTo') {
    const routes = getCurrentPages();

    if (type[0] !== '$') {
      type = `$${type}`;
    }

    if (routeHooks.indexOf(type) === -1) {
      throw new Error(`not allowed type ${type}`);
    }

    path = normalizeUrl(path);
    preload.set(path);

    // 页面深度高于10
    if (routes.length >= 10) type = '$redirectTo';
    _debounce(type, {
      url: path
    });
  }
};
