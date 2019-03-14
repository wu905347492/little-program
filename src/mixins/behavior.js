import _ from './pages.js';

export default Behavior({
  data: {
    $isIpx: _.data.$isIpx
  },
  methods: {
    $showToast: _.$showToast,
    $switchTab: _.$switchTab,
    $navigateTo: _.$navigateTo,
    $reLaunch: _.$reLaunch,
    $redirectTo: _.$redirectTo,
    $navigateBack: _.$navigateBack,
    $navigateToMiniProgram: _.$navigateToMiniProgram,
    $navigateBackMiniProgram: _.$navigateBackMiniProgram,
    $routeLink: _.$routeLink,
    $routeTo: _.$routeTo
  }
});
