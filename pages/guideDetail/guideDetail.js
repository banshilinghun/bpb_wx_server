// pages/guideDetail/guideDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guideList: [],
    swiperHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let imageSrc = JSON.parse(options.imageSrc);
    this.setData({
      guideList: imageSrc
    });
    
    wx.setNavigationBarTitle({
      title: options.title,
    })
  },

  previewImage: function(e){
    console.log(e);
  }

})