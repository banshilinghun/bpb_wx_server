let timer;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    designList: [{
        title: '设计效果1',
        effect: [{
          src: 'https://images.unsplash.com/photo-1448376561459-dbe8868fa34c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=361907f0deaaf183ac4ce6b62551dfb3&auto=format&fit=crop&w=800&q=60',
          type: '车身左侧效果'
        }, {
          src: 'https://images.unsplash.com/photo-1494260629490-28c1e8e6f388?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=886e20939894ef5dafc54e0cf0cae59d&auto=format&fit=crop&w=800&q=60',
          type: '车身左侧效果'
        }, {
          src: 'https://images.unsplash.com/photo-1497350166004-48ec9adb78bb?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=fdfe84a326fba9000c444d1ab73d7d18&auto=format&fit=crop&w=800&q=60',
          type: '车身左侧效果'
        }]
      },
      {
        title: '设计效果2',
        effect: [{
          src: 'https://images.unsplash.com/photo-1515052945961-bbb80118b74b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e24e067ea99c9f433d838baae5bdfa13&auto=format&fit=crop&w=800&q=60',
          type: '车身左侧效果'
        }, {
          src: 'https://images.unsplash.com/photo-1486016006115-74a41448aea2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=55cc23bc93a290d1cb4c651856d28c7a&auto=format&fit=crop&w=800&q=60',
          type: '车身左侧效果'
        }, {
          src: 'https://images.unsplash.com/photo-1497202379478-3998ceb0b40c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=63a774d57b88b71b2a24fb479536e3f5&auto=format&fit=crop&w=800&q=60',
          type: '车身左侧效果'
        }]
      }
    ],
    scrollHeight: 0,
    isInstall: false,
    startTime: 0, //计时开始时间
    time_process: '00:00',
    minute: 0,
    second: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight - 60
        })
      }
    });
  },

  handleInstall() {
    let that = this
    if (!that.data.isInstall) {
      that.startinstall();
    } else {
      that.endInstall();
    }
  },

  /**
   * 开始安装
   */
  startinstall() {
    let that = this;
    that.setData({
      isInstall: true
    });
    //开始计时
    let start_time = that.data.startTime;
    timer = setInterval(() => {
      start_time++;
      let minute = Math.floor(start_time / 60);
      let second = start_time % 60;
      console.log(minute);
      console.log(second);
      that.setData({
        minute: minute,
        second: second,
        time_process: that.fixedTwoNumber(minute) + ":" + that.fixedTwoNumber(second)
      })
    }, 1000);
  },

  /**
   * 取两位
   */
  fixedTwoNumber(param) {
    return String(param).length <= 1 ? "0" + param : param;
  },

  /**
   * 结束安装
   */
  endInstall() {
    let that = this;
    clearInterval(timer);
    setTimeout(() => {
      let totalInstallTip = '本次安装共用时: ' + that.data.minute + '分' + that.data.second + '秒，超过80%的安装次数，继续加油！'
      wx.showModal({
        title: '提示',
        content: totalInstallTip,
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: '#ff555c',
        success: res => {

        }
      });
    }, 1000);
  }

})