// 检查授权
const scopeList = [
  'scope.userInfo',
  'scope.userLocation',
  'scope.address',
  'scope.invoiceTitle',
  'scope.werun',
  'scope.record',
  'scope.writePhotosAlbum',
  'scope.camera'
]
const getSetting = () => {
  return new Promise((reslove, reject) => {
    wx.getSetting({
      success: (res) => {
        const authSetting = res.authSetting
        let result = {}
        scopeList.forEach(v => {
          if (authSetting[v] == undefined) {
            result[v] = true
          }
          if (authSetting[v] == false) {
            result[v] = false
          }
          if (authSetting[v] == true) {
            result[v] = true
          }
        })
        reslove(result)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
export default getSetting
