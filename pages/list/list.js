
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
    carList: [{ name: '已预约', value: 0 }, { name: '已签到', value: 1 }, { name: '已完成', value: 2 }],
    listInfo: [],
    usePlate: true, //使用车牌号查询还是手机号查询
    cellList: [],
    subNumber: 1,
    signNumber: 0,
    finishNumber: 0,
    avgTime: '00:00',
    switchStr: '手机号',
    rootList: [{
      date: '2018-7-30', insideList: [{
        logo: 'https://images.unsplash.com/photo-1518889735218-3e3a03fd3128?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=fc2f58b2cffc18635231617b6a03179c&auto=format&fit=crop&w=800&q=60',
        adName: '来啊，奔跑吧',
        username: '那你知道',
        phone: '1818829289',
        plate: '粤B123456',
        sub_time: '11:00~12:00',
        status: 0
      }]
    }, {
        date: '2018-7-30', insideList: [{
          logo: 'https://images.unsplash.com/photo-1518889735218-3e3a03fd3128?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=fc2f58b2cffc18635231617b6a03179c&auto=format&fit=crop&w=800&q=60',
          adName: '来啊，奔跑吧',
          username: '那你知道',
          phone: '1818829289',
          plate: '粤B123456',
          sub_time: '11:00~12:00',
          status: 0
        }]
      }]
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
      inst.getActiveAdList();
    }else if(value == 2){
      inst.getInspectAdList();
    }
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
  getActiveAdList: function(){
    let that = this;
    that.showLoadingView();
    let requestParams = {};
    requestParams.url = apiManager.queryRegistStatisticInfoUrl();
    requestParams.data = {
      server_id: app.globalData.server_id
    }
    requestParams.success = res => {
      console.log(res);
      that.setData({
        cellList: []
      })
      if (res && res.length > 0) {
        res.forEach(element => {
          element.cellTitle = element.name;
          element.remark = '已激活' + element.count + '辆';
          element.type = 'active';
        });
        console.log(res);
        that.setData({
          cellList: res
        })
      }
    };
    requestParams.complete = res =>{
      that.hideLoadingView();
    };
    apiManager.sendRequest(new apiManager.requestInfo(requestParams));
  },

  /**
   * 广告检测列表
   */
  getInspectAdList: function () {
    var inst = this;
    inst.showLoadingView();
    wx.request({
      url: apiManager.queryServerAdCheckUrl(),
      data: {
        server_id: app.globalData.server_id
      },
      success: function (res) {
        console.log(res)
        var dataBean = res.data.data;
        for (var key in dataBean) {
          var item = dataBean[key];
          if (item.check_date) {
            item.subscribeTime = '检测时间：' + item.check_date;
          } else {
            item.subscribeTime = '';
          }
        }
        inst.setData({
          listInfo: dataBean
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

  onPullDownRefresh: function () {
    var that = this;
    var index = that.data.index;
    if(index == 0){
      that.getSubscribeList();
    }else if(index == 1){
      that.getActiveAdList();
    }else if(index == 2){
      that.getInspectAdList();
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

  navigateListener: function(event){
    console.log(event);
    wx.navigateTo({
      url: '../listSort/listSort?title=' + event.detail.cell.cellTitle + '&count=' + event.detail.cell.count + '&ad_id=' + event.detail.cell.ad_id + '&type=' + event.detail.cell.type,
    })
  },

  callPhoneListener: function(event){
    console.log(event);
    wx.makePhoneCall({
      phoneNumber: event.detail.phone
    })
  },

  handleSwitchSearch(){
    let that = this;
    let usePlate = that.data.usePlate;
    if(usePlate){
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
  }
})