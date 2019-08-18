var app = getApp();
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({
  data: {
    ImageUrl: api.ImageUrl,

    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '分类', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    navList: [],
    goodsList: [],
    id: null,
    page: 1,
    loading: false,//是否加载中
    loadend: false,//是否加载完毕
    loadTitle: '',//提示语
  },
  toGoods: function (e) {
    var gid = e.currentTarget.dataset.gid;
    wx.navigateTo({
      url: '/pages/goods/index?gid=' + gid
    })
  },
  onLoad: function (options) {
    // 页面初始化 
    if (!options.id) return app.Tips({ title: '缺少商品ID无法查询' });
    if (options.id) {
      this.setData({
        id: options.id,
        navList: wx.getStorageSync('navList')
      });
    }
    this.goodsGoods()
  },
  //分类商品
  goodsGoods: function () {
    var that = this;
    if (that.data.loadend) return;
    if (that.data.loading) return;
    that.setData({
      loading: true, loadTitle: ''
    })
    util.request(api.PageDetailsPage, { page: that.data.page, type_id: Number(that.data.id) },'post')
      .then(function (res) {
        if (res.code != 200) return
        var list = res.data || [];
        var loadend = list.length < 5
        that.data.goodsList = util.SplitArray(list, that.data.goodsList);
          that.setData({
          goodsList: that.data.goodsList,
          page: that.data.page + 1,
          loadend: loadend,
          loading: false,
          loadTitle: loadend ? "我也是有底线的" : '加载更多',
        });
        // var list = res.data.goods.data || [];
        // that.setData({
        //   navList: res.data.cate,
        // });
        // if (!list || list == '') return
        // var loadend = list.length < res.data.goods.per_page
        // that.data.goodsList = util.SplitArray(list, that.data.goodsList);
        // that.setData({
        //   goodsList: that.data.goodsList,
        //   page: that.data.page + 1,
        //   loadend: loadend,
        //   loading: false,
        //   loadTitle: loadend ? "我也是有底线的" : '加载更多',
        // });
      });
  },
  switchCate: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id
    if (that.data.id == id) {
      return false;
    }
    that.setData({
      page: 1,
      loadend: false,
      loading: false,
      goodsList: [],
      id: id
    });
    that.goodsGoods();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.goodsGoods();
  },
  onShareAppMessage: function () {
  
  }
})
