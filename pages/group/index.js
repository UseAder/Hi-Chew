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
    ImageUrl: api.ImageUrl,

    CouponList: [],
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '领卷中心', //导航栏 中间的标题
    },
    height: app.globalData.height * 2 + 20,
    userInfo: {
      nickname: app.globalData.userInfo.nickname,
      avatar: app.globalData.userInfo.avatar
    },
  },
  onShow: function () {
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
          console.log(1.3)
          that.setData({
            userInfo: app.globalData.userInfo,
          })
        }
      }
    }
  },
  /**
 * 调用微信登录
 */
  userInfoHandler: function () {
    var that = this
    user.loginByWeixin().then((res) => {
      console.log(res.data)
      if (res.code == 200) {
        that.setData({
          userInfo: res.data
        })
        that.getGroupList()

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getGroupList()
    this.setData({
      couponBanner: app.globalData.couponBanner
    })
  },
  toGroupType(e) {
    let that = this, id = e.currentTarget.dataset.id;
    console.log(id)
    app.Tips('/pages/groupType/index?did=' + id)
  },
  couponAchieve(e) {
    let that = this, did = e.currentTarget.dataset.id, Index = e.currentTarget.dataset.index;
    util.request(api.ReceiveCoupon, { uid: app.globalData.uid,did:did },'post').then(function (res) {
      if (res.code === 200) {
        app.Tips({ title: '领取成功', icon: 'success' })
      that.data.CouponList[Index].u_status = 1
      that.setData({ CouponList: that.data.CouponList });
      }else{
        app.Tips({ title: res.msg })
      }
    });
  },
  getGroupList() {
    let that = this;
    util.request(api.Coupon, { uid: app.globalData.uid }, 'post').then(function (res) {
      if (res.code === 200) {
        var CouponList=[]
        for(var i in res.data){
          if (res.data[i].status == 0 && res.data[i].u_status != 2){
            CouponList.push(res.data[i])
          }
        }
        that.setData({
          CouponList: CouponList
        });
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})