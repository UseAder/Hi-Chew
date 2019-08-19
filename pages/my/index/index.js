var app = getApp();
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
var user = require('../../../services/user.js');

Page({
  data: {
    ImageUrl: api.ImageUrl,

    window: true,
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '个人中心', //导航栏 中间的标题
    },
    // 此页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    
    avatar: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png',

    userInfo: {
      nickname: app.globalData.userInfo.nickname,
      avatar: app.globalData.userInfo.avatar
    },
    HotelData:{
      id:null
    },
    pathCommission:{
      id: 'commission',
      name: '我的佣金'
    },

    personal: [{
      id: 'coupon',
      name: '我的优惠券'
    }, {
        id: 'collect',
        name: '我的收藏'
    }, {
        id: 'cart',
        name: '我的购物车'
      }, {
        id: 'address-select',
        name: '我的地址', border: 0

      }, {
        id: 'contacts',
        name: '联系客服',

    }, {
        id: 'aftermarket',
        name: '申请售后'
      }],

  },
  onShow: function () {
    var that = this
    if (wx.getStorageSync('HotelData')){
      that.setData({
        HotelData: wx.getStorageSync('HotelData')
      })
    }else{
      that.setData({
        HotelData: {}
      })
    }
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
      }
    })
  },
  // 跳转
  personalOpen: function (e) {
    console.log(e)
    var that=this,id = e.currentTarget.dataset.chart.id
    if (id == 'contacts' || id =='aftermarket'){
      that.setData({ window: false})
    } else if (id == 'cart'){
      wx.switchTab({
        url: '/pages/' + id + '/index'
      })
    }
    else{
      wx.navigateTo({
        url: '/pages/' + id + '/index'
      });
    }
  } ,
  onLoad: function () {
    var that = this
    that.setData({
      couponBanner: app.globalData.couponBanner
    })
  },
  // 关闭个人资料弹框
  onColse: function () {
    this.setData({
      window: true
    });
  },
  login: function () {
     wx.showModal({
      title: "酒店管理",
      content: "退出或更换账号",
      showCancel: !0,
      cancelText: "取消",
      cancelColor: "#000000",
      confirmText: "确定",
      confirmColor: "#3CC51F",
      success: function (n) {
        n.confirm && (wx.removeStorageSync("HotelData"), wx.navigateTo({
          url: "/pages/logs/logs"
        }));
      }
    });
  },
})
