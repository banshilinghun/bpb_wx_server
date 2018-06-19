// pages/guideDetail/guideDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageSrc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      imageSrc: options.imageSrc
    })
    wx.setNavigationBarTitle({
      title: options.title,
    })
  },

})