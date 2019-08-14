// var NewApiRootUrl = 'https://gr.ufcoux.com/Really/public/index.php/api/'
// var NewApiRootUrlGUORAN = 'https://openapi.yunzhangfang.com/open/api/';
var NewApiRootUrl = 'http://192.168.124.9/Adult/public/index.php/api/';
// var ImageUrl = 'https://gr-oss.oss-cn-beijing.aliyuncs.com'
var ImageUrl = 'http://192.168.124.9/Adult/public'
// var UploadFileUrl = 'https://image.poempz.com/';

module.exports = {
  ImageUrl, //图片地址
  // WxLogin: NewApiRootUrl + 'Login/', //微信换取code
  // WxLoginlogin: NewApiRootUrl + 'Login/login', //微信换取code
  // LoginPhone: NewApiRootUrl + 'Login/phone', //当前电话是否存在接口
  // LoginMessage: NewApiRootUrl + 'Login/message', //message
  // PhoneLogin: NewApiRootUrl + 'Login/phone_login', //用户登录接口


  WxLogin: NewApiRootUrl + 'Login/code', //微信换取code
  WxLoginlogin: NewApiRootUrl + 'Login/wx_login', //微信用户登录
  HotelLogin: NewApiRootUrl + 'Login/hotel_login', //分销登录接口


  IndexUrl: NewApiRootUrl + 'Page', //首页 数据接口
  PagePage: NewApiRootUrl + 'Page/page', //首页 发现好物换一批
  PageDetails: NewApiRootUrl + 'Page/details', //分类跳转分类列表
  PageDetailsPage: NewApiRootUrl + 'Page/page_details', //分类跳转分类列表

  UserAdd: NewApiRootUrl + 'User/add', //加入收藏
  UserDeleted: NewApiRootUrl + 'User/delete', //删除收藏商品
  Collect: NewApiRootUrl + 'User/collection', //我的收藏

  UserMoney: NewApiRootUrl + 'User/money', //我的佣金

  AddressList: NewApiRootUrl + 'Address', //我的地址列表
  AddressPut: NewApiRootUrl + 'Address/edit', //添加修改地址
  AddressDelete: NewApiRootUrl + 'Address/delete', //删除地址
  AddressDetails: NewApiRootUrl + 'Address/address_details', //地址详情

  // GoodsGoods: NewApiRootUrl + 'Goods/goods', //商品列表
  GoodsDetails: NewApiRootUrl + 'Goods/details', //单个商品详情




  Cart: NewApiRootUrl + 'Cart/', //购物车列表
  CartAdd: NewApiRootUrl + 'Cart/add_cart', //加入购物车
  CartNumber: NewApiRootUrl + 'Cart/cart_number', //购物车加减
  CartDelete: NewApiRootUrl + 'Cart/delete_all', //购物车删除

  Coupon: NewApiRootUrl + 'Coupon/', //优惠券列表
  ReceiveCoupon: NewApiRootUrl + 'Coupon/receive_coupon', //领取优惠券
  MyCoupon: NewApiRootUrl + 'Coupon/my_coupon', //我的优惠券
  ToUseCoupon: NewApiRootUrl + 'Coupon/to_use', //去使用优惠劵


  // OrderGm: NewApiRootUrl + 'Order/order', //单个商品支付流程

  OrderGm: NewApiRootUrl + 'Order/', //单个商品支付流程
  OrderAllGm: NewApiRootUrl + 'Order/all_order', //多个商品支付流程
  OrderBuyPay: NewApiRootUrl + 'Order/order_sn_pay', //运单支付流程
  OrderSuccess: NewApiRootUrl + 'Order/up_order', //支付成功
  // OrderDetail: NewApiRootUrl + 'Order/delite', //订单详情(订单id)
  // OrderLogistic: NewApiRootUrl + 'Order/express', //wuliu
  // OrderConfirm: NewApiRootUrl + 'Order/yes_goods', //订单确认收货
  OrderDelete: NewApiRootUrl + 'Order/false_delete', //取消订单


  Seo: NewApiRootUrl + 'Seo/', //搜索页列表
  Seoseo: NewApiRootUrl + 'seo/seo', // 搜索页列表
  SeoList: NewApiRootUrl + 'Seo/user_seo', // 搜索页列表

  OrderDan: NewApiRootUrl + 'Cart/single_order',//单个商品下单详情页
  OrderIndexAll: NewApiRootUrl + 'Cart/cart_order',//批量下单详情页

  GetOrder: NewApiRootUrl + 'User/order',//用户订单列表


};