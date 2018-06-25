
var app = getApp();
const apiManager = require('../../utils/api/ApiManager.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inspectUrl: app.globalData.baseUrl + '',
    server_id: '',
    index: 0,
    carList: [{ name: '预约列表', value: 0 }, { name: '已激活列表', value: 1 }],
    listInfo: [],
    showTime: true,
    showEmpty: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSubscribeList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  listChange: function(e){
    console.log(e);
    var inst = this;
    var value = e.detail.value;
    var that = this;
    that.setData({
      index: value,
      //重置 listInfo
      listInfo: []
    })
    if(value == 0){
      inst.getSubscribeList();
    }else if(value == 1){
      inst.getActiveList();
    }

    inst.setData({
      showTime: value == 0? true : false
    });
  },

  /**
   * 预约列表 
   */
  getSubscribeList: function(){
    var inst = this;
    inst.showLoadingView();
    wx.request({
      url: apiManager.getSubscribeUrl(),
      data:{
        server_id: app.globalData.server_id
      },
      success: function(res){
        console.log(res)
        var dataBean = res.data.data;
        for (var key in dataBean) {
          var item = dataBean[key];
          if (item.date != undefined || item.date != null) {
            item.subscribeTime = '预约时间：' + item.date + ' ' + item.begin_time + '~' + item.end_time;
          } else {
            item.subscribeTime = '';
          }
        }
        inst.setData({
          listInfo: dataBean,
          showEmpty: !dataBean || dataBean.length == 0 ? true : false,
        });
      },
      fail: function(res){
        wx.showModal({
          title: '提示',
          content: '网络错误',
          showCancel: false,
        })
      },
      complete: function(){
        inst.hideLoadingView();
      }
    })
  },

  showLoadingView: function(){
    wx.showLoading({
      title: '奔跑中...',
    })
  },

  hideLoadingView: function(){
    wx.hideLoading();
  },

  /**
   * 广告激活列表
   */
  getActiveList: function () {
    var inst = this;
    inst.showLoadingView();
    wx.request({
      url: apiManager.getActiveUrl(),
      data: {
        server_id: app.globalData.server_id
      },
      success: function (res) {
        console.log(res)
        var dataBean = res.data.data;
        for (var key in dataBean) {
          var item = dataBean[key];
          if (item.date != undefined || item.date != null){
            item.subscribeTime = '预约时间：' + item.date + ' ' + item.begin_time + '~' + item.end_time;
          }else{
            item.subscribeTime = '';
          }
        }
        inst.setData({
          listInfo: dataBean,
          showEmpty: !dataBean || dataBean.length == 0? true : false
        });
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '网络错误',
          showCancel: false,
        })
      },
      complete: function () {
        inst.hideLoadingView();
      }
    })
  },

  /**
   * 广告检测列表
   */
  getInspectsList: function () {
    var inst = this;
    wx.request({
      url: inst.data.inspectUrl,
      data: {
        server_id: app.globalData.server_id
      },
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '网络错误',
          showCancel: false,
        })
      }
    })
  },

  onPullDownRefresh: function () {
    var that = this;
    var index = that.data.index;
    if(index == 0){
      that.getSubscribeList();
    }else if(index == 1){
      that.getActiveList();
    }
    wx.stopPullDownRefresh();
  },

  switchAccount: function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要退出当前账号吗？',
      success: function(res){
        if (res.confirm) {
          wx.redirectTo({
            url: '../login/login',
          })
        }else if(res.cancel){
        }
      },
    })
  },
})