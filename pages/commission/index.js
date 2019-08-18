const app = getApp()
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的佣金', //导航栏 中间的标题
    },
    height: app.globalData.height * 2 + 20,
    HotelData: {
      id: null
    },
    UsePoint:{
      
    }
  },
  userMoney: function () {
    let that = this;
    util.request(api.UserMoney, { uid: that.data.HotelData.id,page:1}, 'POST').then(function (res) {
      if (res.code === 200) {
        that.setData({
          UsePoint: res.data
        });
        util.get_wxml('#publish', that.publishCallback)

      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    util.WindowHeight(that)

    if (wx.getStorageSync('HotelData')) {
      that.setData({
        HotelData: wx.getStorageSync('HotelData')
      })
    }
    that.userMoney()
  },
  //  回调获取导航高度
  publishCallback: function(rect) {
    var that = this
    that.setData({
      navHeight: rect[0].top
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  // 上滑加载更多数据
  onLoaderMoreMovies: function (event) {
    console.log(1)
    // if (this.data.requestUrl.length && this.data.totalMovies > this.data.moviesListData.length) {
    //   wx.showNavigationBarLoading();
    //   utils.http(`${this.data.requestUrl}?start=${this.data.moviesListData.length}&count=20`, this.processDoubanData, this.getMoviesListDataErrorDeal);
    // }
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