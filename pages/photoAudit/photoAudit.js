
const apiManager = require('../../utils/api/ApiManager.js');
const ApiConst = require('../../utils/api/ApiConst');
const app = getApp();
var sourceType = [
  ['camera'],
  ['album'],
  ['camera', 'album']
];
var sizeType = [
  ['compressed'],
  ['original'],
  ['compressed', 'original']
];
//登记和检测
var typeArray = ['REGISTER', 'CHECK'];
//车尾，车内，左侧，右侧
var uploadType = ['front_img', 'in_img', 'left_img', 'right_img'];
//adType 3:车内+车外 4:车外
let carEnd = { title: '车尾照片', placeType: 'front_img', showLoading: false, remark: '注：必须同时拍到广告画面和车牌', showPlaceholder: true, emptyTip: '请拍摄车辆正面照片' };
let carInner = { title: '车内照片', placeType: 'in_img', showLoading: false, remark: '注：必须同时拍到两个车内广告画面', showPlaceholder: true, emptyTip: '请拍摄车内照片' };
let carLeft = { title: '车身左侧', placeType: 'left_img', showLoading: false, remark: '注：以车辆左侧拍摄', showPlaceholder: true, emptyTip: '请拍摄车身左侧照片' };
let carRight = { title: '车身右侧', placeType: 'right_img', showLoading: false, remark: '注：以车辆右侧拍摄', showPlaceholder: true, emptyTip: '请拍摄车身右侧照片' };

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    btnLoading: false,
    auditBtnBgBgColor: '#ff555c',
    auditBtnText: '提交',
    typeValue: 1,
    user_id: '',
    ad_id: '',
    server_id: '',
    //检测的时候上传
    check_id: '',
    //预约上传
    time_id: '',
    carPhotoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var typeIntent = options.typeValue;
    if (typeIntent == typeArray[0]) {
      this.setData({
        typeValue: 1
      })
    } else if (typeIntent == typeArray[1]) {
      this.setData({
        typeValue: 2
      })
    }
    //初始化数组
    console.log('ad_type------>' + options.ad_type);
    let list = this.data.carPhotoList;
    if (options.ad_type == 3){
      list.push(carEnd);
      list.push(carInner);
      list.push(carLeft);
      list.push(carRight);
    } else if (options.ad_type == 4){
      list.push(carEnd);
      list.push(carLeft);
      list.push(carRight);
    } else {
      list.push(carEnd);
      list.push(carInner);
      list.push(carLeft);
      list.push(carRight);
    }
    this.setData({
      user_id: options.user_id,
      ad_id: options.ad_id,
      check_id: options.check_id,
      time_id: options.time_id,
      server_id: app.globalData.server_id,
      carPhotoList: list
    })
  },

  /**
   * 选择图片
   */
  chooseImage: function (params) {
    let index = params.currentTarget.dataset.index;
    let name = params.currentTarget.dataset.id;
    console.log('name------->'+ name);
    let that = this;
    wx.chooseImage({
      sourceType: sourceType[0],
      sizeType: sizeType[0],
      count: 1,
      success: function (res) {
        console.log(res)
        //上传图片
        that.showLoadingView(index);
        that.uploadImage(res.tempFilePaths[0], index, name);
      }
    })
  },

  showLoadingView: function (index) {
    var that = this;
    let list = that.data.carPhotoList;
    for(let i = 0; i< list.length; i++){
      if(i == index){
        list[index].showLoading = true;
      }
    }
    that.setData({
      carPhotoList: list
    })
  },

  /**
   * 上传图片
   */
  uploadImage: function (filePath, index, filename) {
    console.log('uploadImage-------->' + index);
    console.log('uploadImage---filename----->' + filename);
    var that = this;
    if (filePath == undefined || filePath == '') {
      return;
    } else {
      wx.uploadFile({
        url: ApiConst.GET_UPLOAD_URL,
        filePath: filePath,
        name: filename,
        formData: {
          user_id: that.data.user_id,
          ad_id: that.data.ad_id,
          server_id: that.data.server_id,
          type: that.data.typeValue,
          check_id: that.data.check_id,
        },
        success: function (res) {
          console.log(res)
          var resdata = JSON.parse(res.data);
          if (resdata.code == 1000) {
            that.loadImageSrc(filePath, index);
          } else {
            wx.showModal({
              content: res.data.msg || '服务器开小差了~\n~~~~(>_<)~~~~',
              showCancel: false
            })
          }
        },
        fail: function(res){
          wx.showModal({
            content: '服务器开小差了~\n~~~~(>_<)~~~~',
            showCancel: false
          })
        },
        complete: function(res){
          that.hideLoadingView(index)
        }
      })
    }
  },

  /**
   * 上传成功后才设置图片
   */
  loadImageSrc: function (filePath, index) {
    var that = this;
    let list = that.data.carPhotoList;
    for (let i = 0; i < list.length; i++) {
      if (i == index) {
        list[index].showPlaceholder = false;
        list[index].imageSrc = filePath;
      }
    }
    that.setData({
      carPhotoList: list
    })
  },

  hideLoadingView: function (index) {
    var that = this;
    let list = that.data.carPhotoList;
    for (let i = 0; i < list.length; i++) {
      if (i == index) {
        list[index].showLoading = false;
      }
    }
    that.setData({
      carPhotoList: list
    })
  },

  /**
   * 提交审核
   */
  commitAudit: function () {
    var that = this
    let list = that.data.carPhotoList;
    for (let i = 0; i < list.length; i++) {
      if (!that.checkImage(list[i].imageSrc, list[i].emptyTip)) {
        return;
      }
    }
    that.redirectTo();
  },

  redirectTo: function () {
    var that = this;
    var typeValue = that.data.typeValue;
    if (typeValue == 1) {
      that.sendRequest();
    } else if (typeValue == 2) {
      wx.redirectTo({
        url: '../inspect/inspect?user_id=' + that.data.user_id + '&ad_id=' + that.data.ad_id + '&server_id=' + that.data.server_id + '&check_id=' + that.data.check_id + '&flag=' + 1,
      })
    }
  },

  /**
   * 发起请求
   */
  sendRequest: function () {
    var that = this;
    that.setCommitStatus();
    var requestData = {};
    requestData.user_id = that.data.user_id;
    requestData.ad_id = that.data.ad_id;
    requestData.server_id = that.data.server_id;
    requestData.time_id = that.data.time_id;
    wx.request({
      url: ApiConst.GET_CONFIRM_URL,
      data: requestData,
      success: function (res) {
        if (res.data.code == 1000) {
          wx.showToast({
            title: "提交成功"
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../register/register',
            })
          }, 1000);
        } else {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg? res.data.msg : '网络错误'
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '网络错误'
        });
      },
      complete: function () {
        that.changeCommitStatus();
      },
    })
  },

  setCommitStatus: function () {
    this.setData({
      auditBtnText: "提交中",
      disabled: !this.data.disabled,
      auditBtnBgBgColor: "#999",
      btnLoading: !this.data.btnLoading
    })
  },

  changeCommitStatus: function () {
    this.setData({
      auditBtnText: "提交",
      disabled: !this.data.disabled,
      auditBtnBgBgColor: "#ff555c",
      btnLoading: !this.data.btnLoading
    })
  },

  checkImage: function (imageSrc, tipsContent) {
    if (imageSrc == '' || imageSrc == undefined || imageSrc == null) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: tipsContent
      });
      return false;
    }
    return true;
  },

  //关闭页面
  closePage: function () {
    wx.showModal({
      title: '提示',
      content: '确定要返回首页吗',
      success: function (res) {
        if (res.confirm) {
          wx.switchTab({
            url: '../register/register',
          })
        } else {
          //do nothing
        }
      }
    })
  },

})