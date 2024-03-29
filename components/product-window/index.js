var app = getApp();
Component({
  properties: {
    attribute: {
      type: Object,
      value:{}
    },
    attrList:{
      type: Object,
      value:[],
    },
    productAttr:{
      type: Object,
      value: [],
    },
    productSelect:{
      type: Object,
      value: {
        image: '',
        store_name: '',
        price: 0,
        unique: '',
        stock:0,
      }
    },
  },
  data: {
    attrValue:[],
    attrIndex:0,
     ImageUrl : 'https://abc.ufcoux.com/Adult/public'

  },
  attached: function () {
  },
  methods: {
    close: function () {
      this.triggerEvent('myevent', {'window': false});
    },
    confirmClose: function () {
      this.triggerEvent('ConfirmClose', false);
    },
    CartNumDes:function(){
      this.triggerEvent('ChangeCartNum', false);
    },
    CartNumInt:function(){
      this.triggerEvent('ChangeCartNum', true);
    },
    tapAttr:function(e){
      //父级index
      var indexw = e.currentTarget.dataset.indexw;
      //子集index
      var indexn = e.currentTarget.dataset.indexn;
      //每次点击获得的属性
      var attr = this.data.productAttr[indexw].spec_list[indexn].id;
      //设置当前点击属性
      this.data.productAttr[indexw].checked = attr;
      this.setData({
        productAttr: this.data.productAttr,
      });
      var value = this.getCheckedValue().join('_');
      this.triggerEvent('ChangeAttr',value);
    },
    getCheckedValue: function () {
      return this.data.productAttr.map(function (attr) {
        return attr.checked;
      });
    },
    ResetAttr:function(){
      for (var k in this.data.productAttr) this.data.productAttr[k].checked='';
      this.setData({ productAttr: this.data.productAttr});
    },
  }
})