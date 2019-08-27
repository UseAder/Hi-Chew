const app = getApp()
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const pay = require('../../services/pay.js');
var user = require('../../services/user.js');

Page({
  data: {
    share: {
      formid: null
    },
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '订单详情', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    ImageUrl: api.ImageUrl,
    sumTotal: 0, //商品实际价格
    orderInfo: {},
    orderGoods: [],
    status: 0,
    tempdesc: "",
    order: {}
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    that.setData({
      couponBanner: app.globalData.couponBanner
    })
    if (!options.order_sn) return
    that.setData({
      order: options
    })
    that.getOrderDetail();
  },
  getOrderDetail() {
    let that = this;
    util.request(api.OrderDetail, {
      order_sn: that.data.order.order_sn,
    }, 'POST').then(function(res) {
      var orderInfo = res.order,
        goods = res.goods;
      var sum = 0;
      for (var i in goods) {
        sum += goods[i].goods_num * goods[i].goods_price
      }
      that.setData({
        sumTotal: sum,
        sumTotalYhui: (sum - orderInfo.pay_price).toFixed(2),
        orderInfo: orderInfo,
        orderGoods: res.goods,
        ok_time: res.ok_time || 0,
        over_time: res.ok_time || 0,
      });
      if (orderInfo.order_status == 0) {
        that.countDown(that.data.over_time);
      } else if (orderInfo.order_status == 20) {
        that.countDown(that.data.ok_time);
      }

    });
  },


  timeFormat(param) { //小于10的格式化函数
    return param < 10 ? '0' + param : param;
  },
  countDown() { //倒计时函数
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime() / 1000;
    // 对结束时间进行处理渲染到页面
    // endTimeList.forEach(i => {
    let orderInfo = this.data.orderInfo
    let nndate = null
    if (orderInfo.order_status == 0) {
      nndate = this.data.over_time;
    } else if (orderInfo.order_status == 20) {
      nndate = this.data.ok_time;
    }
    let endTime = nndate;
    let obj = null;
    //   // 如果活动未结束，对时间进行处理
    if (endTime - newTime > 0) {
      let time = (endTime - newTime);
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      obj = {
        day: this.timeFormat(day),
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec)
      }
    } else { //活动已结束，全部设置为'00'
      obj = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }
      if (orderInfo.order_status == 0) {
        this.cancelOrder()
      } else if (orderInfo.order_status == 20) {
        this.confimOrder()
      }
    }

    orderInfo.timer = obj
    // // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({
      'orderInfo': orderInfo
    })
    setTimeout(this.countDown, 1000);
  },

  /**
   * 去订单详情  立即付款
   */
  payOrder(e) {
    let that = this
    var order_sn = that.data.order.order_sn;
    that.setData({
      'share.formid': e.detail.formId
    })
    var openid = wx.getStorageSync('openid');
    pay.payOrder({
      order_sn: order_sn,
      openid: openid
    }).then(res => {
      util.request(api.OrderSuccess, {
        order_sn: order_sn,
        form_id: that.data.share.formid,
        openid: wx.getStorageSync('openid'),
      }, "POST").then(function(res) {
        app.Tips({
          title: '付款成功',
          icon: 'success'
        }, function() {
          that.getOrderDetail()
        });
        var pages = getCurrentPages();   //当前页面
        var prevPage = pages[pages.length - 2];   //上一页面
        prevPage.setData({
          //直接给上一个页面赋值
          myReload: true
        });
      });

      // app.Tips({
      //   title: '付款成功',
      //   icon: 'success'
      // }, function () {

      //   that.getOrderDetail()
      // });
      // var pages = getCurrentPages();   //当前页面
      // var prevPage = pages[pages.length - 2];   //上一页面
      // prevPage.setData({
      //   //直接给上一个页面赋值
      //   myReload: true
      // });
    }).catch(res => {
      app.Tips({
        title: '支付失败'
      });
    });
  },

  /**
   * 取消订单
   * 
   */
  cancelOrder: function() {
    var that = this;
    var order_sn = that.data.order.order_sn;
    // if (!order_sn) return app.Tips({
    //   title: '缺少订单号无法取消订单'
    // });
    // wx.showModal({
    //   title: '订单取消',
    //   content: '确定要取消此订单？',
    //   success: function (res) {
    //     if (res.confirm) {
    util.request(api.OrderCancel, {
      order_sn: order_sn
    }, "post").then(function(res) {
      if (res.code == 200) {
        that.getOrderDetail()
        var pages = getCurrentPages();   //当前页面
        var prevPage = pages[pages.length - 2];   //上一页面
        prevPage.setData({
          //直接给上一个页面赋值
          myReload: true
        });
        app.Tips({
          title: '订单已取消',
          icon: 'success'
        });
      }
    })
  },

  confimOrder: function() {
    var that = this;
    var order_sn = that.data.order.order_sn;
    util.request(api.OrderConfirm, {
      order_sn: order_sn
    }, "post").then(function(res) {
      if (res.code == 200) {
        that.getOrderDetail()
        var pages = getCurrentPages();   //当前页面
        var prevPage = pages[pages.length - 2];   //上一页面
        prevPage.setData({
          //直接给上一个页面赋值
          myReload: true
        });
        app.Tips({
          title: '您的订单已确认收货',
          icon: 'success'
        });
      }
    })
  },

  onShareAppMessage: function() {},
})