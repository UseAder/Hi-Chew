var api = require('../config/api.js');

// 获取wxml的节点信息
function get_wxml(className, callback) {
  wx.createSelectorQuery().selectAll(className).boundingClientRect(callback).exec()
}
/**
   * opt  object | string
   * to_url object | string
   * 例:
   * this.Tips('/pages/test/test'); 跳转不提示
   * this.Tips({title:'提示'},'/pages/test/test'); 提示并跳转
   * this.Tips({title:'提示'},{tab:1,url:'/pages/index/index'}); 提示并跳转值table上
   * tab=1 一定时间后跳转至 table上
   * tab=2 一定时间后跳转至非 table上
   * tab=3 一定时间后返回上页面
   * tab=4 关闭所有页面跳转至非table上
   * tab=5 关闭当前页面跳转至table上
   */
const Tips = function (opt, to_url) {
  if (typeof opt == 'string') {
    to_url = opt;
    opt = {};
  }
  var title = opt.title || '', icon = opt.icon || 'none', endtime = opt.endtime || 2000;
  if (title) wx.showToast({ title: title, icon: icon, duration: endtime })
  if (to_url != undefined) {
    if (typeof to_url == 'object') {
      var tab = to_url.tab || 1, url = to_url.url || '';
      switch (tab) {
        case 1:
          //一定时间后跳转至 table
          setTimeout(function () {
            wx.switchTab({
              url: url
            })
          }, endtime);
          break;
        case 2:
          //跳转至非table页面
          setTimeout(function () {
            wx.navigateTo({
              url: url,
            })
          }, endtime);
          break;
        case 3:
          //返回上页面
          setTimeout(function () {
            wx.navigateBack({
              delta: parseInt(url),
            })
          }, endtime);
          break;
        case 4:
          //关闭当前所有页面跳转至非table页面
          setTimeout(function () {
            wx.reLaunch({
              url: url,
            })
          }, endtime);
          break;
        case 5:
          //关闭当前页面跳转至非table页面
          setTimeout(function () {
            wx.redirectTo({
              url: url,
            })
          }, endtime);
          break;
      }

    } else if (typeof to_url == 'function') {
      setTimeout(function () {
        to_url && to_url();
      }, endtime);
    } else {
      //没有提示时跳转不延迟
      setTimeout(function () {
        wx.navigateTo({
          url: to_url,
        })
      }, title ? endtime : 0);
    }
  }
}
/*
* 合并数组
*/
const SplitArray = function (list, sp) {
  if (typeof list != 'object') return [];
  if (sp === undefined) sp = [];
  for (var i = 0; i < list.length; i++) {
    sp.push(list[i]);
  }
  return sp;
}
function showLoading(message) {
  if (wx.showLoading) {
    // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
    wx.showLoading({
      title: message,
      mask: true
    });
  } else {
    // 低版本采用Toast兼容处理并将时间设为20秒以免自动消失
    wx.showToast({
      title: message,
      icon: 'loading',
      mask: true,
      duration: 20000
    });
  }
}
function hideLoading() {
  if (wx.hideLoading) {
    // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
    wx.hideLoading();
  } else {
    wx.hideToast();
  }
}
/**
 * 封封微信的的request
 */
let isRefreshing = true;

