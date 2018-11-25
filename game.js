import './js/libs/weapp-adapter'
import './js/libs/symbol'
import Main from './main'

function tencent(){
  //用户授权
  
  //更新新版本
  if (typeof wx.getUpdateManager === 'function') {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })
  }

}
// tencent()
new Main()
