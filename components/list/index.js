// components/list/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listInfo:{
      type: Array,
      value: []
    },
    showTime: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    callPhone: function(event){
      console.log(event);
      if (!event.currentTarget.dataset.phone){
        return;
      }
      var myEventDetail = { phone: event.currentTarget.dataset.phone }; // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('call', myEventDetail, myEventOption);
    }
  }
})
