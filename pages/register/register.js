var util = require("../../utils/util.js");
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
var typeArray = ['REGISTER', 'CHECK'];
//标识全租还是普通
var normal = 1;
var lease = 2;

//0 隐藏，1 显示普通数据，2显示全租数据
var flagArray = [0, 1, 2];

Page({
  data: {
    searchUrl: app.globalData.baseUrl + 'server/query/user_info',
    plate_no: "",
    textTips: "在搜索框内输入车牌号查询",
    sta: -1,
    userName: '',
    adInfo: '',
    appointment_time: '',
    actionText: '激活广告',
    //判断登记还是检测(登记REGIST 检测CHECK)
    typeValue: typeArray[0],
    showTime: true,
    user_id: '',
    ad_id: '',
    check_id: '',
    time_id: '',
    date: '',
    begin_time: '',
    end_time: '',

    //键盘
    isKeyboard: false, //是否显示键盘
    specialBtn: false,
    tapNum: false, //数字键盘是否可以点击
    keyboardNumber: '1234567890',
    keyboardAlph: 'QWERTYUIOPASDFGHJKL巛ZXCVBNM',
    keyboard1:
    '京津沪冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁渝',
    keyboardValue: '',
    keyboard2: '',
    keyboard2For: ['完成'],
    textArr: [],
    textValue: '',
    isFocus: false, //输入框聚焦
    disabled: true,

    //全租
    car_id: '',
    idList: [],
    nameList: [],
    sourceTypeIndex: '',
    flag: '',
    carFlag: flagArray[0],
    leaseName: '',
  },

  onLoad: function(){
    //检测更新
    this.checkUpdate();
  },

  onReady: function () {

  },

  onShow: function () {
    var self = this;
    self.setData({
      flag: false
    });
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

  tapSpecBtn: function () {
    this.hideKeyboard();
  },

  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },

  checkCarCode: function (code) {
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

  setAdCheckInfo: function () {
    var that = this;
    var typeValue = that.data.typeValue;
    if (typeValue == typeArray[0]) {
      this.setData({
        actionText: '激活广告',
        showTime: true,
        textTips: "该车辆需激活广告",
        appointment_time: that.data.date + "  " + that.data.begin_time + '~' + that.data.end_time,
      })
    } else if (typeValue = typeArray[1]) {
      this.setData({
        actionText: '检测广告',
        showTime: false,
        textTips: "该车辆需检测广告",
      })
    }
  },

  actionClick: function () {
    var that = this;
    if (that.data.flag == normal) {
      wx.redirectTo({
        url: '../photoAudit/photoAudit?typeValue=' + that.data.typeValue + '&user_id=' + that.data.user_id + '&ad_id=' + that.data.ad_id + '&check_id=' + that.data.check_id + '&time_id=' + that.data.time_id,
      });
    } else if (that.data.flag == lease) {
      var adId = that.data.idList[that.data.sourceTypeIndex];
      console.log('adId--------------->' + adId);
      if (adId == '' || adId == undefined) {
        wx.showModal({
          title: '提示',
          content: '请选择广告',
          showCancel: false,
        })
        return false;
      }
      wx.redirectTo({
        url: '../leasePhotoAudit/leasePhotoAudit?typeValue=' + that.data.typeValue + '&car_id=' + that.data.car_id + '&ad_id=' + adId + '&check_id=' + that.data.check_id,
      })
    }
  },

  /**
   * 键盘相关
   */
  tapKeyboard: function (e) {
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
        //清空选择广告列表
        sourceTypeIndex: '',
        idList: [],
        nameList: [],
      });
      self.search(self.data.textValue);
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
    self.search(self.data.textValue);
  },

  search: function (params) {
    var that = this;
    var plateNo = params;
    that.setData({
      textTips: "输入的车牌号长度不合法",
      sta: 0,
      plate_no: plateNo,
      carFlag: flagArray[0],
    })
    if (plateNo.length >= 7 && plateNo.length <= 8) {
      that.setData({
        textTips: "正在查询...",
        sta: 0
      })
      wx.request({
        url: that.data.searchUrl,
        data: {
          plate_no: plateNo,
          server_id: app.globalData.server_id
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          if (res.data.code == 1000) {
            var dataBean = res.data.data;
            if (dataBean == null) {
              that.setData({
                textTips: "该车辆尚未登记广告",
                sta: 0,
                id: 0,
                carFlag: flagArray[0],
              })
            } else {
              //如果是全租
              if (dataBean.flag == lease) {
                that.setData({
                  sta: -1,
                  leaseName: dataBean.lease_company,
                  typeValue: dataBean.type,
                  carFlag: flagArray[2],
                  car_id: dataBean.car_id,
                  flag: dataBean.flag,
                })
                var idList = [];
                var nameList = [];
                for (var key in dataBean.ads) {
                  idList.push(dataBean.ads[key].ad_id);
                  nameList.push(dataBean.ads[key].ad_name);
                }
                that.setData({
                  idList: idList,
                  nameList: nameList,
                })
              } else {
                that.setData({
                  id: dataBean.user_id,
                  sta: 2,
                  userName: dataBean.real_name,
                  adInfo: dataBean.name,
                  typeValue: dataBean.type,
                  carFlag: flagArray[1],
                  user_id: dataBean.user_id,
                  ad_id: dataBean.ad_id,
                  check_id: dataBean.check_id,
                  time_id: dataBean.time_id,
                  begin_time: dataBean.begin_time,
                  end_time: dataBean.end_time,
                  date: dataBean.date,
                  flag: dataBean.flag,
                })
              }

              //填充数据
              that.setAdCheckInfo();
              that.hideKeyboard();
            }
          } else {
            that.setData({
              textTips: res.data.msg,
              carFlag: flagArray[0],
            })
          }
        },
        fail: res => {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '网络错误'
          });
          that.setData({
            textTips: "服务器出小差了...",
            sta: 0
          })
        }
      })
    }
  },

  /**
   * 点击页面隐藏键盘事件
   */
  hideKeyboard: function () {
    var self = this;
    if (self.data.isKeyboard) {
      //说明键盘是显示的，再次点击要隐藏键盘
      if (self.data.textValue) {
        self.setData({
          isKeyboard: false
        });
      } else {
        self.setData({
          isKeyboard: false,
          isFocus: false
        });
      }
    }
  },

  bindFocus: function () {
    var self = this;
    if (self.data.isKeyboard) {
      //说明键盘是显示的，再次点击要隐藏键盘
      self.setData({
        isKeyboard: false,
        isFocus: true
      });
    } else {
      //说明键盘是隐藏的，再次点击显示键盘
      self.setData({
        isFocus: true,
        isKeyboard: true
      });
    }
  },

  showKeyboard: function () {
    var self = this;
    self.setData({
      isFocus: true,
      isKeyboard: true
    });
  },

  sourceTypeChange: function (e) {
    this.setData({
      sourceTypeIndex: e.detail.value
    })
  },

  /**
   * 版本更新
   */
  checkUpdate: function () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log('onCheckForUpdate----------------->');
        console.log(res.hasUpdate);
      })

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，即刻体验？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          }
        })
      })

      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
      })
    }
  },
});