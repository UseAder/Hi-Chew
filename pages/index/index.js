const app = getApp()
const DataJson = require('../../utils/dataJson.js');
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var user = require('../../services/user.js');


Page({
  data: {
    userInfo: {
      nickname: app.globalData.userInfo.nickname,
      avatar: app.globalData.userInfo.avatar
    },
    ImageUrl: api.ImageUrl,
    ReturnData: {
      'banner': [], //轮播图
      'type': [], //分类
      'slogan': [], //横幅
      'sales': [], //发现好物
      'good': [], // 精品推荐
    },
    navDesc: ['28分钟送达', '满20免费送', '24小时服务'],
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '嗨咻Hixiu', //导航栏 中间的标题
      gwc: 0
    },
    // 此页面页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    navHeight: 160,
  },
  onLoad: function() {
    var that = this
    that.getIndexData()
  },
  inputKeyword: function() {
    app.Tips('/pages/search/index')
  },
  toGoods: function(e) {
    var gid = e.currentTarget.dataset.gid;
    wx.navigateTo({
      url: '/pages/goods/index?gid=' + gid
    })
  },
  // hua
  refresh: function() {
    var that = this;
    util.request(api.PagePage, {}, 'post').then(function(res) {
      if (res.code === 200) {
        that.setData({
          'ReturnData.sales': res.data
        })
      }
    })
  },
  /*
   **首页menu
   */
  getIndexData: function() {
    var that = this;
    util.request(api.IndexUrl).then(function(res) {
      if (res.code === 200) {
        that.setData({
          ReturnData: res.data
        })
        wx.setStorageSync('navList', that.data.ReturnData.type)
        util.get_wxml('#publish', that.publishCallback)
      }
    })
  },
  //  回调获取导航高度
  publishCallback: function(rect) {
    var that = this
    that.setData({
      navHeight: rect[0].height
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    if (app.globalData.openid) {
      that.setData({
        userInfo: app.globalData.userInfo,
      })
    } else {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.employIdCallback = openid => {
        if (openid != '') {
          that.setData({
            userInfo: app.globalData.userInfo,
          })
        }
      }
    }
  },
  /**
   * 调用微信登录
   */
  userInfoHandler: function() {
    var that = this
    user.loginByWeixin().then((res) => {
      if (res.code == 200) {
        wx.reLaunch({
          url: '/pages/index/index',
        });
        // that.setData({
        //   userInfo: res.data
        // })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})