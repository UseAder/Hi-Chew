const app = getApp()
const util = require('../../utils/util.js');
const DataJson = require('../../utils/dataJson.js');
const api = require('../../config/api.js');
const pay = require('../../services/pay.js');
var user = require('../../services/user.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ImageUrl: api.ImageUrl,

    ListSwiper: [{
        id: 1,
        name: '全部',
        status: 0,
        statusText: '全部',
        navlist: []
      }, {
        id: 2,
        name: '待付款',
        status: 0,
        statusText: '待付款TEXT',
        navlist: []
      },
      {
        id: 3,
        name: '已送达',
        status: 1,
        statusText: '已送达TEXT',
        navlist: []
      }
    ],
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '订单中心', //导航栏 中间的标题
    },
    userInfo: {
      nickname: app.globalData.userInfo.nickname,
      avatar: app.globalData.userInfo.avatar
    },


    currentTab: 0,
    height: app.globalData.height * 2 + 20,
  },
  // 删除订单
  deleteOrder: function (e) {
    var that = this;
    var order_sn = e.currentTarget.dataset.order_sn;//获取当前长按图片下标
    var order_status = e.currentTarget.dataset.order_status;//

    if (order_status==0){
      return app.Tips({ title: '请取消订单后再进行删除 ^_^' }, '/pages/orderDetail/index?order_sn=' + order_sn)
    }
    if (order_status == 20) {
      return app.Tips({ title: '请确认订单后再进行删除 ^_^' }, '/pages/orderDetail/index?order_sn=' + order_sn)
    }
    wx.showModal({
      title: '提示',
      content: '确定要删除订单么？',
      success: function (res) {
        if (res.confirm) {
          util.request(api.OrderDelete, {
            order_sn: order_sn
          }, "post").then(function (res) {
            if (res.code == 200) {
              that.getGroupList()
              app.Tips({
                title: '订单已删除',
                icon: 'success'
              });
            }

          })
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
    
      }
    })
  },
  toGoods: function(e) {
    var gid = e.currentTarget.dataset.gid;
    wx.navigateTo({
      url: '/pages/goods/index?gid=' + gid
    })
  },
  toOrderDetails: function(e) {
    var order_sn = e.currentTarget.dataset.order_sn,
      that = this
    wx.navigateTo({
      url: '/pages/orderDetail/index?order_sn=' + order_sn
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.currentTab) {
      this.setData({
        currentTab: options.currentTab
      })
    }
    this.WindowHeight()
    this.getGroupList()
  },
  /**
   * 取消订单
   * 
   */
  cancelOrder: function(order_sn) {
    var order_sn = order_sn;
    if (!order_sn) return app.Tips({
      title: '缺少订单号无法取消订单'
    });
    var that = this;
    util.request(api.OrderCancel, {
      order_sn: order_sn
    }, "post").then(function(res) {
      if (res.code == 200) {
        that.getGroupList()
      }
    })
  },
  confimOrder: function(order_sn) {
    var that = this;
    var order_sn = order_sn;
    util.request(api.OrderConfirm, {
      order_sn: order_sn
    }, "post").then(function(res) {
      if (res.code == 200) {
        that.getGroupList()

      }
    })
  },
  /**
   * 去订单详情  立即付款
   */
  payOrder(e) {
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
      }, function() {
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
    util.request(api.GetOrder, {
      uid: wx.getStorageSync('uid')
    }, 'post').then(function(res) {
      if(res.code==100)return
      that.setData({
        "ListSwiper[0].navlist": res.all,
        "ListSwiper[1].navlist": res.no_pay,
        "ListSwiper[2].navlist": res.yes_pay
      });

      that.countDown();
      that.countDown1();

      that.heightReady()
      app.globalData.orderLoad=false
    });
  },
  timeFormat(param) { //小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown() { //倒计时函数
  
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime() / 1000;
    let endTimeList = this.data.ListSwiper[0].navlist;
    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(i => {
      let nndate = null;
      if (i.order_status == 0) {
        nndate = i.over_time;
      } else if (i.order_status == 20) {
        nndate = i.ok_time;
      }
      let endTime = nndate;
      let obj = null;
      //   // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0) {
        let time = (endTime - newTime);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          min: this.timeFormat(min),
          sec: this.timeFormat(sec)
        }
      } else { //活动已结束，全部设置为'00'
        obj = {
          min: '00',
          sec: '00'
        }
        // if(i.order_status==0){
        //   console.log(i)
        //   this.cancelOrder(i.order_sn)
        // }

        if (i.order_status == 0) {
          this.cancelOrder(i.order_sn)
        } else if (i.order_status == 20) {
          this.confimOrder(i.order_sn)
        }
      }
      i.timer = obj
    })
    // // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({
      'ListSwiper[0].navlist': endTimeList
    })
    setTimeout(this.countDown, 1000);
  },
  countDown1() { //倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime() / 1000;
    let endTimeList = this.data.ListSwiper[1].navlist;
    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(i => {
      let nndate = i.over_time;
      let endTime = nndate;
      let obj = null;
      //   // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0) {
        let time = (endTime - newTime);
        //     // 获取天、时、分、秒
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        obj = {
          min: this.timeFormat(min),
          sec: this.timeFormat(sec)
        }
      } else { //活动已结束，全部设置为'00'
        obj = {
          // day: '00',
          // hou: '00',
          min: '00',
          sec: '00'
        }
        if (i.order_status == 0) {
          this.cancelOrder(i.order_sn)
        }
      }
      i.timer = obj
    })
    // // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({
      'ListSwiper[1].navlist': endTimeList
    })
    setTimeout(this.countDown1, 1000);
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
      if (rects[0]) {
        that.setData({
          swiper_height: rects[0].height,
          swiper_top: rects[0].top

        })

      }

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
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    if (currPage.data.myReload) {
      that.getGroupList()
      currPage.data.myReload = false
    }

    if (app.globalData.orderLoad){
      that.getGroupList()

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
          url: '/pages/order/index',
        });
        // that.setData({
        //   userInfo: res.data
        // })
        // that.getGroupList()
      }
    })
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