function request(url, data = {}, method = "GET") {
  return new Promise(function (resolve, reject) {
    showLoading('加载中...')
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
      },
      success: function (res) {
        hideLoading();
        if (res.statusCode == 200) {
          console.log(res.data)
          if (res.data.msg == "未登录") {
            console.log(res.data)
            console.log(res.data.msg)
            //需要登录后才可以操作
            let code = null;
            return login().then((res) => {
              code = res.code;
              return getUserInfo();
            }).then((userInfo) => {
              //登录远程服务器
              request(api.WxLogin, { code: code }, 'POST').then(res => {
                var user = {}
                user.openid = res.openid
                user.username = userInfo.userInfo.nickName
                user.photo = userInfo.userInfo.avatarUrl
                //微信用户登录
                request(api.WxLoginlogin, user, 'POST').then(res => {
                  if (res.code === 200) {
                    //存储用户信息
                    //存储用户信息
                    // 刷新token的函数,这需要添加一个开关，防止重复请求
                    if (isRefreshing) {
                      // wx.setStorageSync('openid', res.data.openid);
                      // wx.setStorageSync('userInfo', res.data);
                      // wx.setStorageSync('uid', res.data.uid);
                      // getApp().globalData.userInfo = wx.getStorageSync('userInfo');
                      // getApp().globalData.openid = wx.getStorageSync('openid');
                      // getApp().globalData.uid = wx.getStorageSync('uid');
                      resolve(request(url, data, method));
                    }
                    isRefreshing = false;
                  } else {
                    reject(res);
                  }
                })
              }).catch((err) => {
                reject(err);
              });
            }).catch((err) => {
              reject(err);
            })
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        hideLoading();
        reject(err)
        console.log("failed")
      }
    })
  });
}
function pageScrollTo() {
  if (wx.pageScrollTo) {
    wx.pageScrollTo({
      scrollTop: 0
    })
  }
}
// 获取窗口高度
function WindowHeight(that) {
  wx.getSystemInfo({
    success: (res) => {
      console.log(res)
      that.setData({
        windowHeight: res.windowHeight
      })
    }
  })
}
/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}
function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('openid')) {
      checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });

    } else {
      reject(false);
    }
  });
}//试吃 产品二维码
// var shichiObject = {
//   bgImages: '../../images/cx_banner.png',
//   codeImage: '../../images/wx_login.png',
//   name: '小程序名称',
//   explain: '分享即获得积分',
// }
const ShichiCanvas = (shichiObject, successFn) => {
  showLoading('海报生成中');

  const ctx = wx.createCanvasContext('myCanvasShichi');

  var wh = wx.createSelectorQuery().select('#myCanvasShichi').boundingClientRect(function (rect) {
    const WIDTH = rect.width
    const HEIGHT = rect.height
    const BEI = 2
    console.log(shichiObject.bgImages)
    console.log(shichiObject)

    ctx.setFillStyle('#fff');
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.drawImage(shichiObject.bgImages, 0, 0, WIDTH, WIDTH);
    ctx.drawImage(shichiObject.codeImage, 54, HEIGHT - 80 * BEI, 63 * BEI, 63 * BEI);

    const CONTENT_ROW_LENGTH = 35;
    let [contentLeng, contentArray, contentRows] = textByteLength(shichiObject.title, CONTENT_ROW_LENGTH);

    ctx.setTextAlign('center');
    ctx.setFillStyle('#1E232A');

    ctx.setFontSize(30);
    let contentHh = 30 * 1.3;

    console.log(contentArray)
    for (let m = 0; m < contentArray.length; m++) {
      if (contentArray.length > 1) {
        ctx.setFontSize(26);
        contentHh = 26 * 1.3;
      }
      ctx.fillText(contentArray[m], WIDTH / 2, WIDTH + contentHh * m + 51);
    }
    ctx.setTextAlign('center')
    ctx.setFillStyle('#999999');
    ctx.setFontSize(24);
    if (contentArray.length > 1) {
      ctx.fillText(shichiObject.desc, WIDTH / 2, 85 + WIDTH + contentHh, WIDTH - 30);
    } else {
      ctx.fillText(shichiObject.desc, WIDTH / 2, 55 + WIDTH + contentHh, WIDTH - 30);

    }

    let xuxian = WIDTH + 115
    ctx.setStrokeStyle('#9E9E9E')
    ctx.setLineDash([10, 14], 2)
    ctx.beginPath()
    ctx.moveTo(32, xuxian)
    ctx.lineTo(WIDTH - 32, xuxian)
    ctx.stroke()
    // ctx.drawImage(arr2[2], 138, HEIGHT - 155, 126, 126);
    ctx.setTextAlign('left')

    ctx.setFillStyle('#000000');
    ctx.setFontSize(14 * BEI);
    ctx.fillText(shichiObject.name, WIDTH / 3+10, HEIGHT - 48 * BEI);
    ctx.setFillStyle('#9A979B');
    ctx.setFontSize(12 * BEI);
    ctx.fillText(shichiObject.explain, WIDTH / 3+10,HEIGHT - 30 * BEI);
    ctx.draw(true, function () {
      wx.canvasToTempFilePath({
        canvasId: 'myCanvasShichi',
        fileType: 'png',
        destWidth: WIDTH,
        destHeight: HEIGHT,
        success: function (res) {
          hideLoading();
          successFn && successFn(res.tempFilePath);
        },
        fail: function (res) {
          hideLoading();
          wx.showToast({
            title: '海报生成失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    })
  }).exec()
}
/**
 * 生成海报获取文字
 * @param string text 为传入的文本
 * @param int num 为单行显示的字节长度
 * @return array 
 */
const textByteLength = (text, num) => {
  let strLength = 0;
  let rows = 1;
  let str = 0;
  let arr = [];
  for (let j = 0; j < text.length; j++) {
    if (text.charCodeAt(j) > 255) {
      strLength += 2;
      if (strLength > rows * num) {
        strLength++;
        arr.push(text.slice(str, j));
        str = j;
        rows++;
      }
    } else {
      strLength++;
      if (strLength > rows * num) {
        arr.push(text.slice(str, j));
        str = j;
        rows++;
      }
    }
  }
  arr.push(text.slice(str, text.length));
  return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
}


function PageCoupon() {
  let that = this;
  request(api.PageCoupon, { }, 'post').then(function (res) {
   if(res.code===200){
     console.log()
     getApp().globalData.couponBanner = res.data

   }
  });
}
module.exports = {
  get_wxml,
  Tips,
  SplitArray,
  showLoading,
  hideLoading,
  request,
  pageScrollTo,
  WindowHeight,
  checkSession,
  checkLogin, ShichiCanvas, textByteLength, PageCoupon
}


