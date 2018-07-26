// pages/guideDetail/guideDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guideImageList: [],
    title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let imageSrc = JSON.parse(options.imageSrc);
    this.setData({
      guideImageList: imageSrc,
      title: options.title
    });
    
    wx.setNavigationBarTitle({
      title: '安装指南',
    })
  },

  previewImage: function(event){
    var that = this;
    console.log(event);
    let guideImageList = that.data.guideImageList;
    wx.previewImage({
      current: guideImageList[event.currentTarget.dataset.index],
      urls: guideImageList,
    })
  }

})