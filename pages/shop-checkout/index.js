const app = getApp()
const util = require('../../utils/util.js');
const DataJson = require('../../utils/dataJson.js');
const api = require('../../config/api.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    discount: {
      discountAmount: '',
      discountId: '',
      discountPrice: 0,
      discountTotal: 0
    },
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '填写订单信息', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    ImageUrl: api.ImageUrl,
    coupon: [], //优惠卷l列表


    optionsData: {},
    total: null, //合计
    checkedAddress: {},
    checkedGoodsList: [],
  },

  goCouponSelect() {
    //选择该优惠劵
    var that = this,
      coupon = that.data.coupon
    wx.navigateTo({
      url: "/pages/coupon-select/index?couponSelectData=" + JSON.stringify(coupon)
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      optionsData: options
    })

  },
  onShow: function() {
    var that = this
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    if (currPage.data.discountId) {
      
      var optionsData = this.data.optionsData
      if (optionsData.cid) {
        that.setData({
          //将携带的参数赋值
          'discount.di_type': currPage.data.di_type,
          'discount.types': currPage.data.types,
        });
        var checkedGoodsList = that.data.checkedGoodsList,
          sumTotal = 0;
        console.log(checkedGoodsList)
        if (that.data.discount.di_type == 1) {
          for (var i in checkedGoodsList) {
            if (checkedGoodsList[i].type_id == that.data.discount.types) {
              sumTotal += 1 * (checkedGoodsList[i].num * checkedGoodsList[i].goods_price * that.data.discountAmount * 0.1).toFixed(2)
            } else {
              sumTotal += 1 * (checkedGoodsList[i].num * checkedGoodsList[i].goods_price).toFixed(2)
            }
          }
        }
        else {
          for (var i in checkedGoodsList) {
            if (checkedGoodsList[i].goods_id == that.data.discount.types) {
              sumTotal += 1 * (checkedGoodsList[i].num * checkedGoodsList[i].goods_price * that.data.discountAmount * 0.1).toFixed(2)
            } else {
              sumTotal += 1 * (checkedGoodsList[i].num * checkedGoodsList[i].goods_price).toFixed(2)
            }
          }
        }
      }
      if (optionsData.num) { //单个商品立即购买支付
       var sumTotal = 0;
        sumTotal = 1 * (that.data.discountAmount * 0.1* that.data.total).toFixed(2)
      }

     

      that.setData({
        //将携带的参数赋值
        'discount.discountAmount': currPage.data.discountAmount || 1,
        'discount.discountId': currPage.data.discountId || '',
        'discount.discountTotal': sumTotal.toFixed(2),
        'discount.discountPrice': (that.data.total -sumTotal).toFixed(2)
      });
      currPage.data.discountId = null
      currPage.data.discountAmount = null
      currPage.data.discountId = null
      currPage.data.discountAmount = null
    } else {
      that.setData({
        //将携带的参数赋值discountPrice
        'discount.discountPrice': '',
        'discount.discountAmount': '',
        'discount.discountId': '',
        'discount.di_type': '',
        'discount.types': '',
      });
      var optionsData = this.data.optionsData
      if (optionsData.cid) {
        var cid = JSON.parse(optionsData.cid)
        this.orderIndexAll(cid)
      }
      if (optionsData.num) {
        this.orderDan(optionsData)
      }
    }
    // }
  },
  // 选择地址
  selectAddress() {
    //选择该收货地址
    wx.navigateTo({
      url: "/pages/address-select/index"
    });
  },
  // 单个商品
  orderDan: function(options) {
    console.log(options)
    var that = this
    var grderAllGmData = {
      gid: options.gid * 1,
      num: options.num * 1,
      sku_id: options.sku_id * 1,
      uid: wx.getStorageSync('uid')
    }
    util.request(api.OrderDan, grderAllGmData, "POST").then(function(res) {
      var goods = [{
        goods_price: res.data.goods_price,
        goods_image: res.data.goods_list[0].spec_image,
        name: res.data.goods_name,
        num: that.data.optionsData.num,
        goods_id: res.data.goods_id,
        sku_value: res.data.sku
      }]
      var checkedAddress = res.address
      that.setData({
        checkedGoodsList: goods,
        total: res.data.total,
        'discount.discountTotal': res.data.total,
        checkedAddress: res.data.address,
        coupon: res.data.coupon,

      })
    })
  },
  // 批量商品
  orderIndexAll: function(cidArray) {
    var that = this
    util.request(api.OrderIndexAll, {
      cid: cidArray,
      uid: wx.getStorageSync('uid'),

    }, "POST").then(function(res) {
      if (res.code === 200) {
        var goods_list = res.data.goods_list
        for (var i in goods_list) {
          goods_list[i].num = goods_list[i].num * 1
          goods_list[i].goods_price = goods_list[i].goods_price * 1
        }
        that.setData({
          checkedGoodsList: goods_list,
          total: res.data.total,
          checkedAddress: res.data.address,
          'discount.discountTotal': res.data.total,
          coupon: res.data.coupon,

        })
      }

    })
  },
  // 立即购买
  submitOrder: function() {
    var optionsData = this.data.optionsData
    if (!this.data.checkedAddress) return app.Tips({
      title: '请选择收货地址'
    });
    if (optionsData.cid) {
      var cid = JSON.parse(optionsData.cid)
      this.cartPay(cid)
    }
    if (optionsData.num) { //单个商品立即购买支付
      this.buynowPay(optionsData)
    }

  },
  //立即购买支付
  buynowPay: function(optionsData) {
    var that = this
    console.log(optionsData)
    var grderAllGmData = {
      gid: optionsData.gid * 1,
      num: optionsData.num * 1,
      sku_id: optionsData.sku_id * 1,
      uid: wx.getStorageSync('uid'),
      aid: that.data.checkedAddress.ad_id,
      openid: wx.getStorageSync('openid'),
      cid: that.data.discount.discountId||0

    }
    // wx.navigateTo({
    //   url: '/pages/cart/cart',
    // })
    util.request(api.OrderGm, grderAllGmData, "POST").then(function(res) {
      that.requestPayment(res);
    })
  },
  //购物车支付
  cartPay: function(optionsData) {
    var that = this
    var grderAllGmData = {
      cart_id: optionsData,
      uid: wx.getStorageSync('uid'),
      aid: that.data.checkedAddress.ad_id,
      openid: wx.getStorageSync('openid'),
      cid: that.data.discount.discountId

    }

    util.request(api.OrderAllGm, grderAllGmData, "POST").then(function(res) {
      that.requestPayment(res);
    })
  },
  //申请支付
  requestPayment: function(obj) {
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      'success': function(res) {
        util.request(api.OrderSuccess, {
          order_sn: obj.order_sn
        }, "POST").then(function(res) {
          wx.reLaunch({
            url: '/pages/order/index?status=false&order=' + obj.order_sn
          })
        });
      },
      'fail': function(res) {
        console.log(obj.order_sn)
        wx.reLaunch({

          url: '/pages/order/index?status=false&order=' + obj.order_sn
        })
      }
    })
  },
  onShareAppMessage: function() {
    return {
      title: '杭州注册公司代理',
      desc: '杭州注册公司代理',
      path: '/pages/gr_index/index'
    }
  },
})