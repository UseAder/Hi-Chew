const app = getApp()
const DataJson = require('../../utils/dataJson.js');
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
var user = require('../../services/user.js');

Page({
  data: {
    

puBuLiu:{
  scrollH: 0,
  imgWidth: 0,
  loadingCount: 0,
  images: [],
  col1: [],
  col2: []
},

    userInfo: {
      nickname: app.globalData.userInfo.nickname,
      avatar: app.globalData.userInfo.avatar
    },
    ImageUrl: api.ImageUrl,
    animationTime: '1000ms',
    status: 'paused',//paused,running
    ReturnData: {
      'banner': [], //轮播图
      'type': [], //分类
      'slogan': [], //横幅
      'sales': [], //发现好物
      'good': [], // 精品推荐
    },
    navDesc: ['28分钟快送', '满20免费送', '24小时服务'],

    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '嘿咻 Hi-Chew', //导航栏 中间的标题
      gwc:1
    },
    // 此页面页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    navHeight: 160,
  },
  onImageLoad: function (e) {
    console.log(e)
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width;         //图片原始宽度
    let oImgH = e.detail.height;        //图片原始高度
    let imgWidth = this.data.puBuLiu.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;        //比例计算
    let imgHeight = oImgH * scale;      //自适应高度

    let images = this.data.images;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;

    if (col1H <= col2H) {
      col1H += imgHeight;
      col1.push(imageObj);
    } else {
      col2H += imgHeight;
      col2.push(imageObj);
    }

    // let data = {
    //   loadingCount: loadingCount,
    //   col1: col1,
    //   col2: col2
    // };

    // if (!loadingCount) {
    //   data.images = [];
    // }

    // this.setData(data);
  },



  onLoad: function() {
    var that = this
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;

        this.setData({
          'puBuLiu.scrollH': scrollH,
          'puBuLiu.imgWidth': imgWidth
        });

        that.getIndexData()

      }
    })
  },
  inputKeyword: function () {
    app.Tips('/pages/search/index')
  },
  toGoods:function(e){
    var gid = e.currentTarget.dataset.gid;
    wx.navigateTo({
      url: '/pages/goods/index?gid='+gid
    })
  },
// hua
  refresh:function(){
    var that = this;
  
    that.setData({
      status: 'running'
      })
    util.request(api.PagePage,{},'post').then(function (res) {
      that.setData({
        status: 'paused'
      })
      if (res.code === 200) {
        that.setData({
          'ReturnData.sales': res.data
        })
      }
    })
  },
  /*
   **首页menu
   */
  getIndexData: function() {
    var that = this;
    util.request(api.IndexUrl).then(function(res) {
      if (res.code === 200) {
        that.setData({
          ReturnData: res.data
        })
        wx.setStorageSync('navList', that.data.ReturnData.type)
        util.get_wxml('#publish', that.publishCallback)
      }
    })
  },
  //  回调获取导航高度
  publishCallback: function(rect) {
    var that = this
    that.setData({
      navHeight: rect[0].height
    })
  },
  joinCart:function(e){
    //   // console.log(that.data.attrValue)
    var goodsAll = {}
    goodsAll.uid = app.globalData.uid
    goodsAll.gid = that.data.gid

    goodsAll.spec_id = that.data.productSelect.id

    goodsAll.num = that.data.productSelect.cart_num

    //   goodsAll.goods_speci = that.data.attrValue;
    //   goodsAll.goods_speci_id = that.data.productSelect.id
    console.log(goodsAll)
    util.request(api.CartAdd, goodsAll, "POST").then(function (res) {
      // console.log(res)
      if (res.code == 200) {

        that.getCartCount(true);
        app.Tips({
          title: '添加购物车成功',
          icon: 'success'
        });
      }
    });
  }
  , /**
   * 生命周期函数--监听页面显示
   */
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
  
})