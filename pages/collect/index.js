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

    GoodList:[],
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示  0表示不显示
      title: '我的收藏', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
  },
  toGoods: function (e) {
    var gid = e.currentTarget.dataset.gid;
    wx.navigateTo({
      url: '/pages/goods/index?gid=' + gid
    })
  },
  //取消 收藏
  closeAttrOrCollect: function (e) {
    var cid = e.currentTarget.dataset.cid;

    var that = this;
    wx.showModal({
      title: '',
      content: '确定删除收藏吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确认');
          util.request(api.UserDeleted, {
            cid: cid,
            uid: app.globalData.uid
          }, "POST").then(function (res) {
            if(res.code===200){
              app.Tips({
                title: '已取消收藏',
                icon: 'success'
              });
              that.getCollectList();
            }
          
          })
        }
      }
    })
  
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    util.WindowHeight(this)
  },
  onShow: function () {
    this.getCollectList();
    
  },
  getCollectList() {
    let that = this;
    util.request(api.Collect, { uid: wx.getStorageSync('uid') },'POST').then(function (res) {
      if (res.code === 200) {
        that.setData({
          GoodList: res.data
        });
      } else {
        that.setData({
          GoodList: []
        });
      }
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})