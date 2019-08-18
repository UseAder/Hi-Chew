const app = getApp()
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ListSwiper: [{
      id: 1,
      name: '未使用',
      status: 0,
      statusText: '未使用',
      navlist: []
    },
    {
      id: 2,
      name: '已使用',
      status: 1,
      statusText: '已使用',
      navlist: []
      }, {
        id: 3,
        name: '已过期',
        status: 2,
      statusText: '已过期',
        navlist: []
      }
    ],

    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的优惠劵', //导航栏 中间的标题
    },
    currentTab: 0,
    height: app.globalData.height * 2 + 20,
  },
  toGroupType(e) {
    let that = this, id = e.currentTarget.dataset.id;
    console.log(id)
    app.Tips('/pages/groupType/index?did=' + id)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.WindowHeight()
    this.getGroupList()

  },
  getGroupList() {
    let that = this;
  
    util.request(api.MyCoupon, { uid: wx.getStorageSync('uid') }, 'post').then(function (res) {
      console.log(res.data);
      that.setData({
        "ListSwiper[0].navlist": res.data.no,
        "ListSwiper[1].navlist": res.data.yes,
        "ListSwiper[2].navlist": res.data.overdue

      });
      that.heightReady()

    });
  },
  switchTab: function(e) {
    this.setData({
      currentTab: e.detail.current
    });

    this.heightReady()
  },
  swithNav: function(e) {
    var a = e.target.dataset.current;
    if (this.data.currentTab == a) return !1;
    this.setData({
      currentTab: a,
      
    });
    this.heightReady()
    
  },
  // 获取窗口高度
  WindowHeight: function() {
    var that = this
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  },
  // 获取swiper窗口高度
  heightReady: function() {
    var that = this
    let ListSwiper = that.data.ListSwiper[that.data.currentTab].navlist
    let currentTab = that.data.currentTab
    that.setData({
      swiper_length: Math.ceil(ListSwiper.length / 2)
    })
    util.pageScrollTo()
    
    util.get_wxml(`.column-list${currentTab}`, (rects) => {
      let sum_heigth = 0
      that.setData({
        swiper_height: rects[0].height,
        swiper_top: rects[0].top

      })

      // 就是循环相加每个列表的高度，然后赋值给swiper_height,便可以求出当前tab栏的高度，赋值给swiper 便可以swiper高度自适应
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})