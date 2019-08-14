const app = getApp()
const util = require('../../utils/util.js');
const DataJson = require('../../utils/dataJson.js');
const api = require('../../config/api.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '填写订单信息', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    ImageUrl: api.ImageUrl,

    optionsData: {},
    total: null, //合计
    checkedAddress: {},
    checkedGoodsList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      optionsData: options
    })

  },
  onShow: function () {
    var optionsData = this.data.optionsData
    if (optionsData.cid) {
      var cid = JSON.parse(optionsData.cid)
      this.orderIndexAll(cid)
    }
    if (optionsData.num) {
      this.orderDan(optionsData)
    }
  },
  // 选择地址
  selectAddress() {
    //选择该收货地址
    wx.navigateTo({
      url: "/pages/address-select/index"
    });
  },
  // 单个商品
  orderDan: function (options) {
    console.log(options)
    var that = this
    util.request(api.OrderDan, options, "POST").then(function (res) {
      var goods = [{
        goods_price: res.data.goods_price,
        brand: res.data.spec_image,
        name: res.data.goods_name,
        num: that.data.optionsData.num,
        goods_id: res.data.goods_id,
        sku_value:res.data.sku
      }]
      var checkedAddress = res.address
      that.setData({
        checkedGoodsList: goods,
        total: res.data.total,
        checkedAddress: res.data.address
      })
    })
  },
  // 批量商品
  orderIndexAll: function (cidArray) {
    var that = this
    util.request(api.OrderIndexAll, {
      cid: cidArray,
      uid: wx.getStorageSync('uid'),
    }, "POST").then(function (res) {
      if(res.code===200){
        that.setData({
          checkedGoodsList: res.data.list,
          total: res.data.total,
          checkedAddress: res.data.address
        })
      }
     
    })
  },
  // 立即购买
  submitOrder: function () {
    var optionsData = this.data.optionsData
    if (!this.data.checkedAddress) return app.Tips({ title: '请选择收货地址' });
    if (optionsData.cid) {
      var cid = JSON.parse(optionsData.cid)
      this.cartPay(cid)
    }
    if (optionsData.num) {//单个商品立即购买支付
      this.buynowPay(optionsData)
    }

  },
  //立即购买支付
  buynowPay: function (optionsData) {
    var that = this
    console.log(optionsData)
    var grderAllGmData = {
      gid:  optionsData.gid*1,
      num: optionsData.num * 1,
      sku_id: optionsData.sku_id * 1,
      uid: wx.getStorageSync('uid'),
      aid: that.data.checkedAddress.ad_id,
      openid: wx.getStorageSync('openid'),
      cid:0
    }
    // wx.navigateTo({
    //   url: '/pages/cart/cart',
    // })
    util.request(api.OrderGm, grderAllGmData, "POST").then(function (res) {
      that.requestPayment(res);
    })
  },
  //购物车支付
  cartPay: function (optionsData) {
    var that = this
    var grderAllGmData = {
      cart_id: optionsData,
      uid: wx.getStorageSync('uid'),
      aid: that.data.checkedAddress.ad_id,
      openid: wx.getStorageSync('openid'),
      cid:0
    }

    util.request(api.OrderAllGm, grderAllGmData, "POST").then(function (res) {
      that.requestPayment(res);
    })
  },
  //申请支付
  requestPayment: function (obj) {
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      'success': function (res) {
        util.request(api.OrderSuccess, { order_sn: obj.order_sn }, "POST").then(function (res) {
          wx.reLaunch({
            url: '/pages/order/index?status=false&order=' + obj.order_sn
          })
        });
      },
      'fail': function (res) {
        console.log(obj.order_sn)
        wx.reLaunch({
     
          url: '/pages/order/index?status=false&order=' + obj.order_sn
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '杭州注册公司代理',
      desc: '杭州注册公司代理',
      path: '/pages/gr_index/index'
    }
  },
})