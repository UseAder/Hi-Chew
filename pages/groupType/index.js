const app = getApp()
const util = require('../../utils/util.js');
const DataJson = require('../../utils/dataJson.js');
const api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ImageUrl: api.ImageUrl,

    goodsList: [],
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '商品', //导航栏 中间的标题
    },
    height: app.globalData.height * 2 + 20,
  },
  toGoods: function (e) {
    var gid = e.currentTarget.dataset.gid;
    wx.navigateTo({
      url: '/pages/goods/index?gid=' + gid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.goodsGoods(options)
    console.log(options)

  },
  //分类商品
  goodsGoods: function (options) {
    var that=this
    util.request(api.ToUseCoupon, { did: options.did }, 'post')
      .then(function (res) {
        if (res.code != 200) return
        that.setData({
          goodsList: res.data,
        });
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})