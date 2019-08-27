/**
 * 支付相关服务
 */

const util = require('../utils/util.js');
const api = require('../config/api.js');

/**
 * 判断用户是否登录
 */
function payOrder(order) {
  return new Promise(function (resolve, reject) {
    util.request(api.OrderBuyPay, order, "POST").then(function (res) {
      wx.requestPayment({
        'timeStamp': res.timeStamp,
        'nonceStr': res.nonceStr,
        'package': res.package,
        'signType': res.signType,
        'paySign': res.paySign,
        'success': function (res) {
          // orderSuccess(order)
          resolve(res);
        },
        'fail': function (res) {
          reject(res);
        },
        'complete': function (res) {
          reject(res);
        }
      });
    });
  });
}
// function orderSuccess(order) {
//   return new Promise(function (resolve, reject) {
//     util.request(api.OrderSuccess, { order_sn: order.order_sn}, "POST").then(function (res) {
//     });
//   });
// }

module.exports = {
  payOrder
};