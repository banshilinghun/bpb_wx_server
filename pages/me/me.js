// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    helpCells: [{
      icon: '../../image/course.png',
      text: '安装教程',
      visible: true,
      type: 'guide',
      url: '../guide/guide'
    }],
    dayCount: 20,
    totalCount: 1000,
    avgTime: '10:00分',
    serverName: '奔跑宝'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  handleAction(event) {
    console.log(event);
    let item = event.currentTarget.dataset.item;
    switch (item.type) {
      case 'guide':
        wx.navigateTo({
          url: item.url,
        })
        break;
      default:
        break;
    }
  },

  switchAccount: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要退出当前账号吗？',
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '../login/login',
          })
        } else if (res.cancel) {
        }
      },
    })
  },

})