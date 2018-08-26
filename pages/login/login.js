var util = require("../../utils/util.js");
const app = getApp()
const ApiManager = require('../../utils/api/ApiManager.js');
const ApiConst = require('../../utils/api/ApiConst');

Page({
  data: {
    loginBtnTxt: "登录",
    loginBtnBgBgColor: "#ff555c",
    btnLoading: false,
    disabled: false,
    inputUserName: '',
    inputPassword: '',
    userInfo: app.globalData.userInfo,
    logIcon: "../../image/logIcon.png",
    pwdIcon: "../../image/pwdIcon.png",
    usernameText: '',
    passwordText: '',
  },

  onLoad: function (options) {
    //如果检测到本地存储了账号密码，直接填入
    this.getLoginInfo();
  },

  formSubmit: function (e) {
    var param = e.detail.value;
    this.mysubmit(param);
  },

  //保存账号密码
  saveLoginInfo: function (username, password) {
    try {
      wx.setStorageSync('username', username);
      wx.setStorageSync('password', password);
      console.log('保存账号密码成功')
    } catch (e) {
      console.log(e);
    }
  },

  //获取账号密码
  getLoginInfo: function () {
    try {
      var username = wx.getStorageSync('username');
      var password = wx.getStorageSync('password');
      this.setData({
        usernameText: username,
        passwordText: password,
      });
    } catch (e) {
      console.log(e);
    }
  },

  mysubmit: function (param) {
    var loginData = {};
    loginData.username = param.username.trim();
    loginData.password = param.password.trim();
    var flag = this.checkUserName(param) && this.checkPassword(param);
    var that = this;
    if (flag) {
      this.setLoginData1();
      let requestData = {
        url: ApiConst.GET_LOGIN_URL,
        data: loginData,
        success: res => {
          //保存账号和密码
          that.saveLoginInfo(loginData.username, loginData.password);
          app.globalData.header.Cookie = 'sessionid='+res.session_id;
          wx.showToast({
            title: "登录成功"
          })
          setTimeout(function () {
            that.redirectTo();
          }, 1000);
        },
        complete: res => {
          that.setLoginData2();
        }
      }
      ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
    }
  },

  setLoginData1: function () {
    this.setData({
      loginBtnTxt: "登录中",
      disabled: !this.data.disabled,
      loginBtnBgBgColor: "#999",
      btnLoading: !this.data.btnLoading
    });
  },

  setLoginData2: function () {
    this.setData({
      loginBtnTxt: "登录",
      disabled: !this.data.disabled,
      loginBtnBgBgColor: "#ff555c",
      btnLoading: !this.data.btnLoading
    });
  },

  checkUserName: function (param) {
    var inputUserName = param.username.trim();
    if (inputUserName != '' && inputUserName != null) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入账号'
      });
      return false;
    }
  },

  checkPassword: function (param) {
    var userName = param.username.trim();
    var password = param.password.trim();
    if (password.length <= 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入密码'
      });
      return false;
    } else {
      return true;
    }
  },

  redirectTo: function (param) {
    wx.switchTab({
      url: '../register/register',
    })
  }
})