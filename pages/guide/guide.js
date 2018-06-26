
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
    let that = this;
    let requestInfo = {};
    requestInfo.url = apiManager.getGuideUrl();
    requestInfo.success = res => {
      let list = [];
      for(let cell of res){
        //过滤为空的数据
        if (!cell.course){
          return;
        }
        cell.cellTitle = cell.name;
        list.push(cell);
      }
      that.setData({
        cellList: list
      })
    };
    apiManager.sendRequest(new apiManager.requestInfo(requestInfo));
  },

  navigateListener: function(event){
    console.log(event);
    wx.navigateTo({
      url: '../guideDetail/guideDetail?imageSrc=' + event.detail.cell.course + '&title=' + event.detail.cell.cellTitle
    })
  }
})