
var app = getApp();
const apiManager = require('../../utils/api/ApiManager.js');
const ApiConst = require('../../utils/api/ApiConst');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listInfo: [],
    count: 0
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
      count: options.count
    })
    this.requestList(options.ad_id, options.type);
  },

  /**
   * 激活检测列表
   */
  requestList: function (adId, listType) {
    var inst = this;
    inst.showLoadingView();
    wx.request({
      url: listType == 'active' ? ApiConst.QUERY_SERVER_AD_REGIST_URL : '',
      data: {
        server_id: app.globalData.server_id,
        ad_id: adId
      },
      success: function (res) {
        console.log(res)
        var dataBean = res.data.data;
        for (var key in dataBean) {
          var item = dataBean[key];
          if (item.regist_date) {
            item.subscribeTime = '登记时间：' + item.regist_date;
          } else {
            item.subscribeTime = '';
          }
        }
        inst.setData({
          listInfo: dataBean,
          showEmpty: !dataBean || dataBean.length == 0 ? true : false
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

  showLoadingView: function () {
    wx.showLoading({
      title: '奔跑中...',
    })
  },

  hideLoadingView: function () {
    wx.hideLoading();
  },

})