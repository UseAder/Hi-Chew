const app = getApp()
const util = require('../../utils/util.js');
const DataJson = require('../../utils/dataJson.js');
const api = require('../../config/api.js');
var t = require("../../lib/wxParse/wxParse.js")
const base64 = require('../../utils/base64src.js');
var user = require('../../services/user.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
 userInfo: {
      nickname: app.globalData.userInfo.nickname,
      avatar: app.globalData.userInfo.avatar
    },
    isPay:false,
    gid: null,
    cid: null, //收藏id
    window: true,//参数弹框
    userCollect: false, //收藏
    shichiObject: {
      bgImages: '', //分享活动商品背景图
      codeImage: '', //分享活动二维码背景图
      title: '',
      desc: '',
      name: '嘿咻', //分享活动商品名称
      explain: '发现更多快乐', //分享活动商品说明
    },
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '商品详情', //导航栏 中间的标题
    },
    height: app.globalData.height * 2 + 20,
    ImageUrl: api.ImageUrl,

    //海报绘图标签
    canvasStatus: false,
    // 海报展示
    posterImageStatus: false,
    //海报图片路径
    posterImage: '',
    // 分享弹框
    actionSheetHidden: true,
    openSettingBtnHidden: true,//授权图片保存本地

    noCollectImage: "/images/search/sc0.png",
    hasCollectImage: "/images/search/sc1.png",
    collectBackImage: "/images/search/sc0.png",
    cartCount: 0, //购物车内商品数
    //是否打开属性组件
    isOpen: false,
    //规格数量属性  
    attribute: {
      'cartAttr': false,
    },
    //规格数量属性组件展示属性
    productAttr: [],
    //规格数量属性选中规格
    productSelect: {},
    ListSwiper: DataJson.ListSwiper,
  },

  /**
   * 1。试吃弹框出现  （去试吃）
   * 
   */
  listenerActionSheet: function (e) {
    var that = this
    that.actionSheetModel()
  },
  // 2.分享打开和关闭
  actionSheetModel: function () {
    var that = this
    // 获取这个试吃商品id
    that.setData({
      'actionSheetHidden': !that.data.actionSheetHidden,
    })
    // 3.生成二维码
    that.goPoster()
  },

  /**
   * 生成海报
   */
  goPoster: function () {
    var that = this
    // canvas画布隐藏
    that.setData({
      canvasStatus: true
    });
    console.log(that.data.shichiObject)
    // 生成二维码分享图海报
    // that.downloadFilePromotionCode(function (msgPromotionCode) {
    //   //获取网络图片本地路径
    //   wx.getImageInfo({
    //     src: that.data.shichiObject.bgImages, //服务器返回的图片地址
    //     success: function (res) {
    //       //res.path是网络图片的本地地址
    //       let Path = res.path;
    //       console.log(msgPromotionCode)
          that.setData({
            // 'shichiObject.bgImages': Path,
            // 'shichiObject.codeImage': Path,
            'shichiObject.bgImages': 'https://hangfoxs.oss-cn-hangzhou.aliyuncs.com/snack/201908055d47ed3be08511665.jpeg',
            'shichiObject.codeImage': 'https://hangfoxs.oss-cn-hangzhou.aliyuncs.com/snack/201908055d47ed362a7592825.jpeg',
            // 'shichiObject.codeImage': Path msgPromotionCode,


          })
          console.log(that.data.shichiObject)

          util.ShichiCanvas(that.data.shichiObject, function (tempFilePath) {
            that.setData({
              posterImage: tempFilePath,
              posterImageStatus: true,
              canvasStatus: false,
            })
          });
    //     },
    //     fail: function (res) {
    //       //失败回调
    //     }
    //   })

    // })
  },
  /**
   * 获取产品分销二维码
   * @param function successFn 下载完成回调
   * 
   */
  downloadFilePromotionCode: function (successFn) {
    var that = this;
    util.request(api.GetWxcode, {
      path: "pages/goods/index",
      gid: that.data.gid,
    }, 'POST').then(function (res) {
      if (res.msg == '二维码生成失败') {
        app.Tips({
          title: '二维码生成失败',
          icon: 'none'
        });
      }
      if (res.data) {
        base64.base64src(res.data).then(
          function (data) {
            successFn(data);
            console.log(data)

          }
        )
      }
    })
  },
  /*
  * 保存到手机相册
  */

  savePosterPath: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        console.log(res)
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.saveImageToPhotosAlbum({
                filePath: that.data.posterImage,
                success: function (res) {
                  that.posterImageClose();
                  app.Tips({
                    title: '保存成功',
                    icon: 'success'
                  });
                },
                fail: function (res) {
                  app.Tips({
                    title: '保存失败'
                  });
                }
              })
            },
            fail() {
              wx.openSetting({
                success: function (data) {
                  console.log("openSetting success");
                },
                fail: function (data) {
                  wx.showModal({
                    title: '警告',
                    content: '若不打开授权，则无法将图片保存在相册中！',
                    showCancel: false
                  })
                  that.setData({
                    openSettingBtnHidden: false
                  })
                  console.log("openSetting fail");
                }
              });
            }
          })
        } else {
          wx.saveImageToPhotosAlbum({
            filePath: that.data.posterImage,
            success: function (res) {
              that.posterImageClose();
              app.Tips({
                title: '保存成功',
                icon: 'success'
              });
            },
            fail: function (res) {
              app.Tips({
                title: '保存失败'
              });
            },
          })
        }
      }
    })
  }, handleSetting: function (e) {
    let that = this;
    // 对用户的设置进行判断，如果没有授权，即使用户返回到保存页面，显示的也是“去授权”按钮；同意授权之后才显示保存按钮
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      wx.showModal({
        title: '警告',
        content: '若不打开授权，则无法将图片保存在相册中！',
        showCancel: false
      })
      that.setData({
        openSettingBtnHidden: false
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您已授权，赶紧将图片保存在相册中吧！',
        showCancel: false
      })
      that.setData({
        openSettingBtnHidden: true
      })
    }
  },
  //隐藏海报
  posterImageClose: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },

  // 关闭个人资料弹框
  onColse: function () {
    this.setData({
      window: true
    });
  },
  openWindow: function () {
    this.setData({
      window: false
    })
  },
  phoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.replyPhone,
      success: function () {
        console.log("成功拨打电话")
      },
    })
  },
  openCartPage: function () {
    app.Tips('/pages/cart/index')
  },
  /**
   * 打开规格数量属性插件
   */
  onMyEvent: function (e) {
    this.setData({
      'attribute.cartAttr': e.detail.window,
      // isOpen: false
    })
  },

  /**
   * 默认选中属性
   * 
   */
  DefaultSelect: function () {
    var that = this
    var productAttr = that.data.productAttr
    var goods = that.data.goods;
    //只有一个默认选择
    console.log(productAttr)

    for (var i = 0, len = productAttr.length; i < len; i++) {
      if (productAttr[i].spec_list[0].id) productAttr[i].checked = productAttr[i].spec_list[0].id;
    }
    // console.log(productAttr)
    // for (var i = 0, len = productAttr.length; i < len; i++) {
    //   if (productAttr[i].spec_list.length == 1)
    //     productAttr[i].checked = productAttr[i].spec_list[0].id;
    // }
    var value = this.data.productAttr.map(function (attr) {
      return attr.checked;
    });

    console.log(this.data.productAttr)
    console.log(value)
    var productSelect = that.data.productValue[value.join('_')];
    console.log(productSelect)
    if (productSelect) {
      that.setData({
        ["productSelect.image"]: api.ImageUrl + productSelect.spec_image,
        ["productSelect.price"]: productSelect.goods_price,
        ["productSelect.stock"]: productSelect.stock_num,
        ['productSelect.cart_num']: 1,
        ['productSelect.id']: productSelect.goods_spec_id,
        attrValue: value.join('_'),
        attr: '已选择'
      });
      console.log(that.data.productSelect)
    } else {
      // for (var i = 0, len = productAttr.length; i < len; i++) {
      //   if (productAttr[i].valueList[0])
      //    productAttr[i].checked = productAttr[i].valueList[0]
      // }
      // console.log(productAttr)
      // that.setData({
      //   ["productSelect.image"]: api.ImageUrl + goods.banner,
      //   ["productSelect.price"]: goods.discount,
      //   ["productSelect.stock"]: goods.store,
      //   ['productSelect.id']: null,
      //   ['productSelect.cart_num']: 1,
      //   attrValue: '',
      //   attr: '请选择规格数量'
      // })
    }
    that.setData({
      productAttr: productAttr
    });
  },
  /**
   * 
   * 属性变动赋值
   * 
   */
  ChangeAttr: function (e) {
    var values = e.detail;
    var that = this
    console.log(that.data.productValue)
    var productSelect = that.data.productValue[values];
    var goods = that.data.goods;
    console.log(productSelect)
    console.log(values)
    if (productSelect) {
      this.setData({
        ["productSelect.image"]: api.ImageUrl + productSelect.spec_image,
        ["productSelect.price"]: productSelect.goods_price,
        ["productSelect.stock"]: productSelect.stock_num,
        ['productSelect.cart_num']: 1,
        ['productSelect.id']: productSelect.goods_spec_id,
        attrValue: values,
        attr: '已选择'
      });
    } else {
      this.setData({
        ["productSelect.image"]: goods.pic,
        ["productSelect.price"]: 0.00,
        ["productSelect.stock"]: 0,
        ['productSelect.cart_num']: 0,
        attrValue: '',
        attr: '请选择'
      });
    }
  },
  /**
   * 购物车数量加和数量减
   * 
   */
  ChangeCartNum: function (e) {
    //是否 加|减
    var changeValue = e.detail;
    //获取当前变动属性
    console.log(changeValue)

    var productSelect = this.data.productValue[this.data.attrValue];
    console.log(productSelect)
    console.log(this.data.attrValue)

    console.log(this.data.productAttr)
    //如果没有属性,赋值给商品默认库存
    // if (productSelect === undefined && !this.data.productAttr.length) 
    if (productSelect === undefined && !this.data.productAttr.length)
      productSelect = this.data.productSelect;
    //不存在不加数量
    if (productSelect === undefined) return;
    //提取库存
    var stock = productSelect.stock_num || 0;
    //设置默认数据
    if (productSelect.cart_num == undefined) productSelect.cart_num = 1;

    //数量+
    if (changeValue) {
      productSelect.cart_num++;
      //大于库存时,等于库存
      if (productSelect.cart_num > stock) productSelect.cart_num = stock;
      this.setData({
        ['productSelect.cart_num']: productSelect.cart_num,
        cart_num: productSelect.cart_num
      });
    } else {
      //数量减
      productSelect.cart_num--;
      //小于1时,等于1
      if (productSelect.cart_num < 1) productSelect.cart_num = 1;
      this.setData({
        ['productSelect.cart_num']: productSelect.cart_num,
        cart_num: productSelect.cart_num
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    if (!option.gid || option.gid == '') return app.Tips({
      title: '缺少查询信息无法查看'
    });
    this.setData({
      gid: parseInt(option.gid)
    });
    this.getGoodsInfo()
    this.getCartLength()
  },
  //加入购物车
  joinCart: function () {
    this.setData({
      isPay:false
    })
    this.goCat();

  },
  /*
   * 立刻购买
   */
  goBuy: function () {
    this.setData({
      isPay: true
    })
    this.goCat();
  },
  ConfirmClose :function (e) {
    var that=this
    var productSelect = that.data.productValue[that.data.attrValue]

    // if (that.data.attrValue) {
    //   //默认选中了属性，但是没有打开过属性弹窗还是自动打开让用户查看默认选中的属性
    //   that.setData({
    //     'attribute.cartAttr': !that.data.isOpen ? true : false
    //   })
    // } else {
    //   if (that.data.isOpen)
        that.setData({
          'attribute.cartAttr': true
        })
    //   else
    //     that.setData({
    //       'attribute.cartAttr': !that.data.attribute.cartAttr
    //     });
    // }
    // // //只有关闭属性弹窗时进行加入购物车
    // if (that.data.attribute.cartAttr === true && that.data.isOpen == false) return that.setData({
    //   isOpen: true
    // });
    // //如果有属性,没有选择,提示用户选择
    if (that.data.productAttr.length && productSelect === undefined && that.data.isOpen == true) return app.Tips({
      title: '商品未选，或库存不足，请重新选择'
    });
    that.setData({
      // isOpen: false,
      'attribute.cartAttr': false
    });
     if (that.data.isPay) {
      var option = ''
      option = "gid=" + that.data.gid + "&uid=" + wx.getStorageSync('uid') + "&sku_id=" + that.data.productSelect.id + "&num=" + that.data.productSelect.cart_num
      // console.log(option)
      wx.navigateTo({
        url: '/pages/shop-checkout/index?' + option
      });

    } else {
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
  },
  goCat: function () {
    var that = this;
    var productSelect = that.data.productValue[that.data.attrValue]
    console.log(that.data.productValue)
    console.log(that.data.attrValue)
    console.log(productSelect)
    //打开属性
    that.setData({
        'attribute.cartAttr': true
      })

    // if (that.data.attrValue) {
    //   //默认选中了属性，但是没有打开过属性弹窗还是自动打开让用户查看默认选中的属性
    //   that.setData({
    //     'attribute.cartAttr': !that.data.isOpen ? true : false
    //   })
    // } else {
    //   if (that.data.isOpen)
    //     that.setData({
    //       'attribute.cartAttr': true
    //     })
    //   else
    //     that.setData({
    //       'attribute.cartAttr': !that.data.attribute.cartAttr
    //     });
    // }
    // // //只有关闭属性弹窗时进行加入购物车
    // if (that.data.attribute.cartAttr === true && that.data.isOpen == false) return that.setData({
    //   isOpen: true
    // });
    // // //如果有属性,没有选择,提示用户选择
    // if (that.data.productAttr.length && productSelect === undefined && that.data.isOpen == true) return app.Tips({
    //   title: '商品未选，或库存不足，请重新选择'
    // });
    // that.setData({
    //   isOpen: false,
    //   'attribute.cartAttr': false
    // });
    // if (isPay) {
    //   var option = ''
    //   option = "gid=" + that.data.gid + "&uid=" + wx.getStorageSync('uid') + "&sku_id=" + that.data.productSelect.id + "&num=" + that.data.productSelect.cart_num
    //   // console.log(option)
    //   wx.navigateTo({
    //     url: '/pages/shop-checkout/index?' + option
    //   });

    // } else {
    //   //   // console.log(that.data.attrValue)
    //   var goodsAll = {}
    //   goodsAll.uid = app.globalData.uid
    //   goodsAll.gid = that.data.gid

    //   goodsAll.spec_id = that.data.productSelect.id

    //   goodsAll.num = that.data.productSelect.cart_num

    //   //   goodsAll.goods_speci = that.data.attrValue;
    //   //   goodsAll.goods_speci_id = that.data.productSelect.id
    //   console.log(goodsAll)
    //   util.request(api.CartAdd, goodsAll, "POST").then(function (res) {
    //     // console.log(res)
    //     if (res.code == 200) {

    //       that.getCartCount(true);
    //       app.Tips({
    //         title: '添加购物车成功',
    //         icon: 'success'
    //       });
    //     }
    //   });
    // }
  },
  /**
   * 获取购物车数量
   * @param boolean 是否展示购物车动画和重置属性
   */
  getCartCount: function (isAnima) {
    var that = this;
    that.getCartLength()
    //加入购物车后重置属性
    // if (isAnima) {
    //   //只有一个默认选择
    //   var productAttr = this.data.productAttr
    //   for (var i = 0, len = productAttr.length; i < len; i++) {
    //     productAttr[i].checked = '';
    //   }
    //   that.setData({
    //     attrValue: '',
    //     attr: '请选择',
    //     ["productSelect.image"]: that.data.goods.pic,
    //     ["productSelect.price"]: that.data.goods.price,
    //     ['productSelect.cart_num']: 1,
    //   });
    //   that.setData({
    //     productAttr: productAttr
    //   });
    // }
  },
  getGoodsInfo: function (e) {
    var that = this
    util.request(api.GoodsDetails, {
      goods_id: that.data.gid,
      uid: app.globalData.uid
    }, "POST").then(function (res) {
      if (res.code == 200) {
        var goods = {};
        var details = JSON.parse(res.data.data.details)
        goods.name = res.data.data.name,
          goods.details = details,
          goods.describe = res.data.data.describe,
          goods.discount = res.data.data.discount,
          goods.banner = res.data.data.images.split(',')
        that.setData({
          goods: goods,
          cid: res.data.cid,
          userCollect: res.data.sc,
          productAttr: res.data.arr.list || [],
          productValue: res.data.arr.sku || {},
          'shichiObject.bgImages': res.data.data.brand,
          'shichiObject.title': res.data.data.name,
          'shichiObject.desc': res.data.data.describe
        })
        if (that.data.userCollect) {
          that.setData({
            'collectBackImage': that.data.hasCollectImage
          });
        } else {
          that.setData({
            'collectBackImage': that.data.noCollectImage
          });
        }
        that.DefaultSelect()
        , t.wxParse("goodsDetail", "html", res.data.data.parameter, that);
      }
    })
  },
  // 收藏
  closeAttrOrCollect: function () {
    var that = this,
      utilApi = '';
    let collect = {}
    if (!that.data.userCollect) {
      utilApi = api.UserAdd
      collect.gid = that.data.gid
      collect.uid = app.globalData.uid
    } else {
      utilApi = api.UserDeleted
      collect.cid = that.data.cid
      collect.uid = app.globalData.uid
    }
    util.request(utilApi, collect, "POST").then(function (res) {
      if (res.code === 200) {
        that.setData({
          userCollect: !that.data.userCollect
        })
        that.getGoodsInfo()
      }
    })
  },
  // 购物车商品数量
  getCartLength: function () {
    var that = this
    console.log('戴凯杰')

    console.log(app.globalData.uid)
    console.log('戴凯杰')

    util.request(api.Cart, {
      uid: app.globalData.uid,
    }, 'post').then(function (res) {
      if (res.data)
        that.setData({
          cartCount: res.data.length
        });
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})