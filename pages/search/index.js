const app = getApp()
const DataJson = require('../../utils/dataJson.js');
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ImageUrl: api.ImageUrl,

    inputShowed: false,
    inputFocus: false,
    inputVal: "",
    nvabarData: {
      showCapsule: 1,//是否显示左上角图标   1表示显示    0表示不显示
      title: '搜索', //导航栏 中间的标题
    },
    // 此页面页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    GoodList:[],//商品列表
    SeoEntryList:[]//词条
  },
  toGoods: function (e) {
    var gid = e.currentTarget.dataset.gid;
    wx.navigateTo({
      url: '/pages/goods/index?gid=' + gid
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true,
      inputFocus: true
    });
  },
  inputBlur: function (e) {
    var that = this
    if (e.detail.value) {
      that.setData({
        inputVal: e.detail.value,
        inputShowed: true,
      });
    } else {

      that.setData({
        inputVal:'',

        inputShowed: false,
      });
    }
    if (that.data.inputVal){
      that.SeoList(that.data.inputVal)

    }

  },

  SeoList: function (title) {
    let that = this;
    util.request(api.SeoList, { title:title},'post').then(function (res) {
      if (res.code === 200) {
        that.setData({
          GoodList: res.data
        });
      }
    });
  },
  SeoEntry: function (){
    let that = this;
    util.request(api.Seo, { }, 'post').then(function (res) {
      if (res.code === 200) {
        that.setData({
          SeoEntryList: res.data
        });
      }
    });
  },
  SeoEntryData: function (e) {
    var sid = e.currentTarget.dataset.sid
    let that = this;
    util.request(api.Seoseo, { sid: sid}, 'post').then(function (res) {
      if (res.code === 200) {
        var list=res.data,arr=[];
        for(var i in list){
          for (var j in list[i]) {
            arr.push(list[i][j])
          }
        }
        that.setData({
          GoodList: arr
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.SeoEntry()//词条获取
    this.setData({
      couponBanner: app.globalData.couponBanner
    })
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