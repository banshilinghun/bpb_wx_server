var util = require("../../utils/util.js");
const ApiManager = require('../../utils/api/ApiManager.js');
const ApiConst = require('../../utils/api/ApiConst');
const app = getApp();
var sourceType = [
  ['camera'],
  ['album'],
  ['camera', 'album']
]
var sizeType = [
  ['compressed'],
  ['original'],
  ['compressed', 'original']
]

Page({
  data: {

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
    disabled: true,

    //new
    scrollHeight: 0,
    subscribeCount: 0,
    queueCount: 0,
    signCount: 0,
    finishCount: 0,
    scrollHeight: 0,
    reserveList: [],
    visiblePlate: true,
    switchStr: '手机号'
   },

  onLoad: function() {
    let that = this;
    //检测更新
    that.checkUpdate();
    //设置滚动高度
    wx.getSystemInfo({
      success: function(res) {
        let query = wx.createSelectorQuery();
        //选择id
        query.select('#header').boundingClientRect(function (rect) {
          that.setData({
            scrollHeight: res.windowHeight - rect.height
          })
          console.log(rect.height)
        }).exec();
      }
    })
  },

  onShow: function() {
    var that = this;
    that.setData({
      flag: false
    });
    //加载今日数据
    that.getTodayList("");
    //初始化键盘相关数据
    if (that.data.keyboard1 instanceof Array) {
      return;
    }
    //将keyboard1和keyboard2中的所有字符串拆分成一个一个字组成的数组
    that.data.keyboard1 = that.data.keyboard1.split('');
    that.data.keyboard2 = that.data.keyboard2.split('');
    that.setData({
      keyboardValue: that.data.keyboard1
    });
  },

  tapSpecBtn: function() {
    this.hideKeyboard();
  },

  previewImage: function(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },

  checkCarCode: function(code) {
    var carcode = code;
    if (util.isVehicleNumber(carcode)) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '输入的车牌号不合法'
      });
      return false;
    }
  },

  /**
   * 登记检测
   */
  actionClick: function() {
    var that = this;
      wx.redirectTo({
        url: '../photoAudit/photoAudit?user_id=' + that.data.user_id + '&ad_id=' + that.data.ad_id + '&check_id=' + that.data.check_id + '&time_id=' + that.data.time_id + '&ad_type=' + that.data.ad_type
      });
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
      self.getTodayList(self.data.textValue);
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
    self.getTodayList(self.data.textValue);
  },

  getTodayList: function(params) {
    const that = this;
    let requestData = {
      url: ApiConst.GET_TODAY_RESERVE_LIST,
      data: {
        filter_name: params
      },
      success: res => {
        that.setData({
          reserveList: res
        })
        that.resolveClassify(res);
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
  },

  resolveClassify(res){
    let subscribe = this.data.reserveList.filter(this.subscribeFilter);
    let signed = this.data.reserveList.filter(this.signedFilter);
    let installed = this.data.reserveList.filter(this.installedFilter);
    this.setData({
      subscribeCount: this.data.reserveList.length,
      queueCount: signed.length,
      signCount: signed.length + installed.length,
      finishCount: installed.length
    })
  },

  subscribeFilter(element){
    return element.status == 0;
  },

  signedFilter(element){
    return element.status == 1;
  },

  installedFilter(element){
    return element.status == 2;
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

  showKeyboard: function() {
    var self = this;
    self.setData({
      isKeyboard: true
    });
  },

  /**
   * 查看任务详情
   */
  handleDetail(event){
    wx.navigateTo({
      url: '../detail/detail?reserve_id=' + event.currentTarget.dataset.item.reserve_id,
    })
  },

  handleMaskClick(){
    this.hideKeyboard();
  },

  hanldePhoneInput(event){
    let that = this;
    console.log(event);
    let value = event.detail.value;
    that.setData({
      textValue: value
    })
    that.getTodayList(value);
  },

  /**
   * 清除搜索内容
   */
  handleClear(){
    let that = this;
    that.setData({
      textValue: '',
      textArr: [],
      specialBtn: false,
      tapNum: false,
      keyboardValue: that.data.keyboard1
    })
    that.getTodayList(that.data.textValue);
  },

  handleSwitch(){
    this.setData({
      switchStr: this.data.visiblePlate ? '车牌号' : '手机号',
      visiblePlate: !this.data.visiblePlate,
      textValue: ''
    })
    this.getTodayList(this.data.textValue);
  },

  /**
   * 版本更新
   */
  checkUpdate: function() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate);
      })

      updateManager.onUpdateReady(function() {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，即刻体验？',
          success: function(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          }
        })
      })

      updateManager.onUpdateFailed(function() {
        // 新的版本下载失败
      })
    }
  },
});