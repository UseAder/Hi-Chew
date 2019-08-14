const app = getApp()
const DataJson = require('../../utils/dataJson.js');
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({
  data: {
  
    ImageUrl: api.ImageUrl,
    ReturnData: {
      'banner': [], //轮播图
      'type': [], //分类
      'slogan': [], //横幅
      'sales': [], //发现好物
      'good': [], // 精品推荐
    },


    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '嘿咻 Hi-Chew', //导航栏 中间的标题
    },
    // 此页面页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    navHeight: 160,
  },
  onLoad: function() {
    var that = this
    that.getIndexData()
  },
  inputKeyword: function () {
    app.Tips('/pages/search/index')
  },
  toGoods:function(e){
    var gid = e.currentTarget.dataset.gid;
    wx.navigateTo({
      url: '/pages/goods/index?gid='+gid
    })
  },

  refresh:function(){
    var that = this;
    util.request(api.PagePage,{},'post').then(function (res) {
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
})