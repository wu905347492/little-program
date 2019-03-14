import logger from './logger.js';

if (wx.getUpdateManager) {
  /**
   * 全局唯一的版本更新管理器，用于管理小程序更新（支持版本 >= 1.9.90）
   * 关于小程序的更新机制，可以查看运行机制文档：https://developers.weixin.qq.com/miniprogram/dev/framework/operating-mechanism.html
   */
  const updateManager = wx.getUpdateManager();
  /**
   * 监听向微信后台请求检查更新结果事件。
   * 微信在小程序冷启动时自动检查更新，不需由开发者主动触发。
   */
  updateManager.onCheckForUpdate((res) => {
    logger.info('app hasUpdate: ', res.hasUpdate);
  });
  /**
   * 监听小程序有版本更新事件。
   * 客户端主动触发下载（无需开发者触发），下载成功后回调
   */
  updateManager.onUpdateReady(() => {
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success(res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate();
        }
      }
    });
  });
  /**
   * 监听小程序更新失败事件。
   * 小程序有新版本，客户端主动触发下载（无需开发者触发），下载失败（可能是网络原因等）后回调
   */
  updateManager.onUpdateFailed((err) => {
    // 新版本下载失败
    logger.info('app update new version failed: ', err.hasUpdate);
  });
}
