
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //是否显示modal
    show: {
      type: Boolean,
      value: true
    },
    applyStandardName: {
      type: String,
      value: ""
    },
    
    applyRemark: {
      type: String,
      value: ""
    },
    item: {
      type: Object,
      value: ""
    },
   
    
    applyNumber: {
      type: String,
      value: ""
    },
    editApply: {
      type: Boolean,
      value: false
    },
    depStandardArr: {
      type: Array,
      value: []
    },
    windowWidth: {
      type: Number,
      value: ""
      },
      windowHeight: {
        type: Number,
        value: ""
        },
    maskHeight:{
      type: Number,
      value: ""
    },
    statusBarHeight:{
      type: Number,
      value: ""
     },
    newStandardName:{
      type: String,
      value: ""
    },
    applySubtotal:{
      type: String,
      value: ""
    },
    canSave:{
      type: Boolean,
      value: ""
    }, level: {
      type: Number,
      value: ""
      },
    
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    showInput: false,
    canSave: false,
    
  },

  /**
   * 组件的方法列表
   */
  methods: {

    showInputStandard(){
      this.setData({
        showAddStandard: true
      })
    },
    cancleStandard(){
      this.setData({
        showAddStandard: false
      })
    },

    confirmStandard(){
      console.log(this.data.newStandardName)
      if(this.data.newStandardName.length > 0){
        this.triggerEvent('confirmStandard', {
          newStandardName: this.data.newStandardName,
        })
        this.setData({
          showAddStandard: false,
          newStandardName: ""
        })
      }
    },

    
   
    clickMask() {
      this.setData({show: false,applyNumber: "",
      applyRemark: "",
      remarkContent: "",
      goodsStandard: "",
      editApply: false,})
    },

    cancle() {
      this.setData({ 
        show: false,
        applyNumber: "",
          applyRemark: "",
          remarkContent: "",
          goodsStandard: "",
          editApply: false,
        editApply:false,depStandardArr: [],
        applySubtotal: "0.0元" 
       })
      // this.triggerEvent('cancle')
    },

    confirm(e) {

      if(this.data.showAddStandard){
        wx.showModal({
          title: '有未完成操作',
          content: '请完成新规格',
          complete: (res) => {
            if (res.cancel) {
              
            }
        
            if (res.confirm) {
              
            }
          }
        })
      }else{

        if(this.data.applyNumber  > 0){
          var regex=/^[0]+/; //整数验证正则        
          var apply = "";
          if(this.data.applyNumber.indexOf(".") !== -1){
            apply = this.data.applyNumber;
          }else{
            apply = this.data.applyNumber.replace(regex, "");
          }
          this.triggerEvent('confirm', {
            applyNumber: apply ,
            applyStandardName: this.data.applyStandardName,
            applyRemark: this.data.applyRemark,
          })

          this.setData({
            show: false,
            applyNumber: "",
            applyRemark: "",
            remarkContent: "",
            goodsStandard: "",
            editApply: false,
            applySubtotal: "0.0元" 
            
          })
        }else{
          wx.showToast({
            title: '数量只能填写数字',
            icon: "none"
          })
        }
      }
    },

    standardchange: function(){
      console.log("chanst")
      var name = e.currentTarget.dataset.name;
      this.triggerEvent('changeStandard', {
        applyStandardName: name
      })
    },

   

  
    getApplyNumber: function (e) {
    
      var numberStr = this.data.applyNumber.toString();
      var y = String(numberStr).indexOf(".") ;//获取小数点的位置
      if(y !== -1){
        var count = String(numberStr).length - y;//获取小数点后的个数
      }

      if(e.detail.value > 9999 ){
        wx.showToast({
          title: '最大不能超过9999',
          icon: "none"
        })
      
        this.setData({
          applyNumber: numberStr.substring(0, numberStr.length ),
        })
        
      } else if(count > 3 || count == 3){

        wx.showToast({
          title: '小数点只能保留一位',
        })
        this.setData({
          applyNumber: numberStr.substring(0, numberStr.length - 1),
        })
      }
      
      else {
        console.log(e.detail.value+ " else lide ")
        if(e.detail.value > 0  || e.detail.value == 0){
          this.setData({
            applyNumber: e.detail.value
          })
        }else{
          wx.showToast({
            title: '只能填写数字',
            icon: 'none'
          })
          // var g
          // var reg = new RegExp("([0]*)([1-9]+[0-9]+)", "g");
          this.setData({
            applyNumber: numberStr.substring(0, numberStr.length ),
          })
        }
      }

      var onePrice = this.data.item.nxDdgOrderPrice;
      var subtotal = (Number(this.data.applyNumber) * Number(onePrice)).toFixed(1);
      this.setData({
   
        applySubtotal: subtotal

      })
    

      if(this.data.applySubtotal > 0){
        this.setData({
          canSave: true,
        })
      }else{
        this.setData({
          canSave: false
        })
      }
      console.log("thislevlelel");
      
    },

   

    addRemark: function (e) {
      if(e.detail.value.length < 15){
        this.setData({
          applyRemark: e.detail.value
        })
      }else{
        wx.showToast({
          title: '最多输入15个字符。',
          icon:  'none'
        })
        var str = this.data.applyRemark;
        this.setData({
          applyRemark: str.substring(0, e.detail.value.length)
        })
      }
    },


    changeStandard: function (e) {
      var name = e.currentTarget.dataset.name;
      this.triggerEvent('changeStandard', {
        applyStandardName: name
      })
      if(this.data.item.nxDgGoodsStandardname == this.data.applyStandardName){
        var price = this.data.item.nxDgWillPriceOne;
        var sutotal = (Number(this.data.applyNumber) * Number(price)).toFixed(1);
        this.setData({
          applySubtotal: sutotal + "元"
        })
      }else{
        this.setData({
          applySubtotal: "无"
        })
      }
    },
    

    addStanard(e){
      this.setData({
        newStandardName: e.detail.value
      })
    },

      delApply: function(){
      this.triggerEvent('delApply', {    
      })
      this.setData({
        show: false,
        applyNumber: "",
        applyRemark: "",
        remarkContent: "",
        goodsStandard: "",
        editApply: false,
        applySubtotal: "0.0元" 
        
      })
    },



    

  },
  

  
  
})
