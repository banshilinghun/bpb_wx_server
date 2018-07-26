
const apiManager = require('../../utils/api/ApiManager.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cellList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  onShow: function(){
    let that = this;
    let requestInfo = {};
    requestInfo.url = apiManager.getGuideUrl();
    requestInfo.success = res => {
      console.log(res);
      let list = [];
      res.forEach(element => {
        console.log(element);
        //过滤为空的数据
        if (!element.imgs || element.length === 0) {
          return;
        }
        element.cellTitle = element.name;
        list.push(element);
      });
      that.setData({
        cellList: list
      })
    };
    apiManager.sendRequest(new apiManager.requestInfo(requestInfo));
  },

  navigateListener: function(event){
    console.log(event);
    wx.navigateTo({
      url: '../guideDetail/guideDetail?imageSrc=' + JSON.stringify(event.detail.cell.imgs) + '&title=' + event.detail.cell.cellTitle
    })
  }
})