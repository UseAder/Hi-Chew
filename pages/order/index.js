const app = getApp()
const util = require('../../utils/util.js');
const DataJson = require('../../utils/dataJson.js');
const api = require('../../config/api.js');
const pay = require('../../services/pay.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ImageUrl: api.ImageUrl,

    ListSwiper: [{
        id: 1,
        name: '待付款',
        status: 0,
        statusText: '待付款TEXT',
        navlist: []
      },
      {
        id: 2,
        name: '已送达',
        status: 1,
        statusText: '已送达TEXT',
        navlist: []
      }
    ],
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '订单', //导航栏 中间的标题
    },
    currentTab: 0,
    height: app.globalData.height * 2 + 20,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.WindowHeight()
    this.getGroupList()
  },
  /**
   * 取消订单
   * 
   */
  cancelOrder: function (e) {
    var order_sn = e.currentTarget.dataset.order_sn;
    if (!order_sn) return app.Tips({
      title: '缺少订单号无法取消订单'
    });
    var that = this;
    wx.showModal({
      title: '订单取消',
      content: '确定要取消此订单？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.OrderDelete, {
            order_sn: order_sn
          }, "post").then(function (res) {
            if (res.code == 200){
              that.getGroupList()
              app.Tips({
                title: '订单已取消',
                icon: 'success'
              });
            }
             
          })
        }
      }
    })

  },
  /**
   * 去订单详情  立即付款
   */
  payOrder(e) {
    console.log(e)
    console.log(app.globalData.openid)

    let that = this
    var order_sn = e.currentTarget.dataset.order_sn;
    var openid = wx.getStorageSync('openid');
    pay.payOrder({
      order_sn: order_sn,
      openid: openid
    }).then(res => {
      app.Tips({
        title: '付款成功',
        icon: 'success'
      }, function () {
        that.getGroupList()
      });
    }).catch(res => {
      app.Tips({
        title: '支付失败'
      });
    });
  },

  getGroupList() {
    let that = this;
    util.request(api.GetOrder, { uid: wx.getStorageSync('uid')}).then(function(res) {
        console.log(res.data);
        that.setData({
          "ListSwiper[0].navlist": res.no_pay,
          "ListSwiper[1].navlist": res.yes_pay
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