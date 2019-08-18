const app = getApp()
Component({
  properties: {
    navbarData: {   //navbarData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { }
    }
  },
  data: {
    height: '',
    //默认值  默认显示左上角
    navbarData: {
      showCapsule: 1
    }
  },
  attached: function () {
    // 定义导航栏的高度   方便对齐
    this.setData({
      share: app.globalData.share,
      height: app.globalData.height
    })
  },
  methods: {
    // 返回上一页面
    _navback() {
      if (this.data.share){
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }else{
        let pages = getCurrentPages();
        if (pages.length > 1) {
          wx.navigateBack({})
        } else {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
      }
    },
    _navbackCart() {
        wx.navigateTo({
          url: '/pages/cart/index',
        })
    },
  }
}) 