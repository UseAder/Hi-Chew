var app = getApp();
const DataJson = require('../../utils/dataJson.js');
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '地址管理', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    var that = this;
    that.getAddressList();
  },
  getAddressList: function() {
    var that = this;
    util.request(api.AddressList, {
      uid: app.globalData.uid
    }, 'post').then(function(res) {
      if (res.code === 200) {
        var addressList = res.data
        for (var i in addressList) {
          addressList[i].ad_city = addressList[i].ad_city.split("&")
        }
        that.setData({
          addressList: addressList || []
        });
      }
    })
  },
  /**
   * 设置默认地址（1）
   */
  radioChange: function(e) {
    console.log(e.detail)
    var index = parseInt(e.detail.value),
      that = this;;
    var address = this.data.addressList[index];
    if (address == undefined) return app.Tips({
      title: '您设置的默认地址不存在!'
    });
    console.log(address)
    var value = {}
    value.aid = address.ad_id
    value.address = address.ad_address
    value.city = address.ad_city.join('');
    value.name = address.ad_name
    value.phone = address.ad_phone
    value.is_default = true
    value.uid = address.uid
    util.request(api.AddressPut, value, "POST"
    ).then(function (res) {
      console.log(res)
      for (var i = 0, len = that.data.addressList.length; i < len; i++) {
        if (i == index) that.data.addressList[i].is_default = true;
        else that.data.addressList[i].is_default = false;
      }
      app.Tips({
        title: '地址设置成功',
        icon: 'success'
      }, function () {
        that.setData({
          addressList: that.data.addressList
        });
      });
    })
  },
  /**
   * 新增地址
   */
  addAddress: function() {
    wx.navigateTo({
      url: '/pages/address-add/index'
    })
  },
  /**
   * 编辑地址
   */
  editAddress: function(e) {
    var index = e.currentTarget.dataset.index,
      that = this,
      addressDefault = this.data.addressList[index];
    wx.navigateTo({
      url: '/pages/address-add/index?addressDefault=' + JSON.stringify(addressDefault)
    })
  },
  /**
   * 删除地址（1）
   */
  delAddress: function(e) {
    var index = e.currentTarget.dataset.index,
      that = this,
      address = this.data.addressList[index];
    if (address == undefined) return app.Tips({
      title: '您删除的地址不存在!'
    });
    wx.showModal({
      title: '系统提醒',
      content: '确定要删除此地址吗？',
      success: function(res) {
        if (res.confirm) {
          util.request(api.AddressDelete, { aid: address.ad_id }, "post"
          ).then(function (res) {
            app.Tips({ title: '删除成功', icon: 'success' });
            that.data.addressList.splice(index, 1);
            that.setData({ addressList: that.data.addressList });
          })
        } else if (res.cancel) {
          return false;
        }
      }
    })
  },
  onShareAppMessage: function() {

  },
})