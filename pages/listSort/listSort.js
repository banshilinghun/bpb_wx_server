
var app = getApp();
const ApiManager = require('../../utils/api/ApiManager.js');
const ApiConst = require('../../utils/api/ApiConst');
const { $Toast } = require('../../components/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listInfo: [],
    count: 0,
    adId: '',
    switchStr: '手机号',
    visiblePlate: true,
    
    //键盘
    isKeyboard: false, //是否显示键盘
    specialBtn: false,
    tapNum: false, //数字键盘是否可以点击
    keyboardNumber: '1234567890',
    keyboardAlph: 'QWERTYUIOPASDFGHJKL巛ZXCVBNM',
    keyboard1: '京津沪冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁渝',
    keyboardValue: '',
    keyboard2: '',
    keyboard2For: ['完成'],
    textArr: [],
    textValue: '',
    disabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    wx.setNavigationBarTitle({
      title: options.title,
    });
    this.setData({
      count: options.count,
      adId: options.ad_id,
    })
    this.initView();
  },

  initView(){
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        let query = wx.createSelectorQuery();
        //选择id
        query.select('#header').boundingClientRect(function(rect) {
          that.setData({
            scrollHeight: res.windowHeight - rect.height
          })
        }).exec();
      }
    })
  },

  onShow: function(){
    this.initKeybord();
    this.requestList();
  },

  onPullDownRefresh(){
    this.requestList();
  },

  initKeybord(){
    const self = this;
    if (self.data.keyboard1 instanceof Array) {
      return;
    }
    //将keyboard1和keyboard2中的所有字符串拆分成一个一个字组成的数组
    self.data.keyboard1 = self.data.keyboard1.split('');
    self.data.keyboard2 = self.data.keyboard2.split('');
    self.setData({
      keyboardValue: self.data.keyboard1
    });
  },

  /**
   * 已完成列表
   */
  requestList: function (condition) {
    const that = this;
    let requestData = {
      url: ApiConst.INSTALL_AD_DETAIL_LIST,
      data: {
        filter_name: condition || '',
        ad_id: that.data.adId
      },
      success: res => {
        that.formatReserveList(res);
      },
      complete: res => {
        wx.stopPullDownRefresh();
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  formatReserveList(reserve){
    let reserveTempList = [];
    let keys = Object.keys(reserve);
    if(keys.length !== 0) {
      keys.forEach(element => {
        let reserveObj = {};
        reserveObj.date = element;
        reserveObj.info = reserve[element];
        reserveTempList.push(reserveObj);
      })
    }
    this.setData({
      reserveList: reserveTempList
    })
  },

  handleDetail(event){
    console.log(event);
    wx.navigateTo({
      url: '../detail/detail?reserve_id=' + event.currentTarget.dataset.item.reserve_id
    })
  },

  handleSwitchSearch() {
    let that = this;
    let usePlate = that.data.usePlate;
    if (usePlate) {
      that.setData({
        usePlate: !usePlate,
        switchStr: '车牌号'
      });
    } else {
      that.setData({
        usePlate: !usePlate,
        switchStr: '手机号'
      });
    }
  },

  /**
   * 键盘相关
   */
  tapKeyboard: function(e) {
    var self = this;
    //获取键盘点击的内容，并将内容赋值到textarea框中
    var tapIndex = e.target.dataset.index;
    var tapVal = e.target.dataset.val;
    var keyboardValue;
    var specialBtn;
    var tapNum;
    if (tapVal == '巛') {
      //说明是删除
      self.data.textArr.pop();
      if (self.data.textArr.length == 0) {
        //说明没有数据了，返回到省份选择键盘
        this.specialBtn = false;
        this.tapNum = false;
        this.keyboardValue = self.data.keyboard1;
      } else if (self.data.textArr.length == 1) {
        //只能输入字母
        this.tapNum = false;
        this.specialBtn = true;
        console.log(self.data.keyboard2)
        this.keyboardValue = self.data.keyboard2;
      } else {
        this.specialBtn = true;
        this.tapNum = true;
        this.keyboardValue = self.data.keyboard2;
      }
      self.data.textValue = self.data.textArr.join('');
      self.setData({
        textValue: self.data.textValue,
        keyboardValue: this.keyboardValue,
        specialBtn: this.specialBtn,
        tapNum: this.tapNum,
      });
      self.requestList(self.data.textValue);
      return false;
    }
    if (self.data.textArr.length >= 8) {
      return false;
    }
    self.data.textArr.push(tapVal);
    self.data.textValue = self.data.textArr.join('');
    self.setData({
      textValue: self.data.textValue,
      keyboardValue: self.data.keyboard2,
      specialBtn: true
    });
    if (self.data.textArr.length > 1) {
      //展示数字键盘
      self.setData({
        tapNum: true
      });
    }
    self.requestList(self.data.textValue);
  },

  /**
   * 输入完成
   */
  tapSpecBtn: function() {
    this.hideKeyboard();
  },

  showKeyboard() {
    var self = this;
    self.setData({
      isKeyboard: true
    });
  },

  /**
   * 点击页面隐藏键盘事件
   */
  hideKeyboard: function() {
    var self = this;
    //说明键盘是显示的，再次点击要隐藏键盘
    if (self.data.textValue) {
      // todo something

    }
    self.setData({
      isKeyboard: false
    });
  },

  handleMaskClick() {
    this.hideKeyboard();
  },

  hanldePhoneInput(event){
    let that = this;
    console.log(event);
    let value = event.detail.value;
    that.setData({
      textValue: value
    })
    that.requestList(value);
  },

  handleSwitch(){
    this.setData({
      switchStr: this.data.visiblePlate ? '车牌号' : '手机号',
      visiblePlate: !this.data.visiblePlate,
      textValue: ''
    })
    $Toast({
      content: this.data.visiblePlate? '已切换至车牌号搜索' : '已切换至手机号搜索',
      type: 'success'
    });
    this.requestList(this.data.textValue);
  },


  /**
   * 清除搜索内容
   */
  handleClear() {
    let that = this;
    that.setData({
      textValue: '',
      textArr: [],
      specialBtn: false,
      tapNum: false,
      keyboardValue: that.data.keyboard1
    })
    this.requestList(this.data.textValue);
  }

})