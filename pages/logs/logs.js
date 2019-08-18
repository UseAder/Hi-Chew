
const app = getApp()
const DataJson = require('../../utils/dataJson.js');
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var user = require('../../services/user.js');

Page({
  data:{
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '', //导航栏 中间的标题
    },
    name:'',
    password:'',
    // 此页面页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
  },
  account_changed: function (a) {
    this.setData({
      name: a.detail.value
    });
  },
  password_changed: function (a) {
    this.setData({
      password: a.detail.value
    });
  },
  login_action: function () {
    var that=this;
    var that = this;
    if (!that.data.name) return app.Tips({
      title: '请输入账号'
    });
    if (!that.data.password)
      return app.Tips({
        title: '请输入密码'
      });
    util.request(api.HotelLogin, { name: that.data.name, pwd: that.data.password},'post').then(function (res) {
      if (res.code === 200) {
        wx.setStorageSync('HotelData', res.data)
        wx.navigateBack()

      }else{
        app.Tips({
          title: '登入失败，账号或密码错误...'
        });
      }
    });
   
  },
  userInfoHandler() {
    var that = this
    wx.showLoading({
      title: '登录中...',
    })
    user.loginByWeixin().then(res => {
      if (res.code == 200) {
        that.setData({
          userInfo: wx.getStorageSync('userInfo')
        })
        wx.navigateBack()
      }
      wx.hideLoading();

    }).catch((err) => {
      wx.hideLoading();

      console.log(err)
    });
  },
  onShareAppMessage: function () { }
});