var app = getApp();
Component({
  properties: {
    window:{
      type: Boolean,
      value: true,
    },
    couponList:{
      type:Array,
      value:[],
    }
  },
  data: {
  
  },
  attached: function () {
  
  },
  methods: {
    close:function(){
      this.triggerEvent('onColse');
    },
     phoneCall: function (e) {
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.replyPhone,
        success: function () {
          console.log("成功拨打电话")
        },
      })
    },
  }
})