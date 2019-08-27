
const app = getApp()
const util = require('../../utils/util.js');
const DataJson = require('../../utils/dataJson.js');
const api = require('../../config/api.js');
var user = require('../../services/user.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  


    CouponList: [],
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '可使用优惠卷', //导航栏 中间的标题
    },
    height: app.globalData.height * 2 + 20,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var couponSelectData = []
    if (options.couponSelectData) {
      couponSelectData = JSON.parse(options.couponSelectData);
      this.getGroupList(couponSelectData)
    }
  },
  toGroupType(e) {
    let that = this,
      id = e.currentTarget.dataset.id,
      discount = e.currentTarget.dataset.amount,
      di_type = e.currentTarget.dataset.di_type,
      types = e.currentTarget.dataset.types;
    var pages = getCurrentPages();   //当前页面
    var prevPage = pages[pages.length - 2];   //上一页面
      prevPage.setData({
        //直接给上一个页面赋值
        discountAmount: discount,
        discountId: id,
        di_type: di_type,
        types: types
      });
      wx.navigateBack({
        //返回
      })
    // }



  },
  getGroupList(couponSelectData) {
    var that=this
    that.setData({
      CouponList: couponSelectData
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})