var util = require('./utils/util.js');
var api = require('./config/api.js');

App({
  onLaunch: function(options) {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function(res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function() {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    util.checkLogin().then(res => {
      console.log('app login');
      this.globalData.uid = wx.getStorageSync('uid');
      this.globalData.openid = wx.getStorageSync('openid');
      this.globalData.userInfo = wx.getStorageSync('userInfo');
      if (this.employIdCallback) {
        this.employIdCallback(wx.getStorageSync('openid'));
      }
    }).catch(() => {});
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        this.globalData.height = res.statusBarHeight,
          this.globalData.windowHeight = res.windowHeight
      }
    })
    util.PageCoupon()

  },
  onLoad: function(options) {
    console.log(options)
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    };
    
  },
  onReady:function(){
    console.log(0)
  },
  globalData: {
    userInfo: {
      nickname: '昵称',
      avatar: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
    },
    openid: '', //1后端
    uid: '',
    // share: false,  // 分享默认为false
    // zymConfirm: false,//验证码成功或失效
    // pieLoad: false,//ec-canvas 数据问题需要
    // pieCanvasHeight: null,
    height: 0, //自定义标题头
    windowHeight: 0, //获取当前窗口的高度
    couponBanner:{}

  },
  /*
   * 信息提示 + 跳转
   * @param object opt {title:'提示语',icon:''} | url
   * @param object to_url 跳转url 有5种跳转方式 {tab:1-5,url:跳转地址}
   */
  Tips: function(opt, to_url) {
    return util.Tips(opt, to_url);
  },
})