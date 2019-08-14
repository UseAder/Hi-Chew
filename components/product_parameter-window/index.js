var app = getApp();
Component({
  properties: {
    window:{
      type: Boolean,
      value: true,
    },
    productSarameter: {
      type: Object,
      value: []
    },
  },
  data: {
  },
  attached: function () {
  
  },
  methods: {
    close:function(){
      this.triggerEvent('onColse');
    }
  }
})