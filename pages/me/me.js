
const ApiManager = require('../../utils/api/ApiManager.js');
const ApiConst = require('../../utils/api/ApiConst');

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
    serverInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  onShow: function(){
    this.requestUserInfo();
  },

  requestUserInfo(){
    const that = this;
    let requestData = {
      url: ApiConst.GET_SERVER_USER_INFO,
      data: {},
      success: res => {
        if(res.avg_duration){
          let avg_duration = res.avg_duration;
          let minutes = Math.floor(avg_duration / 60);
          let seconds = avg_duration % 60;
          res.avg_duration = minutes + '分' + seconds + '秒';
        }
        that.setData({
          serverInfo: res
        })
      }
    }
    ApiManager.sendRequest(new ApiManager.requestInfo(requestData));
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